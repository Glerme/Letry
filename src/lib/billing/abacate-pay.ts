import { createHmac, timingSafeEqual } from 'node:crypto';
import type { BillingProductConfig } from './plans';

const BASE_URL = 'https://api.abacatepay.com';

const getApiKey = (): string => {
  const token = process.env.ABACATEPAY_API_KEY;
  if (!token) {
    throw new Error('Missing ABACATEPAY_API_KEY. Check .env.example for required keys.');
  }
  return token;
};

const getAppUrl = (): string =>
  process.env.ABACATEPAY_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const abacatePayRequest = async <TBody extends object, TResponse>(
  path: string,
  body: TBody
): Promise<TResponse> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Abacate Pay request failed (${response.status}): ${text}`);
  }

  return response.json() as Promise<TResponse>;
};

interface AbacateApiResponse<TData> {
  data: TData | null;
  error: { message?: string } | string | null;
}

const unwrapResponse = <TData>(response: AbacateApiResponse<TData>): TData => {
  if (response.error) {
    const message =
      typeof response.error === 'string' ? response.error : (response.error.message ?? 'Unknown error');
    throw new Error(`Abacate Pay request failed: ${message}`);
  }
  if (!response.data) {
    throw new Error('Abacate Pay request failed: missing data in response.');
  }
  return response.data;
};

interface CreateBillingResponse {
  id: string;
  url?: string;
}

export const createCheckout = async (
  userId: string,
  product: BillingProductConfig,
  returnTo: string
): Promise<{ checkoutUrl: string; providerReference: string }> => {
  const appUrl = getAppUrl();
  const successUrl = `${appUrl}${returnTo}`;
  const externalId = `${userId}:${product.code}:${Date.now()}`;
  const methods = product.paymentMethod === 'pix' ? ['PIX'] : ['CARD'];

  const rawResponse = await abacatePayRequest<
    object,
    AbacateApiResponse<CreateBillingResponse>
  >(
    '/v1/billing/create',
    {
      frequency: 'ONE_TIME',
      methods,
      products: [
        {
          externalId: product.code,
          name: product.title,
          description: product.title,
          quantity: 1,
          price: Math.round(product.amount * 100),
        },
      ],
      externalId,
      returnUrl: successUrl,
      completionUrl: successUrl,
    }
  );

  const response = unwrapResponse(rawResponse);
  const checkoutUrl = response.url;
  if (!checkoutUrl) {
    throw new Error('Abacate Pay did not return a checkout URL.');
  }

  return { checkoutUrl, providerReference: response.id };
};

const toBuffer = (value: string): Buffer => Buffer.from(value, 'utf8');

export const verifyWebhookSignature = (rawBody: string, signatureHeader: string | null): boolean => {
  const secret = process.env.ABACATEPAY_WEBHOOK_SECRET ?? process.env.ABACATEPAY_PUBLIC_KEY;
  if (!secret) return false;
  if (!signatureHeader) return false;

  const digest = createHmac('sha256', secret).update(Buffer.from(rawBody, 'utf8')).digest('base64');
  const incoming = signatureHeader.trim();

  const expectedBuffer = toBuffer(digest);
  const incomingBuffer = toBuffer(incoming);

  if (expectedBuffer.length !== incomingBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, incomingBuffer);
};

export interface AbacatePayCheckout {
  id: string;
  status: string;
  externalId: string | null;
}
