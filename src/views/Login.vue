<template>
  <div class="login-page">
    <!-- مكعبات ثلاثية الأبعاد في الخلفية -->
    <div class="bg-cubes">
      <div class="cube cube-1"></div>
      <div class="cube cube-2"></div>
      <div class="cube cube-3"></div>
    </div>

    <!-- زر الرجوع -->
    <button class="back-btn" @click="$router.go(-1)">
      <i class="fas fa-chevron-left"></i>
    </button>

    <!-- محدد اللغة -->
    <div class="language-selector">
      <span>عربي</span>
      <span class="lang-arrow">▼</span>
    </div>

    <!-- الشعار واسم التطبيق -->
    <div class="logo-section">
      <div class="logo-outer-ring">
        <div class="logo-circle">
          <img :src="logo" class="logo-img" alt="Logo" />
        </div>
      </div>
      <h1 class="app-name">SCFL</h1>
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
      <p class="register-text">
        لا حساب؟ <router-link to="/register" class="register-link">سجل</router-link>
      </p>
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
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Cairo', sans-serif;
}

.login-page {
  min-height: 100vh;
  background: linear-gradient(160deg, 
    #1DBA9A 0%, 
    #1F8A7A 15%, 
    #1F556E 35%, 
    #1A2A4A 55%, 
    #0B0E16 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

/* المكعبات ثلاثية الأبعاد في الخلفية */
.bg-cubes {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  z-index: 0;
  pointer-events: none;
}

.cube {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(29, 186, 154, 0.08);
  border: 1px solid rgba(29, 186, 154, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  transform: rotate(45deg);
}

.cube-1 {
  top: 30%;
  left: 20%;
  width: 70px;
  height: 70px;
  animation: floatCube 8s ease-in-out infinite;
}

.cube-2 {
  top: 50%;
  right: 15%;
  width: 90px;
  height: 90px;
  animation: floatCube 10s ease-in-out infinite reverse;
}

.cube-3 {
  bottom: 20%;
  left: 40%;
  width: 60px;
  height: 60px;
  animation: floatCube 7s ease-in-out infinite;
}

@keyframes floatCube {
  0%, 100% {
    transform: rotate(45deg) translateY(0px);
  }
  50% {
    transform: rotate(45deg) translateY(-15px);
  }
}

/* زر الرجوع */
.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: none;
  color: #FFFFFF;
  font-size: 22px;
  cursor: pointer;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
  padding: 0;
}

.back-btn:active {
  transform: scale(1.15);
}

/* محدد اللغة */
.language-selector {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  z-index: 10;
  padding: 8px 12px;
}

.language-selector span:first-child {
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
}

.lang-arrow {
  color: #FFD500;
  font-size: 10px;
  margin-top: -2px;
}

/* قسم الشعار */
.logo-section {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
  margin-bottom: 35px;
}

.logo-outer-ring {
  width: 115px;
  height: 115px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.logo-circle {
  width: 100px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.logo-img {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.app-name {
  color: #FFD500;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
  text-transform: uppercase;
}

/* زر الدعم العائم */
.support-fab {
  position: fixed;
  right: 20px;
  bottom: 50px;
  width: 56px;
  height: 56px;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  z-index: 100;
  transition: all 0.25s ease;
  font-size: 22px;
  color: #2B2938;
}

.support-fab:active {
  transform: scale(1.1);
}

.telegram-badge {
  position: absolute;
  top: -8px;
  right: -4px;
  width: 26px;
  height: 26px;
  background: #0088CC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
  font-size: 12px;
  color: #FFFFFF;
  box-shadow: 0 3px 10px rgba(0, 136, 204, 0.4);
}

/* البطاقة الرئيسية */
.main-card {
  position: relative;
  z-index: 2;
  width: 90%;
  max-width: 390px;
  background: rgba(65, 65, 80, 0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 35px;
  padding: 38px 28px 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 50px;
}

/* التبويبات */
.tabs {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
}

.tab {
  color: rgba(255, 255, 255, 0.45);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
  padding: 4px 0;
}

.tab.active {
  color: #FFD500;
  font-weight: 700;
}

/* رسالة الخطأ */
.error-message {
  background: rgba(255, 70, 70, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 22px;
  color: #FF6B6B;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  backdrop-filter: blur(10px);
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
  color: #FFD500;
  font-size: 17px;
  z-index: 2;
  pointer-events: none;
}

.eye-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 17px;
  cursor: pointer;
  z-index: 2;
  transition: color 0.25s ease;
}

.eye-icon:hover {
  color: #FFD500;
}

.form-input {
  width: 100%;
  height: 60px;
  padding: 0 50px 0 45px;
  background: rgba(93, 90, 103, 0.65);
  border: none;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: background 0.25s ease, box-shadow 0.25s ease;
}

.form-input::placeholder {
  color: #B8B8B8;
  font-weight: 400;
}

.form-input:focus {
  background: rgba(93, 90, 103, 0.85);
  box-shadow: 0 0 0 3px rgba(255, 213, 0, 0.1);
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
  width: 105px;
  height: 60px;
  padding: 0 12px;
  background: rgba(93, 90, 103, 0.65);
  border: none;
  border-radius: 20px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: background 0.25s ease;
  appearance: none;
  -webkit-appearance: none;
}

.country-select:focus {
  background: rgba(93, 90, 103, 0.85);
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
  font-size: 12px;
  margin-top: 8px;
  display: block;
  padding-right: 16px;
  font-weight: 500;
}

/* زر تسجيل الدخول */
.login-btn {
  width: 100%;
  height: 65px;
  background: #FFD500;
  border: none;
  border-radius: 35px;
  color: #1A1A2E;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 28px;
  transition: all 0.25s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* نص التسجيل */
.register-text {
  text-align: center;
  margin-top: 24px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
}

.register-link {
  color: #FFD500;
  text-decoration: none;
  font-weight: 700;
  transition: opacity 0.25s ease;
}

.register-link:active {
  opacity: 0.7;
}

/* Loader الزر */
.btn-loader {
  width: 24px;
  height: 24px;
  border: 3px solid #1A1A2E;
  border-top: 3px solid transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
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
  background: #1A1A2E;
  width: 90%;
  max-width: 400px;
  border-radius: 25px;
  border: 1px solid #FFD500;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.ad-box h2 {
  background: #FFD500;
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
  background: #FFD500;
  border-radius: 10px;
}

.ad-btn {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(255, 213, 0, 0.2);
  color: #FFD500;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  transition: background 0.25s ease;
}

.ad-btn:active {
  background: rgba(255, 213, 0, 0.1);
}

/* تحسينات الشاشات الصغيرة */
@media (max-width: 480px) {
  .login-page {
    padding: 0;
  }
  
  .logo-section {
    margin-top: 100px;
    margin-bottom: 30px;
  }
  
  .logo-outer-ring {
    width: 105px;
    height: 105px;
    border-radius: 26px;
  }
  
  .logo-circle {
    width: 92px;
    height: 92px;
    border-radius: 22px;
  }
  
  .logo-img {
    width: 66px;
    height: 66px;
  }
  
  .app-name {
    font-size: 18px;
  }
  
  .main-card {
    width: 92%;
    padding: 32px 22px 28px;
    border-radius: 32px;
  }
  
  .tabs {
    gap: 24px;
  }
  
  .tab {
    font-size: 13px;
  }
  
  .form-input {
    height: 56px;
    font-size: 14px;
  }
  
  .country-select {
    height: 56px;
    font-size: 13px;
  }
  
  .login-btn {
    height: 60px;
    font-size: 18px;
  }
  
  .back-btn {
    top: 20px;
    left: 20px;
  }
  
  .language-selector {
    top: 20px;
    right: 20px;
  }
  
  .support-fab {
    width: 50px;
    height: 50px;
    font-size: 20px;
    right: 16px;
    bottom: 40px;
  }
}

@media (max-width: 360px) {
  .logo-section {
    margin-top: 85px;
  }
  
  .main-card {
    width: 94%;
    padding: 28px 18px 24px;
  }
  
  .tabs {
    gap: 20px;
  }
  
  .tab {
    font-size: 12px;
  }
  
  .form-input {
    height: 52px;
    font-size: 13px;
    border-radius: 18px;
  }
  
  .country-select {
    width: 95px;
    height: 52px;
    border-radius: 18px;
    font-size: 12px;
  }
  
  .login-btn {
    height: 56px;
    font-size: 17px;
    border-radius: 30px;
  }
  
  .input-icon,
  .eye-icon {
    font-size: 15px;
  }
}
</style>
