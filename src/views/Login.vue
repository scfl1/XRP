<template>
  <div class="login-page" dir="rtl">

    <!-- =========================
         القسم العلوي / الخلفية
         ========================= -->
    <section
      class="hero-section"
      :style="{ backgroundImage: `url(${logoBg})` }"
    >
      <div class="hero-overlay"></div>

      <!-- اللغة -->
      <button class="language-btn" type="button" @click="toggleLanguageMenu">
        <i class="fas fa-globe"></i>
        {{ currentLanguageLabel }}
        <i class="fas fa-chevron-down" style="font-size: 10px; margin-right: 4px;"></i>
      </button>

      <!-- قائمة اللغات المنبثقة -->
      <div v-if="showLanguageMenu" class="language-dropdown" @click.stop>
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          class="language-option"
          :class="{ active: currentLanguage === lang.code }"
          @click="setLanguage(lang.code)"
        >
          <span class="lang-flag">{{ lang.flag }}</span>
          <span class="lang-name">{{ lang.label }}</span>
          <span class="lang-native">{{ lang.native }}</span>
        </button>
      </div>

      <!-- الشعار -->
      <div class="hero-content">

        <div class="logo-ring">
          <div class="logo-white-box">
            <img
              :src="logo"
              class="main-logo"
              alt="LumaRise"
            />
          </div>
        </div>

        <div class="xrp-title">
          LumaRise
        </div>

        <div class="future-title">
          THE FUTURE OF FINANCE
        </div>

      </div>
    </section>


    <!-- =========================
         بطاقة تسجيل الدخول
         ========================= -->
    <main class="login-area">

      <div class="login-card">

        <!-- عنوان -->
        <div class="heading-section">

          <h1>
            {{ translations[ currentLanguage ].loginTitle }}
          </h1>

          <p>
            {{ translations[ currentLanguage ].loginSubtitle }}
          </p>

        </div>


        <!-- رسالة الخطأ -->
        <div
          v-if="errorMessage"
          class="error-message-box"
        >
          <i class="fas fa-circle-exclamation"></i>
          {{ errorMessage }}
        </div>


        <!-- =========================
             اختيار طريقة الدخول
             ========================= -->
        <div class="login-type-selector">

          <button
            type="button"
            class="type-btn"
            :class="{ active: loginType === 'email' }"
            @click="loginType = 'email'; clearError()"
          >
            <span>
              <i class="fas fa-envelope"></i>
              {{ translations[ currentLanguage ].emailLabel }}
            </span>
          </button>

          <button
            type="button"
            class="type-btn"
            :class="{ active: loginType === 'phone' }"
            @click="loginType = 'phone'; clearError()"
          >
            <span>
              <i class="fas fa-phone"></i>
              {{ translations[ currentLanguage ].phoneLabel }}
            </span>
          </button>

        </div>


        <!-- =========================
             البريد الإلكتروني
             ========================= -->
        <template v-if="loginType === 'email'">

          <label class="field-label">
            {{ translations[ currentLanguage ].emailLabel }}
            <i class="fas fa-envelope"></i>
          </label>

          <div class="field-wrapper">

            <input
              type="email"
              v-model="email"
              :placeholder="translations[ currentLanguage ].emailPlaceholder"
              class="input-field"
              :class="{
                'input-error':
                  errorMessage && loginType === 'email'
              }"
              autocomplete="email"
              @keyup.enter="loginUser"
              @focus="clearError"
            />

            <i class="fas fa-envelope input-icon"></i>

          </div>

        </template>


        <!-- =========================
             رقم الهاتف
             ========================= -->
        <template v-if="loginType === 'phone'">

          <label class="field-label">
            {{ translations[ currentLanguage ].phoneLabel }}
            <i class="fas fa-phone"></i>
          </label>

          <div class="phone-container">

            <select
              v-model="countryCode"
              class="country-select"
              @change="clearError"
            >

              <option value="">
                {{ translations[ currentLanguage ].selectCode }}
              </option>

              <option value="+964">🇮🇶 العراق (+964)</option>
              <option value="+966">🇸🇦 السعودية (+966)</option>
              <option value="+971">🇦🇪 الإمارات (+971)</option>
              <option value="+965">🇰🇼 الكويت (+965)</option>
              <option value="+974">🇶🇦 قطر (+974)</option>
              <option value="+973">🇧🇭 البحرين (+973)</option>
              <option value="+968">🇴🇲 عمان (+968)</option>
              <option value="+962">🇯🇴 الأردن (+962)</option>
              <option value="+20">🇪🇬 مصر (+20)</option>
              <option value="+963">🇸🇾 سوريا (+963)</option>
              <option value="+961">🇱🇧 لبنان (+961)</option>
              <option value="+218">🇱🇾 ليبيا (+218)</option>
              <option value="+216">🇹🇳 تونس (+216)</option>
              <option value="+213">🇩🇿 الجزائر (+213)</option>
              <option value="+212">🇲🇦 المغرب (+212)</option>
              <option value="+222">🇲🇷 موريتانيا (+222)</option>
              <option value="+249">🇸🇩 السودان (+249)</option>
              <option value="+967">🇾🇪 اليمن (+967)</option>
              <option value="+970">🇵🇸 فلسطين (+970)</option>
              <option value="+90">🇹🇷 تركيا (+90)</option>
              <option value="+44">🇬🇧 بريطانيا (+44)</option>
              <option value="+1">🇺🇸 أمريكا (+1)</option>
              <option value="+49">🇩🇪 ألمانيا (+49)</option>
              <option value="+33">🇫🇷 فرنسا (+33)</option>
              <option value="+39">🇮🇹 إيطاليا (+39)</option>
              <option value="+34">🇪🇸 إسبانيا (+34)</option>
              <option value="+31">🇳🇱 هولندا (+31)</option>
              <option value="+46">🇸🇪 السويد (+46)</option>
              <option value="+47">🇳🇴 النرويج (+47)</option>
              <option value="+45">🇩🇰 الدنمارك (+45)</option>
              <option value="+358">🇫🇮 فنلندا (+358)</option>
              <option value="+41">🇨🇭 سويسرا (+41)</option>
              <option value="+43">🇦🇹 النمسا (+43)</option>
              <option value="+32">🇧🇪 بلجيكا (+32)</option>
              <option value="+48">🇵🇱 بولندا (+48)</option>
              <option value="+420">🇨🇿 التشيك (+420)</option>
              <option value="+36">🇭🇺 المجر (+36)</option>
              <option value="+40">🇷🇴 رومانيا (+40)</option>
              <option value="+359">🇧🇬 بلغاريا (+359)</option>
              <option value="+30">🇬🇷 اليونان (+30)</option>
              <option value="+351">🇵🇹 البرتغال (+351)</option>
              <option value="+7">🇷🇺 روسيا (+7)</option>
              <option value="+380">🇺🇦 أوكرانيا (+380)</option>
              <option value="+375">🇧🇾 بيلاروسيا (+375)</option>
              <option value="+995">🇬🇪 جورجيا (+995)</option>
              <option value="+994">🇦🇿 أذربيجان (+994)</option>
              <option value="+374">🇦🇲 أرمينيا (+374)</option>
              <option value="+998">🇺🇿 أوزبكستان (+998)</option>
              <option value="+996">🇰🇬 قرغيزستان (+996)</option>
              <option value="+992">🇹🇯 طاجيكستان (+992)</option>
              <option value="+993">🇹🇲 تركمانستان (+993)</option>
              <option value="+86">🇨🇳 الصين (+86)</option>
              <option value="+91">🇮🇳 الهند (+91)</option>
              <option value="+92">🇵🇰 باكستان (+92)</option>
              <option value="+93">🇦🇫 أفغانستان (+93)</option>
              <option value="+94">🇱🇰 سريلانكا (+94)</option>
              <option value="+95">🇲🇲 ميانمار (+95)</option>
              <option value="+66">🇹🇭 تايلاند (+66)</option>
              <option value="+84">🇻🇳 فيتنام (+84)</option>
              <option value="+60">🇲🇾 ماليزيا (+60)</option>
              <option value="+65">🇸🇬 سنغافورة (+65)</option>
              <option value="+62">🇮🇩 إندونيسيا (+62)</option>
              <option value="+63">🇵🇭 الفلبين (+63)</option>
              <option value="+82">🇰🇷 كوريا الجنوبية (+82)</option>
              <option value="+81">🇯🇵 اليابان (+81)</option>

            </select>

            <input
              type="tel"
              v-model="phoneNumber"
              :placeholder="translations[ currentLanguage ].phonePlaceholder"
              class="phone-input"
              :class="{
                'input-error':
                  errorMessage && loginType === 'phone'
              }"
              :disabled="!countryCode"
              inputmode="numeric"
              autocomplete="tel"
              @input="validatePhoneNumber"
              @keyup.enter="loginUser"
              @focus="clearError"
            />

          </div>

          <span
            v-if="phoneError"
            class="validation-error"
          >
            <i class="fas fa-circle-exclamation"></i>
            {{ phoneError }}
          </span>

        </template>


        <!-- =========================
             كلمة المرور
             ========================= -->
        <label class="field-label">
          {{ translations[ currentLanguage ].passwordLabel }}
          <i class="fas fa-lock"></i>
        </label>

        <div class="field-wrapper password-wrapper">

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            :placeholder="translations[ currentLanguage ].passwordPlaceholder"
            class="input-field password-field"
            :class="{ 'input-error': errorMessage }"
            autocomplete="current-password"
            @keyup.enter="loginUser"
            @focus="clearError"
          />

          <i class="fas fa-lock input-icon"></i>

          <button
            type="button"
            class="password-toggle"
            @click="togglePassword"
          >
            <i
              :class="
                showPassword
                  ? 'fas fa-eye-slash'
                  : 'fas fa-eye'
              "
            ></i>
          </button>

        </div>


        <!-- =========================
             تسجيل الدخول
             ========================= -->
        <button
          type="button"
          class="login-button"
          @click="loginUser"
          :disabled="loading"
        >

          <span v-if="!loading">
            {{ translations[ currentLanguage ].loginButton }}
            <i class="fas fa-arrow-left"></i>
          </span>

          <span
            v-else
            class="loading-content"
          >
            <span class="loader"></span>
            {{ translations[ currentLanguage ].loadingText }}
          </span>

        </button>


        <!-- إنشاء حساب -->
        <div class="register-link">

          <span>
            {{ translations[ currentLanguage ].noAccount }}
          </span>

          <router-link to="/register">
            {{ translations[ currentLanguage ].createAccount }}
          </router-link>

        </div>


        <!-- العلامة السفلية -->
        <div class="bottom-brand">

          <span></span>

          <strong>
            LumaRise
          </strong>

          <span></span>

        </div>

      </div>

    </main>

  </div>
</template>


<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

// ✅ المسار الصحيح من مجلد public/brand
// تم إزالة أي import قديم من ../assets/
const logo = "/brand/lumarise-logo.svg";
const logoBg = "/brand/lumarise-bg.svg";

import router from "../router";

export default {

  data() {

    return {

      /* الصور */
      logo,
      logoBg,

      /* تسجيل الدخول */
      loginType: "email",

      email: "",

      countryCode: "",

      phoneNumber: "",

      fullPhoneNumber: "",

      password: "",

      showPassword: false,

      loading: false,

      /* الأخطاء */
      phoneError: "",

      errorMessage: "",

      /* اللغة */
      currentLanguage: "ar",
      showLanguageMenu: false,

      languages: [
        { code: "ar", label: "العربية", native: "العربية", flag: "🇸🇦" },
        { code: "en", label: "English", native: "English", flag: "🇺🇸" },
        { code: "ru", label: "Русский", native: "Русский", flag: "🇷🇺" }
      ],

      translations: {
        ar: {
          loginTitle: "تسجيل الدخول",
          loginSubtitle: "مرحباً بك، قم بتسجيل الدخول إلى حسابك",
          emailLabel: "البريد الإلكتروني",
          emailPlaceholder: "أدخل البريد الإلكتروني",
          phoneLabel: "رقم الهاتف",
          phonePlaceholder: "رقم الهاتف",
          selectCode: "الرمز",
          passwordLabel: "كلمة المرور",
          passwordPlaceholder: "أدخل كلمة المرور",
          loginButton: "تسجيل الدخول",
          loadingText: "جارٍ تسجيل الدخول...",
          noAccount: "ليس لديك حساب؟",
          createAccount: "إنشاء حساب",
          errorWrongEmail: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
          errorWrongPhone: "رقم الهاتف أو كلمة المرور غير صحيحة.",
          errorBlocked: "تم حظر حسابك، تواصل مع الدعم",
          errorTooMany: "تم تعليق الحساب مؤقتاً لكثرة المحاولات. يرجى المحاولة لاحقاً.",
          errorNetwork: "حدث خطأ في الاتصال. يرجى التحقق من الإنترنت.",
          errorGeneral: "حدث خطأ. يرجى المحاولة لاحقاً.",
          errorPhoneCode: "الرجاء اختيار رمز الدولة",
          errorPhoneEmpty: "الرجاء إدخال رقم الهاتف",
          errorPhoneLength: "رقم الهاتف يجب أن يكون بين 7 و 15 رقم",
          errorPasswordLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
        },
        en: {
          loginTitle: "Login",
          loginSubtitle: "Welcome, sign in to your account",
          emailLabel: "Email",
          emailPlaceholder: "Enter your email",
          phoneLabel: "Phone Number",
          phonePlaceholder: "Phone Number",
          selectCode: "Code",
          passwordLabel: "Password",
          passwordPlaceholder: "Enter your password",
          loginButton: "Login",
          loadingText: "Logging in...",
          noAccount: "Don't have an account?",
          createAccount: "Create Account",
          errorWrongEmail: "Email or password is incorrect.",
          errorWrongPhone: "Phone number or password is incorrect.",
          errorBlocked: "Your account has been blocked, contact support",
          errorTooMany: "Account temporarily suspended due to too many attempts. Please try again later.",
          errorNetwork: "Connection error. Please check your internet.",
          errorGeneral: "An error occurred. Please try again later.",
          errorPhoneCode: "Please select a country code",
          errorPhoneEmpty: "Please enter a phone number",
          errorPhoneLength: "Phone number must be between 7 and 15 digits",
          errorPasswordLength: "Password must be at least 6 characters"
        },
        ru: {
          loginTitle: "Вход",
          loginSubtitle: "Добро пожаловать, войдите в свой аккаунт",
          emailLabel: "Электронная почта",
          emailPlaceholder: "Введите вашу электронную почту",
          phoneLabel: "Номер телефона",
          phonePlaceholder: "Номер телефона",
          selectCode: "Код",
          passwordLabel: "Пароль",
          passwordPlaceholder: "Введите ваш пароль",
          loginButton: "Войти",
          loadingText: "Вход...",
          noAccount: "Нет аккаунта?",
          createAccount: "Создать аккаунт",
          errorWrongEmail: "Неверный адрес электронной почты или пароль.",
          errorWrongPhone: "Неверный номер телефона или пароль.",
          errorBlocked: "Ваш аккаунт заблокирован, обратитесь в поддержку",
          errorTooMany: "Аккаунт временно приостановлен из-за слишком большого количества попыток. Пожалуйста, попробуйте позже.",
          errorNetwork: "Ошибка соединения. Проверьте интернет.",
          errorGeneral: "Произошла ошибка. Пожалуйста, попробуйте позже.",
          errorPhoneCode: "Пожалуйста, выберите код страны",
          errorPhoneEmpty: "Пожалуйста, введите номер телефона",
          errorPhoneLength: "Номер телефона должен содержать от 7 до 15 цифр",
          errorPasswordLength: "Пароль должен содержать не менее 6 символов"
        }
      }
    };
  },

  computed: {
    currentLanguageLabel() {
      const lang = this.languages.find(l => l.code === this.currentLanguage);
      return lang ? lang.label : "العربية";
    }
  },

  mounted() {

    document.addEventListener(
      "keydown",
      this.handleEscKey
    );

    document.addEventListener("click", this.closeLanguageMenuOutside);

  },


  beforeUnmount() {

    document.removeEventListener(
      "keydown",
      this.handleEscKey
    );

    document.removeEventListener("click", this.closeLanguageMenuOutside);

  },


  methods: {

    togglePassword() {

      this.showPassword =
        !this.showPassword;

    },


    clearError() {

      this.errorMessage = "";

      this.phoneError = "";

    },


    validateEmail(email) {

      const re =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return re.test(email);

    },


    validatePhoneNumber() {

      if (!this.countryCode) {

        this.phoneError =
          this.translations[ this.currentLanguage ].errorPhoneCode;

        return false;

      }


      if (!this.phoneNumber) {

        this.phoneError =
          this.translations[ this.currentLanguage ].errorPhoneEmpty;

        return false;

      }


      const cleanPhone =
        this.phoneNumber.replace(
          /[^0-9]/g,
          ""
        );


      if (
        cleanPhone.length < 7 ||
        cleanPhone.length > 15
      ) {

        this.phoneError =
          this.translations[ this.currentLanguage ].errorPhoneLength;

        return false;

      }


      this.fullPhoneNumber =
        this.countryCode +
        cleanPhone;


      this.phoneError = "";

      return true;

    },


    generatePhoneEmail(phoneNumber) {

      const cleanPhone =
        phoneNumber.replace(
          /\+/g,
          ""
        );

      return `${cleanPhone}@phone.app`;

    },


    getErrorMessage(error) {

      const t = this.translations[ this.currentLanguage ];

      if (
        error.code ===
        "auth/user-disabled"
      ) {

        return t.errorBlocked;

      }


      if (
        error.code ===
          "auth/wrong-password" ||

        error.code ===
          "auth/user-not-found" ||

        error.code ===
          "auth/invalid-credential" ||

        error.code ===
          "auth/invalid-email"
      ) {

        if (
          this.loginType ===
          "phone"
        ) {

          return t.errorWrongPhone;

        }

        return t.errorWrongEmail;

      }


      if (
        error.code ===
        "auth/too-many-requests"
      ) {

        return t.errorTooMany;

      }


      if (
        error.code ===
        "auth/network-request-failed"
      ) {

        return t.errorNetwork;

      }


      return t.errorGeneral;

    },


    handleEscKey(event) {

      if (event.key === "Escape") {
        this.showLanguageMenu = false;
      }

    },


    closeLanguageMenuOutside(event) {
      if (this.showLanguageMenu) {
        const dropdown = document.querySelector('.language-dropdown');
        const btn = document.querySelector('.language-btn');
        if (dropdown && btn) {
          if (!dropdown.contains(event.target) && !btn.contains(event.target)) {
            this.showLanguageMenu = false;
          }
        }
      }
    },


    toggleLanguageMenu(event) {
      event.stopPropagation();
      this.showLanguageMenu = !this.showLanguageMenu;
    },


    setLanguage(code) {
      this.currentLanguage = code;
      this.showLanguageMenu = false;
      this.clearError();
    },


    async loginUser() {

      this.errorMessage = "";

      let loginEmail =
        this.email.trim();


      /* تسجيل الدخول بالهاتف */
      if (
        this.loginType ===
        "phone"
      ) {

        if (
          !this.validatePhoneNumber()
        ) {

          return;

        }

        loginEmail =
          this.generatePhoneEmail(
            this.fullPhoneNumber
          );

      }


      /* تسجيل الدخول بالبريد */
      else {

        if (
          !this.validateEmail(
            loginEmail
          )
        ) {

          this.errorMessage =
            this.translations[ this.currentLanguage ].errorWrongEmail;

          return;

        }

      }


      /* كلمة المرور */
      if (
        !this.password ||
        this.password.length < 6
      ) {

        if (
          this.loginType ===
          "phone"
        ) {

          this.errorMessage =
            this.translations[ this.currentLanguage ].errorWrongPhone;

        } else {

          this.errorMessage =
            this.translations[ this.currentLanguage ].errorWrongEmail;

        }

        return;

      }


      this.loading = true;

      const auth = getAuth();


      try {

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            loginEmail,
            this.password
          );


        const user =
          userCredential.user;


        if (
          user.disabled === true
        ) {

          await signOut(auth);

          this.errorMessage =
            this.translations[ this.currentLanguage ].errorBlocked;

          return;

        }


        await user.reload();


        const updatedUser =
          auth.currentUser;


        if (
          updatedUser &&
          updatedUser.disabled === true
        ) {

          await signOut(auth);

          this.errorMessage =
            this.translations[ this.currentLanguage ].errorBlocked;

          return;

        }


        const admins = [
          "azad.333388@gmail.com",
          "admin2@gmail.com",
          "owner@gmail.com"
        ];


        if (
          admins.includes(
            user.email
          )
        ) {

          await router.push(
            "/admin"
          );

        } else {

          await router.push(
            "/home"
          );

        }

      }


      catch (error) {

        console.error(
          "Login Error:",
          error
        );

        this.errorMessage =
          this.getErrorMessage(
            error
          );

      }


      finally {

        this.loading = false;

      }

    }

  }

};
</script>


<style scoped>

/* =====================================================
   الصفحة
   ===================================================== */

.login-page {

  min-height: 100vh;

  background: #f4f4f4;

  color: #111;

  overflow-x: hidden;

}


/* =====================================================
   الخلفية العلوية
   ===================================================== */

.hero-section {

  position: relative;

  width: 100%;

  height: 390px;

  background-size: cover;

  background-position: center center;

  background-repeat: no-repeat;

  display: flex;

  justify-content: center;

  align-items: center;

  overflow: hidden;

}


/* طبقة سوداء خفيفة */

.hero-overlay {

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.05),
      rgba(0,0,0,0.20) 50%,
      rgba(0,0,0,0.82) 100%
    );

  z-index: 1;

}


/* =====================================================
   زر اللغة
   ===================================================== */

.language-btn {

  position: absolute;

  top: 22px;

  right: 22px;

  z-index: 6;

  height: 48px;

  padding: 0 20px;

  border: 1px solid rgba(255,255,255,0.18);

  border-radius: 30px;

  background: rgba(0,0,0,0.35);

  backdrop-filter: blur(12px);

  -webkit-backdrop-filter: blur(12px);

  color: #fff;

  font-size: 14px;

  font-weight: 800;

  display: flex;

  align-items: center;

  gap: 9px;

  cursor: pointer;

  transition: all 0.3s ease;
}

.language-btn:hover {
  background: rgba(0,0,0,0.5);
}


/* =====================================================
   قائمة اللغات المنبثقة
   ===================================================== */

.language-dropdown {

  position: absolute;

  top: 78px;

  right: 22px;

  z-index: 7;

  background: rgba(20, 20, 30, 0.95);

  backdrop-filter: blur(16px);

  -webkit-backdrop-filter: blur(16px);

  border-radius: 16px;

  border: 1px solid rgba(255,255,255,0.12);

  padding: 8px;

  min-width: 200px;

  box-shadow:
    0 20px 60px rgba(0,0,0,0.5);

  animation: dropdownSlide 0.25s ease;

}

@keyframes dropdownSlide {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.language-option {

  display: flex;

  align-items: center;

  gap: 12px;

  width: 100%;

  padding: 10px 16px;

  border: none;

  border-radius: 10px;

  background: transparent;

  color: #fff;

  cursor: pointer;

  transition: all 0.25s ease;

  font-size: 14px;

  text-align: right;

}

.language-option:hover {

  background: rgba(255,255,255,0.08);

}

.language-option.active {

  background: rgba(255,255,255,0.12);

  border: 1px solid rgba(255,255,255,0.15);

}

.language-option .lang-flag {

  font-size: 20px;

}

.language-option .lang-name {

  font-weight: 600;

}

.language-option .lang-native {

  color: rgba(255,255,255,0.5);

  font-size: 12px;

  margin-right: auto;

}


/* =====================================================
   محتوى الشعار
   ===================================================== */

.hero-content {

  position: relative;

  z-index: 3;

  text-align: center;

  margin-top: 5px;

}


/* دائرة الشعار */

.logo-ring {

  width: 170px;

  height: 170px;

  margin: 0 auto 18px;

  border-radius: 50%;

  border: 2px solid rgba(255,255,255,0.55);

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:
    0 0 0 12px rgba(255,255,255,0.04),
    0 0 45px rgba(0,0,0,0.35);

}


/* المربع الأبيض */

.logo-white-box {

  width: 125px;

  height: 125px;

  border-radius: 28px;

  background: #fff;

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:
    0 12px 40px rgba(0,0,0,0.35);

}


/* الشعار */

.main-logo {

  width: 105px;

  height: 105px;

  object-fit: contain;

}


/* LumaRise */

.xrp-title {

  color: #fff;

  font-size: 42px;

  font-weight: 900;

  letter-spacing: 12px;

  line-height: 1;

  text-shadow:
    0 4px 15px rgba(0,0,0,0.5);

}


/* Future */

.future-title {

  color: rgba(255,255,255,0.85);

  font-size: 11px;

  letter-spacing: 6px;

  margin-top: 16px;

  font-weight: 500;

}


/* =====================================================
   منطقة تسجيل الدخول
   ===================================================== */

.login-area {

  position: relative;

  z-index: 10;

  max-width: 850px;

  margin: -55px auto 0;

  padding: 0 25px 40px;

}


/* =====================================================
   بطاقة تسجيل الدخول
   ===================================================== */

.login-card {

  width: 100%;

  box-sizing: border-box;

  background: rgba(255,255,255,0.98);

  border-radius: 38px;

  padding: 45px 55px 35px;

  box-shadow:
    0 25px 70px rgba(0,0,0,0.15);

  border: 1px solid rgba(255,255,255,0.9);

}


/* =====================================================
   العنوان
   ===================================================== */

.heading-section {

  text-align: center;

  margin-bottom: 28px;

}


.heading-section h1 {

  margin: 0;

  color: #111;

  font-size: 34px;

  font-weight: 900;

  letter-spacing: -1px;

}


.heading-section p {

  margin: 12px 0 0;

  color: #888;

  font-size: 15px;

}


/* =====================================================
   الخطأ
   ===================================================== */

.error-message-box {

  background: #f5f5f5;

  border: 1px solid #ddd;

  border-right: 4px solid #111;

  border-radius: 13px;

  padding: 13px;

  margin-bottom: 20px;

  color: #222;

  text-align: center;

  font-size: 13px;

  font-weight: 700;

}


.error-message-box i {

  margin-left: 5px;

}


/* =====================================================
   اختيار طريقة الدخول
   ===================================================== */

.login-type-selector {

  display: flex;

  width: 100%;

  height: 58px;

  padding: 4px;

  box-sizing: border-box;

  border-radius: 30px;

  background: #f2f2f2;

  border: 1px solid #e3e3e3;

  margin-bottom: 25px;

}


.type-btn {

  flex: 1;

  border: none;

  border-radius: 27px;

  background: transparent;

  color: #888;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  transition: .25s ease;

}


.type-btn span {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

}


.type-btn.active {

  background: #050505;

  color: #fff;

  box-shadow:
    0 6px 18px rgba(0,0,0,0.18);

}


/* =====================================================
   العناوين
   ===================================================== */

.field-label {

  display: block;

  color: #111;

  font-size: 14px;

  font-weight: 800;

  margin-bottom: 9px;

}


.field-label i {

  margin-right: 5px;

  color: #444;

}


/* =====================================================
   الحقول
   ===================================================== */

.field-wrapper {

  position: relative;

  width: 100%;

  margin-bottom: 20px;

}


.input-field {

  width: 100%;

  height: 58px;

  box-sizing: border-box;

  border-radius: 30px;

  border: 1px solid #ddd;

  background: #fff;

  color: #111;

  font-size: 15px;

  padding:
    10px 52px
    10px 20px;

  outline: none;

  transition: .25s ease;

}


.input-field::placeholder {

  color: #aaa;

}


.input-field:focus {

  border-color: #111;

  box-shadow:
    0 0 0 4px rgba(0,0,0,0.05);

}


.input-icon {

  position: absolute;

  right: 21px;

  top: 21px;

  color: #555;

  font-size: 16px;

  pointer-events: none;

}


.input-error {

  border-color: #222 !important;

}


/* =====================================================
   الهاتف
   ===================================================== */

.phone-container {

  display: flex;

  gap: 10px;

  margin-bottom: 20px;

  width: 100%;

}


.country-select {

  width: 150px;

  height: 58px;

  border-radius: 30px;

  border: 1px solid #ddd;

  background: #fff;

  color: #333;

  padding: 0 14px;

  font-size: 13px;

  outline: none;

  flex-shrink: 0;

}


.phone-input {

  flex: 1;

  height: 58px;

  box-sizing: border-box;

  border-radius: 30px;

  border: 1px solid #ddd;

  background: #fff;

  color: #111;

  padding: 0 20px;

  font-size: 15px;

  direction: ltr;

  text-align: left;

  outline: none;

  min-width: 0;

}


.phone-input:focus,
.country-select:focus {

  border-color: #111;

  box-shadow:
    0 0 0 4px rgba(0,0,0,0.05);

}


.phone-input:disabled {

  background: #f2f2f2;

  cursor: not-allowed;

}


.validation-error {

  display: block;

  color: #222;

  font-size: 12px;

  margin-top: -12px;

  margin-bottom: 15px;

}


/* =====================================================
   كلمة المرور
   ===================================================== */

.password-wrapper {

  margin-bottom: 23px;

}


.password-field {

  padding-left: 55px;

}


.password-toggle {

  position: absolute;

  left: 13px;

  top: 11px;

  width: 36px;

  height: 36px;

  border-radius: 50%;

  border: none;

  background: #f1f1f1;

  color: #444;

  cursor: pointer;

  display: flex;

  justify-content: center;

  align-items: center;

}


/* =====================================================
   زر تسجيل الدخول
   ===================================================== */

.login-button {

  width: 100%;

  height: 61px;

  border: none;

  border-radius: 32px;

  background:
    linear-gradient(
      135deg,
      #000 0%,
      #161616 100%
    );

  color: #fff;

  font-size: 17px;

  font-weight: 900;

  cursor: pointer;

  transition: .25s ease;

  box-shadow:
    0 10px 28px rgba(0,0,0,0.18);

}


.login-button span {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

}


.login-button:hover:not(:disabled) {

  transform: translateY(-2px);

  box-shadow:
    0 15px 35px rgba(0,0,0,0.25);

}


.login-button:active:not(:disabled) {

  transform: translateY(0);

}


.login-button:disabled {

  opacity: .65;

  cursor: not-allowed;

}


/* =====================================================
   التحميل
   ===================================================== */

.loading-content {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

}


.loader {

  width: 18px;

  height: 18px;

  border-radius: 50%;

  border:
    2px solid rgba(255,255,255,.35);

  border-top-color: #fff;

  animation:
    spin .8s linear infinite;

}


@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}


/* =====================================================
   إنشاء حساب
   ===================================================== */

.register-link {

  text-align: center;

  margin-top: 24px;

  font-size: 14px;

  color: #999;

}


.register-link a {

  color: #111;

  font-weight: 900;

  text-decoration: none;

  margin-right: 5px;

}


.register-link a:hover {

  text-decoration: underline;

}


/* =====================================================
   العلامة السفلية
   ===================================================== */

.bottom-brand {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 15px;

  margin-top: 28px;

}


.bottom-brand span {

  width: 90px;

  height: 1px;

  background: #ddd;

}


.bottom-brand strong {

  font-size: 16px;

  letter-spacing: 6px;

  color: #111;

}


/* =====================================================
   الموبايل
   ===================================================== */

@media (max-width: 700px) {

  .hero-section {

    height: 360px;

    background-position: center center;

  }


  .language-btn {

    top: 18px;

    right: 15px;

    height: 45px;

    padding: 0 17px;

    font-size: 12px;

  }

  .language-dropdown {
    top: 70px;
    right: 15px;
    min-width: 170px;
  }

  .language-option {
    padding: 8px 14px;
    font-size: 13px;
  }


  .logo-ring {

    width: 150px;

    height: 150px;

    margin-bottom: 15px;

  }


  .logo-white-box {

    width: 112px;

    height: 112px;

    border-radius: 25px;

  }


  .main-logo {

    width: 94px;

    height: 94px;

  }


  .xrp-title {

    font-size: 37px;

    letter-spacing: 10px;

  }


  .future-title {

    font-size: 9px;

    letter-spacing: 4px;

    margin-top: 13px;

  }


  .login-area {

    margin-top: -45px;

    padding:
      0 14px 30px;

  }


  .login-card {

    padding:
      38px 22px 30px;

    border-radius: 32px;

  }


  .heading-section h1 {

    font-size: 29px;

  }


  .heading-section p {

    font-size: 13px;

  }


  .login-type-selector {

    height: 54px;

  }


  .type-btn {

    font-size: 12px;

  }


  .input-field,
  .phone-input,
  .country-select {

    height: 55px;

  }


  .input-icon {

    top: 19px;

  }


  .password-toggle {

    top: 9px;

  }


  .login-button {

    height: 58px;

    font-size: 16px;

  }


  .bottom-brand span {

    width: 55px;

  }

}


/* =====================================================
   الشاشات الصغيرة جداً
   ===================================================== */

@media (max-width: 400px) {

  .hero-section {

    height: 330px;

  }


  .logo-ring {

    width: 135px;

    height: 135px;

  }


  .logo-white-box {

    width: 102px;

    height: 102px;

  }


  .main-logo {

    width: 85px;

    height: 85px;

  }


  .xrp-title {

    font-size: 32px;

  }


  .future-title {

    font-size: 8px;

    letter-spacing: 3px;

  }


  .login-area {

    margin-top: -38px;

  }


  .login-card {

    padding:
      32px 18px 27px;

    border-radius: 28px;

  }


  .heading-section h1 {

    font-size: 27px;

  }


  .phone-container {

    gap: 6px;

    flex-wrap: wrap;

  }


  .country-select {

    width: 100%;

    font-size: 13px;

    padding: 0 14px;

  }

  .phone-input {
    width: 100%;
  }

  .language-dropdown {
    right: 10px;
    min-width: 150px;
    top: 65px;
  }

}

</style>
