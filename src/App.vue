<template>
  <div id="app" :class="{ 'rtl': currentLang === 'AR' }">
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

    <!-- زر العرض الخاص مع الإشعار -->
    <div 
      class="circle-btn offer-btn" 
      ref="offerBtn"
      @click="toggleOfferMessage" 
      @mousedown="startDrag" 
      @touchstart="startDrag"
    >
      <i class="fas fa-gift"></i>
      <div class="notification-badge" v-if="hasNewOffer">3</div>
    </div>

    <!-- زر الدعم الموحد -->
    <div 
      class="circle-btn support-btn" 
      ref="supportBtn"
      @click="toggleSupportMenu" 
      @mousedown="startDrag" 
      @touchstart="startDrag"
    >
      <i class="fas fa-headset"></i>
    </div>

    <!-- زر X (تويتر) -->
    <a 
      class="circle-btn x-btn"
      ref="xBtn"
      href="https://x.com/Nova_Demo"
      target="_blank"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>

    <!-- ==================== القوائم المنبثقة ==================== -->

    <!-- قائمة الدعم -->
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
              <span class="support-name">واتساب</span>
              <span class="support-desc">تواصل سريع</span>
            </div>
            <i class="fas fa-chevron-left support-arrow"></i>
          </div>
          <div class="support-item" @click="openTelegram">
            <div class="support-icon telegram">
              <i class="fab fa-telegram"></i>
            </div>
            <div class="support-info">
              <span class="support-name">تيليجرام</span>
              <span class="support-desc">مجموعة الدعم</span>
            </div>
            <i class="fas fa-chevron-left support-arrow"></i>
          </div>
          <div class="support-item" @click="openTelegramChannel">
            <div class="support-icon telegram">
              <i class="fab fa-telegram"></i>
            </div>
            <div class="support-info">
              <span class="support-name">قناتي على تليجرام</span>
              <span class="support-desc">Nova Demo 🌴</span>
            </div>
            <i class="fas fa-chevron-left support-arrow"></i>
          </div>
        </div>
      </div>
    </transition>

    <!-- قائمة اللغات -->
    <transition name="fade">
      <div v-if="showLangMenu" class="lang-menu" @click.stop>
        <div class="lang-menu-header">
          <i class="fas fa-language"></i>
          <span>{{ t('selectLanguage') }}</span>
        </div>
        <div class="lang-menu-body">
          <div 
            v-for="lang in languages" :key="lang.code"
            class="lang-item" 
            @click="setLanguage(lang)"
            :class="{ active: currentLang === lang.code }"
          >
            <span class="lang-name">{{ lang.name }}</span>
            <span class="lang-badge">{{ lang.code }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- ==================== النوافذ المنبثقة ==================== -->

    <!-- نافذة حظر المستخدم -->
    <transition name="modal">
      <div v-if="showBlockedModal" class="modal-overlay" @click.self="handleBlockedModalClose">
        <div class="modal-container blocked-modal" @click.stop>
          <div class="blocked-header">
            <div class="blocked-icon">
              <i class="fas fa-lock"></i>
            </div>
            <h2>تم حظر الحساب</h2>
          </div>
          <div class="blocked-body">
            <div class="blocked-message">
              <i class="fas fa-exclamation-triangle"></i>
              <p>تم حظر حسابك من قبل الإدارة</p>
            </div>
            <div class="blocked-info">
              <div class="info-item">
                <i class="fas fa-headset"></i>
                <span>يرجى التواصل مع الدعم لمراجعة حالة حسابك</span>
              </div>
            </div>
            <div class="blocked-actions">
              <button class="support-btn-action" @click="contactSupportFromBlocked">
                <i class="fab fa-whatsapp"></i>
                <span>التواصل مع الدعم</span>
              </button>
            </div>
          </div>
          <div class="blocked-footer">
            <button class="btn-primary" @click="handleBlockedModalClose">
              <i class="fas fa-sign-out-alt"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- نافذة العرض الخاص (الحالية) -->
    <transition name="modal">
      <div v-if="showOfferMessage" class="modal-overlay" @click="closeOfferMessage">
        <div class="modal-container offer-modal" @click.stop>
          <div class="modal-header">
            <div class="sender-info">
              <div class="sender-avatar">🎁</div>
              <div class="sender-details">
                <div class="sender-name">Nova Demo 🌴</div>
                <div class="sender-time">{{ t('specialOffer') }}</div>
              </div>
            </div>
            <button class="modal-close" @click.stop="closeOfferMessage">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="offer-content">
              <div class="offer-title">
                <i class="fas fa-rocket"></i>
                <span>{{ t('joinOurTeam') }}</span>
              </div>
              <div class="offer-text">
                <p>{{ t('offerDescription1') }}</p>
                <div class="highlight-box">
                  <i class="fas fa-info-circle"></i>
                  <strong>{{ t('rewardsSystem') }}</strong>
                </div>
                <p>{{ t('offerDescription2') }}</p>
                <h4>📊 {{ t('monthlyRewardsTable') }}:</h4>
                <div class="rewards-table">
                  <div class="table-header">
                    <div class="col-members">👥 {{ t('numberOfPeople') }}</div>
                    <div class="col-salary">💰 {{ t('salaryValue') }}</div>
                  </div>
                  <div class="table-body">
                    <div v-for="(reward, index) in rewardsList" :key="index" class="table-row">
                      <div class="col-members">{{ reward.members }}</div>
                      <div class="col-salary">${{ reward.salary }}</div>
                    </div>
                  </div>
                </div>
                <div class="offer-notes">
                  <div class="note-item">
                    <i class="fas fa-check-circle"></i>
                    <span>{{ t('monthlyRewards') }}</span>
                  </div>
                  <div class="note-item">
                    <i class="fas fa-check-circle"></i>
                    <span>{{ t('flexibleSystem') }}</span>
                  </div>
                  <div class="note-item">
                    <i class="fas fa-check-circle"></i>
                    <span>{{ t('growthOpportunities') }}</span>
                  </div>
                </div>
                <div class="important-note">
                  <i class="fas fa-exclamation-triangle"></i>
                  <strong>{{ t('importantNote') }}:</strong>
                  <p>{{ t('vip2Required') }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary" @click.stop="closeOfferMessage">
              <i class="fas fa-check-circle"></i>
              {{ t('understoodThanks') }} 🎯
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ==================== العرض الخاص الجديد (3 أيام) ==================== -->
    
    <!-- البانر المتحرك للعرض الخاص -->
    <transition name="slideBanner">
      <div v-if="showSpecialOfferBanner && isOfferActive" class="special-offer-banner" @click="openSpecialOfferModal">
        <div class="banner-content">
          <div class="banner-icon">🎁</div>
          <div class="banner-text">
            <span class="banner-title">عرض خاص 3 أيام</span>
            <span class="banner-subtitle">مكافأة 20%</span>
          </div>
          <div class="banner-timer">
            <i class="fas fa-clock"></i>
            <span>{{ remainingDays }} يوم</span>
          </div>
          <div class="banner-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </transition>

    <!-- نافذة العرض الخاص الجديد -->
    <transition name="modal">
      <div v-if="showSpecialOfferModal" class="modal-overlay" @click.self="closeSpecialOfferModal">
        <div class="modal-container special-offer-modal" @click.stop>
          <div class="special-offer-header">
            <div class="offer-glow"></div>
            <div class="header-content">
              <div class="offer-icon">🎁</div>
              <div class="offer-title-text">
                <h2>عرض خاص لمدة 3 أيام فقط</h2>
                <div class="offer-timer-badge">
                  <i class="fas fa-clock"></i>
                  <span>متبقي {{ remainingDays }} أيام</span>
                </div>
              </div>
              <button class="modal-close special-close" @click.stop="closeSpecialOfferModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="special-offer-body">
            <div class="offer-message">
              <p class="greeting">
                نقدم لكم عرضًا خاصًا تقديرًا لصبركم ودعمكم خلال التحديث الجديد. ❤️
              </p>
              <p class="info-text">
                نعرف أن فترة التحديث الأخيرة كانت تحتاج إلى بعض الصبر، ولذلك أردنا أن نقدم لكم فرصة إضافية للاستفادة خلال هذه الفترة.
              </p>
              <div class="offer-highlight">
                <div class="highlight-icon">🔥</div>
                <div class="highlight-text">
                  <strong>مكافأة الإحالة الخاصة:</strong>
                  <p>عند إضافة شخص جديد من خلال رابط الإحالة الخاص بك، وإذا قام هذا الشخص بإضافة/إيداع 100 دولار وفق شروط العرض، تحصل على نسبة ربح 20% حسب نظام المكافأة المعتمد.</p>
                </div>
              </div>
              <div class="reward-box">
                <div class="reward-amount">
                  <span class="reward-label">💰 100$</span>
                  <span class="reward-arrow">=</span>
                  <span class="reward-value">مكافأة إحالة 20%</span>
                </div>
              </div>
              <div class="timer-box">
                <i class="fas fa-hourglass-half"></i>
                <span>⏰ العرض متاح لمدة 3 أيام فقط وينتهي بعد انتهاء المدة.</span>
              </div>
              <div class="appreciation-text">
                <p>
                  هذا العرض مقدم كنوع من التقدير والتعويض للمستخدمين الذين صبروا معنا خلال التحديث الجديد، ونشكر كل شخص استمر معنا ودعم المنصة. 🌟
                </p>
                <p class="action-text">
                  استغل فترة العرض قبل انتهائها، وشارك رابط الإحالة الخاص بك مع الأشخاص المهتمين.
                </p>
              </div>
              <div class="terms-note">
                <i class="fas fa-info-circle"></i>
                <span>تطبق شروط وأحكام العرض، وتُحتسب المكافأة فقط عند تحقق شروط الإحالة المطلوبة.</span>
              </div>
            </div>
          </div>
          <div class="special-offer-footer">
            <button class="btn-primary special-offer-btn" @click="goToTeamPage">
              <i class="fas fa-gift"></i>
              استفد من العرض الآن
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- إعلان الشركة -->
    <transition name="modal">
      <div v-if="showAd" class="modal-overlay ad-overlay" @click.self="closeAd">
        <div class="modal-container ad-container" @click.stop>
          <div class="ad-header">
            <div class="ad-title">
              <i class="fas fa-crown"></i>
              <span>Nova Demo 🌴</span>
              <i class="fas fa-crown"></i>
            </div>
            <button class="ad-close" @click.stop="closeAd">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="ad-body">
            <div class="company-message">
              <div class="message-header">
                <i class="fas fa-building"></i>
                <h3>{{ t('aboutCompany') }}</h3>
              </div>
              <div class="message-content">
                <p>
                  مرحباً بكم في <strong>Nova Demo</strong> 🌟<br><br>
                  هذه نسخة تجريبية من واجهة منصة رقمية مخصصة لاختبار تجربة المستخدم والتصميم وإدارة الحسابات.<br><br>
                  جميع البيانات والأرقام والعوائد الظاهرة في هذه النسخة لأغراض المحاكاة فقط، ولا تمثل استثماراً أو وعداً بعائد مالي.<br><br>
                  تم تصميم الواجهة لتكون واضحة وسهلة الاستخدام، مع التركيز على الحساب، الأنشطة، العضويات، المجتمع، والسجل.<br><br>
                  في حال استخدام المشروع في منتج حقيقي، يجب عرض اسم الشركة القانوني وبيانات الترخيص والسياسات الفعلية بشكل دقيق وقابل للتحقق.
                </p>
              </div>
            </div>
            <div class="partnerships">
              <i class="fas fa-handshake"></i>
              <span>{{ t('globalPartnerships') }}</span>
            </div>
            <div class="vip-section">
              <h3>📊 {{ t('membershipPlans') }}</h3>
              <div class="vip-grid">
                <div v-for="vip in vipPlans" :key="vip.level" class="vip-card" :class="getVipClass(vip.level)">
                  <div class="vip-header">
                    <span class="vip-level">{{ vip.level }}</span>
                  </div>
                  <div class="vip-body">
                    <div class="vip-item">
                      <span class="vip-label">💰 {{ t('subscription') }}:</span>
                      <span class="vip-value">{{ vip.recharge }} USDT</span>
                    </div>
                    <div class="vip-item">
                      <span class="vip-label">📈 {{ t('dailyProfit') }}:</span>
                      <span class="vip-value">{{ vip.daily }} USDT</span>
                    </div>
                    <div class="vip-item">
                      <span class="vip-label">📊 {{ t('monthlyProfit') }}:</span>
                      <span class="vip-value">{{ vip.monthly }} USDT</span>
                    </div>
                    <div v-if="vip.percentage" class="vip-item">
                      <span class="vip-label">📊 {{ t('profitRate') }}:</span>
                      <span class="vip-value highlight">{{ vip.percentage }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="commission-box">
              <h4>🤝 {{ t('commissionSystem') }}</h4>
              <div class="commission-row">
                <span>{{ t('level1') }}: 6%</span>
                <span>{{ t('level2') }}: 2%</span>
                <span>{{ t('level3') }}: 1%</span>
              </div>
            </div>
          </div>
          <div class="ad-footer">
            <button class="btn-primary" @click.stop="closeAd">
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
    <div class="bottom-nav" v-if="authLoaded && showBottomNav">
      <div 
        v-for="item in navItems" 
        :key="item.path"
        class="nav-item" 
        @click.prevent="navigateTo(item.path)"
        :class="{ active: isActive(item.path) }"
      >
        <i :class="item.icon"></i>
        <span>{{ t(item.label) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase";
import { collection, doc, getDoc, updateDoc, increment } from "firebase/firestore";

export default {
  name: "App",

  data() {
    return {
      authLoaded: false,
      user: null,
      blockCheckInterval: null,
      vipProfitInterval: null,
      showLangMenu: false,
      showSupportMenu: false,
      showAd: false,
      showOfferMessage: false,
      hasNewOffer: true,
      showBlockedModal: false,
      currentLang: "AR",
      // متغيرات العرض الخاص الجديد
      showSpecialOfferBanner: false,
      showSpecialOfferModal: false,
      offerStartDate: null,
      offerDurationDays: 3,
      whatsappNumbers: {
        support: {
          number: "447348577110",
          message: "مرحباً، أحتاج مساعدة من الدعم الفني"
        }
      },
      telegramLink: "https://t.me/Nova_Demo",
      telegramChannelLink: "https://t.me/NovaDemo",
      vipPlans: [
        { level: 'VIP 1', recharge: '0', daily: '0.15', monthly: '4.5', percentage: null },
        { level: 'VIP 2', recharge: '10', daily: '0.35', monthly: '10.5', percentage: '105% شهرياً' },
        { level: 'VIP 3', recharge: '50', daily: '1.60', monthly: '48', percentage: '96% شهرياً' },
        { level: 'VIP 4', recharge: '100', daily: '3.25', monthly: '97.5', percentage: '97.5% شهرياً' },
        { level: 'VIP 5', recharge: '300', daily: '10', monthly: '300', percentage: '100% شهرياً' },
        { level: 'VIP 6', recharge: '900', daily: '33', monthly: '990', percentage: '110% شهرياً' },
        { level: 'VIP 7', recharge: '1350', daily: '51', monthly: '1530', percentage: '113% شهرياً' },
        { level: 'VIP 8', recharge: '1800', daily: '70', monthly: '2100', percentage: '116% شهرياً' },
        { level: 'VIP 9', recharge: '3600', daily: '150', monthly: '4500', percentage: '125% شهرياً' },
        { level: 'VIP 10', recharge: '7200', daily: '330', monthly: '9900', percentage: '137% شهرياً' },
        { level: 'VIP 11', recharge: '14400', daily: '700', monthly: '21000', percentage: '146% شهرياً' },
        { level: 'VIP 12', recharge: '18800', daily: '1600', monthly: '48000', percentage: '255% شهرياً' },
        { level: 'VIP 13', recharge: '37600', daily: '3500', monthly: '105000', percentage: '279% شهرياً' },
        { level: 'VIP 14', recharge: '75200', daily: '7500', monthly: '225000', percentage: '299% شهرياً' },
        { level: 'VIP 15', recharge: '150400', daily: '16000', monthly: '480000', percentage: '319% شهرياً' }
      ],
      rewardsList: [
        { members: 10, salary: 50 }, { members: 20, salary: 100 }, { members: 30, salary: 150 },
        { members: 40, salary: 200 }, { members: 50, salary: 250 }, { members: 60, salary: 300 },
        { members: 70, salary: 350 }, { members: 80, salary: 400 }, { members: 90, salary: 450 },
        { members: 100, salary: 500 }, { members: 120, salary: 550 }, { members: 140, salary: 600 },
        { members: 160, salary: 650 }, { members: 180, salary: 700 }, { members: 200, salary: 750 },
        { members: 220, salary: 800 }, { members: 240, salary: 850 }, { members: 260, salary: 900 },
        { members: 280, salary: 950 }, { members: 300, salary: 1000 }
      ],
      languages: [
        { name: "العربية", code: "AR" },
        { name: "English", code: "EN" },
        { name: "Français", code: "FR" },
        { name: "Español", code: "ES" },
        { name: "Deutsch", code: "DE" },
        { name: "Italiano", code: "IT" },
        { name: "Polski", code: "PL" },
        { name: "Русский", code: "RU" },
        { name: "Türkçe", code: "TR" },
        { name: "Português", code: "PT" },
        { name: "فارسی", code: "FA" },
        { name: "Tiếng Việt", code: "VI" },
        { name: "日本語", code: "JP" },
        { name: "한국어", code: "KR" }
      ],
      navItems: [
        { path: '/home', icon: 'fas fa-house', label: 'home' },
        { path: '/vip', icon: 'fas fa-layer-group', label: 'vip' },
        { path: '/tasks', icon: 'fas fa-list-check', label: 'tasks' },
        { path: '/team', icon: 'fas fa-people-group', label: 'team' },
        { path: '/profile', icon: 'fas fa-user', label: 'profile' }
      ],
      dragging: false,
      currentButton: null,
      startX: 0,
      startY: 0,
      initialLeft: 0,
      initialBottom: 0,
      clickThreshold: 5,
      hasDragged: false,
      translations: {
        AR: {
          supportCenter: 'مركز الدعم',
          selectLanguage: 'اختر اللغة',
          specialOffer: 'عرض خاص',
          joinOurTeam: 'انضم إلى فريقنا وابدأ ببناء نجاحك اليوم',
          offerDescription1: 'نحن نقدم لك فرصة حقيقية لتكون جزءاً من فريق طموح ومتطور. يمكنك الآن دعوة أعضاء جدد إلى فريقك عبر رابط الإحالة الخاص بك والعمل معهم لتحقيق النجاح المشترك.',
          rewardsSystem: 'نظام المكافآت: كلما توسع فريقك وزاد عدد الأعضاء فيه، زادت فرصك للحصول على مكافآت مالية مجزية.',
          offerDescription2: 'عند انضمامك إلينا، ستحصل على فرصة لتصبح مشرفاً على فريقك الخاص، حيث يمكنك إدارة فريقك وتنميته من خلال دعوة أعضاء جدد عبر رابط الإحالة الخاص بك.',
          monthlyRewardsTable: 'جدول المكافآت الشهرية',
          numberOfPeople: 'عدد الأشخاص',
          salaryValue: 'قيمة المكافآت',
          monthlyRewards: 'مكافآت شهرية مجزية',
          flexibleSystem: 'نظام عمل مرن',
          growthOpportunities: 'فرص نمو مستمرة',
          importantNote: 'ملاحظة مهمة',
          vip2Required: 'يجب على كل عضو ينضم إلى فريقك شراء مستوى VIP 3 حتى يتم احتسابه ضمن أعضاء فريقك في نظام المكافآت.',
          understoodThanks: 'فهمت وشكراً',
          aboutCompany: 'عن الشركة',
          globalPartnerships: 'شراكات عالمية مع Amazon, eBay, TikTok, Aliexpress, Alibaba, Shopee',
          membershipPlans: 'خطط العضوية والأرباح',
          subscription: 'الاشتراك',
          dailyProfit: 'عائد تجريبي',
          monthlyProfit: 'ملخص تجريبي',
          profitRate: 'مؤشر تجريبي',
          commissionSystem: 'نظام العمولات',
          level1: 'المستوى 1',
          level2: 'المستوى 2',
          level3: 'المستوى 3',
          iUnderstand: 'أنا أعرف',
          home: 'الرئيسية',
          vip: 'VIP',
          tasks: 'المهام',
          team: 'الفريق',
          profile: 'حسابي'
        },
        EN: {
          supportCenter: 'Support Center',
          selectLanguage: 'Select Language',
          specialOffer: 'Special Offer',
          joinOurTeam: 'Join Our Team and Start Building Your Success Today',
          offerDescription1: 'We offer you a real opportunity to be part of an ambitious and developed team. You can now invite new members to your team through your referral link.',
          rewardsSystem: 'Rewards System: The more your team expands and the more members join, the more chances you get for lucrative financial rewards.',
          offerDescription2: 'When you join us, you will have the opportunity to become a supervisor of your own team, where you can manage and grow your team.',
          monthlyRewardsTable: 'Monthly Rewards Table',
          numberOfPeople: 'Number of People',
          salaryValue: 'Salary Value',
          monthlyRewards: 'Lucrative Monthly Rewards',
          flexibleSystem: 'Flexible Work System',
          growthOpportunities: 'Continuous Growth Opportunities',
          importantNote: 'Important Note',
          vip2Required: 'Each member joining your team must purchase VIP 3 level to be counted in the rewards system.',
          understoodThanks: 'Understood, Thanks!',
          aboutCompany: 'About Company',
          globalPartnerships: 'Global Partnerships with Amazon, eBay, TikTok, Aliexpress, Alibaba, Shopee',
          membershipPlans: 'Membership Plans & Profits',
          subscription: 'Subscription',
          dailyProfit: 'Daily Profit',
          monthlyProfit: 'Monthly Profit',
          profitRate: 'Profit Rate',
          commissionSystem: 'Commission System',
          level1: 'Level 1',
          level2: 'Level 2',
          level3: 'Level 3',
          iUnderstand: 'I Understand',
          home: 'Home',
          vip: 'VIP',
          tasks: 'Tasks',
          team: 'Team',
          profile: 'Profile'
        }
      }
    };
  },

  computed: {
    showBottomNav() {
      if (!this.user) return false;
      const path = this.$route.path;
      const hiddenPaths = ["/login", "/register", "/admin", "/403"];
      return !hiddenPaths.some((p) => path.startsWith(p));
    },
    isOfferActive() {
      if (!this.offerStartDate) return false;
      const now = Date.now();
      const endDate = this.offerStartDate + (this.offerDurationDays * 24 * 60 * 60 * 1000);
      return now < endDate;
    },
    remainingDays() {
      if (!this.offerStartDate) return this.offerDurationDays;
      const now = Date.now();
      const endDate = this.offerStartDate + (this.offerDurationDays * 24 * 60 * 60 * 1000);
      const diff = endDate - now;
      if (diff <= 0) return 0;
      const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
      return days > 0 ? days : 0;
    }
  },

  created() {
    const auth = getAuth();
    const savedLang = localStorage.getItem("app_language");
    if (savedLang) this.currentLang = savedLang;
    
    // تهيئة تاريخ بدء العرض
    this.initOfferDates();
    
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      this.authLoaded = true;
      if (user) {
        this.startBlockCheck(user.uid);
        // Demo mode: automatic financial rewards are disabled.
        this.stopVipProfitInterval();
        setTimeout(() => { this.showAd = true; }, 1000);
        // إظهار العرض الخاص للمستخدمين المسجلين بعد 1.5 ثانية مع حركة انزلاق
        setTimeout(() => {
          if (this.isOfferActive) {
            this.showSpecialOfferBanner = true;
          }
        }, 1500);
      } else {
        this.stopBlockCheck();
        this.stopVipProfitInterval();
        this.showSpecialOfferBanner = false;
        this.showSpecialOfferModal = false;
      }
    });
    this.loadButtonPositions();
  },

  mounted() {
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('touchmove', this.onDrag, { passive: false });
    document.addEventListener('touchend', this.stopDrag);
    document.addEventListener('touchcancel', this.stopDrag);
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.stopDrag);
    document.removeEventListener('touchcancel', this.stopDrag);
    document.removeEventListener('click', this.handleClickOutside);
    this.stopBlockCheck();
    this.stopVipProfitInterval();
  },

  methods: {
    // تهيئة تواريخ العرض
    initOfferDates() {
      const savedStartDate = localStorage.getItem('specialOfferStartDate');
      if (savedStartDate) {
        this.offerStartDate = parseInt(savedStartDate);
        // التحقق من انتهاء العرض
        const now = Date.now();
        const endDate = this.offerStartDate + (this.offerDurationDays * 24 * 60 * 60 * 1000);
        if (now >= endDate) {
          localStorage.removeItem('specialOfferStartDate');
          this.offerStartDate = null;
        }
      } else {
        // بدء عرض جديد
        this.offerStartDate = Date.now();
        localStorage.setItem('specialOfferStartDate', String(this.offerStartDate));
      }
    },

    // فتح نافذة العرض الخاص
    openSpecialOfferModal() {
      if (this.isOfferActive) {
        this.showSpecialOfferModal = true;
      }
    },

    // إغلاق نافذة العرض الخاص
    closeSpecialOfferModal() {
      this.showSpecialOfferModal = false;
    },

    // الانتقال إلى صفحة الفريق
    goToTeamPage() {
      this.showSpecialOfferModal = false;
      this.$router.push('/team');
    },

    // ✅ تم استبدال onSnapshot بـ getDoc مع فحص دوري لتقليل القراءات
    startBlockCheck(userId) {
      this.stopBlockCheck();
      // فحص الحظر عند بدء التشغيل
      this.checkBlockStatus(userId);
      // فحص دوري كل 30 ثانية بدلاً من الاستماع المستمر
      this.blockCheckInterval = setInterval(() => {
        this.checkBlockStatus(userId);
      }, 30000);
    },
    
    stopBlockCheck() {
      if (this.blockCheckInterval) {
        clearInterval(this.blockCheckInterval);
        this.blockCheckInterval = null;
      }
    },
    
    async checkBlockStatus(userId) {
      try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().blocked === true) {
          const auth = getAuth();
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.uid === userId) {
            this.showBlockedModal = true;
            this.stopBlockCheck();
          }
        }
      } catch (error) {
        console.error("خطأ في فحص حالة الحظر:", error);
      }
    },
    
    handleBlockedModalClose() { 
      this.showBlockedModal = false; 
      this.logoutAndRedirect(); 
    },
    
    async logoutAndRedirect() { 
      const auth = getAuth(); 
      try { 
        await signOut(auth); 
      } catch(e) { 
        console.error(e); 
      } 
      this.$router.push("/login"); 
    },
    
    contactSupportFromBlocked() {
      const dept = this.whatsappNumbers.support;
      if (dept) { 
        window.open(`https://wa.me/${dept.number}?text=${encodeURIComponent("مرحباً، حسابي محظور وأحتاج مساعدة")}`, '_blank'); 
      }
    },
    
    startVipProfitInterval(userId) { 
      this.stopVipProfitInterval(); 
      this.vipProfitInterval = setInterval(() => { 
        if (this.user && this.user.uid === userId) this.settleAndReward(userId); 
      }, 60000); 
    },
    
    stopVipProfitInterval() { 
      if (this.vipProfitInterval) { 
        clearInterval(this.vipProfitInterval); 
        this.vipProfitInterval = null; 
      } 
    },
    
    async settleAndReward(userId) {
      // Demo mode intentionally does not credit balances automatically.
      return;
    },

    async logVipProfit(userId, amount, vipLevel) {
      try { 
        const { addDoc } = await import("firebase/firestore"); 
        await addDoc(collection(db, "users", userId, "vip_profits"), { 
          amount, 
          vipLevel, 
          timestamp: Date.now(), 
          type: "daily_profit" 
        }); 
      } catch(e) { 
        console.error(e); 
      }
    },
    
    t(key) { 
      return this.translations[this.currentLang]?.[key] || this.translations['AR'][key] || key; 
    },
    
    toggleLanguageMenu() { 
      if (this.hasDragged) { 
        this.hasDragged = false; 
        return; 
      } 
      this.showLangMenu = !this.showLangMenu; 
      if (this.showLangMenu) this.showSupportMenu = false; 
    },
    
    toggleSupportMenu() { 
      if (this.hasDragged) { 
        this.hasDragged = false; 
        return; 
      } 
      this.showSupportMenu = !this.showSupportMenu; 
      if (this.showSupportMenu) this.showLangMenu = false; 
    },
    
    closeSupportMenu() { 
      this.showSupportMenu = false; 
    },
    
    openWhatsApp() { 
      const dept = this.whatsappNumbers.support; 
      if (dept) { 
        window.open(`https://wa.me/${dept.number}?text=${encodeURIComponent(dept.message)}`, '_blank'); 
      } 
      this.showSupportMenu = false; 
    },
    
    openTelegram() { 
      if (this.telegramLink) { 
        window.open(this.telegramLink, '_blank'); 
      } 
      this.showSupportMenu = false; 
    },
    
    openTelegramChannel() { 
      if (this.telegramChannelLink) { 
        window.open(this.telegramChannelLink, '_blank'); 
      } 
      this.showSupportMenu = false; 
    },
    
    setLanguage(lang) { 
      this.currentLang = lang.code; 
      localStorage.setItem("app_language", lang.code); 
      this.showLangMenu = false; 
      document.documentElement.dir = lang.code === 'AR' ? 'rtl' : 'ltr'; 
      document.documentElement.lang = lang.code.toLowerCase(); 
    },
    
    toggleOfferMessage() { 
      if (this.hasDragged) { 
        this.hasDragged = false; 
        return; 
      } 
      this.showOfferMessage = !this.showOfferMessage; 
      if (this.showOfferMessage) this.hasNewOffer = false; 
    },
    
    closeOfferMessage() { 
      this.showOfferMessage = false; 
    },
    
    closeAd() { 
      this.showAd = false; 
    },
    
    navigateTo(path) { 
      if (this.$route.path !== path) this.$router.push(path); 
    },
    
    isActive(path) { 
      return this.$route.path === path; 
    },
    
    getVipClass(level) { 
      if (level.includes('VIP 1')) return 'vip-bronze'; 
      if (level.includes('VIP 2') || level.includes('VIP 3')) return 'vip-silver'; 
      if (level.includes('VIP 4') || level.includes('VIP 5')) return 'vip-gold'; 
      if (level.includes('VIP 6') || level.includes('VIP 7') || level.includes('VIP 8') || level.includes('VIP 9')) return 'vip-platinum'; 
      return 'vip-elite'; 
    },
    
    startDrag(event) {
      this.hasDragged = false;
      const button = event.currentTarget;
      this.currentButton = button;
      this.dragging = true;
      if (event.type === 'mousedown') { 
        this.startX = event.clientX; 
        this.startY = event.clientY; 
      }
      else if (event.type === 'touchstart') { 
        this.startX = event.touches[0].clientX; 
        this.startY = event.touches[0].clientY; 
      }
      const computedStyle = window.getComputedStyle(button);
      this.initialLeft = parseFloat(computedStyle.right) || 15;
      this.initialBottom = parseFloat(computedStyle.bottom) || 100;
      button.classList.add('dragging');
    },
    
    onDrag(event) {
      if (!this.dragging || !this.currentButton) return;
      event.preventDefault();
      let currentX, currentY;
      if (event.type === 'mousemove') { 
        currentX = event.clientX; 
        currentY = event.clientY; 
      }
      else if (event.type === 'touchmove') { 
        currentX = event.touches[0].clientX; 
        currentY = event.touches[0].clientY; 
      }
      else return;
      const deltaX = Math.abs(currentX - this.startX);
      const deltaY = Math.abs(currentY - this.startY);
      if (deltaX > this.clickThreshold || deltaY > this.clickThreshold) this.hasDragged = true;
      const newRight = Math.max(5, Math.min(window.innerWidth - 50, this.initialLeft - (currentX - this.startX)));
      const newBottom = Math.max(10, Math.min(window.innerHeight - 150, this.initialBottom - (currentY - this.startY)));
      this.currentButton.style.right = newRight + 'px';
      this.currentButton.style.bottom = newBottom + 'px';
    },
    
    stopDrag() {
      if (this.dragging && this.currentButton) { 
        this.saveButtonPosition(this.currentButton); 
        this.currentButton.classList.remove('dragging'); 
      }
      this.dragging = false; 
      this.currentButton = null;
    },
    
    saveButtonPosition(button) {
      const className = button.className.split(' ').find(cls => cls.includes('-btn'));
      if (!className) return;
      const right = button.style.right, bottom = button.style.bottom;
      if (right && bottom) { 
        const positions = JSON.parse(localStorage.getItem('buttonPositions') || '{}'); 
        positions[className] = { right, bottom }; 
        localStorage.setItem('buttonPositions', JSON.stringify(positions)); 
      }
    },
    
    loadButtonPositions() {
      this.$nextTick(() => {
        const positions = JSON.parse(localStorage.getItem('buttonPositions') || '{}');
        setTimeout(() => { 
          document.querySelectorAll('.circle-btn').forEach(btn => { 
            const className = btn.className.split(' ').find(cls => cls.includes('-btn')); 
            if (className && positions[className]) { 
              btn.style.right = positions[className].right; 
              btn.style.bottom = positions[className].bottom; 
            } 
          }); 
        }, 100);
      });
    },
    
    handleClickOutside(event) {
      if (!event.target.closest('.lang-menu') && !event.target.closest('.lang-btn')) this.showLangMenu = false;
      if (!event.target.closest('.support-menu') && !event.target.closest('.support-btn')) this.showSupportMenu = false;
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* { margin: 0; padding: 0; box-sizing: border-box; }

body { font-family: 'Cairo', sans-serif; background: linear-gradient(135deg, #0A0C10 0%, #1A1F2A 100%); color: #ffffff; overflow-x: hidden; min-height: 100vh; }

#app { min-height: 100vh; position: relative; }
#app.rtl { direction: rtl; }

.page-container { width: 100%; max-width: 100%; margin: 0 auto; position: relative; z-index: 1; min-height: 100vh; padding-bottom: 80px; }

.circle-btn {
  position: fixed;
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #11151C, #1A1F2A);
  border: 2px solid #D4AF37;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #D4AF37;
  font-size: 18px;
  cursor: grab;
  z-index: 9999;
  box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  user-select: none;
  touch-action: none;
  pointer-events: auto;
}

.circle-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0A0C10;
}

.circle-btn.dragging { cursor: grabbing; opacity: 0.9; transform: scale(1.05); transition: none; box-shadow: 0 15px 35px rgba(212, 175, 55, 0.6); }
.circle-btn:active { cursor: grabbing; }

.lang-code { font-size: 9px; font-weight: 700; margin-top: -2px; background: #D4AF37; color: #0A0C10; padding: 1px 4px; border-radius: 3px; }

.notification-badge {
  position: absolute; top: -5px; right: -5px; background: linear-gradient(135deg, #ff3b30, #ff6b6b); color: white; font-size: 10px; font-weight: bold;
  min-width: 18px; height: 18px; border-radius: 18px; display: flex; align-items: center; justify-content: center; padding: 0 4px;
  border: 2px solid #0A0C10; box-shadow: 0 2px 8px rgba(255, 59, 48, 0.6); animation: pulse 2s infinite;
}
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }

.lang-btn { right: 10px; bottom: 95px; }
.offer-btn { right: 60px; bottom: 95px; background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028); }
.offer-btn i { color: #0A0C10; }
.support-btn { right: 110px; bottom: 95px; background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028); }
.support-btn i { color: #0A0C10; font-size: 18px; }
.x-btn { right: 160px; bottom: 95px; background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028); color: #0A0C10; display: flex; align-items: center; justify-content: center; }
.x-btn svg { width: 20px; height: 20px; fill: #0A0C10; }

.support-menu, .lang-menu {
  position: fixed; background: linear-gradient(135deg, #11151C, #1A1F2A); border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 2px #D4AF37; z-index: 9998; overflow: hidden; min-width: 250px;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.support-menu { bottom: 145px; right: 60px; }
.lang-menu { bottom: 145px; right: 10px; }
.support-menu-header, .lang-menu-header { padding: 18px; background: linear-gradient(135deg, #D4AF37, #F6E27A); color: #0A0C10; font-weight: 700; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.support-menu-header i, .lang-menu-header i { font-size: 20px; }
.close-btn { background: rgba(10, 12, 16, 0.2); border: none; color: #0A0C10; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.close-btn:hover { background: rgba(10, 12, 16, 0.4); transform: rotate(90deg); }
.support-menu-body, .lang-menu-body { max-height: 300px; overflow-y: auto; }
.support-item { padding: 16px 18px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.2s; border-bottom: 1px solid rgba(212, 175, 55, 0.1); }
.support-item:last-child { border-bottom: none; }
.support-item:hover { background: rgba(212, 175, 55, 0.1); }
.support-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.support-icon.whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); color: white; }
.support-icon.telegram { background: linear-gradient(135deg, #0088cc, #0066aa); color: white; }
.support-info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.support-name { font-weight: 600; font-size: 15px; }
.support-desc { font-size: 12px; color: rgba(255, 255, 255, 0.6); }
.support-arrow { color: #D4AF37; font-size: 12px; }
.lang-item { padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s; border-bottom: 1px solid rgba(212, 175, 55, 0.1); }
.lang-item:last-child { border-bottom: none; }
.lang-item:hover { background: rgba(212, 175, 55, 0.1); }
.lang-item.active { background: rgba(212, 175, 55, 0.2); color: #D4AF37; }
.lang-name { font-size: 14px; }
.lang-badge { font-size: 11px; padding: 3px 10px; background: rgba(212, 175, 55, 0.2); border-radius: 20px; color: #D4AF37; font-weight: 600; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10, 12, 16, 0.9); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 10000; padding: 20px; animation: fadeIn 0.3s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-container { background: linear-gradient(135deg, #11151C, #1A1F2A); border-radius: 25px; max-width: 600px; width: 100%; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 2px #D4AF37; animation: modalSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
@keyframes modalSlide { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

.blocked-modal { max-width: 450px; }
.blocked-header { background: linear-gradient(135deg, #ff3b30, #ff6b6b); padding: 30px 20px; text-align: center; }
.blocked-icon { width: 70px; height: 70px; background: rgba(10, 12, 16, 0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; border: 3px solid #ffffff; }
.blocked-icon i { font-size: 32px; color: #ffffff; }
.blocked-header h2 { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; }
.blocked-body { padding: 25px; }
.blocked-message { background: rgba(255, 59, 48, 0.1); border: 1px solid rgba(255, 59, 48, 0.3); border-radius: 12px; padding: 15px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.blocked-message i { color: #ff6b6b; font-size: 20px; }
.blocked-message p { color: #ff6b6b; font-size: 15px; font-weight: 600; margin: 0; }
.blocked-info { margin-bottom: 20px; }
.info-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; background: rgba(212, 175, 55, 0.05); border-radius: 10px; color: rgba(255, 255, 255, 0.8); font-size: 14px; }
.info-item i { color: #D4AF37; font-size: 18px; }
.blocked-actions { margin-bottom: 10px; }
.support-btn-action { width: 100%; padding: 14px; background: linear-gradient(135deg, #25D366, #128C7E); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; }
.support-btn-action:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4); }
.support-btn-action i { font-size: 20px; }
.blocked-footer { padding: 20px; border-top: 1px solid rgba(212, 175, 55, 0.2); }

.offer-modal .modal-header { background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028); padding: 20px; display: flex; justify-content: space-between; align-items: center; }
.sender-info { display: flex; align-items: center; gap: 15px; }
.sender-avatar { width: 50px; height: 50px; background: #0A0C10; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; border: 2px solid #D4AF37; }
.sender-details { display: flex; flex-direction: column; }
.sender-name { font-weight: 800; font-size: 18px; color: #0A0C10; }
.sender-time { font-size: 12px; color: rgba(10, 12, 16, 0.7); }
.modal-close { background: rgba(10, 12, 16, 0.2); border: none; color: #0A0C10; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.modal-close:hover { background: rgba(10, 12, 16, 0.4); transform: rotate(90deg); }
.modal-body { padding: 25px; max-height: 60vh; overflow-y: auto; }
.offer-content { display: flex; flex-direction: column; gap: 20px; }
.offer-title { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; color: #D4AF37; }
.offer-text { line-height: 1.8; color: rgba(255, 255, 255, 0.9); }
.offer-text p { margin-bottom: 15px; }
.highlight-box { background: rgba(212, 175, 55, 0.1); border: 1px solid #D4AF37; border-radius: 12px; padding: 15px; margin: 15px 0; display: flex; align-items: flex-start; gap: 10px; }
.highlight-box i { color: #D4AF37; font-size: 18px; margin-top: 2px; }
.offer-text h4 { color: #D4AF37; margin: 20px 0 15px; font-size: 18px; }
.rewards-table { background: #1A1F2A; border-radius: 15px; overflow: hidden; margin: 15px 0; border: 1px solid rgba(212, 175, 55, 0.2); }
.table-header { display: flex; background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(246, 226, 122, 0.1)); padding: 12px 15px; font-weight: 700; color: #D4AF37; border-bottom: 2px solid #D4AF37; }
.col-members, .col-salary { flex: 1; text-align: center; }
.table-body { max-height: 300px; overflow-y: auto; }
.table-row { display: flex; padding: 10px 15px; border-bottom: 1px solid rgba(212, 175, 55, 0.1); transition: background 0.2s; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: rgba(212, 175, 55, 0.05); }
.table-row .col-members, .table-row .col-salary { flex: 1; text-align: center; color: rgba(255, 255, 255, 0.9); }
.table-row .col-salary { color: #D4AF37; font-weight: 600; }
.offer-notes { display: flex; flex-direction: column; gap: 10px; margin: 15px 0; }
.note-item { display: flex; align-items: center; gap: 10px; color: rgba(255, 255, 255, 0.9); }
.note-item i { color: #4CAF50; }
.important-note { background: rgba(255, 59, 48, 0.1); border: 1px solid rgba(255, 59, 48, 0.3); border-radius: 12px; padding: 15px; margin-top: 15px; }
.important-note i { color: #ff3b30; margin-right: 5px; }
.important-note strong { color: #ff6b6b; }
.important-note p { margin-top: 8px; margin-left: 25px; font-size: 13px; }
.modal-footer { padding: 20px; border-top: 1px solid rgba(212, 175, 55, 0.2); }

.ad-overlay .ad-container { max-width: 800px; max-height: 95vh; }
.ad-header { background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028); padding: 20px; display: flex; justify-content: space-between; align-items: center; }
.ad-title { display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 800; color: #0A0C10; }
.ad-title i { font-size: 24px; }
.ad-close { background: rgba(10, 12, 16, 0.2); border: none; color: #0A0C10; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.ad-close:hover { background: rgba(10, 12, 16, 0.4); transform: rotate(90deg); }
.ad-body { padding: 25px; max-height: 70vh; overflow-y: auto; }
.company-message { background: #1A1F2A; border-radius: 16px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(212, 175, 55, 0.2); }
.message-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; color: #D4AF37; }
.message-header i { font-size: 24px; }
.message-header h3 { font-size: 20px; }
.message-content p { line-height: 2; color: rgba(255, 255, 255, 0.9); text-align: justify; }
.partnerships { background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(246, 226, 122, 0.05)); border: 1px solid #D4AF37; border-radius: 12px; padding: 15px 20px; display: flex; align-items: center; gap: 10px; margin: 20px 0; color: #D4AF37; font-weight: 600; }
.partnerships i { font-size: 24px; }
.vip-section h3 { color: #D4AF37; text-align: center; margin-bottom: 20px; font-size: 22px; }
.vip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
.vip-card { background: #1A1F2A; border-radius: 16px; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.2); transition: all 0.3s; }
.vip-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.2); border-color: #D4AF37; }
.vip-header { padding: 15px; text-align: center; font-weight: 700; font-size: 18px; }
.vip-bronze .vip-header { background: linear-gradient(135deg, #CD7F32, #B87333); }
.vip-silver .vip-header { background: linear-gradient(135deg, #C0C0C0, #A8A8A8); }
.vip-gold .vip-header { background: linear-gradient(135deg, #D4AF37, #F6E27A); color: #0A0C10; }
.vip-platinum .vip-header { background: linear-gradient(135deg, #E5E4E2, #B0C4DE); color: #0A0C10; }
.vip-elite .vip-header { background: linear-gradient(135deg, #8A2BE2, #4B0082); }
.vip-body { padding: 15px; }
.vip-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(212, 175, 55, 0.1); }
.vip-item:last-child { border-bottom: none; }
.vip-label { color: rgba(255, 255, 255, 0.7); }
.vip-value { color: #D4AF37; font-weight: 600; }
.vip-value.highlight { color: #F6E27A; font-size: 16px; }
.commission-box { background: linear-gradient(135deg, #1A1F2A, #11151C); border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid rgba(212, 175, 55, 0.2); }
.commission-box h4 { color: #D4AF37; margin-bottom: 15px; font-size: 18px; }
.commission-row { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.commission-row span { background: rgba(212, 175, 55, 0.1); padding: 8px 15px; border-radius: 8px; color: #D4AF37; font-weight: 600; }
.ad-footer { padding: 20px; border-top: 1px solid rgba(212, 175, 55, 0.2); }

.btn-primary { width: 100%; padding: 16px; background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028); color: #0A0C10; border: none; border-radius: 50px; font-weight: 700; font-size: 16px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4); }

.bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: 75px; background: linear-gradient(135deg, #11151C, #1A1F2A); display: flex; justify-content: space-around; align-items: center; border-top: 2px solid #D4AF37; box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.5); z-index: 9997; direction: rtl; }
.nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.6); font-size: 12px; cursor: pointer; transition: all 0.3s; padding: 8px 15px; border-radius: 12px; flex: 1; height: 100%; }
.nav-item i { font-size: 22px; margin-bottom: 5px; transition: all 0.3s; }
.nav-item:hover { color: #D4AF37; background: rgba(212, 175, 55, 0.1); }
.nav-item.active { color: #D4AF37; }
.nav-item.active i { transform: translateY(-3px); text-shadow: 0 0 15px rgba(212, 175, 55, 0.6); }

.fade-enter-active, .fade-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* ==================== أنماط البانر المتحرك ==================== */

/* حركة انزلاق البانر من الأعلى */
.slideBanner-enter-active {
  animation: slideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.slideBanner-leave-active {
  animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-100px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes slideUp {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-100px) scale(0.8);
  }
}

/* البانر المصغر */
.special-offer-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1A1F2A, #2A2F3A);
  border: 2px solid #D4AF37;
  border-radius: 14px;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 9998;
  box-shadow: 0 0 25px rgba(212, 175, 55, 0.25), 0 0 50px rgba(212, 175, 55, 0.1);
  animation: bannerGlow 2s ease-in-out infinite alternate;
  max-width: 85%;
  transition: all 0.3s ease;
}

.special-offer-banner:hover {
  transform: translateX(-50%) scale(1.03);
  box-shadow: 0 0 35px rgba(212, 175, 55, 0.4), 0 0 70px rgba(212, 175, 55, 0.15);
}

@keyframes bannerGlow {
  0% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.15), 0 0 30px rgba(212, 175, 55, 0.05); }
  100% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.15); }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: center;
}

.banner-icon {
  font-size: 20px;
  animation: iconBounce 2s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(-5deg); }
}

.banner-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  flex-shrink: 0;
}

.banner-title {
  font-weight: 700;
  color: #D4AF37;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.banner-subtitle {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.banner-timer {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(212, 175, 55, 0.12);
  padding: 2px 10px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  flex-shrink: 0;
}

.banner-timer i {
  color: #D4AF37;
  font-size: 10px;
}

.banner-timer span {
  font-size: 10px;
  font-weight: 600;
  color: #D4AF37;
}

.banner-arrow {
  color: #D4AF37;
  font-size: 12px;
  opacity: 0.6;
  flex-shrink: 0;
}

/* ==================== أنماط نافذة العرض الخاص ==================== */

.special-offer-modal {
  max-width: 580px;
  position: relative;
  overflow: hidden;
}

.special-offer-header {
  background: linear-gradient(135deg, #1A1F2A, #2A2F3A);
  padding: 25px 20px 20px;
  position: relative;
  border-bottom: 2px solid #D4AF37;
  overflow: hidden;
}

.offer-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  position: relative;
  z-index: 1;
}

.offer-icon {
  font-size: 48px;
  animation: iconFloat 3s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.offer-title-text {
  flex: 1;
}

.offer-title-text h2 {
  font-size: 20px;
  font-weight: 800;
  color: #D4AF37;
  margin: 0 0 8px 0;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.offer-timer-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212, 175, 55, 0.15);
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  font-size: 13px;
  color: #D4AF37;
  font-weight: 600;
}

.offer-timer-badge i {
  font-size: 14px;
}

.special-close {
  background: rgba(255, 255, 255, 0.1);
  color: #D4AF37;
  flex-shrink: 0;
}

.special-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.special-offer-body {
  padding: 25px;
  max-height: 55vh;
  overflow-y: auto;
}

.offer-message {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.offer-message .greeting {
  font-size: 16px;
  font-weight: 600;
  color: #D4AF37;
  text-align: center;
  margin: 0;
}

.offer-message .info-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin: 0;
  text-align: center;
}

.offer-highlight {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(246, 226, 122, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
}

.highlight-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.highlight-text strong {
  display: block;
  color: #D4AF37;
  font-size: 15px;
  margin-bottom: 4px;
}

.highlight-text p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
}

.reward-box {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(246, 226, 122, 0.1));
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 1px solid #D4AF37;
}

.reward-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.reward-label {
  font-size: 20px;
  font-weight: 700;
  color: #D4AF37;
}

.reward-arrow {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.5);
}

.reward-value {
  font-size: 20px;
  font-weight: 800;
  color: #F6E27A;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.timer-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(212, 175, 55, 0.05);
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.timer-box i {
  color: #D4AF37;
  font-size: 18px;
}

.timer-box span {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.appreciation-text {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 12px 16px;
}

.appreciation-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
}

.appreciation-text .action-text {
  color: #D4AF37;
  font-weight: 600;
  margin-bottom: 0;
}

.terms-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(255, 59, 48, 0.05);
  border: 1px solid rgba(255, 59, 48, 0.15);
  border-radius: 10px;
  padding: 12px 16px;
}

.terms-note i {
  color: #ff6b6b;
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.terms-note span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.special-offer-footer {
  padding: 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.special-offer-btn {
  background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028);
  color: #0A0C10;
  font-size: 17px;
}

.special-offer-btn i {
  font-size: 20px;
}

@media (max-width: 768px) {
  .circle-btn { width: 40px; height: 40px; font-size: 16px; }
  .lang-btn { right: 8px; bottom: 90px; }
  .offer-btn { right: 55px; bottom: 90px; }
  .support-btn { right: 100px; bottom: 90px; }
  .x-btn { right: 145px; bottom: 90px; }
  .support-menu { right: 55px; bottom: 140px; min-width: 220px; }
  .lang-menu { right: 8px; bottom: 140px; }
  .bottom-nav { height: 70px; }
  .nav-item { font-size: 11px; }
  .nav-item i { font-size: 20px; }
  .modal-container { margin: 10px; max-height: 95vh; }
  .vip-grid { grid-template-columns: 1fr; }
  .commission-row { flex-direction: column; gap: 10px; }

  /* البانر المصغر للهواتف */
  .special-offer-banner {
    top: 12px;
    padding: 6px 12px;
    max-width: 92%;
    border-radius: 12px;
  }
  .banner-title { font-size: 11px; }
  .banner-subtitle { font-size: 9px; }
  .banner-icon { font-size: 17px; }
  .banner-timer span { font-size: 9px; }
  .banner-timer { padding: 2px 8px; }
  .banner-timer i { font-size: 9px; }
  .banner-arrow { font-size: 10px; }
  .banner-content { gap: 6px; }
  
  .special-offer-modal { max-width: 95%; }
  .offer-title-text h2 { font-size: 17px; }
  .offer-icon { font-size: 38px; }
  .reward-label, .reward-value { font-size: 17px; }
  .special-offer-body { padding: 18px; }
}

@media (max-width: 480px) {
  .lang-btn { right: 5px; bottom: 85px; }
  .offer-btn { right: 48px; bottom: 85px; }
  .support-btn { right: 90px; bottom: 85px; }
  .x-btn { right: 132px; bottom: 85px; }
  .circle-btn { width: 38px; height: 38px; }
  .ad-title { font-size: 18px; }
  .message-content p { font-size: 13px; line-height: 1.8; }

  /* البانر المصغر للهواتف الصغيرة */
  .special-offer-banner {
    top: 8px;
    padding: 5px 10px;
    max-width: 95%;
    border-radius: 10px;
  }
  .banner-content { gap: 5px; }
  .banner-title { font-size: 10px; }
  .banner-subtitle { font-size: 8px; }
  .banner-icon { font-size: 15px; }
  .banner-timer span { font-size: 8px; }
  .banner-timer { padding: 1px 6px; }
  .banner-timer i { font-size: 8px; }
  .banner-arrow { font-size: 9px; }
  
  .offer-title-text h2 { font-size: 15px; }
  .offer-icon { font-size: 32px; }
  .header-content { gap: 10px; }
  .special-offer-header { padding: 18px 15px; }
  .special-offer-body { padding: 15px; }
  .reward-label, .reward-value { font-size: 15px; }
  .offer-highlight { padding: 12px; }
  .highlight-text p { font-size: 13px; }
  .offer-timer-badge { font-size: 11px; padding: 3px 10px; }
}
</style>

<style>
:root{--primary:#7257ff!important;--accent:#a98cff;--bg:#0b1020;--surface:#151a2b;--text:#eef2ff}
body{background:radial-gradient(circle at top,#151a35 0,#0b1020 45%,#070b15 100%)!important;color:var(--text)!important}
.page-container{min-height:100vh}.bottom-nav{background:rgba(12,16,31,.94)!important;border-top:1px solid rgba(169,140,255,.22)!important;box-shadow:0 -10px 35px rgba(0,0,0,.35)!important;backdrop-filter:blur(18px)!important}.nav-item{color:#7f89a8!important}.nav-item.active{color:#a98cff!important}.nav-item i{filter:drop-shadow(0 4px 12px rgba(114,87,255,.25))}.circle-btn{background:#151a2b!important;border-color:rgba(169,140,255,.2)!important}.title-glow,.gold-icon{color:#a98cff!important}
</style>