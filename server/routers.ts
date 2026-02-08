import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getVipUserByUsername, createVipUser, getAllVipUsers, deleteVipUser, getAdminCredentials, initializeAdminCredentials, createApiLog } from "./db";
import { hashPassword, verifyPassword, isSubscriptionValid, calculateExpiryDate } from "./auth-utils";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vip: router({
    login: publicProcedure
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const user = await getVipUserByUsername(input.username);
        if (!user) {
          await notifyOwner({
            title: "Failed VIP Login Attempt",
            content: `Failed login attempt for username: ${input.username}`,
          });
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        if (!verifyPassword(input.password, user.passwordHash)) {
          await notifyOwner({
            title: "Failed VIP Login Attempt",
            content: `Failed login attempt for username: ${input.username}`,
          });
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        if (!isSubscriptionValid(user.expiryDate)) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Subscription expired" });
        }

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("vip_session", JSON.stringify({ userId: user.id, username: user.username }), {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return {
          success: true,
          user: { id: user.id, username: user.username },
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("vip_session", { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),

    sendLikes: publicProcedure
      .input(z.object({ uid: z.string().min(1) }))
      .mutation(async ({ input }) => {
        try {
          const response = await fetch(`https://api-like-alliff-v2.vercel.app/like?uid=${encodeURIComponent(input.uid)}`);
          const data = await response.json();

          if (!response.ok) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "API request failed" });
          }

          await createApiLog({
            uid: input.uid,
            playerNickname: data.PlayerNickname,
            likesBefore: data.LikesBefore,
            likesAfter: data.LikesAfter,
            likesGiven: data.LikesGivenByAPI,
            status: data.status,
            response: JSON.stringify(data),
          });

          return {
            success: true,
            data: {
              likesAfter: data.LikesAfter,
              likesBefore: data.LikesBefore,
              likesGiven: data.LikesGivenByAPI,
              playerNickname: data.PlayerNickname,
              successfulRequests: data.SuccessfulRequests,
              totalTokensUsed: data.TotalTokensUsed,
              uid: data.UID,
              status: data.status,
              brandName: "GV VENOM",
            },
          };
        } catch (error) {
          console.error("Likes API error:", error);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send likes" });
        }
      }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const existing = await getAdminCredentials();
        if (!existing) {
          const defaultPassword = hashPassword("FPI-SX-BOT");
          await initializeAdminCredentials("FPI-SX-BOT", defaultPassword);
        }

        const admin = await getAdminCredentials();
        if (!admin || input.username !== admin.username) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        if (!verifyPassword(input.password, admin.passwordHash)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie("admin_session", "true", {
          ...cookieOptions,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie("admin_session", { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),

    getUsers: publicProcedure.query(async () => {
      const users = await getAllVipUsers();
      return users.map(u => ({
        id: u.id,
        username: u.username,
        expiryDate: u.expiryDate,
        createdAt: u.createdAt,
      }));
    }),

    addUser: publicProcedure
      .input(z.object({
        username: z.string().min(3),
        password: z.string().min(6),
        days: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        try {
          const existing = await getVipUserByUsername(input.username);
          if (existing) {
            throw new TRPCError({ code: "CONFLICT", message: "Username already exists" });
          }

          const passwordHash = hashPassword(input.password);
          const expiryDate = calculateExpiryDate(input.days);

          const newUser = await createVipUser({
            username: input.username,
            passwordHash,
            expiryDate,
          });

          await notifyOwner({
            title: "New VIP User Added",
            content: `New user created: ${input.username} with ${input.days} days subscription`,
          });

          return {
            success: true,
            user: {
              id: newUser?.id,
              username: newUser?.username,
              expiryDate: newUser?.expiryDate,
            },
          };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to add user" });
        }
      }),

    deleteUser: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        try {
          await deleteVipUser(input.id);
          return { success: true };
        } catch (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to delete user" });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
