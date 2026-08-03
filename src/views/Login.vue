<template>
  <div class="login-page">
    <!-- الشريط العلوي -->
    <div class="top-bar">
      <button class="icon-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lang-switch">
        <span>عربي</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <polygon points="2,2 22,12 2,22" fill="#FFD700"/>
        </svg>
      </div>
    </div>

    <!-- منطقة الشعار -->
    <div class="hero-section">
      <div class="hero-bg">
        <!-- المكعبات ثلاثية الأبعاد -->
        <div class="cubes-container">
          <div class="cube cube-1">
            <div class="cube-face cube-front"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-right"></div>
          </div>
          <div class="cube cube-2">
            <div class="cube-face cube-front"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-right"></div>
          </div>
          <div class="cube cube-3">
            <div class="cube-face cube-front"></div>
            <div class="cube-face cube-top"></div>
            <div class="cube-face cube-right"></div>
          </div>
        </div>
        
        <!-- تأثير الإضاءة -->
        <div class="glow-effect"></div>
      </div>

      <!-- شعار SCFL -->
      <div class="logo-wrapper">
        <div class="logo-container">
          <div class="logo-inner">
            <div class="logo-text">
              <span class="letter">S</span>
              <span class="letter">E</span>
            </div>
            <div class="logo-divider"></div>
            <div class="logo-text">
              <span class="letter">F</span>
              <span class="letter">L</span>
            </div>
            <div class="logo-badge">SCFL</div>
          </div>
        </div>
        <h1 class="brand-title">SCFL</h1>
      </div>
    </div>

    <!-- بطاقة تسجيل الدخول -->
    <div class="login-card">
      <!-- زر الدعم -->
      <div class="support-btn">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="white"/>
          <path d="M30 55 L50 35 L65 45 L55 60 L45 65 L35 50 Z" fill="#0099CC"/>
          <circle cx="65" cy="40" r="12" fill="#0099CC"/>
        </svg>
      </div>

      <!-- اختيار نوع الدخول -->
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
        <span>⚠️</span>
        {{ errorMessage }}
      </div>

      <!-- حقل البريد الإلكتروني -->
      <div v-if="loginType === 'email'" class="input-group">
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#FFD700" stroke-width="2"/>
            <path d="M22 6L12 13L2 6" stroke="#FFD700" stroke-width="2"/>
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

      <!-- حقل رقم الهاتف -->
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

      <!-- حقل كلمة المرور -->
      <div class="input-group">
        <div class="input-wrapper">
          <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#FFD700" stroke-width="2"/>
            <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#FFD700" stroke-width="2"/>
          </svg>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="كلمة سر الدخول"
            class="input-field"
            @keyup.enter="loginUser"
          />
          <button class="toggle-password" @click="showPassword = !showPassword">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path v-if="!showPassword" d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#8E8EA2" stroke-width="2"/>
              <circle v-if="!showPassword" cx="12" cy="12" r="3" stroke="#8E8EA2" stroke-width="2"/>
              <path v-else d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#8E8EA2" stroke-width="2"/>
              <line v-else x1="1" y1="23" x2="23" y2="1" stroke="#8E8EA2" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- زر تسجيل الدخول -->
      <button class="login-btn" @click="loginUser" :disabled="loading">
        <span v-if="!loading">تسجيل الدخول</span>
        <div v-else class="spinner"></div>
      </button>

      <!-- رابط التسجيل -->
      <p class="register-link">
        لا حساب؟ <router-link to="/register">يسجل</router-link>
      </p>
    </div>
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
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

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
    // إخفاء الإعلان بعد 5 ثواني تلقائياً
    setTimeout(() => {
      this.showAd = false;
    }, 5000);
  },
  methods: {
    async loginUser() {
      this.errorMessage = '';
      
      // التحقق من صحة المدخلات
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
      
      // محاكاة عملية تسجيل الدخول
      setTimeout(() => {
        this.loading = false;
        // هنا يتم تنفيذ عملية تسجيل الدخول الفعلية
        this.$router.push('/home');
      }, 1500);
    },
    closeAd() {
      this.showAd = false;
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
  background: linear-gradient(180deg, #0a2e3f 0%, #1a1c2e 50%, #12141f 100%);
  display: flex;
  flex-direction: column;
  direction: rtl;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

/* الشريط العلوي */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  z-index: 10;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s;
}

.icon-btn:hover {
  transform: scale(1.1);
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.lang-switch svg {
  margin-right: 2px;
}

/* منطقة الهيرو */
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 20px;
  z-index: 5;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* المكعبات ثلاثية الأبعاد */
.cubes-container {
  position: relative;
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cube {
  position: absolute;
  width: 60px;
  height: 60px;
  transform-style: preserve-3d;
  animation: floatCube 4s ease-in-out infinite;
}

.cube-1 {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.cube-2 {
  top: 40%;
  right: 25%;
  animation-delay: 1.5s;
  transform: scale(0.7);
}

.cube-3 {
  bottom: 10%;
  left: 45%;
  animation-delay: 3s;
  transform: scale(0.5);
}

.cube-face {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.4;
}

.cube-front {
  background: #00e5e5;
  transform: translateZ(30px);
}

.cube-top {
  background: #00b2b2;
  transform: rotateX(90deg) translateZ(30px);
}

.cube-right {
  background: #008080;
  transform: rotateY(90deg) translateZ(30px);
}

@keyframes floatCube {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  50% { transform: rotate(15deg) translateY(-10px); }
}

.glow-effect {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 229, 229, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
}

/* شعار SCFL */
.logo-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-container {
  background: white;
  width: 110px;
  height: 110px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(0, 229, 229, 0.15);
  margin-bottom: 15px;
  position: relative;
}

.logo-container::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(0, 229, 229, 0.2), transparent);
  z-index: -1;
}

.logo-inner {
  width: 90px;
  height: 90px;
  border: 2px solid #0a1e2f;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-text {
  display: flex;
  gap: 12px;
  font-weight: 900;
  font-size: 20px;
  color: #0a1e2f;
  letter-spacing: 1px;
}

.logo-divider {
  width: 55px;
  height: 2px;
  background: #0a1e2f;
  margin: 2px 0;
  border-radius: 2px;
}

.logo-badge {
  position: absolute;
  background: #0a1e2f;
  color: white;
  font-size: 7px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 2px;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 0.5px;
}

.brand-title {
  color: #FFD700;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 4px;
  text-shadow: 0 2px 20px rgba(255, 215, 0, 0.15);
  margin: 0;
}

/* بطاقة تسجيل الدخول */
.login-card {
  background: #26263a;
  flex: 1;
  border-radius: 35px 35px 0 0;
  padding: 30px 24px 35px;
  margin-top: 10px;
  position: relative;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

/* زر الدعم */
.support-btn {
  position: absolute;
  top: -25px;
  right: 25px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.3s;
  z-index: 20;
}

.support-btn:hover {
  transform: scale(1.05);
}

.support-btn svg {
  filter: drop-shadow(0 4px 12px rgba(0, 153, 204, 0.3));
}

/* التبويبات */
.tab-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  background: none;
  border: none;
  color: #8e8ea2;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 0 12px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  flex: 1;
  text-align: center;
}

.tab-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background: #FFD700;
  transition: width 0.3s;
}

.tab-btn.active {
  color: #FFD700;
}

.tab-btn.active::after {
  width: 100%;
}

.tab-btn:hover {
  color: #FFD700;
}

/* حقول الإدخال */
.input-group {
  margin-bottom: 16px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 15px;
  color: #FFD700;
  z-index: 2;
}

.input-field {
  width: 100%;
  height: 56px;
  padding: 0 48px 0 20px;
  background: #35354d;
  border: 2px solid transparent;
  border-radius: 14px;
  color: white;
  font-size: 15px;
  text-align: right;
  transition: all 0.3s;
}

.input-field::placeholder {
  color: #8e8ea2;
}

.input-field:focus {
  outline: none;
  border-color: #FFD700;
  background: #3a3a55;
}

.input-field:focus + .input-icon {
  color: #FFD700;
}

/* حقل الهاتف */
.phone-input-wrapper {
  display: flex;
  gap: 10px;
}

.country-select {
  width: 110px;
  height: 56px;
  padding: 0 12px;
  background: #35354d;
  border: 2px solid transparent;
  border-radius: 14px;
  color: white;
  font-size: 14px;
  text-align: center;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s;
}

.country-select:focus {
  outline: none;
  border-color: #FFD700;
}

.country-select option {
  background: #26263a;
}

.phone-input {
  flex: 1;
  padding-right: 20px;
}

.phone-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* زر إظهار كلمة المرور */
.toggle-password {
  position: absolute;
  left: 15px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.3s;
}

.toggle-password:hover {
  opacity: 0.7;
}

/* رسالة الخطأ */
.error-message {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  padding: 10px 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* زر تسجيل الدخول */
.login-btn {
  width: 100%;
  height: 56px;
  background: linear-gradient(135deg, #FFD700, #f5c800);
  border: none;
  border-radius: 28px;
  color: #0a1e2f;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(255, 215, 0, 0.2);
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(255, 215, 0, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #0a1e2f;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* رابط التسجيل */
.register-link {
  text-align: center;
  margin-top: 20px;
  color: #8e8ea2;
  font-size: 14px;
}

.register-link a {
  color: #FFD700;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.register-link a:hover {
  color: #ffe44d;
  text-decoration: underline;
}

/* الإعلان المنبثق */
.ad-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.ad-popup {
  background: #1a1c2e;
  width: 92%;
  max-width: 400px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.15);
  animation: slideUp 0.4s ease;
}

.ad-header {
  background: linear-gradient(135deg, #FFD700, #f5c800);
  padding: 16px;
  text-align: center;
}

.ad-header h2 {
  color: #0a1e2f;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.ad-body {
  padding: 20px 22px;
  max-height: 300px;
  overflow-y: auto;
  color: #c0c0d0;
  font-size: 14px;
  line-height: 1.8;
}

.ad-body::-webkit-scrollbar {
  width: 4px;
}

.ad-body::-webkit-scrollbar-thumb {
  background: #FFD700;
  border-radius: 4px;
}

.ad-close-btn {
  width: 100%;
  padding: 16px;
  background: none;
  border: none;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  color: #FFD700;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s;
}

.ad-close-btn:hover {
  background: rgba(255, 215, 0, 0.05);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* استجابة للشاشات الصغيرة */
@media (max-width: 480px) {
  .login-card {
    padding: 24px 16px 30px;
    border-radius: 30px 30px 0 0;
  }
  
  .tab-btn {
    font-size: 13px;
    padding: 8px 0 10px;
  }
  
  .input-field {
    height: 50px;
    font-size: 14px;
  }
  
  .logo-container {
    width: 95px;
    height: 95px;
  }
  
  .logo-inner {
    width: 78px;
    height: 78px;
  }
  
  .logo-text {
    font-size: 17px;
    gap: 10px;
  }
  
  .logo-divider {
    width: 45px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .country-select {
    width: 95px;
    height: 50px;
    font-size: 12px;
  }
  
  .support-btn {
    width: 42px;
    height: 42px;
    right: 18px;
    top: -22px;
  }
}
</style>
