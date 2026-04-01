import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type RateLimitWindow = `${number} s` | `${number} m` | `${number} h` | `${number} d`;

type RateLimitPolicy = {
  requests: number;
  window: RateLimitWindow;
};

export type RateLimitOperation =
  | 'auth:login'
  | 'auth:register'
  | 'signs:create'
  | 'signs:delete'
  | 'api:signs:list'
  | 'api:signs:detail'
  | 'api:og:detail';

type RequestHeaders = Pick<Headers, 'get'>;

type RateLimitCheckInput = {
  operation: RateLimitOperation;
  request?: Request;
  headersList?: RequestHeaders;
  userId?: string | null;
  keySuffix?: string;
};

export type RateLimitCheckResult = {
  success: boolean;
  retryAfterSeconds: number;
};

const RATE_LIMIT_POLICIES: Record<RateLimitOperation, RateLimitPolicy> = {
  'auth:login': { requests: 5, window: '10 m' },
  'auth:register': { requests: 3, window: '15 m' },
  'signs:create': { requests: 20, window: '1 h' },
  'signs:delete': { requests: 30, window: '1 h' },
  'api:signs:list': { requests: 120, window: '1 m' },
  'api:signs:detail': { requests: 180, window: '1 m' },
  'api:og:detail': { requests: 120, window: '1 m' },
};

const ratelimiters: Partial<Record<RateLimitOperation, Ratelimit>> = {};

let hasWarnedMissingConfig = false;

const isUpstashConfigured = () =>
  Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

const readClientIp = (headersList: RequestHeaders): string => {
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = headersList.get('x-real-ip');
  if (realIp) return realIp;

  const cfConnectingIp = headersList.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  return 'unknown';
};

const getHeaders = (input: RateLimitCheckInput): RequestHeaders | null => {
  if (input.headersList) return input.headersList;
  if (input.request) return input.request.headers;
  return null;
};

const getRatelimiter = (operation: RateLimitOperation): Ratelimit => {
  const cached = ratelimiters[operation];
  if (cached) return cached;

  const policy = RATE_LIMIT_POLICIES[operation];
  const ratelimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(policy.requests, policy.window),
    prefix: `letry:ratelimit:${operation}`,
  });

  ratelimiters[operation] = ratelimiter;
  return ratelimiter;
};

const rejectBecauseMissingConfig = (): RateLimitCheckResult => {
  if (!hasWarnedMissingConfig) {
    console.error(
      'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. Rate limiting is disabled outside production.'
    );
    hasWarnedMissingConfig = true;
  }

  if (process.env.NODE_ENV === 'production') {
    return { success: false, retryAfterSeconds: 60 };
  }

  return { success: true, retryAfterSeconds: 0 };
};

export const checkRateLimit = async (
  input: RateLimitCheckInput
): Promise<RateLimitCheckResult> => {
  if (!isUpstashConfigured()) {
    return rejectBecauseMissingConfig();
  }

  const headersList = getHeaders(input);
  const ip = headersList ? readClientIp(headersList) : 'unknown';

  const keyParts: string[] = [input.operation];
  keyParts.push(input.userId ? `user:${input.userId}` : `ip:${ip}`);
  if (input.keySuffix) keyParts.push(input.keySuffix);

  const key = keyParts.join(':');
  const ratelimit = getRatelimiter(input.operation);
  const result = await ratelimit.limit(key);

  if (result.success) return { success: true, retryAfterSeconds: 0 };

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000)
  );

  return { success: false, retryAfterSeconds };
};
