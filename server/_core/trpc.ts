import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../../shared/const.js";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;

    // Never leak internal details (raw SQL, connection strings, stack
    // traces, etc.) to the client for unexpected server errors. Known,
    // intentional errors (bad login, forbidden, not found...) already
    // carry a safe, user-facing message and are left untouched.
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("[tRPC] internal error formatted for client", {
        procedure: opts.path,
        requestId:
          typeof opts.ctx?.req?.headers?.get === "function"
            ? opts.ctx.req.headers.get("x-cwaax-request-id") ?? "unknown"
            : "unknown",
        code: error.code,
        message: error.message,
        cause: error.cause instanceof Error ? error.cause.message : String(error.cause ?? ""),
        stack: error.stack,
      });
      return {
        ...shape,
        message: "حدث خطأ غير متوقع، الرجاء المحاولة مرة أخرى",
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

    console.info("[AdminTrace] request", {
      procedure: opts.path,
      requestId:
        typeof ctx.req.headers?.get === "function"
          ? ctx.req.headers.get("x-cwaax-request-id") ?? "unknown"
          : "unknown",
      inputRequestId:
        opts.input && typeof opts.input === "object" && "requestId" in opts.input
          ? (opts.input as { requestId?: unknown }).requestId
          : undefined,
      userId: ctx.user?.id ?? null,
      openId: ctx.user?.openId ?? null,
      role: ctx.user?.role ?? null,
    });

    if (!ctx.user || ctx.user.role !== "admin") {
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
