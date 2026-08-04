<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تسجيل الدخول</title>
  <!-- Font Awesome 6 (مجاني) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    /* إعادة تعيين أساسية وخطوط */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', 'Tahoma', 'Arial', sans-serif;
    }

    body {
      background: linear-gradient(145deg, #f0f4fa 0%, #d9e2ef 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }

    /* بطاقة تسجيل الدخول – مطابقة للألوان والتفاصيل */
    .login-card {
      background-color: #ffffff;
      max-width: 420px;
      width: 100%;
      padding: 2.5rem 2rem 2rem 2rem;
      border-radius: 36px;
      box-shadow: 0 20px 40px rgba(0, 20, 40, 0.2), 0 6px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .login-card:hover {
      transform: scale(1.01);
    }

    /* عنوان "عربي" في الأعلى (كما في الصورة) */
    .lang-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e2a3a;
      letter-spacing: 0.5px;
      margin-bottom: 1.8rem;
      display: flex;
      justify-content: flex-end;
      border-bottom: 1px solid #eef2f7;
      padding-bottom: 0.6rem;
    }

    .lang-label i {
      margin-left: 6px;
      color: #2c3e50;
    }

    /* خيارات تسجيل الدخول (زرين) */
    .login-options {
      display: flex;
      gap: 12px;
      margin-bottom: 2rem;
      background: #f2f6fc;
      padding: 6px;
      border-radius: 60px;
      border: 1px solid #e2e9f2;
    }

    .login-option {
      flex: 1;
      text-align: center;
      padding: 0.7rem 0.2rem;
      border-radius: 40px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: default;
      background: transparent;
      color: #3a4a5e;
      transition: 0.2s;
      border: none;
    }

    .login-option.active {
      background: #ffffff;
      color: #0b1b2b;
      box-shadow: 0 4px 10px rgba(0, 20, 40, 0.08);
      border: 1px solid #d0dcec;
    }

    .login-option i {
      margin-left: 8px;
      font-size: 0.9rem;
    }

    /* حقول الإدخال */
    .input-group {
      margin-bottom: 1.5rem;
    }

    .input-group label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: #1f2a3a;
      margin-bottom: 0.4rem;
      letter-spacing: 0.2px;
    }

    .input-field {
      width: 100%;
      padding: 0.9rem 1.2rem;
      border-radius: 40px;
      border: 1.5px solid #dbe2ec;
      background-color: #fafcff;
      font-size: 1rem;
      color: #1a2636;
      outline: none;
      transition: 0.2s;
    }

    .input-field:focus {
      border-color: #3b6c9c;
      box-shadow: 0 0 0 3px rgba(59, 108, 156, 0.15);
      background-color: #ffffff;
    }

    .input-field::placeholder {
      color: #a0b2c9;
      font-weight: 400;
      font-size: 0.95rem;
    }

    /* زر تسجيل الدخول الرئيسي */
    .login-btn {
      width: 100%;
      background: #1f3a5a;
      border: none;
      padding: 0.95rem;
      border-radius: 60px;
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 0.3px;
      margin: 1.2rem 0 1.8rem 0;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 8px 16px rgba(26, 55, 94, 0.25);
      border: 1px solid #2b4b70;
    }

    .login-btn:hover {
      background: #17304d;
      transform: translateY(-2px);
      box-shadow: 0 12px 20px rgba(20, 50, 80, 0.3);
    }

    .login-btn:active {
      transform: scale(0.97);
      background: #0f263d;
    }

    /* رابط "لا حساب؟ يسجل" */
    .signup-link {
      text-align: center;
      font-size: 1rem;
      font-weight: 500;
      color: #1f2e42;
      border-top: 1px solid #e7edf6;
      padding-top: 1.8rem;
      margin-top: 0.2rem;
    }

    .signup-link a {
      color: #1f3a5a;
      font-weight: 700;
      text-decoration: none;
      margin-right: 8px;
      border-bottom: 2px solid transparent;
      transition: 0.15s;
      padding-bottom: 2px;
    }

    .signup-link a:hover {
      border-bottom-color: #1f3a5a;
      color: #0f263d;
    }

    .signup-link i {
      margin-right: 6px;
      color: #2b4b70;
      font-size: 0.9rem;
    }

    /* أيقونات صغيرة داخل الحقول (اختياري لكن يضيف تفاصيل) */
    .input-icon-wrap {
      position: relative;
    }

    .input-icon-wrap .input-field {
      padding-right: 2.8rem;
    }

    .input-icon-wrap i {
      position: absolute;
      right: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      color: #7a8da5;
      font-size: 1rem;
      pointer-events: none;
    }

    /* تنسيق الهاتف / البريد – النص الموجود في الصورة */
    .login-option i.fa-phone,
    .login-option i.fa-envelope {
      margin-left: 6px;
    }

    /* عناوين الحقول كما في الصورة: "بريد إلكتروني" و "كلمة سر الدخول" */
    .field-label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .field-label i {
      color: #3f5a7a;
      font-size: 0.9rem;
      opacity: 0.7;
    }

    /* تحسين للشاشات الصغيرة */
    @media (max-width: 460px) {
      .login-card {
        padding: 1.8rem 1.2rem 1.5rem;
      }
      .login-option {
        font-size: 0.8rem;
        padding: 0.6rem 0;
      }
      .login-btn {
        font-size: 1rem;
        padding: 0.8rem;
      }
    }
  </style>
</head>
<body>
  <div class="login-card">

    <!-- "عربي" في الأعلى -->
    <div class="lang-label">
      <i class="fas fa-globe"></i> عربي
    </div>

    <!-- خيارات تسجيل الدخول: هاتف / بريد -->
    <div class="login-options">
      <div class="login-option active">
        <i class="fas fa-phone-alt"></i> الهاتف
      </div>
      <div class="login-option">
        <i class="fas fa-envelope"></i> البريد الإلكتروني
      </div>
    </div>

    <!-- حقل البريد الإلكتروني -->
    <div class="input-group">
      <label class="field-label">
        <i class="far fa-envelope"></i> بريد إلكتروني
      </label>
      <div class="input-icon-wrap">
        <input type="email" class="input-field" placeholder="example@domain.com" value="user@example.com">
        <i class="fas fa-user-circle"></i>
      </div>
    </div>

    <!-- حقل كلمة السر -->
    <div class="input-group">
      <label class="field-label">
        <i class="fas fa-lock"></i> كلمة سر الدخول
      </label>
      <div class="input-icon-wrap">
        <input type="password" class="input-field" placeholder="••••••••" value="12345678">
        <i class="fas fa-key"></i>
      </div>
    </div>

    <!-- زر تسجيل الدخول -->
    <button class="login-btn">
      <i class="fas fa-sign-in-alt" style="margin-left: 10px;"></i> تسجيل الدخول
    </button>

    <!-- رابط "لا حساب؟ يسجل" -->
    <div class="signup-link">
      <i class="fas fa-user-plus"></i> لا حساب؟
      <a href="#"><i class="fas fa-arrow-left" style="margin-left: 4px;"></i> يسجل</a>
    </div>

  </div>
</body>
</html>
