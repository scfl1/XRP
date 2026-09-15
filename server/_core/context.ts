import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: Request;
  user: User | null;
};

export async function createContext(opts: { req: Request }): Promise<TrpcContext> {
  // IMPORTANT: Do NOT swallow authentication errors here.
  //
  // Previously, any failure inside `sdk.authenticateRequest` (temporary
  // DB connectivity issue, token refresh race, network glitch, etc.) was
  // caught and converted to `user = null`. That made `adminProcedure`
  // throw a generic "not admin" (10002) error, hiding the real cause.
  //
  // Letting the error propagate allows tRPC to return the actual failure
  // so it can be diagnosed and retried correctly.
  const user = await sdk.authenticateRequest(opts.req);

  return {
    req: opts.req,
    user,
  };
}
