<template>
  <div class="recharge-page">
    <!-- الرأس -->
    <div class="page-header">
      <button class="back-btn" @click="$router.push('/home')">
        <i class="fas fa-arrow-right"></i>
      </button>
      <h1 class="page-title">إيداع</h1>
      <div class="header-placeholder"></div>
    </div>

    <!-- الرصيد -->
    <div class="balance-card">
      <div class="balance-label">الرصيد المتاح</div>
      <div class="balance-amount">
        <span class="balance-number">{{ formatNumber(balance) }}</span>
        <span class="balance-currency">USDT</span>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري التحميل...</p>
    </div>

    <div v-else>
      <!-- نموذج الإيداع -->
      <div class="deposit-form">
        <h2 class="section-title">إيداع الأموال</h2>

        <!-- اختيار الشبكة -->
        <div class="form-group">
          <label class="form-label">اختر الشبكة</label>
          <div class="network-selector">
            <button
              v-for="network in networks"
              :key="network.id"
              class="network-btn"
              :class="{ active: selectedNetwork === network.id }"
              @click="selectNetwork(network.id)"
            >
              <img :src="network.icon" :alt="network.name" class="network-icon" />
              <span class="network-name">{{ network.name }}</span>
            </button>
          </div>
        </div>

        <!-- مبلغ الإيداع -->
        <div class="form-group">
          <label class="form-label">المبلغ</label>
          <div class="amount-input-wrapper">
            <input
              type="number"
              v-model="amount"
              placeholder="0.00"
              class="amount-input"
              min="0.01"
              step="0.01"
            />
            <span class="currency-label">USDT</span>
          </div>
          <div class="amount-hint">
            الحد الأدنى: <strong>{{ minDeposit }} USDT</strong>
          </div>
        </div>

        <!-- معلومات الإيداع -->
        <div v-if="selectedNetwork" class="deposit-info">
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">الشبكة</span>
              <span class="info-value">{{ getNetworkName(selectedNetwork) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">العنوان</span>
              <div class="address-wrapper">
                <span class="address-value">{{ walletAddress }}</span>
                <button class="copy-btn" @click="copyAddress">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- QR Code - استخدام الصور من مجلد public -->
          <div class="qr-card">
            <div class="qr-wrapper">
              <img 
                :src="getQrImage(selectedNetwork)" 
                :alt="selectedNetwork"
                class="qr-code-image"
                @error="handleQrError"
              />
            </div>
            <p class="qr-hint">امسح الرمز للإيداع</p>
          </div>

          <!-- رسالة التحذير -->
          <div class="warning-box">
            <i class="fas fa-exclamation-triangle"></i>
            <span>تأكد من اختيار الشبكة الصحيحة قبل الإيداع</span>
          </div>
        </div>

        <!-- زر الإيداع -->
        <button
          class="deposit-btn"
          @click="submitDeposit"
          :disabled="!canSubmit || loadingSubmit"
        >
          <span v-if="!loadingSubmit">إرسال طلب الإيداع</span>
          <span v-else class="btn-loader"></span>
        </button>
      </div>

      <!-- سجل المعاملات -->
      <div class="transactions-section">
        <div class="section-header">
          <h2 class="section-title">سجل المعاملات</h2>
          <button class="refresh-btn" @click="loadTransactions" :disabled="loadingTx">
            <i :class="loadingTx ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
          </button>
        </div>

        <div v-if="loadingTx" class="loading-state small">
          <div class="spinner small"></div>
        </div>

        <div v-else-if="transactions.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>لا توجد معاملات</p>
        </div>

        <div v-else class="transactions-list">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="transaction-item"
          >
            <div class="tx-icon" :class="getTxIconClass(tx.status)">
              <i :class="getTxIcon(tx.status)"></i>
            </div>
            <div class="tx-info">
              <div class="tx-amount">{{ formatNumber(tx.amount) }} USDT</div>
              <div class="tx-details">
                <span class="tx-network">{{ tx.network || '—' }}</span>
                <span class="tx-status" :class="getStatusClass(tx.status)">
                  {{ getStatusText(tx.status) }}
                </span>
              </div>
              <div class="tx-date">{{ formatDate(tx.createdAt) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import { doc, getDoc, addDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "RechargePage",
  data() {
    return {
      balance: 0,
      loading: true,
      loadingTx: false,
      loadingSubmit: false,
      amount: "",
      selectedNetwork: "trc20",
      walletAddress: "",
      userId: null,
      userEmail: "",
      userPhone: "",
      transactions: [],
      minDeposit: 12,

      networks: [
        { id: "trc20", name: "TRC20 (USDT)", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIgZmlsbD0iIzhCOEE4QiIvPjwvc3ZnPg==" },
        { id: "bep20", name: "BEP20 (USDT)", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIgZmlsbD0iIzhCOEE4QiIvPjwvc3ZnPg==" },
        { id: "erc20", name: "ERC20 (USDT)", icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIgZmlsbD0iIzhCOEE4QiIvPjwvc3ZnPg==" }
      ],

      addresses: {
        trc20: "TXYZ...TRC20",
        bep20: "BXYZ...BEP20",
        erc20: "EXYZ...ERC20"
      }
    };
  },

  computed: {
    canSubmit() {
      return this.selectedNetwork && 
             this.amount && 
             parseFloat(this.amount) >= this.minDeposit &&
             this.walletAddress;
    }
  },

  created() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.$router.push("/login");
        return;
      }
      this.userId = user.uid;
      this.userEmail = user.email || "";
      await this.loadUserData();
      await this.loadTransactions();
      this.loading = false;
    });
  },

  methods: {
    formatNumber(num) {
      const value = Number(num);
      if (isNaN(value)) return "0.00";
      return value.toFixed(2);
    },

    formatDate(timestamp) {
      if (!timestamp) return "—";
      try {
        if (timestamp.toMillis) timestamp = timestamp.toMillis();
        return new Date(timestamp).toLocaleString("ar-EG");
      } catch {
        return "—";
      }
    },

    // دالة للحصول على صورة QR من مجلد public
    getQrImage(network) {
      // استخدام الصور من مجلد /public/qr/
      return `/qr/${network}.png`;
    },

    // معالجة خطأ تحميل الصورة
    handleQrError(event) {
      // إذا فشل تحميل الصورة، نستخدم صورة افتراضية
      event.target.src = '/qr/default.png';
    },

    async loadUserData() {
      try {
        if (!this.userId) return;
        const userRef = doc(db, "users", this.userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          // رصيد واحد فقط
          this.balance = Number(data.balance ?? 0);
          this.userPhone = data.phoneNumber || "";
          
          // الحصول على عنوان المحفظة بناءً على الشبكة المختارة
          this.updateWalletAddress();
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    },

    updateWalletAddress() {
      // في الإنتاج، يجب جلب العنوان من Firestore بناءً على الشبكة
      const addresses = {
        trc20: "TXYZ...TRC20",
        bep20: "BXYZ...BEP20",
        erc20: "EXYZ...ERC20"
      };
      this.walletAddress = addresses[this.selectedNetwork] || "";
    },

    selectNetwork(networkId) {
      this.selectedNetwork = networkId;
      this.updateWalletAddress();
    },

    getNetworkName(networkId) {
      const network = this.networks.find(n => n.id === networkId);
      return network ? network.name : networkId;
    },

    async copyAddress() {
      if (!this.walletAddress) return;
      try {
        await navigator.clipboard.writeText(this.walletAddress);
        alert("تم نسخ العنوان بنجاح");
      } catch {
        alert("فشل النسخ، يرجى النسخ يدويًا");
      }
    },

    async submitDeposit() {
      if (!this.canSubmit) return;

      this.loadingSubmit = true;

      try {
        const depositData = {
          userId: this.userId,
          userEmail: this.userEmail,
          userPhone: this.userPhone,
          amount: parseFloat(this.amount),
          network: this.selectedNetwork,
          walletAddress: this.walletAddress,
          status: "pending",
          type: "recharge",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        // إضافة طلب الإيداع
        await addDoc(collection(db, "payments"), depositData);

        // إضافة إلى سجل التعبئة
        await addDoc(collection(db, "recharge_logs"), {
          userId: this.userId,
          userEmail: this.userEmail,
          userPhone: this.userPhone,
          amount: parseFloat(this.amount),
          network: this.selectedNetwork,
          status: "pending",
          createdAt: serverTimestamp()
        });

        // إضافة إشعار للمستخدم
        await addDoc(collection(db, "users", this.userId, "notifications"), {
          title: "طلب إيداع جديد",
          message: `تم إرسال طلب إيداع بقيمة ${this.amount} USDT عبر شبكة ${this.getNetworkName(this.selectedNetwork)}. سيتم مراجعة الطلب من قبل الإدارة.`,
          read: false,
          createdAt: serverTimestamp()
        });

        alert("✅ تم إرسال طلب الإيداع بنجاح، سيتم مراجعته من قبل الإدارة");
        this.amount = "";
        await this.loadTransactions();

      } catch (error) {
        console.error("Error submitting deposit:", error);
        alert("❌ حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى");
      } finally {
        this.loadingSubmit = false;
      }
    },

    async loadTransactions() {
      if (!this.userId) return;
      
      this.loadingTx = true;
      try {
        // جلب طلبات الإيداع من payments
        const paymentsQuery = query(
          collection(db, "payments"),
          where("userId", "==", this.userId),
          orderBy("createdAt", "desc")
        );
        const paymentsSnap = await getDocs(paymentsQuery);
        
        const txList = [];
        paymentsSnap.forEach(doc => {
          const data = doc.data();
          txList.push({
            id: doc.id,
            amount: data.amount || 0,
            network: data.network || "",
            status: data.status || "pending",
            createdAt: data.createdAt,
            type: "deposit"
          });
        });

        // جلب سجل التعبئة أيضاً
        const logsQuery = query(
          collection(db, "recharge_logs"),
          where("userId", "==", this.userId),
          orderBy("createdAt", "desc")
        );
        const logsSnap = await getDocs(logsQuery);
        
        logsSnap.forEach(doc => {
          const data = doc.data();
          // تجنب التكرار
          if (!txList.some(tx => tx.id === doc.id && tx.type === "deposit")) {
            txList.push({
              id: doc.id,
              amount: data.amount || 0,
              network: data.network || "",
              status: data.status || "pending",
              createdAt: data.createdAt,
              type: "deposit"
            });
          }
        });

        // ترتيب حسب التاريخ
        txList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        this.transactions = txList;

      } catch (error) {
        console.error("Error loading transactions:", error);
        this.transactions = [];
      } finally {
        this.loadingTx = false;
      }
    },

    getTxIcon(status) {
      switch(status) {
        case "approved": return "fas fa-check-circle";
        case "rejected": return "fas fa-times-circle";
        default: return "fas fa-clock";
      }
    },

    getTxIconClass(status) {
      switch(status) {
        case "approved": return "tx-icon-approved";
        case "rejected": return "tx-icon-rejected";
        default: return "tx-icon-pending";
      }
    },

    getStatusClass(status) {
      switch(status) {
        case "approved": return "status-approved";
        case "rejected": return "status-rejected";
        default: return "status-pending";
      }
    },

    getStatusText(status) {
      switch(status) {
        case "approved": return "موافق";
        case "rejected": return "مرفوض";
        default: return "قيد المراجعة";
      }
    }
  }
};
</script>

<style scoped>
.recharge-page {
  min-height: 100vh;
  background: #f5f6f8;
  color: #1a1a2e;
  padding: 16px;
  padding-bottom: 100px;
  direction: rtl;
  font-family: 'Cairo', 'Montserrat', sans-serif;
}

/* ===== الرأس ===== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-btn {
  background: none;
  border: none;
  color: #1a1a2e;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s;
}

.back-btn:hover {
  background: rgba(0,0,0,0.05);
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.header-placeholder {
  width: 40px;
}

/* ===== بطاقة الرصيد ===== */
.balance-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #e5e7eb;
}

.balance-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.balance-number {
  font-size: 36px;
  font-weight: 800;
  color: #1a1a2e;
}

.balance-currency {
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

/* ===== حالة التحميل ===== */
.loading-state {
  text-align: center;
  padding: 40px 0;
}

.loading-state.small {
  padding: 20px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #1a1a2e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

.spinner.small {
  width: 24px;
  height: 24px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #6b7280;
  font-size: 14px;
}

/* ===== نموذج الإيداع ===== */
.deposit-form {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 16px 0;
}

.form-group {
  margin-bottom: 18px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

/* ===== اختيار الشبكة ===== */
.network-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.network-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.network-btn:hover {
  border-color: #9ca3af;
}

.network-btn.active {
  border-color: #1a1a2e;
  background: #f8f9fa;
}

.network-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.network-name {
  font-size: 11px;
  font-weight: 600;
  color: #1a1a2e;
}

/* ===== حقل المبلغ ===== */
.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.amount-input {
  width: 100%;
  padding: 14px 16px;
  padding-left: 70px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #f8f9fa;
  color: #1a1a2e;
  font-size: 18px;
  font-weight: 600;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.amount-input:focus {
  border-color: #1a1a2e;
  background: #ffffff;
}

.amount-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.currency-label {
  position: absolute;
  left: 14px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.amount-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

.amount-hint strong {
  color: #1a1a2e;
}

/* ===== معلومات الإيداع ===== */
.deposit-info {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.info-row:first-child {
  border-bottom: 1px solid #e5e7eb;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
}

.info-value {
  font-size: 13px;
  color: #1a1a2e;
  font-weight: 500;
}

.address-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.address-value {
  font-size: 13px;
  color: #1a1a2e;
  font-weight: 500;
  font-family: 'Courier New', monospace;
}

.copy-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #e5e7eb;
  color: #1a1a2e;
}

/* ===== QR Code ===== */
.qr-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.qr-wrapper {
  display: inline-block;
  background: #ffffff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.qr-code-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  display: block;
}

.qr-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
}

/* ===== رسالة التحذير ===== */
.warning-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  color: #92400e;
  font-size: 12px;
}

.warning-box i {
  color: #fbbf24;
  font-size: 16px;
}

/* ===== زر الإيداع ===== */
.deposit-btn {
  width: 100%;
  padding: 14px;
  background: #1a1a2e;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  margin-top: 18px;
}

.deposit-btn:hover:not(:disabled) {
  background: #2a2a4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(26, 26, 46, 0.15);
}

.deposit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

/* ===== سجل المعاملات ===== */
.transactions-section {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin: 0;
}

.refresh-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  font-size: 16px;
}

.refresh-btn:hover:not(:disabled) {
  background: #f0f2f5;
  color: #1a1a2e;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== قائمة المعاملات ===== */
.empty-state {
  text-align: center;
  padding: 30px 0;
  color: #6b7280;
}

.empty-state i {
  font-size: 32px;
  color: #d1d5db;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.transaction-item:hover {
  border-color: #d1d5db;
}

.tx-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.tx-icon-approved {
  background: #e8f5e9;
  color: #2e7d32;
}

.tx-icon-rejected {
  background: #fce4ec;
  color: #c62828;
}

.tx-icon-pending {
  background: #fff3e0;
  color: #e65100;
}

.tx-info {
  flex: 1;
  min-width: 0;
}

.tx-amount {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}

.tx-details {
  display: flex;
  gap: 10px;
  margin-top: 2px;
  flex-wrap: wrap;
}

.tx-network {
  font-size: 12px;
  color: #6b7280;
}

.tx-status {
  font-size: 12px;
  font-weight: 600;
}

.status-approved {
  color: #2e7d32;
}

.status-rejected {
  color: #c62828;
}

.status-pending {
  color: #e65100;
}

.tx-date {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 2px;
}

/* ===== تحسينات الجوال ===== */
@media (max-width: 480px) {
  .recharge-page {
    padding: 12px;
    padding-bottom: 90px;
  }

  .balance-number {
    font-size: 30px;
  }

  .network-selector {
    grid-template-columns: repeat(3, 1fr);
  }

  .network-btn {
    padding: 10px 6px;
  }

  .network-name {
    font-size: 10px;
  }

  .network-icon {
    width: 28px;
    height: 28px;
  }

  .amount-input {
    font-size: 16px;
    padding: 12px 14px;
    padding-left: 60px;
  }

  .deposit-form,
  .transactions-section {
    padding: 16px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .address-wrapper {
    width: 100%;
  }

  .address-value {
    font-size: 12px;
    word-break: break-all;
  }

  .qr-code-image {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 360px) {
  .network-selector {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .network-btn {
    padding: 8px 4px;
  }

  .network-name {
    font-size: 9px;
  }

  .balance-number {
    font-size: 26px;
  }

  .qr-code-image {
    width: 120px;
    height: 120px;
  }
}
</style>
