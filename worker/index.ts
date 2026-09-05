export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ✅ مفتاح ثابت للتجربة (عدله بعد ما تشتغل)
    const SECRET = "my-super-secret-key-32-chars-leng!";

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // ===== تسجيل حساب جديد =====
    if (path === '/api/auth/register' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // تشفير بسيط باستخدام Base64 (بدون HMAC للتجربة)
        const fakeToken = btoa(JSON.stringify({
          userId: 'user-123',
          email: body.email,
          exp: Date.now() + 604800000
        }));

        return new Response(JSON.stringify({
          success: true,
          user: { id: 'user-123', email: body.email },
          token: fakeToken
        }), {
          status: 201,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ===== تسجيل الدخول =====
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const fakeToken = btoa(JSON.stringify({
          userId: 'user-123',
          email: body.email,
          exp: Date.now() + 604800000
        }));

        return new Response(JSON.stringify({
          success: true,
          user: { id: 'user-123', email: body.email },
          token: fakeToken
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ===== الصفحة الرئيسية =====
    return new Response(JSON.stringify({
      message: '✅ API is running! (Simple version)',
      endpoints: ['POST /api/auth/register', 'POST /api/auth/login']
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
