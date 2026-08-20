<template>
  <div class="withdraw-page">
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <i class="fas fa-hand-holding-usd"></i>
          سحب الأرباح
        </h2>
        <p class="sub">قم بإدخال معلومات السحب الخاصة بك</p>
      </div>

      <!-- رصيد المستخدم -->
      <div class="balance-box">
        <div class="balance-info">
          <span class="balance-label">رصيدك الحالي</span>
          <div class="balance-display">
            <img src="https://assets.coingecko.com/coins/images/325/large/tether.png" alt="USDT" class="balance-usdt-icon">
            <span class="balance-amount">{{ balance.toFixed(2) }}</span>
            <span class="balance-currency-badge">USDT</span>
          </div>
        </div>
        
        <!-- تفاصيل الرصيد المحجوز والمتاح -->
        <div v-if="vipLockedAmount > 0" class="balance-details">
          <div class="balance-detail-item">
            <span class="detail-label">المبلغ المحجوز للـVIP:</span>
            <span class="detail-value locked">{{ vipLockedAmount.toFixed(2) }} USDT</span>
          </div>
          <div class="balance-detail-item">
            <span class="detail-label">المبلغ المتاح للسحب:</span>
            <span class="detail-value available">{{ availableBalance.toFixed(2) }} USDT</span>
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
          <i class="fas fa-check-circle condition-met"></i>
          <span>السحب: <strong>أي يوم بدون حد أدنى</strong></span>
        </div>
        <div class="withdraw-condition">
          <i class="fas fa-info-circle"></i>
          <span>يمكنك السحب مرة واحدة كل 24 ساعة</span>
        </div>
        <div v-if="vipLockedAmount > 0" class="withdraw-condition locked-info">
          <i class="fas fa-lock"></i>
          <span>المبلغ المحجوز للـVIP: <strong>{{ vipLockedAmount.toFixed(2) }} USDT</strong> (غير قابل للسحب)</span>
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
            class="input-field"
            @input="validateAmount"
            autocomplete="off"
            name="amount_field_x"
          />
          <span class="input-currency-badge">USDT</span>
        </div>
        <span v-if="amountError" class="input-error">{{ amountError }}</span>
        <span v-if="vipLockedAmount > 0 && amount" class="input-hint">
          <i class="fas fa-info-circle"></i>
          المتاح للسحب: {{ availableBalance.toFixed(2) }} USDT
        </span>
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

      <!-- عنوان المحفظة -->
      <div class="input-group">
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
            class="input-field"
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

      <!-- كلمة المرور -->
      <div class="input-group">
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
            class="input-field"
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
          <span>المبلغ المتاح للسحب:</span>
          <span class="summary-value">{{ availableBalance.toFixed(2) }} USDT</span>
        </div>
        
        <div class="summary-item">
          <span>الشبكة:</span>
          <span class="summary-value">{{ network }}</span>
        </div>
        
        <div class="summary-item">
          <span>عنوان المحفظة:</span>
          <span class="summary-value address">{{ wallet.substring(0, 10) }}...{{ wallet.substring(wallet.length - 10) }}</span>
        </div>
        
        <div class="summary-item total">
          <span>سيتم خصم من الرصيد:</span>
          <span class="summary-value">{{ Number(amount).toFixed(2) }} USDT</span>
        </div>
        
        <div class="summary-item">
          <span>الرصيد بعد السحب:</span>
          <span class="summary-value">{{ (balance - Number(amount)).toFixed(2) }} USDT</span>
        </div>
      </div>

      <!-- تحذيرات -->
      <div class="warning-box">
        <i class="fas fa-shield-alt"></i>
        <div class="warning-text">
          <p>يرجى التأكد من صحة المعلومات قبل الإرسال</p>
          <p class="small">سيتم خصم {{ Number(amount) || 0 }} USDT من رصيدك. بعد موافقة الإدارة سيتم صرف المبلغ</p>
        </div>
      </div>

      <!-- زر السحب -->
      <button 
        class="withdraw-button" 
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

const dataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

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
      balance: 0,
      vipLockedAmount: 0,
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
      showNetworkDropdown: false,
      networks: [
        { value: 'TRC20', label: 'Tron (TRC20)' },
        { value: 'ERC20', label: 'Ethereum (ERC20)' },
        { value: 'BEP20', label: 'BNB Chain (BEP20)' },
        { value: 'SOL', label: 'Solana (SOL)' }
      ],
      
      amountError: "",
      networkError: "",
      walletError: "",
      
      dataLoaded: false,
      cacheKey: ''
    };
  },

  computed: {
    availableBalance() {
      return Math.max(0, this.balance - this.vipLockedAmount);
    },

    isFormValid() {
      return (
        this.amount && 
        !this.amountError &&
        this.network && 
        !this.networkError &&
        this.wallet && 
        !this.walletError &&
        this.password &&
        this.userVipLevel &&
        this.balance >= Number(this.amount) &&
        Number(this.amount) > 0 &&
        Number(this.amount) <= this.availableBalance
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
    }
  },

  async created() {
    const user = auth.currentUser;
    if (user) {
      this.cacheKey = `user_data_${user.uid}`;
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
          });
        }, 100);
      });
    },

    applyUserData(userData) {
      this.balance = userData.balance || 0;
      this.vipLockedAmount = userData.vipLockedAmount || 0;
      this.userPhone = userData.phoneNumber || "";
      this.userEmail = userData.email || "";
      this.userVipLevel = userData.vipLevel || null;
      this.dataLoaded = true;
    },

    async loadUserData() {
      const user = auth.currentUser;
      if (!user) {
        this.$router.push("/login");
        return;
      }

      try {
        const cacheKey = this.cacheKey || `user_data_${user.uid}`;
        const cachedData = getCachedData(cacheKey);
        
        if (cachedData) {
          this.applyUserData(cachedData);
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          const cacheData = {
            balance: userData.balance || 0,
            vipLockedAmount: userData.vipLockedAmount || 0,
            phoneNumber: userData.phoneNumber || "",
            email: userData.email || "",
            vipLevel: userData.vipLevel || null
          };

          if (!cacheData.vipLevel) {
            const vipRef = doc(db, "users", user.uid, "vip", "current");
            const vipSnap = await getDoc(vipRef);
            if (vipSnap.exists()) {
              cacheData.vipLevel = vipSnap.data().level;
            }
          }

          setCachedData(cacheKey, cacheData);
          this.applyUserData(cacheData);
          
          if (!this.userVipLevel) {
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
      } else if (this.amount > this.balance) {
        this.amountError = "المبلغ أكبر من رصيدك";
      } else if (this.amount > this.availableBalance) {
        this.amountError = `المبلغ أكبر من الرصيد المتاح للسحب (${this.availableBalance.toFixed(2)} USDT)`;
      } else if (this.amount <= 0) {
        this.amountError = "الرجاء إدخال مبلغ أكبر من صفر";
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
      const transactionId = "WITHDRAW_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);

      try {
        // التحقق من كلمة المرور
        try {
          await signInWithEmailAndPassword(auth, user.email, this.password);
        } catch (authError) {
          this.showMessage("❌ كلمة المرور غير صحيحة", "error");
          this.isLoading = false;
          return;
        }

        // التحقق من وجود طلب سحب خلال 24 ساعة
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const withdrawRequestsRef = collection(db, "withdraw_requests");
        const q = query(
          withdrawRequestsRef,
          where("userId", "==", user.uid),
          where("createdAt", ">=", twentyFourHoursAgo)
        );

        try {
          const countSnapshot = await getCountFromServer(q);
          if (countSnapshot.data().count > 0) {
            this.showMessage("❌ يمكنك إرسال طلب سحب واحد فقط كل 24 ساعة.", "error");
            this.isLoading = false;
            return;
          }
        } catch (indexError) {
          const fallbackQuery = query(
            withdrawRequestsRef,
            where("userId", "==", user.uid)
          );
          
          const querySnapshot = await getDocs(fallbackQuery);
          let hasRecentRequest = false;
          querySnapshot.forEach((doc) => {
            if (!hasRecentRequest) {
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

        const userRef = doc(db, "users", user.uid);
        const withdrawDocRef = doc(collection(db, "withdraw_requests"));
        const transactionDocRef = doc(collection(db, "transactions"));

        await runTransaction(db, async (transaction) => {
          const userSnap = await transaction.get(userRef);

          if (!userSnap.exists()) {
            throw new Error("المستخدم غير موجود");
          }

          const userData = userSnap.data();
          const currentBalance = userData.balance || 0;
          const currentLockedAmount = userData.vipLockedAmount || 0;
          const currentAvailableBalance = currentBalance - currentLockedAmount;
          
          // التحقق من الرصيد الكافي للسحب
          if (currentBalance < withdrawAmount) {
            throw new Error("رصيد غير كافٍ للسحب");
          }

          // التحقق من أن المبلغ المطلوب لا يتجاوز الرصيد المتاح
          if (withdrawAmount > currentAvailableBalance) {
            throw new Error(`المبلغ المطلوب (${withdrawAmount.toFixed(2)} USDT) يتجاوز الرصيد المتاح للسحب (${currentAvailableBalance.toFixed(2)} USDT)`);
          }

          if (userData.blocked) {
            throw new Error("حسابك محظور من السحب");
          }

          // خصم المبلغ من الرصيد
          transaction.update(userRef, {
            balance: currentBalance - withdrawAmount
          });

          // إنشاء طلب السحب
          transaction.set(withdrawDocRef, {
            transactionId: transactionId,
            userId: user.uid,
            userPhone: this.userPhone || null,
            userEmail: this.userEmail || null,
            amount: withdrawAmount,
            network: this.network,
            wallet: this.wallet,
            walletAddress: this.wallet,
            status: "pending",
            createdAt: serverTimestamp(),
            vipLevel: this.userVipLevel,
            adminAction: "",
            adminMessage: "",
            userMessage: "",
            reason: "",
            withdrawFrom: "balance",
            lockedAmountAtWithdraw: currentLockedAmount,
            availableBalanceAtWithdraw: currentAvailableBalance
          });

          // إنشاء سجل المعاملة
          transaction.set(transactionDocRef, {
            transactionId: transactionId,
            userId: user.uid,
            userPhone: this.userPhone || null,
            userEmail: this.userEmail || null,
            type: "withdraw",
            amount: withdrawAmount,
            currency: "USDT",
            network: this.network,
            wallet: this.wallet,
            walletAddress: this.wallet,
            status: "pending",
            vipLevel: this.userVipLevel,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            withdrawFrom: "balance",
            lockedAmountAtWithdraw: currentLockedAmount,
            availableBalanceAtWithdraw: currentAvailableBalance
          });
        });

        this.balance -= withdrawAmount;
        
        if (this.cacheKey) {
          const cachedData = getCachedData(this.cacheKey) || {};
          cachedData.balance = this.balance;
          setCachedData(this.cacheKey, cachedData);
        }
        
        this.showMessage(`✅ تم إرسال طلب السحب بنجاح. سيتم مراجعته من قبل الإدارة`, "success");
        
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
  background: #f5f6f8;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 100px;
  direction: rtl;
}

.card {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  max-width: 500px;
  width: 100%;
}

.card-header {
  margin-bottom: 28px;
  text-align: center;
}

.title {
  font-size: 26px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.sub {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* صندوق الرصيد */
.balance-box {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance-label {
  font-size: 12px;
  color: #6b7280;
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
  color: #1a1a2e;
  font-family: 'Courier New', monospace;
  letter-spacing: -0.5px;
}

.balance-currency-badge {
  font-size: 11px;
  color: #6b7280;
  font-weight: 700;
  background: #f0f2f5;
  padding: 4px 8px;
  border-radius: 6px;
}

/* تفاصيل الرصيد */
.balance-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.balance-detail-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}

.detail-label {
  color: #6b7280;
}

.detail-value {
  font-weight: 600;
}

.detail-value.locked {
  color: #f59e0b;
}

.detail-value.available {
  color: #22c55e;
}

/* حالة VIP */
.vip-status-box {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vip-status-box.error {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.vip-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #1a1a2e;
  font-size: 14px;
}

.user-contact {
  font-size: 13px;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-contact i {
  color: #6b7280;
}

.withdraw-condition {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
}

.withdraw-condition i.condition-met {
  color: #22c55e;
}

.withdraw-condition i {
  color: #6b7280;
}

.withdraw-condition.locked-info {
  background: #fef3c7;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #fde68a;
}

.withdraw-condition.locked-info i {
  color: #f59e0b;
}

.withdraw-condition.locked-info strong {
  color: #1a1a2e;
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
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message.success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
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
  color: #1a1a2e;
  margin-bottom: 8px;
}

.input-group label i {
  color: #6b7280;
}

.amount-input-wrapper, .wallet-input-wrapper, .password-input-wrapper {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  transition: border-color 0.3s ease;
}

.amount-input-wrapper:focus-within,
.wallet-input-wrapper:focus-within,
.password-input-wrapper:focus-within {
  border-color: #1a1a2e;
  box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.08);
}

.input-field {
  flex: 1;
  background: transparent;
  border: none;
  color: #1a1a2e;
  padding: 10px 8px;
  font-size: 14px;
  outline: none;
  font-weight: 600;
  font-family: inherit;
}

.input-field::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.input-currency-badge {
  color: #6b7280;
  font-weight: 700;
  font-size: 10px;
  background: #f0f2f5;
  padding: 4px 6px;
  border-radius: 5px;
}

.input-error {
  display: block;
  color: #dc2626;
  font-size: 12px;
  margin-top: 6px;
}

.input-hint {
  display: block;
  color: #6b7280;
  font-size: 12px;
  margin-top: 6px;
}

.input-hint i {
  color: #1a1a2e;
}

/* زر إظهار/إخفاء كلمة المرور */
.toggle-password-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  transition: color 0.3s ease;
}

.toggle-password-btn:hover {
  color: #1a1a2e;
}

/* قائمة مخصصة للشبكات */
.custom-dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.dropdown-trigger:hover {
  border-color: #9ca3af;
}

.selected-network {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1a1a2e;
  font-weight: 600;
  font-size: 14px;
}

.dropdown-icon {
  width: 24px;
  height: 24px;
}

.placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  z-index: 100;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.active {
  background: #f0f2f5;
}

.dropdown-item-icon {
  width: 28px;
  height: 28px;
}

.dropdown-item-content {
  flex: 1;
}

.dropdown-item-name {
  color: #1a1a2e;
  font-weight: 600;
  font-size: 13px;
}

.dropdown-item-symbol {
  color: #6b7280;
  font-size: 11px;
}

/* صندوق الملخص */
.summary-box {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.summary-box h3 {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.summary-item.total {
  font-weight: 700;
  color: #1a1a2e;
  border-top: 1px solid #d1d5db;
}

.summary-value {
  color: #1a1a2e;
  font-weight: 600;
}

/* صندوق التحذير */
.warning-box {
  background: #fefce8;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #fde68a;
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
  color: #1a1a2e;
}

.warning-text p.small {
  color: #6b7280;
  font-size: 11px;
}

/* الزر */
.withdraw-button {
  width: 100%;
  padding: 14px;
  background: #1a1a2e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.withdraw-button:hover:not(:disabled) {
  background: #2a2a4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(26, 26, 46, 0.15);
}

.withdraw-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* تحسينات الجوال */
@media (max-width: 480px) {
  .withdraw-page {
    padding: 12px;
    padding-top: 40px;
  }
  
  .card {
    padding: 20px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .balance-amount {
    font-size: 20px;
  }
  
  .dropdown-item {
    padding: 10px 12px;
  }
}
</style>
