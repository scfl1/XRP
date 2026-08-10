<template>
  <div id="app" :class="{ rtl: currentLang === 'AR' }">

    <!-- ==================== الأزرار العائمة ==================== -->

    <!-- زر تغيير اللغة -->
    <div
      class="circle-btn lang-btn"
      ref="langBtn"
      @click="toggleLanguageMenu"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <i class="fas fa-globe"></i>
      <span class="lang-code">{{ currentLang }}</span>
    </div>

    <!-- زر الأخبار / التحديثات -->
    <div
      class="circle-btn offer-btn"
      ref="offerBtn"
      @click="toggleOfferMessage"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <span class="xrp-mark">X</span>
      <div class="notification-badge" v-if="hasNewOffer">3</div>
    </div>

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
      href="https://x.com/"
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

          <div class="support-item" @click="openWhatsApp">

            <div class="support-icon whatsapp">
              <i class="fab fa-whatsapp"></i>
            </div>

            <div class="support-info">
              <span class="support-name">
                {{ t('whatsapp') }}
              </span>

              <span class="support-desc">
                {{ t('quickContact') }}
              </span>
            </div>

            <i class="fas fa-chevron-left support-arrow"></i>

          </div>


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


          <div class="support-item" @click="openTelegramChannel">

            <div class="support-icon telegram">
              <i class="fab fa-telegram"></i>
            </div>

            <div class="support-info">
              <span class="support-name">
                {{ t('communityChannel') }}
              </span>

              <span class="support-desc">
                XRP Community
              </span>
            </div>

            <i class="fas fa-chevron-left support-arrow"></i>

          </div>

        </div>

      </div>
    </transition>


    <!-- ==================== قائمة اللغات ==================== -->

    <transition name="fade">

      <div v-if="showLangMenu" class="lang-menu" @click.stop>

        <div class="lang-menu-header">

          <i class="fas fa-language"></i>

          <span>
            {{ t('selectLanguage') }}
          </span>

        </div>

        <div class="lang-menu-body">

          <div
            v-for="lang in languages"
            :key="lang.code"
            class="lang-item"
            @click="setLanguage(lang)"
            :class="{ active: currentLang === lang.code }"
          >

            <span class="lang-name">
              {{ lang.name }}
            </span>

            <span class="lang-badge">
              {{ lang.code }}
            </span>

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


    <!-- ==================== نافذة XRP Community ==================== -->

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
                  XRP Community
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


                <div class="highlight-box">

                  <i class="fas fa-info-circle"></i>

                  <strong>
                    {{ t('communityInfo') }}
                  </strong>

                </div>


                <p>
                  {{ t('xrpMessage2') }}
                </p>


                <h4>
                  📌 {{ t('communityPrinciples') }}
                </h4>


                <div class="rewards-table">

                  <div class="table-header">

                    <div class="col-members">
                      🌐 {{ t('item') }}
                    </div>

                    <div class="col-salary">
                      ✓ {{ t('status') }}
                    </div>

                  </div>


                  <div class="table-body">

                    <div class="table-row">

                      <div class="col-members">
                        {{ t('information') }}
                      </div>

                      <div class="col-salary">
                        {{ t('available') }}
                      </div>

                    </div>


                    <div class="table-row">

                      <div class="col-members">
                        {{ t('community') }}
                      </div>

                      <div class="col-salary">
                        {{ t('active') }}
                      </div>

                    </div>


                    <div class="table-row">

                      <div class="col-members">
                        {{ t('updates') }}
                      </div>

                      <div class="col-salary">
                        {{ t('ongoing') }}
                      </div>

                    </div>


                    <div class="table-row">

                      <div class="col-members">
                        {{ t('security') }}
                      </div>

                      <div class="col-salary">
                        {{ t('important') }}
                      </div>

                    </div>

                  </div>

                </div>


                <div class="offer-notes">

                  <div class="note-item">

                    <i class="fas fa-check-circle"></i>

                    <span>
                      {{ t('note1') }}
                    </span>

                  </div>


                  <div class="note-item">

                    <i class="fas fa-check-circle"></i>

                    <span>
                      {{ t('note2') }}
                    </span>

                  </div>


                  <div class="note-item">

                    <i class="fas fa-check-circle"></i>

                    <span>
                      {{ t('note3') }}
                    </span>

                  </div>

                </div>


                <div class="important-note">

                  <i class="fas fa-exclamation-triangle"></i>

                  <strong>
                    {{ t('importantNote') }}:
                  </strong>

                  <p>
                    {{ t('notOfficialNotice') }}
                  </p>

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
                XRP Community
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
                    XRP
                  </div>

                  <div class="vip-body">

                    <div class="vip-item">

                      <span class="vip-label">
                        🌐 {{ t('topic') }}
                      </span>

                      <span class="vip-value">
                        XRP
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

      showLangMenu: false,

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

      telegramLink: "",

      telegramChannelLink: "",


      /* ==================== COMMUNITY ==================== */

      communitySections: [

        {
          title: "XRP",
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


      /* ==================== LANGUAGES ==================== */

      languages: [

        {
          name: "العربية",
          code: "AR"
        },

        {
          name: "English",
          code: "EN"
        },

        {
          name: "Français",
          code: "FR"
        },

        {
          name: "Español",
          code: "ES"
        },

        {
          name: "Deutsch",
          code: "DE"
        },

        {
          name: "Italiano",
          code: "IT"
        },

        {
          name: "Polski",
          code: "PL"
        },

        {
          name: "Русский",
          code: "RU"
        },

        {
          name: "Türkçe",
          code: "TR"
        },

        {
          name: "Português",
          code: "PT"
        },

        {
          name: "فارسی",
          code: "FA"
        },

        {
          name: "Tiếng Việt",
          code: "VI"
        },

        {
          name: "日本語",
          code: "JP"
        },

        {
          name: "한국어",
          code: "KR"
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
          icon: "fas fa-tasks",
          label: "tasks"
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

          selectLanguage: "اختر اللغة",

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
            "مرحباً بكم في مجتمع XRP",

          xrpMessage1:
            "مرحباً بكم في مجتمع XRP. تم تصميم هذه الواجهة لتوفير مساحة بسيطة ومنظمة لمتابعة المعلومات والأخبار والمناقشات المتعلقة بـ XRP.",

          communityInfo:
            "المعلومات المعروضة هنا هي معلومات مجتمعية وليست إعلاناً رسمياً من XRP أو Ripple.",

          xrpMessage2:
            "ننصح دائماً بالاعتماد على المصادر الرسمية والتحقق من أي معلومة قبل اتخاذ أي قرار مالي أو استثماري.",

          communityPrinciples:
            "مبادئ المجتمع",

          item:
            "العنصر",

          status:
            "الحالة",

          information:
            "المعلومات",

          available:
            "متاحة",

          community:
            "المجتمع",

          active:
            "نشط",

          updates:
            "التحديثات",

          ongoing:
            "مستمرة",

          security:
            "الأمان",

          important:
            "مهم",

          note1:
            "متابعة الأخبار والمعلومات من مصادر موثوقة.",

          note2:
            "التحقق من الروابط والحسابات قبل التفاعل معها.",

          note3:
            "عدم الاعتماد على وعود الأرباح أو العوائد المضمونة.",

          importantNote:
            "ملاحظة مهمة",

          notOfficialNotice:
            "هذا المشروع المجتمعي ليس تابعاً رسمياً لـ XRP أو Ripple. يجب التحقق دائماً من الحسابات والمصادر الرسمية.",

          understood:
            "فهمت، شكراً",

          aboutCommunity:
            "عن مجتمع XRP",

          companyMessage:
            "مرحباً بالجميع 🌟\n\nأهلاً بكم في مجتمع XRP. هدف هذه الواجهة هو تقديم تجربة مرتبة وسهلة لمتابعة المحتوى والمعلومات المتعلقة بـ XRP.\n\nXRP هو اسم أصل رقمي، بينما Ripple هي شركة مستقلة. وجود اسم XRP في هذه الواجهة لا يعني أن الموقع تابع أو معتمد من Ripple أو أي جهة رسمية مرتبطة بـ XRP.\n\nنحن نشجع المستخدمين على التحقق من المعلومات من المصادر الرسمية، وعدم مشاركة كلمات المرور أو مفاتيح المحافظ أو البيانات الحساسة مع أي جهة.\n\nكما ننصح بعدم اتخاذ قرارات مالية اعتماداً على رسائل مجهولة أو وعود بأرباح مضمونة.",

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

          tasks:
            "المهام",

          team:
            "الفريق",

          profile:
            "حسابي"

        },


        /* ==================== ENGLISH ==================== */

        EN: {

          supportCenter:
            "Support Center",

          selectLanguage:
            "Select Language",

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
            "Welcome to the XRP Community",

          xrpMessage1:
            "Welcome to the XRP Community. This interface provides a simple and organized place to follow information, news and discussions related to XRP.",

          communityInfo:
            "The information displayed here is community content and is not an official announcement from XRP or Ripple.",

          xrpMessage2:
            "Always verify information through official sources before making any financial or investment decision.",

          communityPrinciples:
            "Community Principles",

          item:
            "Item",

          status:
            "Status",

          information:
            "Information",

          available:
            "Available",

          community:
            "Community",

          active:
            "Active",

          updates:
            "Updates",

          ongoing:
            "Ongoing",

          security:
            "Security",

          important:
            "Important",

          note1:
            "Follow news and information from reliable sources.",

          note2:
            "Verify links and accounts before interacting with them.",

          note3:
            "Do not rely on guaranteed profit or return promises.",

          importantNote:
            "Important Note",

          notOfficialNotice:
            "This community project is not officially affiliated with XRP or Ripple. Always verify official accounts and sources.",

          understood:
            "Understood, Thanks",

          aboutCommunity:
            "About XRP Community",

          companyMessage:
            "Welcome everyone 🌟\n\nWelcome to the XRP Community. This interface is designed to provide an organized and easy experience for following XRP-related information and content.\n\nXRP is the name of a digital asset, while Ripple is an independent company. Mentioning XRP here does not mean that this website is affiliated with or endorsed by Ripple or any official XRP organization.\n\nUsers are encouraged to verify information through official sources and never share passwords, wallet keys or sensitive information with anyone.\n\nWe also recommend avoiding financial decisions based on anonymous messages or guaranteed-return promises.",

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

          tasks:
            "Tasks",

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


        setTimeout(() => {

          this.showAd = true;

        }, 1000);

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


    setLanguage(lang) {

      this.currentLang =
        lang.code;


      localStorage.setItem(
        "app_language",
        lang.code
      );


      this.showLangMenu = false;


      this.applyLanguageDirection();

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

    toggleLanguageMenu() {

      if (this.hasDragged) {

        this.hasDragged =
          false;

        return;

      }


      this.showLangMenu =
        !this.showLangMenu;


      if (
        this.showLangMenu
      ) {

        this.showSupportMenu =
          false;

      }

    },


    toggleSupportMenu() {

      if (this.hasDragged) {

        this.hasDragged =
          false;

        return;

      }


      this.showSupportMenu =
        !this.showSupportMenu;


      if (
        this.showSupportMenu
      ) {

        this.showLangMenu =
          false;

      }

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
          ".lang-menu"
        ) &&
        !event.target.closest(
          ".lang-btn"
        )
      ) {

        this.showLangMenu =
          false;

      }


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
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

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

  background:
    linear-gradient(
      135deg,
      #0A0C10 0%,
      #1A1F2A 100%
    );

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

  padding-bottom: 80px;

}


/* ==================== COLORS ==================== */

:root {

  --xrp-gold: #D4AF37;

  --xrp-light: #F6E27A;

  --xrp-dark: #0A0C10;

  --xrp-panel: #1A1F2A;

}


/* ==================== FLOATING BUTTONS ==================== */

.circle-btn {

  position: fixed;

  width: 42px;

  height: 42px;

  background:
    linear-gradient(
      135deg,
      #11151C,
      #1A1F2A
    );

  border:
    2px solid #D4AF37;

  border-radius: 50%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  color: #D4AF37;

  font-size: 18px;

  cursor: grab;

  z-index: 9999;

  box-shadow:
    0 5px 20px
    rgba(212,175,55,0.3);

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
    0 8px 25px
    rgba(212,175,55,0.5);

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A
    );

  color: #0A0C10;

}


.circle-btn.dragging {

  cursor: grabbing;

  opacity: 0.9;

  transform:
    scale(1.05);

  transition: none;

  box-shadow:
    0 15px 35px
    rgba(212,175,55,0.6);

}


.circle-btn:active {

  cursor: grabbing;

}


/* ==================== XRP SYMBOL ==================== */

.xrp-mark {

  font-size: 18px;

  font-weight: 800;

  line-height: 1;

  color: #0A0C10;

}


.offer-btn {

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A,
      #C5A028
    );

}


.lang-code {

  font-size: 9px;

  font-weight: 700;

  margin-top: -2px;

  background: #D4AF37;

  color: #0A0C10;

  padding: 1px 4px;

  border-radius: 3px;

}


.notification-badge {

  position: absolute;

  top: -5px;

  right: -5px;

  background:
    linear-gradient(
      135deg,
      #ff3b30,
      #ff6b6b
    );

  color: white;

  font-size: 10px;

  font-weight: bold;

  min-width: 18px;

  height: 18px;

  border-radius: 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 0 4px;

  border:
    2px solid #0A0C10;

  box-shadow:
    0 2px 8px
    rgba(255,59,48,0.6);

  animation:
    pulse 2s infinite;

}


@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

}


.lang-btn {

  right: 10px;

  bottom: 95px;

}


.offer-btn {

  right: 60px;

  bottom: 95px;

}


.support-btn {

  right: 110px;

  bottom: 95px;

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A,
      #C5A028
    );

}


.support-btn i {

  color: #0A0C10;

}


.x-btn {

  right: 160px;

  bottom: 95px;

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A,
      #C5A028
    );

  color: #0A0C10;

  display: flex;

  align-items: center;

  justify-content: center;

}


.x-btn svg {

  width: 20px;

  height: 20px;

  fill: #0A0C10;

}


/* ==================== MENUS ==================== */

.support-menu,
.lang-menu {

  position: fixed;

  background:
    linear-gradient(
      135deg,
      #11151C,
      #1A1F2A
    );

  border-radius: 20px;

  box-shadow:
    0 10px 40px
      rgba(0,0,0,0.5),
    0 0 0 2px
      #D4AF37;

  z-index: 9998;

  overflow: hidden;

  min-width: 250px;

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
      translateY(20px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }

}


.support-menu {

  bottom: 145px;

  right: 60px;

}


.lang-menu {

  bottom: 145px;

  right: 10px;

}


.support-menu-header,
.lang-menu-header {

  padding: 18px;

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A
    );

  color: #0A0C10;

  font-weight: 700;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

}


.header-title {

  display: flex;

  align-items: center;

  gap: 10px;

}


.support-menu-header i,
.lang-menu-header i {

  font-size: 20px;

}


.close-btn {

  background:
    rgba(10,12,16,0.2);

  border: none;

  color: #0A0C10;

  width: 32px;

  height: 32px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  transition: all 0.2s;

}


.close-btn:hover {

  background:
    rgba(10,12,16,0.4);

  transform:
    rotate(90deg);

}


.support-menu-body,
.lang-menu-body {

  max-height: 300px;

  overflow-y: auto;

}


.support-item {

  padding: 16px 18px;

  display: flex;

  align-items: center;

  gap: 14px;

  cursor: pointer;

  transition: all 0.2s;

  border-bottom:
    1px solid
    rgba(212,175,55,0.1);

}


.support-item:last-child {

  border-bottom: none;

}


.support-item:hover {

  background:
    rgba(212,175,55,0.1);

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
    linear-gradient(
      135deg,
      #25D366,
      #128C7E
    );

  color: white;

}


.support-icon.telegram {

  background:
    linear-gradient(
      135deg,
      #0088cc,
      #0066aa
    );

  color: white;

}


.support-info {

  flex: 1;

  display: flex;

  flex-direction: column;

  gap: 3px;

}


.support-name {

  font-weight: 600;

  font-size: 15px;

}


.support-desc {

  font-size: 12px;

  color:
    rgba(255,255,255,0.6);

}


.support-arrow {

  color: #D4AF37;

  font-size: 12px;

}


.lang-item {

  padding: 14px 18px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  cursor: pointer;

  transition: all 0.2s;

  border-bottom:
    1px solid
    rgba(212,175,55,0.1);

}


.lang-item:last-child {

  border-bottom: none;

}


.lang-item:hover {

  background:
    rgba(212,175,55,0.1);

}


.lang-item.active {

  background:
    rgba(212,175,55,0.2);

  color: #D4AF37;

}


.lang-name {

  font-size: 14px;

}


.lang-badge {

  font-size: 11px;

  padding: 3px 10px;

  background:
    rgba(212,175,55,0.2);

  border-radius: 20px;

  color: #D4AF37;

  font-weight: 600;

}


/* ==================== MODALS ==================== */

.modal-overlay {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background:
    rgba(10,12,16,0.9);

  backdrop-filter: blur(8px);

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

  background:
    linear-gradient(
      135deg,
      #11151C,
      #1A1F2A
    );

  border-radius: 25px;

  max-width: 600px;

  width: 100%;

  max-height: 90vh;

  overflow: hidden;

  box-shadow:
    0 20px 60px
      rgba(0,0,0,0.6),
    0 0 0 2px
      #D4AF37;

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
      scale(0.95);

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

  max-width: 450px;

}


.blocked-header {

  background:
    linear-gradient(
      135deg,
      #ff3b30,
      #ff6b6b
    );

  padding: 30px 20px;

  text-align: center;

}


.blocked-icon {

  width: 70px;

  height: 70px;

  background:
    rgba(10,12,16,0.3);

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  margin:
    0 auto 15px;

  border:
    3px solid #ffffff;

}


.blocked-icon i {

  font-size: 32px;

  color: #ffffff;

}


.blocked-header h2 {

  color: #ffffff;

  font-size: 22px;

  font-weight: 800;

}


.blocked-body {

  padding: 25px;

}


.blocked-message {

  background:
    rgba(255,59,48,0.1);

  border:
    1px solid
    rgba(255,59,48,0.3);

  border-radius: 12px;

  padding: 15px;

  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 20px;

}


.blocked-message i {

  color: #ff6b6b;

  font-size: 20px;

}


.blocked-message p {

  color: #ff6b6b;

  font-size: 15px;

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
    rgba(212,175,55,0.05);

  border-radius: 10px;

  color:
    rgba(255,255,255,0.8);

  font-size: 14px;

}


.info-item i {

  color: #D4AF37;

  font-size: 18px;

}


.blocked-actions {

  margin-bottom: 10px;

}


.support-btn-action {

  width: 100%;

  padding: 14px;

  background:
    linear-gradient(
      135deg,
      #25D366,
      #128C7E
    );

  color: white;

  border: none;

  border-radius: 12px;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

}


.support-btn-action i {

  font-size: 20px;

}


.blocked-footer {

  padding: 20px;

  border-top:
    1px solid
    rgba(212,175,55,0.2);

}


/* ==================== XRP MODAL ==================== */

.offer-modal .modal-header {

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A,
      #C5A028
    );

  padding: 20px;

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.sender-info {

  display: flex;

  align-items: center;

  gap: 15px;

}


.sender-avatar {

  width: 50px;

  height: 50px;

  background: #0A0C10;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

  font-weight: 800;

  border:
    2px solid #D4AF37;

}


.sender-details {

  display: flex;

  flex-direction: column;

}


.sender-name {

  font-weight: 800;

  font-size: 18px;

  color: #0A0C10;

}


.sender-time {

  font-size: 12px;

  color:
    rgba(10,12,16,0.7);

}


.modal-close {

  background:
    rgba(10,12,16,0.2);

  border: none;

  color: #0A0C10;

  width: 36px;

  height: 36px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

}


.modal-body {

  padding: 25px;

  max-height: 60vh;

  overflow-y: auto;

}


.offer-content {

  display: flex;

  flex-direction: column;

  gap: 20px;

}


.offer-title {

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 20px;

  font-weight: 700;

  color: #D4AF37;

}


.xrp-title-symbol {

  width: 35px;

  height: 35px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A
    );

  color: #0A0C10;

  font-weight: 800;

}


.offer-text {

  line-height: 1.8;

  color:
    rgba(255,255,255,0.9);

}


.offer-text p {

  margin-bottom: 15px;

}


.highlight-box {

  background:
    rgba(212,175,55,0.1);

  border:
    1px solid #D4AF37;

  border-radius: 12px;

  padding: 15px;

  margin: 15px 0;

  display: flex;

  align-items: flex-start;

  gap: 10px;

}


.highlight-box i {

  color: #D4AF37;

  font-size: 18px;

}


.offer-text h4 {

  color: #D4AF37;

  margin:
    20px 0 15px;

  font-size: 18px;

}


.rewards-table {

  background: #1A1F2A;

  border-radius: 15px;

  overflow: hidden;

  margin: 15px 0;

  border:
    1px solid
    rgba(212,175,55,0.2);

}


.table-header {

  display: flex;

  background:
    linear-gradient(
      135deg,
      rgba(212,175,55,0.2),
      rgba(246,226,122,0.1)
    );

  padding: 12px 15px;

  font-weight: 700;

  color: #D4AF37;

  border-bottom:
    2px solid #D4AF37;

}


.col-members,
.col-salary {

  flex: 1;

  text-align: center;

}


.table-body {

  max-height: 300px;

  overflow-y: auto;

}


.table-row {

  display: flex;

  padding: 10px 15px;

  border-bottom:
    1px solid
    rgba(212,175,55,0.1);

}


.table-row:last-child {

  border-bottom: none;

}


.table-row .col-members,
.table-row .col-salary {

  flex: 1;

  text-align: center;

  color:
    rgba(255,255,255,0.9);

}


.table-row .col-salary {

  color: #D4AF37;

  font-weight: 600;

}


.offer-notes {

  display: flex;

  flex-direction: column;

  gap: 10px;

  margin: 15px 0;

}


.note-item {

  display: flex;

  align-items: center;

  gap: 10px;

  color:
    rgba(255,255,255,0.9);

}


.note-item i {

  color: #4CAF50;

}


.important-note {

  background:
    rgba(255,59,48,0.1);

  border:
    1px solid
    rgba(255,59,48,0.3);

  border-radius: 12px;

  padding: 15px;

  margin-top: 15px;

}


.important-note i {

  color: #ff3b30;

  margin-right: 5px;

}


.important-note strong {

  color: #ff6b6b;

}


.important-note p {

  margin-top: 8px;

  font-size: 13px;

}


.modal-footer {

  padding: 20px;

  border-top:
    1px solid
    rgba(212,175,55,0.2);

}


/* ==================== AD ==================== */

.ad-overlay .ad-container {

  max-width: 800px;

  max-height: 95vh;

}


.ad-header {

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A,
      #C5A028
    );

  padding: 20px;

  display: flex;

  justify-content: space-between;

  align-items: center;

}


.ad-title {

  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 22px;

  font-weight: 800;

  color: #0A0C10;

}


.header-xrp-symbol {

  width: 30px;

  height: 30px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: #0A0C10;

  color: #D4AF37;

  border-radius: 50%;

  font-size: 15px;

}


.ad-close {

  background:
    rgba(10,12,16,0.2);

  border: none;

  color: #0A0C10;

  width: 40px;

  height: 40px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

}


.ad-body {

  padding: 25px;

  max-height: 70vh;

  overflow-y: auto;

}


.company-message {

  background: #1A1F2A;

  border-radius: 16px;

  padding: 20px;

  margin-bottom: 20px;

  border:
    1px solid
    rgba(212,175,55,0.2);

}


.message-header {

  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 15px;

  color: #D4AF37;

}


.message-xrp-icon {

  width: 35px;

  height: 35px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A
    );

  color: #0A0C10;

  font-weight: 800;

}


.message-header h3 {

  font-size: 20px;

}


.message-content p {

  line-height: 2;

  color:
    rgba(255,255,255,0.9);

  white-space: pre-line;

  text-align: justify;

}


.partnerships {

  background:
    linear-gradient(
      135deg,
      rgba(212,175,55,0.1),
      rgba(246,226,122,0.05)
    );

  border:
    1px solid #D4AF37;

  border-radius: 12px;

  padding: 15px 20px;

  display: flex;

  align-items: center;

  gap: 10px;

  margin: 20px 0;

  color: #D4AF37;

  font-weight: 600;

}


.partnerships i {

  font-size: 24px;

}


.vip-section h3 {

  color: #D4AF37;

  text-align: center;

  margin-bottom: 20px;

  font-size: 22px;

}


.vip-grid {

  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(250px,1fr)
    );

  gap: 15px;

}


.vip-card {

  background: #1A1F2A;

  border-radius: 16px;

  overflow: hidden;

  border:
    1px solid
    rgba(212,175,55,0.2);

  transition: all 0.3s;

}


.vip-card:hover {

  transform:
    translateY(-5px);

  box-shadow:
    0 10px 25px
    rgba(212,175,55,0.2);

  border-color:
    #D4AF37;

}


.vip-header {

  padding: 15px;

  text-align: center;

  font-weight: 700;

  font-size: 18px;

}


.vip-bronze .vip-header {

  background:
    linear-gradient(
      135deg,
      #CD7F32,
      #B87333
    );

}


.vip-silver .vip-header {

  background:
    linear-gradient(
      135deg,
      #C0C0C0,
      #A8A8A8
    );

}


.vip-gold .vip-header {

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A
    );

  color: #0A0C10;

}


.vip-platinum .vip-header {

  background:
    linear-gradient(
      135deg,
      #E5E4E2,
      #B0C4DE
    );

  color: #0A0C10;

}


.vip-body {

  padding: 15px;

}


.vip-item {

  display: flex;

  justify-content: space-between;

  padding: 8px 0;

  border-bottom:
    1px solid
    rgba(212,175,55,0.1);

}


.vip-item:last-child {

  border-bottom: none;

}


.vip-label {

  color:
    rgba(255,255,255,0.7);

}


.vip-value {

  color: #D4AF37;

  font-weight: 600;

}


.commission-box {

  background:
    linear-gradient(
      135deg,
      #1A1F2A,
      #11151C
    );

  border-radius: 16px;

  padding: 20px;

  text-align: center;

  margin: 20px 0;

  border:
    1px solid
    rgba(212,175,55,0.2);

}


.commission-box h4 {

  color: #D4AF37;

  margin-bottom: 15px;

  font-size: 18px;

}


.commission-row {

  display: flex;

  justify-content: center;

  gap: 30px;

  flex-wrap: wrap;

}


.commission-row span {

  background:
    rgba(212,175,55,0.1);

  padding: 8px 15px;

  border-radius: 8px;

  color: #D4AF37;

  font-weight: 600;

}


.ad-footer {

  padding: 20px;

  border-top:
    1px solid
    rgba(212,175,55,0.2);

}


/* ==================== BUTTON ==================== */

.btn-primary {

  width: 100%;

  padding: 16px;

  background:
    linear-gradient(
      135deg,
      #D4AF37,
      #F6E27A,
      #C5A028
    );

  color: #0A0C10;

  border: none;

  border-radius: 50px;

  font-weight: 700;

  font-size: 16px;

  cursor: pointer;

  transition: all 0.3s;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  box-shadow:
    0 5px 20px
    rgba(212,175,55,0.3);

}


.btn-primary:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 10px 30px
    rgba(212,175,55,0.4);

}


/* ==================== BOTTOM NAV ==================== */

.bottom-nav {

  position: fixed;

  bottom: 0;

  left: 0;

  right: 0;

  height: 75px;

  background:
    linear-gradient(
      135deg,
      #11151C,
      #1A1F2A
    );

  display: flex;

  justify-content: space-around;

  align-items: center;

  border-top:
    2px solid #D4AF37;

  box-shadow:
    0 -5px 25px
    rgba(0,0,0,0.5);

  z-index: 9997;

  direction: rtl;

}


.nav-item {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  color:
    rgba(255,255,255,0.6);

  font-size: 12px;

  cursor: pointer;

  transition: all 0.3s;

  padding: 8px 15px;

  border-radius: 12px;

  flex: 1;

  height: 100%;

}


.nav-item i {

  font-size: 22px;

  margin-bottom: 5px;

  transition: all 0.3s;

}


.nav-item:hover {

  color: #D4AF37;

  background:
    rgba(212,175,55,0.1);

}


.nav-item.active {

  color: #D4AF37;

}


.nav-item.active i {

  transform:
    translateY(-3px);

  text-shadow:
    0 0 15px
    rgba(212,175,55,0.6);

}


/* ==================== TRANSITIONS ==================== */

.fade-enter-active,
.fade-leave-active {

  transition:
    all 0.3s
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
    translateY(-10px);

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

  width: 8px;

}


::-webkit-scrollbar-track {

  background: #1A1F2A;

}


::-webkit-scrollbar-thumb {

  background: #D4AF37;

  border-radius: 10px;

}


::-webkit-scrollbar-thumb:hover {

  background: #F6E27A;

}


/* ==================== TABLET ==================== */

@media (max-width: 768px) {

  .circle-btn {

    width: 40px;

    height: 40px;

    font-size: 16px;

  }


  .lang-btn {

    right: 8px;

    bottom: 90px;

  }


  .offer-btn {

    right: 55px;

    bottom: 90px;

  }


  .support-btn {

    right: 100px;

    bottom: 90px;

  }


  .x-btn {

    right: 145px;

    bottom: 90px;

  }


  .support-menu {

    right: 55px;

    bottom: 140px;

    min-width: 220px;

  }


  .lang-menu {

    right: 8px;

    bottom: 140px;

  }


  .bottom-nav {

    height: 70px;

  }


  .nav-item {

    font-size: 11px;

  }


  .nav-item i {

    font-size: 20px;

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

    gap: 10px;

  }

}


/* ==================== MOBILE ==================== */

@media (max-width: 480px) {

  .lang-btn {

    right: 5px;

    bottom: 85px;

  }


  .offer-btn {

    right: 48px;

    bottom: 85px;

  }


  .support-btn {

    right: 90px;

    bottom: 85px;

  }


  .x-btn {

    right: 132px;

    bottom: 85px;

  }


  .circle-btn {

    width: 38px;

    height: 38px;

  }


  .ad-title {

    font-size: 18px;

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

}
</style>
