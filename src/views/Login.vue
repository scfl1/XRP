<template>
  <div class="login-page" dir="rtl">

    <!-- =========================
         HERO / BACKGROUND
    ========================== -->
    <section class="hero-section">

      <!-- صورة الخلفية الكبيرة -->
      <div
        class="hero-background"
        :style="{ backgroundImage: `url(${logoBg})` }"
      ></div>

      <!-- طبقة داكنة فوق الخلفية -->
      <div class="hero-overlay"></div>

      <!-- تأثير إضاءة -->
      <div class="hero-glow"></div>

      <!-- زر اللغة -->
      <div class="language-button">
        <i class="fas fa-globe"></i>
        <span>العربية</span>
      </div>

      <!-- الشعار -->
      <div class="brand-area">

        <div class="logo-frame">

          <div class="logo-ring"></div>

          <img
            :src="logo"
            class="main-logo"
            alt="XRP Logo"
          />

        </div>

        <!-- اسم XRP -->
        <div class="xrp-title">
          XRP
        </div>

        <div class="xrp-subtitle">
          THE FUTURE OF FINANCE
        </div>

      </div>

    </section>


    <!-- =========================
         LOGIN CARD
    ========================== -->
    <main class="content-area">

      <div class="card">

        <!-- رأس البطاقة -->
        <div class="card-header">

          <h1 class="title">
            تسجيل الدخول
          </h1>

          <p class="subtitle">
            مرحباً بك، قم بتسجيل الدخول إلى حسابك
          </p>

        </div>


        <!-- رسالة الخطأ -->
        <div
          v-if="errorMessage"
          class="error-message-box"
        >
          <i class="fas fa-circle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>


        <!-- =========================
             LOGIN TYPE
        ========================== -->
        <div class="login-type-selector">

          <!-- البريد -->
          <button
            type="button"
            class="type-btn"
            :class="{ active: loginType === 'email' }"
            @click="
              loginType = 'email';
              clearError()
            "
          >
            <i class="fas fa-envelope"></i>

            <span>
              البريد الإلكتروني
            </span>
          </button>


          <!-- الهاتف -->
          <button
            type="button"
            class="type-btn"
            :class="{ active: loginType === 'phone' }"
            @click="
              loginType = 'phone';
              clearError()
            "
          >
            <i class="fas fa-phone"></i>

            <span>
              رقم الهاتف
            </span>
          </button>

        </div>


        <!-- =========================
             EMAIL LOGIN
        ========================== -->
        <template v-if="loginType === 'email'">

          <label class="label">
            <i class="fas fa-envelope"></i>
            البريد الإلكتروني
          </label>

          <div class="field-wrapper">

            <i class="fas fa-envelope field-icon"></i>

            <input
              type="email"
              v-model="email"
              placeholder="أدخل البريد الإلكتروني"
              class="input input-with-icon"
              :class="{
                'input-error':
                  errorMessage && loginType === 'email'
              }"
              autocomplete="email"
              @keyup.enter="loginUser"
              @focus="clearError"
            />

          </div>

        </template>


        <!-- =========================
             PHONE LOGIN
        ========================== -->
        <template v-if="loginType === 'phone'">

          <label class="label">
            <i class="fas fa-phone"></i>
            رقم الهاتف مع رمز الدولة
          </label>


          <div class="phone-input-container">

            <select
              v-model="countryCode"
              class="country-select"
              @change="clearError"
            >

              <option value="">
                اختر الرمز
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
             PASSWORD
        ========================== -->
        <label class="label">

          <i class="fas fa-lock"></i>

          كلمة المرور

        </label>


        <div class="input-box">

          <i class="fas fa-lock field-icon"></i>

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="أدخل كلمة المرور"
            class="input input-with-icon password-input"
            :class="{ 'input-error': errorMessage }"
            autocomplete="current-password"
            @keyup.enter="loginUser"
            @focus="clearError"
          />


          <button
            type="button"
            class="toggle"
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
             LOGIN BUTTON
        ========================== -->
        <button
          type="button"
          class="btn"
          @click="loginUser"
          :disabled="loading"
        >

          <span v-if="!loading">

            <i class="fas fa-right-to-bracket"></i>

            تسجيل الدخول

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
        <p class="link">

          ليس لديك حساب؟

          <router-link to="/register">
            إنشاء حساب
          </router-link>

        </p>


        <!-- العلامة السفلية -->
        <div class="bottom-brand">

          <span></span>

          <strong>XRP</strong>

          <span></span>

        </div>

      </div>

    </main>


    <!-- =========================
         AD POPUP
    ========================== -->
    <div
      id="companyAd"
      class="ad-overlay"
      v-if="showAd"
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

            🎉🎉🎉🎉 مرحبا بالجميع!

            <br><br>

            تأسست Palm Treasure في سنغافورة في 20 أغسطس 2021
            ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة.
            نحن شركة استثمار في التجارة الإلكترونية مع فريق تقني قوي وقوة مالية قوية.

            <br><br>

            يتعاون Palm Treasure مع عشرات شركات التجارة الإلكترونية
            مثل Amazon و eBay و Tiktok و Aliexpress و Alibaba و Shopee،
            لمساعدة التجار على زيادة مبيعات المنتجات الخاصة بهم.

            <br><br>

            👍1: الحد الأدنى لمبلغ إعادة الشحن: 12 USDT،
            الحد الأدنى للسحب النقدي: 3 USDT

            <br>

            💰2: تستثمر المنصة على مستوى العالم،
            لذا فإن الاستثمار يدعم فقط إعادة شحن العملة المشفرة.

            <br>

            🌈3: وقت إعادة تعيين المهمة هو الساعة 12 ظهراً في سنغافورة.
            يمكنك الحصول على الربح من خلال استكمال أوامر التاجر كل يوم.

            <br>

            🕯4: يمكنك سحب النقد مرة واحدة فقط في اليوم،
            والحد الأدنى لمبلغ السحب هو 3 USDT.

          </p>

        </div>


        <button
          type="button"
          @click="closeAd"
          class="ad-btn"
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

      /* الإعلان */
      showAd: false,

      adTimer: null,

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

    if (this.adTimer) {

      clearTimeout(this.adTimer);

    }

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

      if (
        event.key === "Escape" &&
        this.showAd
      ) {

        this.closeAd();

      }

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


        if (user.disabled === true) {

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


    closeAd() {

      this.showAd = false;

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

  background:
    #ffffff;

  color: #111;

  overflow-x: hidden;

}


/* =====================================================
   HERO
===================================================== */

.hero-section {

  position: relative;

  width: 100%;

  height: 455px;

  overflow: hidden;

  background: #050505;

}


/* الصورة الكبيرة */

.hero-background {

  position: absolute;

  inset: 0;

  width: 100%;

  height: 100%;

  background-size: cover;

  background-position: center center;

  background-repeat: no-repeat;

  transform: scale(1.02);

}


/* الطبقة فوق الصورة */

.hero-overlay {

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.10) 0%,
      rgba(0,0,0,0.20) 40%,
      rgba(0,0,0,0.70) 100%
    );

}


/* تأثير إضاءة */

.hero-glow {

  position: absolute;

  width: 420px;

  height: 420px;

  left: 50%;

  top: 50%;

  transform:
    translate(-50%, -50%);

  background:
    radial-gradient(
      circle,
      rgba(255,255,255,0.16) 0%,
      rgba(255,255,255,0.05) 35%,
      transparent 70%
    );

  pointer-events: none;

}


/* =====================================================
   LANGUAGE
===================================================== */

.language-button {

  position: absolute;

  top: 22px;

  right: 20px;

  z-index: 5;

  display: flex;

  align-items: center;

  gap: 9px;

  padding: 10px 17px;

  color: #fff;

  background:
    rgba(0,0,0,0.38);

  border:
    1px solid rgba(255,255,255,0.16);

  border-radius: 30px;

  backdrop-filter:
    blur(10px);

  font-size: 13px;

  font-weight: 700;

}


/* =====================================================
   BRAND
===================================================== */

.brand-area {

  position: absolute;

  z-index: 4;

  left: 50%;

  top: 48%;

  transform:
    translate(-50%, -50%);

  width: 100%;

  text-align: center;

  color: #fff;

}


/* إطار الشعار */

.logo-frame {

  position: relative;

  width: 170px;

  height: 170px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;

  justify-content: center;

}


/* الحلقة الخارجية */

.logo-ring {

  position: absolute;

  inset: 0;

  border:

    2px solid

    rgba(255,255,255,0.72);

  border-radius: 50%;

  box-shadow:

    0 0 25px
    rgba(255,255,255,0.25),

    inset 0 0 25px
    rgba(255,255,255,0.10);

  animation:
    pulseRing 3s ease-in-out infinite;

}


/* الحلقة الثانية */

.logo-ring::after {

  content: "";

  position: absolute;

  inset: 11px;

  border:

    1px solid

    rgba(255,255,255,0.35);

  border-radius: 50%;

}


/* الشعار */

.main-logo {

  position: relative;

  z-index: 3;

  width: 125px;

  height: 125px;

  object-fit: contain;

  border-radius: 28px;

  filter:
    grayscale(100%)
    brightness(1.08);

  background: #fff;

  padding: 5px;

  box-sizing: border-box;

  box-shadow:

    0 20px 45px
    rgba(0,0,0,0.35);

}


/* اسم XRP */

.xrp-title {

  font-size: 42px;

  line-height: 1;

  font-weight: 900;

  letter-spacing: 13px;

  padding-left: 13px;

  text-shadow:

    0 4px 18px
    rgba(0,0,0,0.5);

}


/* النص */

.xrp-subtitle {

  margin-top: 12px;

  font-size: 10px;

  letter-spacing: 5px;

  padding-left: 5px;

  opacity: 0.85;

}


/* =====================================================
   CONTENT
===================================================== */

.content-area {

  position: relative;

  margin-top: -18px;

  padding:

    0 18px
    40px;

  z-index: 10;

}


/* =====================================================
   CARD
===================================================== */

.card {

  width: 100%;

  max-width: 430px;

  margin: 0 auto;

  padding: 30px 25px 25px;

  box-sizing: border-box;

  background:
    rgba(255,255,255,0.98);

  border-radius: 30px;

  border:

    1px solid
    #e7e7e7;

  box-shadow:

    0 -10px 35px
    rgba(0,0,0,0.06),

    0 25px 70px
    rgba(0,0,0,0.13);

}


/* =====================================================
   HEADER
===================================================== */

.card-header {

  text-align: center;

  margin-bottom: 22px;

}


.title {

  margin: 0;

  color: #111;

  font-size: 27px;

  font-weight: 900;

}


.subtitle {

  margin:

    8px 0 0;

  color: #888;

  font-size: 13px;

}


/* =====================================================
   ERROR
===================================================== */

.error-message-box {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding: 12px;

  margin-bottom: 18px;

  background: #f4f4f4;

  color: #222;

  border:

    1px solid
    #ddd;

  border-right:

    3px solid
    #000;

  border-radius: 12px;

  font-size: 12px;

  font-weight: 700;

}


/* =====================================================
   LOGIN TYPE
===================================================== */

.login-type-selector {

  display: flex;

  gap: 6px;

  padding: 5px;

  margin-bottom: 22px;

  background: #f3f3f3;

  border-radius: 15px;

  border:
    1px solid
    #e6e6e6;

}


.type-btn {

  flex: 1;

  height: 44px;

  border: none;

  border-radius: 11px;

  background: transparent;

  color: #888;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  font-size: 12px;

  font-weight: 800;

  transition:
    all .25s ease;

}


.type-btn.active {

  color: #fff;

  background: #000;

  box-shadow:

    0 7px 18px
    rgba(0,0,0,0.17);

}


.type-btn:not(.active):hover {

  color: #111;

  background: #e8e8e8;

}


/* =====================================================
   LABEL
===================================================== */

.label {

  display: block;

  margin-bottom: 8px;

  color: #222;

  font-size: 13px;

  font-weight: 800;

}


.label i {

  margin-left: 6px;

  color: #555;

}


/* =====================================================
   INPUTS
===================================================== */

.field-wrapper {

  position: relative;

}


.input,
.country-select,
.phone-input {

  width: 100%;

  height: 52px;

  box-sizing: border-box;

  margin-bottom: 17px;

  padding: 10px 43px 10px 13px;

  border:

    1px solid
    #dedede;

  border-radius: 14px;

  background: #fafafa;

  color: #111;

  font-size: 14px;

  transition:
    all .25s ease;

}


.input::placeholder,
.phone-input::placeholder {

  color: #999;

}


.input:focus,
.country-select:focus,
.phone-input:focus {

  outline: none;

  border-color: #111;

  background: #fff;

  box-shadow:

    0 0 0 4px
    rgba(0,0,0,0.05);

}


.field-icon {

  position: absolute;

  right: 15px;

  top: 18px;

  z-index: 3;

  color: #777;

  font-size: 14px;

}


.input-error {

  border-color:
    #000 !important;

}


/* =====================================================
   PHONE
===================================================== */

.phone-input-container {

  display: flex;

  gap: 8px;

  margin-bottom: 15px;

}


.country-select {

  width: 125px;

  margin-bottom: 0;

  padding: 5px 8px;

  cursor: pointer;

  font-size: 11px;

}


.phone-input {

  flex: 1;

  margin-bottom: 0;

  direction: ltr;

  text-align: left;

  padding: 10px 13px;

}


.phone-input:disabled {

  background: #ededed;

  cursor: not-allowed;

}


.validation-error {

  display: block;

  margin:

    4px 0 14px;

  color: #222;

  font-size: 11px;

  font-weight: 700;

}


/* =====================================================
   PASSWORD
===================================================== */

.input-box {

  position: relative;

}


.password-input {

  padding-left: 48px;

}


.toggle {

  position: absolute;

  left: 9px;

  top: 8px;

  width: 36px;

  height: 36px;

  border: none;

  border-radius: 50%;

  background: #f0f0f0;

  color: #555;

  cursor: pointer;

  font-size: 13px;

}


.toggle:hover {

  background: #e5e5e5;

  color: #000;

}


/* =====================================================
   BUTTON
===================================================== */

.btn {

  width: 100%;

  height: 53px;

  margin-top: 7px;

  border: none;

  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #000,
      #272727
    );

  color: #fff;

  cursor: pointer;

  font-size: 15px;

  font-weight: 900;

  box-shadow:

    0 12px 25px
    rgba(0,0,0,0.18);

  transition:
    all .25s ease;

}


.btn:hover:not(:disabled) {

  transform:
    translateY(-2px);

  box-shadow:

    0 17px 30px
    rgba(0,0,0,0.22);

}


.btn:active:not(:disabled) {

  transform:
    translateY(0);

}


.btn:disabled {

  opacity: .6;

  cursor: not-allowed;

}


.btn i {

  margin-left: 7px;

}


/* =====================================================
   LOADING
===================================================== */

.loading-content {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

}


.loader {

  width: 18px;

  height: 18px;

  border:

    2px solid
    #666;

  border-top-color:
    #fff;

  border-radius: 50%;

  animation:
    spin .8s linear infinite;

}


/* =====================================================
   REGISTER
===================================================== */

.link {

  margin:

    20px 0 0;

  text-align: center;

  color: #999;

  font-size: 13px;

}


.link a {

  color: #000;

  text-decoration: none;

  font-weight: 900;

}


.link a:hover {

  text-decoration: underline;

}


/* =====================================================
   BOTTOM XRP
===================================================== */

.bottom-brand {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-top: 22px;

  color: #999;

  font-size: 10px;

  letter-spacing: 4px;

}


.bottom-brand span {

  width: 35px;

  height: 1px;

  background: #ddd;

}


/* =====================================================
   AD
===================================================== */

.ad-overlay {

  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:
    rgba(0,0,0,0.78);

}


.ad-box {

  width: 90%;

  max-width: 400px;

  overflow: hidden;

  background: #fff;

  border-radius: 22px;

  border:
    1px solid #ddd;

  box-shadow:

    0 30px 80px
    rgba(0,0,0,0.4);

}


.ad-header {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 17px;

  color: #fff;

  background: #000;

}


.ad-header h2 {

  margin: 0;

  font-size: 18px;

}


.ad-content {

  padding: 20px;

  color: #222;

  font-size: 13px;

  line-height: 1.8;

  max-height: 300px;

  overflow-y: auto;

}


.ad-content p {

  margin: 0;

}


.ad-btn {

  width: 100%;

  padding: 15px;

  border: none;

  border-top:
    1px solid #ddd;

  background: #fff;

  color: #000;

  cursor: pointer;

  font-weight: 900;

}


.ad-btn:hover {

  background: #f3f3f3;

}


/* =====================================================
   ANIMATIONS
===================================================== */

@keyframes pulseRing {

  0%,
  100% {

    transform: scale(1);

    opacity: .75;

  }

  50% {

    transform: scale(1.05);

    opacity: 1;

  }

}


@keyframes spin {

  to {

    transform:
      rotate(360deg);

  }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 600px) {

  .hero-section {

    height: 440px;

  }


  .language-button {

    top: 17px;

    right: 15px;

    padding:
      9px 14px;

  }


  .logo-frame {

    width: 155px;

    height: 155px;

  }


  .main-logo {

    width: 112px;

    height: 112px;

  }


  .xrp-title {

    font-size: 38px;

    letter-spacing: 11px;

    padding-left: 11px;

  }


  .xrp-subtitle {

    font-size: 9px;

    letter-spacing: 4px;

  }


  .content-area {

    padding:
      0 12px 30px;

  }


  .card {

    padding:
      27px 19px 23px;

    border-radius: 27px;

  }


  .title {

    font-size: 25px;

  }


  .subtitle {

    font-size: 12px;

  }


  .country-select {

    width: 115px;

  }

}


@media (max-width: 370px) {

  .hero-section {

    height: 410px;

  }


  .logo-frame {

    width: 140px;

    height: 140px;

  }


  .main-logo {

    width: 102px;

    height: 102px;

  }


  .xrp-title {

    font-size: 34px;

  }


  .country-select {

    width: 105px;

    font-size: 10px;

  }

}

</style>
