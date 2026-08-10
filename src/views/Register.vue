<template>
  <div class="register-page" :dir="currentDirection">

    <!-- =========================
         القسم العلوي / الخلفية
         ========================= -->
    <section
      class="hero-section"
      :style="{ backgroundImage: `url(${logoBg})` }"
    >
      <div class="hero-overlay"></div>

      <!-- اللغة -->
      <div class="language-dropdown">
        <button class="language-btn" type="button" @click="toggleDropdown">
          <i class="fas fa-globe"></i>
          {{ currentLanguageName }}
          <i class="fas fa-chevron-down" :class="{ 'rotated': isDropdownOpen }"></i>
        </button>
        
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <button 
            v-for="lang in languages" 
            :key="lang.code"
            class="dropdown-item"
            :class="{ 'active': currentLanguage === lang.code }"
            @click="setLanguage(lang.code)"
          >
            <span class="lang-flag">{{ lang.flag }}</span>
            {{ lang.name }}
          </button>
        </div>
      </div>

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
          {{ translations[currentLanguage].futureTitle }}
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
            {{ translations[currentLanguage].title }}
          </h1>

          <p>
            {{ translations[currentLanguage].subtitle }}
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
              {{ translations[currentLanguage].email }}
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
              {{ translations[currentLanguage].phone }}
            </span>
          </button>

        </div>


        <!-- =========================
             البريد الإلكتروني
             ========================= -->
        <template v-if="registerType === 'email'">

          <label class="field-label">
            {{ translations[currentLanguage].emailLabel }}
            <i class="fas fa-envelope"></i>
          </label>

          <div class="field-wrapper">

            <input
              type="email"
              v-model="email"
              :placeholder="translations[currentLanguage].emailPlaceholder"
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
            {{ translations[currentLanguage].phoneLabel }}
            <i class="fas fa-phone"></i>
          </label>

          <div class="phone-container">

            <select
              v-model="countryCode"
              class="country-select"
              @change="validatePhoneNumber"
            >

              <option value="">
                {{ translations[currentLanguage].code }}
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
              :placeholder="translations[currentLanguage].phonePlaceholder"
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
          {{ translations[currentLanguage].passwordLabel }}
          <i class="fas fa-lock"></i>
        </label>

        <div class="field-wrapper password-wrapper">

          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            :placeholder="translations[currentLanguage].passwordPlaceholder"
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
          {{ translations[currentLanguage].confirmPasswordLabel }}
          <i class="fas fa-check-circle"></i>
        </label>

        <div class="field-wrapper password-wrapper">

          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            :placeholder="translations[currentLanguage].confirmPasswordPlaceholder"
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
          {{ translations[currentLanguage].inviteLabel }}
          <i class="fas fa-gift"></i>
          <span style="color: #888; font-weight: 400; font-size: 12px;">
            ({{ translations[currentLanguage].optional }})
          </span>
        </label>

        <div class="field-wrapper">

          <input
            type="text"
            v-model="inviteCode"
            :placeholder="translations[currentLanguage].invitePlaceholder"
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
            {{ translations[currentLanguage].registerButton }}
            <i class="fas fa-arrow-left"></i>
          </span>

          <span
            v-else
            class="loading-content"
          >
            <span class="loader"></span>
            {{ translations[currentLanguage].loading }}
          </span>

        </button>


        <!-- تسجيل الدخول -->
        <div class="login-link">

          <span>
            {{ translations[currentLanguage].haveAccount }}
          </span>

          <router-link to="/login">
            {{ translations[currentLanguage].loginLink }}
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

      /* اللغة */
      currentLanguage: 'ar',
      isDropdownOpen: false,
      languages: [
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' }
      ],

      translations: {
        ar: {
          futureTitle: 'مستقبل التمويل',
          title: 'إنشاء حساب',
          subtitle: 'مرحباً بك، قم بإنشاء حساب جديد',
          email: 'البريد الإلكتروني',
          phone: 'رقم الهاتف',
          emailLabel: 'البريد الإلكتروني',
          emailPlaceholder: 'أدخل البريد الإلكتروني',
          phoneLabel: 'رقم الهاتف',
          phonePlaceholder: 'رقم الهاتف',
          code: 'الرمز',
          passwordLabel: 'كلمة المرور',
          passwordPlaceholder: 'أدخل كلمة المرور',
          confirmPasswordLabel: 'تأكيد كلمة المرور',
          confirmPasswordPlaceholder: 'تأكيد كلمة المرور',
          inviteLabel: 'كود الإحالة',
          invitePlaceholder: 'أدخل كود الإحالة',
          optional: 'اختياري',
          registerButton: 'إنشاء حساب',
          loading: 'جارٍ إنشاء الحساب...',
          haveAccount: 'لديك حساب؟',
          loginLink: 'تسجيل الدخول'
        },
        en: {
          futureTitle: 'THE FUTURE OF FINANCE',
          title: 'Create Account',
          subtitle: 'Welcome, create a new account',
          email: 'Email',
          phone: 'Phone',
          emailLabel: 'Email',
          emailPlaceholder: 'Enter email',
          phoneLabel: 'Phone Number',
          phonePlaceholder: 'Phone Number',
          code: 'Code',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter password',
          confirmPasswordLabel: 'Confirm Password',
          confirmPasswordPlaceholder: 'Confirm password',
          inviteLabel: 'Referral Code',
          invitePlaceholder: 'Enter referral code',
          optional: 'Optional',
          registerButton: 'Create Account',
          loading: 'Creating account...',
          haveAccount: 'Have an account?',
          loginLink: 'Login'
        },
        ru: {
          futureTitle: 'БУДУЩЕЕ ФИНАНСОВ',
          title: 'Создать аккаунт',
          subtitle: 'Добро пожаловать, создайте новый аккаунт',
          email: 'Электронная почта',
          phone: 'Телефон',
          emailLabel: 'Электронная почта',
          emailPlaceholder: 'Введите электронную почту',
          phoneLabel: 'Номер телефона',
          phonePlaceholder: 'Номер телефона',
          code: 'Код',
          passwordLabel: 'Пароль',
          passwordPlaceholder: 'Введите пароль',
          confirmPasswordLabel: 'Подтвердите пароль',
          confirmPasswordPlaceholder: 'Подтвердите пароль',
          inviteLabel: 'Реферальный код',
          invitePlaceholder: 'Введите реферальный код',
          optional: 'Необязательно',
          registerButton: 'Создать аккаунт',
          loading: 'Создание аккаунта...',
          haveAccount: 'Уже есть аккаунт?',
          loginLink: 'Войти'
        }
      },

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

  computed: {
    currentLanguageName() {
      const lang = this.languages.find(l => l.code === this.currentLanguage);
      return lang ? lang.name : 'العربية';
    },
    currentDirection() {
      return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  },

  created() {
    const ref = this.$route.query.ref;
    if (ref) {
      this.inviteCode = String(ref).trim();
    }

    // استرجاع اللغة المحفوظة
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && this.languages.some(l => l.code === savedLang)) {
      this.currentLanguage = savedLang;
    }
  },

  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    setLanguage(langCode) {
      this.currentLanguage = langCode;
      this.isDropdownOpen = false;
      localStorage.setItem('preferredLanguage', langCode);
      
      // تغيير اتجاه الصفحة
      document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
    },

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
        this.phoneError = this.currentLanguage === 'ar' 
          ? "الرجاء اختيار رمز الدولة"
          : this.currentLanguage === 'en'
          ? "Please select country code"
          : "Пожалуйста, выберите код страны";
        return false;
      }

      if (!this.phoneNumber || this.phoneNumber.trim() === "") {
        this.phoneError = this.currentLanguage === 'ar'
          ? "الرجاء إدخال رقم الهاتف"
          : this.currentLanguage === 'en'
          ? "Please enter phone number"
          : "Пожалуйста, введите номер телефона";
        return false;
      }

      const cleanPhone = this.phoneNumber.replace(/[^0-9]/g, "");

      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        this.phoneError = this.currentLanguage === 'ar'
          ? "رقم الهاتف يجب أن يكون بين 7 و 15 رقم"
          : this.currentLanguage === 'en'
          ? "Phone number must be between 7 and 15 digits"
          : "Номер телефона должен содержать от 7 до 15 цифр";
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
          this.errorMessage = this.phoneError || (this.currentLanguage === 'ar'
            ? "رقم الهاتف غير صحيح"
            : this.currentLanguage === 'en'
            ? "Invalid phone number"
            : "Неверный номер телефона");
          return;
        }
        registerEmail = this.generatePhoneEmail(this.fullPhoneNumber);
      }

      /* إنشاء حساب بالبريد */
      else {
        if (!this.validateEmail(registerEmail)) {
          this.errorMessage = this.currentLanguage === 'ar'
            ? "الرجاء إدخال بريد إلكتروني صحيح"
            : this.currentLanguage === 'en'
            ? "Please enter a valid email"
            : "Пожалуйста, введите действительный адрес электронной почты";
          return;
        }
      }

      /* التحقق من كلمة المرور */
      if (!this.validatePassword(this.password)) {
        this.passwordError = this.currentLanguage === 'ar'
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
          : this.currentLanguage === 'en'
          ? "Password must be at least 6 characters"
          : "Пароль должен содержать не менее 6 символов";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.passwordError = this.currentLanguage === 'ar'
          ? "كلمات المرور غير متطابقة"
          : this.currentLanguage === 'en'
          ? "Passwords do not match"
          : "Пароли не совпадают";
        return;
      }

      this.loading = true;
      const auth = getAuth();

      try {
        /* التحقق من وجود رقم الهاتف مسبقاً */
        if (this.registerType === "phone") {
          const exists = await this.checkPhoneExists(this.fullPhoneNumber);
          if (exists) {
            this.errorMessage = this.currentLanguage === 'ar'
              ? "رقم الهاتف مسجل مسبقاً"
              : this.currentLanguage === 'en'
              ? "Phone number already registered"
              : "Номер телефона уже зарегистрирован";
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
          this.errorMessage = this.currentLanguage === 'ar'
            ? this.registerType === 'email' ? "البريد الإلكتروني مسجل مسبقاً" : "رقم الهاتف مسجل مسبقاً"
            : this.currentLanguage === 'en'
            ? this.registerType === 'email' ? "Email already registered" : "Phone number already registered"
            : this.registerType === 'email' ? "Электронная почта уже зарегистрирована" : "Номер телефона уже зарегистрирован";
        } else if (error.code === "auth/invalid-email") {
          this.errorMessage = this.currentLanguage === 'ar'
            ? "البريد الإلكتروني غير صحيح"
            : this.currentLanguage === 'en'
            ? "Invalid email"
            : "Неверный адрес электронной почты";
        } else if (error.code === "auth/weak-password") {
          this.passwordError = this.currentLanguage === 'ar'
            ? "كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل"
            : this.currentLanguage === 'en'
            ? "Weak password, must be at least 6 characters"
            : "Слабый пароль, должен содержать не менее 6 символов";
        } else if (error.code === "auth/network-request-failed") {
          this.errorMessage = this.currentLanguage === 'ar'
            ? "حدث خطأ في الاتصال. يرجى التحقق من الإنترنت."
            : this.currentLanguage === 'en'
            ? "Network error. Please check your internet connection."
            : "Ошибка сети. Пожалуйста, проверьте подключение к интернету.";
        } else {
          this.errorMessage = this.currentLanguage === 'ar'
            ? "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً"
            : this.currentLanguage === 'en'
            ? "An error occurred while creating the account, please try again later"
            : "Произошла ошибка при создании аккаунта, пожалуйста, попробуйте позже";
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
   زر اللغة - القائمة المنسدلة
   ===================================================== */

.language-dropdown {
  position: absolute;
  top: 22px;
  right: 22px;
  z-index: 5;
}

.language-btn {

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

.language-btn .fa-chevron-down {
  transition: transform 0.3s ease;
  font-size: 12px;
}

.language-btn .fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 55px;
  right: 0;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 8px;
  min-width: 180px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 15px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.dropdown-item.active {
  background: rgba(212, 175, 55, 0.2);
  color: #D4AF37;
}

.lang-flag {
  font-size: 18px;
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
   الهاتف - الإصلاح
   ===================================================== */

.phone-container {

  display: flex;

  gap: 10px;

  margin-bottom: 20px;

  width: 100%;

  box-sizing: border-box;

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


  .language-dropdown {
    top: 18px;
    right: 15px;
  }

  .language-btn {

    height: 45px;

    padding: 0 17px;
    font-size: 13px;
  }

  .dropdown-menu {
    min-width: 150px;
    right: 0;
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

}

</style>
