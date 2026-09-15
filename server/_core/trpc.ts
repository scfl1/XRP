import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../../shared/const.js";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;

    if (error.code === "INTERNAL_SERVER_ERROR") {
      // اطبع السبب الحقيقي في console السيرفر للتشخيص
      console.error("[tRPC Internal Error]", {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });

      return {
        ...shape,
        message: error.message.includes("Database")
          ? "تعذر الاتصال بقاعدة البيانات، حاول مرة أخرى"
          : "حدث خطأ غير متوقع، الرجاء المحاولة مرة أخرى",
      };
    }

    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
    }

    if (ctx.user.role !== "admin") {
      console.error("[AdminAuth] Permission denied:", {
        userId: ctx.user.id,
        openId: ctx.user.openId,
        role: ctx.user.role,
      });

      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
