<template>
  <div class="login-page">
    <!-- زر العودة -->
    <button class="back-btn" @click="$router.go(-1)">
      <i class="fas fa-arrow-right"></i>
    </button>
    
    <!-- اللغة -->
    <div class="language-selector">
      <span>عربي</span>
      <i class="fas fa-sort-down"></i>
    </div>

    <!-- الشعار -->
    <div class="logo-section">
      <div class="logo-circle">
        <img :src="logo" class="logo-img" alt="Palm Treasure Logo" />
      </div>
      <h1 class="app-name">PALM TREASURE</h1>
    </div>

    <!-- زر الدعم العائم -->
    <div class="support-fab">
      <div class="telegram-badge">
        <i class="fab fa-telegram-plane"></i>
      </div>
      <i class="fas fa-headset"></i>
    </div>

    <!-- البطاقة الرئيسية -->
    <div class="main-card">
      <!-- تبويبات تسجيل الدخول -->
      <div class="tabs-container">
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
        {{ errorMessage }}
      </div>

      <!-- نموذج البريد الإلكتروني -->
      <template v-if="loginType === 'email'">
        <div class="input-wrapper">
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

      <!-- نموذج الهاتف -->
      <template v-if="loginType === 'phone'">
        <div class="phone-group">
          <div class="phone-row">
            <select v-model="countryCode" class="country-select-inline">
              <option value="">الرمز</option>
              <option value="+964">🇮🇶 +964</option>
              <option value="+966">🇸🇦 +966</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+965">🇰🇼 +965</option>
              <option value="+974">🇶🇦 +974</option>
              <option value="+973">🇧🇭 +973</option>
              <option value="+968">🇴🇲 +968</option>
              <option value="+962">🇯🇴 +962</option>
              <option value="+20">🇪🇬 +20</option>
              <option value="+963">🇸🇾 +963</option>
              <option value="+961">🇱🇧 +961</option>
              <option value="+218">🇱🇾 +218</option>
              <option value="+216">🇹🇳 +216</option>
              <option value="+213">🇩🇿 +213</option>
              <option value="+212">🇲🇦 +212</option>
              <option value="+222">🇲🇷 +222</option>
              <option value="+249">🇸🇩 +249</option>
              <option value="+967">🇾🇪 +967</option>
              <option value="+970">🇵🇸 +970</option>
              <option value="+90">🇹🇷 +90</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+39">🇮🇹 +39</option>
              <option value="+34">🇪🇸 +34</option>
            </select>
            <input
              type="tel"
              v-model="phoneNumber"
              placeholder="رقم الهاتف"
              class="form-input phone-number-input"
              :disabled="!countryCode"
              @input="validatePhoneNumber"
              @keyup.enter="loginUser"
              @focus="clearError"
            />
          </div>
          <span v-if="phoneError" class="field-error">{{ phoneError }}</span>
        </div>
      </template>

      <!-- كلمة المرور -->
      <div class="input-wrapper">
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
          class="fas fa-eye eye-icon" 
          :class="{ 'fa-eye-slash': showPassword }"
          @click="togglePassword"
        ></i>
      </div>

      <!-- زر تسجيل الدخول -->
      <button class="login-btn" @click="loginUser" :disabled="loading">
        <span v-if="!loading">تسجيل الدخول</span>
        <span v-else class="btn-loader"></span>
      </button>

      <!-- رابط التسجيل -->
      <p class="register-link">
        ليس لديك حساب؟
        <router-link to="/register">سجل</router-link>
      </p>
    </div>

    <!-- تسجيل الدخول عبر جوجل -->
    <div class="google-section">
      <div class="divider-text">
        <span>أو</span>
      </div>
      <button class="google-btn" @click="loginWithGoogle" :disabled="loading">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
        تسجيل الدخول عبر جوجل
      </button>
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
</template>

<script>
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, googleProvider } from "../firebase";
import router from "../router";
import logo from "../assets/palm-gold.png";

export default {
  data() {
    return {
      logo,
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
    async loginWithGoogle() {
      this.loading = true;
      this.errorMessage = "";
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
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
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            balance: 0,
            vipLevel: 0,
            createdAt: serverTimestamp(),
            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            invitedBy: ""
          });
        }
        
        const admins = ["azad.333388@gmail.com", "admin2@gmail.com", "owner@gmail.com"];
        if (admins.includes(user.email)) {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
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
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap');

* {
  font-family: 'Cairo', 'Tajawal', sans-serif;
}

.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1DBA9A 0%, #2B6B8A 30%, #1A1A2E 70%, #0A0C10 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: blur(20px);
  z-index: 0;
}

/* زر العودة */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  padding: 10px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: scale(1.1);
  color: #FFD500;
}

/* محدد اللغة */
.language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #FFFFFF;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.language-selector i {
  color: #FFD500;
  font-size: 14px;
  margin-top: -2px;
}

.language-selector:hover {
  opacity: 0.8;
}

/* الشعار */
.logo-section {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 30px;
}

.logo-circle {
  width: 100px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
}

.logo-img {
  width: 75px;
  height: 75px;
  object-fit: contain;
}

.app-name {
  color: #FFD500;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 3px;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* زر الدعم العائم */
.support-fab {
  position: fixed;
  right: 20px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  font-size: 24px;
  color: #2B2938;
}

.support-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.telegram-badge {
  position: absolute;
  top: -10px;
  right: -5px;
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
  box-shadow: 0 3px 10px rgba(0, 136, 204, 0.5);
}

/* البطاقة الرئيسية */
.main-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  background: rgba(43, 41, 56, 0.85);
  backdrop-filter: blur(25px);
  border-radius: 35px;
  padding: 35px 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* التبويبات */
.tabs-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 35px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.tab-btn.active {
  color: #FFD500;
  font-weight: 700;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -17px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #FFD500;
  border-radius: 3px;
}

.tab-btn:hover:not(.active) {
  color: rgba(255, 255, 255, 0.7);
}

/* رسالة الخطأ */
.error-message {
  background: rgba(255, 80, 80, 0.15);
  border: 1px solid rgba(255, 80, 80, 0.3);
  border-radius: 12px;
  padding: 12px 15px;
  margin-bottom: 20px;
  color: #FF6B6B;
  font-size: 13px;
  text-align: center;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* حقول الإدخال */
.input-wrapper {
  position: relative;
  margin-bottom: 18px;
}

.input-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #FFD500;
  font-size: 18px;
  z-index: 2;
  transition: all 0.3s ease;
}

.eye-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.eye-icon:hover {
  color: #FFD500;
}

.form-input {
  width: 100%;
  padding: 18px 55px 18px 50px;
  background: rgba(91, 88, 101, 0.5);
  border: 2px solid transparent;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
}

.form-input:focus {
  outline: none;
  border-color: rgba(255, 213, 0, 0.5);
  background: rgba(91, 88, 101, 0.7);
  box-shadow: 0 0 20px rgba(255, 213, 0, 0.1);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* مجموعة الهاتف */
.phone-group {
  margin-bottom: 18px;
}

.phone-row {
  display: flex;
  gap: 10px;
}

.country-select-inline {
  width: 120px;
  padding: 18px 15px;
  background: rgba(91, 88, 101, 0.5);
  border: 2px solid transparent;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  appearance: none;
}

.country-select-inline:focus {
  outline: none;
  border-color: rgba(255, 213, 0, 0.5);
}

.country-select-inline option {
  background: #2B2938;
  color: #FFFFFF;
}

.phone-number-input {
  flex: 1;
}

.field-error {
  color: #FF6B6B;
  font-size: 12px;
  margin-top: 8px;
  display: block;
  padding-right: 15px;
  font-weight: 500;
}

/* زر تسجيل الدخول */
.login-btn {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #FFD500 0%, #FFC700 100%);
  border: none;
  border-radius: 40px;
  color: #1A1A2E;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 213, 0, 0.3);
  letter-spacing: 1px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 213, 0, 0.5);
  background: linear-gradient(135deg, #FFE44D 0%, #FFD500 100%);
}

.login-btn:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(255, 213, 0, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* رابط التسجيل */
.register-link {
  text-align: center;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 500;
}

.register-link a {
  color: #FFD500;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  margin-right: 5px;
}

.register-link a:hover {
  color: #FFE44D;
  text-decoration: underline;
}

/* قسم جوجل */
.google-section {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  margin-top: 30px;
  margin-bottom: 40px;
}

.divider-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  margin-bottom: 20px;
  position: relative;
}

.divider-text::before,
.divider-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.divider-text::before {
  left: 0;
}

.divider-text::after {
  right: 0;
}

.google-btn {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.google-btn img {
  width: 22px;
  height: 22px;
}

.google-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loader */
.btn-loader {
  width: 24px;
  height: 24px;
  border: 3px solid #1A1A2E;
  border-top: 3px solid #FFD500;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  background: linear-gradient(135deg, #1A1A2E 0%, #2B2938 100%);
  width: 90%;
  max-width: 450px;
  border-radius: 25px;
  border: 2px solid #FFD500;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.ad-box h2 {
  background: linear-gradient(135deg, #FFD500 0%, #FFC700 100%);
  color: #1A1A2E;
  margin: 0;
  padding: 18px;
  font-size: 20px;
  text-align: center;
  font-weight: 800;
}

.ad-content {
  padding: 25px;
  color: #FFFFFF;
  font-size: 14px;
  line-height: 1.8;
  max-height: 350px;
  overflow-y: auto;
}

.ad-content::-webkit-scrollbar {
  width: 5px;
}

.ad-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.ad-content::-webkit-scrollbar-thumb {
  background: #FFD500;
  border-radius: 10px;
}

.ad-btn {
  width: 100%;
  padding: 18px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 213, 0, 0.3);
  color: #FFD500;
  cursor: pointer;
  font-weight: 800;
  font-size: 18px;
  transition: all 0.3s ease;
}

.ad-btn:hover {
  background: rgba(255, 213, 0, 0.1);
}

/* تحسينات للهواتف */
@media (max-width: 480px) {
  .login-page {
    padding: 15px;
  }
  
  .main-card {
    padding: 30px 20px;
    border-radius: 30px;
  }
  
  .tabs-container {
    gap: 20px;
  }
  
  .tab-btn {
    font-size: 14px;
  }
  
  .form-input {
    font-size: 15px;
    padding: 16px 50px 16px 45px;
  }
  
  .login-btn {
    font-size: 18px;
    padding: 18px;
  }
  
  .logo-circle {
    width: 85px;
    height: 85px;
  }
  
  .logo-img {
    width: 65px;
    height: 65px;
  }
  
  .app-name {
    font-size: 20px;
  }
  
  .support-fab {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

@media (max-width: 360px) {
  .tabs-container {
    gap: 15px;
  }
  
  .tab-btn {
    font-size: 13px;
  }
  
  .country-select-inline {
    width: 100px;
    font-size: 12px;
  }
}
</style>
