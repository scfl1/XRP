<template>
  <div
    id="app"
    class="xrp-app"
    :class="{ rtl: currentLang === 'AR' }"
    dir="rtl"
  >
    <!-- =========================
         TOP BAR
    ========================== -->
    <header class="top-bar">
      <div class="top-brand">
        <div class="xrp-logo">X</div>

        <div class="brand-text">
          <strong>XRP</strong>
          <span>{{ currentLang === 'AR' ? 'مجتمع XRP' : 'XRP Community' }}</span>
        </div>
      </div>

      <div class="top-actions">
        <button
          class="icon-button"
          type="button"
          @click="toggleMenu"
          aria-label="Menu"
        >
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </header>

    <!-- =========================
         SIMPLE MENU
    ========================== -->
    <transition name="fade">
      <div v-if="showMenu" class="simple-menu">
        <button type="button" @click="scrollToSection('community')">
          <i class="fas fa-users"></i>
          <span>{{ currentLang === 'AR' ? 'المجتمع' : 'Community' }}</span>
        </button>

        <button type="button" @click="scrollToSection('information')">
          <i class="fas fa-circle-info"></i>
          <span>{{ currentLang === 'AR' ? 'المعلومات' : 'Information' }}</span>
        </button>

        <button type="button" @click="scrollToSection('principles')">
          <i class="fas fa-shield-halved"></i>
          <span>{{ currentLang === 'AR' ? 'المبادئ' : 'Principles' }}</span>
        </button>
      </div>
    </transition>

    <!-- =========================
         MAIN COMMUNITY CARD
    ========================== -->
    <main class="page-wrapper">
      <section
        id="community"
        class="community-card"
        aria-label="XRP Community"
      >
        <!-- HEADER -->
        <div class="community-header">
          <div class="header-logo">
            <span>X</span>
          </div>

          <div class="header-title">
            <h1>XRP Community</h1>

            <p>
              {{
                currentLang === 'AR'
                  ? 'تحديث المجتمع'
                  : 'Community Update'
              }}
            </p>
          </div>
        </div>

        <!-- BODY -->
        <div class="community-body">

          <!-- WELCOME -->
          <div class="welcome-row">
            <div class="welcome-icon">
              X
            </div>

            <h2>
              {{
                currentLang === 'AR'
                  ? 'مرحبًا بكم في مجتمع XRP'
                  : 'Welcome to the XRP Community'
              }}
            </h2>
          </div>

          <p class="intro-text">
            {{
              currentLang === 'AR'
                ? 'مرحبًا بكم في مجتمع XRP. تم تصميم هذه الواجهة لتوفير مساحة بسيطة ومنظمة لمتابعة المعلومات والأخبار والمناقشات المتعلقة بـ XRP.'
                : 'Welcome to the XRP Community. This interface is designed to provide a simple and organized space for following information, news and discussions related to XRP.'
            }}
          </p>

          <!-- INFORMATION BOX -->
          <div id="information" class="info-box">
            <div class="info-icon">
              <i class="fas fa-info"></i>
            </div>

            <div class="info-content">
              <h3>
                {{
                  currentLang === 'AR'
                    ? 'المعلومات المعروضة هنا هي معلومات مجتمعية'
                    : 'Information displayed here is community information'
                }}
              </h3>

              <p>
                {{
                  currentLang === 'AR'
                    ? 'وليست إعلانًا رسميًا من XRP أو Ripple.'
                    : 'It is not an official announcement from XRP or Ripple.'
                }}
              </p>
            </div>
          </div>

          <!-- DISCLAIMER -->
          <p class="disclaimer-text">
            {{
              currentLang === 'AR'
                ? 'ننصح دائمًا بالاعتماد على المصادر الرسمية والتحقق من أي معلومة قبل اتخاذ أي قرار مالي أو استثماري.'
                : 'Always rely on official sources and verify information before making any financial or investment decision.'
            }}
          </p>

          <!-- PRINCIPLES -->
          <section id="principles" class="principles-section">

            <h2 class="section-title">
              {{
                currentLang === 'AR'
                  ? 'مبادئ المجتمع'
                  : 'Community Principles'
              }}
            </h2>

            <div class="principles-table">

              <div class="table-head">
                <div>
                  {{
                    currentLang === 'AR'
                      ? 'العنصر'
                      : 'Item'
                  }}
                </div>

                <div>
                  {{
                    currentLang === 'AR'
                      ? 'الحالة'
                      : 'Status'
                  }}
                </div>
              </div>

              <div class="table-row">
                <div>
                  <i class="fas fa-circle-info"></i>
                  {{
                    currentLang === 'AR'
                      ? 'المعلومات'
                      : 'Information'
                  }}
                </div>

                <div class="status">
                  <i class="fas fa-check"></i>
                  {{
                    currentLang === 'AR'
                      ? 'متاحة'
                      : 'Available'
                  }}
                </div>
              </div>

              <div class="table-row">
                <div>
                  <i class="fas fa-users"></i>
                  {{
                    currentLang === 'AR'
                      ? 'المجتمع'
                      : 'Community'
                  }}
                </div>

                <div class="status">
                  <i class="fas fa-check"></i>
                  {{
                    currentLang === 'AR'
                      ? 'نشط'
                      : 'Active'
                  }}
                </div>
              </div>

              <div class="table-row">
                <div>
                  <i class="fas fa-arrows-rotate"></i>
                  {{
                    currentLang === 'AR'
                      ? 'التحديثات'
                      : 'Updates'
                  }}
                </div>

                <div class="status">
                  <i class="fas fa-check"></i>
                  {{
                    currentLang === 'AR'
                      ? 'مستمرة'
                      : 'Ongoing'
                  }}
                </div>
              </div>

              <div class="table-row">
                <div>
                  <i class="fas fa-shield-halved"></i>
                  {{
                    currentLang === 'AR'
                      ? 'الأمان'
                      : 'Security'
                  }}
                </div>

                <div class="status">
                  <i class="fas fa-check"></i>
                  {{
                    currentLang === 'AR'
                      ? 'مهم'
                      : 'Important'
                  }}
                </div>
              </div>

            </div>
          </section>

          <!-- FOOTER NOTE -->
          <div class="community-note">
            <div class="note-icon">
              <i class="fas fa-shield-halved"></i>
            </div>

            <p>
              {{
                currentLang === 'AR'
                  ? 'هذه الواجهة مخصصة للمعلومات المجتمعية حول XRP. لا تمثل هذه الصفحة شركة Ripple ولا تُعد مصدرًا رسميًا لها.'
                  : 'This interface is intended for community information about XRP. It does not represent Ripple and is not an official Ripple source.'
              }}
            </p>
          </div>

        </div>

        <!-- BOTTOM BUTTON -->
        <div class="community-footer">
          <button
            class="understood-button"
            type="button"
            @click="closeNotice"
          >
            <span>
              {{
                currentLang === 'AR'
                  ? 'فهمت، شكرًا'
                  : 'Understood, thank you'
              }}
            </span>

            <i class="fas fa-check-circle"></i>
          </button>
        </div>

      </section>
    </main>

    <!-- =========================
         SMALL FOOTER
    ========================== -->
    <footer class="page-footer">
      <div class="footer-logo">X</div>

      <span>
        XRP Community
      </span>

      <small>
        {{
          currentLang === 'AR'
            ? 'معلومات مجتمعية فقط'
            : 'Community information only'
        }}
      </small>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      currentLang: 'AR',
      showMenu: false,
      noticeClosed: false
    }
  },

  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu
    },

    scrollToSection(id) {
      this.showMenu = false

      this.$nextTick(() => {
        const element = document.getElementById(id)

        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      })
    },

    closeNotice() {
      this.noticeClosed = true

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>
/* =========================================================
   XRP COMMUNITY
   BLACK & WHITE DESIGN
========================================================= */

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

body {
  font-family:
    "Noto Sans Arabic",
    "Noto Sans",
    Arial,
    sans-serif;

  background: #ffffff;
  color: #111111;
}

/* =========================================================
   APP
========================================================= */

.xrp-app {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  color: #111111;
  overflow-x: hidden;
}

.xrp-app.rtl {
  direction: rtl;
}

/* =========================================================
   TOP BAR
========================================================= */

.top-bar {
  width: 100%;
  min-height: 76px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 22px;

  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;

  position: sticky;
  top: 0;
  z-index: 100;
}

.top-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.xrp-logo {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #000000;
  color: #ffffff;

  border-radius: 50%;

  font-size: 25px;
  font-weight: 900;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-text strong {
  font-size: 20px;
  font-weight: 900;
  color: #000000;
}

.brand-text span {
  margin-top: 3px;
  font-size: 12px;
  color: #555555;
}

.top-actions {
  display: flex;
  align-items: center;
}

.icon-button {
  width: 44px;
  height: 44px;

  border: 1px solid #111111;
  border-radius: 50%;

  background: #ffffff;
  color: #000000;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  font-size: 18px;

  transition: 0.2s ease;
}

.icon-button:hover {
  background: #000000;
  color: #ffffff;
}

/* =========================================================
   SIMPLE MENU
========================================================= */

.simple-menu {
  position: fixed;

  top: 86px;
  left: 18px;

  width: 210px;

  padding: 8px;

  background: #ffffff;

  border: 1px solid #111111;
  border-radius: 14px;

  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.16);

  z-index: 200;
}

.simple-menu button {
  width: 100%;

  padding: 13px 12px;

  border: 0;
  border-bottom: 1px solid #eeeeee;

  background: #ffffff;
  color: #111111;

  display: flex;
  align-items: center;
  gap: 10px;

  text-align: right;

  cursor: pointer;

  font-family: inherit;
  font-size: 14px;
}

.simple-menu button:last-child {
  border-bottom: 0;
}

.simple-menu button:hover {
  background: #f5f5f5;
}

.simple-menu i {
  width: 20px;
}

/* =========================================================
   PAGE
========================================================= */

.page-wrapper {
  width: 100%;
  min-height: calc(100vh - 76px);

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 34px 18px 50px;

  background: #ffffff;
}

/* =========================================================
   COMMUNITY CARD
========================================================= */

.community-card {
  width: 100%;
  max-width: 650px;

  background: #ffffff;

  border: 2px solid #000000;
  border-radius: 30px;

  overflow: hidden;

  box-shadow:
    0 20px 55px rgba(0, 0, 0, 0.13);
}

/* =========================================================
   COMMUNITY HEADER
========================================================= */

.community-header {
  min-height: 150px;

  padding: 28px 32px;

  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 20px;

  border-bottom: 2px solid #000000;
}

.header-logo {
  width: 72px;
  height: 72px;

  flex: 0 0 72px;

  border-radius: 50%;

  background: #000000;
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 40px;
  font-weight: 900;
}

.header-title {
  text-align: center;
}

.header-title h1 {
  margin: 0;

  font-size: 30px;
  line-height: 1.2;

  font-weight: 900;

  color: #000000;
}

.header-title p {
  margin: 8px 0 0;

  font-size: 17px;
  color: #444444;
}

/* =========================================================
   BODY
========================================================= */

.community-body {
  padding: 38px 34px 30px;

  background: #000000;
  color: #ffffff;
}

/* =========================================================
   WELCOME
========================================================= */

.welcome-row {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  margin-bottom: 26px;
}

.welcome-icon {
  width: 48px;
  height: 48px;

  flex: 0 0 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffffff;
  color: #000000;

  font-size: 22px;
  font-weight: 900;
}

.welcome-row h2 {
  margin: 0;

  color: #ffffff;

  font-size: 27px;
  line-height: 1.4;

  font-weight: 900;
}

/* =========================================================
   INTRO
========================================================= */

.intro-text {
  margin: 0 auto 30px;

  max-width: 570px;

  color: #eeeeee;

  font-size: 20px;
  line-height: 2;

  text-align: center;
}

/* =========================================================
   INFO BOX
========================================================= */

.info-box {
  width: 100%;

  display: flex;
  align-items: flex-start;

  gap: 16px;

  padding: 24px 22px;

  margin: 28px 0;

  background: #111111;

  border: 1px solid #ffffff;
  border-radius: 18px;
}

.info-icon {
  width: 36px;
  height: 36px;

  flex: 0 0 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffffff;
  color: #000000;

  font-weight: 900;
}

.info-content {
  flex: 1;
}

.info-content h3 {
  margin: 0 0 9px;

  font-size: 20px;
  line-height: 1.6;

  color: #ffffff;
}

.info-content p {
  margin: 0;

  color: #dddddd;

  font-size: 17px;
  line-height: 1.8;
}

/* =========================================================
   DISCLAIMER
========================================================= */

.disclaimer-text {
  margin: 28px auto 36px;

  max-width: 560px;

  color: #dddddd;

  font-size: 18px;
  line-height: 2;

  text-align: center;
}

/* =========================================================
   PRINCIPLES
========================================================= */

.principles-section {
  width: 100%;

  padding-top: 8px;
}

.section-title {
  margin: 0 0 22px;

  text-align: center;

  color: #ffffff;

  font-size: 25px;
  font-weight: 900;
}

.principles-table {
  width: 100%;

  overflow: hidden;

  border: 1px solid #ffffff;
  border-radius: 16px;

  background: #ffffff;
  color: #000000;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;

  min-height: 58px;
}

.table-head {
  background: #000000;
  color: #ffffff;

  font-weight: 900;
}

.table-head > div,
.table-row > div {
  display: flex;
  align-items: center;

  padding: 12px 16px;
}

.table-head > div:last-child,
.table-row > div:last-child {
  justify-content: center;
}

.table-row {
  border-top: 1px solid #dddddd;

  background: #ffffff;
}

.table-row:nth-child(odd) {
  background: #f5f5f5;
}

.table-row i {
  margin-left: 8px;
  margin-right: 8px;

  font-size: 14px;
}

.status {
  font-weight: 800;
}

.status i {
  color: #000000;
}

/* =========================================================
   COMMUNITY NOTE
========================================================= */

.community-note {
  margin-top: 30px;

  padding: 20px;

  border: 1px solid #ffffff;
  border-radius: 16px;

  background: #111111;

  display: flex;
  align-items: flex-start;

  gap: 13px;
}

.note-icon {
  width: 34px;
  height: 34px;

  flex: 0 0 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffffff;
  color: #000000;
}

.community-note p {
  margin: 0;

  color: #dddddd;

  font-size: 14px;
  line-height: 1.9;
}

/* =========================================================
   FOOTER BUTTON
========================================================= */

.community-footer {
  padding: 24px 34px 32px;

  background: #000000;

  border-top: 1px solid #333333;
}

.understood-button {
  width: 100%;

  min-height: 64px;

  border: 2px solid #000000;
  border-radius: 50px;

  background: #ffffff;
  color: #000000;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  cursor: pointer;

  font-family: inherit;
  font-size: 18px;
  font-weight: 900;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.understood-button:hover {
  background: #000000;
  color: #ffffff;

  border-color: #ffffff;
}

.understood-button:active {
  transform: scale(0.98);
}

.understood-button i {
  font-size: 18px;
}

/* =========================================================
   PAGE FOOTER
========================================================= */

.page-footer {
  width: 100%;

  padding: 25px 20px 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;

  gap: 8px;

  background: #ffffff;

  color: #111111;
}

.footer-logo {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #000000;
  color: #ffffff;

  font-weight: 900;
}

.page-footer span {
  font-size: 15px;
  font-weight: 900;
}

.page-footer small {
  font-size: 12px;
  color: #777777;
}

/* =========================================================
   TRANSITIONS
========================================================= */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 700px) {

  .page-wrapper {
    padding: 22px 10px 35px;
  }

  .community-card {
    border-radius: 24px;
  }

  .community-header {
    min-height: 130px;

    padding: 22px 18px;

    gap: 14px;
  }

  .header-logo {
    width: 62px;
    height: 62px;

    flex-basis: 62px;

    font-size: 34px;
  }

  .header-title h1 {
    font-size: 25px;
  }

  .header-title p {
    font-size: 15px;
  }

  .community-body {
    padding: 30px 20px 25px;
  }

  .welcome-row h2 {
    font-size: 22px;
  }

  .intro-text {
    font-size: 18px;
  }

  .info-content h3 {
    font-size: 18px;
  }

  .info-content p {
    font-size: 15px;
  }

  .disclaimer-text {
    font-size: 16px;
  }

  .section-title {
    font-size: 22px;
  }

  .community-footer {
    padding: 20px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 480px) {

  .top-bar {
    min-height: 64px;
    padding: 9px 13px;
  }

  .xrp-logo {
    width: 40px;
    height: 40px;

    font-size: 22px;
  }

  .brand-text strong {
    font-size: 17px;
  }

  .brand-text span {
    font-size: 10px;
  }

  .icon-button {
    width: 40px;
    height: 40px;
  }

  .simple-menu {
    top: 72px;
    left: 10px;
    right: 10px;
    width: auto;
  }

  .page-wrapper {
    padding: 10px 5px 25px;
  }

  .community-card {
    border-radius: 20px;
    border-width: 1px;
  }

  .community-header {
    min-height: 115px;

    padding: 18px 12px;

    gap: 10px;
  }

  .header-logo {
    width: 52px;
    height: 52px;

    flex-basis: 52px;

    font-size: 28px;
  }

  .header-title h1 {
    font-size: 21px;
  }

  .header-title p {
    margin-top: 5px;
    font-size: 13px;
  }

  .community-body {
    padding: 25px 14px 20px;
  }

  .welcome-row {
    gap: 9px;
    margin-bottom: 20px;
  }

  .welcome-icon {
    width: 40px;
    height: 40px;

    flex-basis: 40px;

    font-size: 18px;
  }

  .welcome-row h2 {
    font-size: 18px;
  }

  .intro-text {
    font-size: 16px;
    line-height: 1.9;
  }

  .info-box {
    padding: 18px 14px;
    gap: 10px;
  }

  .info-icon {
    width: 31px;
    height: 31px;

    flex-basis: 31px;
  }

  .info-content h3 {
    font-size: 16px;
    line-height: 1.55;
  }

  .info-content p {
    font-size: 14px;
    line-height: 1.7;
  }

  .disclaimer-text {
    font-size: 14px;
    line-height: 1.9;
  }

  .section-title {
    font-size: 20px;
  }

  .table-head,
  .table-row {
    min-height: 52px;
  }

  .table-head > div,
  .table-row > div {
    padding: 9px 8px;
    font-size: 13px;
  }

  .table-row i {
    margin-left: 4px;
    margin-right: 4px;
    font-size: 11px;
  }

  .community-note {
    padding: 15px;
  }

  .community-note p {
    font-size: 12px;
    line-height: 1.8;
  }

  .community-footer {
    padding: 16px 14px 20px;
  }

  .understood-button {
    min-height: 57px;
    font-size: 16px;
  }
}
</style>
