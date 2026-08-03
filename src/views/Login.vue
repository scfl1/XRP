<template>
  <div class="login-page">
    <!-- الشريط العلوي -->
    <div class="top-bar">
      <button class="icon-btn" @click="$router.back()">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="lang-switch">
        عربي <i class="fas fa-play"></i>
      </span>
    </div>

    <!-- منطقة الشعار -->
    <div class="hero">
      <div class="hero-glow"></div>
      <div class="cube-deco">
        <!-- SVG Representation of the 3D Cubes to match the image exactly -->
        <svg viewBox="0 0 200 200" class="cube-svg">
            <g transform="translate(100,100) scale(1.2)">
                <path d="M0 -50 L43 -25 L0 0 L-43 -25 Z" fill="#00e5e5" stroke="#004d4d" stroke-width="0.5"/>
                <path d="M-43 -25 L0 0 L0 50 L-43 25 Z" fill="#00b2b2" stroke="#004d4d" stroke-width="0.5"/>
                <path d="M43 -25 L43 25 L0 50 L0 0 Z" fill="#008080" stroke="#004d4d" stroke-width="0.5"/>
                <g transform="translate(-35, -20) scale(0.6)">
                    <path d="M0 -50 L43 -25 L0 0 L-43 -25 Z" fill="#00ffff" stroke="#004d4d" stroke-width="0.5"/>
                    <path d="M-43 -25 L0 0 L0 50 L-43 25 Z" fill="#00cccc" stroke="#004d4d" stroke-width="0.5"/>
                </g>
                <g transform="translate(35, -20) scale(0.6)">
                    <path d="M0 -50 L43 -25 L0 0 L-43 -25 Z" fill="#00ffff" stroke="#004d4d" stroke-width="0.5"/>
                    <path d="M43 -25 L43 25 L0 50 L0 0 Z" fill="#009999" stroke="#004d4d" stroke-width="0.5"/>
                </g>
            </g>
        </svg>
      </div>
      <div class="logo-frame">
        <div class="scfl-logo-circle">
            <div class="logo-inner-content">
                <div class="logo-row"><span>S</span> <span>E</span></div>
                <div class="logo-line"></div>
                <div class="logo-row"><span>F</span> <span>L</span></div>
                <div class="logo-tag">SCFL</div>
            </div>
        </div>
      </div>
      <h1 class="brand-name">SCFL</h1>
    </div>

    <!-- بطاقة تسجيل الدخول -->
    <div class="card">
      <div class="support-bubble" title="الدعم الفني">
        <svg viewBox="0 0 100 100" width="50" height="50">
            <circle cx="50" cy="50" r="50" fill="#ffffff" />
            <path d="M25 50 L75 25 L65 75 L50 60 L40 70 Z" fill="#0088cc" />
            <circle cx="75" cy="50" r="15" fill="#0088cc" />
        </svg>
      </div>

      <!-- اختيار نوع الدخول -->
      <div class="login-type-selector">
        <button
          class="type-btn"
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'"
        >
          تسجيل الدخول بالبريد الإلكتروني
        </button>
        <button
          class="type-btn"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          تسجيل الدخول عبر الهاتف
        </button>
      </div>

      <!-- رسالة الخطأ العامة -->
      <div v-if="errorMessage" class="error-message-box">
        {{ errorMessage }}
      </div>

      <!-- تسجيل الدخول بالبريد الإلكتروني -->
      <template v-if="loginType === 'email'">
        <div class="input-box">
          <i class="fas fa-envelope field-icon"></i>
          <input
            type="email"
            v-model="email"
            placeholder="بريد إلكترونى"
            class="input"
            :class="{ 'input-error': errorMessage && loginType === 'email' }"
            @keyup.enter="loginUser"
            @focus="clearError"
          />
        </div>
      </template>
      <!-- تسجيل الدخول برقم الهاتف -->
      <template v-if="loginType === 'phone'">
        <div class="phone-input-container">
          <select v-model="countryCode" class="country-select">
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
            :class="{ 'input-error': errorMessage && loginType === 'phone' }"
            :disabled="!countryCode"
            @input="validatePhoneNumber"
            @keyup.enter="loginUser"
            @focus="clearError"
          />
        </div>
        <span v-if="phoneError" class="validation-error">{{ phoneError }}</span>
      </template>
      <!-- كلمة المرور -->
      <div class="input-box">
        <i class="fas fa-lock field-icon"></i>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="كلمة سر الدخول"
          class="input"
          :class="{ 'input-error': errorMessage }"
          @keyup.enter="loginUser"
          @focus="clearError"
        />
        <span class="toggle" @click="togglePassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>

      <!-- زر تسجيل الدخول مع Loader -->
      <button class="btn" @click="loginUser" :disabled="loading">
        <span v-if="!loading">تسجيل الدخول</span>
        <span v-else class="loader"></span>
      </button>

      <p class="link">
        لا حساب؟<router-link to="/register">يسجل</router-link>
      </p>
    </div>
  </div>
  <!-- Popup إعلان -->
  <div id="companyAd" class="ad-overlay" v-if="showAd">
    <div class="ad-box">
      <h2>✨ إعلان ✨</h2>
      <div class="ad-content">
        <p>🎉🎉🎉🎉 مرحبا بالجميع! تأسست SCFL في سنغافورة في 20 أغسطس 2021 ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة. نحن شركة استثمار في التجارة الإلكترونية مع فريق تقني قوي وقوة مالية قوية.
          <br><br>
          يتعاون SCFL مع عشرات شركات التجارة الإلكترونية مثل Amazon و eBay و Tiktok و Aliexpress و Alibaba و Shopee ، إلخ. لمساعدة التجار على زيادة مبيعات المنتجات الخاصة بهم ، ويمكننا أيضًا تحقيق أرباح منه. عندما تتصاعد على منصتنا ، تشارك في مساعدة البائعين على زيادة المبيعات ، بحيث يمكنك أيضًا كسب المال منها. حتى يتمكن الجميع من إعادة الشحن بثقة ، هذا مشروع جيد لجني الأموال. 🔇🔇🔇
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
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
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
    // إظهار الإعلان بعد ثانية واحدة
    setTimeout(() => {
        this.showAd = true;
    }, 1000);
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
/* التنسيقات العامة المطابقة للصورة */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f4c5c 0%, #1a1c2c 100%);
  direction: rtl;
  overflow-x: hidden;
}

/* الشريط العلوي */
.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
}

.icon-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.lang-switch {
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.lang-switch i {
  color: #ffdf00;
  font-size: 10px;
}

/* الهيرو والشعار */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 20px;
}

.cube-svg {
  width: 280px;
  height: 280px;
  position: absolute;
  top: 0;
  opacity: 0.8;
}

.logo-frame {
  z-index: 10;
  background: white;
  width: 110px;
  height: 110px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  margin-top: 20px;
}

.scfl-logo-circle {
  width: 95px;
  height: 95px;
  border: 2px solid #001f3f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-inner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.logo-row {
  display: flex;
  gap: 12px;
  font-weight: 900;
  font-size: 20px;
  color: #001f3f;
}

.logo-line {
  width: 70px;
  height: 2px;
  background: #001f3f;
  margin: 2px 0;
}

.logo-tag {
  position: absolute;
  background: #001f3f;
  color: white;
  font-size: 7px;
  padding: 1px 3px;
  top: 45%;
  border-radius: 1px;
}

.brand-name {
  color: #ffdf00;
  font-size: 26px;
  font-weight: bold;
  margin-top: 15px;
  z-index: 10;
}

/* البطاقة */
.card {
  background: #2c2c3e;
  flex-grow: 1;
  border-radius: 40px 40px 0 0;
  padding: 40px 25px;
  position: relative;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.4);
  margin-top: 20px;
}

.support-bubble {
  position: absolute;
  right: 20px;
  top: -30px;
  cursor: pointer;
}

/* التبويبات */
.login-type-selector {
  display: flex;
  justify-content: space-around;
  margin-bottom: 35px;
}

.type-btn {
  background: transparent;
  border: none;
  color: #8e8e9e;
  font-size: 16px;
  cursor: pointer;
  padding-bottom: 5px;
}

.type-btn.active {
  color: #ffdf00;
}

/* المدخلات */
.input-box {
  position: relative;
  margin-bottom: 20px;
}

.input, .country-select, .phone-input {
  width: 100%;
  height: 60px;
  padding: 0 50px 0 20px;
  border-radius: 15px;
  border: none;
  background: #3e3e56;
  color: white;
  font-size: 16px;
  text-align: right;
}

.input:focus, .country-select:focus, .phone-input:focus {
  outline: 2px solid #ffdf00;
}

.field-icon {
  position: absolute;
  right: 15px;
  top: 20px;
  color: #ffdf00;
  font-size: 20px;
}

.toggle {
  position: absolute;
  left: 15px;
  top: 20px;
  color: #8e8e9e;
  cursor: pointer;
}

.phone-input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.country-select {
  width: 120px;
  padding: 0 10px;
}

.phone-input {
  padding-right: 20px;
}

/* الأزرار */
.btn {
  width: 100%;
  height: 55px;
  background: #ffdf00;
  color: #000;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #000;
  border-top: 3px solid transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.link {
  text-align: center;
  margin-top: 25px;
  color: white;
}

.link a {
  color: #ffdf00;
  text-decoration: none;
  margin-right: 5px;
}

.error-message-box {
  background: rgba(255, 0, 0, 0.1);
  color: #ff6b6b;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 15px;
}

/* الإعلان */
.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ad-box {
  background: #11151c;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  border: 1px solid #ffdf00;
  overflow: hidden;
}

.ad-box h2 {
  background: #ffdf00;
  color: black;
  padding: 15px;
  text-align: center;
}

.ad-content {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
  color: white;
}

.ad-btn {
  width: 100%;
  padding: 15px;
  background: transparent;
  border: none;
  border-top: 1px solid #ffdf00;
  color: #ffdf00;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 480px) {
  .card {
    padding: 25px 20px;
  }
}
</style>
