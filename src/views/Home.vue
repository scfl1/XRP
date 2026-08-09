<template>
  <div class="home-container" :dir="currentLang === 'AR' ? 'rtl' : 'ltr'">

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
              {{ modal.buttonText || 'فهمت' }}
            </button>
          </div>
          <div class="modal-gold-line"></div>
        </div>
      </div>
    </transition>

    <!-- ==================== HEADER ==================== -->
    <header class="app-header">
      <div class="header-top">
        <button class="menu-btn" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>

        <div class="balance-display">
          <div class="balance-label">{{ t('totalBalance') }}</div>
          <div class="balance-value">
            <span class="amount">{{ formatNumber(totalBalance) }}</span>
            <span class="currency">USDT</span>
          </div>
          <button class="refresh-btn" @click="refreshBalance" :disabled="refreshing">
            <i :class="refreshing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
          </button>
        </div>

        <button class="notif-btn" @click="showNotifications">
          <i class="fas fa-bell"></i>
          <span class="notif-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </button>
      </div>

      <div class="welcome-section">
        <span class="welcome-text">{{ t('welcome') }}</span>
        <span class="user-name">{{ username }}</span>
      </div>
    </header>

    <!-- ==================== UNIFIED BALANCE ==================== -->
    <div class="balance-single-section">
      <div class="balance-single-card">
        <div class="balance-single-top">
          <div>
            <div class="balance-single-label">{{ t('totalBalance') }}</div>
            <div class="balance-single-subtitle">{{ t('availableBalance') }}</div>
          </div>
          <div class="xrp-mark">XRP</div>
        </div>
        <div class="balance-single-value">
          <span>{{ formatNumber(totalBalance) }}</span>
          <small>USDT</small>
        </div>
        <div class="balance-single-footer">
          <span><i class="fas fa-circle-check"></i> {{ t('unifiedBalance') }}</span>
          <button class="refresh-btn light" @click="refreshBalance" :disabled="refreshing">
            <i :class="refreshing ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== SEARCH SECTION ==================== -->
    <div class="search-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          :placeholder="t('searchPlaceholder')"
          v-model="searchQuery"
        >
        <button class="filter-btn" @click="showInfoMessage(t('searchFeatureMessage'))">
          <i class="fas fa-filter"></i>
        </button>
      </div>
    </div>

    <!-- ==================== QUICK ACTIONS CARDS ==================== -->
    <div class="quick-actions">
      <div class="action-card deposit" @click="navigateTo('/recharge')">
        <div class="action-icon">
          <i class="fas fa-plus-circle"></i>
        </div>
        <div class="action-text">
          <div class="action-title">{{ t('deposit') }}</div>
          <div class="action-subtitle">{{ t('addFunds') }}</div>
        </div>
      </div>

      <div class="action-card withdraw" @click="navigateTo('/withdraw')">
        <div class="action-icon">
          <i class="fas fa-minus-circle"></i>
        </div>
        <div class="action-text">
          <div class="action-title">{{ t('withdraw') }}</div>
          <div class="action-subtitle">{{ t('cashout') }}</div>
        </div>
      </div>

      <div class="action-card team" @click="navigateTo('/team')">
        <div class="action-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="action-text">
          <div class="action-title">{{ t('team') }}</div>
          <div class="action-subtitle">{{ t('myReferrals') }}</div>
        </div>
      </div>

      <div class="action-card history" @click="navigateTo('/transactions')">
        <div class="action-icon">
          <i class="fas fa-history"></i>
        </div>
        <div class="action-text">
          <div class="action-title">{{ t('transactions') }}</div>
          <div class="action-subtitle">{{ t('viewHistory') }}</div>
        </div>
      </div>
    </div>

    <!-- ==================== PROMO BANNER ==================== -->
    <div class="promo-banner">
      <span class="banner-emoji">⭐</span>
      <span class="banner-text">إدارة أبسط، رصيد موحّد، وتجربة XRP بتصميم أبيض وأسود</span>
    </div>

    <!-- ==================== MAIN MENU ==================== -->
    <div class="main-menu">
      <div 
        v-for="item in menuItems" 
        :key="item.id"
        class="menu-item"
        :class="{ small: item.small }"
        @click="handleMenuClick(item)"
      >
        <div class="menu-icon" :class="item.iconClass">
          <i :class="item.icon"></i>
          <span class="badge" v-if="item.badge">{{ item.badge }}</span>
        </div>
        <span class="menu-title">{{ t(item.title) }}</span>
        <i class="fas fa-chevron-left menu-arrow"></i>
      </div>

      <div class="menu-item special small" @click="showCompanyModal">
        <div class="menu-icon gold">
          <i class="fas fa-building"></i>
        </div>
        <span class="menu-title">{{ t('aboutCompany') }}</span>
        <i class="fas fa-chevron-left menu-arrow"></i>
      </div>
      </div>


    <!-- ==================== MODAL: COMPANY INFO ==================== -->
    <transition name="modal">
      <div v-if="showCompany" class="modal-overlay" @click.self="closeCompanyModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>XRP</h3>
            <button class="close-btn" @click="closeCompanyModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="company-text">
              <p>
                مرحباً بكم في الواجهة الرقمية الجديدة. تم تصميم هذه الصفحة لتقديم تجربة بسيطة وواضحة لإدارة الرصيد والخدمات الرقمية من مكان واحد.<br><br>
                تعتمد الواجهة على تصميم أبيض وأسود حديث مع إبراز XRP كهوية بصرية للأصل الرقمي، مع عرض الرصيد بشكل موحّد بدلاً من تقسيمه إلى أرصدة منفصلة.<br><br>
                هدفنا من هذا التصميم هو جعل الوصول إلى المعلومات والعمليات الأساسية أكثر سهولة، وتقليل العناصر المشتتة، وتقديم تجربة استخدام سريعة ومتناسقة على الهاتف والكمبيوتر.<br><br>
                نحرص على إبقاء المعلومات المعروضة داخل الحساب واضحة وقابلة للمراجعة، وأي تفاصيل مالية أو شروط تشغيلية يجب أن تعتمد على بيانات الحساب الفعلية وإعدادات النظام، وليس على أرقام أو إشعارات تجريبية.
              </p>
            </div>

            <div class="vip-section">
              <h4>📊 {{ t('vipPlans') }}</h4>
              <div class="vip-list">
                <div v-for="vip in vipPlans.slice(0, 4)" :key="vip.level" class="vip-item">
                  <div class="vip-level">{{ vip.level }}</div>
                  <div class="vip-info">
                    <span>{{ vip.recharge }} USDT</span>
                    <span>{{ vip.daily }} USDT/{{ t('daily') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="commission-section">
              <h4>🤝 {{ t('commissionSystem') }}</h4>
              <div class="commission-list">
                <div class="comm-item">
                  <span>{{ t('level1') }}</span>
                  <strong>6%</strong>
                </div>
                <div class="comm-item">
                  <span>{{ t('level2') }}</span>
                  <strong>2%</strong>
                </div>
                <div class="comm-item">
                  <span>{{ t('level3') }}</span>
                  <strong>1%</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-ok" @click="closeCompanyModal">{{ t('understood') }}</button>
          </div>
        </div>
      </div>
    </transition>


    <!-- ==================== SIDEBAR ==================== -->
    <transition name="slide">
      <div v-if="sidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    </transition>
    <transition name="slide">
      <aside v-if="sidebarOpen" class="sidebar">
        <div class="sidebar-header">
          <span>XRP</span>
          <button @click="toggleSidebar"><i class="fas fa-times"></i></button>
        </div>
        <nav class="sidebar-nav">
          <a v-for="item in navItems" :key="item.path" @click="navigateTo(item.path); toggleSidebar()">
            <i :class="item.icon"></i>
            <span>{{ t(item.label) }}</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <button @click="toggleLanguage">
            <i class="fas fa-globe"></i> {{ currentLang }}
          </button>
        </div>
      </aside>
    </transition>

  </div>
</template>

<script>
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "HomePage",

  data() {
    return {
      username: "جار التحميل...",
      balance: 0,
      currentUserUid: null,
      refreshing: false,
      
      showCompany: false,
      sidebarOpen: false,
      searchQuery: "",
      unreadCount: 3,
      currentLang: localStorage.getItem("app_language") || "AR",

      // ==================== REVIEW SYSTEM ====================
      
      flags: [
        '🇸🇦', '🇪🇬', '🇩🇿', '🇲🇦', '🇮🇶', '🇸🇩', '🇯🇴', '🇱🇧', '🇵🇸', '🇦🇪', '🇶🇦', '🇰🇼',
        '🇧🇭', '🇴🇲', '🇾🇪', '🇱🇾', '🇹🇳', '🇲🇷', '🇸🇴', '🇩🇯', '🇰🇲', '🇺🇸', '🇬🇧', '🇫🇷'
      ],
      
      amounts: [
        50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000,
        1200, 1500, 1800, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
        6000, 7000, 8000, 9000, 10000, 12000, 15000, 18000, 20000,
        25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000,
        90000, 100000, 120000, 150000
      ],

      withdrawalDays: [
        { id: 1, day: "السبت", vips: "VIP1 - VIP2 - VIP3" },
        { id: 2, day: "الأحد", vips: "VIP4 - VIP5" },
        { id: 3, day: "الاثنين", vips: "VIP6 - VIP7" }
      ],

      vipPlans: [
        { level: 'VIP 1', recharge: '0', daily: '0.15' },
        { level: 'VIP 2', recharge: '10', daily: '0.35' },
        { level: 'VIP 3', recharge: '50', daily: '1.60' },
        { level: 'VIP 4', recharge: '100', daily: '3.25' },
        { level: 'VIP 5', recharge: '300', daily: '10' },
        { level: 'VIP 6', recharge: '900', daily: '33' },
        { level: 'VIP 7', recharge: '1350', daily: '51' },
        { level: 'VIP 8', recharge: '1800', daily: '70' },
        { level: 'VIP 9', recharge: '3600', daily: '150' },
        { level: 'VIP 10', recharge: '7200', daily: '330' }
      ],

      menuItems: [
        { id: 5, title: 'agency', icon: 'fas fa-id-card', iconClass: 'icon-agency', route: '/agency', badge: null, small: true },
        { id: 6, title: 'program', icon: 'fas fa-download', iconClass: 'icon-program', route: '/program', small: true }
      ],

      navItems: [
        { path: '/home', icon: 'fas fa-home', label: 'home' },
        { path: '/vip', icon: 'fas fa-crown', label: 'vip' },
        { path: '/tasks', icon: 'fas fa-tasks', label: 'tasks' },
        { path: '/team', icon: 'fas fa-users', label: 'team' },
        { path: '/profile', icon: 'fas fa-user', label: 'profile' }
      ],
      
      translations: {
        AR: {
          totalBalance: 'الرصيد الإجمالي',
          welcome: 'مرحباً',
          searchPlaceholder: 'ابحث عن ميزة...',
          searchFeatureMessage: 'ميزة البحث قيد التطوير قريباً',
          deposit: 'تعبئة رصيد',
          addFunds: 'أضف أموال',
          withdraw: 'سحب',
          cashout: 'سحب الأرباح',
          team: 'الفريق',
          myReferrals: 'إحالاتي',
          transactions: 'المعاملات',
          viewHistory: 'عرض السجل',
          globalPartnerships: 'تجربة رقمية حديثة بهوية XRP',
          aboutCompany: 'الشركة',
          vipPlans: 'خطط العضوية',
          daily: 'يومي',
          commissionSystem: 'نظام العمولات',
          level1: 'المستوى 1',
          level2: 'المستوى 2',
          level3: 'المستوى 3',
          understood: 'فهمت',
          businessContracts: 'عقود رجال الأعمال',
          vipWithdrawalSchedule: 'مواعيد سحب الرواتب',
          iAccept: 'أوافق',
          home: 'الرئيسية',
          vip: 'VIP',
          tasks: 'المهام',
          profile: 'حسابي',
          agency: 'وكالة',
          program: 'تحميل التطبيق',
          balanceUpdated: 'تم تحديث الرصيد بنجاح ✓',
          refreshError: 'حدث خطأ في تحديث الرصيد، حاول مرة أخرى',
          languageChanged: 'تم تغيير اللغة بنجاح',
          reviewSubmitted: 'تم إرسال تقييمك بنجاح! شكراً لك على مشاركتنا رأيك',
          pleaseSelectRating: 'الرجاء اختيار تقييم بالنجوم أولاً',
        },
        EN: {
          totalBalance: 'Total Balance',
          welcome: 'Welcome',
          searchPlaceholder: 'Search feature...',
          searchFeatureMessage: 'Search feature coming soon',
          deposit: 'Deposit',
          addFunds: 'Add Funds',
          withdraw: 'Withdraw',
          cashout: 'Cash Out',
          team: 'Team',
          myReferrals: 'My Referrals',
          transactions: 'Transactions',
          viewHistory: 'View History',
          globalPartnerships: 'Modern digital experience with XRP identity',
          aboutCompany: 'Company',
          vipPlans: 'Membership Plans',
          daily: 'Daily',
          commissionSystem: 'Commission System',
          level1: 'Level 1',
          level2: 'Level 2',
          level3: 'Level 3',
          understood: 'Understood',
          businessContracts: 'Business Contracts',
          vipWithdrawalSchedule: 'Withdrawal Schedule',
          iAccept: 'I Accept',
          home: 'Home',
          vip: 'VIP',
          tasks: 'Tasks',
          profile: 'Profile',
          agency: 'Agency',
          program: 'Download App',
          balanceUpdated: 'Balance updated successfully ✓',
          refreshError: 'Error refreshing balance, please try again',
          languageChanged: 'Language changed successfully',
          reviewSubmitted: 'Your review has been submitted successfully! Thank you for sharing your feedback',
          pleaseSelectRating: 'Please select a star rating first',
        }
      }
    };
  },

  computed: {
    totalBalance() {
      return this.balance;
    },
  },

  created() {
    this.initAuth();
  },

  mounted() {
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
        buttonText: options.buttonText || 'فهمت',
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

    showInfoMessage(message) {
      this.showModal({
        type: 'info',
        title: 'معلومات',
        message: message,
        buttonText: 'فهمت',
        size: 'small'
      });
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

    t(key) {
      return this.translations[this.currentLang]?.[key] || this.translations['AR'][key] || key;
    },

    formatLargeNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toFixed(0);
    },


    async initAuth() {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          this.username = "Guest";
          this.balance = 0;
          this.$router.push("/login");
          return;
        }

        this.currentUserUid = user.uid;
        await this.fetchUserData(user.uid);
      });
    },

    async fetchUserData(uid) {
      try {
        const userRef = doc(db, "users", uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.username = data.username || data.email || "User";
          
          // ✅ الإصلاح النهائي باستخدام Nullish Coalescing
          this.balance = Number(data.balance ?? ((Number(data.vipBalance ?? 0)) + (Number(data.depositBalance ?? 0))));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    async refreshBalance() {
      if (this.refreshing || !this.currentUserUid) return;
      
      this.refreshing = true;
      try {
        const userRef = doc(db, "users", this.currentUserUid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // ✅ الإصلاح النهائي باستخدام Nullish Coalescing
          this.balance = Number(data.balance ?? ((Number(data.vipBalance ?? 0)) + (Number(data.depositBalance ?? 0))));
          
          this.showSuccessMessage(this.t('balanceUpdated'));
        }
      } catch (error) {
        console.error("Refresh error:", error);
        this.showErrorMessage(this.t('refreshError'));
      } finally {
        setTimeout(() => { this.refreshing = false; }, 500);
      }
    },

    navigateTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    },

    handleMenuClick(item) {
      if (item.route) {
        this.navigateTo(item.route);
      }
    },
    
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      document.body.style.overflow = this.sidebarOpen ? 'hidden' : 'auto';
    },

    toggleLanguage() {
      this.currentLang = this.currentLang === 'AR' ? 'EN' : 'AR';
      localStorage.setItem('app_language', this.currentLang);
      document.documentElement.dir = this.currentLang === 'AR' ? 'rtl' : 'ltr';
      document.documentElement.lang = this.currentLang.toLowerCase();
      this.showSuccessMessage(this.t('languageChanged'));
    },
    
    showNotifications() {
      this.$router.push('/notifications');
    },
    
    showCompanyModal() {
      this.showCompany = true;
      document.body.style.overflow = 'hidden';
    },

    closeCompanyModal() {
      this.showCompany = false;
      document.body.style.overflow = 'auto';
    },
  }
};
</script>

<style scoped>
/* ==================== BASE STYLES ==================== */
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  color: #ffffff;
  font-family: 'Cairo', sans-serif;
  padding-bottom: 80px;
  position: relative;
  overflow-x: hidden;
}


/* ==================== CUSTOM MODAL SYSTEM ==================== */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.custom-modal-container {
  background: linear-gradient(145deg, rgba(26, 31, 46, 0.98), rgba(15, 20, 25, 0.98));
  border-radius: 28px;
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2);
  animation: modalFloatIn 0.35s cubic-bezier(0.21, 1.11, 0.35, 1);
}

.custom-modal-container.small {
  max-width: 400px;
}

.custom-modal-container.review-modal {
  max-width: 500px;
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
  padding: 22px 24px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
}

.custom-modal-header .header-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.custom-modal-header.info .header-icon {
  background: rgba(33, 150, 243, 0.15);
  color: #2196F3;
}

.custom-modal-header.success .header-icon {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.custom-modal-header.error .header-icon {
  background: rgba(244, 67, 54, 0.15);
  color: #F44336;
}

.custom-modal-header.confirm .header-icon {
  background: rgba(212, 175, 55, 0.15);
  color: #D4AF37;
}

.custom-modal-header h3 {
  flex: 1;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #F6E27A;
}

.modal-close-btn {
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: rotate(90deg);
}

.custom-modal-body {
  padding: 24px;
}

.custom-modal-body p {
  margin: 0;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  text-align: center;
}

.confirm-options {
  display: flex;
  gap: 15px;
  margin-top: 28px;
  justify-content: center;
}

.custom-modal-footer {
  padding: 16px 24px 24px;
}

.modal-btn {
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.modal-btn-primary {
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0f1419;
  font-weight: 700;
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
}

.modal-btn-primary:active {
  transform: translateY(1px);
}

.modal-btn-confirm {
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0f1419;
  flex: 1;
}

.modal-btn-cancel {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.3);
  flex: 1;
}

.modal-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(212, 175, 55, 0.5);
}

.modal-gold-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #D4AF37, #F6E27A, #D4AF37, transparent);
  animation: goldShine 2s linear infinite;
}

@keyframes goldShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ==================== RATING STARS ==================== */
.rating-stars {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.star {
  font-size: 40px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.2);
  transition: all 0.2s;
}

.star.active {
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.star:hover {
  transform: scale(1.1);
  color: #FFD700;
}

.review-message-input {
  margin-bottom: 20px;
}

.review-message-input textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
}

.review-message-input textarea:focus {
  outline: none;
  border-color: #D4AF37;
}

/* ==================== زر إرسال التقييم ==================== */
.submit-review-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  border: none;
  border-radius: 50px;
  color: #0f1419;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin: 20px 0;
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.submit-review-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.5);
}

.submit-review-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ==================== التقييمات السابقة ==================== */
.previous-reviews {
  margin-top: 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding-top: 15px;
}

.previous-reviews h4 {
  color: #D4AF37;
  font-size: 14px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviews-list {
  max-height: 300px;
  overflow-y: auto;
}

.review-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-bottom: 10px;
}

.review-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #0f1419;
  flex-shrink: 0;
}

.review-content {
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 5px;
}

.review-name {
  font-weight: 600;
  color: #D4AF37;
}

.review-country {
  font-size: 12px;
}

.review-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.review-stars {
  margin-bottom: 5px;
}

.small-star {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.2);
}

.small-star.active {
  color: #FFD700;
}

.review-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}


/* ==================== QUICK STATS SECTION ==================== */
.stats-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 800;
  color: #D4AF37;
  margin: 0 0 16px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.stat-card {
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 18px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.stat-card.gold-border {
  border: 2px solid #D4AF37;
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: #D4AF37;
}

.stat-icon {
  font-size: 28px;
  color: #D4AF37;
  margin-bottom: 10px;
}

.stat-icon i {
  font-size: 28px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #F6E27A;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

/* VIP Features in Terms */
.vip-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
  padding: 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #F6E27A;
}

.feature-item i {
  color: #4CAF50;
  font-size: 14px;
}

.info-note {
  background: rgba(33, 150, 243, 0.1);
  border-right: 3px solid #2196F3;
  border-radius: 10px;
  padding: 14px;
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.info-note i {
  color: #2196F3;
  font-size: 18px;
  margin-top: 2px;
}

.info-note p {
  margin: 0;
  color: #64B5F6;
  font-size: 13px;
}

/* ==================== REST OF STYLES ==================== */
.app-header {
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  padding: 16px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.menu-btn,
.notif-btn {
  background: none;
  border: none;
  color: #D4AF37;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  position: relative;
  transition: all 0.2s;
}

.menu-btn:hover,
.notif-btn:hover {
  background: rgba(212, 175, 55, 0.1);
}

.balance-display {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin: 0 12px;
}

.balance-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.balance-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.amount {
  font-size: 22px;
  font-weight: 800;
  color: #F6E27A;
  font-family: monospace;
}

.currency {
  font-size: 12px;
  color: #D4AF37;
  font-weight: 700;
}

.refresh-btn {
  background: none;
  border: none;
  color: #D4AF37;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notif-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ff3b30;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.welcome-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.user-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.search-section {
  padding: 12px 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 14px;
  padding: 12px 16px;
}

.search-box i {
  color: rgba(255, 255, 255, 0.5);
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.filter-btn {
  background: none;
  border: none;
  color: #D4AF37;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  transform: scale(1.1);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
}

.action-card {
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-3px);
  border-color: #D4AF37;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.15);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.action-card.deposit .action-icon { background: linear-gradient(135deg, #4CAF50, #45a049); }
.action-card.withdraw .action-icon { background: linear-gradient(135deg, #2196F3, #1976D2); }
.action-card.team .action-icon { background: linear-gradient(135deg, #FF9800, #F57C00); }
.action-card.history .action-icon { background: linear-gradient(135deg, #9C27B0, #7B1FA2); }

.action-text {
  display: flex;
  flex-direction: column;
}

.action-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.action-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.promo-banner {
  margin: 0 16px 20px;
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  border-radius: 14px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
  cursor: pointer;
  transition: all 0.3s;
}

.promo-banner:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
}

.banner-emoji {
  font-size: 24px;
}

.banner-text {
  font-size: 13px;
  font-weight: 700;
  color: #0f1419;
  text-align: center;
}

.main-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 0 16px;
}

.menu-item {
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-item:hover {
  transform: translateY(-5px);
  border-color: #D4AF37;
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.15);
}

.menu-item.special {
  border: 2px solid #D4AF37;
}

.menu-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #D4AF37;
  position: relative;
}

.menu-icon.gold {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(246, 226, 122, 0.1));
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  border: 2px solid #0f1419;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

.menu-arrow {
  color: rgba(212, 175, 55, 0.5);
  font-size: 10px;
}

.menu-item.small {
  padding: 12px 8px;
}

.menu-item.small .menu-icon {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.menu-item.small .menu-title {
  font-size: 11px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 20, 25, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  border: 2px solid #D4AF37;
  display: flex;
  flex-direction: column;
  animation: modalIn 0.3s;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #0f1419;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.close-btn {
  background: rgba(15, 20, 25, 0.2);
  border: none;
  color: #0f1419;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(15, 20, 25, 0.4);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.company-text,
.terms-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 2;
  font-size: 14px;
}

.company-text p,
.terms-text p {
  margin: 0 0 16px;
  text-align: justify;
}

.terms-text h4 {
  color: #D4AF37;
  margin: 20px 0 12px;
  font-size: 16px;
}

.vip-section,
.commission-section {
  margin-top: 24px;
}

.vip-section h4,
.commission-section h4 {
  color: #D4AF37;
  text-align: center;
  margin: 0 0 16px;
  font-size: 16px;
}

.vip-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vip-item {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-level {
  font-weight: 700;
  color: #D4AF37;
}

.vip-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.commission-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comm-item {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comm-item span:first-child {
  color: rgba(255, 255, 255, 0.8);
}

.comm-item strong {
  color: #F6E27A;
  font-size: 18px;
}

.salary-table {
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  margin: 16px 0;
  overflow: hidden;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 12px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  font-size: 13px;
  text-align: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row .highlight {
  color: #F6E27A;
  font-weight: 700;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.schedule-item .day {
  color: rgba(255, 255, 255, 0.9);
}

.schedule-item .vips {
  color: #D4AF37;
  font-weight: 600;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.btn-ok {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0f1419;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-ok:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 20, 25, 0.8);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border-left: 2px solid #D4AF37;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.home-container[dir="rtl"] .sidebar {
  right: auto;
  left: 0;
  border-left: none;
  border-right: 2px solid #D4AF37;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-header button {
  background: none;
  border: none;
  color: #D4AF37;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-header button:hover {
  transform: rotate(90deg);
}

.sidebar-nav {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
}

.sidebar-nav a:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
  transform: translateX(-5px);
}

.home-container[dir="rtl"] .sidebar-nav a:hover {
  transform: translateX(5px);
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.sidebar-footer button {
  width: 100%;
  padding: 12px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #D4AF37;
  border-radius: 12px;
  color: #D4AF37;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.sidebar-footer button:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.home-container[dir="rtl"] .slide-enter-from {
  transform: translateX(-100%);
}

.home-container[dir="rtl"] .slide-leave-to {
  transform: translateX(-100%);
}

@media (max-width: 768px) {
  .balance-cards-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .balance-card {
    padding: 10px 4px;
  }
  
  .card-icon-wrapper {
    width: 36px;
    height: 36px;
    font-size: 16px;
    margin: 0 2px;
  }
  
  .card-title {
    font-size: 11px;
  }
  
  .card-amount {
    font-size: 14px;
  }

  .card-arrow {
    padding: 0 4px;
    font-size: 12px;
  }
  
  .main-menu {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .menu-item {
    padding: 16px 8px;
  }
  
  .menu-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .menu-title {
    font-size: 11px;
  }
  
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
  }
  
  .action-card {
    padding: 12px;
  }
  
  .action-icon {
    width: 42px;
    height: 42px;
    font-size: 18px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .balance-display {
    padding: 10px 14px;
  }
  
  .amount {
    font-size: 18px;
  }
  
  .custom-modal-container.review-modal {
    max-width: 95%;
  }
  
  .rating-stars .star {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .balance-cards-section {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .balance-card {
    padding: 8px 4px;
  }
  
  .card-icon-wrapper {
    width: 32px;
    height: 32px;
    font-size: 14px;
    margin: 0;
  }
  
  .card-title {
    font-size: 10px;
  }
  
  .card-amount {
    font-size: 12px;
  }
  
  .card-arrow {
    font-size: 10px;
    padding: 0 2px;
  }
  
  .main-menu {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .quick-actions {
    grid-template-columns: 1fr 1fr;
  }
  
  .action-amount {
    font-size: 12px;
  }
  
  .custom-modal-header h3 {
    font-size: 18px;
  }
  
  .custom-modal-body p {
    font-size: 14px;
  }
  
  .rating-stars .star {
    font-size: 25px;
    gap: 8px;
  }
}

@media print {
  .custom-modal-overlay {
    display: none !important;
  }
}

/* ==================== XRP MONOCHROME REDESIGN ==================== */
.home-container { min-height:100vh; background:#f4f4f4 !important; color:#111 !important; font-family:'Cairo',sans-serif; }
.app-header { background:#fff !important; color:#111 !important; border-bottom:1px solid #e7e7e7; }
.balance-display,.balance-label,.welcome-text,.user-name,.amount,.currency { color:#111 !important; }
.balance-label,.welcome-text { color:#777 !important; }
.menu-btn,.notif-btn,.refresh-btn { color:#111 !important; background:#fff !important; border:1px solid #e5e5e5 !important; }
.balance-cards-section { display:block !important; padding:0 16px !important; }
.balance-single-section { padding:0 16px 18px; }
.balance-single-card { background:#111; color:#fff; border-radius:24px; padding:22px; box-shadow:0 12px 30px rgba(0,0,0,.12); }
.balance-single-top,.balance-single-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.balance-single-label { font-size:13px; color:#aaa; }
.balance-single-subtitle { margin-top:4px; font-size:11px; color:#777; }
.xrp-mark { min-width:48px; height:48px; border-radius:14px; display:grid; place-items:center; background:#fff; color:#111; font-weight:900; letter-spacing:.5px; }
.balance-single-value { margin:20px 0; display:flex; align-items:baseline; gap:8px; }
.balance-single-value span { font-size:34px; font-weight:900; letter-spacing:-1px; }
.balance-single-value small { font-size:13px; color:#aaa; font-weight:700; }
.balance-single-footer { padding-top:14px; border-top:1px solid #2b2b2b; font-size:11px; color:#aaa; }
.refresh-btn.light { color:#111 !important; background:#fff !important; border:0 !important; width:34px; height:34px; border-radius:10px; }
.search-section { padding:0 16px 18px !important; }
.search-box { background:#fff !important; border:1px solid #e2e2e2 !important; box-shadow:none !important; }
.search-box input { color:#111 !important; }
.quick-actions { padding:0 16px !important; gap:10px !important; }
.action-card,.menu-item { background:#fff !important; border:1px solid #e4e4e4 !important; box-shadow:0 5px 18px rgba(0,0,0,.04) !important; color:#111 !important; }
.action-title,.action-subtitle,.menu-title { color:#111 !important; }
.action-subtitle { color:#888 !important; }
.action-icon,.menu-icon { background:#111 !important; color:#fff !important; }
.promo-banner { margin:0 16px 18px !important; background:#111 !important; color:#fff !important; border:0 !important; box-shadow:none !important; }
.main-menu { padding:0 16px !important; }
.menu-arrow { color:#aaa !important; }
.sidebar { background:#fff !important; color:#111 !important; }
.sidebar-header { background:#111 !important; color:#fff !important; }
.sidebar-nav a,.sidebar-footer button { color:#111 !important; }
.modal-overlay { background:rgba(0,0,0,.55) !important; }
.modal-content { background:#fff !important; border:1px solid #111 !important; color:#111 !important; }
.modal-header { background:#111 !important; color:#fff !important; }
.modal-body,.company-text,.terms-text { color:#222 !important; }
.btn-ok { background:#111 !important; color:#fff !important; }
.gold,.gold-border,.section-title,.vip-section h4,.commission-section h4 { color:#111 !important; border-color:#ddd !important; }

</style>
