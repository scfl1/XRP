<template>
  <div class="container">
    <div class="card">
      <!-- إضافة الشعار والعنوان -->
      <div class="brand-header">
        <div class="logo-wrapper">
          <img :src="logo" class="luxury-logo" alt="Palm Treasure Logo" />
        </div>
      </div>

      <h2 class="title">إنشاء حساب</h2>

      <!-- رسالة الخطأ العامة -->
      <div v-if="errorMessage" class="error-message-box">
        {{ errorMessage }}
      </div>

      <!-- اختيار طريقة إنشاء الحساب -->
      <div class="register-type-selector">
        <button 
          class="type-btn" 
          :class="{ active: registerType === 'email' }"
          @click="registerType = 'email'; clearErrors()"
        >
          <i class="fas fa-envelope"></i>
          البريد الإلكتروني
        </button>
        <button 
          class="type-btn" 
          :class="{ active: registerType === 'phone' }"
          @click="registerType = 'phone'; clearErrors()"
        >
          <i class="fas fa-phone"></i>
          رقم الهاتف
        </button>
      </div>

      <!-- إنشاء حساب بالبريد الإلكتروني -->
      <template v-if="registerType === 'email'">
        <label class="label">البريد الإلكتروني</label>
        <input
          type="email"
          v-model="email"
          placeholder="البريد الإلكتروني"
          class="input"
          :class="{ 'input-error': errorMessage && registerType === 'email' }"
          @focus="clearErrors"
        />
      </template>

      <!-- إنشاء حساب برقم الهاتف -->
      <template v-if="registerType === 'phone'">
        <label class="label">رقم الهاتف مع رمز الدولة</label>
        <div class="phone-input-container">
          <select v-model="countryCode" class="country-select" @change="validatePhoneNumber">
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
            :class="{ 'input-error': (errorMessage || phoneError) && registerType === 'phone' }"
            :disabled="!countryCode"
            @input="validatePhoneNumber"
            @focus="clearErrors"
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
          :class="{ 'input-error': passwordError }"
          @focus="clearErrors"
        />
        <span class="toggle" @click="togglePassword">
          {{ showPassword ? "إخفاء" : "إظهار" }}
        </span>
      </div>

      <!-- تأكيد كلمة المرور -->
      <label class="label">تأكيد كلمة المرور</label>
      <div class="input-box">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          class="input"
          :class="{ 'input-error': passwordError }"
          @focus="clearErrors"
        />
        <span class="toggle" @click="toggleConfirmPassword">
          {{ showConfirmPassword ? "إخفاء" : "إظهار" }}
        </span>
      </div>
      <span v-if="passwordError" class="validation-error">{{ passwordError }}</span>

      <!-- كود الإحالة -->
      <label class="label">كود الإحالة (اختياري)</label>
      <input
        type="text"
        v-model="inviteCode"
        placeholder="كود الإحالة"
        class="input"
      />

      <!-- زر إنشاء الحساب -->
      <button class="btn" @click="registerUser" :disabled="loading">
        <span v-if="!loading">إنشاء حساب</span>
        <span v-else class="loader"></span>
      </button>

      <p class="link">
        لديك حساب؟
        <router-link to="/login">تسجيل الدخول</router-link>
      </p>
    </div>
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
      logo,
      registerType: 'email',
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
        this.phoneError = "رقم الهاتف غير صحيح";
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

    async checkPhoneExists(fullPhone) {
      try {
        const q = query(collection(db, "users"), where("phoneNumber", "==", fullPhone));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
      } catch (error) {
        console.error("Error checking phone:", error);
        return false;
      }
    },

    async registerUser() {
      this.clearErrors();
      
      let registerEmail = this.email;
      
      if (this.registerType === 'phone') {
        if (!this.validatePhoneNumber()) return;
        registerEmail = this.generatePhoneEmail(this.fullPhoneNumber);
      } else {
        if (!this.validateEmail(this.email)) {
          this.errorMessage = "الرجاء إدخال بريد إلكتروني صحيح";
          return;
        }
      }

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
        if (this.registerType === 'phone') {
          const exists = await this.checkPhoneExists(this.fullPhoneNumber);
          if (exists) {
            this.errorMessage = "رقم الهاتف مسجل مسبقاً";
            this.loading = false;
            return;
          }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, this.password);
        const user = userCredential.user;

        let invitedBy = "";
        let level2 = "";
        let level3 = "";

        if (this.inviteCode) {
          const q = query(collection(db, "users"), where("referralCode", "==", this.inviteCode));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const inviterDoc = querySnapshot.docs[0];
            invitedBy = inviterDoc.id;
            const inviterData = inviterDoc.data();
            level2 = inviterData.invitedBy || "";
            level3 = inviterData.level2 || "";
          }
        }

        const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: this.registerType === 'email' ? this.email : "",
          phoneNumber: this.registerType === 'phone' ? this.fullPhoneNumber : "",
          phoneNumberOnly: this.registerType === 'phone' ? this.phoneNumber : "",
          balance: 0,
          vipLevel: 0,
          referralCode: referralCode,
          invitedBy: invitedBy,
          level2: level2,
          level3: level3,
          createdAt: serverTimestamp(),
        });

        router.push("/home");
      } catch (error) {
        console.error("Registration error:", error);
        
        if (error.code === 'auth/email-already-in-use') {
          if (this.registerType === 'email') {
            this.errorMessage = "البريد الإلكتروني مسجل مسبقاً";
          } else {
            this.errorMessage = "رقم الهاتف مسجل مسبقاً";
          }
        } else {
          this.errorMessage = "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً";
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
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

.brand-header {
  text-align: center;
  margin-bottom: 25px;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.luxury-logo {
  width: 80px;
  object-fit: contain;
}

.title {
  color: #ffffff;
  text-align: center;
  font-size: 20px;
  margin-bottom: 25px;
  font-weight: 600;
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

.register-type-selector {
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

.validation-error {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 15px;
  display: block;
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

@media (max-width: 480px) {
  .card {
    padding: 25px 20px;
  }
}
</style>
