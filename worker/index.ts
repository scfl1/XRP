export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ✅ قراءة المفتاح مباشرة
    const JWT_SECRET = env.JWT_SECRET || "fallback-key-for-testing";

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // ===== REGISTER =====
    if (path === "/api/auth/register" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.email || !body.password) {
          return Response.json({ error: "Email and password required" }, { status: 400 });
        }

        // توليد توكن بسيط
        const token = btoa(JSON.stringify({
          email: body.email,
          userId: crypto.randomUUID(),
          exp: Date.now() + 86400000,
        }));

        return Response.json({
          success: true,
          user: { email: body.email },
          token: token,
        }, { status: 201 });
      } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
      }
    }

    // ===== LOGIN =====
    if (path === "/api/auth/login" && request.method === "POST") {
      try {
        const body = await request.json();
        if (!body.email || !body.password) {
          return Response.json({ error: "Email and password required" }, { status: 400 });
        }

        const token = btoa(JSON.stringify({
          email: body.email,
          userId: "user-123",
          exp: Date.now() + 86400000,
        }));

        return Response.json({
          success: true,
          user: { email: body.email },
          token: token,
        }, { status: 200 });
      } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
      }
    }

    // ===== VERIFY =====
    if (path === "/api/auth/verify" && request.method === "GET") {
      const auth = request.headers.get("Authorization");
      if (!auth || !auth.startsWith("Bearer ")) {
        return Response.json({ error: "No token" }, { status: 401 });
      }
      try {
        const payload = JSON.parse(atob(auth.split(" ")[1]));
        return Response.json({ valid: true, user: payload }, { status: 200 });
      } catch {
        return Response.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // ===== HOME =====
    return Response.json({
      message: "CwaAX API is running",
      endpoints: [
        "POST /api/auth/register",
        "POST /api/auth/login",
        "GET /api/auth/verify",
      ],
      jwt_secret_loaded: !!JWT_SECRET,
    });
  },
};
