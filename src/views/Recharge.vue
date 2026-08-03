<template>
  <div class="recharge-page">
    <!-- Header -->
    <div class="top-nav">
      <div class="nav-left" @click="$router.back()">
        <i class="fas fa-arrow-right"></i>
      </div>
      <div class="nav-center">إيداع USDT</div>
      <div class="nav-right" @click="$router.push('/transactions')">
        <i class="fas fa-history"></i>
      </div>
    </div>

    <div class="main-content">
      <!-- Asset Display -->
      <div class="asset-card">
        <div class="asset-main">
          <img src="https://assets.coingecko.com/coins/images/325/large/Tether.png" alt="USDT" class="coin-logo-real">
          <div class="asset-text">
            <span class="coin-symbol">USDT</span>
            <span class="coin-name">TetherUS</span>
          </div>
        </div>
        <div class="balance-info">
          <span class="label">الرصيد الحالي</span>
          <span class="value">{{ userBalance.toFixed(2) }} USDT</span>
          <span class="user-identifier">{{ userIdentifier }}</span>
        </div>
      </div>

      <!-- Network Selector Dropdown -->
      <div class="input-section">
        <label class="section-label">اختر الشبكة</label>
        <div class="dropdown-container" @click="toggleDropdown" v-click-outside="closeDropdown">
          <div class="dropdown-selected" :class="{ 'is-open': isDropdownOpen }">
            <div class="selected-info">
              <img :src="getNetworkIconUrl(network)" class="net-icon-real" alt="">
              <span class="net-name">{{ network }}</span>
            </div>
            <i class="fas fa-chevron-down arrow-icon"></i>
          </div>
          
          <transition name="slide-fade">
            <div v-if="isDropdownOpen" class="dropdown-list">
              <div 
                v-for="(addr, net) in addresses" 
                :key="net" 
                class="dropdown-item"
                :class="{ 'active': network === net }"
                @click.stop="selectNetwork(net)"
              >
                <div class="item-left">
                  <img :src="getNetworkIconUrl(net)" class="net-icon-real" alt="">
                  <div class="item-text">
                    <span class="net-title">{{ net }}</span>
                    <span class="net-desc">{{ getNetworkDesc(net) }}</span>
                  </div>
                </div>
                <i v-if="network === net" class="fas fa-check"></i>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Deposit Details Card -->
      <div class="deposit-card">
        <div class="qr-section">
          <div class="qr-frame">
            <img :src="getQr(network)" :alt="network" class="qr-code">
            <div v-if="loading" class="qr-loader">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
          </div>
          <p class="qr-tip">حفظ رمز QR</p>
        </div>

        <div class="address-section">
          <div class="label-row">
            <span class="addr-label">عنوان الإيداع</span>
            <span class="network-tag">{{ network }}</span>
          </div>
          <div class="address-display">
            <div class="address-text">{{ getAddress(network) }}</div>
            <button class="copy-icon-btn" @click="copyAddress">
              <i :class="copied ? 'fas fa-check' : 'far fa-copy'"></i>
            </button>
          </div>
          <transition name="fade">
            <div v-if="copied" class="copy-toast">تم النسخ بنجاح</div>
          </transition>
        </div>
      </div>

      <!-- Warning Box - مباشرة بعد عنوان الإيداع -->
      <div class="warning-box">
        <div class="warning-icon-circle">
          <span class="warning-icon">⚠️</span>
        </div>
        <div class="warning-content">
          <span class="warning-title">تنبيه مهم</span>
          <p class="warning-description">
            لن يتم إضافة الرصيد تلقائيًا قبل إرسال طلب تأكيد الإيداع يرجى إدخال المبلغ المرسل ثم الضغط على زر "تأكيد الإيداع".
          </p>
        </div>
        <span class="arrow-down">⬇️</span>
      </div>

      <!-- Form Inputs -->
      <div class="form-section">
        <div class="input-group">
          <div class="input-field">
            <input type="number" v-model.number="amount" placeholder="أدخل المبلغ الذي أرسلته إلى حسابك">
            <span class="suffix">USDT</span>
          </div>
        </div>

        <div class="input-group">
          <label>ملاحظة (اختياري)</label>
          <div class="input-field">
            <input type="text" v-model="txid" placeholder="اكتب ملاحظة">
          </div>
        </div>

        <button class="main-btn" @click="submit" :disabled="loading">
          <span v-if="!loading">تأكيد الإيداع</span>
          <i v-else class="fas fa-circle-notch fa-spin"></i>
        </button>

        <transition name="fade">
          <div v-if="message" :class="['alert', messageType]">
            <i :class="messageType === 'error' ? 'fas fa-times-circle' : 'fas fa-check-circle'"></i>
            {{ message }}
          </div>
        </transition>
      </div>

      <!-- Instructions -->
      <div class="tips-box">
        <div class="tips-header">
          <i class="fas fa-lightbulb"></i>
          <span>نصائح هامة</span>
        </div>
        <ul class="tips-list">
          <li>يرجى التأكد من اختيار شبكة <strong>{{ network }}</strong> عند التحويل.</li>
          <li>سيتم إضافة الرصيد بعد مراجعة وموافقة الأدمن على طلبك.</li>
          <li>لا تقم بإيداع أي عملات أخرى غير USDT لهذا العنوان.</li>
          <li>لا يوجد حد أدنى للإيداع - يمكنك إيداع أي مبلغ تريده.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "Recharge",
  directives: {
    'click-outside': {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  },
  data() {
    return {
      network: "TRC20",
      isDropdownOpen: false,
      amount: null,
      txid: "",
      copied: false,
      loading: false,
      message: "",
      messageType: "info",
      addresses: {
        TRC20: "TJKb61v5XW4kTRzRTzDYZm42H1UXQ9BpQy",
        ERC20: "0x5B9Bc2f3cF994a4ffD74F8BbDE9160Eb131f124A",
        BEP20: "0x5B9Bc2f3cF994a4ffD74F8BbDE9160Eb131f124A",
        SOL: "7GfbAVrSfjBGbDSd74aGciVPUNbtuqduhg7NpztkEhw3",
      },
      userEmail: "",
      userId: "",
      userBalance: 0,
      userPhone: "",
    };
  },
  computed: {
    userIdentifier() {
      if (this.userPhone) {
        return this.userPhone;
      } else if (this.userEmail) {
        return this.userEmail;
      }
      return "";
    }
  },
  mounted() {
    this.initializeUser();
  },
  methods: {
    async fetchUserBalance() {
      if (!this.userId) return;
      try {
        const userDoc = await getDoc(doc(db, "users", this.userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          // ✅ قراءة ذكية للرصيد - تدعم النظام القديم والجديد
          let vipBalance = 0;
          let depositBalance = 0;
          
          if (typeof data.vipBalance === 'number') {
            vipBalance = data.vipBalance;
            depositBalance = typeof data.depositBalance === 'number' ? data.depositBalance : 0;
          } else if (typeof data.balance === 'number') {
            vipBalance = data.balance; // 🔥 الرصيد القديم ← vipBalance
            depositBalance = 0;
          }
          
          // عرض مجموع الرصيدين
          this.userBalance = vipBalance + depositBalance;

          // قراءة رقم الهاتف
          if (data.phone) {
            this.userPhone = data.phone;
          }
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    },
    initializeUser() {
      const auth = getAuth();
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.userEmail = user.email;
          this.userId = user.uid;
          await this.fetchUserBalance();
        }
      });
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    selectNetwork(net) {
      this.network = net;
      this.isDropdownOpen = false;
    },
    getQr(net) {
      return `/qr/${net}.png`;
    },
    getAddress(net) {
      return this.addresses[net] || "";
    },
    getNetworkIconUrl(net) {
      const icons = {
        TRC20: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
        ERC20: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        BEP20: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
        SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
      };
      return icons[net] || "";
    },
    getNetworkDesc(net) {
      const descs = {
        TRC20: "Tron Network (TRX)",
        ERC20: "Ethereum Network (ETH)",
        BEP20: "BNB Smart Chain (BSC)",
        SOL: "Solana Network"
      };
      return descs[net] || "";
    },
    handleImageError(e) {
      e.target.style.display = 'none';
    },
    async copyAddress() {
      const text = this.getAddress(this.network);
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        setTimeout(() => (this.copied = false), 2000);
      } catch (err) {
        console.error("Copy failed");
      }
    },
    async submit() {
      if (!this.amount || this.amount <= 0) {
        this.message = "يرجى إدخال مبلغ صحيح";
        this.messageType = "error";
        return;
      }
      this.loading = true;
      try {
        // ✅ فقط إنشاء طلب التعبئة بحالة pending - لا يتم إضافة أي رصيد هنا
        await addDoc(collection(db, "payments"), {
          userId: this.userId,
          email: this.userEmail,
          amount: this.amount,
          txid: this.txid,
          network: this.network,
          status: "pending",
          targetBalance: "depositBalance", // للإشارة إلى أن المبلغ سيضاف إلى depositBalance عند الموافقة
          createdAt: serverTimestamp(),
        });
        
        await addDoc(collection(db, "transactions"), {
          userId: this.userId,
          email: this.userEmail,
          type: "recharge",
          amount: this.amount,
          network: this.network,
          txid: this.txid,
          status: "pending",
          targetBalance: "depositBalance",
          createdAt: serverTimestamp(),
        });
        
        // ✅ تم حذف كود إضافة الرصيد من هنا تماماً
        // ✅ الرصيد يضاف فقط عند موافقة الأدمن في لوحة الإدارة
        
        this.message = "تم إرسال الطلب بنجاح، سيتم مراجعة طلبك من قبل الإدارة";
        this.messageType = "success";
        this.amount = null;
        this.txid = "";
      } catch (e) {
        this.message = "حدث خطأ في الإرسال";
        this.messageType = "error";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.recharge-page {
  min-height: 100vh;
  background: #0b0e11;
  color: #eaecef;
  direction: rtl;
  font-family: 'Cairo', sans-serif;
}

/* Top Nav */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #181a20;
  border-bottom: 1px solid #2b2f36;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-center {
  font-weight: 700;
  font-size: 18px;
}

.nav-left, .nav-right {
  font-size: 20px;
  cursor: pointer;
  color: #848e9c;
}

.main-content {
  max-width: 500px;
  margin: 0 auto;
  padding: 12px 16px;
}

/* Asset Card - مصغر */
.asset-card {
  background: #1e2329;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.asset-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.coin-logo-real {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: contain;
}

.net-icon-real {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: contain;
}

.coin-symbol {
  display: block;
  font-size: 16px;
  font-weight: 700;
}

.coin-name {
  font-size: 11px;
  color: #848e9c;
}

.balance-info {
  text-align: left;
}

.balance-info .label {
  display: block;
  font-size: 11px;
  color: #848e9c;
}

.balance-info .value {
  font-weight: 700;
  color: #fcd535;
  font-size: 14px;
}

.user-identifier {
  display: block;
  font-size: 10px;
  color: #848e9c;
  margin-top: 2px;
  direction: ltr;
  text-align: left;
}

/* Dropdown - مسافات أقل */
.input-section {
  margin-bottom: 10px;
}

.section-label {
  display: block;
  font-size: 13px;
  color: #848e9c;
  margin-bottom: 6px;
}

.dropdown-container {
  position: relative;
  cursor: pointer;
}

.dropdown-selected {
  background: #2b2f36;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #fcd535;
  transition: all 0.2s;
}

.dropdown-selected.is-open {
  border-color: #fcd535;
  box-shadow: 0 0 5px rgba(252, 213, 53, 0.5);
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.net-icon {
  width: 22px;
  height: 22px;
}

.net-name {
  font-weight: 600;
  font-size: 14px;
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #2b2f36;
  border-radius: 10px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #fcd535;
}

.dropdown-item {
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #3b3f46;
}

.dropdown-item.active {
  background: rgba(252, 213, 53, 0.1);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.net-title {
  display: block;
  font-weight: 600;
  font-size: 14px;
}

.net-desc {
  font-size: 10px;
  color: #848e9c;
}

.dropdown-item i {
  color: #fcd535;
}

/* Deposit Card - مصغر */
.deposit-card {
  background: #181a20;
  border-radius: 14px;
  padding: 14px;
  border: 1px solid #2b2f36;
  margin-bottom: 10px;
}

.qr-section {
  text-align: center;
  margin-bottom: 14px;
}

.qr-frame {
  display: inline-block;
  background: #fff;
  padding: 6px;
  border-radius: 10px;
  position: relative;
}

.qr-code {
  width: 100px;
  height: 100px;
  display: block;
}

.qr-tip {
  margin-top: 6px;
  font-size: 11px;
  color: #848e9c;
}

.address-section {
  background: #2b2f36;
  border-radius: 10px;
  padding: 10px 12px;
  position: relative;
  border: 1px solid #fcd535;
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.addr-label {
  font-size: 11px;
  color: #848e9c;
}

.network-tag {
  font-size: 9px;
  background: rgba(252, 213, 53, 0.1);
  color: #fcd535;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.address-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.address-text {
  font-family: monospace;
  font-size: 12px;
  word-break: break-all;
  color: #eaecef;
  line-height: 1.3;
}

.copy-icon-btn {
  background: none;
  border: none;
  color: #fcd535;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.copy-toast {
  position: absolute;
  bottom: -20px;
  right: 12px;
  font-size: 10px;
  color: #0ecb81;
}

/* Warning Box - أعلى الصفحة مباشرة */
.warning-box {
  background: rgba(252, 213, 53, 0.08);
  border: 1px solid rgba(252, 213, 53, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
  backdrop-filter: blur(5px);
}

.warning-icon-circle {
  width: 28px;
  height: 28px;
  min-width: 28px;
  background: rgba(252, 213, 53, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.warning-icon {
  font-size: 14px;
}

.warning-content {
  flex: 1;
  min-width: 0;
}

.warning-title {
  color: #fcd535;
  font-size: 12px;
  font-weight: 700;
  display: block;
  margin-bottom: 2px;
}

.warning-description {
  color: #f6465d;
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
}

.arrow-down {
  font-size: 16px;
  min-width: 18px;
  animation: bounce 2s infinite;
  margin-top: 3px;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

/* Form Section */
.form-section {
  margin-bottom: 16px;
}

.input-group {
  margin-bottom: 8px;
}

.input-group label {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  color: #848e9c;
}

.input-field {
  background: #2b2f36;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #fcd535;
}

.input-field:focus-within {
  border-color: #fcd535;
  box-shadow: 0 0 5px rgba(252, 213, 53, 0.5);
}

.input-field input {
  flex: 1;
  background: none;
  border: none;
  padding: 12px 0;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.suffix {
  color: #848e9c;
  font-weight: 700;
  font-size: 13px;
}

.main-btn {
  width: 100%;
  background: #fcd535;
  color: #0b0e11;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
}

.main-btn:disabled {
  opacity: 0.5;
}

.alert {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert.success { background: rgba(14, 203, 129, 0.1); color: #0ecb81; }
.alert.error { background: rgba(246, 70, 93, 0.1); color: #f6465d; }

/* Tips */
.tips-box {
  background: rgba(252, 213, 53, 0.05);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(252, 213, 53, 0.1);
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fcd535;
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 13px;
}

.tips-list {
  margin: 0;
  padding-right: 18px;
  font-size: 11px;
  color: #848e9c;
  line-height: 1.7;
}

/* Responsive Warning Box */
@media (max-width: 480px) {
  .main-content {
    padding: 10px 12px;
  }
  
  .warning-box {
    padding: 8px;
    gap: 6px;
  }
  
  .warning-icon-circle {
    width: 24px;
    height: 24px;
    min-width: 24px;
  }
  
  .warning-icon {
    font-size: 12px;
  }
  
  .warning-title {
    font-size: 11px;
  }
  
  .warning-description {
    font-size: 10px;
  }
  
  .arrow-down {
    font-size: 14px;
    min-width: 16px;
  }
  
  .qr-code {
    width: 80px;
    height: 80px;
  }
}

/* Animations */
.slide-fade-enter-active { transition: all 0.2s ease-out; }
.slide-fade-enter-from { transform: translateY(-10px); opacity: 0; }

.fade-enter-active { transition: opacity 0.3s; }
.fade-enter-from { opacity: 0; }
</style>
