<template>
  <div class="login-page">
    <!-- صورة الخلفية في الأعلى -->
    <div class="hero-image">
      <img :src="loginBackground" alt="Background" />
    </div>

    <!-- طبقة تدرج شفافة فوق الصورة -->
    <div class="hero-overlay"></div>

    <!-- زر الرجوع -->
    <button class="back-btn" @click="$router.go(-1)">
      <i class="fas fa-arrow-left"></i>
    </button>

    <!-- محدد اللغة -->
    <div class="language-selector">
      <span>عربي</span>
      <span class="lang-arrow">▼</span>
    </div>

    <!-- الشعار واسم التطبيق -->
    <div class="logo-section">
      <div class="logo-frame">
        <div class="logo-white">
          <img :src="logo" class="logo-img" alt="Logo" />
        </div>
      </div>
      <h1 class="app-name">SCFL</h1>
    </div>

    <!-- المحتوى الرئيسي -->
    <div class="content-wrapper">
      <!-- البطاقة الرئيسية -->
      <div class="main-card">
        <!-- التبويبات -->
        <div class="tabs">
          <span 
            class="tab" 
            :class="{ active: loginType === 'email' }"
            @click="loginType = 'email'"
          >
            تسجيل الدخول بالبريد الإلكتروني
          </span>
          <span 
            class="tab" 
            :class="{ active: loginType === 'phone' }"
            @click="loginType = 'phone'"
          >
            تسجيل الدخول عبر الهاتف
          </span>
        </div>

        <!-- رسالة الخطأ -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- حقل البريد الإلكتروني -->
        <template v-if="loginType === 'email'">
          <div class="input-group">
            <i class="fas fa-envelope input-icon"></i>
            <input
              type="email"
              v-model="email"
              placeholder="البريد الإلكتروني"
              class="form-input"
              @keyup.enter="loginUser"
              @focus="clearError"
            />
          </div>
        </template>

        <!-- حقل الهاتف -->
        <template v-if="loginType === 'phone'">
          <div class="phone-input-group">
            <div class="phone-wrapper">
              <select v-model="countryCode" class="country-select">
                <option value="">الرمز</option>
                <option value="+964">+964</option>
                <option value="+966">+966</option>
                <option value="+971">+971</option>
                <option value="+965">+965</option>
                <option value="+974">+974</option>
                <option value="+973">+973</option>
                <option value="+968">+968</option>
                <option value="+962">+962</option>
                <option value="+20">+20</option>
                <option value="+963">+963</option>
                <option value="+961">+961</option>
                <option value="+218">+218</option>
                <option value="+216">+216</option>
                <option value="+213">+213</option>
                <option value="+212">+212</option>
                <option value="+222">+222</option>
                <option value="+249">+249</option>
                <option value="+967">+967</option>
                <option value="+970">+970</option>
                <option value="+90">+90</option>
                <option value="+44">+44</option>
                <option value="+1">+1</option>
                <option value="+49">+49</option>
                <option value="+33">+33</option>
                <option value="+39">+39</option>
                <option value="+34">+34</option>
              </select>
              <input
                type="tel"
                v-model="phoneNumber"
                placeholder="رقم الهاتف"
                class="form-input phone-input"
                :disabled="!countryCode"
                @input="validatePhoneNumber"
                @keyup.enter="loginUser"
                @focus="clearError"
              />
            </div>
            <span v-if="phoneError" class="field-error">{{ phoneError }}</span>
          </div>
        </template>

        <!-- حقل كلمة المرور -->
        <div class="input-group">
          <i class="fas fa-lock input-icon"></i>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="كلمة المرور"
            class="form-input"
            @keyup.enter="loginUser"
            @focus="clearError"
          />
          <i 
            class="fas eye-icon"
            :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
            @click="togglePassword"
          ></i>
        </div>

        <!-- زر تسجيل الدخول -->
        <button class="login-btn" @click="loginUser" :disabled="loading">
          <span v-if="!loading">تسجيل الدخول</span>
          <span v-else class="btn-loader"></span>
        </button>

        <!-- رابط التسجيل -->
        <p class="register-text">
          لا حساب؟ <router-link to="/register" class="register-link">سجل</router-link>
        </p>
      </div>

      <!-- زر الدعم -->
      <div class="support-fab">
        <div class="telegram-icon">
          <i class="fab fa-telegram-plane"></i>
        </div>
        <div class="headset-icon">
          <i class="fas fa-headset"></i>
        </div>
      </div>
    </div>

    <!-- Popup إعلان -->
    <div id="companyAd" class="ad-overlay" v-if="showAd">
      <div class="ad-box">
        <h2>✨ إعلان ✨</h2>
        <div class="ad-content">
          <p>🎉🎉🎉🎉 مرحبا بالجميع! تأسست Palm Treasure في سنغافورة في 20 أغسطس 2021 ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة. نحن شركة استثمار في التجارة الإلكترونية مع فريق تقني قوي وقوة مالية قوية.
            <br><br>
            يتعاون Palm Treasure مع عشرات شركات التجارة الإلكترونية مثل Amazon و eBay و Tiktok و Aliexpress و Alibaba و Shopee ، إلخ. لمساعدة التجار على زيادة مبيعات المنتجات الخاصة بهم ، ويمكننا أيضًا تحقيق أرباح منه. عندما تتصاعد على منصتنا ، تشارك في مساعدة البائعين على زيادة المبيعات ، بحيث يمكنك أيضًا كسب المال منها. حتى يتمكن الجميع من إعادة الشحن بثقة ، هذا مشروع جيد لجني الأموال. 🔇🔇🔇
            <br><br>
            👍1: الحد الأدنى لمبلغ إعادة الشحن: 12 USDT ، الحد الأدنى للسحب النقدي: 3 USDT
            <br>
            💰2: تستثمر المنصة على مستوى العالم ، لذا فإن الاستثمار يدعم فقط إعادة شحن العملة المشفرة.
            <br>
            🌈3: وقت إعادة تعيين المهمة هو الساعة 12 ظهراً في سنغافورة. يمكنك الحصول على الربح من خلال استكمال أوامر التاجر كل يوم (مرة واحدة في اليوم ، صالحة لمدة 365 يومًا).
            <br>
            🕯4: يمكنك سحب النقد مرة واحدة فقط في اليوم ، لا يوجد حد زمني ، يمكنك سحب النقد في أي وقت ، ووقت الانسحاب هو 1 إلى 5 دقائق ، والحد الأدنى لمبلغ السحب هو 3 USDT ، ولا يوجد حد أعلى.
            <br><br>
            عندما يصل مبلغ إعادة الشحن إلى المبلغ المقابل التالي ، سيتم ترقية الحساب تلقائيًا إلى VIP. كلما زادت مبلغ إعادة الشحن ، كلما زاد عدد USDT في اليوم!
          </p>
        </div>
        <button @click="closeAd" class="ad-btn">أنا أعرف</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import router from "../router";
import logo from "../assets/palm-gold.png";
import loginBackground from "@/assets/login-bg.png";

export default {
  data() {
    return {
      logo,
      loginBackground,
      loginType: 'email',
      email: "",
      countryCode: "",
      phoneNumber: "",
      fullPhoneNumber: "",
      password: "",
      showPassword: false,
      loading: false,
      showAd: false,
      adTimer: null,
      phoneError: "",
      errorMessage: "",
    };
  },
  mounted() {
    document.addEventListener('keydown', this.handleEscKey);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscKey);
    if (this.adTimer) {
      clearTimeout(this.adTimer);
    }
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    clearError() {
      this.errorMessage = "";
      this.phoneError = "";
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validatePhoneNumber() {
      if (!this.countryCode) {
        this.phoneError = "الرجاء اختيار رمز الدولة";
        return false;
      }
      if (!this.phoneNumber) {
        this.phoneError = "الرجاء إدخال رقم الهاتف";
        return false;
      }
      const cleanPhone = this.phoneNumber.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        this.phoneError = "رقم الهاتف يجب أن يكون بين 7 و 15 رقم";
        return false;
      }
      this.fullPhoneNumber = this.countryCode + cleanPhone;
      this.phoneError = "";
      return true;
    },
    generatePhoneEmail(phoneNumber) {
      const cleanPhone = phoneNumber.replace(/\+/g, '');
      return `${cleanPhone}@phone.app`;
    },
    getErrorMessage(error) {
      if (error.code === 'auth/user-disabled') {
        return 'تم حظر حسابك، تواصل مع الدعم';
      }
      if (error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/invalid-email') {
        if (this.loginType === 'phone') {
          return 'رقم الهاتف أو كلمة المرور غير صحيحة.';
        } else {
          return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        }
      }
      if (error.code === 'auth/too-many-requests') {
        return 'تم تعليق الحساب مؤقتاً لكثرة المحاولات. يرجى المحاولة لاحقاً.';
      }
      if (error.code === 'auth/network-request-failed') {
        return 'حدث خطأ في الاتصال. يرجى التحقق من الإنترنت.';
      }
      return 'حدث خطأ. يرجى المحاولة لاحقاً.';
    },
    handleEscKey(event) {
      if (event.key === 'Escape' && this.showAd) {
        this.closeAd();
      }
    },
    async loginUser() {
      this.errorMessage = "";
      
      let loginEmail = this.email;
      
      if (this.loginType === 'phone') {
        if (!this.validatePhoneNumber()) return;
        loginEmail = this.generatePhoneEmail(this.fullPhoneNumber);
      } else {
        if (!this.validateEmail(this.email)) {
          if (this.loginType === 'phone') {
            this.errorMessage = "رقم الهاتف أو كلمة المرور غير صحيحة.";
          } else {
            this.errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
          }
          return;
        }
      }

      if (this.password.length < 6) {
        if (this.loginType === 'phone') {
          this.errorMessage = "رقم الهاتف أو كلمة المرور غير صحيحة.";
        } else {
          this.errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        }
        return;
      }

      this.loading = true;
      const auth = getAuth();
      try {
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, this.password);
        const user = userCredential.user;
        
        if (user.disabled === true) {
          await signOut(auth);
          this.errorMessage = "تم حظر حسابك، تواصل مع الدعم";
          this.loading = false;
          return;
        }
        
        await user.reload();
        const updatedUser = auth.currentUser;
        
        if (updatedUser && updatedUser.disabled === true) {
          await signOut(auth);
          this.errorMessage = "تم حظر حسابك، تواصل مع الدعم";
          this.loading = false;
          return;
        }
        
        const admins = ["azad.333388@gmail.com", "admin2@gmail.com", "owner@gmail.com"];
        if (admins.includes(user.email)) {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      } catch (error) {
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
    closeAd() {
      this.showAd = false;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Cairo', sans-serif;
}

.login-page {
  min-height: 100vh;
  background: #0B0E16;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* صورة الخلفية */
.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 450px;
  overflow: hidden;
  z-index: 0;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* طبقة تدرج فوق الصورة */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 450px;
  background: linear-gradient(
    to bottom,
    rgba(11, 14, 22, 0) 0%,
    rgba(11, 14, 22, 0.15) 40%,
    rgba(11, 14, 22, 0.85) 80%,
    rgba(11, 14, 22, 1) 100%
  );
  z-index: 1;
}

/* زر الرجوع */
.back-btn {
  position: absolute;
  top: 18px;
  left: 18px;
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  padding: 0;
}

.back-btn:active {
  transform: scale(0.92);
}

/* محدد اللغة */
.language-selector {
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  z-index: 10;
  padding: 6px 8px;
}

.language-selector span:first-child {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
}

.lang-arrow {
  color: #FFD400;
  font-size: 9px;
  margin-top: -1px;
}

/* قسم الشعار */
.logo-section {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  margin-bottom: 16px;
}

.logo-frame {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 8px;
}

.logo-white {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.logo-img {
  width: 68px;
  height: 68px;
  object-fit: contain;
}

.app-name {
  color: #FFD400;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 4px;
  margin: 0;
  margin-top: 2px;
  text-transform: uppercase;
}

/* المحتوى الرئيسي */
.content-wrapper {
  position: relative;
  z-index: 2;
  width: 95%;
  max-width: 430px;
  margin-bottom: 30px;
}

/* البطاقة الرئيسية */
.main-card {
  width: 100%;
  background: rgba(54, 54, 65, 0.72);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 40px;
  padding: 32px 26px 28px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.06);
  margin-top: -8px;
}

/* التبويبات */
.tabs {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 28px;
}

.tab {
  color: rgba(255, 255, 255, 0.4);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  padding: 4px 0;
  white-space: nowrap;
}

.tab.active {
  color: #FFD400;
  font-weight: 700;
}

/* رسالة الخطأ */
.error-message {
  background: rgba(255, 70, 70, 0.12);
  border: 1px solid rgba(255, 70, 70, 0.2);
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 18px;
  color: #FF6B6B;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

/* مجموعة الإدخال */
.input-group {
  position: relative;
  margin-bottom: 16px;
}

.input-icon {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #FFD400;
  font-size: 22px;
  z-index: 2;
  pointer-events: none;
}

.eye-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 22px;
  cursor: pointer;
  z-index: 2;
  transition: color 0.2s ease;
}

.eye-icon:active {
  color: #FFD400;
}

.form-input {
  width: 100%;
  height: 64px;
  padding: 0 52px 0 48px;
  background: #5a5864;
  border: none;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: all 0.2s ease;
  line-height: 64px;
}

.form-input::placeholder {
  color: #B8B8B8;
  font-weight: 400;
}

.form-input:focus {
  background: #63616d;
  box-shadow: 0 0 0 2px rgba(255, 212, 0, 0.15);
}

.form-input:disabled {
  opacity: 0.5;
}

/* مجموعة الهاتف */
.phone-input-group {
  margin-bottom: 16px;
}

.phone-wrapper {
  display: flex;
  gap: 10px;
}

.country-select {
  width: 100px;
  height: 64px;
  padding: 0 12px;
  background: #5a5864;
  border: none;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 10 10'%3E%3Cpath d='M5 7L1 3h8z' fill='%23FFD400'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 12px center;
  background-size: 12px;
}

.country-select:focus {
  background: #63616d;
}

.country-select option {
  background: #3A3748;
  color: #FFFFFF;
}

.phone-input {
  flex: 1;
}

.field-error {
  color: #FF6B6B;
  font-size: 13px;
  margin-top: 6px;
  display: block;
  padding-right: 14px;
  font-weight: 500;
}

/* زر تسجيل الدخول */
.login-btn {
  width: 100%;
  height: 76px;
  background: #FFD400;
  border: none;
  border-radius: 50px;
  color: #1A1A2E;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 22px;
  margin-left: 0;
  margin-right: 0;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.login-btn:active:not(:disabled) {
  transform: scale(0.96);
  background: #E8C400;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* نص التسجيل */
.register-text {
  text-align: center;
  margin-top: 22px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 15px;
  font-weight: 500;
}

.register-link {
  color: #FFD400;
  text-decoration: none;
  font-weight: 700;
}

.register-link:active {
  opacity: 0.7;
}

/* Loader الزر */
.btn-loader {
  width: 26px;
  height: 26px;
  border: 3px solid #1A1A2E;
  border-top: 3px solid transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* زر الدعم */
.support-fab {
  position: absolute;
  right: -5px;
  top: 150px;
  width: 56px;
  height: 56px;
  cursor: pointer;
  z-index: 3;
  transition: transform 0.2s ease;
}

.support-fab:active {
  transform: scale(1.08);
}

.telegram-icon {
  position: absolute;
  top: -8px;
  right: -2px;
  width: 28px;
  height: 28px;
  background: #0088CC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
  font-size: 14px;
  color: #FFFFFF;
  box-shadow: 0 3px 12px rgba(0, 136, 204, 0.5);
  z-index: 2;
}

.headset-icon {
  width: 56px;
  height: 56px;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.35);
  font-size: 24px;
  color: #2B2938;
}

/* الإعلان */
.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.ad-box {
  background: #1A1A2E;
  width: 90%;
  max-width: 400px;
  border-radius: 25px;
  border: 1px solid #FFD400;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.ad-box h2 {
  background: #FFD400;
  color: #1A1A2E;
  margin: 0;
  padding: 18px;
  font-size: 18px;
  text-align: center;
  font-weight: 700;
}

.ad-content {
  padding: 22px;
  color: #FFFFFF;
  font-size: 13px;
  line-height: 1.8;
  max-height: 320px;
  overflow-y: auto;
}

.ad-content::-webkit-scrollbar {
  width: 4px;
}

.ad-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.ad-content::-webkit-scrollbar-thumb {
  background: #FFD400;
  border-radius: 10px;
}

.ad-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 212, 0, 0.2);
  color: #FFD400;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
}

.ad-btn:active {
  background: rgba(255, 212, 0, 0.1);
}

/* تحسينات الشاشات الصغيرة */
@media (max-width: 480px) {
  .hero-image,
  .hero-overlay {
    height: 400px;
  }
  
  .logo-section {
    margin-top: 60px;
    margin-bottom: 12px;
  }
  
  .logo-frame {
    width: 110px;
    height: 110px;
  }
  
  .logo-white {
    width: 110px;
    height: 110px;
    border-radius: 28px;
  }
  
  .logo-img {
    width: 62px;
    height: 62px;
  }
  
  .app-name {
    font-size: 20px;
    letter-spacing: 3px;
  }
  
  .content-wrapper {
    width: 94%;
  }
  
  .main-card {
    padding: 28px 20px 24px;
    border-radius: 36px;
  }
  
  .tabs {
    gap: 24px;
    margin-bottom: 24px;
  }
  
  .tab {
    font-size: 14px;
  }
  
  .form-input {
    height: 60px;
    font-size: 15px;
    padding: 0 48px 0 44px;
    line-height: 60px;
  }
  
  .country-select {
    height: 60px;
    font-size: 14px;
    width: 95px;
    background-position: left 10px center;
  }
  
  .login-btn {
    height: 70px;
    font-size: 20px;
  }
  
  .support-fab {
    right: -3px;
    top: 130px;
    width: 52px;
    height: 52px;
  }
  
  .headset-icon {
    width: 52px;
    height: 52px;
    font-size: 22px;
  }
  
  .telegram-icon {
    width: 26px;
    height: 26px;
    font-size: 13px;
    top: -7px;
    right: -1px;
  }
  
  .input-icon,
  .eye-icon {
    font-size: 20px;
  }
  
  .input-icon {
    right: 16px;
  }
  
  .eye-icon {
    left: 16px;
  }
}

@media (max-width: 390px) {
  .hero-image,
  .hero-overlay {
    height: 370px;
  }
  
  .logo-section {
    margin-top: 50px;
    margin-bottom: 10px;
  }
  
  .logo-frame {
    width: 100px;
    height: 100px;
  }
  
  .logo-white {
    width: 100px;
    height: 100px;
    border-radius: 24px;
  }
  
  .logo-img {
    width: 56px;
    height: 56px;
  }
  
  .app-name {
    font-size: 18px;
    letter-spacing: 2px;
  }
  
  .content-wrapper {
    width: 95%;
  }
  
  .main-card {
    padding: 24px 16px 22px;
    border-radius: 32px;
  }
  
  .tabs {
    gap: 20px;
    margin-bottom: 22px;
  }
  
  .tab {
    font-size: 13px;
    white-space: normal;
    text-align: center;
  }
  
  .form-input {
    height: 56px;
    font-size: 14px;
    padding: 0 44px 0 40px;
    line-height: 56px;
  }
  
  .country-select {
    height: 56px;
    font-size: 13px;
    width: 90px;
    background-position: left 8px center;
  }
  
  .login-btn {
    height: 64px;
    font-size: 18px;
    border-radius: 44px;
  }
  
  .support-fab {
    right: -2px;
    top: 110px;
    width: 48px;
    height: 48px;
  }
  
  .headset-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .telegram-icon {
    width: 24px;
    height: 24px;
    font-size: 12px;
    top: -6px;
    right: -1px;
  }
  
  .input-icon,
  .eye-icon {
    font-size: 18px;
  }
  
  .input-icon {
    right: 14px;
  }
  
  .eye-icon {
    left: 14px;
  }
}

@media (max-width: 360px) {
  .hero-image,
  .hero-overlay {
    height: 340px;
  }
  
  .logo-section {
    margin-top: 45px;
    margin-bottom: 8px;
  }
  
  .logo-frame {
    width: 90px;
    height: 90px;
  }
  
  .logo-white {
    width: 90px;
    height: 90px;
    border-radius: 22px;
  }
  
  .logo-img {
    width: 50px;
    height: 50px;
  }
  
  .app-name {
    font-size: 16px;
    letter-spacing: 2px;
  }
  
  .content-wrapper {
    width: 96%;
  }
  
  .main-card {
    padding: 20px 14px 18px;
    border-radius: 28px;
  }
  
  .tabs {
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .tab {
    font-size: 12px;
    white-space: normal;
    text-align: center;
  }
  
  .form-input {
    height: 52px;
    font-size: 13px;
    padding: 0 40px 0 36px;
    line-height: 52px;
    border-radius: 16px;
  }
  
  .country-select {
    height: 52px;
    font-size: 12px;
    width: 82px;
    background-position: left 6px center;
  }
  
  .login-btn {
    height: 58px;
    font-size: 17px;
    border-radius: 40px;
  }
  
  .support-fab {
    right: -1px;
    top: 95px;
    width: 44px;
    height: 44px;
  }
  
  .headset-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
  
  .telegram-icon {
    width: 22px;
    height: 22px;
    font-size: 11px;
    top: -5px;
    right: 0px;
  }
  
  .input-icon,
  .eye-icon {
    font-size: 16px;
  }
  
  .input-icon {
    right: 12px;
  }
  
  .eye-icon {
    left: 12px;
  }
}
</style>
