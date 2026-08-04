<template>
  <div class="container">
    <div class="login-card">
      <!-- عنوان "عربي" في الأعلى -->
      <div class="lang-label">
        <i class="fas fa-globe"></i> عربي
      </div>

      <!-- رسالة الخطأ العامة -->
      <div v-if="errorMessage" class="error-message-box">
        {{ errorMessage }}
      </div>

      <!-- خيارات تسجيل الدخول -->
      <div class="login-options">
        <button 
          class="login-option" 
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          <i class="fas fa-phone-alt"></i> الهاتف
        </button>
        <button 
          class="login-option" 
          :class="{ active: loginType === 'email' }"
          @click="loginType = 'email'"
        >
          <i class="fas fa-envelope"></i> البريد الإلكتروني
        </button>
      </div>

      <!-- حقل البريد الإلكتروني -->
      <template v-if="loginType === 'email'">
        <div class="input-group">
          <label class="field-label">
            <i class="far fa-envelope"></i> بريد إلكتروني
          </label>
          <div class="input-icon-wrap">
            <input
              type="email"
              v-model="email"
              placeholder="example@domain.com"
              class="input-field"
              :class="{ 'input-error': errorMessage }"
              @keyup.enter="loginUser"
              @focus="clearError"
            />
            <i class="fas fa-user-circle"></i>
          </div>
        </div>
      </template>

      <!-- حقل رقم الهاتف -->
      <template v-if="loginType === 'phone'">
        <div class="input-group">
          <label class="field-label">
            <i class="fas fa-phone"></i> رقم الهاتف
          </label>
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
              :class="{ 'input-error': errorMessage || phoneError }"
              :disabled="!countryCode"
              @input="validatePhoneNumber"
              @keyup.enter="loginUser"
              @focus="clearError"
            />
          </div>
          <span v-if="phoneError" class="validation-error">{{ phoneError }}</span>
        </div>
      </template>

      <!-- حقل كلمة المرور -->
      <div class="input-group">
        <label class="field-label">
          <i class="fas fa-lock"></i> كلمة سر الدخول
        </label>
        <div class="input-icon-wrap">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="••••••••"
            class="input-field"
            :class="{ 'input-error': errorMessage }"
            @keyup.enter="loginUser"
            @focus="clearError"
          />
          <i class="fas fa-key"></i>
          <span class="toggle-password" @click="togglePassword">
            {{ showPassword ? "إخفاء" : "إظهار" }}
          </span>
        </div>
      </div>

      <!-- زر تسجيل الدخول -->
      <button class="login-btn" @click="loginUser" :disabled="loading">
        <span v-if="!loading"><i class="fas fa-sign-in-alt"></i> تسجيل الدخول</span>
        <span v-else class="loader"></span>
      </button>

      <!-- رابط "لا حساب؟ يسجل" -->
      <div class="signup-link">
        <i class="fas fa-user-plus"></i> لا حساب؟
        <router-link to="/register"><i class="fas fa-arrow-left"></i> يسجل</router-link>
      </div>

      <!-- تسجيل الدخول عبر جوجل -->
      <div class="divider">
        <span>أو</span>
      </div>
      
      <button class="google-btn" @click="loginWithGoogle" :disabled="loading">
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
        تسجيل الدخول عبر جوجل
      </button>
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
          this.errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
          return;
        }
      }

      if (this.password.length < 6) {
        this.errorMessage = "كلمة المرور يجب أن تكون 6 أحرف على الأقل.";
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
/* ===== التنسيقات المطابقة للصورة ===== */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, #f0f4fa 0%, #d9e2ef 100%);
  padding: 20px;
  direction: rtl;
}

.login-card {
  background-color: #ffffff;
  width: 100%;
  max-width: 420px;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 36px;
  box-shadow: 0 20px 40px rgba(0, 20, 40, 0.2), 0 6px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* عنوان "عربي" في الأعلى */
.lang-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e2a3a;
  letter-spacing: 0.5px;
  margin-bottom: 1.8rem;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #eef2f7;
  padding-bottom: 0.6rem;
}

.lang-label i {
  margin-left: 6px;
  color: #2c3e50;
}

/* رسالة الخطأ */
.error-message-box {
  background: rgba(255, 107, 107, 0.12);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 12px;
  padding: 10px 15px;
  margin-bottom: 20px;
  color: #dc3545;
  font-size: 13px;
  text-align: center;
  font-weight: 500;
}

/* خيارات تسجيل الدخول */
.login-options {
  display: flex;
  gap: 12px;
  margin-bottom: 2rem;
  background: #f2f6fc;
  padding: 6px;
  border-radius: 60px;
  border: 1px solid #e2e9f2;
}

.login-option {
  flex: 1;
  text-align: center;
  padding: 0.7rem 0.2rem;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  background: transparent;
  color: #3a4a5e;
  transition: 0.2s;
  border: none;
}

.login-option.active {
  background: #ffffff;
  color: #0b1b2b;
  box-shadow: 0 4px 10px rgba(0, 20, 40, 0.08);
  border: 1px solid #d0dcec;
}

.login-option i {
  margin-left: 8px;
  font-size: 0.9rem;
}

/* مجموعات الحقول */
.input-group {
  margin-bottom: 1.5rem;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2a3a;
  margin-bottom: 0.4rem;
}

.field-label i {
  color: #3f5a7a;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* حقل الإدخال مع أيقونة */
.input-icon-wrap {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 0.9rem 2.8rem 0.9rem 1.2rem;
  border-radius: 40px;
  border: 1.5px solid #dbe2ec;
  background-color: #fafcff;
  font-size: 1rem;
  color: #1a2636;
  outline: none;
  transition: 0.2s;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #3b6c9c;
  box-shadow: 0 0 0 3px rgba(59, 108, 156, 0.15);
  background-color: #ffffff;
}

.input-field::placeholder {
  color: #a0b2c9;
  font-weight: 400;
  font-size: 0.95rem;
}

.input-icon-wrap i {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7a8da5;
  font-size: 1rem;
  pointer-events: none;
}

.input-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
}

/* حقل الهاتف */
.phone-input-container {
  display: flex;
  gap: 8px;
}

.country-select {
  width: 120px;
  padding: 0.9rem 0.8rem;
  border-radius: 40px;
  border: 1.5px solid #dbe2ec;
  background-color: #fafcff;
  font-size: 0.9rem;
  color: #1a2636;
  outline: none;
  transition: 0.2s;
  cursor: pointer;
}

.country-select:focus {
  border-color: #3b6c9c;
  box-shadow: 0 0 0 3px rgba(59, 108, 156, 0.15);
}

.phone-input {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border-radius: 40px;
  border: 1.5px solid #dbe2ec;
  background-color: #fafcff;
  font-size: 1rem;
  color: #1a2636;
  outline: none;
  transition: 0.2s;
}

.phone-input:focus {
  border-color: #3b6c9c;
  box-shadow: 0 0 0 3px rgba(59, 108, 156, 0.15);
  background-color: #ffffff;
}

.phone-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.validation-error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

/* زر إظهار/إخفاء كلمة المرور */
.toggle-password {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #3b6c9c;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f0f4fa;
  padding: 2px 10px;
  border-radius: 20px;
  user-select: none;
}

.toggle-password:hover {
  background: #d9e2ef;
}

/* زر تسجيل الدخول */
.login-btn {
  width: 100%;
  background: #1f3a5a;
  border: none;
  padding: 0.95rem;
  border-radius: 60px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
  margin: 0.5rem 0 1.5rem 0;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 8px 16px rgba(26, 55, 94, 0.25);
  border: 1px solid #2b4b70;
}

.login-btn:hover:not(:disabled) {
  background: #17304d;
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(20, 50, 80, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: scale(0.97);
  background: #0f263d;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn i {
  margin-left: 10px;
}

/* رابط "لا حساب؟ يسجل" */
.signup-link {
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2e42;
  border-top: 1px solid #e7edf6;
  padding-top: 1.5rem;
  margin-top: 0.2rem;
}

.signup-link a {
  color: #1f3a5a;
  font-weight: 700;
  text-decoration: none;
  margin-right: 8px;
  border-bottom: 2px solid transparent;
  transition: 0.15s;
  padding-bottom: 2px;
}

.signup-link a:hover {
  border-bottom-color: #1f3a5a;
  color: #0f263d;
}

.signup-link i {
  margin-right: 6px;
  color: #2b4b70;
  font-size: 0.9rem;
}

/* فاصل */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: rgba(0, 0, 0, 0.25);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e7edf6;
}

.divider span {
  padding: 0 10px;
  font-size: 13px;
  font-weight: 500;
}

/* زر جوجل */
.google-btn {
  width: 100%;
  padding: 11px;
  border: 1px solid #dbe2ec;
  background: #ffffff;
  color: #1f2a3a;
  border-radius: 60px;
  font-size: 0.95rem;
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
  background: #f5f7fa;
  border-color: #c0cbd8;
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid #D4AF37;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== الإعلان ===== */
.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
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
  text-align: center;
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
  font-size: 16px;
}

.ad-btn:hover {
  background: rgba(212, 175, 55, 0.05);
}

/* استجابة للشاشات الصغيرة */
@media (max-width: 480px) {
  .login-card {
    padding: 1.8rem 1.2rem 1.5rem;
  }
  .login-option {
    font-size: 0.8rem;
    padding: 0.6rem 0;
  }
  .login-btn {
    font-size: 1rem;
    padding: 0.8rem;
  }
  .country-select {
    width: 100px;
    font-size: 0.8rem;
    padding: 0.8rem 0.5rem;
  }
}
</style>
