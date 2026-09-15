import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: Request;
  user: User | null;
};

export async function createContext(opts: { req: Request }): Promise<TrpcContext> {
  // A missing or invalid session is completely normal — e.g. anyone
  // hitting the login/register screen has no session yet. Failing to
  // authenticate must NEVER block the request itself, or every public
  // procedure (including login) becomes impossible to call. Auth
  // failures are represented by `user: null`; `protectedProcedure` and
  // `adminProcedure` already throw their own clear, specific errors
  // when they see `ctx.user === null`, so nothing is hidden — a
  // genuine "not admin" case still reports as "not admin", not as a
  // generic crash.
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    console.warn("[Auth] authenticateRequest failed (treated as signed-out):", error);
    user = null;
  }

  return {
    req: opts.req,
    user,
  };
}
