<template>
  <div class="home-container" :dir="currentLang === 'AR' ? 'rtl' : 'ltr'">

    <!-- ==================== MODAL SYSTEM ==================== -->
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

        <button class="notif-btn" @click="navigateTo('/notifications')">
          <i class="fas fa-bell"></i>
        </button>
      </div>

      <div class="welcome-section">
        <span class="welcome-text">{{ t('welcome') }}</span>
        <span class="user-name">{{ username }}</span>
      </div>
    </header>

    <!-- ==================== XRP IDENTITY SECTION ==================== -->
    <div class="xrp-identity">
      <div class="xrp-card">
        <div class="xrp-logo-wrapper">
          <div class="xrp-logo-circle">
            <span class="xrp-text">XRP</span>
          </div>
        </div>
        <div class="xrp-info">
          <h2 class="xrp-title">XRP</h2>
          <p class="xrp-subtitle">{{ t('futureOfFinance') }}</p>
        </div>
      </div>
    </div>

    <!-- ==================== SINGLE BALANCE CARD ==================== -->
    <div class="balance-card-main">
      <div class="balance-card-content">
        <div class="balance-card-icon">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="balance-card-details">
          <div class="balance-card-label">{{ t('totalBalance') }}</div>
          <div class="balance-card-amount">
            <span class="amount-number">{{ formatNumber(totalBalance) }}</span>
            <span class="amount-currency">USDT</span>
          </div>
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

    <!-- ==================== SIDEBAR ==================== -->
    <transition name="slide">
      <div v-if="sidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    </transition>
    <transition name="slide">
      <aside v-if="sidebarOpen" class="sidebar">
        <div class="sidebar-header">
          <span>⚡ XRP</span>
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

    <!-- ==================== MODAL: COMPANY INFO ==================== -->
    <transition name="modal">
      <div v-if="showCompany" class="modal-overlay" @click.self="closeCompanyModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>⚡ XRP</h3>
            <button class="close-btn" @click="closeCompanyModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="company-text">
              <p>
                {{ t('companyMessage') }}
              </p>
            </div>

            <div class="vip-section">
              <h4>📊 {{ t('vipPlans') }}</h4>
              <div class="vip-list">
                <div v-for="vip in vipPlans" :key="vip.level" class="vip-item">
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
      totalBalance: 0,
      currentUserUid: null,
      refreshing: false,
      
      showCompany: false,
      sidebarOpen: false,
      searchQuery: "",
      currentLang: localStorage.getItem("app_language") || "AR",

      // ==================== CUSTOM MODAL SYSTEM ====================
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
      },

      vipPlans: [
        { level: 'VIP 1', recharge: '20', daily: '5.00' },
        { level: 'VIP 2', recharge: '40', daily: '10.00' },
        { level: 'VIP 3', recharge: '50', daily: '12.50' },
        { level: 'VIP 4', recharge: '70', daily: '17.50' }
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
          aboutCompany: 'الشركة',
          vipPlans: 'خطط العضوية',
          daily: 'يومي',
          commissionSystem: 'نظام العمولات',
          level1: 'المستوى 1',
          level2: 'المستوى 2',
          level3: 'المستوى 3',
          understood: 'فهمت',
          home: 'الرئيسية',
          vip: 'VIP',
          tasks: 'المهام',
          profile: 'حسابي',
          agency: 'وكالة',
          program: 'تحميل التطبيق',
          balanceUpdated: 'تم تحديث الرصيد بنجاح ✓',
          refreshError: 'حدث خطأ في تحديث الرصيد، حاول مرة أخرى',
          languageChanged: 'تم تغيير اللغة بنجاح',
          futureOfFinance: 'مستقبل التمويل الرقمي',
          companyMessage: 'نحن نعمل على تطوير تجربة رقمية حديثة تركز على سهولة الاستخدام، وضوح العمليات، وتحسين تجربة المستخدم. يتم تطوير المنصة باستمرار بهدف تقديم واجهة مستقرة وسريعة وآمنة، مع متابعة أداء الخدمات وتحسينها بشكل مستمر.'
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
          aboutCompany: 'Company',
          vipPlans: 'Membership Plans',
          daily: 'Daily',
          commissionSystem: 'Commission System',
          level1: 'Level 1',
          level2: 'Level 2',
          level3: 'Level 3',
          understood: 'Understood',
          home: 'Home',
          vip: 'VIP',
          tasks: 'Tasks',
          profile: 'Profile',
          agency: 'Agency',
          program: 'Download App',
          balanceUpdated: 'Balance updated successfully ✓',
          refreshError: 'Error refreshing balance, please try again',
          languageChanged: 'Language changed successfully',
          futureOfFinance: 'Future of Digital Finance',
          companyMessage: 'We are working on developing a modern digital experience focused on ease of use, process clarity, and improving user experience. The platform is continuously being developed to provide a stable, fast, and secure interface, with ongoing monitoring and improvement of service performance.'
        }
      }
    };
  },

  created() {
    this.initAuth();
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

    formatNumber(num) {
      return Number(num).toFixed(2);
    },

    async initAuth() {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          this.username = "Guest";
          this.totalBalance = 0;
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
          this.totalBalance = Number(data.balance || data.vipBalance || 0);
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
          this.totalBalance = Number(data.balance || data.vipBalance || 0);
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
    
    showCompanyModal() {
      this.showCompany = true;
      document.body.style.overflow = 'hidden';
    },

    closeCompanyModal() {
      this.showCompany = false;
      document.body.style.overflow = 'auto';
    }
  }
};
</script>

<style scoped>
/* ==================== BASE STYLES ==================== */
.home-container {
  min-height: 100vh;
  background: #f5f7fa;
  color: #1a1a2e;
  font-family: 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif;
  padding-bottom: 80px;
  position: relative;
  overflow-x: hidden;
}

/* ==================== HEADER ==================== */
.app-header {
  background: #ffffff;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.menu-btn,
.notif-btn {
  background: none;
  border: none;
  color: #1a1a2e;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s;
}

.menu-btn:hover,
.notif-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.balance-display {
  background: #f0f2f5;
  border-radius: 16px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin: 0 12px;
}

.balance-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.balance-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.amount {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a2e;
  font-family: 'Inter', monospace;
}

.currency {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.refresh-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.refresh-btn:hover:not(:disabled) {
  color: #1a1a2e;
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.welcome-text {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
}

/* ==================== XRP IDENTITY SECTION ==================== */
.xrp-identity {
  padding: 20px 20px 12px;
}

.xrp-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(26, 26, 46, 0.15);
}

.xrp-logo-wrapper {
  flex-shrink: 0;
}

.xrp-logo-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #0070ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 112, 255, 0.3);
}

.xrp-text {
  font-size: 22px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 1px;
}

.xrp-info {
  flex: 1;
}

.xrp-title {
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
}

.xrp-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  margin: 4px 0 0;
  font-weight: 400;
}

/* ==================== SINGLE BALANCE CARD ==================== */
.balance-card-main {
  padding: 0 20px 16px;
}

.balance-card-content {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.balance-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #0070ff;
  flex-shrink: 0;
}

.balance-card-details {
  flex: 1;
}

.balance-card-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 4px;
}

.balance-card-amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.amount-number {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  font-family: 'Inter', monospace;
}

.amount-currency {
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

/* ==================== SEARCH SECTION ==================== */
.search-section {
  padding: 0 20px 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: #0070ff;
  box-shadow: 0 4px 16px rgba(0, 112, 255, 0.1);
}

.search-box i {
  color: #9ca3af;
  font-size: 16px;
}

.search-box input {
  flex: 1;
  background: none;
  border: none;
  color: #1a1a2e;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.filter-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-btn:hover {
  color: #1a1a2e;
}

/* ==================== QUICK ACTIONS ==================== */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 20px 20px;
}

.action-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 112, 255, 0.2);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.action-card.deposit .action-icon {
  background: #e8f5e9;
  color: #2e7d32;
}

.action-card.withdraw .action-icon {
  background: #e3f2fd;
  color: #1565c0;
}

.action-card.team .action-icon {
  background: #fff3e0;
  color: #e65100;
}

.action-card.history .action-icon {
  background: #f3e5f5;
  color: #6a1b9a;
}

.action-text {
  display: flex;
  flex-direction: column;
}

.action-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
}

.action-subtitle {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

/* ==================== MAIN MENU ==================== */
.main-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 20px 20px;
}

.menu-item {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.menu-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 112, 255, 0.2);
}

.menu-item.special {
  border: 1px solid rgba(0, 112, 255, 0.2);
  background: linear-gradient(135deg, #f8faff, #ffffff);
}

.menu-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f0f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #0070ff;
  position: relative;
}

.menu-icon.gold {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
  color: #f57c00;
}

.menu-icon.icon-agency {
  background: #e8f5e9;
  color: #2e7d32;
}

.menu-icon.icon-program {
  background: #f3e5f5;
  color: #6a1b9a;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 8px;
  border: 2px solid #ffffff;
}

.menu-title {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a2e;
  text-align: center;
}

.menu-arrow {
  color: #d1d5db;
  font-size: 10px;
}

.menu-item.small {
  padding: 14px 10px;
}

.menu-item.small .menu-icon {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.menu-item.small .menu-title {
  font-size: 11px;
}

/* ==================== CUSTOM MODAL ==================== */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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
  max-width: 420px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalFloatIn 0.35s cubic-bezier(0.21, 1.11, 0.35, 1);
}

.custom-modal-container.small {
  max-width: 380px;
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
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.custom-modal-header .header-icon {
  width: 44px;
  height: 44px;
  border-radius: 22px;
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
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.04);
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #1a1a2e;
  transform: rotate(90deg);
}

.custom-modal-body {
  padding: 24px;
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
  padding: 16px 24px 24px;
}

.modal-btn {
  padding: 12px 24px;
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
  background: #1a1a2e;
  color: #ffffff;
  font-weight: 700;
}

.modal-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 26, 46, 0.3);
}

.modal-btn-primary:active {
  transform: translateY(1px);
}

.modal-btn-confirm {
  background: #1a1a2e;
  color: #ffffff;
  flex: 1;
}

.modal-btn-cancel {
  background: #f3f4f6;
  color: #374151;
  flex: 1;
}

.modal-btn-cancel:hover {
  background: #e5e7eb;
}

.modal-gold-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #1a1a2e, #4a4a6a, #1a1a2e, transparent);
  animation: goldShine 2s linear infinite;
}

@keyframes goldShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ==================== COMPANY MODAL ==================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  animation: modalIn 0.3s;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
  background: #1a1a2e;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ffffff;
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
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.company-text {
  color: #374151;
  line-height: 1.8;
  font-size: 14px;
}

.company-text p {
  margin: 0;
  text-align: justify;
}

.vip-section,
.commission-section {
  margin-top: 24px;
}

.vip-section h4,
.commission-section h4 {
  color: #1a1a2e;
  text-align: center;
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 700;
}

.vip-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vip-item {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vip-level {
  font-weight: 700;
  color: #1a1a2e;
}

.vip-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.commission-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comm-item {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comm-item span:first-child {
  color: #6b7280;
}

.comm-item strong {
  color: #1a1a2e;
  font-size: 18px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-ok {
  width: 100%;
  padding: 14px;
  background: #1a1a2e;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-ok:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(26, 26, 46, 0.3);
}

/* ==================== SIDEBAR ==================== */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.08);
}

.home-container[dir="rtl"] .sidebar {
  right: auto;
  left: 0;
  border-left: none;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;
  font-size: 18px;
  font-weight: 800;
  color: #1a1a2e;
}

.sidebar-header button {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-header button:hover {
  transform: rotate(90deg);
  color: #1a1a2e;
}

.sidebar-nav {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: #374151;
  text-decoration: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
  font-weight: 500;
}

.sidebar-nav a:hover {
  background: #f8f9fa;
  color: #1a1a2e;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f2f5;
}

.sidebar-footer button {
  width: 100%;
  padding: 12px;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #1a1a2e;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.sidebar-footer button:hover {
  background: #f0f2f5;
}

/* ==================== TRANSITIONS ==================== */
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

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .xrp-title {
    font-size: 22px;
  }
  
  .xrp-logo-circle {
    width: 52px;
    height: 52px;
  }
  
  .xrp-text {
    font-size: 18px;
  }
  
  .amount-number {
    font-size: 22px;
  }
  
  .balance-card-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  
  .action-card {
    padding: 14px;
  }
  
  .action-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
  
  .main-menu {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .menu-item {
    padding: 16px 10px;
  }
  
  .menu-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
  
  .menu-title {
    font-size: 11px;
  }
  
  .balance-display {
    padding: 8px 14px;
    margin: 0 8px;
  }
  
  .amount {
    font-size: 17px;
  }
}

@media (max-width: 480px) {
  .xrp-card {
    padding: 18px;
    gap: 14px;
  }
  
  .xrp-logo-circle {
    width: 44px;
    height: 44px;
  }
  
  .xrp-text {
    font-size: 16px;
  }
  
  .xrp-title {
    font-size: 20px;
  }
  
  .xrp-subtitle {
    font-size: 11px;
  }
  
  .balance-card-content {
    padding: 18px;
  }
  
  .amount-number {
    font-size: 20px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .action-card {
    padding: 12px;
  }
  
  .action-icon {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }
  
  .action-title {
    font-size: 13px;
  }
  
  .main-menu {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .menu-item {
    padding: 12px 8px;
  }
  
  .menu-icon {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }
  
  .menu-title {
    font-size: 10px;
  }
  
  .sidebar {
    width: 260px;
  }
}
</style>
