<template>
  <div class="container">
    <div class="card">

      <!-- الشعار والعنوان -->
      <div class="brand-header">

        <!-- صورة واحدة فقط خلف الشعار -->
        <div
          class="logo-background"
          :style="{ backgroundImage: `url(${logoBg})` }"
        >
          <div class="logo-overlay"></div>

          <div class="logo-wrapper">
            <img
              :src="logo"
              class="luxury-logo"
              alt="XRP Logo"
            />
          </div>
        </div>

        <!-- اسم XRP أسفل الشعار -->
        <div class="xrp-name">XRP</div>

        <div class="brand-line"></div>
      </div>

      <h2 class="title">تسجيل الدخول</h2>

      <p class="subtitle">
        مرحباً بك، قم بتسجيل الدخول إلى حسابك
      </p>

      <!-- رسالة الخطأ العامة -->
      <div
        v-if="errorMessage"
        class="error-message-box"
      >
        <i class="fas fa-circle-exclamation"></i>
        {{ errorMessage }}
      </div>

      <!-- اختيار نوع الدخول -->
      <div class="login-type-selector">

        <button
          type="button"
          class="type-btn"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'; clearError()"
        >
          <i class="fas fa-envelope"></i>
          البريد الإلكتروني
        </button>

        <button
          type="button"
          class="type-btn"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'; clearError()"
        >
          <i class="fas fa-phone"></i>
          رقم الهاتف
        </button>

      </div>

      <!-- تسجيل الدخول بالبريد الإلكتروني -->
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
            placeholder="البريد الإلكتروني"
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

      <!-- تسجيل الدخول برقم الهاتف -->
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

            <option value="">اختر الرمز</option>

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

      <!-- كلمة المرور -->
      <label class="label">
        <i class="fas fa-lock"></i>
        كلمة المرور
      </label>

      <div class="input-box">

        <i class="fas fa-lock field-icon"></i>

        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="كلمة المرور"
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

          {{ showPassword ? "إخفاء" : "إظهار" }}
        </button>

      </div>

      <!-- زر تسجيل الدخول -->
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
  </div>

  <!-- Popup إعلان -->
  <div
    id="companyAd"
    class="ad-overlay"
    v-if="showAd"
    @click.self="closeAd"
  >

    <div class="ad-box">

      <div class="ad-header">
        <i class="fas fa-bullhorn"></i>
        <h2>إعلان</h2>
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

      /* الشعار */
      logo,

      /* الصورة الوحيدة خلف الشعار */
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

      /* التحقق من كلمة المرور */

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
   التصميم العام - أبيض وأسود
   ===================================================== */

.container {

  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  background:
    linear-gradient(
      135deg,
      #ffffff 0%,
      #f5f5f5 50%,
      #eeeeee 100%
    );

  padding: 20px;

  direction: rtl;

}

/* =====================================================
   البطاقة
   ===================================================== */

.card {

  position: relative;

  width: 100%;

  max-width: 390px;

  padding: 30px 25px;

  background: rgba(255,255,255,0.98);

  border-radius: 24px;

  border: 1px solid #e5e5e5;

  box-shadow:
    0 25px 70px rgba(0,0,0,0.13);

  overflow: hidden;

}

/* خط أسود أعلى البطاقة */

.card::before {

  content: "";

  position: absolute;

  top: 0;

  right: 0;

  width: 100%;

  height: 4px;

  background: #000;

}

/* =====================================================
   الشعار
   ===================================================== */

.brand-header {

  text-align: center;

  margin-bottom: 24px;

}

/* الصورة الوحيدة خلف الشعار */

.logo-background {

  position: relative;

  width: 135px;

  height: 135px;

  margin: 0 auto 12px;

  border-radius: 50%;

  background-size: cover;

  background-position: center;

  background-repeat: no-repeat;

  display: flex;

  justify-content: center;

  align-items: center;

  overflow: hidden;

  border: 1px solid #d8d8d8;

  box-shadow:
    0 15px 35px rgba(0,0,0,0.14);

}

/* طبقة شفافة فوق الصورة */

.logo-overlay {

  position: absolute;

  inset: 0;

  background: rgba(255,255,255,0.45);

  z-index: 1;

}

/* الشعار */

.logo-wrapper {

  position: relative;

  z-index: 2;

  display: flex;

  justify-content: center;

  align-items: center;

}

.luxury-logo {

  width: 95px;

  height: 95px;

  object-fit: contain;

  filter: grayscale(100%);

}

/* XRP */

.xrp-name {

  color: #000;

  font-size: 28px;

  font-weight: 900;

  letter-spacing: 7px;

  line-height: 1;

}

.brand-line {

  width: 45px;

  height: 3px;

  background: #000;

  border-radius: 10px;

  margin: 12px auto 0;

}

/* =====================================================
   العنوان
   ===================================================== */

.title {

  color: #111;

  text-align: center;

  font-size: 22px;

  margin-bottom: 6px;

  font-weight: 800;

}

.subtitle {

  color: #888;

  text-align: center;

  font-size: 13px;

  margin-top: 0;

  margin-bottom: 23px;

}

/* =====================================================
   الخطأ
   ===================================================== */

.error-message-box {

  background: #f5f5f5;

  border: 1px solid #ddd;

  border-right: 3px solid #000;

  border-radius: 10px;

  padding: 12px;

  margin-bottom: 18px;

  color: #222;

  font-size: 13px;

  text-align: center;

  font-weight: 600;

}

.error-message-box i {

  margin-left: 5px;

}

/* =====================================================
   اختيار طريقة الدخول
   ===================================================== */

.login-type-selector {

  display: flex;

  gap: 6px;

  margin-bottom: 20px;

  background: #f1f1f1;

  padding: 5px;

  border-radius: 12px;

  border: 1px solid #e4e4e4;

}

.type-btn {

  flex: 1;

  padding: 11px 8px;

  border: none;

  background: transparent;

  color: #777;

  cursor: pointer;

  border-radius: 8px;

  font-size: 12px;

  font-weight: 700;

  transition: all .25s ease;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

}

.type-btn.active {

  background: #000;

  color: #fff;

  box-shadow:
    0 5px 15px rgba(0,0,0,0.14);

}

/* =====================================================
   العناوين
   ===================================================== */

.label {

  display: block;

  color: #222;

  margin-bottom: 8px;

  font-size: 13px;

  font-weight: 700;

}

.label i {

  margin-left: 5px;

}

/* =====================================================
   الحقول
   ===================================================== */

.field-wrapper {

  position: relative;

  width: 100%;

}

.input,
.country-select,
.phone-input {

  width: 100%;

  height: 47px;

  padding: 10px 12px;

  margin-bottom: 15px;

  border-radius: 11px;

  border: 1px solid #ddd;

  background: #fafafa;

  color: #111;

  font-size: 14px;

  transition: all .25s ease;

  box-sizing: border-box;

}

.input-with-icon {

  padding-right: 38px;

}

.field-icon {

  position: absolute;

  right: 13px;

  top: 15px;

  color: #888;

  z-index: 2;

  font-size: 13px;

}

.input:focus,
.country-select:focus,
.phone-input:focus {

  outline: none;

  border-color: #000;

  background: #fff;

  box-shadow:
    0 0 0 3px rgba(0,0,0,0.06);

}

.input-error {

  border-color: #000 !important;

}

/* =====================================================
   الهاتف
   ===================================================== */

.phone-input-container {

  display: flex;

  gap: 8px;

  margin-bottom: 15px;

}

.country-select {

  width: 120px;

  margin-bottom: 0;

  cursor: pointer;

  font-size: 12px;

}

.phone-input {

  flex: 1;

  margin-bottom: 0;

  direction: ltr;

  text-align: left;

}

.phone-input:disabled {

  background: #eeeeee;

  cursor: not-allowed;

}

.validation-error {

  color: #222;

  font-size: 12px;

  margin-top: -8px;

  margin-bottom: 12px;

  display: block;

}

/* =====================================================
   كلمة المرور
   ===================================================== */

.input-box {

  position: relative;

  width: 100%;

}

.password-input {

  padding-left: 78px;

}

.toggle {

  position: absolute;

  left: 10px;

  top: 9px;

  height: 29px;

  padding: 0 6px;

  border: none;

  background: transparent;

  color: #555;

  cursor: pointer;

  font-size: 11px;

  font-weight: 700;

}

.toggle:hover {

  color: #000;

}

/* =====================================================
   زر تسجيل الدخول
   ===================================================== */

.btn {

  width: 100%;

  height: 49px;

  border: none;

  background: #000;

  color: #fff;

  border-radius: 11px;

  font-size: 15px;

  font-weight: 800;

  cursor: pointer;

  transition: all .25s ease;

  margin-top: 8px;

}

.btn:hover:not(:disabled) {

  background: #1b1b1b;

  transform: translateY(-1px);

  box-shadow:
    0 8px 20px rgba(0,0,0,0.18);

}

.btn:disabled {

  opacity: .6;

  cursor: not-allowed;

}

/* =====================================================
   Loader
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

  border: 2px solid #555;

  border-top-color: #fff;

  border-radius: 50%;

  display: inline-block;

  animation: spin .8s linear infinite;

}

@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}

/* =====================================================
   إنشاء حساب
   ===================================================== */

.link {

  text-align: center;

  margin-top: 20px;

  color: #888;

  font-size: 13px;

}

.link a {

  color: #000;

  text-decoration: none;

  font-weight: 800;

}

.link a:hover {

  text-decoration: underline;

}

/* =====================================================
   XRP أسفل الصفحة
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

  display: block;

  width: 25px;

  height: 1px;

  background: #ddd;

}

/* =====================================================
   الإعلان
   ===================================================== */

.ad-overlay {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background: rgba(0,0,0,0.75);

  display: flex;

  justify-content: center;

  align-items: center;

  z-index: 1000;

  padding: 20px;

}

.ad-box {

  background: #fff;

  width: 90%;

  max-width: 400px;

  border-radius: 20px;

  border: 1px solid #ddd;

  overflow: hidden;

  box-shadow:
    0 25px 70px rgba(0,0,0,0.3);

}

.ad-header {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  background: #000;

  color: #fff;

  padding: 16px;

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

  padding: 14px;

  background: #fff;

  border: none;

  border-top: 1px solid #ddd;

  color: #000;

  cursor: pointer;

  font-weight: 800;

}

.ad-btn:hover {

  background: #f3f3f3;

}

/* =====================================================
   الموبايل
   ===================================================== */

@media (max-width: 480px) {

  .container {

    padding: 15px;

  }

  .card {

    padding: 25px 20px;

    border-radius: 21px;

  }

  .logo-background {

    width: 120px;

    height: 120px;

  }

  .luxury-logo {

    width: 85px;

    height: 85px;

  }

  .xrp-name {

    font-size: 25px;

  }

  .country-select {

    width: 110px;

  }

}

</style>
