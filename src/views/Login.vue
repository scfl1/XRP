<template>
  <div class="container">
    <div class="card">
      <!-- الشعار والعنوان -->
      <div class="brand-header">
        <div class="logo-wrapper">
          <img :src="logo" class="luxury-logo" alt="Palm Treasure Logo" />
        </div>
      </div>
      <h2 class="title">تسجيل الدخول</h2>
      
      <!-- رسالة الخطأ العامة -->
      <div v-if="errorMessage" class="error-message-box">
        {{ errorMessage }}
      </div>
      
      <!-- اختيار نوع الدخول -->
      <div class="login-type-selector">
        <button 
          class="type-btn" 
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'"
        >
          <i class="fas fa-envelope"></i>
          البريد الإلكتروني
        </button>
        <button 
          class="type-btn" 
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          <i class="fas fa-phone"></i>
          رقم الهاتف
        </button>
      </div>
      <!-- تسجيل الدخول بالبريد الإلكتروني -->
      <template v-if="loginType === 'email'">
        <label class="label">البريد الإلكتروني</label>
        <input
          type="email"
          v-model="email"
          placeholder="البريد الإلكتروني"
          class="input"
          :class="{ 'input-error': errorMessage && loginType === 'email' }"
          @keyup.enter="loginUser"
          @focus="clearError"
        />
      </template>
      <!-- تسجيل الدخول برقم الهاتف -->
      <template v-if="loginType === 'phone'">
        <label class="label">رقم الهاتف مع رمز الدولة</label>
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
      <label class="label">كلمة المرور</label>
      <div class="input-box">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="كلمة المرور"
          class="input"
          :class="{ 'input-error': errorMessage }"
          @keyup.enter="loginUser"
          @focus="clearError"
        />
        <span class="toggle" @click="togglePassword">
          {{ showPassword ? "إخفاء" : "إظهار" }}
        </span>
      </div>
      <!-- زر تسجيل الدخول مع Loader -->
      <button class="btn" @click="loginUser" :disabled="loading">
        <span v-if="!loading">تسجيل الدخول</span>
        <span v-else class="loader"></span>
      </button>
      <!-- تسجيل الدخول عبر جوجل -->
      <div class="divider">
        <span>أو</span>
      </div>
      
      <button class="google-btn" @click="loginWithGoogle" :disabled="loading">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
        تسجيل الدخول عبر جوجل
      </button>
      <p class="link">
        ليس لديك حساب؟
        <router-link to="/register">إنشاء حساب</router-link>
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
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, googleProvider } from "../firebase";
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
    async loginWithGoogle() {
      this.loading = true;
      this.errorMessage = "";
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
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
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            balance: 0,
            vipLevel: 0,
            createdAt: serverTimestamp(),
            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            invitedBy: ""
          });
        }
        
        const admins = ["azad.333388@gmail.com", "admin2@gmail.com", "owner@gmail.com"];
        if (admins.includes(user.email)) {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        this.errorMessage = this.getErrorMessage(error);
      } finally {
        this.loading = false;
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
/* التنسيقات العامة */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0A0C10;
  padding: 20px;
  direction: rtl;
}
.card {
  background: #11151C;
  width: 100%;
  max-width: 380px;
  padding: 30px 25px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(212, 175, 55, 0.1);
}
/* رسالة الخطأ */
.error-message-box {
  background: rgba(255, 107, 107, 0.15);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  padding: 12px 15px;
  margin-bottom: 20px;
  color: #ff6b6b;
  font-size: 13px;
  text-align: center;
  font-weight: 500;
}
/* الشعار والعنوان */
.brand-header {
  text-align: center;
  margin-bottom: 25px;
}
.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.luxury-logo {
  width: 120px;
  object-fit: contain;
}
.title {
  color: #ffffff;
  text-align: center;
  font-size: 20px;
  margin-bottom: 25px;
  font-weight: 600;
}
/* اختيار نوع الدخول */
.login-type-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: #1A1F2A;
  padding: 5px;
  border-radius: 12px;
}
.type-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.type-btn.active {
  background: #D4AF37;
  color: #0A0C10;
}
.label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
}
/* حقول الإدخال */
.input, .country-select, .phone-input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: #1A1F2A;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.input-error {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 1px rgba(255, 107, 107, 0.3);
}
.phone-input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}
.country-select {
  width: 120px;
  margin-bottom: 0;
}
.phone-input {
  margin-bottom: 0;
}
.input:focus, .country-select:focus, .phone-input:focus {
  outline: none;
  border-color: #D4AF37;
  background: #1E2430;
}
/* حقل كلمة المرور */
.input-box {
  position: relative;
  width: 100%;
}
.toggle {
  position: absolute;
  left: 12px;
  top: 10px;
  color: #D4AF37;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}
/* الأزرار */
.btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0A0C10;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}
.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
/* فاصل */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: rgba(255, 255, 255, 0.3);
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.divider span {
  padding: 0 10px;
  font-size: 12px;
}
/* زر جوجل */
.google-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #ffffff;
  color: #333;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}
.google-btn img {
  width: 18px;
  height: 18px;
}
.google-btn:hover:not(:disabled) {
  background: #f1f1f1;
}
.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.link {
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
.link a {
  color: #D4AF37;
  text-decoration: none;
  font-weight: 600;
}
.loader {
  width: 18px;
  height: 18px;
  border: 2px solid #0A0C10;
  border-top: 2px solid #D4AF37;
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
    padding: 25px 20px;
  }
}
</style>
