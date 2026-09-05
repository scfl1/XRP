export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ✅ طريقة مختلفة لقراءة JWT_SECRET
    const JWT_SECRET = env.JWT_SECRET || env.JWT_ξ || "";
    
    // ✅ تأكد من أن المفتاح طويل بما فيه الكفاية
    let secretKey = JWT_SECRET;
    while (secretKey.length < 32) {
      secretKey += secretKey;
    }
    secretKey = secretKey.slice(0, 32);

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // ===== تسجيل حساب جديد =====
    if (path === '/api/auth/register' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string; name?: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // إنشاء JWT بسيط بدون دوال معقدة
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        const payload = btoa(JSON.stringify({
          userId: crypto.randomUUID(),
          email: body.email,
          exp: Math.floor(Date.now() / 1000) + 604800
        })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // توقيع بسيط باستخدام HMAC
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        
        // استيراد المفتاح
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );

        const signature = await crypto.subtle.sign(
          'HMAC',
          key,
          encoder.encode(`${header}.${payload}`)
        );

        const signatureStr = btoa(String.fromCharCode(...new Uint8Array(signature)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const token = `${header}.${payload}.${signatureStr}`;

        return new Response(JSON.stringify({
          success: true,
          user: { id: 'user-123', email: body.email, name: body.name || body.email.split('@')[0] },
          token: token
        }), {
          status: 201,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Registration failed',
          details: (error as Error).message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
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

        // نفس طريقة إنشاء التوكن
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        
        const payload = btoa(JSON.stringify({
          userId: 'user-123',
          email: body.email,
          exp: Math.floor(Date.now() / 1000) + 604800
        })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );

        const signature = await crypto.subtle.sign(
          'HMAC',
          key,
          encoder.encode(`${header}.${payload}`)
        );

        const signatureStr = btoa(String.fromCharCode(...new Uint8Array(signature)))
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const token = `${header}.${payload}.${signatureStr}`;

        return new Response(JSON.stringify({
          success: true,
          user: { id: 'user-123', email: body.email },
          token: token
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Login failed',
          details: (error as Error).message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // ===== الصفحة الرئيسية =====
    return new Response(JSON.stringify({
      message: '✅ CwaAX API is running!',
      endpoints: [
        'POST /api/auth/register - Create account',
        'POST /api/auth/login - Login'
      ],
      debug: {
        hasSecret: !!JWT_SECRET,
        secretLength: JWT_SECRET.length,
        firstChars: JWT_SECRET.substring(0, 5) + '...'
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
