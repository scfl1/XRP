<template>
  <div class="transactions-page">
    <div class="card">
      <div class="card-header">
        <h2 class="title">
          <i class="fas fa-history"></i>
          سجل المعاملات
          <span class="title-glow">USDT</span>
        </h2>
        <div class="header-glow"></div>
        <p class="sub">جميع عمليات السحب والإيداع الخاصة بك</p>
      </div>

      <div v-if="loading" class="loading-box">
        <i class="fas fa-spinner fa-spin"></i>
        <p>جاري تحميل المعاملات...</p>
      </div>

      <div v-else-if="transactions.length === 0" class="empty-box">
        <i class="fas fa-inbox"></i>
        <p>لا توجد معاملات حتى الآن</p>
        <p class="uid-info">معرف المستخدم: {{ currentUserId }}</p>
      </div>

      <div v-else class="transactions-list">
        <div class="stats-box">
          <div class="stat-item">
            <span class="stat-label">إجمالي المعاملات</span>
            <span class="stat-value">{{ transactions.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">المبلغ الإجمالي</span>
            <span class="stat-value">{{ totalAmount }} USDT</span>
          </div>
        </div>

        <div
          v-for="tx in transactions"
          :key="tx.id"
          class="transaction-card"
          :class="tx.type"
        >
          <!-- حالة الموافقة -->
          <div v-if="tx.adminAction === 'approved'" class="approval-badge">
            <i class="fas fa-check-circle"></i>
            <span>تمت الموافقة</span>
          </div>
          
          <div v-if="tx.adminAction === 'rejected'" class="rejection-badge">
            <i class="fas fa-times-circle"></i>
            <span>تم الرفض</span>
          </div>

          <!-- رأس البطاقة -->
          <div class="card-header-mini">
            <div class="type-badge" :class="tx.type">
              <i :class="getTypeIcon(tx.type)"></i>
              {{ getTypeLabel(tx.type) }}
            </div>
            <div class="status-badge" :class="tx.status">
              {{ getStatusLabel(tx.status) }}
            </div>
          </div>

          <!-- تفاصيل المعاملة -->
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">
                <i class="fas fa-hashtag"></i>
                رقم المعاملة
              </span>
              <span class="detail-value code">{{ tx.transactionId || tx.id.substring(0, 12) }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">
                <i class="fas fa-coins"></i>
                المبلغ
              </span>
              <span class="detail-value amount">{{ tx.amount }} {{ tx.currency || 'USDT' }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">
                <i class="fas fa-calendar"></i>
                التاريخ والوقت
              </span>
              <span class="detail-value">{{ formatDate(tx.createdAt) }}</span>
            </div>

            <!-- حقول السحب -->
            <template v-if="tx.type === 'withdraw' || tx.type === 'withdrawal'">
              <div class="detail-item">
                <span class="detail-label">
                  <i class="fas fa-network-wired"></i>
                  الشبكة
                </span>
                <span class="detail-value network">{{ tx.network || 'غير محدد' }}</span>
              </div>

              <div class="detail-item full-width">
                <span class="detail-label">
                  <i class="fas fa-wallet"></i>
                  عنوان المحفظة
                </span>
                <span class="detail-value address">{{ tx.wallet || tx.walletAddress || 'غير متوفر' }}</span>
              </div>
            </template>

            <!-- حقول الإيداع -->
            <template v-if="tx.type === 'deposit' || tx.type === 'recharge'">
              <div class="detail-item">
                <span class="detail-label">
                  <i class="fas fa-credit-card"></i>
                  طريقة الدفع
                </span>
                <span class="detail-value">{{ tx.paymentMethod || 'غير محدد' }}</span>
              </div>

              <div v-if="tx.transactionHash" class="detail-item full-width">
                <span class="detail-label">
                  <i class="fas fa-link"></i>
                  رابط المعاملة
                </span>
                <span class="detail-value hash">{{ tx.transactionHash }}</span>
              </div>
            </template>

            <!-- معلومات VIP -->
            <div v-if="tx.vipLevel" class="detail-item">
              <span class="detail-label">
                <i class="fas fa-crown"></i>
                مستوى VIP
              </span>
              <span class="detail-value vip">{{ tx.vipLevel }}</span>
            </div>

            <!-- رقم الهاتف (إذا وجد) -->
            <div v-if="tx.userPhone" class="detail-item full-width">
              <span class="detail-label">
                <i class="fas fa-phone"></i>
                رقم الهاتف
              </span>
              <span class="detail-value phone">{{ tx.userPhone }}</span>
            </div>

            <!-- البريد الإلكتروني (إذا وجد) -->
            <div v-if="tx.userEmail" class="detail-item full-width">
              <span class="detail-label">
                <i class="fas fa-envelope"></i>
                البريد الإلكتروني
              </span>
              <span class="detail-value email">{{ tx.userEmail }}</span>
            </div>

            <!-- معرف المستخدم -->
            <div class="detail-item full-width">
              <span class="detail-label">
                <i class="fas fa-id-card"></i>
                معرف المستخدم
              </span>
              <span class="detail-value user-id">{{ tx.userId }}</span>
            </div>
          </div>

          <!-- رسالة الإدارة -->
          <div v-if="tx.adminMessage" class="admin-message" :class="{ 'approved': tx.adminAction === 'approved', 'rejected': tx.adminAction === 'rejected' }">
            <i :class="tx.adminAction === 'approved' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
            <div>
              <strong>{{ tx.adminAction === 'approved' ? 'رسالة الموافقة' : 'سبب الرفض' }}:</strong>
              <p>{{ tx.adminMessage }}</p>
              <span v-if="tx.approvedAt" class="message-date">{{ formatDate(tx.approvedAt) }}</span>
            </div>
          </div>

          <!-- رسالة للمستخدم -->
          <div v-if="tx.userMessage" class="user-message">
            <i class="fas fa-bell"></i>
            <div>
              <strong>رسالة:</strong>
              <p>{{ tx.userMessage }}</p>
            </div>
          </div>

          <!-- ملاحظات -->
          <div v-if="tx.reason && tx.reason !== tx.adminMessage" class="reason-box">
            <i class="fas fa-comment"></i>
            <div>
              <strong>ملاحظات:</strong>
              <p>{{ tx.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  limit
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "Transactions",

  data() {
    return {
      loading: true,
      transactions: [],
      currentUserId: ""
    };
  },

  computed: {
    totalAmount() {
      return this.transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0).toFixed(2);
    }
  },

  created() {
    this.loadTransactions();
  },

  methods: {
    async loadTransactions() {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          this.loading = false;
          return;
        }

        this.currentUserId = user.uid;

        try {
          // تحميل المعاملات بدون orderBy لتجنب الحاجة إلى فهرس
          const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid),
            limit(50)
          );
          
          const snapshot = await getDocs(q);
          let transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // ترتيب يدوي في الذاكرة (أكثر كفاءة من إنشاء فهرس)
          transactions.sort((a, b) => {
            const dateA = this.getTimestampValue(a.createdAt);
            const dateB = this.getTimestampValue(b.createdAt);
            return dateB - dateA;
          });
          
          this.transactions = transactions;
          
        } catch (error) {
          console.error("خطأ في تحميل المعاملات:", error);
          // محاولة بدون شرط userId إذا فشل
          try {
            const q = query(
              collection(db, "transactions"),
              limit(50)
            );
            const snapshot = await getDocs(q);
            let transactions = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            // تصفية المعاملات الخاصة بالمستخدم
            transactions = transactions.filter(tx => tx.userId === user.uid);
            
            // ترتيب يدوي
            transactions.sort((a, b) => {
              const dateA = this.getTimestampValue(a.createdAt);
              const dateB = this.getTimestampValue(b.createdAt);
              return dateB - dateA;
            });
            
            this.transactions = transactions;
          } catch (err) {
            console.error("خطأ في المحاولة الثانية:", err);
          }
        }

        this.loading = false;
      });
    },

    // دالة مساعدة لاستخراج قيمة الوقت من timestamp
    getTimestampValue(ts) {
      if (!ts) return 0;
      try {
        if (ts.toDate) {
          return ts.toDate().getTime();
        } else if (ts.seconds) {
          return ts.seconds * 1000;
        } else if (typeof ts === 'number') {
          return ts;
        } else if (ts instanceof Date) {
          return ts.getTime();
        }
        return new Date(ts).getTime();
      } catch (error) {
        return 0;
      }
    },

    getTypeIcon(type) {
      const icons = {
        withdraw: 'fas fa-arrow-up',
        withdrawal: 'fas fa-arrow-up',
        deposit: 'fas fa-arrow-down',
        recharge: 'fas fa-arrow-down',
        vip: 'fas fa-crown'
      };
      return icons[type] || 'fas fa-exchange-alt';
    },

    getTypeLabel(type) {
      const labels = {
        withdraw: 'سحب',
        withdrawal: 'سحب',
        deposit: 'إيداع',
        recharge: 'تعبئة رصيد',
        vip: 'اشتراك VIP'
      };
      return labels[type] || type;
    },

    getStatusLabel(status) {
      const labels = {
        pending: 'قيد الانتظار',
        approved: 'تمت الموافقة',
        rejected: 'مرفوض',
        completed: 'مكتمل'
      };
      return labels[status] || status;
    },

    formatDate(ts) {
      if (!ts) return "غير متوفر";
      
      try {
        let date;
        if (ts.toDate) {
          date = ts.toDate();
        } else if (ts.seconds) {
          date = new Date(ts.seconds * 1000);
        } else if (typeof ts === 'number') {
          date = new Date(ts);
        } else {
          date = new Date(ts);
        }
        
        if (isNaN(date.getTime())) {
          return "تاريخ غير صالح";
        }
        
        return date.toLocaleString("ar-EG", {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (error) {
        return "تاريخ غير صالح";
      }
    }
  }
};
</script>

<style scoped>
.transactions-page {
  min-height: 100vh;
  background: #0A0C10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  direction: rtl;
  font-family: 'Cairo', sans-serif;
}

.card {
  background: #11151C;
  width: 100%;
  max-width: 800px;
  border-radius: 30px;
  padding: 30px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card-header {
  position: relative;
  margin-bottom: 30px;
  text-align: center;
}

.title {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
}

.title i {
  color: #D4AF37;
  font-size: 32px;
}

.title-glow {
  background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
}

.header-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  filter: blur(30px);
  z-index: 0;
}

.sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  position: relative;
  z-index: 1;
}

/* صناديق الحالات */
.loading-box, .empty-box {
  background: linear-gradient(135deg, #1A1F2A, #11151C);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: #ffffff;
}

.loading-box i {
  font-size: 40px;
  color: #D4AF37;
  margin-bottom: 15px;
}

.empty-box i {
  font-size: 50px;
  color: #D4AF37;
  margin-bottom: 15px;
  opacity: 0.5;
}

.uid-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  direction: ltr;
}

/* إحصائيات */
.stats-box {
  display: flex;
  justify-content: space-around;
  background: linear-gradient(135deg, #1A1F2A, #11151C);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #D4AF37;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  color: #D4AF37;
  font-size: 24px;
  font-weight: 800;
}

/* بطاقة المعاملة */
.transaction-card {
  background: linear-gradient(135deg, #1A1F2A, #11151C);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.transaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
  border-color: #D4AF37;
}

/* شارات الموافقة والرفض */
.approval-badge, .rejection-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
}

.approval-badge {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.rejection-badge {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

/* رأس البطاقة المصغر */
.card-header-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.type-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
}

.type-badge.withdraw, .type-badge.withdrawal {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.type-badge.deposit, .type-badge.recharge {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.type-badge.vip {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
  border: 1px solid #D4AF37;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
  border: 1px solid #D4AF37;
}

.status-badge.approved {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
}

/* شبكة التفاصيل */
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.detail-label i {
  color: #D4AF37;
  font-size: 12px;
}

.detail-value {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  word-break: break-word;
}

.detail-value.amount {
  color: #D4AF37;
  font-size: 16px;
}

.detail-value.code,
.detail-value.hash,
.detail-value.user-id {
  font-family: monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  direction: ltr;
}

.detail-value.network {
  color: #D4AF37;
}

.detail-value.address {
  font-family: monospace;
  font-size: 12px;
  color: #22c55e;
  direction: ltr;
  word-break: break-all;
}

.detail-value.phone {
  color: #D4AF37;
  font-size: 14px;
  font-weight: 600;
}

.detail-value.email {
  color: #D4AF37;
}

.detail-value.vip {
  color: #D4AF37;
}

/* رسائل الإدارة */
.admin-message {
  margin-top: 15px;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.admin-message.approved {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
}

.admin-message.rejected {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
}

.admin-message i {
  font-size: 20px;
}

.admin-message.approved i {
  color: #22c55e;
}

.admin-message.rejected i {
  color: #ef4444;
}

.admin-message p {
  margin: 5px 0 0 0;
  color: #ffffff;
}

.message-date {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 5px;
}

.user-message {
  margin-top: 10px;
  padding: 10px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 10px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.user-message i {
  color: #D4AF37;
  font-size: 16px;
}

.user-message p {
  margin: 5px 0 0 0;
  color: #ffffff;
  font-size: 13px;
}

.reason-box {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.reason-box i {
  color: #D4AF37;
  font-size: 14px;
}

.reason-box p {
  margin: 5px 0 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

/* تحسينات للجوال */
@media (max-width: 600px) {
  .card {
    padding: 20px;
  }

  .title {
    font-size: 24px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .stats-box {
    flex-direction: column;
    gap: 15px;
  }

  .approval-badge, .rejection-badge {
    position: static;
    margin-bottom: 10px;
    width: fit-content;
  }
}

/* أنيميشن */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
