<template>
  <div class="vip-page">
    <div class="container">
      <h1 class="page-title">
        <span class="title-glow">💎</span>
        مستويات VIP الفاخرة
        <span class="title-glow">💎</span>
      </h1>

      <!-- زر أسهم الشركة -->
      <div class="shares-button-container">
        <button @click="goToShares" class="shares-button">
          <div class="shares-button-content">
            <span class="shares-icon">📈</span>
            <div class="shares-text-container">
              <span class="shares-title">أسهم الشركة</span>
              <span class="shares-subtitle">Palm Treasure</span>
            </div>
          </div>
          <span class="shares-badge">استثمر الآن</span>
        </button>
      </div>

      <!-- إشعار الأرباح -->
      <transition name="slide-down">
        <div v-if="showNotification" class="profit-notification">
          <i class="fas fa-gift"></i>
          {{ notificationMessage }}
        </div>
      </transition>

      <div v-if="loading" class="center">
        <div class="gold-spinner"></div>
        <div class="loading-text">جاري التحميل...</div>
      </div>

      <div v-else>
        <!-- حالة المستخدم الحالية -->
        <div v-if="userVip && userVip.level" class="current-vip-card" :class="{ 'elite-user': userVip.level >= 8 }">
          <div class="status-header">
            ✨ مفعل الآن ✨
            <span v-if="userVip.level >= 8" class="elite-badge-header">🏆 النخبة</span>
          </div>
          <div class="vip-title">
            VIP {{ userVip.level }}
          </div>

          <div class="earnings-grid">
            <div class="earn-box">
              <span class="earn-label"><i class="fas fa-coins"></i> ربح يومي</span>
              <span class="earn-value">{{ formatNumberEnglish(userVip.daily) }} <small>USDT</small></span>
            </div>
            <div class="earn-box">
              <span class="earn-label"><i class="fas fa-calendar-day"></i> ربح أسبوعي</span>
              <span class="earn-value">{{ formatNumberEnglish(userVip.daily * 7, 1) }} <small>USDT</small></span>
            </div>
            <div class="earn-box">
              <span class="earn-label"><i class="fas fa-calendar-week"></i> ربح شهري</span>
              <span class="earn-value">{{ formatNumberEnglish(userVip.daily * 30, 0) }} <small>USDT</small></span>
            </div>
            <div class="earn-box">
              <span class="earn-label"><i class="fas fa-calendar-alt"></i> ربح سنوي</span>
              <span class="earn-value">{{ formatNumberEnglishWithCommas(userVip.daily * 365) }} <small>USDT</small></span>
            </div>
          </div>

          <div class="remaining-timer">
            <i class="fas fa-hourglass-half"></i>
            الوقت المتبقي حتى التوزيع القادم: <span class="timer-val">{{ remainingText }}</span>
          </div>

          <div class="last-reward-info" v-if="userVip.lastRewardAt">
            <i class="fas fa-history"></i>
            آخر توزيع: {{ formatDate(userVip.lastRewardAt) }}
          </div>

          <div class="details-btn-wrapper">
            <button class="btn-details-white" @click="showDetailsModal = true">
              <i class="fas fa-info-circle"></i>
              تفاصيل
            </button>
            <button class="btn-upgrade-auto" @click="autoUpgrade" v-if="canUpgrade">
              <i class="fas fa-arrow-up"></i>
              ترقية تلقائية
            </button>
          </div>
        </div>

        <!-- فلترة الخطط -->
        <div class="filter-buttons">
          <button @click="filterLevel = 'all'" :class="{ active: filterLevel === 'all' }" class="filter-btn">
            الكل
          </button>
          <button @click="filterLevel = 'basic'" :class="{ active: filterLevel === 'basic' }" class="filter-btn">
            أساسي (1-7)
          </button>
          <button @click="filterLevel = 'premium'" :class="{ active: filterLevel === 'premium' }" class="filter-btn elite-filter">
            <i class="fas fa-crown"></i>
            النخبة (8-14)
          </button>
        </div>

        <!-- قائمة المستويات VIP -->
        <div class="vip-list">
          <div
            class="vip-card-item"
            v-for="plan in filteredPlans"
            :key="plan.level"
            :class="{ 
              'is-active': userVip && userVip.level === plan.level,
              'elite-card': plan.level >= 8
            }"
          >
            <!-- شريط النخبة للمستويات 8+ -->
            <div class="elite-ribbon" v-if="plan.level >= 8">
              <i class="fas fa-crown"></i>
              نخبة VIP
              <i class="fas fa-star"></i>
            </div>
            
            <div class="item-header-row" :class="{ 'elite-header': plan.level >= 8 }">
              <div class="item-medal-right">
                <span v-if="plan.level === 1">🥉</span>
                <span v-else-if="plan.level === 2">🥈</span>
                <span v-else-if="plan.level === 3">🥇</span>
                <span v-else-if="plan.level >= 8" class="elite-medal">👑</span>
                <span v-else>💎</span>
              </div>
              <div class="item-title-left" :class="{ 'elite-title': plan.level >= 8 }">
                VIP {{ plan.level }}
                <span v-if="plan.level >= 8" class="star-icon">⭐</span>
              </div>
            </div>

            <div class="item-body">
              <div class="subscription-row">
                <span class="label">الاشتراك</span>
                <span class="value" :class="{ 'elite-value': plan.level >= 8 }">USDT {{ formatNumberEnglishWithCommas(plan.price) }}</span>
              </div>

              <!-- مؤشر العائد على الاستثمار ROI -->
              <div class="roi-display" :class="{ 'elite-roi': plan.level >= 8 }" v-if="plan.price > 0">
                <i class="fas fa-chart-line"></i>
                العائد السنوي: {{ formatNumberEnglish(getROI(plan), 1) }}%
              </div>

              <div class="stats-grid-v2">
                <div class="mini-stat-v2" :class="{ 'elite-stat': plan.level >= 8 }">
                  <span class="stat-label-v2"><i class="fas fa-coins gold-icon"></i> ربح يومي</span>
                  <span class="stat-value-v2">{{ formatNumberEnglish(plan.daily) }}</span>
                </div>
                <div class="mini-stat-v2" :class="{ 'elite-stat': plan.level >= 8 }">
                  <span class="stat-label-v2"><i class="fas fa-calendar-day gold-icon"></i> ربح أسبوعي</span>
                  <span class="stat-value-v2">{{ formatNumberEnglish(plan.daily * 7, 1) }}</span>
                </div>
                <div class="mini-stat-v2" :class="{ 'elite-stat': plan.level >= 8 }">
                  <span class="stat-label-v2"><i class="fas fa-calendar-week gold-icon"></i> ربح شهري</span>
                  <span class="stat-value-v2">{{ formatNumberEnglish(plan.daily * 30, 0) }}</span>
                </div>
                <div class="mini-stat-v2" :class="{ 'elite-stat': plan.level >= 8 }">
                  <span class="stat-label-v2"><i class="fas fa-calendar-alt gold-icon"></i> ربح سنوي</span>
                  <span class="stat-value-v2">{{ formatNumberEnglishWithCommas(plan.daily * 365) }}</span>
                </div>
                <div class="mini-stat-v2 full-width-stat" :class="{ 'elite-stat': plan.level >= 8 }">
                  <span class="stat-label-v2"><i class="fas fa-tasks gold-icon"></i> المهام</span>
                  <span class="stat-value-v2">{{ plan.tasks }}</span>
                </div>
              </div>

              <button
                class="btn-action"
                :class="{ 'elite-btn': plan.level >= 8 }"
                v-if="!isActivePlan(plan)"
                @click="openConfirmModal(plan)"
                :disabled="processing"
              >
                <i v-if="processing && buyingPlan === plan.level" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-crown"></i>
                {{ processing && buyingPlan === plan.level ? 'جاري الشراء...' : 'اشترِ الآن' }}
              </button>
              <button class="btn-action active" :class="{ 'elite-btn-active': plan.level >= 8 }" v-else disabled>
                <i class="fas fa-check-circle"></i>
                مفعل
              </button>
            </div>

            <!-- علامة مميزة للخطط النشطة من النخبة -->
            <div class="active-ribbon" v-if="userVip && userVip.level === plan.level && plan.level >= 8">
              👑 نخبة نشط 👑
            </div>
            <div class="active-ribbon basic" v-else-if="userVip && userVip.level === plan.level">
              نشط الآن
            </div>
          </div>
        </div>

        <!-- شارة النخبة في الأسفل -->
        <div class="elite-footer">
          <div class="elite-info-box">
            <i class="fas fa-crown"></i>
            <div class="elite-info-content">
              <h4>🌟 برنامج النخبة VIP 🌟</h4>
              <p>المستويات من VIP 8 إلى VIP 15 تتمتع بمميزات حصرية: أولوية الدعم الفني، عمولات إضافية، ومكافآت خاصة</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal تفاصيل الخطة -->
    <transition name="fade">
      <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3>📊 تفاصيل الخطة الاستثمارية</h3>
            <button class="close-btn" @click="showDetailsModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="investment-text">
              <p>مرحبًا بك في منصتنا الاستثمارية المتقدمة، حيث نوفر لك فرصة تحقيق أرباح مستقرة وآمنة من خلال نظام تداول ذكي يعتمد على أحدث التقنيات في تحليل السوق.</p>
              
              <div class="section">
                <h4>💼 مميزات الخطة:</h4>
                <ul>
                  <li>أرباح يومية ثابتة وفق مستوى VIP الخاص بك</li>
                  <li>نظام آلي يعمل 24 ساعة بدون تدخل</li>
                  <li>سحب سريع وآمن في أي وقت</li>
                  <li>دعم فني متواصل لخدمتك</li>
                </ul>
              </div>

              <div class="section elite-section">
                <h4>👑 مميزات النخبة (VIP 8+):</h4>
                <ul>
                  <li>دعم فني على مدار الساعة</li>
                  <li>عمولات إضافية من فريقك</li>
                  <li>مكافآت شهرية حصرية</li>
                  <li>دخول مبكر للصفقات الجديدة</li>
                </ul>
              </div>

              <div class="section">
                <h4>🚀 آلية العمل:</h4>
                <p>عند تفعيل الباقة، يبدأ النظام تلقائيًا بتنفيذ صفقات مدروسة لتحقيق أفضل عائد ممكن، ويتم إضافة الأرباح إلى حسابك بشكل يومي.</p>
              </div>

              <div class="section">
                <h4>👥 نظام الفريق:</h4>
                <p>يمكنك زيادة أرباحك من خلال دعوة الأصدقاء وتكوين فريق نشط، حيث تحصل على عمولات إضافية عند ترقية أعضاء فريقك.</p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-modal-close" @click="showDetailsModal = false">إغلاق</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Custom Confirm Modal للتأكيد على الشراء -->
    <transition name="modal-fade-scale">
      <div v-if="showConfirmModal" class="confirm-modal-overlay" @click.self="closeConfirmModal">
        <div class="confirm-modal-content">
          <div class="confirm-modal-header">
            <i class="fas fa-crown"></i>
            <h3>تأكيد الاشتراك</h3>
          </div>
          
          <div class="confirm-modal-body">
            <p>
              هل تريد تفعيل 
              <strong class="highlight-level">VIP {{ selectedPlan?.level }}</strong> 
              مقابل 
              <strong class="highlight-price">{{ selectedPlan?.price ? formatNumberEnglishWithCommas(selectedPlan.price) : '0' }} USDT</strong>؟
            </p>
          </div>

          <div class="confirm-modal-footer">
            <button class="confirm-btn-cancel" @click="closeConfirmModal">
              <i class="fas fa-times"></i>
              إلغاء
            </button>
            <button class="confirm-btn-confirm" @click="executePurchase" :disabled="processing">
              <i v-if="processing" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ processing ? 'جاري الشراء...' : 'تأكيد الشراء' }}
            </button>
          </div>
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
  runTransaction,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "VIP",
  data() {
    return {
      loading: true,
      processing: false,
      buyingPlan: null,
      userVip: null,
      remainingMs: 0,
      intervalId: null,
      showDetailsModal: false,
      showNotification: false,
      notificationMessage: '',
      filterLevel: 'all',
      showConfirmModal: false,
      selectedPlan: null,
      // ✅ منع التوزيع المتكرر في نفس الدورة
      lastDistributedCycle: null,

      plans: [
        { level: 1, name: "VIP 1", price: 5, tasks: 1, daily: 0.15, durationSeconds: 365 * 86400 },
        { level: 2, name: "VIP 2", price: 10, tasks: 1, daily: 0.35, durationSeconds: 365 * 86400 },
        { level: 3, name: "VIP 3", price: 50, tasks: 1, daily: 1.60, durationSeconds: 365 * 86400 },
        { level: 4, name: "VIP 4", price: 100, tasks: 1, daily: 3.25, durationSeconds: 365 * 86400 },
        { level: 5, name: "VIP 5", price: 300, tasks: 1, daily: 10, durationSeconds: 365 * 86400 },
        { level: 6, name: "VIP 6", price: 900, tasks: 1, daily: 33, durationSeconds: 365 * 86400 },
        { level: 7, name: "VIP 7", price: 1350, tasks: 1, daily: 51, durationSeconds: 365 * 86400 },
        { level: 8, name: "VIP 8", price: 1800, tasks: 1, daily: 70, durationSeconds: 365 * 86400 },
        { level: 9, name: "VIP 9", price: 3600, tasks: 1, daily: 150, durationSeconds: 365 * 86400 },
        { level: 10, name: "VIP 10", price: 7200, tasks: 1, daily: 330, durationSeconds: 365 * 86400 },
        { level: 11, name: "VIP 11", price: 14400, tasks: 1, daily: 700, durationSeconds: 365 * 86400 },
        { level: 12, name: "VIP 12", price: 18800, tasks: 1, daily: 1600, durationSeconds: 365 * 86400 },
        { level: 13, name: "VIP 13", price: 37600, tasks: 1, daily: 3500, durationSeconds: 365 * 86400 },
        { level: 14, name: "VIP 14", price: 75200, tasks: 1, daily: 7500, durationSeconds: 365 * 86400 },
        { level: 15, name: "VIP 15", price: 150400, tasks: 1, daily: 16000, durationSeconds: 365 * 86400 },
      ],
      
      globalCycleHourUTC: 3,
      globalCycleMinuteUTC: 30,
    };
  },

  computed: {
    remainingText() {
      if (!this.userVip || !this.userVip.level) return "00:00:00";
      const ms = Math.max(0, this.remainingMs || 0);
      const sec = Math.floor(ms / 1000);
      const h = String(Math.floor(sec / 3600)).padStart(2, "0");
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    },

    filteredPlans() {
      if (this.filterLevel === 'basic') {
        return this.plans.filter(p => p.level <= 7);
      } else if (this.filterLevel === 'premium') {
        return this.plans.filter(p => p.level >= 8);
      }
      return this.plans;
    },

    canUpgrade() {
      if (!this.userVip) return false;
      const nextLevel = this.userVip.level + 1;
      return this.plans.some(p => p.level === nextLevel);
    }
  },

  created() {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.loading = false;
        this.$router.push("/login");
        return;
      }
      await this.init();
    });
  },

  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  },

  methods: {
    formatNumberEnglish(value, decimals = null) {
      if (value === null || value === undefined) return '0';
      
      let numValue = Number(value);
      if (isNaN(numValue)) return '0';
      
      let formattedNumber;
      if (decimals !== null) {
        formattedNumber = numValue.toFixed(decimals);
      } else {
        formattedNumber = numValue.toString();
      }
      
      return formattedNumber;
    },
    
    formatNumberEnglishWithCommas(value) {
      if (value === null || value === undefined) return '0';
      
      let numValue = Number(value);
      if (isNaN(numValue)) return '0';
      
      return numValue.toLocaleString('en-US');
    },

    getROI(plan) {
      if (plan.price === 0) return 0;
      const yearlyProfit = plan.daily * 365;
      const roi = ((yearlyProfit - plan.price) / plan.price) * 100;
      return roi;
    },

    formatDate(timestamp) {
      if (!timestamp) return '---';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('ar-SA');
    },

    showProfitNotification(amount, cyclesCount) {
      if (cyclesCount && cyclesCount > 0) {
        this.notificationMessage = `🎉 تم إضافة ${this.formatNumberEnglish(amount)} USDT (${cyclesCount} يوم) من أرباح VIP إلى رصيدك!`;
      } else {
        this.notificationMessage = `🎉 تم إضافة ${this.formatNumberEnglish(amount)} USDT ربح فوري من VIP إلى رصيدك!`;
      }
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
    },

    getLastCompletedCycle(referenceTime) {
      const ref = new Date(referenceTime);
      const lastCycle = new Date(ref.getTime());
      lastCycle.setUTCHours(this.globalCycleHourUTC, this.globalCycleMinuteUTC, 0, 0);
      
      if (lastCycle.getTime() > ref.getTime()) {
        lastCycle.setTime(lastCycle.getTime() - 24 * 3600 * 1000);
      }
      
      return lastCycle;
    },

    getNextGlobalCycle(referenceTime) {
      const ref = new Date(referenceTime);
      const next = new Date(ref.getTime());
      next.setUTCHours(this.globalCycleHourUTC, this.globalCycleMinuteUTC, 0, 0);
      if (next.getTime() <= ref.getTime()) {
        next.setTime(next.getTime() + 24 * 3600 * 1000);
      }
      return next;
    },

    calculateCompletedCycles(fromDate, toDate) {
      const fromCycle = this.getLastCompletedCycle(fromDate);
      const toCycle = this.getLastCompletedCycle(toDate);
      
      const diffTime = toCycle.getTime() - fromCycle.getTime();
      const diffDays = Math.floor(diffTime / (24 * 3600 * 1000));
      
      return Math.max(0, diffDays);
    },

    // ✅ تحسين: حساب الأرباح دون كتابة في Firestore (يتم في settleAndReward فقط عند الحاجة)
    async distributeRewards(userId, vipData, transaction) {
      const now = new Date();
      const lastRewardAt = vipData.lastRewardAt?.toDate() || vipData.vipStart?.toDate() || now;
      
      const cyclesCount = this.calculateCompletedCycles(lastRewardAt, now);
      
      if (cyclesCount > 0) {
        const reward = vipData.daily * cyclesCount;
        
        if (reward > 0) {
          const userDocRef = doc(db, "users", userId);
          const userSnap = await transaction.get(userDocRef);
          
          if (userSnap.exists()) {
            const currentVipBalance = userSnap.data().vipBalance ?? userSnap.data().balance ?? 0;
            const newVipBalance = currentVipBalance + reward;
            transaction.update(userDocRef, { vipBalance: newVipBalance });
            
            const lastCycle = this.getLastCompletedCycle(now);
            transaction.update(doc(db, "users", userId, "vip", "current"), { 
              lastRewardAt: Timestamp.fromDate(lastCycle)
            });
            
            const rewardRef = doc(collection(db, "users", userId, "rewards_history"));
            transaction.set(rewardRef, {
              amount: reward,
              level: vipData.level,
              cycles: cyclesCount,
              fromDate: Timestamp.fromDate(lastRewardAt),
              toDate: Timestamp.fromDate(lastCycle),
              createdAt: Timestamp.now()
            });
            
            this.showProfitNotification(reward, cyclesCount);
          }
        }
      }
    },

    async init() {
      this.loading = true;
      try {
        const user = auth.currentUser;
        const vipDocRef = doc(db, "users", user.uid, "vip", "current");
        const vipSnap = await getDoc(vipDocRef);
        
        if (vipSnap.exists()) {
          const data = vipSnap.data();
          this.userVip = {
            level: data.level || null,
            price: data.price || 0,
            daily: data.daily || 0,
            vipStart: data.vipStart || null,
            vipEnd: data.vipEnd || null,
            durationSeconds: data.durationSeconds || 86400,
            lastRewardAt: data.lastRewardAt || null,
          };
          
          await this.settleAndReward();
          this.startTimer();
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        this.loading = false;
      }
    },

    // ✅ تحسين: يتم استدعاؤها فقط عند الحاجة (عند بدء التشغيل أو عند انتهاء الدورة)
    async settleAndReward() {
      if (!this.userVip?.level) return;
      const user = auth.currentUser;
      if (!user) return;

      try {
        await runTransaction(db, async (transaction) => {
          const userDocRef = doc(db, "users", user.uid);
          const vipDocRef = doc(db, "users", user.uid, "vip", "current");
          const userSnap = await transaction.get(userDocRef);
          const vipSnap = await transaction.get(vipDocRef);

          if (!userSnap.exists() || !vipSnap.exists()) return;

          const vipData = vipSnap.data();
          const now = Date.now();
          
          if (vipData.vipEnd?.toMillis() <= now) {
            transaction.update(vipDocRef, { level: null });
            this.userVip = null;
            return;
          }
          
          await this.distributeRewards(user.uid, vipData, transaction);
        });
      } catch (error) {
        console.error("خطأ في توزيع الأرباح:", error);
      }
    },

    // ✅ تحسين: استخدام setInterval فقط للتحديث البصري، وتقليل عدد مرات استدعاء settleAndReward
    startTimer() {
      if (this.intervalId) clearInterval(this.intervalId);
      
      const update = () => {
        if (!this.userVip || !this.userVip.level) return;
        
        const nextCycle = this.getNextGlobalCycle(new Date());
        const now = Date.now();
        this.remainingMs = nextCycle.getTime() - now;
        
        if (this.userVip.vipEnd) {
          const endMs = this.userVip.vipEnd.toMillis ? this.userVip.vipEnd.toMillis() : this.userVip.vipEnd;
          const vipRemainingMs = endMs - now;
          
          if (vipRemainingMs <= 0 && this.userVip.level) {
            this.userVip.level = null;
            clearInterval(this.intervalId);
            return;
          }
        }
        
        // ✅ التحقق من انتهاء الدورة مرة واحدة فقط عند الوصول إلى الصفر
        if (this.remainingMs <= 0) {
          const currentCycleKey = nextCycle.toISOString().split('T')[0];
          
          // ✅ منع التوزيع المتكرر في نفس الدورة
          if (this.lastDistributedCycle !== currentCycleKey) {
            this.lastDistributedCycle = currentCycleKey;
            console.log("توزيع الأرباح التلقائي - الدورة:", currentCycleKey);
            this.settleAndReward().then(() => {
              const newNextCycle = this.getNextGlobalCycle(new Date());
              this.remainingMs = newNextCycle.getTime() - Date.now();
            }).catch(error => {
              console.error("خطأ في التوزيع التلقائي للأرباح:", error);
            });
          } else {
            const newNextCycle = this.getNextGlobalCycle(new Date());
            this.remainingMs = newNextCycle.getTime() - Date.now();
          }
        }
      };
      
      update();
      this.intervalId = setInterval(update, 1000);
    },

    isActivePlan(plan) {
      return this.userVip && this.userVip.level === plan.level;
    },

    async autoUpgrade() {
      if (!this.userVip) return;
      const nextLevel = this.userVip.level + 1;
      const nextPlan = this.plans.find(p => p.level === nextLevel);
      if (!nextPlan) return;
      
      this.openConfirmModal(nextPlan);
    },

    openConfirmModal(plan) {
      if (this.userVip && plan.level <= this.userVip.level) {
        this.showError("لا يمكنك شراء مستوى أقل من مستواك الحالي!");
        return;
      }
      this.selectedPlan = plan;
      this.showConfirmModal = true;
    },

    closeConfirmModal() {
      this.showConfirmModal = false;
    },

    async executePurchase() {
      if (!this.selectedPlan) return;
      
      this.showConfirmModal = false;
      
      this.processing = true;
      this.buyingPlan = this.selectedPlan.level;
      
      try {
        const user = auth.currentUser;
        const userRef = doc(db, "users", user.uid);
        const vipDocRef = doc(db, "users", user.uid, "vip", "current");

        await runTransaction(db, async (transaction) => {
          const userSnap = await transaction.get(userRef);
          if (!userSnap.exists()) {
            throw new Error("المستخدم غير موجود");
          }
          
          const depositBalance = userSnap.data().depositBalance || 0;
          if (depositBalance < this.selectedPlan.price) {
            throw new Error("رصيد الإيداع غير كافٍ لشراء هذا المستوى");
          }

          const now = new Date();
          const vipStart = Timestamp.now();
          const vipEnd = Timestamp.fromMillis(now.getTime() + this.selectedPlan.durationSeconds * 1000);
          
          const lastCycle = this.getLastCompletedCycle(now);
          
          const newDepositBalance = depositBalance - this.selectedPlan.price;
          
          const currentVipBalance = userSnap.data().vipBalance ?? userSnap.data().balance ?? 0;
          const firstReward = this.selectedPlan.daily;
          const newVipBalance = currentVipBalance + firstReward;
          
          transaction.update(userRef, { 
            depositBalance: newDepositBalance,
            vipBalance: newVipBalance
          });
          
          transaction.set(vipDocRef, {
            level: this.selectedPlan.level,
            price: this.selectedPlan.price,
            daily: this.selectedPlan.daily,
            tasks: this.selectedPlan.tasks,
            vipStart: vipStart,
            vipEnd: vipEnd,
            durationSeconds: this.selectedPlan.durationSeconds,
            lastRewardAt: Timestamp.fromDate(lastCycle),
            firstRewardGiven: true,
            firstRewardAt: Timestamp.now()
          });

          const firstRewardRef = doc(collection(db, "users", user.uid, "rewards_history"));
          transaction.set(firstRewardRef, {
            amount: firstReward,
            level: this.selectedPlan.level,
            type: "first_reward",
            cycles: 0,
            isFirstReward: true,
            createdAt: Timestamp.now()
          });

          const logRef = doc(collection(db, "transactions"));
          transaction.set(logRef, {
            userId: user.uid,
            type: "vip_purchase",
            amount: this.selectedPlan.price,
            firstReward: firstReward,
            createdAt: serverTimestamp(),
            status: "completed"
          });
        });

        this.showSuccess(`تم تفعيل VIP ${this.selectedPlan.level} بنجاح! +${this.formatNumberEnglish(this.selectedPlan.daily)} USDT ربح فوري`);
        await this.init();
      } catch (err) {
        this.showError(err.message);
      } finally {
        this.processing = false;
        this.buyingPlan = null;
        this.selectedPlan = null;
      }
    },
    
    showSuccess(message) {
      this.notificationMessage = `✅ ${message}`;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },
    
    showError(message) {
      this.notificationMessage = `❌ ${message}`;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },

    goToShares() {
      if (!this.userVip || this.userVip.level < 8) {
        this.showError('🔒 يجب تفعيل مستوى VIP 8 للوصول إلى أسهم الشركة');
        return;
      }
      this.$router.push('/shares');
    }
  }
};
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: #0b0e11;
  color: #fff;
  direction: rtl;
  padding: 15px;
  font-family: 'Cairo', sans-serif;
}

.container { max-width: 500px; margin: 0 auto; }

.page-title {
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  color: #fcd535;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-glow {
  font-size: 28px;
}

/* تنسيقات زر أسهم الشركة */
.shares-button-container {
  margin-bottom: 25px;
  padding: 0 5px;
}

.shares-button {
  width: 100%;
  background: linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%);
  border: 2px solid #fcd535;
  border-radius: 16px;
  padding: 16px 20px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(252, 213, 53, 0.15);
}

.shares-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.05) 0%, rgba(252, 213, 53, 0.02) 100%);
  transition: all 0.3s ease;
}

.shares-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(252, 213, 53, 0.3);
  border-color: #ffed8a;
}

.shares-button:hover::before {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.1) 0%, rgba(252, 213, 53, 0.05) 100%);
}

.shares-button-content {
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.shares-icon {
  font-size: 32px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.shares-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.shares-title {
  font-size: 18px;
  font-weight: 800;
  color: #fcd535;
  text-shadow: 0 0 10px rgba(252, 213, 53, 0.3);
}

.shares-subtitle {
  font-size: 13px;
  color: #848e9c;
  font-weight: 600;
}

.shares-badge {
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  color: #0b0e11;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

/* إشعار الأرباح */
.profit-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  color: #0b0e11;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  z-index: 3000;
  box-shadow: 0 5px 20px rgba(252, 213, 53, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  white-space: nowrap;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  transform: translateX(-50%) translateY(-100px);
  opacity: 0;
}

/* البطاقة النشطة */
.current-vip-card {
  background: #181a20;
  border: 1.5px solid #fcd535;
  border-radius: 20px;
  padding: 20px 15px;
  margin-bottom: 25px;
  text-align: center;
}

.current-vip-card.elite-user {
  border: 2px solid #fcd535;
  background: linear-gradient(135deg, #181a20, #1f1620);
  box-shadow: 0 0 20px rgba(252, 213, 53, 0.3);
}

.status-header { 
  font-size: 16px; 
  font-weight: 700; 
  color: #fff; 
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.elite-badge-header {
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  color: #0b0e11;
  padding: 2px 10px;
  border-radius: 50px;
  font-size: 12px;
}

.vip-title { font-size: 22px; font-weight: 900; color: #fcd535; margin-bottom: 15px; }

.earnings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.earn-box {
  background: #1e2329;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(252, 213, 53, 0.2);
}

.earn-label { font-size: 11px; color: #848e9c; margin-bottom: 3px; display: flex; align-items: center; gap: 5px; }
.earn-label i { color: #fcd535; font-size: 12px; }
.earn-value { font-size: 14px; color: #fcd535; font-weight: 700; }
.earn-value small { font-size: 10px; }

.remaining-timer { color: #fcd535; font-size: 16px; font-weight: 700; margin-bottom: 10px; }

.last-reward-info {
  font-size: 12px;
  color: #848e9c;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.last-reward-info i { color: #fcd535; }

.details-btn-wrapper { display: flex; justify-content: center; gap: 10px; }
.btn-details-white {
  background: #fff; color: #000; border: none; padding: 5px 15px;
  border-radius: 6px; font-weight: 700; font-size: 13px;
  display: flex; align-items: center; gap: 5px; cursor: pointer;
}

.btn-upgrade-auto {
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  color: #0b0e11;
  border: none;
  padding: 5px 15px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* فلترة الخطط */
.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-btn {
  background: #1e2329;
  border: 1px solid rgba(252, 213, 53, 0.3);
  color: #fff;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #fcd535;
  color: #0b0e11;
  border-color: #fcd535;
}

.filter-btn.elite-filter.active {
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  box-shadow: 0 0 10px rgba(252, 213, 53, 0.5);
}

.filter-btn:hover {
  border-color: #fcd535;
}

/* قائمة VIP */
.vip-list { display: flex; flex-direction: column; gap: 15px; }
.vip-card-item { 
  background: #181a20; 
  border-radius: 16px; 
  border: 1px solid rgba(252, 213, 53, 0.3); 
  overflow: hidden; 
  transition: all 0.3s ease; 
  position: relative;
}
.vip-card-item:hover { border-color: #fcd535; }
.vip-card-item.is-active { border: 2px solid #fcd535; }
.vip-card-item.elite-card {
  border: 1px solid #fcd535;
  background: linear-gradient(135deg, #181a20, #1f1620);
  position: relative;
  overflow: hidden;
}
.vip-card-item.elite-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #fcd535, #ffed8a, #fcd535);
}

/* شريط النخبة */
.elite-ribbon {
  position: absolute;
  top: 12px;
  left: -25px;
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  color: #0b0e11;
  padding: 4px 30px;
  transform: rotate(-45deg);
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 2px 10px rgba(252, 213, 53, 0.3);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
}

.item-header-row {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(252, 213, 53, 0.2);
}
.item-header-row.elite-header {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.15), rgba(255, 237, 138, 0.05));
}
.item-medal-right { font-size: 20px; }
.elite-medal {
  font-size: 24px;
  filter: drop-shadow(0 0 5px #fcd535);
}
.item-title-left { 
  font-size: 16px; 
  font-weight: 800; 
  color: #fcd535;
  display: flex;
  align-items: center;
  gap: 5px;
}
.item-title-left.elite-title {
  font-size: 18px;
  text-shadow: 0 0 5px rgba(252, 213, 53, 0.5);
}
.star-icon {
  font-size: 14px;
}

.item-body { padding: 12px 15px; }
.subscription-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
.subscription-row .label { color: #848e9c; }
.subscription-row .value { font-weight: 700; color: #fff; }
.subscription-row .value.elite-value {
  color: #fcd535;
  font-size: 16px;
}

/* مؤشر ROI */
.roi-display {
  background: rgba(252, 213, 53, 0.1);
  border: 1px solid rgba(252, 213, 53, 0.3);
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  color: #fcd535;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.roi-display.elite-roi {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.2), rgba(255, 237, 138, 0.1));
  border: 1px solid #fcd535;
}

.stats-grid-v2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.mini-stat-v2 {
  background: #1e2329;
  border-radius: 8px;
  padding: 10px 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid rgba(252, 213, 53, 0.2);
}
.mini-stat-v2.elite-stat {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.1), rgba(255, 237, 138, 0.05));
  border: 1px solid rgba(252, 213, 53, 0.5);
}
.full-width-stat { grid-column: span 2; }
.stat-label-v2 { font-size: 10px; color: #848e9c; display: flex; align-items: center; justify-content: center; gap: 4px; }
.gold-icon { color: #fcd535; font-size: 11px; }
.stat-value-v2 { font-size: 13px; font-weight: 700; color: #fcd535; }

.btn-action { 
  width: 100%; 
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  border: none; 
  padding: 10px; 
  border-radius: 10px; 
  color: #0b0e11; 
  font-weight: 700; 
  cursor: pointer; 
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}
.btn-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(252, 213, 53, 0.4);
}
.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-action.elite-btn {
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  box-shadow: 0 2px 10px rgba(252, 213, 53, 0.3);
  font-size: 14px;
}
.btn-action.active { 
  background: rgba(252, 213, 53, 0.15);
  color: #fcd535;
  border: 1px solid #fcd535;
}
.btn-action.elite-btn-active {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.25), rgba(255, 237, 138, 0.15));
  border: 1px solid #fcd535;
  box-shadow: 0 0 10px rgba(252, 213, 53, 0.2);
}

/* علامة النشط */
.active-ribbon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(252, 213, 53, 0.9);
  color: #0b0e11;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 10px;
  font-weight: 700;
}
.active-ribbon.basic {
  background: rgba(252, 213, 53, 0.8);
}

/* شارة النخبة في الأسفل */
.elite-footer {
  margin-top: 25px;
  padding: 15px;
}

.elite-info-box {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.1), rgba(255, 237, 138, 0.05));
  border: 1px solid #fcd535;
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.elite-info-box i {
  font-size: 32px;
  color: #fcd535;
}

.elite-info-content h4 {
  color: #fcd535;
  margin-bottom: 5px;
  font-size: 14px;
}

.elite-info-content p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  margin: 0;
}

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.modal-content { background: #181a20; width: 100%; max-width: 400px; border-radius: 20px; border: 1px solid #fcd535; overflow: hidden; }
.modal-header { padding: 15px 20px; border-bottom: 1px solid #2b2f36; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { color: #fcd535; font-size: 16px; margin: 0; }
.close-btn { background: none; border: none; color: #848e9c; font-size: 24px; cursor: pointer; }
.modal-body { padding: 20px; line-height: 1.6; font-size: 13px; color: #eaecef; }
.investment-text p { margin-bottom: 15px; text-align: justify; }
.section { margin-bottom: 15px; }
.section h4 { color: #fcd535; margin-bottom: 5px; font-size: 14px; }
.section.elite-section h4 { color: #fcd535; text-shadow: 0 0 5px rgba(252, 213, 53, 0.3); }
.section ul { padding-right: 15px; margin: 0; }
.section li { margin-bottom: 5px; }
.modal-footer { padding: 15px; text-align: center; }
.btn-modal-close { background: #fcd535; color: #000; border: none; padding: 8px 25px; border-radius: 8px; font-weight: 700; cursor: pointer; }

/* Custom Confirm Modal */
.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  padding: 20px;
}

.confirm-modal-content {
  background: #181a20;
  width: 100%;
  max-width: 340px;
  border-radius: 24px;
  border: 1px solid #fcd535;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(252, 213, 53, 0.2);
  transform: scale(1);
  transition: transform 0.2s ease;
}

.confirm-modal-header {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.15), rgba(255, 237, 138, 0.05));
  padding: 18px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(252, 213, 53, 0.3);
}

.confirm-modal-header i {
  font-size: 32px;
  color: #fcd535;
  margin-bottom: 8px;
  display: block;
}

.confirm-modal-header h3 {
  color: #fcd535;
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.confirm-modal-body {
  padding: 25px 20px;
  text-align: center;
}

.confirm-modal-body p {
  color: #eaecef;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.highlight-level {
  color: #fcd535;
  font-size: 18px;
  font-weight: 800;
}

.highlight-price {
  color: #fcd535;
  font-size: 16px;
  font-weight: 700;
}

.confirm-modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba(252, 213, 53, 0.2);
}

.confirm-btn-cancel {
  flex: 1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.confirm-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.confirm-btn-confirm {
  flex: 1;
  background: linear-gradient(135deg, #fcd535, #ffed8a);
  border: none;
  color: #0b0e11;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.confirm-btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(252, 213, 53, 0.4);
}

.confirm-btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal transitions */
.modal-fade-scale-enter-active,
.modal-fade-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-scale-enter-from,
.modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-fade-scale-enter-to,
.modal-fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}

.gold-spinner { width: 30px; height: 30px; border: 3px solid rgba(252, 213, 53, 0.1); border-top: 3px solid #fcd535; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
.center { text-align: center; padding: 50px 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* تحسينات الجوال */
@media (max-width: 768px) {
  .profit-notification {
    font-size: 12px;
    padding: 10px 16px;
    white-space: normal;
    text-align: center;
    width: 90%;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .filter-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .details-btn-wrapper {
    flex-direction: column;
    gap: 8px;
  }
  
  .elite-ribbon {
    font-size: 9px;
    padding: 3px 25px;
    left: -20px;
  }
  
  .elite-info-box {
    flex-direction: column;
    text-align: center;
  }

  .confirm-modal-content {
    max-width: 300px;
  }

  .confirm-modal-body p {
    font-size: 14px;
  }

  .highlight-level {
    font-size: 16px;
  }
  
  .shares-button {
    padding: 14px 16px;
  }
  
  .shares-title {
    font-size: 16px;
  }
  
  .shares-subtitle {
    font-size: 11px;
  }
  
  .shares-badge {
    font-size: 11px;
    padding: 6px 12px;
  }
}
</style>
