<style scoped>
/* =========================================
   Transactions — Black & White Premium UI
   التصميم فقط — بدون تعديل الوظائف
========================================= */

.transactions-page {
  min-height: 100vh;
  width: 100%;
  background:
    radial-gradient(circle at top right, rgba(255,255,255,0.055), transparent 30%),
    radial-gradient(circle at bottom left, rgba(255,255,255,0.035), transparent 30%),
    #050505;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  direction: rtl;
  font-family: 'Cairo', sans-serif;
  color: #fff;
  box-sizing: border-box;
}

/* =========================================
   Main Card
========================================= */

.card {
  width: 100%;
  max-width: 900px;
  background: rgba(15, 15, 15, 0.96);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 28px;
  padding: 30px;
  position: relative;
  overflow: hidden;

  box-shadow:
    0 30px 80px rgba(0,0,0,0.65),
    inset 0 1px 0 rgba(255,255,255,0.04);

  box-sizing: border-box;
}

/* خط علوي فاخر */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 8%;
  left: 8%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.65),
    transparent
  );
}

/* إضاءة خلفية */
.card::after {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  top: -220px;
  right: -180px;
  background: radial-gradient(
    circle,
    rgba(255,255,255,0.045),
    transparent 70%
  );
  pointer-events: none;
}

/* =========================================
   Header
========================================= */

.card-header {
  position: relative;
  text-align: center;
  margin-bottom: 28px;
  z-index: 2;
}

.title {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  color: #fff;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.title i {
  color: #fff;
  font-size: 27px;
  opacity: 0.9;
}

.title-glow {
  color: #fff;
  background: none;
  -webkit-text-fill-color: #fff;
  font-weight: 900;
}

.sub {
  margin: 10px 0 0;
  color: rgba(255,255,255,0.48);
  font-size: 13px;
}

.header-glow {
  display: none;
}

/* =========================================
   Loading / Empty
========================================= */

.loading-box,
.empty-box {
  position: relative;
  z-index: 2;

  background: #0d0d0d;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;

  padding: 55px 25px;
  text-align: center;

  color: #fff;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.03);
}

.loading-box i {
  display: block;
  color: #fff;
  font-size: 36px;
  margin-bottom: 15px;
}

.loading-box p,
.empty-box p {
  margin: 0;
  color: rgba(255,255,255,0.72);
}

.empty-box i {
  display: block;
  font-size: 48px;
  color: rgba(255,255,255,0.25);
  margin-bottom: 15px;
}

.uid-info {
  margin-top: 12px !important;
  color: rgba(255,255,255,0.3) !important;
  font-size: 11px;
  direction: ltr;
}

/* =========================================
   Statistics
========================================= */

.stats-box {
  position: relative;
  z-index: 2;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;

  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 18px;
  overflow: hidden;

  margin-bottom: 24px;
}

.stat-item {
  padding: 18px 15px;
  text-align: center;
  background: #0d0d0d;
}

.stat-label {
  display: block;
  margin-bottom: 5px;

  color: rgba(255,255,255,0.42);
  font-size: 12px;
}

.stat-value {
  display: block;

  color: #fff;
  font-size: 22px;
  font-weight: 800;
}

/* =========================================
   Transaction Card
========================================= */

.transaction-card {
  position: relative;
  z-index: 2;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.035),
      rgba(255,255,255,0.012)
    ),
    #0d0d0d;

  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;

  padding: 22px;
  margin-bottom: 16px;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  overflow: hidden;
}

.transaction-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 100%;

  background: rgba(255,255,255,0.22);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.transaction-card:hover {
  transform: translateY(-3px);

  border-color: rgba(255,255,255,0.18);

  box-shadow:
    0 15px 40px rgba(0,0,0,0.45),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

.transaction-card:hover::before {
  opacity: 1;
}

/* =========================================
   Approval / Rejection
========================================= */

.approval-badge,
.rejection-badge {
  position: absolute;
  top: 15px;
  left: 15px;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;

  border-radius: 30px;

  font-size: 11px;
  font-weight: 700;

  backdrop-filter: blur(8px);
}

/* موافقة */
.approval-badge {
  color: #fff;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.18);
}

/* رفض */
.rejection-badge {
  color: #fff;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
}

.approval-badge i,
.rejection-badge i {
  color: #fff;
}

/* =========================================
   Mini Header
========================================= */

.card-header-mini {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 20px;
  padding-bottom: 16px;

  border-bottom: 1px solid rgba(255,255,255,0.07);
}

/* =========================================
   Type Badge
========================================= */

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;

  border-radius: 12px;

  font-size: 12px;
  font-weight: 700;

  background: rgba(255,255,255,0.06);
  color: #fff;

  border: 1px solid rgba(255,255,255,0.1);
}

.type-badge i {
  font-size: 12px;
}

.type-badge.withdraw,
.type-badge.withdrawal,
.type-badge.deposit,
.type-badge.recharge,
.type-badge.vip {
  background: rgba(255,255,255,0.06);
  color: #fff;
  border-color: rgba(255,255,255,0.1);
}

/* =========================================
   Status
========================================= */

.status-badge {
  padding: 6px 12px;

  border-radius: 30px;

  font-size: 11px;
  font-weight: 700;

  background: transparent;
  color: rgba(255,255,255,0.65);

  border: 1px solid rgba(255,255,255,0.1);
}

.status-badge.pending,
.status-badge.approved,
.status-badge.rejected {
  background: rgba(255,255,255,0.045);
  color: #fff;
  border-color: rgba(255,255,255,0.11);
}

/* =========================================
   Details Grid
========================================= */

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 13px;

  margin-bottom: 16px;
}

.detail-item {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 5px;

  padding: 12px;

  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.045);
  border-radius: 12px;

  transition: background 0.2s ease;
}

.detail-item:hover {
  background: rgba(255,255,255,0.045);
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 6px;

  color: rgba(255,255,255,0.38);
  font-size: 11px;
}

.detail-label i {
  color: rgba(255,255,255,0.65);
  font-size: 11px;
}

.detail-value {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
}

/* المبلغ */
.detail-value.amount {
  color: #fff;
  font-size: 16px;
  font-weight: 800;
}

/* الأكواد */
.detail-value.code,
.detail-value.hash,
.detail-value.user-id {
  color: rgba(255,255,255,0.68);
  font-family: monospace;
  font-size: 11px;
  direction: ltr;
}

/* الشبكة */
.detail-value.network {
  color: #fff;
}

/* المحفظة */
.detail-value.address {
  color: rgba(255,255,255,0.82);
  font-family: monospace;
  font-size: 11px;
  direction: ltr;
  word-break: break-all;
}

/* الهاتف */
.detail-value.phone {
  color: #fff;
}

/* البريد */
.detail-value.email {
  color: #fff;
}

/* VIP */
.detail-value.vip {
  color: #fff;
  font-weight: 800;
}

/* =========================================
   Admin Message
========================================= */

.admin-message {
  display: flex;
  align-items: flex-start;
  gap: 11px;

  margin-top: 14px;
  padding: 14px;

  border-radius: 14px;

  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.08);
}

.admin-message.approved,
.admin-message.rejected {
  background: rgba(255,255,255,0.035);
  border-color: rgba(255,255,255,0.1);
}

.admin-message i {
  margin-top: 2px;
  font-size: 18px;
  color: #fff;
}

.admin-message strong {
  color: #fff;
  font-size: 12px;
}

.admin-message p {
  margin: 5px 0 0;
  color: rgba(255,255,255,0.72);
  font-size: 13px;
  line-height: 1.7;
}

.message-date {
  display: block;
  margin-top: 7px;

  color: rgba(255,255,255,0.3);
  font-size: 10px;
}

/* =========================================
   User Message
========================================= */

.user-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  margin-top: 10px;
  padding: 12px 14px;

  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);

  border-radius: 13px;
}

.user-message i {
  color: #fff;
  font-size: 15px;
  margin-top: 2px;
}

.user-message strong {
  color: #fff;
  font-size: 12px;
}

.user-message p {
  margin: 4px 0 0;
  color: rgba(255,255,255,0.65);
  font-size: 12px;
  line-height: 1.6;
}

/* =========================================
   Reason
========================================= */

.reason-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  margin-top: 10px;
  padding: 12px 14px;

  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.055);

  border-radius: 13px;
}

.reason-box i {
  color: rgba(255,255,255,0.65);
  font-size: 13px;
  margin-top: 3px;
}

.reason-box strong {
  color: rgba(255,255,255,0.75);
  font-size: 11px;
}

.reason-box p {
  margin: 4px 0 0;
  color: rgba(255,255,255,0.5);
  font-size: 12px;
  line-height: 1.6;
}

/* =========================================
   Scrollbar
========================================= */

.transactions-page ::-webkit-scrollbar {
  width: 6px;
}

.transactions-page ::-webkit-scrollbar-track {
  background: #080808;
}

.transactions-page ::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.18);
  border-radius: 10px;
}

.transactions-page ::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.3);
}

/* =========================================
   Mobile
========================================= */

@media (max-width: 700px) {
  .transactions-page {
    padding: 12px;
    align-items: flex-start;
  }

  .card {
    margin-top: 10px;
    padding: 18px;
    border-radius: 22px;
  }

  .title {
    font-size: 22px;
  }

  .title i {
    font-size: 21px;
  }

  .sub {
    font-size: 12px;
  }

  .transaction-card {
    padding: 16px;
    border-radius: 17px;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .detail-item.full-width {
    grid-column: auto;
  }

  .stats-box {
    grid-template-columns: 1fr;
  }

  .card-header-mini {
    gap: 10px;
    flex-wrap: wrap;
  }

  .approval-badge,
  .rejection-badge {
    position: static;
    width: fit-content;
    margin-bottom: 10px;
  }
}

/* =========================================
   Small Phones
========================================= */

@media (max-width: 400px) {
  .transactions-page {
    padding: 8px;
  }

  .card {
    padding: 14px;
  }

  .title {
    font-size: 19px;
  }

  .type-badge {
    padding: 7px 10px;
    font-size: 11px;
  }

  .status-badge {
    font-size: 10px;
    padding: 5px 9px;
  }

  .stat-value {
    font-size: 19px;
  }
}

/* =========================================
   Spinner
========================================= */

.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
