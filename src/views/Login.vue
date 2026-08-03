<template>
  <div class="login-page">
    <!-- الشريط العلوي -->
    <div class="top-bar">
      <button class="icon-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lang-switch">
        <span>عربي</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <polygon points="2,2 22,12 2,22" fill="#FFD700"/>
        </svg>
      </div>
    </div>

    <!-- منطقة الشعار + المكعبات -->
    <div class="hero-section">
      <div class="hero-bg">
        <div class="cubes-container">
          <!-- مكعبات ثلاثية الأبعاد -->
          <div class="cube-stack">
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
          </div>
        </div>
        <div class="glow-effect"></div>
      </div>

      <!-- شعار SCFL -->
      <div class="logo-wrapper">
        <div class="logo-box">
          <div class="logo-circle">
            <div class="logo-quarter q1">S</div>
            <div class="logo-quarter q2">F</div>
            <div class="logo-quarter q3">F</div>
            <div class="logo-quarter q4">L</div>
            <div class="logo-center">SCFL</div>
          </div>
        </div>
        <h1 class="brand-title">SCFL</h1>
      </div>
    </div>

    <!-- بطاقة تسجيل الدخول -->
    <div class="login-card">
      <!-- زر الدعم -->
      <div class="support-btn" @click="openSupport">
        <div class="support-icon">
          <svg viewBox="0 0 64 64" width="48" height="48">
            <circle cx="32" cy="32" r="30" fill="#fff"/>
            <circle cx="32" cy="24" r="10" fill="#00A0E3"/>
            <path d="M16 48c0-10 7-16 16-16s16 6 16 16" fill="#00A0E3"/>
            <path d="M42 20c4 0 7 3 7 7v2h-4v-2c0-2-1.5-3-3-3h-2" fill="#00A0E3"/>
            <circle cx="48" cy="22" r="6" fill="#00A0E3"/>
          </svg>
        </div>
      </div>

      <!-- التبويبات -->
      <div class="tab-container">
        <button
          class="tab-btn"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'"
        >
          تسجيل الدخول بالبريد الإلكتروني
        </button>
        <button
          class="tab-btn"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          تسجيل الدخول عبر الهاتف
        </button>
      </div>

      <!-- رسالة الخطأ -->
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>

      <!-- حقل البريد -->
      <div v-if="loginType === 'email'" class="input-group">
        <div class="input-wrapper">
          <svg class="input-icon" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="#FFD700" stroke-width="1.8"/>
            <path d="M2 7l10 7 10-7" stroke="#FFD700" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <input
            type="email"
            v-model="email"
            placeholder="بريد إلكترونى"
            class="input-field"
            @keyup.enter="loginUser"
          />
        </div>
      </div>

      <!-- حقل الهاتف -->
      <div v-if="loginType === 'phone'" class="input-group">
        <div class="phone-input-wrapper">
          <select v-model="countryCode" class="country-select">
            <option value="">اختر الرمز</option>
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
          <input
            type="tel"
            v-model="phoneNumber"
            placeholder="رقم الهاتف"
            class="input-field phone-input"
            :disabled="!countryCode"
            @keyup.enter="loginUser"
          />
        </div>
      </div>

      <!-- كلمة المرور -->
      <div class="input-group">
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#FFD700" stroke-width="1.8"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#FFD700" stroke-width="1.8"/>
          </svg>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="كلمة سر الدخول"
            class="input-field"
            @keyup.enter="loginUser"
          />
          <button class="toggle-password" @click="showPassword = !showPassword">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#8E8EA2" stroke-width="1.8"/>
              <circle cx="12" cy="12" r="3" stroke="#8E8EA2" stroke-width="1.8"/>
              <line v-if="showPassword" x1="3" y1="3" x2="21" y2="21" stroke="#8E8EA2" stroke-width="1.8"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- زر الدخول -->
      <button class="login-btn" @click="loginUser" :disabled="loading">
        <span v-if="!loading">تسجيل الدخول</span>
        <div v-else class="spinner"></div>
      </button>

      <!-- رابط التسجيل -->
      <p class="register-link">
        لا حساب؟ <router-link to="/register">يسجل</router-link>
      </p>
    </div>

    <!-- إعلان منبثق -->
    <div v-if="showAd" class="ad-overlay" @click.self="closeAd">
      <div class="ad-popup">
        <div class="ad-header">
          <h2>✨ إعلان ✨</h2>
        </div>
        <div class="ad-body">
          <p>
            🎉🎉🎉🎉 مرحبا بالجميع! تأسست SCFL في سنغافورة في 20 أغسطس 2021 ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة. نحن شركة استثمار في التجارة الإلكترونية مع فريق تقني قوي وقوة مالية قوية.
            <br><br>
            يتعاون SCFL مع عشرات شركات التجارة الإلكترونية مثل Amazon و eBay و Tiktok و Aliexpress و Alibaba و Shopee ، إلخ.
          </p>
        </div>
        <button class="ad-close-btn" @click="closeAd">أنا أعرف</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: 'email',
      email: '',
      phoneNumber: '',
      countryCode: '',
      password: '',
      showPassword: false,
      loading: false,
      errorMessage: '',
      showAd: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showAd = false;
    }, 5000);
  },
  methods: {
    async loginUser() {
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
        if (!this.phoneNumber) {
          this.errorMessage = 'الرجاء إدخال رقم الهاتف';
          return;
        }
      }

      if (!this.password || this.password.length < 6) {
        this.errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        return;
      }

      this.loading = true;

      // محاكاة تسجيل الدخول
      setTimeout(() => {
        this.loading = false;
        this.$router.push('/home');
      }, 1500);
    },
    closeAd() {
      this.showAd = false;
    },
    openSupport() {
      // افتح دعم فني أو واتساب أو تيليجرام حسب احتياجك
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
  background: linear-gradient(180deg, #0b3a4a 0%, #0f2a3a 35%, #1a1c2e 70%, #12141f 100%);
  display: flex;
  flex-direction: column;
  direction: rtl;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  position: relative;
  overflow: hidden;
}

/* الشريط العلوي */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 8px;
  z-index: 20;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
}

/* الهيرو */
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 15px;
  z-index: 5;
  min-height: 280px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* المكعبات */
.cubes-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 800px;
}

.cube-stack {
  position: relative;
  width: 220px;
  height: 180px;
  transform-style: preserve-3d;
  transform: rotateX(25deg) rotateY(-25deg);
}

.cube {
  position: absolute;
  width: 42px;
  height: 42px;
  background: linear-gradient(145deg, #00d4d4, #008a8a);
  border-radius: 6px;
  box-shadow:
    inset 2px 2px 6px rgba(255,255,255,0.25),
    inset -2px -2px 6px rgba(0,0,0,0.3),
    4px 4px 12px rgba(0,0,0,0.35);
  opacity: 0.85;
}

.cube::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.25));
  border-radius: 6px;
}

.c1  { top: 20px;  left: 40px;  transform: translateZ(30px); }
.c2  { top: 10px;  left: 85px;  transform: translateZ(50px); }
.c3  { top: 35px;  left: 130px; transform: translateZ(20px); }
.c4  { top: 55px;  left: 55px;  transform: translateZ(60px); }
.c5  { top: 45px;  left: 100px; transform: translateZ(40px); }
.c6  { top: 70px;  left: 145px; transform: translateZ(10px); }
.c7  { top: 90px;  left: 70px;  transform: translateZ(35px); }
.c8  { top: 80px;  left: 115px; transform: translateZ(55px); }
.c9  { top: 110px; left: 40px;  transform: translateZ(15px); }
.c10 { top: 100px; left: 90px;  transform: translateZ(45px); }
.c11 { top: 125px; left: 130px; transform: translateZ(25px); }
.c12 { top: 60px;  left: 20px;  transform: translateZ(5px);  opacity: 0.6; }

.glow-effect {
  position: absolute;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(0, 220, 220, 0.12) 0%, transparent 65%);
  border-radius: 50%;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

/* الشعار */
.logo-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}

.logo-box {
  width: 108px;
  height: 108px;
  background: #fff;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 40px rgba(0, 200, 200, 0.18);
  margin-bottom: 12px;
}

.logo-circle {
  width: 88px;
  height: 88px;
  border: 2.5px solid #0a1e2f;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.logo-quarter {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 18px;
  color: #0a1e2f;
  letter-spacing: -0.5px;
}

.q1 { border-bottom: 1.5px solid #0a1e2f; border-left: 1.5px solid #0a1e2f; }
.q2 { border-bottom: 1.5px solid #0a1e2f; }
.q3 { border-left: 1.5px solid #0a1e2f; }
.q4 { }

.logo-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #0a1e2f;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  letter-spacing: 0.8px;
  z-index: 5;
}

.brand-title {
  color: #FFD700;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 5px;
  margin: 0;
  text-shadow: 0 2px 18px rgba(255, 215, 0, 0.2);
}

/* بطاقة الدخول */
.login-card {
  background: #26263a;
  flex: 1;
  border-radius: 36px 36px 0 0;
  padding: 32px 22px 40px;
  margin-top: 8px;
  position: relative;
  box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.45);
}

/* زر الدعم */
.support-btn {
  position: absolute;
  top: -26px;
  left: 22px;
  width: 52px;
  height: 52px;
  cursor: pointer;
  z-index: 30;
  transition: transform 0.25s;
}

.support-btn:active {
  transform: scale(0.95);
}

.support-icon {
  filter: drop-shadow(0 4px 14px rgba(0, 160, 227, 0.4));
}

/* التبويبات */
.tab-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 4px;
}

.tab-btn {
  background: none;
  border: none;
  color: #8e8ea2;
  font-size: 13.5px;
  font-weight: 500;
  padding: 8px 0 14px;
  cursor: pointer;
  position: relative;
  flex: 1;
  text-align: center;
  transition: color 0.25s;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: 10%;
  width: 0;
  height: 2.5px;
  background: #FFD700;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.tab-btn.active {
  color: #FFD700;
}

.tab-btn.active::after {
  width: 80%;
}

/* حقول الإدخال */
.input-group {
  margin-bottom: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 16px;
  z-index: 2;
  pointer-events: none;
}

.input-field {
  width: 100%;
  height: 54px;
  padding: 0 48px 0 48px;
  background: #35354d;
  border: 2px solid transparent;
  border-radius: 14px;
  color: #fff;
  font-size: 15px;
  text-align: right;
  transition: all 0.25s;
}

.input-field::placeholder {
  color: #8e8ea2;
}

.input-field:focus {
  outline: none;
  border-color: #FFD700;
  background: #3a3a55;
}

/* الهاتف */
.phone-input-wrapper {
  display: flex;
  gap: 10px;
}

.country-select {
  width: 105px;
  height: 54px;
  padding: 0 8px;
  background: #35354d;
  border: 2px solid transparent;
  border-radius: 14px;
  color: #fff;
  font-size: 13px;
  text-align: center;
  appearance: none;
  cursor: pointer;
}

.country-select:focus {
  outline: none;
  border-color: #FFD700;
}

.phone-input {
  flex: 1;
  padding-right: 16px;
}

.phone-input:disabled {
  opacity: 0.45;
}

/* إظهار كلمة المرور */
.toggle-password {
  position: absolute;
  left: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

/* رسالة الخطأ */
.error-message {
  background: rgba(255, 90, 90, 0.12);
  border: 1px solid rgba(255, 90, 90, 0.25);
  color: #ff6b6b;
  padding: 11px 14px;
  border-radius: 12px;
  margin-bottom: 14px;
  font-size: 13.5px;
  text-align: center;
}

/* زر الدخول */
.login-btn {
  width: 100%;
  height: 54px;
  background: linear-gradient(135deg, #FFD700, #f0c000);
  border: none;
  border-radius: 28px;
  color: #0a1e2f;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 6px 22px rgba(255, 215, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.login-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
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

/* رابط التسجيل */
.register-link {
  text-align: center;
  margin-top: 22px;
  color: #8e8ea2;
  font-size: 14px;
}

.register-link a {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
}

/* الإعلان */
.ad-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.ad-popup {
  background: #1a1c2e;
  width: 90%;
  max-width: 380px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.12);
  animation: slideUp 0.35s ease;
}

.ad-header {
  background: linear-gradient(135deg, #FFD700, #f0c000);
  padding: 15px;
  text-align: center;
}

.ad-header h2 {
  color: #0a1e2f;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.ad-body {
  padding: 18px 20px;
  max-height: 280px;
  overflow-y: auto;
  color: #c0c0d0;
  font-size: 13.5px;
  line-height: 1.75;
}

.ad-close-btn {
  width: 100%;
  padding: 15px;
  background: none;
  border: none;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  color: #FFD700;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(25px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* موبايل */
@media (max-width: 400px) {
  .login-card {
    padding: 28px 16px 36px;
  }
  .tab-btn {
    font-size: 12.5px;
  }
  .logo-box {
    width: 96px;
    height: 96px;
  }
  .logo-circle {
    width: 78px;
    height: 78px;
  }
  .logo-quarter {
    font-size: 16px;
  }
  .brand-title {
    font-size: 23px;
  }
}
</style>
