import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSign } from "@/app/(app)/create/actions";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { getEffectivePlan } from "@/lib/billing/plans";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/billing/plans", async () => {
  const actual = await vi.importActual<typeof import("@/lib/billing/plans")>(
    "@/lib/billing/plans",
  );
  return {
    ...actual,
    getEffectivePlan: vi.fn(),
  };
});

const buildSupabaseMock = ({
  userId = "user-1",
  count = 0,
  insertError = null,
}: {
  userId?: string | null;
  count?: number;
  insertError?: { code?: string } | null;
}) => {
  const eqMock = vi.fn(async () => ({ count, error: null }));
  const selectMock = vi.fn(() => ({ eq: eqMock }));
  const insertMock = vi.fn(async () => ({ error: insertError }));
  const fromMock = vi.fn((table: string) => {
    if (table !== "signs") throw new Error("Unexpected table");
    return {
      select: selectMock,
      insert: insertMock,
    };
  });

  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: userId ? { id: userId } : null },
        error: null,
      })),
    },
    from: fromMock,
    __mocks: { insertMock, selectMock, eqMock },
  };
};

const validInput = {
  text: "Hello",
  animation: "scroll",
  led_color: "#ff6600",
  bg_color: "#111111",
  speed: "normal",
  loop_mode: "infinite",
  restart_seconds: null,
};

describe("createSign plan enforcement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      retryAfterSeconds: 0,
    });
  });

  it("rejects unauthenticated user", async () => {
    const supabase = buildSupabaseMock({ userId: null });
    vi.mocked(createClient).mockResolvedValue(supabase as never);

    const result = await createSign(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Faça login");
    }
  });

  it("rejects non-scroll animation for free plan", async () => {
    const supabase = buildSupabaseMock({});
    vi.mocked(createClient).mockResolvedValue(supabase as never);
    vi.mocked(getEffectivePlan).mockResolvedValue({
      tier: "free",
      limits: {
        signLimit: 1,
        allowedAnimations: ["scroll"],
        showDisplayOverlay: true,
      },
    });

    const result = await createSign({ ...validInput, animation: "fade" });

    expect(result).toEqual({
      success: false,
      error: "Animação disponível apenas no plano Pro.",
    });
  });

  it("rejects second sign for free plan", async () => {
    const supabase = buildSupabaseMock({ count: 1 });
    vi.mocked(createClient).mockResolvedValue(supabase as never);
    vi.mocked(getEffectivePlan).mockResolvedValue({
      tier: "free",
      limits: {
        signLimit: 1,
        allowedAnimations: ["scroll"],
        showDisplayOverlay: true,
      },
    });

    const result = await createSign(validInput);

    expect(result).toEqual({
      success: false,
      error: "No plano grátis você pode ter apenas 1 letreiro ativo.",
    });
  });

  it("allows pro users to create with advanced animations", async () => {
    const supabase = buildSupabaseMock({ count: 7 });
    vi.mocked(createClient).mockResolvedValue(supabase as never);
    vi.mocked(getEffectivePlan).mockResolvedValue({
      tier: "pro",
      limits: {
        signLimit: null,
        allowedAnimations: null,
        showDisplayOverlay: false,
      },
    });

    const result = await createSign({ ...validInput, animation: "split-flap" });

    expect(result.success).toBe(true);
  });
});
