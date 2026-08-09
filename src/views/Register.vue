<template>
  <div class="register-page" dir="rtl">

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
         بطاقة إنشاء الحساب
         ========================= -->
    <main class="register-area">

      <div class="register-card">

        <!-- عنوان -->
        <div class="heading-section">

          <h1>
            إنشاء حساب
          </h1>

          <p>
            مرحباً بك، قم بإنشاء حساب جديد
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
             اختيار طريقة الإنشاء
             ========================= -->
        <div class="register-type-selector">

          <button
            type="button"
            class="type-btn"
            :class="{ active: registerType === 'email' }"
            @click="registerType = 'email'; clearErrors()"
          >
            <span>
              <i class="fas fa-envelope"></i>
              البريد الإلكتروني
            </span>
          </button>

          <button
            type="button"
            class="type-btn"
            :class="{ active: registerType === 'phone' }"
            @click="registerType = 'phone'; clearErrors()"
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
        <template v-if="registerType === 'email'">

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
                  errorMessage && registerType === 'email'
              }"
              autocomplete="email"
              @focus="clearErrors"
            />

            <i class="fas fa-envelope input-icon"></i>

          </div>

        </template>


        <!-- =========================
             رقم الهاتف
             ========================= -->
        <template v-if="registerType === 'phone'">

          <label class="field-label">
            رقم الهاتف
            <i class="fas fa-phone"></i>
          </label>

          <div class="phone-container">

            <select
              v-model="countryCode"
              class="country-select"
              @change="validatePhoneNumber"
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
                  (errorMessage || phoneError) && registerType === 'phone'
              }"
              :disabled="!countryCode"
              inputmode="numeric"
              autocomplete="tel"
              @input="validatePhoneNumber"
              @focus="clearErrors"
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
            :class="{ 'input-error': passwordError }"
            autocomplete="new-password"
            @focus="clearErrors"
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
             تأكيد كلمة المرور
             ========================= -->
        <label class="field-label">
          تأكيد كلمة المرور
          <i class="fas fa-check-circle"></i>
        </label>

        <div class="field-wrapper password-wrapper">

          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="تأكيد كلمة المرور"
            class="input-field password-field"
            :class="{ 'input-error': passwordError }"
            autocomplete="new-password"
            @focus="clearErrors"
          />

          <i class="fas fa-check-circle input-icon"></i>

          <button
            type="button"
            class="password-toggle"
            @click="toggleConfirmPassword"
          >
            <i
              :class="
                showConfirmPassword
                  ? 'fas fa-eye-slash'
                  : 'fas fa-eye'
              "
            ></i>
          </button>

        </div>

        <span
          v-if="passwordError"
          class="validation-error"
        >
          <i class="fas fa-circle-exclamation"></i>
          {{ passwordError }}
        </span>


        <!-- =========================
             كود الإحالة (اختياري)
             ========================= -->
        <label class="field-label">
          كود الإحالة
          <i class="fas fa-gift"></i>
          <span style="color: #888; font-weight: 400; font-size: 12px;">
            (اختياري)
          </span>
        </label>

        <div class="field-wrapper">

          <input
            type="text"
            v-model="inviteCode"
            placeholder="أدخل كود الإحالة"
            class="input-field"
            autocomplete="off"
          />

          <i class="fas fa-gift input-icon"></i>

        </div>


        <!-- =========================
             إنشاء الحساب
             ========================= -->
        <button
          type="button"
          class="register-button"
          @click="registerUser"
          :disabled="loading"
        >

          <span v-if="!loading">
            إنشاء حساب
            <i class="fas fa-arrow-left"></i>
          </span>

          <span
            v-else
            class="loading-content"
          >
            <span class="loader"></span>
            جارٍ إنشاء الحساب...
          </span>

        </button>


        <!-- تسجيل الدخول -->
        <div class="login-link">

          <span>
            لديك حساب؟
          </span>

          <router-link to="/login">
            تسجيل الدخول
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
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { db } from "../firebase";
import router from "../router";
import logo from "../assets/palm-gold.png";
import logoBg from "../assets/logo-bg.jpg";

import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default {
  name: "RegisterPage",

  data() {
    return {
      /* الصور */
      logo,
      logoBg,

      /* إنشاء الحساب */
      registerType: "email",

      email: "",

      countryCode: "",

      phoneNumber: "",

      fullPhoneNumber: "",

      password: "",

      confirmPassword: "",

      inviteCode: "",

      showPassword: false,

      showConfirmPassword: false,

      loading: false,

      /* الأخطاء */
      phoneError: "",

      passwordError: "",

      errorMessage: "",
    };
  },

  created() {
    const ref = this.$route.query.ref;
    if (ref) {
      this.inviteCode = String(ref).trim();
    }
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    clearErrors() {
      this.errorMessage = "";
      this.phoneError = "";
      this.passwordError = "";
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    validatePassword(password) {
      return password.length >= 6;
    },

    validatePhoneNumber() {
      if (!this.phoneNumber && !this.countryCode) {
        this.phoneError = "";
        return true;
      }

      if (!this.countryCode || this.countryCode.trim() === "") {
        this.phoneError = "الرجاء اختيار رمز الدولة";
        return false;
      }

      if (!this.phoneNumber || this.phoneNumber.trim() === "") {
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

    async checkPhoneExists(fullPhone) {
      try {
        const q = query(
          collection(db, "users"),
          where("phoneNumber", "==", fullPhone)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
      } catch (error) {
        console.error("Error checking phone:", error);
        return false;
      }
    },

    async registerUser() {
      this.clearErrors();

      let registerEmail = this.email.trim();

      /* إنشاء حساب بالهاتف */
      if (this.registerType === "phone") {
        if (!this.validatePhoneNumber()) {
          this.errorMessage = this.phoneError || "رقم الهاتف غير صحيح";
          return;
        }
        registerEmail = this.generatePhoneEmail(this.fullPhoneNumber);
      }

      /* إنشاء حساب بالبريد */
      else {
        if (!this.validateEmail(registerEmail)) {
          this.errorMessage = "الرجاء إدخال بريد إلكتروني صحيح";
          return;
        }
      }

      /* التحقق من كلمة المرور */
      if (!this.validatePassword(this.password)) {
        this.passwordError = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.passwordError = "كلمات المرور غير متطابقة";
        return;
      }

      this.loading = true;
      const auth = getAuth();

      try {
        /* التحقق من وجود رقم الهاتف مسبقاً */
        if (this.registerType === "phone") {
          const exists = await this.checkPhoneExists(this.fullPhoneNumber);
          if (exists) {
            this.errorMessage = "رقم الهاتف مسجل مسبقاً";
            this.loading = false;
            return;
          }
        }

        /* إنشاء الحساب في Firebase Auth */
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          this.password
        );

        const user = userCredential.user;

        /* معالجة كود الإحالة */
        let invitedBy = "";
        let level2 = "";
        let level3 = "";

        if (this.inviteCode) {
          const q = query(
            collection(db, "users"),
            where("referralCode", "==", this.inviteCode)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const inviterDoc = querySnapshot.docs[0];
            invitedBy = inviterDoc.id;
            const inviterData = inviterDoc.data();
            level2 = inviterData.invitedBy || "";
            level3 = inviterData.level2 || "";
          }
        }

        /* إنشاء كود إحالة جديد */
        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        /* حفظ بيانات المستخدم في Firestore */
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: this.registerType === "email" ? this.email : "",
          phoneNumber: this.registerType === "phone" ? this.fullPhoneNumber : "",
          phoneNumberOnly: this.registerType === "phone" ? this.phoneNumber : "",
          balance: 0,
          vipLevel: 0,
          referralCode: referralCode,
          invitedBy: invitedBy,
          level2: level2,
          level3: level3,
          createdAt: serverTimestamp(),
        });

        /* توجيه المستخدم إلى الصفحة الرئيسية */
        router.push("/home");
      }

      catch (error) {
        console.error("Registration error:", error);

        if (error.code === "auth/email-already-in-use") {
          if (this.registerType === "email") {
            this.errorMessage = "البريد الإلكتروني مسجل مسبقاً";
          } else {
            this.errorMessage = "رقم الهاتف مسجل مسبقاً";
          }
        } else if (error.code === "auth/invalid-email") {
          this.errorMessage = "البريد الإلكتروني غير صحيح";
        } else if (error.code === "auth/weak-password") {
          this.passwordError = "كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل";
        } else if (error.code === "auth/network-request-failed") {
          this.errorMessage = "حدث خطأ في الاتصال. يرجى التحقق من الإنترنت.";
        } else {
          this.errorMessage = "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً";
        }
      }

      finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>

/* =====================================================
   الصفحة
   ===================================================== */

.register-page {

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
   منطقة إنشاء الحساب
   ===================================================== */

.register-area {

  position: relative;

  z-index: 10;

  max-width: 850px;

  margin: -55px auto 0;

  padding: 0 25px 40px;

}


/* =====================================================
   بطاقة إنشاء الحساب
   ===================================================== */

.register-card {

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
   اختيار طريقة الإنشاء
   ===================================================== */

.register-type-selector {

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
   زر إنشاء الحساب
   ===================================================== */

.register-button {

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


.register-button span {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 12px;

}


.register-button:hover:not(:disabled) {

  transform: translateY(-2px);

  box-shadow:
    0 15px 35px rgba(0,0,0,0.25);

}


.register-button:active:not(:disabled) {

  transform: translateY(0);

}


.register-button:disabled {

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
   تسجيل الدخول
   ===================================================== */

.login-link {

  text-align: center;

  margin-top: 24px;

  font-size: 14px;

  color: #999;

}


.login-link a {

  color: #111;

  font-weight: 900;

  text-decoration: none;

  margin-right: 5px;

}


.login-link a:hover {

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


  .register-area {

    margin-top: -45px;

    padding:
      0 14px 30px;

  }


  .register-card {

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


  .register-type-selector {

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


  .register-button {

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


  .register-area {

    margin-top: -38px;

  }


  .register-card {

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
