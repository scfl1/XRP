<template>
  <div class="withdraw-page">
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <i class="fas fa-hand-holding-usd"></i>
          سحب الأرباح
          <span class="title-glow">USDT</span>
        </h2>
        <p class="sub">قم بإدخال معلومات السحب الخاصة بك</p>
      </div>

      <!-- رصيد المستخدم -->
      <div class="balance-box">
        <div class="balance-info">
          <span class="balance-label">رصيدك الحالي القابل للسحب</span>
          <div class="balance-display">
            <img src="https://assets.coingecko.com/coins/images/325/large/tether.png" alt="USDT" class="balance-usdt-icon">
            <span class="balance-amount">{{ vipBalance.toFixed(2) }}</span>
            <span class="balance-currency-badge">USDT</span>
          </div>
        </div>
      </div>

      <!-- حالة VIP -->
      <div v-if="userVipLevel" class="vip-status-box">
        <div class="vip-badge">
          <i class="fas fa-crown"></i>
          مستوى VIP {{ userVipLevel }}
        </div>
        <div class="user-contact">
          <i class="fas fa-phone" v-if="userPhone"></i>
          <i class="fas fa-envelope" v-else></i>
          {{ userContact }}
        </div>
        <div class="withdraw-condition">
          <i class="fas fa-check-circle" :class="{ 'condition-met': isVIP8OrAbove || vipBalance >= minWithdrawAmount }"></i>
          <span>الحد الأدنى: <strong>{{ isVIP8OrAbove ? 'بدون حد أدنى' : minWithdrawAmount + ' USDT' }}</strong></span>
        </div>
        <div class="withdraw-condition">
          <i class="fas fa-check-circle" :class="{ 'condition-met': isAllowedDay }"></i>
          <span>يوم السحب: <strong>{{ isVIP8OrAbove ? 'أي يوم' : withdrawDay }}</strong></span>
        </div>
        <div v-if="isVIP8OrAbove" class="vip-special-badge">
          <i class="fas fa-star"></i>
          مميزات VIP 8+: سحب أي مبلغ في أي وقت
        </div>
      </div>

      <div v-else class="vip-status-box error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>يجب أن يكون لديك اشتراك VIP للسحب</p>
      </div>

      <!-- مبلغ السحب -->
      <div class="input-group">
        <label>
          <i class="fas fa-coins"></i>
          المبلغ
        </label>
        <div class="amount-input-wrapper">
          <input 
            type="number" 
            v-model.number="amount" 
            placeholder="0.00" 
            class="gold-input"
            @input="validateAmount"
            autocomplete="off"
            name="amount_field_x"
          />
          <span class="input-currency-badge">USDT</span>
        </div>
        <span v-if="amountError" class="input-error">{{ amountError }}</span>
      </div>

      <!-- الشبكة -->
      <div class="input-group">
        <label>
          <i class="fas fa-network-wired"></i>
          الشبكة
        </label>
        <div class="custom-dropdown-wrapper">
          <div class="custom-dropdown">
            <div class="dropdown-trigger" @click="toggleNetworkDropdown">
              <div v-if="network" class="selected-network">
                <img :src="getNetworkIcon(network)" :alt="network" class="dropdown-icon">
                <span>{{ getNetworkLabel(network) }}</span>
              </div>
              <div v-else class="placeholder">اختر الشبكة</div>
              <i class="fas fa-chevron-down" :class="{ 'rotate': showNetworkDropdown }"></i>
            </div>
            <div v-if="showNetworkDropdown" class="dropdown-menu">
              <div 
                v-for="net in networks" 
                :key="net.value"
                class="dropdown-item"
                :class="{ 'active': network === net.value }"
                @click="selectNetwork(net.value)"
              >
                <img :src="getNetworkIcon(net.value)" :alt="net.value" class="dropdown-item-icon">
                <div class="dropdown-item-content">
                  <div class="dropdown-item-name">{{ net.label }}</div>
                  <div class="dropdown-item-symbol">{{ net.value }}</div>
                </div>
                <i v-if="network === net.value" class="fas fa-check"></i>
              </div>
            </div>
          </div>
        </div>
        <span v-if="networkError" class="input-error">{{ networkError }}</span>
      </div>

      <!-- حاجز فاصل بين قسم المحفظة وقسم كلمة المرور -->
      <div class="fields-separator"></div>

      <!-- عنوان المحفظة - قسم مستقل -->
      <div class="isolated-section">
        <!-- حقول وهمية خاصة بقسم المحفظة -->
        <input type="text" style="display:none!important;position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;" autocomplete="off" name="w_fake_1" tabindex="-1">
        <input type="password" style="display:none!important;position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;" autocomplete="new-password" name="w_fake_2" tabindex="-1">
        
        <div class="input-group wallet-section">
          <label>
            <i class="fas fa-qrcode"></i>
            عنوان المحفظة
          </label>
          <div class="wallet-input-wrapper">
            <input 
              ref="walletInput"
              type="text" 
              v-model="wallet" 
              placeholder="أدخل عنوان محفظتك USDT" 
              class="gold-input"
              @input="validateWallet"
              autocomplete="off"
              name="wallet_address_field"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
              data-browser-autofill="off"
            />
          </div>
          <span v-if="walletError" class="input-error">{{ walletError }}</span>
        </div>
      </div>

      <!-- حاجز فاصل بين قسم المحفظة وقسم كلمة المرور -->
      <div class="fields-separator"></div>

      <!-- كلمة المرور - قسم مستقل -->
      <div class="isolated-section">
        <!-- حقول وهمية خاصة بقسم كلمة المرور -->
        <input type="text" style="display:none!important;position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;" autocomplete="username" name="p_fake_1" tabindex="-1">
        <input type="password" style="display:none!important;position:absolute!important;left:-9999px!important;top:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;" autocomplete="current-password" name="p_fake_2" tabindex="-1">
        
        <div class="input-group password-section">
          <label>
            <i class="fas fa-lock"></i>
            كلمة المرور
          </label>
          <div class="password-input-wrapper">
            <input 
              ref="passwordInput"
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="أدخل كلمة المرور" 
              class="gold-input"
              autocomplete="off"
              name="password_field_y"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
              data-browser-autofill="off"
            />
            <button type="button" class="toggle-password-btn" @click="showPassword = !showPassword" tabindex="-1">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- ملخص الطلب -->
      <div v-if="showSummary" class="summary-box">
        <h3>📋 ملخص طلب السحب</h3>
        
        <div class="summary-item">
          <span>معلومات الاتصال:</span>
          <span class="summary-value">{{ userContact }}</span>
        </div>
        
        <div class="summary-item">
          <span>مستوى VIP:</span>
          <span class="summary-value">{{ userVipLevel || 'لا يوجد' }}</span>
        </div>
        
        <div class="summary-item">
          <span>المبلغ المطلوب:</span>
          <span class="summary-value">{{ Number(amount).toFixed(2) }} USDT</span>
        </div>
        
        <div class="summary-item">
          <span>الرسوم (5%):</span>
          <span class="summary-value fee">-{{ fee.toFixed(2) }} USDT</span>
        </div>
        
        <div class="summary-item">
          <span>المبلغ الصافي:</span>
          <span class="summary-value net">{{ netAmount.toFixed(2) }} USDT</span>
        </div>
        
        <div class="summary-item">
          <span>الشبكة:</span>
          <span class="summary-value">{{ network }}</span>
        </div>
        
        <div class="summary-item">
          <span>عنوان المحفظة:</span>
          <span class="summary-value address">{{ wallet.substring(0, 10) }}...{{ wallet.substring(wallet.length - 10) }}</span>
        </div>
        
        <div class="summary-item">
          <span>يوم السحب:</span>
          <span class="summary-value">{{ isVIP8OrAbove ? 'أي يوم' : withdrawDay }}</span>
        </div>
        
        <div class="summary-item">
          <span>الحد الأدنى:</span>
          <span class="summary-value">{{ isVIP8OrAbove ? 'بدون حد أدنى' : minWithdrawAmount + ' USDT' }}</span>
        </div>
        
        <div class="summary-item total">
          <span>سيتم خصم من رصيد VIP:</span>
          <span class="summary-value">{{ Number(amount).toFixed(2) }} USDT</span>
        </div>
        
        <div class="summary-item">
          <span>رصيد VIP بعد السحب:</span>
          <span class="summary-value">{{ (vipBalance - Number(amount)).toFixed(2) }} USDT</span>
        </div>
      </div>

      <!-- تحذيرات -->
      <div class="warning-box">
        <i class="fas fa-shield-alt"></i>
        <div class="warning-text">
          <p>يرجى التأكد من صحة المعلومات قبل الإرسال</p>
          <p class="small">سيتم خصم {{ Number(amount) || 0 }} USDT من رصيد VIP الخاص بك. ستستلم {{ netAmount.toFixed(2) }} USDT بعد خصم 5% رسوم</p>
        </div>
      </div>

      <!-- زر السحب -->
      <button 
        class="gold-button" 
        @click="submitWithdraw"
        :disabled="isLoading || !isFormValid"
      >
        <i class="fas fa-paper-plane" v-if="!isLoading"></i>
        <i class="fas fa-spinner fa-spin" v-else></i>
        {{ isLoading ? 'جاري المعالجة...' : 'تأكيد السحب' }}
      </button>

      <!-- رسائل الخطأ والنجاح -->
      <transition name="fade">
        <div v-if="message" class="message" :class="messageType">
          <i :class="messageType === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
          {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import { doc, getDoc, runTransaction, collection, serverTimestamp, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

// ========== نظام التخزين المؤقت المحلي ==========
const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

function getCachedData(key) {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  dataCache.delete(key);
  return null;
}

function setCachedData(key, data) {
  dataCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export default {
  name: "Withdraw",
  
  data() {
    return {
      vipBalance: 0,
      amount: "",
      network: "",
      wallet: "",
      password: "",
      showPassword: false,
      isLoading: false,
      message: "",
      messageType: "info",
      userVipLevel: null,
      userPhone: "",
      userEmail: "",
      minWithdrawAmount: 5,
      showNetworkDropdown: false,
      networks: [
        { value: 'TRC20', label: 'Tron (TRC20)' },
        { value: 'ERC20', label: 'Ethereum (ERC20)' },
        { value: 'BEP20', label: 'BNB Chain (BEP20)' },
        { value: 'SOL', label: 'Solana (SOL)' }
      ],
      
      // أخطاء الحقول
      amountError: "",
      networkError: "",
      walletError: "",
      
      // نسبة الرسوم
      feePercentage: 5,
      
      vipLimits: {
        1: 5,
        2: 7,
        3: 25,
        4: 50,
        5: 150,
        6: 450,
        7: 675,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0
      },
      
      withdrawDays: {
        1: "السبت", 2: "السبت", 3: "السبت",
        4: "الأحد", 5: "الأحد",
        6: "الاثنين", 7: "الاثنين",
        8: "أي يوم", 9: "أي يوم",
        10: "أي يوم", 11: "أي يوم",
        12: "أي يوم", 13: "أي يوم",
        14: "أي يوم", 15: "أي يوم"
      },

      // متغيرات جديدة للتحسين
      dataLoaded: false,
      cacheKey: ''
    };
  },

  computed: {
    isVIP8OrAbove() {
      return this.userVipLevel >= 8;
    },

    withdrawDay() {
      return this.withdrawDays[this.userVipLevel] || "";
    },

    isAllowedDay() {
      if (!this.userVipLevel) return false;
      
      // VIP 8+ يمكنهم السحب في أي يوم
      if (this.isVIP8OrAbove) return true;
      
      const dayMap = {
        "السبت": "Saturday",
        "الأحد": "Sunday",
        "الاثنين": "Monday",
        "الثلاثاء": "Tuesday",
        "الأربعاء": "Wednesday",
        "الخميس": "Thursday",
        "الجمعة": "Friday"
      };
      
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const allowedDay = this.withdrawDays[this.userVipLevel];
      
      return today === dayMap[allowedDay];
    },

    // حساب الرسوم
    fee() {
      if (!this.amount) return 0;
      return (Number(this.amount) * this.feePercentage) / 100;
    },

    // حساب المبلغ الصافي
    netAmount() {
      if (!this.amount) return 0;
      return Number(this.amount) - this.fee;
    },

    isFormValid() {
      // لـ VIP 8+ الشروط مختلفة
      if (this.isVIP8OrAbove) {
        return (
          this.amount && 
          !this.amountError &&
          this.network && 
          !this.networkError &&
          this.wallet && 
          !this.walletError &&
          this.password &&
          this.userVipLevel &&
          this.vipBalance >= Number(this.amount) &&
          Number(this.amount) > 0
        );
      }
      
      // للـ VIP العادي
      return (
        this.amount && 
        !this.amountError &&
        this.network && 
        !this.networkError &&
        this.wallet && 
        !this.walletError &&
        this.password &&
        this.userVipLevel &&
        this.isAllowedDay &&
        Number(this.amount) === this.minWithdrawAmount &&
        this.vipBalance >= Number(this.amount)
      );
    },

    showSummary() {
      return this.amount && this.network && this.wallet && this.userVipLevel;
    },

    userContact() {
      if (this.userPhone) {
        return this.userPhone;
      } else if (this.userEmail) {
        return this.userEmail;
      } else {
        return "لا يوجد";
      }
    }
  },

  watch: {
    amount() {
      this.validateAmount();
    },
    network() {
      this.validateNetwork();
    },
    wallet() {
      this.validateWallet();
    },
    userVipLevel() {
      if (this.userVipLevel) {
        if (!this.isVIP8OrAbove) {
          this.minWithdrawAmount = this.vipLimits[this.userVipLevel] || 5;
        } else {
          this.minWithdrawAmount = 0;
        }
      }
    }
  },

  async created() {
    // ✅ تحسين: استخدام ذاكرة تخزين مؤقت لكل مستخدم
    const user = auth.currentUser;
    if (user) {
      this.cacheKey = `user_data_${user.uid}`;
      
      // محاولة استرداد البيانات من الذاكرة المؤقتة
      const cachedData = getCachedData(this.cacheKey);
      if (cachedData && !this.dataLoaded) {
        this.applyUserData(cachedData);
        return;
      }
    }
    
    await this.loadUserData();
  },

  mounted() {
    this.clearBrowserAutofill();
    this.preventAutocomplete();
  },

  // ✅ تحسين: تنظيف الذاكرة المؤقتة عند مغادرة الصفحة (اختياري)
  beforeUnmount() {
    // لا نحذف الذاكرة المؤقتة للسماح بإعادة استخدامها عند العودة للصفحة
    // لكن يمكن إضافة منطق تنظيف إذا لزم الأمر
  },

  methods: {
    clearBrowserAutofill() {
      this.$nextTick(() => {
        if (this.$refs.walletInput) {
          this.$refs.walletInput.value = '';
          this.wallet = '';
        }
        if (this.$refs.passwordInput) {
          this.$refs.passwordInput.value = '';
          this.password = '';
        }
      });
    },

    preventAutocomplete() {
      this.$nextTick(() => {
        setTimeout(() => {
          const allInputs = document.querySelectorAll('input');
          allInputs.forEach(input => {
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('data-lpignore', 'true');
            input.setAttribute('data-form-type', 'other');
            input.setAttribute('data-browser-autofill', 'off');
            
            if (input.name === 'wallet_address_field' || input.name === 'password_field_y') {
              const currentValue = input.value;
              if (currentValue && !this.wallet && !this.password) {
                input.value = '';
              }
            }
          });
        }, 100);
      });
    },

    // ✅ دالة مساعدة لتطبيق بيانات المستخدم
    applyUserData(userData) {
      // قراءة ذكية للرصيد - تدعم النظام القديم والجديد
      if (typeof userData.vipBalance === 'number') {
        this.vipBalance = userData.vipBalance;
      } else if (typeof userData.balance === 'number') {
        this.vipBalance = userData.balance;
      } else {
        this.vipBalance = 0;
      }
      
      this.userPhone = userData.phoneNumber || "";
      this.userEmail = userData.email || "";
      
      if (userData.vipLevel) {
        this.userVipLevel = userData.vipLevel;
      } else if (userData.vipData) {
        this.userVipLevel = userData.vipData.level;
      }
      
      this.dataLoaded = true;
    },

    async loadUserData() {
      const user = auth.currentUser;
      if (!user) {
        this.$router.push("/login");
        return;
      }

      try {
        // ✅ تحسين: دمج استعلامين في استعلام واحد مع استخدام الذاكرة المؤقتة
        const cacheKey = this.cacheKey || `user_data_${user.uid}`;
        const cachedData = getCachedData(cacheKey);
        
        if (cachedData) {
          this.applyUserData(cachedData);
          return;
        }

        // ✅ تحسين: تحميل بيانات المستخدم فقط (تجنب تحميل مستند vip المنفصل)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          // تجهيز البيانات للتخزين المؤقت
          const cacheData = {
            vipBalance: userData.vipBalance || userData.balance || 0,
            phoneNumber: userData.phoneNumber || "",
            email: userData.email || "",
            vipLevel: userData.vipLevel || null,
            vipData: null
          };

          // ✅ تحسين: إذا لم يكن vipLevel موجوداً في بيانات المستخدم، نحمله من subcollection
          // لكن نخزنه معاً في الذاكرة المؤقتة
          if (!cacheData.vipLevel) {
            const vipRef = doc(db, "users", user.uid, "vip", "current");
            const vipSnap = await getDoc(vipRef);
            if (vipSnap.exists()) {
              cacheData.vipData = { level: vipSnap.data().level };
            }
          }

          // تخزين في الذاكرة المؤقتة
          setCachedData(cacheKey, cacheData);
          
          // تطبيق البيانات
          this.applyUserData(cacheData);
          
          // ✅ تحسين: إذا لم يكن هناك VIP، نعرض رسالة مرة واحدة فقط
          if (!this.userVipLevel && !cacheData.vipData) {
            this.showMessage("لا يوجد اشتراك VIP نشط", "error");
          }
        }
      } catch (error) {
        console.error("خطأ:", error);
        this.showMessage("حدث خطأ في تحميل البيانات", "error");
      }
    },

    validateAmount() {
      if (!this.amount) {
        this.amountError = "الرجاء إدخال المبلغ";
      } else if (this.isVIP8OrAbove) {
        if (this.amount > this.vipBalance) {
          this.amountError = "المبلغ أكبر من رصيد VIP الخاص بك";
        } else if (this.amount <= 0) {
          this.amountError = "الرجاء إدخال مبلغ أكبر من صفر";
        } else {
          this.amountError = "";
        }
      } else if (Number(this.amount) !== this.minWithdrawAmount) {
        this.amountError = `يجب سحب ${this.minWithdrawAmount} USDT فقط`;
      } else if (this.amount > this.vipBalance) {
        this.amountError = "رصيد VIP غير كافٍ للسحب";
      } else {
        this.amountError = "";
      }
    },

    validateNetwork() {
      if (!this.network) {
        this.networkError = "الرجاء اختيار الشبكة";
      } else {
        this.networkError = "";
      }
    },

    validateWallet() {
      if (!this.wallet) {
        this.walletError = "الرجاء إدخال عنوان محفظتك";
      } else if (this.wallet.length < 20) {
        this.walletError = "عنوان المحفظة قصير جداً";
      } else {
        this.walletError = "";
      }
    },

    getNetworkIcon(network) {
      const icons = {
        'TRC20': 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png',
        'ERC20': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        'BEP20': 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        'SOL': 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      };
      return icons[network] || '';
    },

    getNetworkLabel(network) {
      const labels = {
        'TRC20': 'Tron (TRC20)',
        'ERC20': 'Ethereum (ERC20)',
        'BEP20': 'BNB Chain (BEP20)',
        'SOL': 'Solana (SOL)'
      };
      return labels[network] || '';
    },

    toggleNetworkDropdown() {
      this.showNetworkDropdown = !this.showNetworkDropdown;
    },

    selectNetwork(value) {
      this.network = value;
      this.showNetworkDropdown = false;
      this.validateNetwork();
    },

    showMessage(msg, type = "info") {
      this.message = msg;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
      }, 5000);
    },

    async submitWithdraw() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      const user = auth.currentUser;
      const withdrawAmount = Number(this.amount);
      const feeAmount = this.fee;
      const netAmountValue = this.netAmount;
      const transactionId = "WITHDRAW_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

      try {
        // التحقق من كلمة المرور
        try {
          await signInWithEmailAndPassword(auth, user.email, this.password);
        } catch (authError) {
          this.showMessage("❌ كلمة المرور غير صحيحة. تحقق من كلمة المرور.", "error");
          this.isLoading = false;
          return;
        }

        // ===================================================
        // ✅ تحسين: استخدام استعلام مع حد أقصى وتاريخ بدلاً من تحميل كل المستندات
        // ===================================================
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const withdrawRequestsRef = collection(db, "withdraw_requests");
        
        // ✅ تحسين: إضافة حد أقصى للاستعلام (limit 1) لأننا نحتاج فقط معرفة وجود طلب واحد
        const q = query(
          withdrawRequestsRef,
          where("userId", "==", user.uid),
          where("createdAt", ">=", twentyFourHoursAgo)
        );

        // ✅ تحسين: استخدام getCountFromServer بدلاً من getDocs لتقليل عدد القراءات
        try {
          const countSnapshot = await getCountFromServer(q);
          if (countSnapshot.data().count > 0) {
            this.showMessage("❌ يمكنك إرسال طلب سحب واحد فقط كل 24 ساعة.", "error");
            this.isLoading = false;
            return;
          }
        } catch (indexError) {
          // ✅ تحسين: إذا لم يكن هناك فهرس، نستخدم الطريقة القديمة مع limit
          console.warn("الفهرس غير موجود، استخدام الطريقة البديلة", indexError);
          
          const fallbackQuery = query(
            withdrawRequestsRef,
            where("userId", "==", user.uid)
          );
          
          const querySnapshot = await getDocs(fallbackQuery);
          
          let hasRecentRequest = false;
          querySnapshot.forEach((doc) => {
            if (!hasRecentRequest) { // ✅ تحسين: نتوقف عند أول طلب حديث
              const data = doc.data();
              if (data.createdAt) {
                let createdAtDate;
                if (data.createdAt.toDate) {
                  createdAtDate = data.createdAt.toDate();
                } else if (data.createdAt instanceof Date) {
                  createdAtDate = data.createdAt;
                } else {
                  createdAtDate = new Date(data.createdAt);
                }
                
                if (createdAtDate >= twentyFourHoursAgo) {
                  hasRecentRequest = true;
                }
              }
            }
          });

          if (hasRecentRequest) {
            this.showMessage("❌ يمكنك إرسال طلب سحب واحد فقط كل 24 ساعة.", "error");
            this.isLoading = false;
            return;
          }
        }

        // ===================================================
        // استخدام مراجع المستندات مسبقاً
        // ===================================================
        const userRef = doc(db, "users", user.uid);
        const withdrawDocRef = doc(collection(db, "withdraw_requests"));
        const transactionDocRef = doc(collection(db, "transactions"));

        await runTransaction(db, async (transaction) => {
          const userSnap = await transaction.get(userRef);

          if (!userSnap.exists()) {
            throw new Error("المستخدم غير موجود");
          }

          const userData = userSnap.data();
          const currentVipBalance = userData.vipBalance || 0;
          
          if (currentVipBalance < withdrawAmount) {
            throw new Error("رصيد VIP غير كافٍ للسحب");
          }

          if (userData.blocked) {
            throw new Error("حسابك محظور من السحب");
          }

          // 1. تحديث vipBalance - خصم المبلغ المطلوب فقط
          transaction.update(userRef, {
            vipBalance: currentVipBalance - withdrawAmount
          });

          // 2. إنشاء طلب السحب مع تفاصيل الرسوم
          transaction.set(withdrawDocRef, {
            transactionId: transactionId,
            userId: user.uid,
            userPhone: this.userPhone || null,
            userEmail: this.userEmail || null,
            amount: withdrawAmount,
            fee: feeAmount,
            netAmount: netAmountValue,
            feePercentage: this.feePercentage,
            totalDeduct: withdrawAmount,
            network: this.network,
            wallet: this.wallet,
            walletAddress: this.wallet,
            status: "pending",
            createdAt: serverTimestamp(),
            vipLevel: this.userVipLevel,
            withdrawDay: this.isVIP8OrAbove ? "أي يوم" : this.withdrawDay,
            adminAction: "",
            adminMessage: "",
            userMessage: "",
            reason: "",
            isVIP8OrAbove: this.isVIP8OrAbove,
            withdrawFrom: "vipBalance"
          });

          // 3. إنشاء سجل المعاملة مع تفاصيل الرسوم
          transaction.set(transactionDocRef, {
            transactionId: transactionId,
            userId: user.uid,
            userPhone: this.userPhone || null,
            userEmail: this.userEmail || null,
            type: "withdraw",
            amount: withdrawAmount,
            fee: feeAmount,
            netAmount: netAmountValue,
            feePercentage: this.feePercentage,
            totalDeduct: withdrawAmount,
            currency: "USDT",
            network: this.network,
            wallet: this.wallet,
            walletAddress: this.wallet,
            status: "pending",
            vipLevel: this.userVipLevel,
            withdrawDay: this.isVIP8OrAbove ? "أي يوم" : this.withdrawDay,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isVIP8OrAbove: this.isVIP8OrAbove,
            withdrawFrom: "vipBalance"
          });
        });

        this.vipBalance -= withdrawAmount;
        
        // ✅ تحسين: تحديث الذاكرة المؤقتة بعد السحب
        if (this.cacheKey) {
          const cachedData = getCachedData(this.cacheKey) || {};
          cachedData.vipBalance = this.vipBalance;
          setCachedData(this.cacheKey, cachedData);
        }
        
        this.showMessage(`✅ تم إرسال طلب السحب بنجاح. المبلغ الصافي بعد الرسوم: ${netAmountValue.toFixed(2)} USDT`, "success");
        
        // تفريغ الحقول
        this.amount = "";
        this.network = "";
        this.wallet = "";
        this.password = "";

      } catch (error) {
        console.error("خطأ:", error);
        this.showMessage(error.message || "حدث خطأ أثناء السحب", "error");
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.withdraw-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  padding-bottom: 100px;
  direction: rtl;
}

.card {
  background: linear-gradient(135deg, #1e2329 0%, #181a20 100%);
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 100%;
}

.card-header {
  margin-bottom: 28px;
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: 800;
  color: #eaecef;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-glow {
  color: #fcd535;
  font-size: 20px;
  background: rgba(212, 175, 55, 0.15);
  padding: 4px 12px;
  border-radius: 8px;
}

.sub {
  color: #848e9c;
  font-size: 14px;
  margin: 0;
}

/* صندوق الرصيد */
.balance-box {
  background: rgba(212, 175, 55, 0.08);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.08);
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance-label {
  font-size: 12px;
  color: #848e9c;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.balance-usdt-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
  border-radius: 50%;
}

.balance-amount {
  font-size: 24px;
  font-weight: 900;
  color: #fcd535;
  font-family: 'Courier New', monospace;
  letter-spacing: -0.5px;
}

.balance-currency-badge {
  font-size: 11px;
  color: #fcd535;
  font-weight: 700;
  background: rgba(212, 175, 55, 0.15);
  padding: 4px 8px;
  border-radius: 6px;
}

/* حالة VIP */
.vip-status-box {
  background: rgba(212, 175, 55, 0.08);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vip-status-box.error {
  background: rgba(220, 38, 38, 0.08);
  border-color: rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

.vip-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #fcd535;
  font-size: 14px;
}

.user-contact {
  font-size: 13px;
  color: #eaecef;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-contact i {
  color: #fcd535;
}

.withdraw-condition {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #eaecef;
}

.withdraw-condition i {
  color: #dc2626;
  font-size: 14px;
}

.withdraw-condition i.condition-met {
  color: #10b981;
}

.vip-special-badge {
  background: linear-gradient(135deg, #fcd53520, #d4af3720);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  color: #fcd535;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

/* رسائل */
.message {
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
}

.message.error {
  background: rgba(220, 38, 38, 0.15);
  color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.message.success {
  background: rgba(16, 185, 129, 0.15);
  color: #86efac;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* مجموعات الإدخال */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #eaecef;
  margin-bottom: 8px;
}

.input-group label i {
  color: #fcd535;
}

.amount-input-wrapper, .wallet-input-wrapper, .password-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 12px;
  padding: 4px 8px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.gold-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #eaecef;
  padding: 10px 8px;
  font-size: 14px;
  outline: none;
  font-weight: 600;
}

.input-currency-badge {
  color: #fcd535;
  font-weight: 700;
  font-size: 10px;
  background: rgba(212, 175, 55, 0.1);
  padding: 4px 6px;
  border-radius: 5px;
}

.input-error {
  display: block;
  color: #fca5a5;
  font-size: 12px;
  margin-top: 6px;
}

/* فاصل بين الأقسام */
.fields-separator {
  height: 1px;
  background: transparent;
  margin: 5px 0;
}

/* أقسام معزولة */
.isolated-section {
  position: relative;
}

.wallet-section,
.password-section {
  position: relative;
  z-index: 1;
}

/* زر إظهار/إخفاء كلمة المرور */
.toggle-password-btn {
  background: transparent;
  border: none;
  color: #848e9c;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  transition: color 0.3s ease;
}

.toggle-password-btn:hover {
  color: #fcd535;
}

/* قائمة مخصصة للشبكات */
.custom-dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
}

.selected-network {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #eaecef;
  font-weight: 600;
  font-size: 14px;
}

.dropdown-icon {
  width: 24px;
  height: 24px;
}

.placeholder {
  color: #5a6370;
  font-size: 14px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #1e2329;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(212, 175, 55, 0.08);
}

.dropdown-item.active {
  background: rgba(212, 175, 55, 0.15);
}

.dropdown-item-icon {
  width: 28px;
  height: 28px;
}

.dropdown-item-content {
  flex: 1;
}

.dropdown-item-name {
  color: #eaecef;
  font-weight: 600;
  font-size: 13px;
}

.dropdown-item-symbol {
  color: #848e9c;
  font-size: 11px;
}

/* صندوق الملخص */
.summary-box {
  background: rgba(212, 175, 55, 0.08);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 20px;
}

.summary-box h3 {
  font-size: 14px;
  font-weight: 700;
  color: #fcd535;
  margin: 0 0 12px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
  color: #eaecef;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.summary-item.total {
  font-weight: 700;
  color: #fcd535;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.summary-value {
  color: #fcd535;
  font-weight: 600;
}

.summary-value.fee {
  color: #fca5a5;
}

.summary-value.net {
  color: #86efac;
}

/* صندوق التحذير */
.warning-box {
  background: rgba(217, 119, 6, 0.1);
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(217, 119, 6, 0.2);
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.warning-box i {
  color: #d97706;
}

.warning-text p {
  margin: 0;
  font-size: 12px;
  color: #eaecef;
}

.warning-text p.small {
  color: #848e9c;
  font-size: 11px;
}

/* الزر */
.gold-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #fcd535 0%, #d4af37 100%);
  color: #0f1419;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.gold-button:disabled {
  opacity: 0.5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
