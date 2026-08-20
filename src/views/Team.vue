<template>
  <div class="team-page">
    <!-- حالة التحميل -->
    <div v-if="loading" class="loading-box">جاري تحميل بيانات الفريق...</div>

    <!-- حالة الخطأ -->
    <div v-if="error" class="error-box">
      حدث خطأ أثناء جلب بيانات الفريق:<br />
      <strong>{{ error }}</strong>
    </div>

    <!-- كود الدعوة -->
    <div class="invite-section" v-if="!loading && !error">
      <h2>فريقك</h2>

      <div class="ref-box">
        <label>كود الإحالة:</label>
        <div class="ref-code">{{ referralCode || "غير متوفر" }}</div>
        <button @click="copyText(referralCode)">نسخ</button>
      </div>

      <div class="ref-box">
        <label>رابط الدعوة:</label>
        <div class="ref-code">{{ inviteLink || "غير متوفر" }}</div>
        <button @click="copyText(inviteLink)">نسخ</button>
      </div>

      <!-- أزرار مشاركة صغيرة -->
      <div class="share-small">
        <button class="share-small-btn whatsapp" @click="shareViaWhatsApp" title="مشاركة عبر واتساب">
          <i class="fab fa-whatsapp"></i>
        </button>
        <button class="share-small-btn telegram" @click="shareViaTelegram" title="مشاركة عبر تليجرام">
          <i class="fab fa-telegram"></i>
        </button>
      </div>
    </div>

    <!-- إحصائيات الفريق - مربعات مصغرة -->
    <div class="team-stats-box" v-if="!loading && !error">
      <h2>📊 إحصائيات الفريق</h2>
      
      <!-- الصف الأول -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-value">{{ teamStats.recharge }} USDT</div>
          <div class="stat-label">إجمالي الشحن</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💸</div>
          <div class="stat-value">{{ teamStats.withdraw }} USDT</div>
          <div class="stat-label">إجمالي السحب</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-value">{{ teamStats.totalMembers }}</div>
          <div class="stat-label">حجم الفريق</div>
        </div>
      </div>

      <!-- الصف الثاني -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">🆕</div>
          <div class="stat-value">{{ teamStats.newMembers }}</div>
          <div class="stat-label">أعضاء جدد</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💳</div>
          <div class="stat-value">{{ teamStats.firstRecharge }}</div>
          <div class="stat-label">أول شحن</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🏧</div>
          <div class="stat-value">{{ teamStats.firstWithdraw }}</div>
          <div class="stat-label">أول سحب</div>
        </div>
      </div>
    </div>

    <!-- المستويات -->
    <div class="levels-container" v-if="!loading && !error">
      <div class="level-card level1">
        <div class="lvl-header">مستوى 1</div>
        <div class="lvl-body">
          <div>عدد الإحالات: <strong>{{ stats.l1.count }}</strong></div>
          <div>العمولة: <strong>15%</strong></div>
          <div>الدخل: <strong>{{ stats.l1.earnings.toFixed(2) }} USDT</strong></div>
        </div>
      </div>

      <div class="level-card level2">
        <div class="lvl-header">مستوى 2</div>
        <div class="lvl-body">
          <div>عدد الإحالات: <strong>{{ stats.l2.count }}</strong></div>
          <div>العمولة: <strong>10%</strong></div>
          <div>الدخل: <strong>{{ stats.l2.earnings.toFixed(2) }} USDT</strong></div>
        </div>
      </div>

      <div class="level-card level3">
        <div class="lvl-header">مستوى 3</div>
        <div class="lvl-body">
          <div>عدد الإحالات: <strong>{{ stats.l3.count }}</strong></div>
          <div>العمولة: <strong>5%</strong></div>
          <div>الدخل: <strong>{{ stats.l3.earnings.toFixed(2) }} USDT</strong></div>
        </div>
      </div>
    </div>

    <button class="btn-back" @click="$router.push('/home')">عودة</button>

    <!-- ==================== CUSTOM MODAL SYSTEM ==================== -->
    <transition name="modal-fade-scale">
      <div v-if="modal.visible" class="custom-modal-overlay" @click.self="closeModal">
        <div class="custom-modal-container" :class="modal.size">
          <div class="custom-modal-header" :class="modal.type">
            <div class="header-icon">
              <i :class="modal.icon"></i>
            </div>
            <h3>{{ modal.title }}</h3>
            <button class="modal-close-btn" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="custom-modal-body">
            <p>{{ modal.message }}</p>
            <div v-if="modal.type === 'confirm'" class="confirm-options">
              <button class="modal-btn modal-btn-cancel" @click="closeModal">
                <i class="fas fa-times"></i> {{ modal.cancelText || 'إلغاء' }}
              </button>
              <button class="modal-btn modal-btn-confirm" @click="handleConfirm">
                <i class="fas fa-check"></i> {{ modal.confirmText || 'تأكيد' }}
              </button>
            </div>
          </div>
          
          <div class="custom-modal-footer" v-if="modal.type !== 'confirm'">
            <button class="modal-btn modal-btn-primary" @click="closeModal">
              {{ modal.buttonText || 'حسناً' }}
            </button>
          </div>
          <div class="modal-line"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "Team",
  data() {
    return {
      referralCode: "",
      inviteLink: "",
      loading: true,
      error: null,

      userIdFieldInLogs: "userId",
      txIdFieldInLogs: "txid",

      teamStats: {
        withdraw: "0.00",
        recharge: "0.00",
        totalMembers: 0,
        newMembers: 0,
        firstRecharge: 0,
        firstWithdraw: 0,
      },

      stats: {
        l1: { count: 0, earnings: 0 },
        l2: { count: 0, earnings: 0 },
        l3: { count: 0, earnings: 0 },
      },

      modal: {
        visible: false,
        type: 'info',
        title: '',
        message: '',
        icon: 'fas fa-info-circle',
        buttonText: '',
        confirmText: '',
        cancelText: '',
        size: 'small',
        callback: null
      }
    };
  },

  created() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.loading = false;
        return;
      }

      try {
        const uid = user.uid;
        const udoc = await getDoc(doc(db, "users", uid));
        if (udoc.exists()) {
          const data = udoc.data();
          this.referralCode = data.referralCode || uid.substring(0, 6);
          this.inviteLink = `${window.location.origin}/register?ref=${this.referralCode}`;
        } else {
          this.referralCode = uid.substring(0, 6);
          this.inviteLink = `${window.location.origin}/register?ref=${this.referralCode}`;
        }

        await this.loadTeamLevels(uid);
        await this.loadTeamStats(uid);
      } catch (err) {
        console.error("Team load error:", err);
        this.error = err.message || String(err);
      } finally {
        this.loading = false;
      }
    });
  },

  methods: {
    // ==================== CUSTOM MODAL METHODS ====================
    showModal(options) {
      this.modal = {
        visible: true,
        type: options.type || 'info',
        title: options.title || '',
        message: options.message || '',
        icon: this.getIconByType(options.type),
        buttonText: options.buttonText || 'حسناً',
        confirmText: options.confirmText || 'تأكيد',
        cancelText: options.cancelText || 'إلغاء',
        size: options.size || 'small',
        callback: options.callback || null
      };
      document.body.style.overflow = 'hidden';
    },

    getIconByType(type) {
      switch(type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'confirm': return 'fas fa-question-circle';
        default: return 'fas fa-info-circle';
      }
    },

    closeModal() {
      this.modal.visible = false;
      document.body.style.overflow = 'auto';
      this.modal.callback = null;
    },

    handleConfirm() {
      if (this.modal.callback) {
        this.modal.callback();
      }
      this.closeModal();
    },

    showSuccessMessage(message) {
      this.showModal({
        type: 'success',
        title: 'تم بنجاح',
        message: message,
        buttonText: 'حسناً',
        size: 'small'
      });
    },

    showErrorMessage(message) {
      this.showModal({
        type: 'error',
        title: 'خطأ',
        message: message,
        buttonText: 'حسناً',
        size: 'small'
      });
    },

    // ==================== COPY METHODS ====================
    copyText(text) {
      if (!text) {
        this.showErrorMessage("لا يوجد شيء للنسخ");
        return;
      }
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.showSuccessMessage("تم النسخ بنجاح ✓");
        })
        .catch(() => {
          this.showErrorMessage("فشل النسخ — انسخ يدويًا");
        });
    },

    shareViaWhatsApp() {
      const message = `انضم إلى فريقي باستخدام رابط الدعوة الخاص بي: ${this.inviteLink}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      this.showSuccessMessage("تم فتح واتساب للمشاركة");
    },

    shareViaTelegram() {
      const message = `انضم إلى فريقي باستخدام رابط الدعوة الخاص بي: ${this.inviteLink}`;
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(this.inviteLink)}&text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank');
      this.showSuccessMessage("تم فتح تليجرام للمشاركة");
    },

    chunkArray(arr, size = 10) {
      const res = [];
      for (let i = 0; i < arr.length; i += size) {
        res.push(arr.slice(i, i + size));
      }
      return res;
    },

    async loadTeamLevels(uid) {
      try {
        const usersRef = collection(db, "users");

        const q1 = query(usersRef, where("invitedBy", "==", uid));
        const s1 = await getDocs(q1);
        const level1Ids = s1.docs.map((d) => d.id);
        this.stats.l1.count = level1Ids.length;

        let level2Ids = [];
        if (level1Ids.length) {
          const chunks = this.chunkArray(level1Ids, 10);
          for (const ch of chunks) {
            const q2 = query(usersRef, where("invitedBy", "in", ch));
            const s2 = await getDocs(q2);
            level2Ids = level2Ids.concat(s2.docs.map((d) => d.id));
          }
        }
        this.stats.l2.count = level2Ids.length;

        let level3Ids = [];
        if (level2Ids.length) {
          const chunks2 = this.chunkArray(level2Ids, 10);
          for (const ch of chunks2) {
            const q3 = query(usersRef, where("invitedBy", "in", ch));
            const s3 = await getDocs(q3);
            level3Ids = level3Ids.concat(s3.docs.map((d) => d.id));
          }
        }
        this.stats.l3.count = level3Ids.length;

        const allIds = [...level1Ids, ...level2Ids, ...level3Ids];
        const uniqueIds = Array.from(new Set(allIds));
        this.teamStats.totalMembers = uniqueIds.length;
        this.teamStats.newMembers = level1Ids.length;

        await this.loadReferralRewards(uid);
      } catch (err) {
        console.error("loadTeamLevels error:", err);
        throw err;
      }
    },

    async loadReferralRewards(uid) {
      try {
        const rewardsRef = collection(db, "referral_rewards");
        const calc = async (level) => {
          const q = query(rewardsRef, where("receiver", "==", uid), where("level", "==", level));
          const s = await getDocs(q);
          return s.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
        };

        this.stats.l1.earnings = await calc(1);
        this.stats.l2.earnings = await calc(2);
        this.stats.l3.earnings = await calc(3);
      } catch (err) {
        console.warn("loadReferralRewards warning:", err);
        this.stats.l1.earnings = 0;
        this.stats.l2.earnings = 0;
        this.stats.l3.earnings = 0;
      }
    },

    async loadTeamStats(uid) {
      try {
        const usersRef = collection(db, "users");

        const q1 = query(usersRef, where("invitedBy", "==", uid));
        const s1 = await getDocs(q1);
        const level1Members = s1.docs.map((d) => d.id);

        let level2Members = [];
        if (level1Members.length) {
          for (const ch of this.chunkArray(level1Members, 10)) {
            const q2 = query(usersRef, where("invitedBy", "in", ch));
            const s2 = await getDocs(q2);
            level2Members = level2Members.concat(s2.docs.map((d) => d.id));
          }
        }

        let level3Members = [];
        if (level2Members.length) {
          for (const ch of this.chunkArray(level2Members, 10)) {
            const q3 = query(usersRef, where("invitedBy", "in", ch));
            const s3 = await getDocs(q3);
            level3Members = level3Members.concat(s3.docs.map((d) => d.id));
          }
        }

        const all = [...level1Members, ...level2Members, ...level3Members];
        const membersUnique = Array.from(new Set(all));

        let withdrawSum = 0;
        let rechargeSum = 0;
        let firstWithdrawCount = 0;
        let firstRechargeCount = 0;

        const seenRechargeTx = new Set();
        const seenWithdrawTx = new Set();

        const uidField = this.userIdFieldInLogs;
        const txField = this.txIdFieldInLogs;

        for (const memberId of membersUnique) {
          const withdrawQ = query(collection(db, "withdraw_logs"), where(uidField, "==", memberId));
          const wSnap = await getDocs(withdrawQ);

          let memberHadWithdraw = false;
          wSnap.forEach((d) => {
            const data = d.data() || {};
            if (data.type && String(data.type).toLowerCase() !== "approved") return;
            if (data.status && String(data.status).toLowerCase() !== "approved") return;

            const key = (data[txField] && String(data[txField])) || d.id;
            if (seenWithdrawTx.has(key)) return;
            seenWithdrawTx.add(key);

            const amt = Number(data.amount || 0);
            if (!isNaN(amt) && amt !== 0) {
              withdrawSum += amt;
              memberHadWithdraw = true;
            }
          });
          if (memberHadWithdraw) firstWithdrawCount++;

          const rechargeQ = query(collection(db, "recharge_logs"), where(uidField, "==", memberId));
          const rSnap = await getDocs(rechargeQ);

          let memberHadRecharge = false;
          rSnap.forEach((d) => {
            const data = d.data() || {};
            if (data.type && String(data.type).toLowerCase() !== "approved") return;
            if (data.status && String(data.status).toLowerCase() !== "approved") return;

            const key = (data[txField] && String(data[txField])) || d.id;
            if (seenRechargeTx.has(key)) return;
            seenRechargeTx.add(key);

            const amt = Number(data.amount || 0);
            if (!isNaN(amt) && amt !== 0) {
              rechargeSum += amt;
              memberHadRecharge = true;
            }
          });
          if (memberHadRecharge) firstRechargeCount++;
        }

        this.teamStats.withdraw = parseFloat(withdrawSum || 0).toFixed(2);
        this.teamStats.recharge = parseFloat(rechargeSum || 0).toFixed(2);
        this.teamStats.firstWithdraw = firstWithdrawCount;
        this.teamStats.firstRecharge = firstRechargeCount;
        this.teamStats.totalMembers = membersUnique.length;
      } catch (err) {
        console.error("loadTeamStats error:", err);
        this.error = err.message || String(err);
      }
    },
  },
};
</script>

<style scoped>
.team-page {
  direction: rtl;
  padding: 15px;
  background: #f5f6f8;
  min-height: 100vh;
  padding-bottom: 90px;
  color: #1a1a2e;
  font-family: 'Cairo', sans-serif;
}

h2 {
  color: #1a1a2e;
  font-size: 20px;
  margin-bottom: 15px;
  text-align: center;
}

/* قسم الدعوة */
.invite-section {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.ref-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.ref-box label {
  color: #1a1a2e;
  min-width: 90px;
  font-size: 14px;
  font-weight: 600;
}

.ref-code {
  flex: 1;
  background: #f8f9fa;
  padding: 10px 12px;
  border-radius: 10px;
  color: #1a1a2e;
  font-size: 13px;
  border: 1px solid #e5e7eb;
  word-break: break-all;
}

.ref-box button {
  background: #1a1a2e;
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.ref-box button:hover {
  background: #2a2a4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 26, 46, 0.2);
}

/* أزرار مشاركة صغيرة */
.share-small {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.share-small-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 22px;
}

.share-small-btn.whatsapp {
  background: #25D366;
  color: white;
}

.share-small-btn.telegram {
  background: #0088cc;
  color: white;
}

.share-small-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

/* إحصائيات الفريق - مربعات صغيرة */
.team-stats-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.stats-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.stats-row:last-child {
  margin-bottom: 0;
}

.stat-card {
  flex: 1;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px 5px;
  text-align: center;
  border: 1px solid #e5e7eb;
  min-width: 0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.stat-icon {
  font-size: 22px;
  margin-bottom: 5px;
  color: #1a1a2e;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
}

/* المستويات */
.levels-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.level-card {
  border-radius: 14px;
  padding: 14px 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
}

.level-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.level-card.level1 {
  border-top: 4px solid #1a1a2e;
}

.level-card.level2 {
  border-top: 4px solid #4a4a6a;
}

.level-card.level3 {
  border-top: 4px solid #6b7280;
}

.lvl-header {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 10px;
  color: #1a1a2e;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 6px;
  text-align: center;
}

.lvl-body {
  font-size: 13px;
  color: #374151;
}

.lvl-body div {
  margin: 6px 0;
  display: flex;
  justify-content: space-between;
}

.lvl-body strong {
  color: #1a1a2e;
  font-weight: 700;
}

/* زر العودة */
.btn-back {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 2px solid #1a1a2e;
  background: transparent;
  color: #1a1a2e;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-back:hover {
  background: #1a1a2e;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(26, 26, 46, 0.15);
}

/* حالات التحميل */
.loading-box, .error-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e5e7eb;
  margin: 20px auto;
  max-width: 300px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.error-box {
  color: #dc3545;
}

/* ==================== CUSTOM MODAL SYSTEM ==================== */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.custom-modal-container {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: modalFloatIn 0.35s cubic-bezier(0.21, 1.11, 0.35, 1);
}

@keyframes modalFloatIn {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-fade-scale-enter-active,
.modal-fade-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-scale-enter-from,
.modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

.custom-modal-header {
  padding: 18px 20px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.custom-modal-header .header-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.custom-modal-header.info .header-icon {
  background: #e3f2fd;
  color: #1565c0;
}

.custom-modal-header.success .header-icon {
  background: #e8f5e9;
  color: #2e7d32;
}

.custom-modal-header.error .header-icon {
  background: #fce4ec;
  color: #c62828;
}

.custom-modal-header.confirm .header-icon {
  background: #fff3e0;
  color: #e65100;
}

.custom-modal-header h3 {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1a1a2e;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f9fa;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: #e5e7eb;
  color: #1a1a2e;
  transform: rotate(90deg);
}

.custom-modal-body {
  padding: 20px;
}

.custom-modal-body p {
  margin: 0;
  line-height: 1.6;
  color: #374151;
  font-size: 15px;
  text-align: center;
}

.confirm-options {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;
}

.custom-modal-footer {
  padding: 14px 20px 20px;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.modal-btn-primary {
  background: #1a1a2e;
  color: #ffffff;
  font-weight: 700;
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 26, 46, 0.25);
}

.modal-btn-confirm {
  background: #1a1a2e;
  color: #ffffff;
  flex: 1;
}

.modal-btn-cancel {
  background: #f8f9fa;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  flex: 1;
}

.modal-btn-cancel:hover {
  background: #e5e7eb;
}

.modal-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #1a1a2e;
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 480px) {
  .stats-row {
    gap: 5px;
  }
  
  .stat-card {
    padding: 8px 3px;
  }
  
  .stat-icon {
    font-size: 18px;
  }
  
  .stat-value {
    font-size: 12px;
  }
  
  .stat-label {
    font-size: 9px;
  }
  
  .levels-container {
    gap: 6px;
  }
  
  .level-card {
    padding: 10px 6px;
  }
  
  .lvl-header {
    font-size: 13px;
  }
  
  .lvl-body {
    font-size: 11px;
  }
  
  .share-small-btn {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }
  
  .ref-box {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ref-box label {
    min-width: auto;
  }
  
  .custom-modal-container {
    max-width: 90%;
  }
  
  .custom-modal-header h3 {
    font-size: 17px;
  }
  
  .custom-modal-body p {
    font-size: 14px;
  }
}

@media (max-width: 350px) {
  .stats-row {
    flex-wrap: wrap;
  }
  
  .stat-card {
    flex: 0 0 calc(50% - 5px);
  }
}
</style>
