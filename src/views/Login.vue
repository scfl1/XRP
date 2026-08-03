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
        <span class="cube c1"></span>
        <span class="cube c2"></span>
        <span class="cube c3"></span>
        <span class="cube c4"></span>
        <span class="cube c5"></span>
        <span class="cube c6"></span>
        <span class="cube c7"></span>
      </div>
      <div class="logo-frame">
        <img :src="logo" class="luxury-logo" alt="Palm Treasure Logo" />
      </div>
      <h1 class="brand-name">PALM TREASURE</h1>
    </div>

    <!-- بطاقة تسجيل الدخول -->
    <div class="card">
      <div class="support-bubble" title="الدعم الفني">
        <i class="fab fa-telegram-plane"></i>
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
        <p>🎉🎉🎉🎉 مرحبا بالجميع! تأسست Palm Treasure في سنغافورة في 20 أغسطس 2021 ومقرها حاليًا في منطقة الأعمال المركزية في سنغافورة. نحن شركة استثمار في التجارة الإلكترونية مع فريق تقني قوي وقوة مالية قوية.
          <br><br>
          يتعاون Palm Treasure مع عشرات شركات التجارة الإلكترونية مثل Amazon و eBay و Tiktok و Aliexpress و Alibaba و Shopee ، إلخ. لمساعدة التجار على زيادة مبيعات المنتجات الخاصة بهم ، ويمكننا أيضًا تحقيق أرباح منه. عندما تتصاعد على منصتنا ، تشارك في مساعدة البائعين على زيادة المبيعات ، بحيث يمكنك أيضًا كسب المال منها. حتى يتمكن الجميع من إعادة الشحن بثقة ، هذا مشروع جيد لجني الأموال. 🔇🔇🔇
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
* {
  box-sizing: border-box;
}
.login-page {
  min-height: 100vh;
  direction: rtl;
  background: radial-gradient(circle at 50% 40%, #21a37a 0%, #1c8c69 22%, #1a6b53 42%, #23293a 68%, #282634 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* الشريط العلوي */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px 0;
}
.icon-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #fff;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
}
.lang-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
}
.lang-switch i {
  color: #FFE500;
  font-size: 11px;
}

/* منطقة الشعار */
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 20px 70px;
  overflow: hidden;
}
.hero-glow {
  position: absolute;
  top: -40px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(212, 175, 55, 0) 70%);
  filter: blur(10px);
  pointer-events: none;
}
.cube-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
}
.cube {
  position: absolute;
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, rgba(80, 220, 200, 0.35), rgba(20, 90, 90, 0.15));
  border: 1px solid rgba(150, 240, 220, 0.25);
  transform: rotate(45deg);
  border-radius: 6px;
}
.c1 { top: 10%; left: 12%; width: 30px; height: 30px; }
.c2 { top: 20%; right: 10%; width: 40px; height: 40px; }
.c3 { top: 55%; left: 6%; width: 36px; height: 36px; }
.c4 { top: 60%; right: 8%; width: 28px; height: 28px; }
.c5 { top: 5%; left: 45%; width: 22px; height: 22px; }
.c6 { top: 75%; left: 30%; width: 24px; height: 24px; }
.c7 { top: 72%; right: 30%; width: 20px; height: 20px; }

.logo-frame {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 28px;
  background: linear-gradient(145deg, #16233a, #0c1424);
  border: 2px solid rgba(212, 175, 55, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.luxury-logo {
  width: 78px;
  object-fit: contain;
}
.brand-name {
  z-index: 1;
  margin-top: 14px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 800;
  color: #FFE500;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

/* بطاقة تسجيل الدخول */
.card {
  position: relative;
  background: #3c3a47;
  border-radius: 26px 26px 0 0;
  padding: 26px 22px 34px;
  margin-top: -45px;
  flex: 1;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.35);
}
.support-bubble {
  position: absolute;
  top: -22px;
  left: 22px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(145deg, #2aa8e0, #1a7fb0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

/* رسالة الخطأ */
.error-message-box {
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  padding: 12px 15px;
  margin-bottom: 15px;
  color: #ff6b6b;
  font-size: 13px;
  text-align: center;
  font-weight: 500;
}

/* اختيار نوع الدخول */
.login-type-selector {
  display: flex;
  gap: 18px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.type-btn {
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  padding: 0;
}
.type-btn.active {
  color: #FFE500;
}

/* حقول الإدخال */
.input-box {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
}
.field-icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #FFE500;
  font-size: 15px;
}
.input {
  width: 100%;
  padding: 14px 16px 14px 42px;
  border-radius: 14px;
  border: none;
  background: #55525d;
  color: #ffffff;
  font-size: 14px;
  box-sizing: border-box;
}
.input::placeholder {
  color: #a9a8af;
}
.input-error {
  box-shadow: 0 0 0 1px #ff6b6b;
}
.input:focus {
  outline: none;
  background: #5c5964;
}
.toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 15px;
}

.phone-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.country-select {
  width: 120px;
  padding: 14px 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 13px;
}
.phone-input {
  flex: 1;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 14px;
}
.phone-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
.country-select:focus, .phone-input:focus {
  outline: none;
  border-color: #D4AF37;
  background: rgba(255, 255, 255, 0.09);
}

/* الأزرار */
.btn {
  width: 100%;
  padding: 16px;
  border: none;
  background: #FFE500;
  color: #1a1a1a;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 22px;
}
.btn:hover:not(:disabled) {
  filter: brightness(1.05);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link {
  text-align: center;
  margin-top: 18px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
.link a {
  color: #FFE500;
  text-decoration: none;
  font-weight: 700;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid #1a1a1a;
  border-top: 2px solid #FFE500;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.validation-error {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 10px;
  display: block;
}

/* الإعلان */
.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.ad-box {
  background: #11151C;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  border: 1px solid #D4AF37;
  overflow: hidden;
}
.ad-box h2 {
  background: #D4AF37;
  color: #0A0C10;
  margin: 0;
  padding: 15px;
  font-size: 18px;
}
.ad-content {
  padding: 20px;
  color: #fff;
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
}
.ad-btn {
  width: 100%;
  padding: 15px;
  background: transparent;
  border: none;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
  color: #D4AF37;
  cursor: pointer;
  font-weight: 700;
}
@media (max-width: 480px) {
  .card {
    padding: 24px 18px 30px;
  }
}
</style>
