<template>
  <div id="app" :class="{ rtl: currentLang === 'AR' }">

    <!-- ==================== الأزرار العائمة ==================== -->

    <!-- زر الدعم -->
    <div
      class="circle-btn support-btn"
      ref="supportBtn"
      @click="toggleSupportMenu"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <i class="fas fa-headset"></i>
    </div>

    <!-- زر X -->
    <a
      class="circle-btn x-btn"
      ref="xBtn"
      href="https://x.com/XRP_Avengers"
      target="_blank"
      rel="noopener noreferrer"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    </a>


    <!-- ==================== قائمة الدعم ==================== -->

    <transition name="fade">
      <div v-if="showSupportMenu" class="support-menu" @click.stop>

        <div class="support-menu-header">

          <div class="header-title">
            <i class="fas fa-headset"></i>
            <span>{{ t('supportCenter') }}</span>
          </div>

          <button class="close-btn" @click.stop="closeSupportMenu">
            <i class="fas fa-times"></i>
          </button>

        </div>

        <div class="support-menu-body">

          <div class="support-item" @click="openTelegram">

            <div class="support-icon telegram">
              <i class="fab fa-telegram"></i>
            </div>

            <div class="support-info">
              <span class="support-name">
                {{ t('telegram') }}
              </span>

              <span class="support-desc">
                {{ t('supportCommunity') }}
              </span>
            </div>

            <i class="fas fa-chevron-left support-arrow"></i>

          </div>

        </div>

      </div>
    </transition>


    <!-- ==================== نافذة حظر المستخدم ==================== -->

    <transition name="modal">

      <div
        v-if="showBlockedModal"
        class="modal-overlay"
        @click.self="handleBlockedModalClose"
      >

        <div
          class="modal-container blocked-modal"
          @click.stop
        >

          <div class="blocked-header">

            <div class="blocked-icon">
              <i class="fas fa-lock"></i>
            </div>

            <h2>
              {{ t('accountBlocked') }}
            </h2>

          </div>


          <div class="blocked-body">

            <div class="blocked-message">

              <i class="fas fa-exclamation-triangle"></i>

              <p>
                {{ t('blockedMessage') }}
              </p>

            </div>


            <div class="blocked-info">

              <div class="info-item">

                <i class="fas fa-headset"></i>

                <span>
                  {{ t('contactSupportReview') }}
                </span>

              </div>

            </div>


            <div class="blocked-actions">

              <button
                class="support-btn-action"
                @click="contactSupportFromBlocked"
              >

                <i class="fab fa-whatsapp"></i>

                <span>
                  {{ t('contactSupport') }}
                </span>

              </button>

            </div>

          </div>


          <div class="blocked-footer">

            <button
              class="btn-primary"
              @click="handleBlockedModalClose"
            >

              <i class="fas fa-sign-out-alt"></i>

              <span>
                {{ t('logout') }}
              </span>

            </button>

          </div>

        </div>

      </div>

    </transition>


    <!-- ==================== نافذة LumaRise Community ==================== -->

    <transition name="modal">

      <div
        v-if="showOfferMessage"
        class="modal-overlay"
        @click="closeOfferMessage"
      >

        <div
          class="modal-container offer-modal"
          @click.stop
        >

          <div class="modal-header">

            <div class="sender-info">

              <div class="sender-avatar xrp-avatar">
                X
              </div>

              <div class="sender-details">

                <div class="sender-name">
                  LumaRise Community
                </div>

                <div class="sender-time">
                  {{ t('communityUpdate') }}
                </div>

              </div>

            </div>


            <button
              class="modal-close"
              @click.stop="closeOfferMessage"
            >

              <i class="fas fa-times"></i>

            </button>

          </div>


          <div class="modal-body">

            <div class="offer-content">

              <div class="offer-title">

                <span class="xrp-title-symbol">
                  X
                </span>

                <span>
                  {{ t('welcomeXrp') }}
                </span>

              </div>


              <div class="offer-text">

                <p>
                  {{ t('xrpMessage1') }}
                </p>

                <p>
                  {{ t('xrpMessage2') }}
                </p>

                <p>
                  {{ t('xrpMessage3') }}
                </p>

                <p>
                  {{ t('xrpMessage4') }}
                </p>

                <div class="highlight-box">

                  <i class="fas fa-info-circle"></i>

                  <strong>
                    {{ t('communityInfo') }}
                  </strong>

                </div>

              </div>

            </div>

          </div>


          <div class="modal-footer">

            <button
              class="btn-primary"
              @click.stop="closeOfferMessage"
            >

              <i class="fas fa-check-circle"></i>

              {{ t('understood') }}

            </button>

          </div>

        </div>

      </div>

    </transition>


    <!-- ==================== إعلان معلومات المجتمع ==================== -->

    <transition name="modal">

      <div
        v-if="showAd"
        class="modal-overlay ad-overlay"
        @click.self="closeAd"
      >

        <div
          class="modal-container ad-container"
          @click.stop
        >

          <div class="ad-header">

            <div class="ad-title">

              <span class="header-xrp-symbol">
                X
              </span>

              <span>
                LumaRise Community
              </span>

              <span class="header-xrp-symbol">
                X
              </span>

            </div>


            <button
              class="ad-close"
              @click.stop="closeAd"
            >

              <i class="fas fa-times"></i>

            </button>

          </div>


          <div class="ad-body">

            <div class="company-message">

              <div class="message-header">

                <span class="message-xrp-icon">
                  X
                </span>

                <h3>
                  {{ t('aboutCommunity') }}
                </h3>

              </div>


              <div class="message-content">

                <p>
                  {{ t('companyMessage') }}
                </p>

              </div>

            </div>


            <div class="partnerships">

              <i class="fas fa-globe"></i>

              <span>
                {{ t('globalCommunity') }}
              </span>

            </div>


            <div class="vip-section">

              <h3>
                📊 {{ t('communitySections') }}
              </h3>


              <div class="vip-grid">

                <div class="vip-card vip-bronze">

                  <div class="vip-header">
                    LumaRise
                  </div>

                  <div class="vip-body">

                    <div class="vip-item">

                      <span class="vip-label">
                        🌐 {{ t('topic') }}
                      </span>

                      <span class="vip-value">
                        LumaRise
                      </span>

                    </div>


                    <div class="vip-item">

                      <span class="vip-label">
                        📚 {{ t('information') }}
                      </span>

                      <span class="vip-value">
                        {{ t('available') }}
                      </span>

                    </div>

                  </div>

                </div>


                <div class="vip-card vip-silver">

                  <div class="vip-header">
                    {{ t('news') }}
                  </div>

                  <div class="vip-body">

                    <div class="vip-item">

                      <span class="vip-label">
                        📰 {{ t('updates') }}
                      </span>

                      <span class="vip-value">
                        {{ t('ongoing') }}
                      </span>

                    </div>


                    <div class="vip-item">

                      <span class="vip-label">
                        🔎 {{ t('research') }}
                      </span>

                      <span class="vip-value">
                        {{ t('available') }}
                      </span>

                    </div>

                  </div>

                </div>


                <div class="vip-card vip-gold">

                  <div class="vip-header">
                    {{ t('community') }}
                  </div>

                  <div class="vip-body">

                    <div class="vip-item">

                      <span class="vip-label">
                        👥 {{ t('members') }}
                      </span>

                      <span class="vip-value">
                        {{ t('community') }}
                      </span>

                    </div>


                    <div class="vip-item">

                      <span class="vip-label">
                        💬 {{ t('discussion') }}
                      </span>

                      <span class="vip-value">
                        {{ t('active') }}
                      </span>

                    </div>

                  </div>

                </div>


                <div class="vip-card vip-platinum">

                  <div class="vip-header">
                    {{ t('security') }}
                  </div>

                  <div class="vip-body">

                    <div class="vip-item">

                      <span class="vip-label">
                        🔐 {{ t('security') }}
                      </span>

                      <span class="vip-value">
                        {{ t('important') }}
                      </span>

                    </div>


                    <div class="vip-item">

                      <span class="vip-label">
                        ⚠️ {{ t('verification') }}
                      </span>

                      <span class="vip-value">
                        {{ t('required') }}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            <div class="commission-box">

              <h4>
                🤝 {{ t('importantInformation') }}
              </h4>

              <div class="commission-row">

                <span>
                  {{ t('doYourResearch') }}
                </span>

                <span>
                  {{ t('verifySources') }}
                </span>

                <span>
                  {{ t('avoidPromises') }}
                </span>

              </div>

            </div>

          </div>


          <div class="ad-footer">

            <button
              class="btn-primary"
              @click.stop="closeAd"
            >

              <i class="fas fa-check-circle"></i>

              {{ t('iUnderstand') }}

            </button>

          </div>

        </div>

      </div>

    </transition>


    <!-- ==================== المحتوى الرئيسي ==================== -->

    <div class="page-container">
      <router-view />
    </div>


    <!-- ==================== شريط التنقل السفلي ==================== -->

    <div
      class="bottom-nav"
      v-if="authLoaded && showBottomNav"
    >

      <div
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        @click.prevent="navigateTo(item.path)"
        :class="{ active: isActive(item.path) }"
      >

        <i :class="item.icon"></i>

        <span>
          {{ t(item.label) }}
        </span>

      </div>

    </div>

  </div>
</template>


<script>
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  db
} from "./firebase";

import {
  doc,
  getDoc
} from "firebase/firestore";


export default {

  name: "App",

  data() {

    return {

      /* ==================== AUTH ==================== */

      authLoaded: false,

      user: null,

      blockCheckInterval: null,


      /* ==================== MENUS ==================== */

      showSupportMenu: false,

      showAd: false,

      showOfferMessage: false,

      hasNewOffer: true,

      showBlockedModal: false,


      /* ==================== LANGUAGE ==================== */

      currentLang: "AR",


      /* ==================== SUPPORT ==================== */

      whatsappNumbers: {

        support: {

          number: "",

          message: "مرحباً، أحتاج مساعدة"

        }

      },

      telegramLink: "https://t.me/XRP1Ripple",

      telegramChannelLink: "",


      /* ==================== COMMUNITY ==================== */

      communitySections: [

        {
          title: "LumaRise",
          icon: "X"
        },

        {
          title: "News",
          icon: "📰"
        },

        {
          title: "Community",
          icon: "👥"
        },

        {
          title: "Security",
          icon: "🔐"
        }

      ],


      /* ==================== NAVIGATION ==================== */

      navItems: [

        {
          path: "/home",
          icon: "fas fa-home",
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


      /* ==================== DRAG ==================== */

      dragging: false,

      currentButton: null,

      startX: 0,

      startY: 0,

      initialLeft: 0,

      initialBottom: 0,

      clickThreshold: 5,

      hasDragged: false,


      /* ==================== TRANSLATIONS ==================== */

      translations: {

        /* ==================== ARABIC ==================== */

        AR: {

          supportCenter: "مركز الدعم",

          whatsapp: "واتساب",

          telegram: "تيليجرام",

          communityChannel: "قناة المجتمع",

          quickContact: "تواصل سريع",

          supportCommunity: "مجتمع الدعم",

          accountBlocked: "تم حظر الحساب",

          blockedMessage:
            "تم حظر حسابك من قبل الإدارة",

          contactSupportReview:
            "يرجى التواصل مع الدعم لمراجعة حالة حسابك",

          contactSupport:
            "التواصل مع الدعم",

          logout:
            "تسجيل الخروج",

          communityUpdate:
            "تحديث المجتمع",

          welcomeXrp:
            "💰 مجتمع LumaRise — الأرباح اليومية",

          xrpMessage1:
            "مرحباً بكم في مجتمع LumaRise 🌟",

          xrpMessage2:
            "توفر منصتنا تجربة متكاملة للمستخدمين لمتابعة برامج الأرباح والمكافآت اليومية المرتبطة بالمنصة، مع عرض الرصيد والأرباح بشكل واضح ومنظم.",

          xrpMessage3:
            "📈 الأرباح اليومية: يمكن للمستخدمين متابعة الأرباح التي يتم احتسابها على حساباتهم وفقاً للبرنامج والشروط المعمول بها.",

          xrpMessage4:
            "💵 يتم تحديث بيانات الأرباح والرصيد بصورة منتظمة، ويمكن للمستخدم متابعة سجل العمليات والأرباح من داخل حسابه.\n\n🔐 نحرص على توفير تجربة آمنة وشفافة، وننصح جميع المستخدمين بقراءة الشروط وفهم آلية الأرباح والمخاطر قبل إيداع أي أموال.\n\n🌍 منصة عالمية لمتابعة الأرباح والمكافآت اليومية.",

          communityInfo:
            "هذه المعلومات خاصة بالمنصة ومتابعة الأرباح اليومية.",

          understood:
            "فهمت، شكراً",

          aboutCommunity:
            "عن مجتمع LumaRise",

          companyMessage:
            "مرحباً بالجميع 🌟\n\nأهلاً بكم في مجتمع LumaRise. هدف هذه الواجهة هو تقديم تجربة مرتبة وسهلة لمتابعة المحتوى والمعلومات المتعلقة بـ LumaRise.\n\nLumaRise هو اسم وهوية مستقلة لهذا التطبيق، ولا يمثل أو يدّعي الارتباط بأي شركة أو جهة رسمية أخرى.\n\nنحن نشجع المستخدمين على التحقق من المعلومات من المصادر الرسمية، وعدم مشاركة كلمات المرور أو مفاتيح المحافظ أو البيانات الحساسة مع أي جهة.\n\nكما ننصح بعدم اتخاذ قرارات مالية اعتماداً على رسائل مجهولة أو وعود بأرباح مضمونة.",

          globalCommunity:
            "مجتمع عالمي للمعلومات والمناقشة",

          communitySections:
            "أقسام المجتمع",

          topic:
            "الموضوع",

          news:
            "الأخبار",

          research:
            "البحث",

          members:
            "الأعضاء",

          discussion:
            "المناقشة",

          verification:
            "التحقق",

          required:
            "ضروري",

          importantInformation:
            "معلومات مهمة",

          doYourResearch:
            "قم بالبحث",

          verifySources:
            "تحقق من المصادر",

          avoidPromises:
            "تجنب الوعود المضمونة",

          iUnderstand:
            "أنا أفهم",

          home:
            "الرئيسية",

          vip:
            "VIP",

          xrp:
            "LumaRise",

          team:
            "الفريق",

          profile:
            "حسابي"

        },


        /* ==================== ENGLISH ==================== */

        EN: {

          supportCenter:
            "Support Center",

          whatsapp:
            "WhatsApp",

          telegram:
            "Telegram",

          communityChannel:
            "Community Channel",

          quickContact:
            "Quick contact",

          supportCommunity:
            "Support community",

          accountBlocked:
            "Account Blocked",

          blockedMessage:
            "Your account has been blocked by the administration.",

          contactSupportReview:
            "Please contact support to review your account status.",

          contactSupport:
            "Contact Support",

          logout:
            "Log Out",

          communityUpdate:
            "Community Update",

          welcomeXrp:
            "💰 LumaRise Community — Daily Earnings",

          xrpMessage1:
            "Welcome to the LumaRise Community 🌟",

          xrpMessage2:
            "Our platform provides an integrated experience for users to follow daily profit programs and rewards linked to the platform, with clear and organized display of balance and profits.",

          xrpMessage3:
            "📈 Daily Profits: Users can track the profits calculated on their accounts according to the program and applicable terms.",

          xrpMessage4:
            "💵 Profit and balance data are updated regularly, and users can track transaction history and profits from within their account.\n\n🔐 We are committed to providing a safe and transparent experience, and we advise all users to read the terms and understand the profit mechanism and risks before depositing any funds.\n\n🌍 A global platform for tracking daily profits and rewards.",

          communityInfo:
            "This information is specific to the platform and daily profit tracking.",

          understood:
            "Understood, Thanks",

          aboutCommunity:
            "About LumaRise Community",

          companyMessage:
            "Welcome everyone 🌟\n\nWelcome to the LumaRise Community. This interface is designed to provide an organized and easy experience for following LumaRise-related information and content.\n\nLumaRise is an independent name and identity for this application. It does not represent or claim affiliation with another company or official organization.\n\nUsers are encouraged to verify information through official sources and never share passwords, wallet keys or sensitive information with anyone.\n\nWe also recommend avoiding financial decisions based on anonymous messages or guaranteed-return promises.",

          globalCommunity:
            "Global information and discussion community",

          communitySections:
            "Community Sections",

          topic:
            "Topic",

          news:
            "News",

          research:
            "Research",

          members:
            "Members",

          discussion:
            "Discussion",

          verification:
            "Verification",

          required:
            "Required",

          importantInformation:
            "Important Information",

          doYourResearch:
            "Do your research",

          verifySources:
            "Verify sources",

          avoidPromises:
            "Avoid guaranteed promises",

          iUnderstand:
            "I Understand",

          home:
            "Home",

          vip:
            "VIP",

          xrp:
            "LumaRise",

          team:
            "Team",

          profile:
            "Profile"

        }

      }

    };

  },


  /* ==================== CREATED ==================== */

  created() {

    const auth = getAuth();

    const savedLang =
      localStorage.getItem("app_language");

    if (savedLang) {

      this.currentLang =
        savedLang;

    }

    this.applyLanguageDirection();


    onAuthStateChanged(auth, (user) => {

      this.user = user;

      this.authLoaded = true;


      if (user) {

        this.startBlockCheck(
          user.uid
        );

        // عرض النافذة بعد تسجيل الدخول مباشرة
        setTimeout(() => {
          this.showOfferMessage = true;
          this.hasNewOffer = false;
        }, 1500);

        setTimeout(() => {

          this.showAd = true;

        }, 3000);

      } else {

        this.stopBlockCheck();

      }

    });


    this.loadButtonPositions();

  },


  /* ==================== MOUNTED ==================== */

  mounted() {

    document.addEventListener(
      "mousemove",
      this.onDrag
    );

    document.addEventListener(
      "mouseup",
      this.stopDrag
    );

    document.addEventListener(
      "touchmove",
      this.onDrag,
      { passive: false }
    );

    document.addEventListener(
      "touchend",
      this.stopDrag
    );

    document.addEventListener(
      "touchcancel",
      this.stopDrag
    );

    document.addEventListener(
      "click",
      this.handleClickOutside
    );

  },


  /* ==================== BEFORE UNMOUNT ==================== */

  beforeUnmount() {

    document.removeEventListener(
      "mousemove",
      this.onDrag
    );

    document.removeEventListener(
      "mouseup",
      this.stopDrag
    );

    document.removeEventListener(
      "touchmove",
      this.onDrag
    );

    document.removeEventListener(
      "touchend",
      this.stopDrag
    );

    document.removeEventListener(
      "touchcancel",
      this.stopDrag
    );

    document.removeEventListener(
      "click",
      this.handleClickOutside
    );

    this.stopBlockCheck();

  },


  /* ==================== COMPUTED ==================== */

  computed: {

    showBottomNav() {

      if (!this.user) {

        return false;

      }


      const path =
        this.$route.path;


      const hiddenPaths = [

        "/login",

        "/register",

        "/admin",

        "/403"

      ];


      return !hiddenPaths.some(
        (p) =>
          path.startsWith(p)
      );

    }

  },


  /* ==================== METHODS ==================== */

  methods: {

    /* ---------- TRANSLATION ---------- */

    t(key) {

      return (
        this.translations[
          this.currentLang
        ]?.[key] ||

        this.translations.AR[key] ||

        key
      );

    },


    /* ---------- LANGUAGE ---------- */

    applyLanguageDirection() {

      document.documentElement.dir =
        this.currentLang === "AR"
          ? "rtl"
          : "ltr";


      document.documentElement.lang =
        this.currentLang.toLowerCase();

    },


    /* ---------- BLOCK CHECK ---------- */

    startBlockCheck(userId) {

      this.stopBlockCheck();


      this.checkBlockStatus(
        userId
      );


      this.blockCheckInterval =
        setInterval(() => {

          this.checkBlockStatus(
            userId
          );

        }, 30000);

    },


    stopBlockCheck() {

      if (
        this.blockCheckInterval
      ) {

        clearInterval(
          this.blockCheckInterval
        );

        this.blockCheckInterval =
          null;

      }

    },


    async checkBlockStatus(userId) {

      try {

        const userRef =
          doc(
            db,
            "users",
            userId
          );


        const docSnap =
          await getDoc(
            userRef
          );


        if (
          docSnap.exists() &&
          docSnap.data().blocked === true
        ) {

          const auth =
            getAuth();


          const currentUser =
            auth.currentUser;


          if (
            currentUser &&
            currentUser.uid === userId
          ) {

            this.showBlockedModal =
              true;


            this.stopBlockCheck();

          }

        }

      } catch (error) {

        console.error(
          "خطأ في فحص حالة الحظر:",
          error
        );

      }

    },


    /* ---------- LOGOUT ---------- */

    handleBlockedModalClose() {

      this.showBlockedModal =
        false;


      this.logoutAndRedirect();

    },


    async logoutAndRedirect() {

      const auth =
        getAuth();


      try {

        await signOut(
          auth
        );

      } catch (e) {

        console.error(e);

      }


      this.$router.push(
        "/login"
      );

    },


    /* ---------- SUPPORT ---------- */

    contactSupportFromBlocked() {

      const dept =
        this.whatsappNumbers.support;


      if (
        dept &&
        dept.number
      ) {

        window.open(

          `https://wa.me/${dept.number}?text=${encodeURIComponent(
            "مرحباً، حسابي محظور وأحتاج مساعدة"
          )}`,

          "_blank"

        );

      }

    },


    openWhatsApp() {

      const dept =
        this.whatsappNumbers.support;


      if (
        dept &&
        dept.number
      ) {

        window.open(

          `https://wa.me/${dept.number}?text=${encodeURIComponent(
            dept.message
          )}`,

          "_blank"

        );

      }


      this.showSupportMenu =
        false;

    },


    openTelegram() {

      if (
        this.telegramLink
      ) {

        window.open(
          this.telegramLink,
          "_blank"
        );

      } else {

        alert(

          this.currentLang === "AR"

            ? "لم يتم إعداد رابط الدعم بعد."

            : "The support link has not been configured yet."

        );

      }


      this.showSupportMenu =
        false;

    },


    openTelegramChannel() {

      if (
        this.telegramChannelLink
      ) {

        window.open(
          this.telegramChannelLink,
          "_blank"
        );

      } else {

        alert(

          this.currentLang === "AR"

            ? "لم يتم إعداد رابط القناة بعد."

            : "The channel link has not been configured yet."

        );

      }


      this.showSupportMenu =
        false;

    },


    /* ---------- MENUS ---------- */

    toggleSupportMenu() {

      if (this.hasDragged) {

        this.hasDragged =
          false;

        return;

      }


      this.showSupportMenu =
        !this.showSupportMenu;

    },


    closeSupportMenu() {

      this.showSupportMenu =
        false;

    },


    /* ---------- COMMUNITY MODAL ---------- */

    toggleOfferMessage() {

      if (this.hasDragged) {

        this.hasDragged =
          false;

        return;

      }


      this.showOfferMessage =
        !this.showOfferMessage;


      if (
        this.showOfferMessage
      ) {

        this.hasNewOffer =
          false;

      }

    },


    closeOfferMessage() {

      this.showOfferMessage =
        false;

    },


    closeAd() {

      this.showAd =
        false;

    },


    /* ---------- NAVIGATION ---------- */

    navigateTo(path) {

      if (
        this.$route.path !== path
      ) {

        this.$router.push(
          path
        );

      }

    },


    isActive(path) {

      return (
        this.$route.path === path
      );

    },


    /* ---------- DRAG ---------- */

    startDrag(event) {

      this.hasDragged =
        false;


      const button =
        event.currentTarget;


      this.currentButton =
        button;


      this.dragging =
        true;


      if (
        event.type ===
        "mousedown"
      ) {

        this.startX =
          event.clientX;

        this.startY =
          event.clientY;

      } else if (
        event.type ===
        "touchstart"
      ) {

        this.startX =
          event.touches[0].clientX;

        this.startY =
          event.touches[0].clientY;

      }


      const computedStyle =
        window.getComputedStyle(
          button
        );


      this.initialLeft =
        parseFloat(
          computedStyle.right
        ) || 15;


      this.initialBottom =
        parseFloat(
          computedStyle.bottom
        ) || 100;


      button.classList.add(
        "dragging"
      );

    },


    onDrag(event) {

      if (
        !this.dragging ||
        !this.currentButton
      ) {

        return;

      }


      event.preventDefault();


      let currentX;

      let currentY;


      if (
        event.type ===
        "mousemove"
      ) {

        currentX =
          event.clientX;

        currentY =
          event.clientY;

      } else if (
        event.type ===
        "touchmove"
      ) {

        currentX =
          event.touches[0].clientX;

        currentY =
          event.touches[0].clientY;

      } else {

        return;

      }


      const deltaX =
        Math.abs(
          currentX -
          this.startX
        );


      const deltaY =
        Math.abs(
          currentY -
          this.startY
        );


      if (
        deltaX >
          this.clickThreshold ||

        deltaY >
          this.clickThreshold
      ) {

        this.hasDragged =
          true;

      }


      const newRight =
        Math.max(

          5,

          Math.min(

            window.innerWidth - 50,

            this.initialLeft -

              (
                currentX -
                this.startX
              )

          )

        );


      const newBottom =
        Math.max(

          10,

          Math.min(

            window.innerHeight - 150,

            this.initialBottom -

              (
                currentY -
                this.startY
              )

          )

        );


      this.currentButton.style.right =
        newRight + "px";


      this.currentButton.style.bottom =
        newBottom + "px";

    },


    stopDrag() {

      if (
        this.dragging &&
        this.currentButton
      ) {

        this.saveButtonPosition(
          this.currentButton
        );


        this.currentButton.classList.remove(
          "dragging"
        );

      }


      this.dragging =
        false;


      this.currentButton =
        null;

    },


    saveButtonPosition(button) {

      const className =
        button.className
          .split(" ")
          .find(
            cls =>
              cls.includes("-btn")
          );


      if (!className) {

        return;

      }


      const right =
        button.style.right;


      const bottom =
        button.style.bottom;


      if (
        right &&
        bottom
      ) {

        const positions =
          JSON.parse(

            localStorage.getItem(
              "buttonPositions"
            ) || "{}"

          );


        positions[className] = {

          right,

          bottom

        };


        localStorage.setItem(

          "buttonPositions",

          JSON.stringify(
            positions
          )

        );

      }

    },


    loadButtonPositions() {

      this.$nextTick(() => {

        const positions =
          JSON.parse(

            localStorage.getItem(
              "buttonPositions"
            ) || "{}"

          );


        setTimeout(() => {

          document
            .querySelectorAll(
              ".circle-btn"
            )
            .forEach(btn => {

              const className =
                btn.className
                  .split(" ")
                  .find(
                    cls =>
                      cls.includes("-btn")
                  );


              if (
                className &&
                positions[className]
              ) {

                btn.style.right =
                  positions[
                    className
                  ].right;


                btn.style.bottom =
                  positions[
                    className
                  ].bottom;

              }

            });

        }, 100);

      });

    },


    /* ---------- CLICK OUTSIDE ---------- */

    handleClickOutside(event) {

      if (
        !event.target.closest(
          ".support-menu"
        ) &&
        !event.target.closest(
          ".support-btn"
        )
      ) {

        this.showSupportMenu =
          false;

      }

    }

  }

};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


body {

  font-family:
    'Cairo',
    sans-serif;

  background: #0A0A0A;

  color: #ffffff;

  overflow-x: hidden;

  min-height: 100vh;

}


#app {

  min-height: 100vh;

  position: relative;

}


#app.rtl {

  direction: rtl;

}


.page-container {

  width: 100%;

  max-width: 100%;

  margin: 0 auto;

  position: relative;

  z-index: 1;

  min-height: 100vh;

  padding-bottom: 85px;

}


/* ==================== FLOATING BUTTONS ==================== */

.circle-btn {

  position: fixed;

  width: 48px;

  height: 48px;

  background: #1A1A1A;

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 50%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  color: #ffffff;

  font-size: 18px;

  cursor: grab;

  z-index: 9999;

  box-shadow:
    0 4px 20px
    rgba(0,0,0,0.6);

  transition:
    all 0.3s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );

  text-decoration: none;

  user-select: none;

  touch-action: none;

  pointer-events: auto;

}


.circle-btn:hover {

  transform:
    translateY(-3px)
    scale(1.05);

  box-shadow:
    0 8px 30px
    rgba(0,0,0,0.8);

  border-color:
    rgba(255,255,255,0.2);

}


.circle-btn.dragging {

  cursor: grabbing;

  opacity: 0.9;

  transform:
    scale(1.05);

  transition: none;

}


.circle-btn:active {

  cursor: grabbing;

}


.support-btn {

  right: 12px;

  bottom: 100px;

}


.x-btn {

  right: 68px;

  bottom: 100px;

  display: flex;

  align-items: center;

  justify-content: center;

}


.x-btn svg {

  width: 20px;

  height: 20px;

  fill: #ffffff;

}


/* ==================== SUPPORT MENU ==================== */

.support-menu {

  position: fixed;

  background: #1A1A1A;

  border-radius: 16px;

  box-shadow:
    0 10px 40px
      rgba(0,0,0,0.8),
    0 0 0 1px
      rgba(255,255,255,0.06);

  z-index: 9998;

  overflow: hidden;

  min-width: 250px;

  bottom: 155px;

  right: 12px;

  animation:
    slideUp 0.3s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );

}


@keyframes slideUp {

  from {

    opacity: 0;

    transform:
      translateY(15px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }

}


.support-menu-header {

  padding: 16px 18px;

  background: #222222;

  color: #ffffff;

  font-weight: 700;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);

}


.header-title {

  display: flex;

  align-items: center;

  gap: 10px;

}


.support-menu-header i {

  font-size: 18px;

  color: rgba(255,255,255,0.6);

}


.close-btn {

  background:
    rgba(255,255,255,0.06);

  border: none;

  color: rgba(255,255,255,0.6);

  width: 30px;

  height: 30px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  transition: all 0.2s;

}


.close-btn:hover {

  background:
    rgba(255,255,255,0.12);

  transform:
    rotate(90deg);

  color: #ffffff;

}


.support-menu-body {

  max-height: 300px;

  overflow-y: auto;

}


.support-item {

  padding: 14px 16px;

  display: flex;

  align-items: center;

  gap: 14px;

  cursor: pointer;

  transition: all 0.2s;

  border-bottom:
    1px solid
    rgba(255,255,255,0.04);

}


.support-item:last-child {

  border-bottom: none;

}


.support-item:hover {

  background:
    rgba(255,255,255,0.04);

}


.support-icon {

  width: 40px;

  height: 40px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;

}


.support-icon.whatsapp {

  background:
    rgba(37,211,102,0.15);

  color: #25D366;

}


.support-icon.telegram {

  background:
    rgba(0,136,204,0.15);

  color: #0088cc;

}


.support-info {

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 2px;

}


.support-name {

  font-weight: 600;

  font-size: 14px;

  color: #ffffff;

}


.support-desc {

  font-size: 12px;

  color:
    rgba(255,255,255,0.5);

}


.support-arrow {

  color:
    rgba(255,255,255,0.3);

  font-size: 12px;

}


/* ==================== MODALS ==================== */

.modal-overlay {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background:
    rgba(0,0,0,0.85);

  backdrop-filter: blur(12px);

  -webkit-backdrop-filter: blur(12px);

  display: flex;

  justify-content: center;

  align-items: center;

  z-index: 10000;

  padding: 20px;

  animation:
    fadeIn 0.3s;

}


@keyframes fadeIn {

  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }

}


.modal-container {

  background: #1A1A1A;

  border-radius: 20px;

  max-width: 600px;

  width: 100%;

  max-height: 90vh;

  overflow: hidden;

  box-shadow:
    0 20px 60px
      rgba(0,0,0,0.8);

  border:
    1px solid
    rgba(255,255,255,0.06);

  animation:
    modalSlide 0.4s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );

}


@keyframes modalSlide {

  from {

    opacity: 0;

    transform:
      translateY(30px)
      scale(0.96);

  }

  to {

    opacity: 1;

    transform:
      translateY(0)
      scale(1);

  }

}


/* ==================== BLOCKED ==================== */

.blocked-modal {

  max-width: 420px;

}


.blocked-header {

  background: #222222;

  padding: 30px 20px;

  text-align: center;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);

}


.blocked-icon {

  width: 64px;

  height: 64px;

  background:
    rgba(255,59,48,0.12);

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  margin:
    0 auto 15px;

  border:
    1px solid
    rgba(255,59,48,0.2);

}


.blocked-icon i {

  font-size: 28px;

  color: #ff3b30;

}


.blocked-header h2 {

  color: #ffffff;

  font-size: 20px;

  font-weight: 800;

}


.blocked-body {

  padding: 24px;

}


.blocked-message {

  background:
    rgba(255,59,48,0.06);

  border:
    1px solid
    rgba(255,59,48,0.12);

  border-radius: 12px;

  padding: 14px;

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 18px;

}


.blocked-message i {

  color: #ff3b30;

  font-size: 18px;

}


.blocked-message p {

  color: #ff6b6b;

  font-size: 14px;

  font-weight: 600;

  margin: 0;

}


.blocked-info {

  margin-bottom: 20px;

}


.info-item {

  display: flex;

  align-items: center;

  gap: 12px;

  padding: 12px 15px;

  background:
    rgba(255,255,255,0.03);

  border-radius: 10px;

  color:
    rgba(255,255,255,0.7);

  font-size: 14px;

}


.info-item i {

  color: rgba(255,255,255,0.4);

  font-size: 18px;

}


.blocked-actions {

  margin-bottom: 10px;

}


.support-btn-action {

  width: 100%;

  padding: 14px;

  background: #ffffff;

  color: #0A0A0A;

  border: none;

  border-radius: 12px;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  transition: all 0.3s;

}


.support-btn-action:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 8px 25px
    rgba(255,255,255,0.1);

}


.support-btn-action i {

  font-size: 20px;

}


.blocked-footer {

  padding: 20px;

  border-top:
    1px solid
    rgba(255,255,255,0.06);

}


/* ==================== LumaRise MODAL ==================== */

.offer-modal .modal-header {

  background: #222222;

  padding: 18px 20px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);

}


.sender-info {

  display: flex;

  align-items: center;

  gap: 14px;

}


.sender-avatar {

  width: 44px;

  height: 44px;

  background: rgba(255,255,255,0.06);

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 20px;

  font-weight: 800;

  border:
    1px solid
    rgba(255,255,255,0.08);

  color: #ffffff;

}


.sender-details {

  display: flex;

  flex-direction: column;

}


.sender-name {

  font-weight: 700;

  font-size: 16px;

  color: #ffffff;

}


.sender-time {

  font-size: 11px;

  color:
    rgba(255,255,255,0.4);

}


.modal-close {

  background:
    rgba(255,255,255,0.06);

  border: none;

  color: rgba(255,255,255,0.5);

  width: 34px;

  height: 34px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  transition: all 0.2s;

}


.modal-close:hover {

  background:
    rgba(255,255,255,0.12);

  color: #ffffff;

  transform:
    rotate(90deg);

}


.modal-body {

  padding: 24px;

  max-height: 60vh;

  overflow-y: auto;

}


.offer-content {

  display: flex;

  flex-direction: column;

  gap: 18px;

}


.offer-title {

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 20px;

  font-weight: 700;

  color: #ffffff;

}


.xrp-title-symbol {

  width: 32px;

  height: 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(255,255,255,0.08);

  color: #ffffff;

  font-weight: 800;

}


.offer-text {

  line-height: 1.8;

  color:
    rgba(255,255,255,0.85);

}


.offer-text p {

  margin-bottom: 14px;

  font-size: 14px;

  white-space: pre-line;

}


.highlight-box {

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid
    rgba(255,255,255,0.08);

  border-radius: 12px;

  padding: 14px;

  margin: 14px 0;

  display: flex;

  align-items: flex-start;

  gap: 10px;

}


.highlight-box i {

  color: rgba(255,255,255,0.4);

  font-size: 18px;

  margin-top: 2px;

}


.modal-footer {

  padding: 18px 20px;

  border-top:
    1px solid
    rgba(255,255,255,0.06);

}


/* ==================== AD ==================== */

.ad-overlay .ad-container {

  max-width: 720px;

  max-height: 95vh;

}


.ad-header {

  background: #222222;

  padding: 18px 20px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);

}


.ad-title {

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 18px;

  font-weight: 800;

  color: #ffffff;

}


.header-xrp-symbol {

  width: 28px;

  height: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: rgba(255,255,255,0.06);

  color: rgba(255,255,255,0.6);

  border-radius: 50%;

  font-size: 13px;

}


.ad-close {

  background:
    rgba(255,255,255,0.06);

  border: none;

  color: rgba(255,255,255,0.5);

  width: 36px;

  height: 36px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  transition: all 0.2s;

}


.ad-close:hover {

  background:
    rgba(255,255,255,0.12);

  color: #ffffff;

  transform:
    rotate(90deg);

}


.ad-body {

  padding: 24px;

  max-height: 70vh;

  overflow-y: auto;

}


.company-message {

  background: #222222;

  border-radius: 14px;

  padding: 18px;

  margin-bottom: 18px;

  border:
    1px solid
    rgba(255,255,255,0.04);

}


.message-header {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 12px;

  color: #ffffff;

}


.message-xrp-icon {

  width: 32px;

  height: 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: rgba(255,255,255,0.06);

  color: rgba(255,255,255,0.6);

  font-weight: 800;

}


.message-header h3 {

  font-size: 18px;

  font-weight: 700;

}


.message-content p {

  line-height: 2;

  color:
    rgba(255,255,255,0.8);

  white-space: pre-line;

  text-align: justify;

  font-size: 14px;

}


.partnerships {

  background: rgba(255,255,255,0.04);

  border:
    1px solid
    rgba(255,255,255,0.06);

  border-radius: 12px;

  padding: 14px 18px;

  display: flex;

  align-items: center;

  gap: 10px;

  margin: 18px 0;

  color: rgba(255,255,255,0.6);

  font-weight: 600;

  font-size: 13px;

}


.partnerships i {

  font-size: 20px;

  color: rgba(255,255,255,0.3);

}


.vip-section h3 {

  color: #ffffff;

  text-align: center;

  margin-bottom: 18px;

  font-size: 20px;

  font-weight: 700;

}


.vip-grid {

  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(220px,1fr)
    );

  gap: 12px;

}


.vip-card {

  background: #222222;

  border-radius: 14px;

  overflow: hidden;

  border:
    1px solid
    rgba(255,255,255,0.04);

  transition: all 0.3s;

}


.vip-card:hover {

  transform:
    translateY(-4px);

  box-shadow:
    0 10px 30px
    rgba(0,0,0,0.4);

  border-color:
    rgba(255,255,255,0.08);

}


.vip-header {

  padding: 14px;

  text-align: center;

  font-weight: 700;

  font-size: 16px;

  background: rgba(255,255,255,0.04);

}


.vip-bronze .vip-header {

  color: #CD7F32;

}


.vip-silver .vip-header {

  color: #C0C0C0;

}


.vip-gold .vip-header {

  color: #D4AF37;

}


.vip-platinum .vip-header {

  color: #E5E4E2;

}


.vip-body {

  padding: 14px;

}


.vip-item {

  display: flex;

  justify-content: space-between;

  padding: 6px 0;

  border-bottom:
    1px solid
    rgba(255,255,255,0.04);

}


.vip-item:last-child {

  border-bottom: none;

}


.vip-label {

  color:
    rgba(255,255,255,0.5);

  font-size: 13px;

}


.vip-value {

  color:
    rgba(255,255,255,0.8);

  font-weight: 600;

  font-size: 13px;

}


.commission-box {

  background: #222222;

  border-radius: 14px;

  padding: 18px;

  text-align: center;

  margin: 18px 0;

  border:
    1px solid
    rgba(255,255,255,0.04);

}


.commission-box h4 {

  color: #ffffff;

  margin-bottom: 14px;

  font-size: 16px;

  font-weight: 700;

}


.commission-row {

  display: flex;

  justify-content: center;

  gap: 20px;

  flex-wrap: wrap;

}


.commission-row span {

  background:
    rgba(255,255,255,0.04);

  padding: 6px 14px;

  border-radius: 8px;

  color: rgba(255,255,255,0.7);

  font-weight: 600;

  font-size: 13px;

}


.ad-footer {

  padding: 18px 20px;

  border-top:
    1px solid
    rgba(255,255,255,0.06);

}


/* ==================== BUTTON ==================== */

.btn-primary {

  width: 100%;

  padding: 14px;

  background: #ffffff;

  color: #0A0A0A;

  border: none;

  border-radius: 12px;

  font-weight: 700;

  font-size: 15px;

  cursor: pointer;

  transition: all 0.3s;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  box-shadow:
    0 4px 15px
    rgba(255,255,255,0.05);

}


.btn-primary:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 8px 25px
    rgba(255,255,255,0.08);

}


/* ==================== BOTTOM NAV ==================== */

.bottom-nav {

  position: fixed;

  bottom: 0;

  left: 0;

  right: 0;

  height: 75px;

  background: #1A1A1A;

  display: flex;

  justify-content: space-around;

  align-items: center;

  border-top:
    1px solid
    rgba(255,255,255,0.06);

  box-shadow:
    0 -5px 25px
    rgba(0,0,0,0.5);

  z-index: 9997;

  direction: rtl;

  padding: 0 4px;

}


.nav-item {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color:
    rgba(255,255,255,0.4);

  font-size: 11px;

  cursor: pointer;

  transition: all 0.3s;

  padding: 6px 12px;

  border-radius: 12px;

  flex: 1;

  height: 100%;

  gap: 2px;

}


.nav-item i {

  font-size: 20px;

  margin-bottom: 2px;

  transition: all 0.3s;

}


.nav-item:hover {

  color:
    rgba(255,255,255,0.7);

}


.nav-item.active {

  color: #0A0A0A;

  background: #ffffff;

  border-radius: 12px;

  margin: 6px 4px;

}


.nav-item.active i {

  color: #0A0A0A;

}


.nav-item.active span {

  color: #0A0A0A;

}


/* ==================== TRANSITIONS ==================== */

.fade-enter-active,
.fade-leave-active {

  transition:
    all 0.25s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );

}


.fade-enter-from,
.fade-leave-to {

  opacity: 0;

  transform:
    translateY(-8px);

}


.modal-enter-active,
.modal-leave-active {

  transition:
    all 0.3s
    cubic-bezier(
      0.4,
      0,
      0.2,
      1
    );

}


.modal-enter-from,
.modal-leave-to {

  opacity: 0;

}


/* ==================== SCROLLBAR ==================== */

::-webkit-scrollbar {

  width: 6px;

}


::-webkit-scrollbar-track {

  background: #1A1A1A;

}


::-webkit-scrollbar-thumb {

  background: #333333;

  border-radius: 10px;

}


::-webkit-scrollbar-thumb:hover {

  background: #444444;

}


/* ==================== TABLET ==================== */

@media (max-width: 768px) {

  .circle-btn {

    width: 44px;

    height: 44px;

    font-size: 16px;

  }


  .support-btn {

    right: 10px;

    bottom: 95px;

  }


  .x-btn {

    right: 62px;

    bottom: 95px;

  }


  .support-menu {

    right: 10px;

    bottom: 148px;

    min-width: 200px;

  }


  .bottom-nav {

    height: 70px;

  }


  .nav-item {

    font-size: 10px;

    padding: 4px 8px;

  }


  .nav-item i {

    font-size: 18px;

  }


  .modal-container {

    margin: 10px;

    max-height: 95vh;

  }


  .vip-grid {

    grid-template-columns: 1fr;

  }


  .commission-row {

    flex-direction: column;

    gap: 8px;

  }

}


/* ==================== MOBILE ==================== */

@media (max-width: 480px) {

  .circle-btn {

    width: 40px;

    height: 40px;

    font-size: 14px;

  }


  .support-btn {

    right: 8px;

    bottom: 90px;

  }


  .x-btn {

    right: 56px;

    bottom: 90px;

  }


  .x-btn svg {

    width: 18px;

    height: 18px;

  }


  .support-menu {

    right: 8px;

    bottom: 142px;

    min-width: 180px;

  }


  .support-menu-header {

    padding: 14px 16px;

    font-size: 14px;

  }


  .support-item {

    padding: 12px 14px;

  }


  .support-name {

    font-size: 13px;

  }


  .ad-title {

    font-size: 16px;

  }


  .message-content p {

    font-size: 13px;

    line-height: 1.8;

  }


  .offer-title {

    font-size: 17px;

  }


  .modal-body {

    padding: 18px;

  }


  .blocked-header h2 {

    font-size: 18px;

  }


  .blocked-message p {

    font-size: 13px;

  }


  .bottom-nav {

    height: 65px;

  }


  .nav-item {

    font-size: 9px;

    padding: 2px 4px;

  }


  .nav-item i {

    font-size: 16px;

  }

}
</style>
