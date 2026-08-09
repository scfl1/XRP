<template>
  <div class="login-page" dir="rtl">

    <!-- =========================
         HERO / الخلفية الكبيرة
    ========================== -->
    <section class="hero-section">

      <!-- صورة الخلفية الكبيرة -->
      <div class="hero-background"></div>

      <!-- طبقة إضاءة -->
      <div class="hero-overlay"></div>

      <!-- محتوى الشعار -->
      <div class="hero-content">

        <div class="logo-ring">

          <div class="logo-glow"></div>

          <div class="logo-circle">
            <img
              :src="logo"
              alt="XRP"
              class="xrp-logo"
            />
          </div>

        </div>

        <div class="xrp-title">
          XRP
        </div>

        <div class="xrp-subtitle">
          THE FUTURE OF FINANCE
        </div>

      </div>

    </section>


    <!-- =========================
         بطاقة تسجيل الدخول
    ========================== -->
    <section class="login-section">

      <div class="login-card">

        <!-- علامة XRP خفيفة داخل البطاقة -->
        <div class="card-watermark">
          XRP
        </div>


        <!-- العنوان -->
        <div class="login-header">

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
        ========================== -->
        <div class="login-type-selector">

          <button
            type="button"
            class="type-btn"
            :class="{ active: loginType === 'email' }"
            @click="loginType = 'email'; clearError()"
          >
            <span>
              البريد الإلكتروني
            </span>

            <i class="fas fa-envelope"></i>
          </button>


          <button
            type="button"
            class="type-btn"
            :class="{ active: loginType === 'phone' }"
            @click="loginType = 'phone'; clearError()"
          >
            <span>
              رقم الهاتف
            </span>

            <i class="fas fa-phone"></i>
          </button>

        </div>


        <!-- =========================
             البريد الإلكتروني
        ========================== -->
        <template v-if="loginType === 'email'">

          <label class="field-label">
            البريد الإلكتروني
            <i class="fas fa-envelope"></i>
          </label>

          <div class="input-wrapper">

            <input
              v-model="email"
              type="email"
              class="main-input"
              placeholder="أدخل البريد الإلكتروني"
              autocomplete="email"
              @keyup.enter="loginUser"
              @focus="clearError"
            />

            <i class="fas fa-envelope input-icon"></i>

          </div>

        </template>


        <!-- =========================
             الهاتف
        ========================== -->
        <template v-if="loginType === 'phone'">

          <label class="field-label">
            رقم الهاتف
            <i class="fas fa-phone"></i>
          </label>

          <div class="phone-row">

            <select
              v-model="countryCode"
              class="country-select"
              @change="clearError"
            >

              <option value="">
                رمز الدولة
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
              v-model="phoneNumber"
              type="tel"
              class="phone-main-input"
              placeholder="رقم الهاتف"
              :disabled="!countryCode"
              inputmode="numeric"
              autocomplete="tel"
              @input="validatePhoneNumber"
              @keyup.enter="loginUser"
              @focus="clearError"
            />

          </div>


          <div
            v-if="phoneError"
            class="validation-error"
          >
            <i class="fas fa-circle-exclamation"></i>
            {{ phoneError }}
          </div>

        </template>


        <!-- =========================
             كلمة المرور
        ========================== -->
        <label class="field-label password-label">

          كلمة المرور

          <i class="fas fa-lock"></i>

        </label>


        <div class="input-wrapper password-wrapper">

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            class="main-input password-input"
            placeholder="أدخل كلمة المرور"
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
             زر تسجيل الدخول
        ========================== -->
        <button
          type="button"
          class="login-button"
          :disabled="loading"
          @click="loginUser"
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


        <!-- =========================
             إنشاء حساب
        ========================== -->
        <p class="register-text">

          ليس لديك حساب؟

          <router-link to="/register">
            إنشاء حساب
          </router-link>

        </p>


        <!-- =========================
             العلامة السفلية
        ========================== -->
        <div class="bottom-brand">

          <span></span>

          <strong>
            XRP
          </strong>

          <span></span>

        </div>

      </div>

    </section>


    <!-- =========================
         إعلان
    ========================== -->
    <div
      v-if="showAd"
      class="ad-overlay"
      @click.self="closeAd"
    >

      <div class="ad-box">

        <div class="ad-header">

          <i class="fas fa-bullhorn"></i>

          <h2>
            إعلان
          </h2>

        </div>


        <div class="ad-content">

          <p>
            🎉 مرحباً بالجميع!

            <br><br>

            الحد الأدنى لمبلغ إعادة الشحن:
            12 USDT.

            <br>

            الحد الأدنى للسحب:
            3 USDT.

            <br><br>

            يمكنك استخدام المنصة وإدارة حسابك
            من خلال لوحة المستخدم.

          </p>

        </div>


        <button
          type="button"
          class="ad-btn"
          @click="closeAd"
        >
          أنا أعرف
        </button>

      </div>

    </div>

  </div>
</template>


<script>

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import logo from "../assets/xrp-logo.png";

import router from "../router";


export default {

  name: "Login",


  data() {

    return {

      /* =========================
         الصور
      ========================== */

      logo,


      /* =========================
         تسجيل الدخول
      ========================== */

      loginType: "email",

      email: "",

      countryCode: "",

      phoneNumber: "",

      fullPhoneNumber: "",

      password: "",

      showPassword: false,

      loading: false,


      /* =========================
         الإعلان
      ========================== */

      showAd: false,

      adTimer: null,


      /* =========================
         الأخطاء
      ========================== */

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


    if (this.adTimer) {

      clearTimeout(
        this.adTimer
      );

    }

  },


  methods: {


    /* =========================
       إظهار / إخفاء كلمة المرور
    ========================== */

    togglePassword() {

      this.showPassword =
        !this.showPassword;

    },


    /* =========================
       مسح الأخطاء
    ========================== */

    clearError() {

      this.errorMessage = "";

      this.phoneError = "";

    },


    /* =========================
       التحقق من البريد
    ========================== */

    validateEmail(email) {

      const re =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return re.test(email);

    },


    /* =========================
       التحقق من الهاتف
    ========================== */

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


    /* =========================
       تحويل الهاتف إلى Email
    ========================== */

    generatePhoneEmail(phoneNumber) {

      const cleanPhone =
        phoneNumber.replace(
          /\+/g,
          ""
        );

      return `${cleanPhone}@phone.app`;

    },


    /* =========================
       رسائل الأخطاء
    ========================== */

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


    /* =========================
       زر ESC للإعلان
    ========================== */

    handleEscKey(event) {

      if (
        event.key === "Escape" &&
        this.showAd
      ) {

        this.closeAd();

      }

    },


    /* =========================
       تسجيل الدخول
    ========================== */

    async loginUser() {

      this.errorMessage = "";


      let loginEmail =
        this.email.trim();


      /* تسجيل الدخول بالهاتف */

      if (
        this.loginType === "phone"
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
          this.loginType === "phone"
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


      const auth =
        getAuth();


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


        /* حسابات الإدارة */

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


      } catch (error) {

        console.error(
          "Login Error:",
          error
        );


        this.errorMessage =
          this.getErrorMessage(
            error
          );

      } finally {

        this.loading = false;

      }

    },


    /* =========================
       إغلاق الإعلان
    ========================== */

    closeAd() {

      this.showAd = false;

    }

  }

};

</script>


<style scoped>

/* =====================================================
   الخطوط
===================================================== */

* {
  box-sizing: border-box;
}


/* =====================================================
   الصفحة الرئيسية
===================================================== */

.login-page {

  min-height: 100vh;

  width: 100%;

  background: #f5f5f5;

  color: #111;

  overflow-x: hidden;

  font-family:
    Arial,
    "Tahoma",
    sans-serif;

}


/* =====================================================
   HERO
===================================================== */

.hero-section {

  position: relative;

  width: 100%;

  height: 560px;

  overflow: hidden;

  background: #031019;

}


/* الصورة الكبيرة */

.hero-background {

  position: absolute;

  inset: 0;

  width: 100%;

  height: 100%;

  background-image:
    url("../assets/xrp-background.jpg");

  background-size: cover;

  background-position:
    center center;

  background-repeat: no-repeat;

  transform: scale(1.02);

}


/* طبقة داكنة */

.hero-overlay {

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.05) 0%,
      rgba(0,0,0,0.08) 45%,
      rgba(0,0,0,0.55) 100%
    );

}


/* =====================================================
   محتوى الشعار
===================================================== */

.hero-content {

  position: relative;

  z-index: 3;

  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding-top: 15px;

}


/* =====================================================
   دائرة الشعار
===================================================== */

.logo-ring {

  position: relative;

  width: 215px;

  height: 215px;

  display: flex;

  align-items: center;

  justify-content: center;

}


/* الحلقة الخارجية */

.logo-ring::before {

  content: "";

  position: absolute;

  inset: 3px;

  border-radius: 50%;

  border:

    2px solid
    rgba(255,255,255,0.7);

  box-shadow:

    0 0 15px
    rgba(255,255,255,0.25),

    inset 0 0 15px
    rgba(255,255,255,0.15);

}


/* الحلقة الثانية */

.logo-ring::after {

  content: "";

  position: absolute;

  inset: 19px;

  border-radius: 50%;

  border:

    1px solid
    rgba(255,255,255,0.45);

}


/* توهج */

.logo-glow {

  position: absolute;

  width: 175px;

  height: 175px;

  border-radius: 50%;

  background:
    rgba(0,180,255,0.12);

  filter: blur(18px);

}


/* =====================================================
   خلفية الشعار الأبيض
===================================================== */

.logo-circle {

  position: relative;

  z-index: 3;

  width: 142px;

  height: 142px;

  border-radius: 34px;

  background:
    linear-gradient(
      145deg,
      #ffffff,
      #eeeeee
    );

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow:

    0 15px 45px
    rgba(0,0,0,0.35),

    0 0 25px
    rgba(255,255,255,0.25);

}


/* الشعار */

.xrp-logo {

  width: 110px;

  height: 110px;

  object-fit: contain;

  display: block;

}


/* =====================================================
   XRP
===================================================== */

.xrp-title {

  margin-top: 17px;

  color: #fff;

  font-size: 54px;

  font-weight: 900;

  letter-spacing: 15px;

  line-height: 1;

  text-shadow:
    0 4px 15px
    rgba(0,0,0,0.45);

  padding-left: 15px;

}


/* =====================================================
   FUTURE OF FINANCE
===================================================== */

.xrp-subtitle {

  margin-top: 16px;

  color:
    rgba(255,255,255,0.9);

  font-size: 13px;

  font-weight: 500;

  letter-spacing: 6px;

  text-align: center;

}


/* =====================================================
   قسم البطاقة
===================================================== */

.login-section {

  position: relative;

  z-index: 10;

  width: 100%;

  margin-top: -70px;

  padding:
    0 20px
    50px;

}


/* =====================================================
   البطاقة البيضاء
===================================================== */

.login-card {

  position: relative;

  width: 100%;

  max-width: 820px;

  margin: 0 auto;

  padding:
    48px
    50px
    40px;

  background:
    rgba(255,255,255,0.98);

  border-radius:
    42px;

  border:
    1px solid
    rgba(0,0,0,0.06);

  box-shadow:

    0 -10px 50px
    rgba(0,0,0,0.12),

    0 30px 80px
    rgba(0,0,0,0.12);

  overflow: hidden;

}


/* =====================================================
   علامة XRP الشفافة
===================================================== */

.card-watermark {

  position: absolute;

  top: 35px;

  right: 35px;

  color:
    rgba(0,0,0,0.035);

  font-size: 80px;

  font-weight: 900;

  letter-spacing: 8px;

  pointer-events: none;

}


/* =====================================================
   عنوان تسجيل الدخول
===================================================== */

.login-header {

  position: relative;

  z-index: 2;

  text-align: center;

  margin-bottom: 30px;

}


.login-header h1 {

  margin: 0;

  color: #080808;

  font-size: 39px;

  font-weight: 900;

  line-height: 1.3;

}


.login-header p {

  margin:
    9px
    0
    0;

  color: #999;

  font-size: 16px;

}


/* =====================================================
   الخطأ
===================================================== */

.error-message-box {

  position: relative;

  z-index: 5;

  margin-bottom: 20px;

  padding: 13px 16px;

  background: #f4f4f4;

  border:
    1px solid
    #dedede;

  border-right:
    4px solid
    #000;

  border-radius: 12px;

  color: #222;

  font-size: 13px;

  text-align: center;

  font-weight: 700;

}


.error-message-box i {

  margin-left: 7px;

}


/* =====================================================
   اختيار البريد / الهاتف
===================================================== */

.login-type-selector {

  display: flex;

  width: 100%;

  height: 62px;

  padding: 5px;

  margin-bottom: 28px;

  background: #f5f5f5;

  border:
    1px solid
    #e5e5e5;

  border-radius: 35px;

}


.type-btn {

  flex: 1;

  height: 100%;

  border: none;

  border-radius: 30px;

  background: transparent;

  color: #999;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  font-size: 16px;

  font-weight: 800;

  transition:
    all .25s ease;

}


.type-btn i {

  font-size: 18px;

}


.type-btn.active {

  color: #fff;

  background:
    linear-gradient(
      135deg,
      #111,
      #000
    );

  box-shadow:

    0 6px 20px
    rgba(0,0,0,0.2);

}


/* =====================================================
   عناوين الحقول
===================================================== */

.field-label {

  display: block;

  margin:
    0
    0
    10px;

  color: #111;

  font-size: 16px;

  font-weight: 800;

}


.field-label i {

  margin-right: 6px;

  color: #555;

}


.password-label {

  margin-top: 24px;

}


/* =====================================================
   الحقول
===================================================== */

.input-wrapper {

  position: relative;

  width: 100%;

}


.main-input {

  width: 100%;

  height: 62px;

  padding:
    0
    55px
    0
    55px;

  border:
    1.5px solid
    #dedede;

  border-radius: 31px;

  background:
    #fff;

  color: #111;

  font-size: 16px;

  outline: none;

  transition:
    all .25s ease;

}


.main-input::placeholder {

  color: #aaa;

}


.main-input:focus {

  border-color: #111;

  box-shadow:
    0 0 0 4px
    rgba(0,0,0,0.05);

}


.input-icon {

  position: absolute;

  right: 22px;

  top: 50%;

  transform:
    translateY(-50%);

  color: #555;

  font-size: 18px;

  pointer-events: none;

}


/* =====================================================
   الهاتف
===================================================== */

.phone-row {

  display: flex;

  gap: 10px;

  width: 100%;

}


.country-select {

  width: 180px;

  height: 62px;

  padding: 0 15px;

  border:
    1.5px solid
    #dedede;

  border-radius: 31px;

  background: #fff;

  color: #555;

  font-size: 13px;

  outline: none;

}


.country-select:focus {

  border-color: #111;

}


.phone-main-input {

  flex: 1;

  min-width: 0;

  height: 62px;

  padding: 0 22px;

  border:
    1.5px solid
    #dedede;

  border-radius: 31px;

  background: #fff;

  color: #111;

  font-size: 16px;

  direction: ltr;

  text-align: left;

  outline: none;

}


.phone-main-input:focus {

  border-color: #111;

  box-shadow:
    0 0 0 4px
    rgba(0,0,0,0.05);

}


.phone-main-input:disabled {

  background: #f4f4f4;

  cursor: not-allowed;

}


/* =====================================================
   كلمة المرور
===================================================== */

.password-input {

  padding-left: 65px;

}


.password-toggle {

  position: absolute;

  left: 15px;

  top: 50%;

  transform:
    translateY(-50%);

  width: 38px;

  height: 38px;

  border: none;

  border-radius: 50%;

  background: #f2f2f2;

  color: #555;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

}


.password-toggle:hover {

  background: #e8e8e8;

  color: #000;

}


/* =====================================================
   خطأ الهاتف
===================================================== */

.validation-error {

  display: block;

  margin-top: 8px;

  color: #222;

  font-size: 12px;

}


.validation-error i {

  margin-left: 5px;

}


/* =====================================================
   زر تسجيل الدخول
===================================================== */

.login-button {

  width: 100%;

  height: 64px;

  margin-top: 30px;

  border: none;

  border-radius: 32px;

  background:
    linear-gradient(
      135deg,
      #151515,
      #000
    );

  color: #fff;

  font-size: 18px;

  font-weight: 900;

  cursor: pointer;

  box-shadow:

    0 12px 30px
    rgba(0,0,0,0.22);

  transition:
    all .25s ease;

}


.login-button:hover:not(:disabled) {

  transform:
    translateY(-2px);

  box-shadow:

    0 17px 35px
    rgba(0,0,0,0.28);

}


.login-button:active:not(:disabled) {

  transform:
    translateY(0);

}


.login-button:disabled {

  opacity: .65;

  cursor: not-allowed;

}


.login-button i {

  margin-right: 8px;

}


/* =====================================================
   Loading
===================================================== */

.loading-content {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

}


.loader {

  width: 20px;

  height: 20px;

  border:
    2px solid
    rgba(255,255,255,0.4);

  border-top-color:
    #fff;

  border-radius: 50%;

  animation:
    spin .8s linear infinite;

}


@keyframes spin {

  to {

    transform:
      rotate(360deg);

  }

}


/* =====================================================
   إنشاء الحساب
===================================================== */

.register-text {

  margin:
    25px
    0
    0;

  text-align: center;

  color: #999;

  font-size: 15px;

}


.register-text a {

  color: #000;

  font-weight: 900;

  text-decoration: none;

  margin-right: 5px;

}


.register-text a:hover {

  text-decoration: underline;

}


/* =====================================================
   XRP أسفل البطاقة
===================================================== */

.bottom-brand {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 14px;

  margin-top: 28px;

}


.bottom-brand span {

  width: 100px;

  height: 1px;

  background:
    #ddd;

}


.bottom-brand strong {

  color: #111;

  font-size: 18px;

  letter-spacing: 7px;

  padding-left: 7px;

}


/* =====================================================
   الإعلان
===================================================== */

.ad-overlay {

  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(0,0,0,0.75);

}


.ad-box {

  width: 100%;

  max-width: 430px;

  background: #fff;

  border-radius: 25px;

  overflow: hidden;

  box-shadow:
    0 30px 80px
    rgba(0,0,0,0.4);

}


.ad-header {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 18px;

  background: #000;

  color: #fff;

}


.ad-header h2 {

  margin: 0;

  font-size: 19px;

}


.ad-content {

  padding: 22px;

  max-height: 350px;

  overflow-y: auto;

  color: #222;

  font-size: 13px;

  line-height: 1.9;

}


.ad-content p {

  margin: 0;

}


.ad-btn {

  width: 100%;

  height: 55px;

  border: none;

  border-top:
    1px solid
    #ddd;

  background: #fff;

  color: #000;

  font-size: 15px;

  font-weight: 900;

  cursor: pointer;

}


/* =====================================================
   Tablet
===================================================== */

@media (max-width: 768px) {

  .hero-section {

    height: 540px;

  }


  .login-section {

    margin-top: -65px;

    padding:
      0
      15px
      40px;

  }


  .login-card {

    padding:
      40px
      30px
      35px;

    border-radius:
      34px;

  }


  .login-header h1 {

    font-size: 34px;

  }

}


/* =====================================================
   Mobile
===================================================== */

@media (max-width: 480px) {

  .hero-section {

    height: 525px;

  }


  .hero-background {

    background-position:
      center center;

  }


  .hero-content {

    justify-content: center;

    padding-top: 5px;

  }


  .logo-ring {

    width: 185px;

    height: 185px;

  }


  .logo-circle {

    width: 125px;

    height: 125px;

    border-radius: 30px;

  }


  .xrp-logo {

    width: 96px;

    height: 96px;

  }


  .xrp-title {

    font-size: 45px;

    letter-spacing: 12px;

    padding-left: 12px;

  }


  .xrp-subtitle {

    margin-top: 13px;

    font-size: 9px;

    letter-spacing: 4px;

  }


  .login-section {

    margin-top: -55px;

    padding:
      0
      10px
      30px;

  }


  .login-card {

    padding:
      38px
      20px
      30px;

    border-radius:
      30px;

  }


  .card-watermark {

    top: 25px;

    right: 20px;

    font-size: 55px;

  }


  .login-header {

    margin-bottom: 25px;

  }


  .login-header h1 {

    font-size: 30px;

  }


  .login-header p {

    font-size: 13px;

  }


  .login-type-selector {

    height: 57px;

    margin-bottom: 23px;

  }


  .type-btn {

    font-size: 12px;

    gap: 6px;

  }


  .type-btn i {

    font-size: 14px;

  }


  .field-label {

    font-size: 14px;

  }


  .main-input {

    height: 57px;

    border-radius: 29px;

    font-size: 14px;

    padding-right: 50px;

  }


  .input-icon {

    right: 19px;

    font-size: 16px;

  }


  .phone-row {

    gap: 7px;

  }


  .country-select {

    width: 125px;

    height: 57px;

    border-radius: 29px;

    font-size: 11px;

    padding: 0 8px;

  }


  .phone-main-input {

    height: 57px;

    border-radius: 29px;

    font-size: 13px;

    padding: 0 15px;

  }


  .password-input {

    padding-left: 60px;

  }


  .login-button {

    height: 59px;

    border-radius: 30px;

    font-size: 16px;

    margin-top: 25px;

  }


  .register-text {

    font-size: 13px;

  }


  .bottom-brand span {

    width: 65px;

  }


  .bottom-brand strong {

    font-size: 15px;

  }

}


/* =====================================================
   شاشات صغيرة جداً
===================================================== */

@media (max-width: 360px) {

  .hero-section {

    height: 500px;

  }


  .logo-ring {

    width: 165px;

    height: 165px;

  }


  .logo-circle {

    width: 112px;

    height: 112px;

  }


  .xrp-logo {

    width: 85px;

    height: 85px;

  }


  .xrp-title {

    font-size: 39px;

    letter-spacing: 9px;

    padding-left: 9px;

  }


  .xrp-subtitle {

    font-size: 8px;

    letter-spacing: 3px;

  }


  .login-card {

    padding:
      32px
      16px
      25px;

  }


  .country-select {

    width: 105px;

  }

}

</style>
