<template>
  <div
    class="home-container"
    :dir="currentLang === 'AR' ? 'rtl' : 'ltr'"
  >

    <!-- ================= HEADER ================= -->
    <header class="app-header">

      <div class="header-bar">

        <button class="header-icon-btn" @click="navigateTo('/notifications')">
          <i class="fas fa-bell"></i>
        </button>

        <div class="brand">
          <span class="xrp-brand-symbol">X</span>
          <span class="xrp-brand-text">XRP</span>
        </div>

        <button class="header-icon-btn" @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>

      </div>

      <div class="header-divider"></div>

      <div class="welcome-area">

        <div class="welcome-text">
          {{ t('welcome') }}
        </div>

        <div class="user-name">
          {{ username }}
        </div>

        <div class="join-date" v-if="joinDate">
          <i class="far fa-calendar"></i>
          {{ joinDate }}
        </div>

      </div>

    </header>


    <!-- ================= MAIN ================= -->
    <main class="main-content">

      <!-- ================= XRP BALANCE CARD ================= -->
      <section class="hero-balance">

        <div class="hero-background-symbol">
          X
        </div>

        <div class="hero-top">

          <div class="hero-brand">
            <div class="mini-xrp-symbol">X</div>

            <div>
              <div class="hero-xrp-name">
                XRP
              </div>

              <div class="hero-xrp-subtitle">
                {{ t('digitalFinance') }}
              </div>
            </div>
          </div>

          <button
            class="eye-button"
            @click="balanceVisible = !balanceVisible"
          >
            <i
              :class="balanceVisible
                ? 'fas fa-eye'
                : 'fas fa-eye-slash'"
            ></i>
          </button>

        </div>


        <div class="hero-balance-title">
          {{ t('totalBalance') }}
        </div>

        <div class="hero-amount-row">

          <span class="hero-amount">
            {{ balanceVisible ? formatNumber(totalBalance) : '••••' }}
          </span>

          <span class="hero-currency">
            USDT
          </span>

        </div>


        <!-- تم حذف رسالة "يمكنك استخدام هذا الرصيد في الترقية أو السحب" -->


        <!-- ================= DEPOSIT / WITHDRAW ================= -->
        <div class="hero-actions">

          <button
            class="hero-action primary"
            @click="navigateTo('/withdraw')"
          >
            <i class="fas fa-arrow-up"></i>
            <span>{{ t('withdraw') }}</span>
          </button>

          <button
            class="hero-action secondary"
            @click="navigateTo('/recharge')"
          >
            <i class="fas fa-arrow-down"></i>
            <span>{{ t('deposit') }}</span>
          </button>

        </div>

      </section>


      <!-- ================= QUICK ACCESS ================= -->
      <section class="section">

        <div class="section-title">
          {{ t('quickAccess') }}
        </div>

        <div class="quick-grid">

          <!-- Transactions -->
          <button
            class="quick-card"
            @click="navigateTo('/transactions')"
          >

            <div class="quick-card-content">

              <div class="quick-text">
                <strong>{{ t('transactions') }}</strong>
                <span>{{ t('viewHistory') }}</span>
              </div>

              <div class="quick-icon">
                <i class="fas fa-receipt"></i>
              </div>

            </div>

            <i class="fas fa-chevron-left quick-arrow"></i>

          </button>


          <!-- VIP -->
          <button
            class="quick-card"
            @click="navigateTo('/vip')"
          >

            <div class="quick-card-content">

              <div class="quick-text">
                <strong>{{ t('vip') }}</strong>
                <span>{{ t('upgradeLevel') }}</span>
              </div>

              <div class="quick-icon">
                <i class="fas fa-chart-line"></i>
              </div>

            </div>

            <i class="fas fa-chevron-left quick-arrow"></i>

          </button>


          <!-- Team -->
          <button
            class="quick-card"
            @click="navigateTo('/team')"
          >

            <div class="quick-card-content">

              <div class="quick-text">
                <strong>{{ t('team') }}</strong>
                <span>{{ t('manageTeam') }}</span>
              </div>

              <div class="quick-icon">
                <i class="fas fa-users"></i>
              </div>

            </div>

            <i class="fas fa-chevron-left quick-arrow"></i>

          </button>


          <!-- Wallet -->
          <button
            class="quick-card"
            @click="navigateTo('/profile')"
          >

            <div class="quick-card-content">

              <div class="quick-text">
                <strong>{{ t('wallet') }}</strong>
                <span>{{ t('viewBalance') }}</span>
              </div>

              <div class="quick-icon">
                <i class="fas fa-wallet"></i>
              </div>

            </div>

            <i class="fas fa-chevron-left quick-arrow"></i>

          </button>

        </div>

      </section>


      <!-- ================= ABOUT PLATFORM ================= -->
      <section class="about-card">

        <div class="about-header">

          <div class="about-title">
            <i class="fas fa-info-circle"></i>
            <span>{{ t('aboutPlatform') }}</span>
          </div>

        </div>


        <div class="about-content">

          <div class="about-xrp">

            <div class="large-xrp-symbol">
              X
            </div>

          </div>


          <div class="about-text">

            <p>
              {{ t('companyMessage') }}
            </p>

          </div>

        </div>

      </section>

    </main>


    <!-- ================= SIDEBAR OVERLAY ================= -->
    <transition name="fade">

      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="toggleSidebar"
      ></div>

    </transition>


    <!-- ================= SIDEBAR ================= -->
    <transition name="sidebar">

      <aside
        v-if="sidebarOpen"
        class="sidebar"
      >

        <div class="sidebar-header">

          <div class="sidebar-brand">
            <span class="sidebar-x">X</span>
            <span>XRP</span>
          </div>

          <button
            class="sidebar-close"
            @click="toggleSidebar"
          >
            <i class="fas fa-times"></i>
          </button>

        </div>


        <div class="sidebar-line"></div>


        <nav class="sidebar-nav">

          <button
            v-for="item in navItems"
            :key="item.path"
            class="sidebar-item"
            @click="navigateAndClose(item.path)"
          >

            <i :class="item.icon"></i>

            <span>
              {{ t(item.label) }}
            </span>

          </button>

        </nav>


        <div class="sidebar-footer">

          <button
            class="language-button"
            @click="toggleLanguage"
          >

            <i class="fas fa-globe"></i>

            <span>
              {{ currentLang === 'AR' ? 'English' : 'العربية' }}
            </span>

          </button>

        </div>

      </aside>

    </transition>


    <!-- ================= BOTTOM NAVIGATION ================= -->
    <nav class="bottom-nav">

      <button
        class="bottom-item"
        :class="{ active: currentPath === '/profile' }"
        @click="navigateTo('/profile')"
      >

        <i class="fas fa-user"></i>

        <span>
          {{ t('profile') }}
        </span>

      </button>


      <button
        class="bottom-item"
        :class="{ active: currentPath === '/team' }"
        @click="navigateTo('/team')"
      >

        <i class="fas fa-users"></i>

        <span>
          {{ t('team') }}
        </span>

      </button>


      <button
        class="bottom-item"
        :class="{ active: currentPath === '/tasks' }"
        @click="navigateTo('/tasks')"
      >

        <i class="fas fa-rocket"></i>

        <span>
          XRP
        </span>

      </button>


      <button
        class="bottom-item"
        :class="{ active: currentPath === '/vip' }"
        @click="navigateTo('/vip')"
      >

        <i class="fas fa-crown"></i>

        <span>
          {{ t('vip') }}
        </span>

      </button>


      <button
        class="bottom-item home-item"
        :class="{ active: currentPath === '/home' || currentPath === '/' }"
        @click="navigateTo('/home')"
      >

        <div class="home-icon">
          <i class="fas fa-house"></i>
        </div>

        <span>
          {{ t('home') }}
        </span>

      </button>

    </nav>

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

      joinDate: "",

      balanceVisible: true,

      sidebarOpen: false,

      currentLang:
        localStorage.getItem("app_language") || "AR",

      navItems: [

        {
          path: "/home",
          icon: "fas fa-house",
          label: "home"
        },

        {
          path: "/vip",
          icon: "fas fa-crown",
          label: "vip"
        },

        {
          path: "/tasks",
          icon: "fas fa-rocket",
          label: "xrp"
        },

        {
          path: "/team",
          icon: "fas fa-users",
          label: "team"
        },

        {
          path: "/profile",
          icon: "fas fa-user",
          label: "profile"
        }

      ],

      translations: {

        AR: {

          welcome: "مرحباً",

          totalBalance: "الرصيد الإجمالي",

          digitalFinance: "مستقبل التمويل الرقمي",

          withdraw: "سحب",

          deposit: "إيداع",

          quickAccess: "الوصول السريع",

          transactions: "المعاملات",

          viewHistory: "عرض السجل",

          vip: "الترقية",

          upgradeLevel: "ترقية المستوى",

          team: "الفريق",

          manageTeam: "إدارة فريقك",

          wallet: "المحفظة",

          viewBalance: "عرض الرصيد",

          aboutPlatform: "عن المنصة",

          companyMessage:
            "نعمل على تطوير تجربة رقمية حديثة تركز على سهولة الاستخدام ووضوح العمليات وتحسين تجربة المستخدم. يتم تطوير المنصة باستمرار بهدف تقديم واجهة مستقرة وسريعة مع متابعة أداء الخدمات وتحسينها بشكل مستمر.",

          home: "الرئيسية",

          xrp: "XRP",

          profile: "حسابي"

        },

        EN: {

          welcome: "Welcome",

          totalBalance: "Total Balance",

          digitalFinance: "Future of Digital Finance",

          withdraw: "Withdraw",

          deposit: "Deposit",

          quickAccess: "Quick Access",

          transactions: "Transactions",

          viewHistory: "View History",

          vip: "Upgrade",

          upgradeLevel: "Upgrade Level",

          team: "Team",

          manageTeam: "Manage Your Team",

          wallet: "Wallet",

          viewBalance: "View Balance",

          aboutPlatform: "About Platform",

          companyMessage:
            "We are developing a modern digital experience focused on ease of use, process clarity, and improving the user experience. The platform is continuously developed to provide a stable and fast interface while continuously monitoring and improving service performance.",

          home: "Home",

          xrp: "XRP",

          profile: "Account"

        }

      }

    };
  },


  computed: {

    currentPath() {
      return this.$route.path;
    }

  },


  created() {

    this.initAuth();

  },


  methods: {

    t(key) {

      return (
        this.translations[this.currentLang]?.[key] ||
        this.translations.AR[key] ||
        key
      );

    },


    formatNumber(num) {

      const value = Number(num);

      if (Number.isNaN(value)) {
        return "0.00";
      }

      return value.toFixed(2);

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

        if (!docSnap.exists()) {

          this.username = "User";

          this.totalBalance = 0;

          return;

        }

        const data = docSnap.data();


        /*
         * الرصيد الموحد
         *
         * الأولوية للحقل balance.
         * fallback للرصيد القديم vipBalance فقط
         * حتى لا تختفي الأرصدة القديمة.
         */

        this.totalBalance =
          Number(
            data.balance ??
            data.vipBalance ??
            0
          );


        this.username =
          data.username ||
          data.email ||
          "User";


        /*
         * تاريخ التسجيل
         */

        if (data.createdAt) {

          try {

            const date =
              data.createdAt.toDate
                ? data.createdAt.toDate()
                : new Date(data.createdAt);

            this.joinDate =
              date.toLocaleDateString(
                this.currentLang === "AR"
                  ? "ar"
                  : "en",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }
              );

          } catch (e) {

            this.joinDate = "";

          }

        }

      } catch (error) {

        console.error(
          "Error fetching user data:",
          error
        );

      }

    },


    navigateTo(route) {

      if (this.$route.path !== route) {

        this.$router.push(route);

      }

    },


    navigateAndClose(route) {

      this.navigateTo(route);

      this.sidebarOpen = false;

      document.body.style.overflow = "auto";

    },


    toggleSidebar() {

      this.sidebarOpen =
        !this.sidebarOpen;

      document.body.style.overflow =
        this.sidebarOpen
          ? "hidden"
          : "auto";

    },


    toggleLanguage() {

      this.currentLang =
        this.currentLang === "AR"
          ? "EN"
          : "AR";


      localStorage.setItem(
        "app_language",
        this.currentLang
      );


      document.documentElement.dir =
        this.currentLang === "AR"
          ? "rtl"
          : "ltr";


      document.documentElement.lang =
        this.currentLang.toLowerCase();


      /*
       * تحديث تاريخ التسجيل إذا كان موجودًا
       */

      if (
        this.currentUserUid
      ) {

        this.fetchUserData(
          this.currentUserUid
        );

      }

    }

  }

};
</script>


<style scoped>

/* =========================================================
   BASE
========================================================= */

* {
  box-sizing: border-box;
}

.home-container {

  min-height: 100vh;

  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fafafa 42%,
      #f5f5f5 100%
    );

  color: #111111;

  font-family:
    "Cairo",
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  padding-bottom: 110px;

  overflow-x: hidden;

}


/* =========================================================
   HEADER
========================================================= */

.app-header {

  background: #ffffff;

  padding:
    18px
    20px
    0;

}

.header-bar {

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.header-icon-btn {

  width: 42px;
  height: 42px;

  border-radius: 14px;

  border: 1px solid #e9e9e9;

  background: #ffffff;

  color: #161616;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 18px;

  cursor: pointer;

  transition: 0.25s;

}


.header-icon-btn:active {

  transform: scale(0.94);

  background: #f3f3f3;

}


.brand {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 4px;

  font-family: Arial, sans-serif;

  font-weight: 900;

}


.xrp-brand-symbol {

  font-size: 28px;

  line-height: 1;

  letter-spacing: -6px;

  transform: scaleX(1.15);

  margin-right: 5px;

}


.xrp-brand-text {

  font-size: 22px;

  letter-spacing: 3px;

}


.header-divider {

  height: 1px;

  background: #eeeeee;

  margin-top: 16px;

}


.welcome-area {

  padding:

    24px
    4px
    24px;

  text-align: right;

}


.home-container[dir="ltr"]
.welcome-area {

  text-align: left;

}


.welcome-text {

  color: #777777;

  font-size: 14px;

  margin-bottom: 3px;

}


.user-name {

  color: #111111;

  font-size: 22px;

  font-weight: 800;

  word-break: break-word;

}


.join-date {

  margin-top: 6px;

  color: #888888;

  font-size: 11px;

}


.join-date i {

  margin-left: 5px;

}


/* =========================================================
   MAIN
========================================================= */

.main-content {

  width: 100%;

  max-width: 850px;

  margin: 0 auto;

  padding: 0 20px;

}


/* =========================================================
   HERO BALANCE
========================================================= */

.hero-balance {

  position: relative;

  overflow: hidden;

  min-height: 390px;

  padding: 28px;

  border-radius: 28px;

  background:
    radial-gradient(
      circle at 85% 35%,
      #303030 0,
      #171717 34%,
      #090909 72%
    );

  color: #ffffff;

  box-shadow:
    0 20px 50px rgba(0,0,0,0.16);

}


.hero-background-symbol {

  position: absolute;

  right: -40px;

  top: 30px;

  font-family: Arial, sans-serif;

  font-size: 330px;

  font-weight: 900;

  line-height: 1;

  color: rgba(255,255,255,0.035);

  transform: scaleX(1.2);

  pointer-events: none;

}


.hero-top {

  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.hero-brand {

  display: flex;

  align-items: center;

  gap: 12px;

}


.mini-xrp-symbol {

  width: 42px;
  height: 42px;

  border-radius: 50%;

  background: #ffffff;

  color: #111111;

  display: flex;

  align-items: center;

  justify-content: center;

  font-family: Arial, sans-serif;

  font-size: 22px;

  font-weight: 900;

  transform: scaleX(1.1);

}


.hero-xrp-name {

  font-family: Arial, sans-serif;

  font-size: 22px;

  font-weight: 900;

  letter-spacing: 2px;

}


.hero-xrp-subtitle {

  color: rgba(255,255,255,0.58);

  font-size: 11px;

  margin-top: 2px;

}


.eye-button {

  width: 38px;
  height: 38px;

  border-radius: 50%;

  border: 1px solid rgba(255,255,255,0.15);

  background: rgba(255,255,255,0.06);

  color: #ffffff;

  cursor: pointer;

}


.hero-balance-title {

  position: relative;

  z-index: 2;

  margin-top: 52px;

  color: rgba(255,255,255,0.82);

  font-size: 15px;

}


.hero-amount-row {

  position: relative;

  z-index: 2;

  display: flex;

  align-items: baseline;

  gap: 10px;

  margin-top: 4px;

}


.hero-amount {

  font-family: "Inter", Arial, sans-serif;

  font-size: 52px;

  font-weight: 800;

  letter-spacing: -2px;

}


.hero-currency {

  background: rgba(255,255,255,0.10);

  border: 1px solid rgba(255,255,255,0.10);

  padding: 7px 12px;

  border-radius: 30px;

  font-size: 13px;

  font-weight: 700;

}


/* تم حذف .hero-description بالكامل */


/* =========================================================
   HERO ACTIONS
========================================================= */

.hero-actions {

  position: absolute;

  left: 28px;
  right: 28px;
  bottom: 28px;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;

  z-index: 5;

}


.hero-action {

  height: 54px;

  border-radius: 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  font-family: inherit;

  font-size: 14px;

  font-weight: 800;

  cursor: pointer;

  transition: 0.25s;

}


.hero-action:active {

  transform: scale(0.97);

}


.hero-action.primary {

  background: #ffffff;

  color: #111111;

  border: 1px solid #ffffff;

}


.hero-action.secondary {

  background: rgba(0,0,0,0.25);

  color: #ffffff;

  border: 1px solid rgba(255,255,255,0.25);

}


/* =========================================================
   SECTIONS
========================================================= */

.section {

  margin-top: 28px;

}


.section-title {

  font-size: 18px;

  font-weight: 800;

  margin-bottom: 14px;

}


/* =========================================================
   QUICK GRID
========================================================= */

.quick-grid {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;

}


.quick-card {

  position: relative;

  min-height: 108px;

  background: #ffffff;

  border: 1px solid #e9e9e9;

  border-radius: 20px;

  padding: 18px;

  display: flex;

  align-items: center;

  text-align: inherit;

  font-family: inherit;

  cursor: pointer;

  box-shadow:
    0 5px 18px rgba(0,0,0,0.04);

  transition: 0.25s;

}


.quick-card:hover {

  transform: translateY(-3px);

  box-shadow:
    0 12px 30px rgba(0,0,0,0.08);

}


.quick-card:active {

  transform: scale(0.98);

}


.quick-card-content {

  width: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

}


.quick-text {

  display: flex;

  flex-direction: column;

  gap: 4px;

}


.quick-text strong {

  font-size: 15px;

  color: #111111;

}


.quick-text span {

  color: #777777;

  font-size: 11px;

}


.quick-icon {

  width: 48px;
  height: 48px;

  border-radius: 50%;

  background: #111111;

  color: #ffffff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 17px;

  flex-shrink: 0;

}


.quick-arrow {

  position: absolute;

  left: 16px;

  bottom: 14px;

  color: #999999;

  font-size: 10px;

}


.home-container[dir="ltr"]
.quick-arrow {

  left: auto;

  right: 16px;

}


/* =========================================================
   ABOUT
========================================================= */

.about-card {

  margin-top: 24px;

  background: #ffffff;

  border: 1px solid #e8e8e8;

  border-radius: 24px;

  padding: 22px;

  box-shadow:
    0 6px 25px rgba(0,0,0,0.04);

}


.about-header {

  display: flex;

  justify-content: flex-start;

  margin-bottom: 18px;

}


.about-title {

  display: flex;

  align-items: center;

  gap: 8px;

  font-size: 16px;

  font-weight: 800;

}


.about-title i {

  font-size: 17px;

}


.about-content {

  display: flex;

  align-items: center;

  gap: 22px;

}


.about-xrp {

  flex-shrink: 0;

}


.large-xrp-symbol {

  width: 92px;
  height: 92px;

  border-radius: 50%;

  background: #111111;

  color: #ffffff;

  display: flex;

  align-items: center;

  justify-content: center;

  font-family: Arial, sans-serif;

  font-size: 45px;

  font-weight: 900;

  transform: scaleX(1.12);

  box-shadow:
    0 12px 25px rgba(0,0,0,0.14);

}


.about-text {

  flex: 1;

}


.about-text p {

  margin: 0;

  color: #444444;

  font-size: 12px;

  line-height: 2;

}


/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

.bottom-nav {

  position: fixed;

  left: 14px;
  right: 14px;
  bottom: 14px;

  height: 76px;

  background: #111111;

  border-radius: 24px;

  display: grid;

  grid-template-columns:
    repeat(5, 1fr);

  align-items: center;

  padding: 6px;

  z-index: 5000;

  box-shadow:
    0 15px 40px rgba(0,0,0,0.25);

}


.bottom-item {

  height: 64px;

  border: none;

  background: transparent;

  color: #888888;

  border-radius: 18px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 5px;

  font-family: inherit;

  cursor: pointer;

  transition: 0.25s;

}


.bottom-item i {

  font-size: 19px;

}


.bottom-item span {

  font-size: 10px;

  font-weight: 600;

}


.bottom-item.active {

  color: #ffffff;

}


.home-item.active {

  background: #ffffff;

  color: #111111;

}


.home-icon {

  display: flex;

  align-items: center;

  justify-content: center;

}


.home-item.active i {

  font-size: 20px;

}


/* =========================================================
   SIDEBAR
========================================================= */

.sidebar-overlay {

  position: fixed;

  inset: 0;

  background:
    rgba(0,0,0,0.45);

  backdrop-filter: blur(4px);

  z-index: 9000;

}


.sidebar {

  position: fixed;

  top: 0;
  bottom: 0;

  right: 0;

  width: 300px;

  max-width: 85vw;

  background: #ffffff;

  z-index: 9001;

  padding: 24px;

  box-shadow:
    -15px 0 40px rgba(0,0,0,0.15);

}


.home-container[dir="rtl"]
.sidebar {

  right: auto;

  left: 0;

}


.sidebar-header {

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.sidebar-brand {

  display: flex;

  align-items: center;

  gap: 7px;

  font-family: Arial, sans-serif;

  font-size: 20px;

  font-weight: 900;

  letter-spacing: 2px;

}


.sidebar-x {

  font-size: 25px;

  transform: scaleX(1.1);

}


.sidebar-close {

  width: 40px;
  height: 40px;

  border-radius: 13px;

  border: 1px solid #eeeeee;

  background: #ffffff;

  cursor: pointer;

}


.sidebar-line {

  height: 1px;

  background: #eeeeee;

  margin: 22px 0;

}


.sidebar-nav {

  display: flex;

  flex-direction: column;

  gap: 7px;

}


.sidebar-item {

  width: 100%;

  border: none;

  background: transparent;

  padding: 15px;

  border-radius: 14px;

  display: flex;

  align-items: center;

  gap: 13px;

  font-family: inherit;

  color: #222222;

  font-size: 14px;

  text-align: inherit;

  cursor: pointer;

}


.sidebar-item:hover {

  background: #f5f5f5;

}


.sidebar-item i {

  width: 24px;

  text-align: center;

}


.sidebar-footer {

  position: absolute;

  left: 24px;
  right: 24px;
  bottom: 24px;

}


.language-button {

  width: 100%;

  height: 48px;

  border: 1px solid #e5e5e5;

  border-radius: 14px;

  background: #ffffff;

  font-family: inherit;

  font-weight: 700;

  cursor: pointer;

}


/* =========================================================
   TRANSITIONS
========================================================= */

.fade-enter-active,
.fade-leave-active {

  transition: opacity 0.25s;

}


.fade-enter-from,
.fade-leave-to {

  opacity: 0;

}


.sidebar-enter-active,
.sidebar-leave-active {

  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

}


.sidebar-enter-from,
.sidebar-leave-to {

  transform: translateX(100%);

  opacity: 0;

}


.home-container[dir="rtl"]
.sidebar-enter-from,
.home-container[dir="rtl"]
.sidebar-leave-to {

  transform: translateX(-100%);

}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 769px) {

  .main-content {

    padding:
      0 30px
      40px;

  }


  .hero-balance {

    min-height: 420px;

  }


  .quick-grid {

    grid-template-columns:
      repeat(4, 1fr);

  }


  .quick-card {

    min-height: 125px;

  }


  .bottom-nav {

    max-width: 620px;

    left: 50%;

    right: auto;

    transform: translateX(-50%);

    width: calc(100% - 40px);

  }

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {

  .main-content {

    padding:
      0 16px;

  }


  .app-header {

    padding-left: 16px;
    padding-right: 16px;

  }


  .welcome-area {

    padding:
      20px
      2px
      20px;

  }


  .user-name {

    font-size: 20px;

  }


  .hero-balance {

    min-height: 375px;

    padding: 22px;

    border-radius: 25px;

  }


  .hero-background-symbol {

    font-size: 260px;

    right: -30px;

    top: 55px;

  }


  .hero-balance-title {

    margin-top: 45px;

  }


  .hero-amount {

    font-size: 42px;

  }


  .hero-actions {

    left: 22px;
    right: 22px;
    bottom: 22px;

  }


  .hero-action {

    height: 50px;

  }


  .quick-grid {

    gap: 9px;

  }


  .quick-card {

    min-height: 102px;

    padding: 14px;

  }


  .quick-text strong {

    font-size: 13px;

  }


  .quick-text span {

    font-size: 10px;

  }


  .quick-icon {

    width: 42px;
    height: 42px;

    font-size: 15px;

  }


  .about-content {

    align-items: flex-start;

    gap: 14px;

  }


  .large-xrp-symbol {

    width: 65px;
    height: 65px;

    font-size: 32px;

  }


  .about-text p {

    font-size: 11px;

    line-height: 1.9;

  }


  .bottom-nav {

    left: 8px;
    right: 8px;
    bottom: 8px;

    height: 72px;

    border-radius: 22px;

  }


  .bottom-item {

    height: 60px;

  }


  .bottom-item i {

    font-size: 17px;

  }


  .bottom-item span {

    font-size: 9px;

  }

}


/* =========================================================
   VERY SMALL DEVICES
========================================================= */

@media (max-width: 360px) {

  .hero-amount {

    font-size: 35px;

  }


  .hero-currency {

    font-size: 11px;

    padding:
      6px 9px;

  }


  .quick-text strong {

    font-size: 12px;

  }


  .quick-icon {

    width: 38px;
    height: 38px;

  }


  .bottom-item span {

    font-size: 8px;

  }

}

</style>
