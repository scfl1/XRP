import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { hashPassword, verifyPassword } from "./auth-local";
import { sdk } from "./_core/sdk";
import { ONE_YEAR_MS } from "../shared/const.js";
import { ENV } from "./_core/env";

const requestInput = z.object({ currency: z.string().min(2).max(16), amount: z.number().positive().finite(), network: z.string().max(32).optional() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    register: publicProcedure.input(z.object({ name: z.string().trim().min(2).max(120), username: z.string().trim().min(3).max(64).regex(/^[a-zA-Z0-9_]+$/), email: z.string().trim().email().max(320), password: z.string().min(8).max(128) })).mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase();
      if (await db.getUserByEmail(email)) throw new Error("البريد الإلكتروني مستخدم بالفعل");
      if (await db.getUserByUsername(input.username)) throw new Error("اسم المستخدم مستخدم بالفعل");
      const user = await db.createLocalUser({ name: input.name, username: input.username, email, passwordHash: hashPassword(input.password) });
      if (!user) throw new Error("تعذر إنشاء الحساب");
      const token = await sdk.signSession({ openId: user.openId, appId: ENV.appId, name: user.name || user.username || "CwaAX" }, { expiresInMs: ONE_YEAR_MS });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return { token, user: { id: user.id, openId: user.openId, name: user.name, username: user.username, email: user.email, role: user.role, lastSignedIn: user.lastSignedIn } };
    }),
    login: publicProcedure.input(z.object({ identifier: z.string().trim().min(3).max(320), password: z.string().min(1).max(128) })).mutation(async ({ ctx, input }) => {
      const user = await db.getUserByEmailOrUsername(input.identifier.includes("@") ? input.identifier.toLowerCase() : input.identifier);
      if (!user || !user.passwordHash || !verifyPassword(input.password, user.passwordHash)) throw new Error("بيانات تسجيل الدخول غير صحيحة");
      await db.updateUserLastSignedIn(user.id);
      const token = await sdk.signSession({ openId: user.openId, appId: ENV.appId, name: user.name || user.username || "CwaAX" }, { expiresInMs: ONE_YEAR_MS });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ONE_YEAR_MS });
      return { token, user: { id: user.id, openId: user.openId, name: user.name, username: user.username, email: user.email, role: user.role, lastSignedIn: new Date() } };
    }),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; })
  }),
  wallet: router({
    balances: protectedProcedure.query(({ ctx }) => db.getWalletBalances(ctx.user.id)),
    transactions: protectedProcedure.query(({ ctx }) => db.listTransactions(ctx.user.id)),
    createDeposit: protectedProcedure.input(requestInput.extend({ paymentMethod: z.string().max(64).optional() })).mutation(({ ctx, input }) => db.createDepositRequest({ userId: ctx.user.id, ...input })),
    createWithdrawal: protectedProcedure.input(requestInput.extend({ address: z.string().min(20).max(500) })).mutation(({ ctx, input }) => db.createWithdrawalRequest({ userId: ctx.user.id, ...input })),
  }),
  admin: router({
    stats: adminProcedure.query(() => db.getAdminStats()),
    users: adminProcedure.input(z.object({ search: z.string().max(320).optional() }).optional()).query(({ input }) => db.listUsers(input?.search)),
    deposits: adminProcedure.query(() => db.listDepositRequests()),
    withdrawals: adminProcedure.query(() => db.listWithdrawalRequests()),
    approveDeposit: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.approveDeposit(input.requestId, ctx.user.id)),
    rejectDeposit: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.rejectDeposit(input.requestId, ctx.user.id)),
    approveWithdrawal: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.approveWithdrawal(input.requestId, ctx.user.id)),
    rejectWithdrawal: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.rejectWithdrawal(input.requestId, ctx.user.id)),
  }),
});
export type AppRouter = typeof appRouter;
