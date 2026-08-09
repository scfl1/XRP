<template>
  <div class="container">
    <div class="card">

      <!-- الشعار -->
      <div class="brand-header">
        <div class="logo-wrapper">
          <img
            :src="logo"
            class="luxury-logo"
            alt="XRP Logo"
          />
        </div>

        <!-- اسم XRP أسفل الشعار -->
        <div class="xrp-name">XRP</div>
        <div class="brand-line"></div>
      </div>

      <h2 class="title">تسجيل الدخول</h2>
      <p class="subtitle">مرحبًا بك، قم بتسجيل الدخول إلى حسابك</p>

      <!-- رسالة الخطأ -->
      <div v-if="errorMessage" class="error-message-box">
        <i class="fas fa-circle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- اختيار نوع الدخول -->
      <div class="login-type-selector">
        <button
          class="type-btn"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'; clearError()"
          type="button"
        >
          <i class="fas fa-envelope"></i>
          <span>البريد الإلكتروني</span>
        </button>

        <button
          class="type-btn"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'; clearError()"
          type="button"
        >
          <i class="fas fa-phone"></i>
          <span>رقم الهاتف</span>
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
            placeholder="أدخل البريد الإلكتروني"
            class="input input-with-icon"
            :class="{ 'input-error': errorMessage && loginType === 'email' }"
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
            :class="{ 'input-error': errorMessage && loginType === 'phone' }"
            :disabled="!countryCode"
            inputmode="numeric"
            autocomplete="tel"
            @input="validatePhoneNumber"
            @keyup.enter="loginUser"
            @focus="clearError"
          />
        </div>

        <span v-if="phoneError" class="validation-error">
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
          :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
        >
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          <span>{{ showPassword ? "إخفاء" : "إظهار" }}</span>
        </button>
      </div>

      <!-- زر تسجيل الدخول -->
      <button
        class="btn"
        @click="loginUser"
        :disabled="loading"
        type="button"
      >
        <span v-if="!loading">
          <i class="fas fa-right-to-bracket"></i>
          تسجيل الدخول
        </span>

        <span v-else class="loading-content">
          <span class="loader"></span>
          جارٍ تسجيل الدخول...
        </span>
      </button>

      <!-- رابط إنشاء الحساب -->
      <p class="link">
        ليس لديك حساب؟
        <router-link to="/register">
          إنشاء حساب جديد
        </router-link>
      </p>

      <!-- خط سفلي -->
      <div class="bottom-brand">
        <span class="bottom-dot"></span>
        <span>XRP</span>
        <span class="bottom-dot"></span>
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
        <div class="ad-icon">
          <i class="fas fa-bullhorn"></i>
        </div>
        <h2>إعلان</h2>
      </div>

      <div class="ad-content">
        <p>
          🎉 مرحبا بالجميع!
          تأسست Palm Treasure في سنغافورة في 20 أغسطس 2021
          ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة.
          نحن شركة استثمار في التجارة الإلكترونية مع فريق تقني قوي
          وقوة مالية قوية.

          <br><br>

          يتعاون Palm Treasure مع عشرات شركات التجارة الإلكترونية
          مثل Amazon و eBay و Tiktok و Aliexpress و Alibaba و Shopee،
          لمساعدة التجار على زيادة مبيعات المنتجات الخاصة بهم،
          ويمكننا أيضًا تحقيق أرباح منه.

          <br><br>

          👍 1: الحد الأدنى لمبلغ إعادة الشحن: 12 USDT،
          الحد الأدنى للسحب النقدي: 3 USDT

          <br>

          💰 2: تستثمر المنصة على مستوى العالم،
          لذا فإن الاستثمار يدعم فقط إعادة شحن العملة المشفرة.

          <br>

          🌈 3: وقت إعادة تعيين المهمة هو الساعة 12 ظهراً
          في سنغافورة. يمكنك الحصول على الربح من خلال استكمال
          أوامر التاجر كل يوم.

          <br>

          🕯 4: يمكنك سحب النقد مرة واحدة فقط في اليوم،
          ولا يوجد حد زمني للسحب، والحد الأدنى لمبلغ السحب
          هو 3 USDT.
        </p>
      </div>

      <button
        @click="closeAd"
        class="ad-btn"
        type="button"
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

export default {
  data() {
    return {
      logo,

      loginType: "email",

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
      errorMessage: ""
    };
  },

  mounted() {
    document.addEventListener("keydown", this.handleEscKey);
  },

  beforeUnmount() {
    document.removeEventListener("keydown", this.handleEscKey);

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

      const cleanPhone = this.phoneNumber.replace(/[^0-9]/g, "");

      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        this.phoneError = "رقم الهاتف يجب أن يكون بين 7 و 15 رقم";
        return false;
      }

      this.fullPhoneNumber = this.countryCode + cleanPhone;
      this.phoneError = "";

      return true;
    },

    generatePhoneEmail(phoneNumber) {
      const cleanPhone = phoneNumber.replace(/\+/g, "");
      return `${cleanPhone}@phone.app`;
    },

    getErrorMessage(error) {
      if (error.code === "auth/user-disabled") {
        return "تم حظر حسابك، تواصل مع الدعم";
      }

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-email"
      ) {
        if (this.loginType === "phone") {
          return "رقم الهاتف أو كلمة المرور غير صحيحة.";
        }

        return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      }

      if (error.code === "auth/too-many-requests") {
        return "تم تعليق الحساب مؤقتاً لكثرة المحاولات. يرجى المحاولة لاحقاً.";
      }

      if (error.code === "auth/network-request-failed") {
        return "حدث خطأ في الاتصال. يرجى التحقق من الإنترنت.";
      }

      if (error.code === "auth/operation-not-allowed") {
        return "طريقة تسجيل الدخول هذه غير مفعلة حالياً.";
      }

      return "حدث خطأ. يرجى المحاولة لاحقاً.";
    },

    handleEscKey(event) {
      if (event.key === "Escape" && this.showAd) {
        this.closeAd();
      }
    },

    async loginUser() {
      this.errorMessage = "";
      this.phoneError = "";

      let loginEmail = this.email.trim();

      /*
       * تسجيل الدخول برقم الهاتف
       */
      if (this.loginType === "phone") {
        if (!this.validatePhoneNumber()) {
          return;
        }

        loginEmail = this.generatePhoneEmail(
          this.fullPhoneNumber
        );
      }

      /*
       * التحقق من البريد الإلكتروني
       */
      else {
        if (!this.validateEmail(loginEmail)) {
          this.errorMessage =
            "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
          return;
        }
      }

      /*
       * التحقق من كلمة المرور
       */
      if (!this.password || this.password.length < 6) {
        if (this.loginType === "phone") {
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
        /*
         * تسجيل الدخول عبر Firebase
         */
        const userCredential =
          await signInWithEmailAndPassword(
            auth,
            loginEmail,
            this.password
          );

        const user = userCredential.user;

        /*
         * التأكد من حالة الحساب
         */
        await user.reload();

        const updatedUser = auth.currentUser;

        if (updatedUser && updatedUser.disabled === true) {
          await signOut(auth);

          this.errorMessage =
            "تم حظر حسابك، تواصل مع الدعم.";

          return;
        }

        /*
         * حسابات الإدارة
         */
        const admins = [
          "azad.333388@gmail.com",
          "admin2@gmail.com",
          "owner@gmail.com"
        ];

        if (admins.includes(user.email)) {
          await router.push("/admin");
        } else {
          await router.push("/home");
        }

      } catch (error) {
        console.error("Login Error:", error);

        this.errorMessage =
          this.getErrorMessage(error);

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

/* =========================================================
   التصميم العام - أبيض وأسود
   ========================================================= */

* {
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px;

  background:
    radial-gradient(
      circle at top right,
      rgba(0, 0, 0, 0.05),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #ffffff 0%,
      #f5f5f5 50%,
      #eeeeee 100%
    );

  direction: rtl;
}

/* =========================================================
   البطاقة
   ========================================================= */

.card {
  position: relative;

  width: 100%;
  max-width: 410px;

  padding: 36px 32px 28px;

  background: rgba(255, 255, 255, 0.97);

  border: 1px solid #e4e4e4;
  border-radius: 26px;

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.10),
    0 8px 25px rgba(0, 0, 0, 0.05);

  overflow: hidden;
}

/* خط أسود أعلى البطاقة */

.card::before {
  content: "";

  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 4px;

  background: #000000;
}

/* =========================================================
   الشعار
   ========================================================= */

.brand-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 8px;
}

.luxury-logo {
  width: 105px;
  height: 105px;

  object-fit: contain;

  filter: grayscale(100%);
}

/* اسم XRP */

.xrp-name {
  color: #000000;

  font-size: 28px;
  line-height: 1;

  font-weight: 900;

  letter-spacing: 5px;

  margin-top: 2px;
}

.brand-line {
  width: 45px;
  height: 3px;

  background: #000000;

  margin: 12px auto 0;

  border-radius: 10px;
}

/* =========================================================
   العنوان
   ========================================================= */

.title {
  color: #111111;

  text-align: center;

  font-size: 24px;

  margin: 0 0 7px;

  font-weight: 800;
}

.subtitle {
  color: #888888;

  text-align: center;

  font-size: 13px;

  margin: 0 0 24px;
}

/* =========================================================
   رسالة الخطأ
   ========================================================= */

.error-message-box {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  background: #f7f7f7;

  border: 1px solid #dddddd;

  border-right: 3px solid #000000;

  border-radius: 12px;

  padding: 12px 14px;

  margin-bottom: 18px;

  color: #222222;

  font-size: 13px;

  text-align: center;

  font-weight: 600;
}

.error-message-box i {
  color: #000000;
}

/* =========================================================
   اختيار طريقة الدخول
   ========================================================= */

.login-type-selector {
  display: flex;

  gap: 5px;

  margin-bottom: 22px;

  padding: 5px;

  background: #f1f1f1;

  border: 1px solid #e5e5e5;

  border-radius: 13px;
}

.type-btn {
  flex: 1;

  min-height: 43px;

  padding: 9px 7px;

  border: none;

  background: transparent;

  color: #777777;

  cursor: pointer;

  border-radius: 9px;

  font-size: 12px;

  font-weight: 700;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.2s ease;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;
}

.type-btn:hover {
  color: #000000;
}

.type-btn.active {
  background: #000000;
  color: #ffffff;

  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.15);
}

.type-btn:active {
  transform: scale(0.98);
}

/* =========================================================
   العناوين
   ========================================================= */

.label {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #222222;

  margin-bottom: 8px;

  font-size: 13px;

  font-weight: 700;
}

.label i {
  font-size: 12px;
  color: #000000;
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

  border-radius: 12px;

  border: 1px solid #dddddd;

  background: #fafafa;

  color: #111111;

  font-size: 14px;

  font-weight: 500;

  transition:
    border 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  box-sizing: border-box;
}

.input::placeholder,
.phone-input::placeholder {
  color: #aaaaaa;
}

.input-with-icon {
  padding-right: 42px;
}

.input:focus,
.country-select:focus,
.phone-input:focus {
  outline: none;

  border-color: #000000;

  background: #ffffff;

  box-shadow:
    0 0 0 3px rgba(0, 0, 0, 0.06);
}

.input-error {
  border-color: #000000 !important;

  box-shadow:
    0 0 0 2px rgba(0, 0, 0, 0.08);
}

.field-icon {
  position: absolute;

  right: 14px;
  top: 15px;

  color: #777777;

  font-size: 14px;

  z-index: 2;
}

/* =========================================================
   الهاتف
   ========================================================= */

.phone-input-container {
  display: flex;

  gap: 8px;

  margin-bottom: 14px;

  direction: ltr;
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
  background: #eeeeee;

  color: #999999;

  cursor: not-allowed;
}

.validation-error {
  display: block;

  color: #222222;

  font-size: 11px;

  margin-top: -6px;

  margin-bottom: 14px;

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
  padding-left: 78px;
}

.toggle {
  position: absolute;

  left: 10px;
  top: 9px;

  height: 30px;

  padding: 0 8px;

  border: none;

  background: transparent;

  color: #555555;

  cursor: pointer;

  font-size: 11px;

  font-weight: 700;

  display: flex;

  align-items: center;

  gap: 5px;

  z-index: 3;
}

.toggle:hover {
  color: #000000;
}

/* =========================================================
   زر تسجيل الدخول
   ========================================================= */

.btn {
  width: 100%;

  height: 50px;

  padding: 0 15px;

  border: none;

  background: #000000;

  color: #ffffff;

  border-radius: 12px;

  font-size: 15px;

  font-weight: 800;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;

  margin-top: 5px;
}

.btn:hover:not(:disabled) {
  background: #1a1a1a;

  transform: translateY(-2px);

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.18);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.65;

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

  border: 2px solid rgba(255, 255, 255, 0.3);

  border-top-color: #ffffff;

  border-radius: 50%;

  display: inline-block;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   إنشاء الحساب
   ========================================================= */

.link {
  text-align: center;

  margin: 20px 0 0;

  color: #888888;

  font-size: 13px;
}

.link a {
  color: #000000;

  text-decoration: none;

  font-weight: 800;

  margin-right: 4px;

  transition: opacity 0.2s ease;
}

.link a:hover {
  opacity: 0.55;
}

/* =========================================================
   العلامة السفلية
   ========================================================= */

.bottom-brand {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 24px;

  color: #aaaaaa;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 3px;
}

.bottom-dot {
  width: 4px;
  height: 4px;

  background: #000000;

  border-radius: 50%;
}

/* =========================================================
   الإعلان
   ========================================================= */

.ad-overlay {
  position: fixed;

  inset: 0;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.72);

  backdrop-filter: blur(6px);

  display: flex;

  justify-content: center;
  align-items: center;

  padding: 20px;

  z-index: 1000;
}

.ad-box {
  background: #ffffff;

  width: 100%;
  max-width: 420px;

  border-radius: 22px;

  border: 1px solid #dddddd;

  overflow: hidden;

  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.3);
}

.ad-header {
  display: flex;

  align-items: center;

  gap: 12px;

  padding: 18px 20px;

  background: #000000;

  color: #ffffff;
}

.ad-icon {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #ffffff;

  color: #000000;

  border-radius: 50%;
}

.ad-header h2 {
  margin: 0;

  font-size: 18px;

  font-weight: 800;
}

.ad-content {
  padding: 20px;

  color: #333333;

  font-size: 13px;

  line-height: 1.8;

  max-height: 330px;

  overflow-y: auto;

  direction: rtl;
}

.ad-content p {
  margin: 0;
}

.ad-btn {
  width: 100%;

  height: 50px;

  background: #ffffff;

  border: none;

  border-top: 1px solid #eeeeee;

  color: #000000;

  cursor: pointer;

  font-weight: 800;

  font-size: 14px;

  transition: background 0.2s ease;
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
    padding: 30px 20px 24px;

    border-radius: 22px;
  }

  .luxury-logo {
    width: 92px;
    height: 92px;
  }

  .xrp-name {
    font-size: 25px;
  }

  .title {
    font-size: 22px;
  }

  .phone-input-container {
    gap: 6px;
  }

  .country-select {
    width: 112px;

    font-size: 11px;
  }

  .type-btn {
    font-size: 11px;
  }

  .type-btn i {
    font-size: 11px;
  }
}

/* =========================================================
   شاشات صغيرة جدًا
   ========================================================= */

@media (max-width: 350px) {
  .card {
    padding: 26px 15px 22px;
  }

  .country-select {
    width: 100px;
  }

  .type-btn span {
    font-size: 10px;
  }

  .password-input {
    padding-left: 70px;
  }
}

</style>
