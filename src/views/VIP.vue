<template>
  <div class="vip-page">
    <div class="container">
      <h1 class="page-title">
        <span class="title-glow">👑</span>
        مستويات VIP
        <span class="title-glow">👑</span>
      </h1>

      <p class="vip-subtitle">اختر مستواك المناسب واستمتع بالمميزات الحصرية</p>

      <!-- تنبيه تجريبي -->
      <div class="disclaimer-box">
        <i class="fas fa-info-circle"></i>
        <span>الأرقام المعروضة تجريبية وغير مضمونة، وهي لأغراض توضيحية فقط</span>
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
            ✨ مستواك الحالي ✨
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
            النخبة (8+)
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
                <span class="value" :class="{ 'elite-value': plan.level >= 8 }">{{ formatNumberEnglishWithCommas(plan.price) }} USDT</span>
              </div>

              <!-- مؤشر العائد على الاستثمار ROI - تجريبي -->
              <div class="roi-display" :class="{ 'elite-roi': plan.level >= 8 }" v-if="plan.price > 0">
                <i class="fas fa-chart-line"></i>
                العائد السنوي التجريبي: {{ formatNumberEnglish(getROI(plan), 1) }}%
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

            <!-- علامة مميزة للخطط النشطة -->
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
              <p>المستويات من VIP 8 فما فوق تتمتع بمميزات حصرية: أولوية الدعم الفني، عمولات إضافية، ومكافآت خاصة</p>
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
            <h3>📊 تفاصيل الخطة</h3>
            <button class="close-btn" @click="showDetailsModal = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="investment-text">
              <p>مرحبًا بك في منصتنا المتطورة، حيث نوفر لك فرصة تحقيق أرباح من خلال نظام تداول ذكي يعتمد على أحدث التقنيات.</p>
              
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

              <div class="disclaimer-text">
                <i class="fas fa-exclamation-triangle"></i>
                <p>جميع الأرقام المعروضة تجريبية وغير مضمونة. يرجى قراءة الشروط والأحكام قبل الاشتراك.</p>
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
      lastDistributedCycle: null,

      plans: [
        { level: 1, name: "VIP 1", price: 20, tasks: 1, daily: 0.15, durationSeconds: 365 * 86400 },
        { level: 2, name: "VIP 2", price: 30, tasks: 1, daily: 0.35, durationSeconds: 365 * 86400 },
        { level: 3, name: "VIP 3", price: 50, tasks: 1, daily: 0.60, durationSeconds: 365 * 86400 },
        { level: 4, name: "VIP 4", price: 70, tasks: 1, daily: 0.85, durationSeconds: 365 * 86400 },
        { level: 5, name: "VIP 5", price: 100, tasks: 1, daily: 1.20, durationSeconds: 365 * 86400 },
        { level: 6, name: "VIP 6", price: 150, tasks: 1, daily: 1.80, durationSeconds: 365 * 86400 },
        { level: 7, name: "VIP 7", price: 200, tasks: 1, daily: 2.40, durationSeconds: 365 * 86400 },
        { level: 8, name: "VIP 8", price: 250, tasks: 1, daily: 3.00, durationSeconds: 365 * 86400 },
        { level: 9, name: "VIP 9", price: 300, tasks: 1, daily: 3.60, durationSeconds: 365 * 86400 },
        { level: 10, name: "VIP 10", price: 350, tasks: 1, daily: 4.20, durationSeconds: 365 * 86400 },
        { level: 11, name: "VIP 11", price: 400, tasks: 1, daily: 4.80, durationSeconds: 365 * 86400 },
        { level: 12, name: "VIP 12", price: 450, tasks: 1, daily: 5.40, durationSeconds: 365 * 86400 },
        { level: 13, name: "VIP 13", price: 500, tasks: 1, daily: 6.00, durationSeconds: 365 * 86400 },
        { level: 14, name: "VIP 14", price: 600, tasks: 1, daily: 7.20, durationSeconds: 365 * 86400 },
        { level: 15, name: "VIP 15", price: 700, tasks: 1, daily: 8.40, durationSeconds: 365 * 86400 },
        { level: 16, name: "VIP 16", price: 800, tasks: 1, daily: 9.60, durationSeconds: 365 * 86400 },
        { level: 17, name: "VIP 17", price: 900, tasks: 1, daily: 10.80, durationSeconds: 365 * 86400 },
        { level: 18, name: "VIP 18", price: 1000, tasks: 1, daily: 12.00, durationSeconds: 365 * 86400 },
        { level: 19, name: "VIP 19", price: 1300, tasks: 1, daily: 15.60, durationSeconds: 365 * 86400 },
        { level: 20, name: "VIP 20", price: 1500, tasks: 1, daily: 18.00, durationSeconds: 365 * 86400 },
        { level: 21, name: "VIP 21", price: 2000, tasks: 1, daily: 24.00, durationSeconds: 365 * 86400 },
        { level: 22, name: "VIP 22", price: 2500, tasks: 1, daily: 30.00, durationSeconds: 365 * 86400 },
        { level: 23, name: "VIP 23", price: 3000, tasks: 1, daily: 36.00, durationSeconds: 365 * 86400 },
        { level: 24, name: "VIP 24", price: 3500, tasks: 1, daily: 42.00, durationSeconds: 365 * 86400 },
        { level: 25, name: "VIP 25", price: 4000, tasks: 1, daily: 48.00, durationSeconds: 365 * 86400 },
        { level: 26, name: "VIP 26", price: 5000, tasks: 1, daily: 60.00, durationSeconds: 365 * 86400 },
        { level: 27, name: "VIP 27", price: 6000, tasks: 1, daily: 72.00, durationSeconds: 365 * 86400 },
        { level: 28, name: "VIP 28", price: 7000, tasks: 1, daily: 84.00, durationSeconds: 365 * 86400 },
        { level: 29, name: "VIP 29", price: 8000, tasks: 1, daily: 96.00, durationSeconds: 365 * 86400 },
        { level: 30, name: "VIP 30", price: 8500, tasks: 1, daily: 102.00, durationSeconds: 365 * 86400 },
        { level: 31, name: "VIP 31", price: 9000, tasks: 1, daily: 108.00, durationSeconds: 365 * 86400 },
        { level: 32, name: "VIP 32", price: 10500, tasks: 1, daily: 126.00, durationSeconds: 365 * 86400 },
        { level: 33, name: "VIP 33", price: 11000, tasks: 1, daily: 132.00, durationSeconds: 365 * 86400 },
        { level: 34, name: "VIP 34", price: 12000, tasks: 1, daily: 144.00, durationSeconds: 365 * 86400 },
        { level: 35, name: "VIP 35", price: 15000, tasks: 1, daily: 180.00, durationSeconds: 365 * 86400 },
        { level: 36, name: "VIP 36", price: 18000, tasks: 1, daily: 216.00, durationSeconds: 365 * 86400 },
        { level: 37, name: "VIP 37", price: 20000, tasks: 1, daily: 240.00, durationSeconds: 365 * 86400 },
        { level: 38, name: "VIP 38", price: 25000, tasks: 1, daily: 300.00, durationSeconds: 365 * 86400 },
        { level: 39, name: "VIP 39", price: 30000, tasks: 1, daily: 360.00, durationSeconds: 365 * 86400 },
        { level: 40, name: "VIP 40", price: 40000, tasks: 1, daily: 480.00, durationSeconds: 365 * 86400 },
        { level: 41, name: "VIP 41", price: 50000, tasks: 1, daily: 600.00, durationSeconds: 365 * 86400 },
        { level: 42, name: "VIP 42", price: 60000, tasks: 1, daily: 720.00, durationSeconds: 365 * 86400 },
        { level: 43, name: "VIP 43", price: 70000, tasks: 1, daily: 840.00, durationSeconds: 365 * 86400 },
        { level: 44, name: "VIP 44", price: 80000, tasks: 1, daily: 960.00, durationSeconds: 365 * 86400 },
        { level: 45, name: "VIP 45", price: 90000, tasks: 1, daily: 1080.00, durationSeconds: 365 * 86400 },
        { level: 46, name: "VIP 46", price: 100000, tasks: 1, daily: 1200.00, durationSeconds: 365 * 86400 },
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
            const currentBalance = userSnap.data().balance ?? 0;
            const newBalance = currentBalance + reward;
            transaction.update(userDocRef, { balance: newBalance });
            
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
        
        if (this.remainingMs <= 0) {
          const currentCycleKey = nextCycle.toISOString().split('T')[0];
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
          
          const balance = userSnap.data().balance || 0;
          if (balance < this.selectedPlan.price) {
            throw new Error("الرصيد غير كافٍ لشراء هذا المستوى");
          }

          const now = new Date();
          const vipStart = Timestamp.now();
          const vipEnd = Timestamp.fromMillis(now.getTime() + this.selectedPlan.durationSeconds * 1000);
          const lastCycle = this.getLastCompletedCycle(now);
          
          const newBalance = balance - this.selectedPlan.price;
          const firstReward = this.selectedPlan.daily;
          const newBalanceAfterReward = newBalance + firstReward;
          
          transaction.update(userRef, { balance: newBalanceAfterReward });
          
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
    }
  }
};
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: #0a0e17;
  color: #fff;
  direction: rtl;
  padding: 15px;
  font-family: 'Cairo', sans-serif;
}

.container { max-width: 500px; margin: 0 auto; }

.page-title {
  text-align: center;
  font-size: 26px;
  font-weight: 900;
  color: #d4af37;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-glow {
  font-size: 28px;
}

.vip-subtitle {
  text-align: center;
  color: rgba(255,255,255,0.6);
  font-size: 14px;
  margin-bottom: 20px;
}

/* تنبيه تجريبي */
.disclaimer-box {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #d4af37;
  font-size: 12px;
  font-weight: 600;
}

.disclaimer-box i {
  font-size: 16px;
  flex-shrink: 0;
}

/* إشعار الأرباح */
.profit-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #d4af37, #f0d060);
  color: #0a0e17;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  z-index: 3000;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
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
  background: #121926;
  border: 1.5px solid #d4af37;
  border-radius: 20px;
  padding: 20px 15px;
  margin-bottom: 25px;
  text-align: center;
}

.current-vip-card.elite-user {
  border: 2px solid #d4af37;
  background: linear-gradient(135deg, #121926, #1a1420);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
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
  background: linear-gradient(135deg, #d4af37, #f0d060);
  color: #0a0e17;
  padding: 2px 10px;
  border-radius: 50px;
  font-size: 12px;
}

.vip-title { 
  font-size: 28px; 
  font-weight: 900; 
  color: #d4af37; 
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

.earnings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.earn-box {
  background: #1a2230;
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.earn-label { 
  font-size: 11px; 
  color: rgba(255,255,255,0.5); 
  margin-bottom: 3px; 
  display: flex; 
  align-items: center; 
  gap: 5px; 
}
.earn-label i { color: #d4af37; font-size: 12px; }
.earn-value { font-size: 16px; color: #d4af37; font-weight: 700; }
.earn-value small { font-size: 10px; color: rgba(255,255,255,0.5); }

.remaining-timer { 
  color: #d4af37; 
  font-size: 15px; 
  font-weight: 600; 
  margin-bottom: 10px; 
}

.last-reward-info {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.last-reward-info i { color: #d4af37; }

.details-btn-wrapper { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.btn-details-white {
  background: #fff; 
  color: #0a0e17; 
  border: none; 
  padding: 8px 18px;
  border-radius: 8px; 
  font-weight: 700; 
  font-size: 13px;
  display: flex; 
  align-items: center; 
  gap: 6px; 
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-details-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255,255,255,0.15);
}

.btn-upgrade-auto {
  background: linear-gradient(135deg, #d4af37, #f0d060);
  color: #0a0e17;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-upgrade-auto:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

/* فلترة الخطط */
.filter-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  background: #121926;
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: rgba(255,255,255,0.6);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #d4af37;
  color: #0a0e17;
  border-color: #d4af37;
}

.filter-btn.elite-filter.active {
  background: linear-gradient(135deg, #d4af37, #f0d060);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
}

.filter-btn:hover {
  border-color: #d4af37;
  color: #fff;
}

/* قائمة VIP */
.vip-list { display: flex; flex-direction: column; gap: 15px; }
.vip-card-item { 
  background: #121926; 
  border-radius: 16px; 
  border: 1px solid rgba(212, 175, 55, 0.2); 
  overflow: hidden; 
  transition: all 0.3s ease; 
  position: relative;
}
.vip-card-item:hover { 
  border-color: #d4af37; 
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}
.vip-card-item.is-active { border: 2px solid #d4af37; }
.vip-card-item.elite-card {
  border: 1px solid rgba(212, 175, 55, 0.3);
  background: linear-gradient(135deg, #121926, #1a1420);
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
  background: linear-gradient(90deg, #d4af37, #f0d060, #d4af37);
}

/* شريط النخبة */
.elite-ribbon {
  position: absolute;
  top: 12px;
  left: -25px;
  background: linear-gradient(135deg, #d4af37, #f0d060);
  color: #0a0e17;
  padding: 4px 30px;
  transform: rotate(-45deg);
  font-size: 10px;
  font-weight: 800;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
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
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}
.item-header-row.elite-header {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(240, 208, 96, 0.05));
}
.item-medal-right { font-size: 22px; }
.elite-medal {
  font-size: 26px;
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
}
.item-title-left { 
  font-size: 17px; 
  font-weight: 800; 
  color: #d4af37;
  display: flex;
  align-items: center;
  gap: 5px;
}
.item-title-left.elite-title {
  font-size: 19px;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}
.star-icon {
  font-size: 14px;
}

.item-body { padding: 12px 15px; }
.subscription-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
.subscription-row .label { color: rgba(255,255,255,0.5); }
.subscription-row .value { font-weight: 700; color: #fff; }
.subscription-row .value.elite-value {
  color: #d4af37;
  font-size: 17px;
}

/* مؤشر ROI - تجريبي */
.roi-display {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #d4af37;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.roi-display.elite-roi {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(240, 208, 96, 0.08));
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.stats-grid-v2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.mini-stat-v2 {
  background: #1a2230;
  border-radius: 8px;
  padding: 10px 5px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}
.mini-stat-v2.elite-stat {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(240, 208, 96, 0.04));
  border: 1px solid rgba(212, 175, 55, 0.2);
}
.full-width-stat { grid-column: span 2; }
.stat-label-v2 { font-size: 10px; color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; gap: 4px; }
.gold-icon { color: #d4af37; font-size: 11px; }
.stat-value-v2 { font-size: 14px; font-weight: 700; color: #d4af37; }

.btn-action { 
  width: 100%; 
  background: linear-gradient(135deg, #d4af37, #f0d060);
  border: none; 
  padding: 10px; 
  border-radius: 10px; 
  color: #0a0e17; 
  font-weight: 700; 
  cursor: pointer; 
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}
.btn-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}
.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-action.elite-btn {
  background: linear-gradient(135deg, #d4af37, #f0d060);
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.2);
  font-size: 15px;
}
.btn-action.active { 
  background: rgba(212, 175, 55, 0.12);
  color: #d4af37;
  border: 1px solid #d4af37;
}
.btn-action.elite-btn-active {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(240, 208, 96, 0.1));
  border: 1px solid #d4af37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
}

/* علامة النشط */
.active-ribbon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(212, 175, 55, 0.9);
  color: #0a0e17;
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 10px;
  font-weight: 700;
}
.active-ribbon.basic {
  background: rgba(212, 175, 55, 0.8);
}

/* شارة النخبة في الأسفل */
.elite-footer {
  margin-top: 25px;
  padding: 15px;
}

.elite-info-box {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(240, 208, 96, 0.04));
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.elite-info-box i {
  font-size: 32px;
  color: #d4af37;
}

.elite-info-content h4 {
  color: #d4af37;
  margin-bottom: 5px;
  font-size: 14px;
}

.elite-info-content p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 0;
}

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
.modal-content { background: #121926; width: 100%; max-width: 400px; border-radius: 20px; border: 1px solid rgba(212, 175, 55, 0.3); overflow: hidden; }
.modal-header { padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { color: #d4af37; font-size: 16px; margin: 0; }
.close-btn { background: none; border: none; color: rgba(255,255,255,0.4); font-size: 24px; cursor: pointer; transition: all 0.3s; }
.close-btn:hover { color: #fff; transform: rotate(90deg); }
.modal-body { padding: 20px; line-height: 1.6; font-size: 13px; color: rgba(255,255,255,0.8); max-height: 60vh; overflow-y: auto; }
.investment-text p { margin-bottom: 15px; text-align: justify; }
.section { margin-bottom: 15px; }
.section h4 { color: #d4af37; margin-bottom: 5px; font-size: 14px; }
.section.elite-section h4 { color: #d4af37; text-shadow: 0 0 10px rgba(212, 175, 55, 0.15); }
.section ul { padding-right: 18px; margin: 0; }
.section li { margin-bottom: 5px; }

.disclaimer-text {
  background: rgba(212, 175, 55, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 15px;
}

.disclaimer-text i {
  color: #d4af37;
  font-size: 16px;
  margin-top: 2px;
}

.disclaimer-text p {
  margin: 0;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.modal-footer { padding: 15px; text-align: center; }
.btn-modal-close { background: #d4af37; color: #0a0e17; border: none; padding: 8px 25px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
.btn-modal-close:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }

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
  background: #121926;
  width: 100%;
  max-width: 340px;
  border-radius: 24px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  overflow: hidden;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.1);
  transform: scale(1);
  transition: transform 0.2s ease;
}

.confirm-modal-header {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(240, 208, 96, 0.05));
  padding: 18px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}

.confirm-modal-header i {
  font-size: 32px;
  color: #d4af37;
  margin-bottom: 8px;
  display: block;
}

.confirm-modal-header h3 {
  color: #d4af37;
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.confirm-modal-body {
  padding: 25px 20px;
  text-align: center;
}

.confirm-modal-body p {
  color: rgba(255,255,255,0.8);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.highlight-level {
  color: #d4af37;
  font-size: 18px;
  font-weight: 800;
}

.highlight-price {
  color: #d4af37;
  font-size: 16px;
  font-weight: 700;
}

.confirm-modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.12);
}

.confirm-btn-cancel {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255,255,255,0.6);
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
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.confirm-btn-confirm {
  flex: 1;
  background: linear-gradient(135deg, #d4af37, #f0d060);
  border: none;
  color: #0a0e17;
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
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
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

.gold-spinner { width: 30px; height: 30px; border: 3px solid rgba(212, 175, 55, 0.1); border-top: 3px solid #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { to { transform: rotate(360deg); } }
.center { text-align: center; padding: 50px 0; }
.loading-text { color: rgba(255,255,255,0.4); font-size: 14px; }
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
  
  .page-title {
    font-size: 22px;
  }
  
  .earnings-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .stats-grid-v2 {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 400px) {
  .earnings-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid-v2 {
    grid-template-columns: 1fr;
  }
  
  .full-width-stat {
    grid-column: span 1;
  }
}
</style>
