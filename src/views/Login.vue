<template>
  <div class="login-page">
    <!-- الشريط العلوي -->
    <div class="top-bar">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lang-switch">
        <span>عربي</span>
        <svg width="12" height="12" viewBox="0 0 24 24">
          <polygon points="2,2 22,12 2,22" fill="#FFD700"/>
        </svg>
      </div>
    </div>

    <!-- منطقة الشعار + المكعبات -->
    <div class="hero">
      <!-- المكعبات -->
      <div class="cubes">
        <div class="cube c1"></div>
        <div class="cube c2"></div>
        <div class="cube c3"></div>
        <div class="cube c4"></div>
        <div class="cube c5"></div>
        <div class="cube c6"></div>
        <div class="cube c7"></div>
        <div class="cube c8"></div>
        <div class="cube c9"></div>
        <div class="cube c10"></div>
        <div class="cube c11"></div>
        <div class="cube c12"></div>
        <div class="cube c13"></div>
        <div class="cube c14"></div>
      </div>

      <!-- الشعار -->
      <div class="logo-wrap">
        <div class="logo-box">
          <div class="logo-circle">
            <div class="q q1">S</div>
            <div class="q q2">F</div>
            <div class="q q3">F</div>
            <div class="q q4">
              <span class="bars">
                <i></i><i></i><i></i><i></i>
              </span>
              L
            </div>
            <div class="badge">SCFL</div>
          </div>
        </div>
        <div class="brand">SCFL</div>
      </div>
    </div>

    <!-- بطاقة الدخول -->
    <div class="card">
      <!-- أيقونة الدعم -->
      <div class="support" @click="openSupport">
        <div class="support-circle">
          <svg viewBox="0 0 64 64" width="46" height="46">
            <circle cx="32" cy="32" r="30" fill="#fff"/>
            <!-- الرأس -->
            <circle cx="32" cy="23" r="9" fill="#00A0E3"/>
            <!-- الجسم -->
            <path d="M15 50c0-11 8-17 17-17s17 6 17 17" fill="#00A0E3"/>
            <!-- السماعة -->
            <path d="M44 18c5 0 9 4 9 9v3h-5v-3c0-2.5-2-4.5-4.5-4.5H41" stroke="#00A0E3" stroke-width="3.5" fill="none"/>
            <circle cx="50" cy="22" r="5.5" fill="#00A0E3"/>
          </svg>
        </div>
      </div>

      <!-- التبويبات -->
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'"
        >
          تسجيل الدخول بالبريد<br>الإلكتروني
        </button>
        <button
          class="tab"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          تسجيل الدخول<br>عبر الهاتف
        </button>
      </div>

      <!-- خطأ -->
      <div v-if="errorMessage" class="error">⚠️ {{ errorMessage }}</div>

      <!-- البريد -->
      <div v-if="loginType === 'email'" class="field">
        <div class="input-box">
          <svg class="icon" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2.5" stroke="#FFD700" stroke-width="1.9"/>
            <path d="M3 7l9 7 9-7" stroke="#FFD700" stroke-width="1.9" stroke-linecap="round"/>
          </svg>
          <input
            type="email"
            v-model="email"
            placeholder="بريد إلكترونى"
            @keyup.enter="login"
          />
        </div>
      </div>

      <!-- الهاتف -->
      <div v-if="loginType === 'phone'" class="field">
        <div class="phone-row">
          <select v-model="countryCode" class="code">
            <option value="">الرمز</option>
            <option value="+964">🇮🇶 +964</option>
            <option value="+966">🇸🇦 +966</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+965">🇰🇼 +965</option>
            <option value="+974">🇶🇦 +974</option>
            <option value="+20">🇪🇬 +20</option>
            <option value="+212">🇲🇦 +212</option>
            <option value="+216">🇹🇳 +216</option>
            <option value="+213">🇩🇿 +213</option>
          </select>
          <div class="input-box phone">
            <input
              type="tel"
              v-model="phone"
              placeholder="رقم الهاتف"
              :disabled="!countryCode"
              @keyup.enter="login"
            />
          </div>
        </div>
      </div>

      <!-- كلمة المرور -->
      <div class="field">
        <div class="input-box">
          <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2.5" stroke="#FFD700" stroke-width="1.9"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#FFD700" stroke-width="1.9"/>
          </svg>
          <input
            :type="showPass ? 'text' : 'password'"
            v-model="password"
            placeholder="كلمة سر الدخول"
            @keyup.enter="login"
          />
          <button class="eye" @click="showPass = !showPass">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#8E8EA2" stroke-width="1.8"/>
              <circle cx="12" cy="12" r="3" stroke="#8E8EA2" stroke-width="1.8"/>
              <line v-if="showPass" x1="3" y1="3" x2="21" y2="21" stroke="#8E8EA2" stroke-width="1.8"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- زر الدخول -->
      <button class="btn" @click="login" :disabled="loading">
        <span v-if="!loading">تسجيل الدخول</span>
        <div v-else class="spinner"></div>
      </button>

      <!-- تسجيل -->
      <p class="register">
        لا حساب؟ <router-link to="/register">يسجل</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: 'email',
      email: '',
      phone: '',
      countryCode: '',
      password: '',
      showPass: false,
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    login() {
      this.errorMessage = '';

      if (this.loginType === 'email' && !this.email) {
        this.errorMessage = 'الرجاء إدخال البريد الإلكتروني';
        return;
      }
      if (this.loginType === 'phone') {
        if (!this.countryCode) {
          this.errorMessage = 'الرجاء اختيار رمز الدولة';
          return;
        }
        if (!this.phone) {
          this.errorMessage = 'الرجاء إدخال رقم الهاتف';
          return;
        }
      }
      if (!this.password || this.password.length < 6) {
        this.errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        return;
      }

      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$router.push('/home');
      }, 1400);
    },
    openSupport() {
      // غيّر الرابط حسب احتياجك
      window.open('https://t.me/your_support', '_blank');
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  background: linear-gradient(165deg, #0a3d4d 0%, #0c2f3f 30%, #15182a 70%, #0f111c 100%);
  display: flex;
  flex-direction: column;
  direction: rtl;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  position: relative;
}

/* ===== الشريط العلوي ===== */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px 6px;
  z-index: 30;
}

.back-btn {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
}

/* ===== الهيرو ===== */
.hero {
  position: relative;
  height: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

/* المكعبات */
.cubes {
  position: absolute;
  width: 280px;
  height: 240px;
  right: 5%;
  top: 20px;
  transform: rotateX(18deg) rotateY(-28deg);
  transform-style: preserve-3d;
  perspective: 900px;
}

.cube {
  position: absolute;
  width: 48px;
  height: 48px;
  background: linear-gradient(145deg, #1ee0e0, #0a9a9a);
  border-radius: 7px;
  box-shadow:
    inset 3px 3px 8px rgba(255,255,255,0.22),
    inset -3px -3px 8px rgba(0,0,0,0.28),
    5px 6px 14px rgba(0,0,0,0.35);
  opacity: 0.9;
}

.cube::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 7px;
  background: linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.22));
}

.c1  { top: 10px;  left: 90px;  transform: translateZ(40px); }
.c2  { top: 25px;  left: 145px; transform: translateZ(20px); }
.c3  { top: 45px;  left: 50px;  transform: translateZ(55px); }
.c4  { top: 55px;  left: 110px; transform: translateZ(65px); }
.c5  { top: 70px;  left: 165px; transform: translateZ(30px); }
.c6  { top: 90px;  left: 70px;  transform: translateZ(45px); }
.c7  { top: 100px; left: 130px; transform: translateZ(70px); }
.c8  { top: 115px; left: 180px; transform: translateZ(25px); }
.c9  { top: 130px; left: 40px;  transform: translateZ(15px); }
.c10 { top: 140px; left: 95px;  transform: translateZ(50px); }
.c11 { top: 155px; left: 150px; transform: translateZ(35px); }
.c12 { top: 80px;  left: 20px;  transform: translateZ(10px); opacity: 0.7; }
.c13 { top: 30px;  left: 20px;  transform: translateZ(5px);  opacity: 0.6; }
.c14 { top: 170px; left: 70px;  transform: translateZ(20px); opacity: 0.75; }

/* الشعار */
.logo-wrap {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -10px;
}

.logo-box {
  width: 112px;
  height: 112px;
  background: #fff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 40px rgba(0, 200, 200, 0.2);
}

.logo-circle {
  width: 92px;
  height: 92px;
  border: 2.8px solid #0a1e2f;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.q {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
  color: #0a1e2f;
  letter-spacing: -1px;
}

.q1 { border-left: 1.8px solid #0a1e2f; border-bottom: 1.8px solid #0a1e2f; }
.q2 { border-bottom: 1.8px solid #0a1e2f; }
.q3 { border-left: 1.8px solid #0a1e2f; }
.q4 {
  flex-direction: column;
  gap: 1px;
  font-size: 17px;
}

.bars {
  display: flex;
  gap: 2.5px;
  margin-bottom: -2px;
}
.bars i {
  display: block;
  width: 3.5px;
  background: #0a1e2f;
  border-radius: 1px;
}
.bars i:nth-child(1) { height: 6px; }
.bars i:nth-child(2) { height: 10px; }
.bars i:nth-child(3) { height: 8px; }
.bars i:nth-child(4) { height: 12px; }

.badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #0a1e2f;
  color: #fff;
  font-size: 8.5px;
  font-weight: 700;
  padding: 2.5px 8px;
  border-radius: 4px;
  letter-spacing: 0.6px;
  z-index: 5;
}

.brand {
  margin-top: 12px;
  color: #FFD700;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: 5px;
  text-shadow: 0 2px 16px rgba(255, 215, 0, 0.25);
}

/* ===== البطاقة ===== */
.card {
  background: #26263a;
  flex: 1;
  border-radius: 38px 38px 0 0;
  padding: 36px 22px 40px;
  position: relative;
  box-shadow: 0 -14px 45px rgba(0,0,0,0.5);
}

/* الدعم */
.support {
  position: absolute;
  top: -28px;
  left: 22px; /* في RTL left = يمين الشاشة */
  z-index: 40;
  cursor: pointer;
}

.support-circle {
  filter: drop-shadow(0 5px 16px rgba(0, 160, 227, 0.45));
  transition: transform 0.2s;
}
.support:active .support-circle {
  transform: scale(0.94);
}

/* التبويبات */
.tabs {
  display: flex;
  margin-bottom: 26px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 0 2px;
}

.tab {
  flex: 1;
  background: none;
  border: none;
  color: #8e8ea2;
  font-size: 13.2px;
  font-weight: 500;
  line-height: 1.35;
  padding: 6px 4px 14px;
  cursor: pointer;
  position: relative;
  text-align: center;
  transition: color 0.25s;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: 12%;
  width: 0;
  height: 2.5px;
  background: #FFD700;
  border-radius: 2px;
  transition: width 0.3s;
}

.tab.active {
  color: #FFD700;
}
.tab.active::after {
  width: 76%;
}

/* الحقول */
.field {
  margin-bottom: 14px;
}

.input-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #35354d;
  border-radius: 14px;
  height: 54px;
  border: 2px solid transparent;
  transition: border-color 0.25s, background 0.25s;
}

.input-box:focus-within {
  border-color: #FFD700;
  background: #3a3a55;
}

.icon {
  position: absolute;
  right: 15px;
  pointer-events: none;
}

.input-box input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  padding: 0 48px 0 48px;
  text-align: right;
}

.input-box input::placeholder {
  color: #8e8ea2;
}

.eye {
  position: absolute;
  left: 14px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
}

/* الهاتف */
.phone-row {
  display: flex;
  gap: 10px;
}

.code {
  width: 100px;
  height: 54px;
  background: #35354d;
  border: 2px solid transparent;
  border-radius: 14px;
  color: #fff;
  font-size: 13px;
  text-align: center;
  appearance: none;
  cursor: pointer;
}
.code:focus {
  outline: none;
  border-color: #FFD700;
}

.phone {
  flex: 1;
}
.phone input {
  padding-right: 16px;
}

/* الخطأ */
.error {
  background: rgba(255, 90, 90, 0.12);
  border: 1px solid rgba(255, 90, 90, 0.22);
  color: #ff6b6b;
  padding: 11px;
  border-radius: 12px;
  font-size: 13.5px;
  text-align: center;
  margin-bottom: 14px;
}

/* الزر */
.btn {
  width: 100%;
  height: 54px;
  background: linear-gradient(135deg, #FFD700, #f0c000);
  border: none;
  border-radius: 28px;
  color: #0a1e2f;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  box-shadow: 0 6px 24px rgba(255, 215, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}
.btn:active:not(:disabled) {
  transform: scale(0.98);
}
.btn:disabled {
  opacity: 0.65;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #0a1e2f;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* التسجيل */
.register {
  text-align: center;
  margin-top: 22px;
  color: #8e8ea2;
  font-size: 14px;
}
.register a {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
}

/* موبايل */
@media (max-width: 390px) {
  .logo-box { width: 100px; height: 100px; }
  .logo-circle { width: 82px; height: 82px; }
  .q { font-size: 18px; }
  .brand { font-size: 24px; }
  .tab { font-size: 12.5px; }
  .cubes { right: 0; transform: scale(0.9) rotateX(18deg) rotateY(-28deg); }
}
</style>
