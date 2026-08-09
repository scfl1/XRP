<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${loginBg})` }"
  >
    <div class="background-overlay"></div>

    <div class="card">

      <!-- ==================== الشعار ==================== -->
      <div
        class="brand-header"
        :style="{ backgroundImage: `url(${xrpBg})` }"
      >
        <div class="brand-overlay"></div>

        <div
          class="logo-background"
          :style="{ backgroundImage: `url(${logoBg})` }"
        >
          <div class="logo-background-overlay"></div>

          <div class="logo-wrapper">
            <img
              :src="logo"
              class="luxury-logo"
              alt="XRP Logo"
            />
          </div>
        </div>

        <div class="xrp-name">XRP</div>

        <div class="brand-line"></div>

        <div class="brand-subtitle">
          DIGITAL ASSET
        </div>
      </div>

      <!-- ==================== العنوان ==================== -->
      <h2 class="title">تسجيل الدخول</h2>

      <p class="subtitle">
        مرحبًا بك، قم بتسجيل الدخول إلى حسابك
      </p>

      <!-- ==================== رسالة الخطأ ==================== -->
      <div
        v-if="errorMessage"
        class="error-message-box"
      >
        <i class="fas fa-circle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- ==================== نوع الدخول ==================== -->
      <div class="login-type-selector">

        <button
          type="button"
          class="type-btn"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'; clearError()"
        >
          <i class="fas fa-envelope"></i>
          <span>البريد الإلكتروني</span>
        </button>

        <button
          type="button"
          class="type-btn"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'; clearError()"
        >
          <i class="fas fa-phone"></i>
          <span>رقم الهاتف</span>
        </button>

      </div>

      <!-- ==================== البريد الإلكتروني ==================== -->
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

      <!-- ==================== رقم الهاتف ==================== -->
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
            <option value="">رمز الدولة</option>

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

      <!-- ==================== كلمة المرور ==================== -->
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

          <span>
            {{ showPassword ? "إخفاء" : "إظهار" }}
          </span>
        </button>

      </div>

      <!-- ==================== تسجيل الدخول ==================== -->
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

      <!-- ==================== إنشاء حساب ==================== -->
      <p class="link">
        ليس لديك حساب؟

        <router-link to="/register">
          إنشاء حساب جديد
        </router-link>
      </p>

      <!-- ==================== العلامة السفلية ==================== -->
      <div class="bottom-brand">

        <span class="bottom-line"></span>

        <span>XRP</span>

        <span class="bottom-line"></span>

      </div>

    </div>
  </div>

  <!-- ==================== الإعلان ==================== -->
  <div
    v-if="showAd"
    id="companyAd"
    class="ad-overlay"
    @click.self="closeAd"
  >

    <div class="ad-box">

      <div class="ad-header">

        <div class="ad-icon">
          <i class="fas fa-bullhorn"></i>
        </div>

        <h2>إعلان</h2>

      </div>

      <div class="ad-content">

        <p>
          🎉 مرحبا بالجميع!

          <br><br>

          تأسست Palm Treasure في سنغافورة في 20 أغسطس 2021
          ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة.

          <br><br>

          يتعاون Palm Treasure مع شركات التجارة الإلكترونية
          لمساعدة التجار على زيادة مبيعات المنتجات الخاصة بهم.

          <br><br>

          👍 الحد الأدنى لمبلغ إعادة الشحن: 12 USDT

          <br>

          💰 الحد الأدنى للسحب النقدي: 3 USDT

          <br>

          🌈 يمكنك إكمال المهام اليومية وفقًا للشروط
          الموضحة داخل المنصة.

        </p>

      </div>

      <button
        type="button"
        class="ad-btn"
        @click="closeAd"
      >
        فهمت
      </button>

    </div>

  </div>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { db } from "../firebase";
import router from "../router";

import logo from "../assets/palm-gold.png";

/*
 * صور التصميم
 *
 * ضع هذه الملفات داخل:
 * src/assets/
 *
 * login-bg.jpg
 * logo-bg.jpg
 * xrp-bg.jpg
 */
import loginBg from "../assets/login-bg.jpg";
import logoBg from "../assets/logo-bg.jpg";
import xrpBg from "../assets/xrp-bg.jpg";

export default {

  data() {
    return {

      /* ==================== الصور ==================== */

      logo,
      loginBg,
      logoBg,
      xrpBg,

      /* ==================== تسجيل الدخول ==================== */

      loginType: "email",

      email: "",

      countryCode: "",

      phoneNumber: "",

      fullPhoneNumber: "",

      password: "",

      showPassword: false,

      loading: false,

      /* ==================== الإعلان ==================== */

      showAd: false,

      adTimer: null,

      /* ==================== الأخطاء ==================== */

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

    /* ==================== كلمة المرور ==================== */

    togglePassword() {

      this.showPassword =
        !this.showPassword;

    },

    /* ==================== مسح الأخطاء ==================== */

    clearError() {

      this.errorMessage = "";

      this.phoneError = "";

    },

    /* ==================== التحقق من البريد ==================== */

    validateEmail(email) {

      const re =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return re.test(email);

    },

    /* ==================== التحقق من الهاتف ==================== */

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

    /* ==================== تحويل الهاتف إلى Email ==================== */

    generatePhoneEmail(phoneNumber) {

      const cleanPhone =
        phoneNumber.replace(
          /\+/g,
          ""
        );

      return `${cleanPhone}@phone.app`;

    },

    /* ==================== رسائل Firebase ==================== */

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

      if (
        error.code ===
        "auth/operation-not-allowed"
      ) {

        return "طريقة تسجيل الدخول هذه غير مفعلة حالياً.";

      }

      return "حدث خطأ. يرجى المحاولة لاحقاً.";

    },

    /* ==================== زر ESC ==================== */

    handleEscKey(event) {

      if (
        event.key === "Escape" &&
        this.showAd
      ) {

        this.closeAd();

      }

    },

    /* ==================== تسجيل الدخول ==================== */

    async loginUser() {

      this.errorMessage = "";

      this.phoneError = "";

      let loginEmail =
        this.email.trim();

      /* ---------- الهاتف ---------- */

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

      /* ---------- البريد ---------- */

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

      /* ---------- كلمة المرور ---------- */

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

      const auth = getAuth();

      try {

        /* تسجيل الدخول عبر Firebase */

        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            loginEmail,
            this.password
          );

        const user =
          userCredential.user;

        /* تحديث بيانات المستخدم */

        await user.reload();

        const updatedUser =
          auth.currentUser;

        /* التحقق من حظر الحساب */

        if (
          updatedUser &&
          updatedUser.disabled === true
        ) {

          await signOut(auth);

          this.errorMessage =
            "تم حظر حسابك، تواصل مع الدعم.";

          return;

        }

        /* ==================== حسابات الإدارة ==================== */

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

    /* ==================== إغلاق الإعلان ==================== */

    closeAd() {

      this.showAd = false;

    }

  }

};
</script>

<style scoped>

/* =========================================================
   المتغيرات العامة
   ========================================================= */

* {
  box-sizing: border-box;
}

/* =========================================================
   الخلفية الرئيسية
   ========================================================= */

.container {

  position: relative;

  min-height: 100vh;

  width: 100%;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 25px;

  direction: rtl;

  background-color: #f2f2f2;

  background-size: cover;

  background-position: center;

  background-repeat: no-repeat;

  overflow: hidden;

}

/* طبقة فوق صورة الخلفية */

.background-overlay {

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,0.88),
      rgba(245,245,245,0.76)
    );

  backdrop-filter: blur(3px);

  z-index: 1;

}

/* =========================================================
   البطاقة
   ========================================================= */

.card {

  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 410px;

  padding: 28px 30px 25px;

  background:
    rgba(255,255,255,0.97);

  border:

    1px solid

    rgba(0,0,0,0.10);

  border-radius: 26px;

  box-shadow:

    0 30px 80px

    rgba(0,0,0,0.16),

    0 8px 25px

    rgba(0,0,0,0.06);

  overflow: hidden;

}

/* خط أعلى البطاقة */

.card::before {

  content: "";

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 4px;

  background: #000;

}

/* =========================================================
   منطقة الشعار
   ========================================================= */

.brand-header {

  position: relative;

  padding: 22px 15px 19px;

  margin-bottom: 20px;

  border-radius: 20px;

  background-size: cover;

  background-position: center;

  overflow: hidden;

  text-align: center;

}

/* طبقة صورة الشعار */

.brand-overlay {

  position: absolute;

  inset: 0;

  background:
    rgba(255,255,255,0.72);

  backdrop-filter: blur(2px);

  z-index: 1;

}

/* =========================================================
   الصورة خلف الشعار
   ========================================================= */

.logo-background {

  position: relative;

  z-index: 2;

  width: 125px;

  height: 125px;

  margin: 0 auto 10px;

  border-radius: 50%;

  background-size: cover;

  background-position: center;

  display: flex;

  justify-content: center;

  align-items: center;

  overflow: hidden;

  border:

    1px solid

    rgba(0,0,0,0.15);

  box-shadow:

    0 15px 40px

    rgba(0,0,0,0.15);

}

/* طبقة شفافة فوق صورة خلف الشعار */

.logo-background-overlay {

  position: absolute;

  inset: 0;

  background:
    rgba(255,255,255,0.42);

  backdrop-filter: blur(1px);

}

/* =========================================================
   الشعار
   ========================================================= */

.logo-wrapper {

  position: relative;

  z-index: 3;

  display: flex;

  justify-content: center;

  align-items: center;

}

.luxury-logo {

  width: 88px;

  height: 88px;

  object-fit: contain;

  filter: grayscale(100%);

  drop-shadow:
    0 5px 15px
    rgba(0,0,0,0.20);

}

/* =========================================================
   XRP
   ========================================================= */

.xrp-name {

  position: relative;

  z-index: 2;

  color: #000;

  font-size: 29px;

  font-weight: 900;

  letter-spacing: 7px;

  line-height: 1;

  margin-top: 4px;

}

.brand-line {

  position: relative;

  z-index: 2;

  width: 48px;

  height: 3px;

  background: #000;

  border-radius: 10px;

  margin: 12px auto 8px;

}

.brand-subtitle {

  position: relative;

  z-index: 2;

  color: #777;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 3px;

}

/* =========================================================
   العنوان
   ========================================================= */

.title {

  color: #111;

  text-align: center;

  font-size: 24px;

  font-weight: 800;

  margin: 0 0 6px;

}

.subtitle {

  color: #888;

  text-align: center;

  font-size: 13px;

  margin: 0 0 22px;

}

/* =========================================================
   الخطأ
   ========================================================= */

.error-message-box {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  background: #f6f6f6;

  border: 1px solid #dedede;

  border-right: 3px solid #000;

  border-radius: 12px;

  padding: 12px;

  margin-bottom: 18px;

  color: #222;

  font-size: 13px;

  font-weight: 600;

  text-align: center;

}

.error-message-box i {

  color: #000;

}

/* =========================================================
   اختيار الدخول
   ========================================================= */

.login-type-selector {

  display: flex;

  gap: 5px;

  padding: 5px;

  margin-bottom: 21px;

  background: #f0f0f0;

  border: 1px solid #e4e4e4;

  border-radius: 13px;

}

.type-btn {

  flex: 1;

  min-height: 43px;

  border: none;

  background: transparent;

  color: #777;

  border-radius: 9px;

  cursor: pointer;

  font-size: 12px;

  font-weight: 700;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  transition: all .25s ease;

}

.type-btn:hover {

  color: #000;

}

.type-btn.active {

  background: #000;

  color: #fff;

  box-shadow:

    0 6px 16px

    rgba(0,0,0,0.15);

}

.type-btn:active {

  transform: scale(.98);

}

/* =========================================================
   Labels
   ========================================================= */

.label {

  display: flex;

  align-items: center;

  gap: 7px;

  color: #222;

  margin-bottom: 8px;

  font-size: 13px;

  font-weight: 700;

}

.label i {

  color: #000;

  font-size: 12px;

}

/* =========================================================
   الحقول
   ========================================================= */

.field-wrapper {

  position: relative;

  width: 100%;

}

.input,
.country-select,
.phone-input {

  width: 100%;

  height: 48px;

  padding: 0 14px;

  margin-bottom: 16px;

  border: 1px solid #ddd;

  border-radius: 12px;

  background: #fafafa;

  color: #111;

  font-size: 14px;

  font-weight: 500;

  transition: all .25s ease;

}

.input::placeholder,
.phone-input::placeholder {

  color: #aaa;

}

.input-with-icon {

  padding-right: 42px;

}

.input:focus,
.country-select:focus,
.phone-input:focus {

  outline: none;

  border-color: #000;

  background: #fff;

  box-shadow:

    0 0 0 3px

    rgba(0,0,0,0.06);

}

.input-error {

  border-color: #000 !important;

  box-shadow:

    0 0 0 2px

    rgba(0,0,0,0.08);

}

.field-icon {

  position: absolute;

  right: 14px;

  top: 15px;

  color: #777;

  font-size: 14px;

  z-index: 2;

}

/* =========================================================
   الهاتف
   ========================================================= */

.phone-input-container {

  display: flex;

  gap: 8px;

  direction: ltr;

  margin-bottom: 14px;

}

.country-select {

  width: 125px;

  flex-shrink: 0;

  margin-bottom: 0;

  padding: 0 8px;

  font-size: 12px;

  cursor: pointer;

}

.phone-input {

  flex: 1;

  margin-bottom: 0;

  direction: ltr;

  text-align: left;

}

.phone-input:disabled {

  background: #eee;

  color: #999;

  cursor: not-allowed;

}

.validation-error {

  display: block;

  color: #222;

  font-size: 11px;

  margin: -5px 0 14px;

  font-weight: 600;

}

.validation-error i {

  margin-left: 4px;

}

/* =========================================================
   كلمة المرور
   ========================================================= */

.input-box {

  position: relative;

  width: 100%;

}

.password-input {

  padding-left: 80px;

}

.toggle {

  position: absolute;

  left: 10px;

  top: 9px;

  height: 30px;

  padding: 0 7px;

  border: none;

  background: transparent;

  color: #555;

  cursor: pointer;

  font-size: 11px;

  font-weight: 700;

  display: flex;

  align-items: center;

  gap: 5px;

  z-index: 3;

}

.toggle:hover {

  color: #000;

}

/* =========================================================
   زر الدخول
   ========================================================= */

.btn {

  width: 100%;

  height: 50px;

  border: none;

  border-radius: 12px;

  background: #000;

  color: #fff;

  font-size: 15px;

  font-weight: 800;

  cursor: pointer;

  margin-top: 5px;

  transition: all .25s ease;

}

.btn:hover:not(:disabled) {

  background: #191919;

  transform: translateY(-2px);

  box-shadow:

    0 10px 25px

    rgba(0,0,0,0.18);

}

.btn:active:not(:disabled) {

  transform: translateY(0);

}

.btn:disabled {

  opacity: .65;

  cursor: not-allowed;

}

.btn i {

  margin-left: 7px;

}

/* =========================================================
   Loader
   ========================================================= */

.loading-content {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

}

.loader {

  width: 18px;

  height: 18px;

  border: 2px solid

    rgba(255,255,255,.35);

  border-top-color: #fff;

  border-radius: 50%;

  animation:

    spin .8s linear infinite;

}

@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}

/* =========================================================
   إنشاء حساب
   ========================================================= */

.link {

  text-align: center;

  color: #888;

  font-size: 13px;

  margin: 20px 0 0;

}

.link a {

  color: #000;

  text-decoration: none;

  font-weight: 800;

  margin-right: 4px;

}

.link a:hover {

  opacity: .55;

}

/* =========================================================
   العلامة السفلية
   ========================================================= */

.bottom-brand {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-top: 23px;

  color: #aaa;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 3px;

}

.bottom-line {

  width: 25px;

  height: 1px;

  background: #ccc;

}

/* =========================================================
   الإعلان
   ========================================================= */

.ad-overlay {

  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background:

    rgba(0,0,0,.72);

  backdrop-filter: blur(6px);

}

.ad-box {

  width: 100%;

  max-width: 420px;

  background: #fff;

  border-radius: 22px;

  overflow: hidden;

  border: 1px solid #ddd;

  box-shadow:

    0 30px 80px

    rgba(0,0,0,.30);

}

.ad-header {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 18px 20px;

  background: #000;

  color: #fff;

}

.ad-icon {

  width: 36px;

  height: 36px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #fff;

  color: #000;

  border-radius: 50%;

}

.ad-header h2 {

  margin: 0;

  font-size: 18px;

  font-weight: 800;

}

.ad-content {

  padding: 20px;

  color: #333;

  font-size: 13px;

  line-height: 1.8;

  max-height: 330px;

  overflow-y: auto;

}

.ad-content p {

  margin: 0;

}

.ad-btn {

  width: 100%;

  height: 50px;

  background: #fff;

  color: #000;

  border: none;

  border-top: 1px solid #eee;

  cursor: pointer;

  font-size: 14px;

  font-weight: 800;

}

.ad-btn:hover {

  background: #f3f3f3;

}

/* =========================================================
   الهاتف
   ========================================================= */

@media (max-width: 480px) {

  .container {

    padding: 15px;

  }

  .card {

    padding: 25px 19px 23px;

    border-radius: 22px;

  }

  .brand-header {

    padding: 18px 10px;

  }

  .logo-background {

    width: 112px;

    height: 112px;

  }

  .luxury-logo {

    width: 80px;

    height: 80px;

  }

  .xrp-name {

    font-size: 26px;

  }

  .title {

    font-size: 22px;

  }

  .country-select {

    width: 112px;

    font-size: 11px;

  }

  .type-btn {

    font-size: 11px;

  }

}

/* =========================================================
   الهواتف الصغيرة جدًا
   ========================================================= */

@media (max-width: 350px) {

  .card {

    padding: 22px 14px;

  }

  .country-select {

    width: 98px;

  }

  .type-btn span {

    font-size: 10px;

  }

  .password-input {

    padding-left: 70px;

  }

}
</style>
