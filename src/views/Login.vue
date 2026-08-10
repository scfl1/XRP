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
      <button class="language-btn" type="button">
        <i class="fas fa-globe"></i>
        العربية
      </button>

      <!-- الشعار -->
      <div class="hero-content">

        <div class="logo-ring">
          <div class="logo-white-box">
            <img
              :src="logo"
              class="main-logo"
              alt="XRP"
            />
          </div>
        </div>

        <div class="xrp-title">
          XRP
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
            تسجيل الدخول
          </h1>

          <p>
            مرحباً بك، قم بتسجيل الدخول إلى حسابك
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
              البريد الإلكتروني
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
              رقم الهاتف
            </span>
          </button>

        </div>


        <!-- =========================
             البريد الإلكتروني
             ========================= -->
        <template v-if="loginType === 'email'">

          <label class="field-label">
            البريد الإلكتروني
            <i class="fas fa-envelope"></i>
          </label>

          <div class="field-wrapper">

            <input
              type="email"
              v-model="email"
              placeholder="أدخل البريد الإلكتروني"
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
            رقم الهاتف
            <i class="fas fa-phone"></i>
          </label>

          <div class="phone-container">

            <select
              v-model="countryCode"
              class="country-select"
              @change="clearError"
            >

              <option value="">
                الرمز
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
              placeholder="رقم الهاتف"
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
          كلمة المرور
          <i class="fas fa-lock"></i>
        </label>

        <div class="field-wrapper password-wrapper">

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="أدخل كلمة المرور"
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
            تسجيل الدخول
            <i class="fas fa-arrow-left"></i>
          </span>

          <span
            v-else
            class="loading-content"
          >
            <span class="loader"></span>
            جارٍ تسجيل الدخول...
          </span>

        </button>


        <!-- إنشاء حساب -->
        <div class="register-link">

          <span>
            ليس لديك حساب؟
          </span>

          <router-link to="/register">
            إنشاء حساب
          </router-link>

        </div>


        <!-- العلامة السفلية -->
        <div class="bottom-brand">

          <span></span>

          <strong>
            XRP
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

import logo from "../assets/palm-gold.png";
import logoBg from "../assets/logo-bg.jpg";

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

      errorMessage: ""
    };
  },


  mounted() {

    document.addEventListener(
      "keydown",
      this.handleEscKey
    );

  },


  beforeUnmount() {

    document.removeEventListener(
      "keydown",
      this.handleEscKey
    );

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
          "الرجاء اختيار رمز الدولة";

        return false;

      }


      if (!this.phoneNumber) {

        this.phoneError =
          "الرجاء إدخال رقم الهاتف";

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
          "رقم الهاتف يجب أن يكون بين 7 و 15 رقم";

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

      if (
        error.code ===
        "auth/user-disabled"
      ) {

        return "تم حظر حسابك، تواصل مع الدعم";

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

          return "رقم الهاتف أو كلمة المرور غير صحيحة.";

        }

        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

      }


      if (
        error.code ===
        "auth/too-many-requests"
      ) {

        return "تم تعليق الحساب مؤقتاً لكثرة المحاولات. يرجى المحاولة لاحقاً.";

      }


      if (
        error.code ===
        "auth/network-request-failed"
      ) {

        return "حدث خطأ في الاتصال. يرجى التحقق من الإنترنت.";

      }


      return "حدث خطأ. يرجى المحاولة لاحقاً.";

    },


    handleEscKey(event) {

      // لا يوجد إعلان، لا حاجة للإغلاق

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
            "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

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
            "رقم الهاتف أو كلمة المرور غير صحيحة.";

        } else {

          this.errorMessage =
            "البريد الإلكتروني أو كلمة المرور غير صحيحة.";

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
            "تم حظر حسابك، تواصل مع الدعم";

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
            "تم حظر حسابك، تواصل مع الدعم";

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
   الصورة هنا كبيرة ولكن قصيرة
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

  z-index: 5;

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


/* XRP */

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
   البطاقة تتداخل مع الخلفية
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

  }


  .country-select {

    width: 105px;

    font-size: 11px;

    padding: 0 8px;

  }

}

</style>
