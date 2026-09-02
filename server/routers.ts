import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const requestInput = z.object({ currency: z.string().min(2).max(16), amount: z.number().positive().finite(), network: z.string().max(32).optional() });

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query((opts) => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  wallet: router({
    balances: protectedProcedure.query(({ ctx }) => db.getWalletBalances(ctx.user.id)),
    transactions: protectedProcedure.query(({ ctx }) => db.listTransactions(ctx.user.id)),
    createDeposit: protectedProcedure.input(requestInput.extend({ paymentMethod: z.string().max(64).optional() })).mutation(({ ctx, input }) => db.createDepositRequest({ userId: ctx.user.id, ...input })),
    createWithdrawal: protectedProcedure.input(requestInput.extend({ address: z.string().min(20).max(500) })).mutation(({ ctx, input }) => db.createWithdrawalRequest({ userId: ctx.user.id, ...input })),
  }),
  admin: router({
    deposits: adminProcedure.query(() => db.listDepositRequests()),
    withdrawals: adminProcedure.query(() => db.listWithdrawalRequests()),
    approveDeposit: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.approveDeposit(input.requestId, ctx.user.id)),
    rejectDeposit: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.rejectDeposit(input.requestId, ctx.user.id)),
    approveWithdrawal: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.approveWithdrawal(input.requestId, ctx.user.id)),
    rejectWithdrawal: adminProcedure.input(z.object({ requestId: z.number().int().positive() })).mutation(({ ctx, input }) => db.rejectWithdrawal(input.requestId, ctx.user.id)),
  }),
});
export type AppRouter = typeof appRouter;
