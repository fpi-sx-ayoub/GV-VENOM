import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { getSessionCookieOptions } from "./_core/cookies";
import type { TrpcContext } from "./_core/context";
import { hashPassword, verifyPassword, isSubscriptionValid, calculateExpiryDate } from "./auth-utils";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];
  const setCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: any) => {
        clearedCookies.push({ name, options });
      },
      cookie: (name: string, value: string, options: any) => {
        setCookies.push({ name, value, options });
      },
    } as any,
  };

  return { ctx, clearedCookies };
}

describe("VIP Authentication", () => {
  it("should hash and verify passwords correctly", () => {
    const password = "testPassword123";
    const hash = hashPassword(password);
    
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("wrongPassword", hash)).toBe(false);
  });

  it("should calculate expiry date correctly", () => {
    const days = 30;
    const expiryDate = calculateExpiryDate(days);
    const now = new Date();
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + days);
    
    expect(expiryDate.getDate()).toBe(expectedDate.getDate());
    expect(expiryDate.getMonth()).toBe(expectedDate.getMonth());
    expect(expiryDate.getFullYear()).toBe(expectedDate.getFullYear());
  });

  it("should validate subscription correctly", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    expect(isSubscriptionValid(futureDate)).toBe(true);
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(isSubscriptionValid(pastDate)).toBe(false);
  });
});

describe("Admin Logout", () => {
  it("should clear admin session cookie and report success", async () => {
    const { ctx, clearedCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe("app_session_id");
  });
});
