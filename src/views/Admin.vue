<template>
  <div class="admin-page">
    <!-- Header -->
    <div class="header-row">
      <h1 class="page-title">لوحة الإدارة</h1>
      <div class="header-actions">
        <button class="logout-btn" @click="logout">تسجيل خروج</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="['tab', activeTab === 'withdraws' ? 'active' : '']" @click="switchTab('withdraws')">
        طلبات السحب ({{ withdraws.length }})
      </button>
      <button :class="['tab', activeTab === 'recharges' ? 'active' : '']" @click="switchTab('recharges')">
        طلبات التعبئة ({{ rechargeRequests.length }})
      </button>
      <button :class="['tab', activeTab === 'users' ? 'active' : '']" @click="switchTab('users')">
        المستخدمون ({{ users.length }})
      </button>
      <button :class="['tab', activeTab === 'notifications' ? 'active' : '']" @click="switchTab('notifications')">
        الإشعارات
      </button>
      <button :class="['tab', activeTab === 'withdrawLogs' ? 'active' : '']" @click="switchTab('withdrawLogs')">
        سجل السحوبات ({{ withdrawLogs.length }})
      </button>
      <button :class="['tab', activeTab === 'rechargeLogs' ? 'active' : '']" @click="switchTab('rechargeLogs')">
        سجل التعبئة
      </button>
    </div>

    <!-- طلبات السحب -->
    <div v-if="activeTab === 'withdraws'" class="panel">
      <div class="panel-header">
        <h2>طلبات السحب</h2>
        <div class="controls">
          <input v-model="withdrawFilter" placeholder="بحث عن بريد / محفظة..." />
          <select v-model="withdrawSort">
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="amount_desc">الأعلى مبلغ</option>
            <option value="amount_asc">الأقل مبلغ</option>
          </select>
          <button @click="loadWithdrawRequests" type="button">تحديث</button>
        </div>
      </div>

      <div v-if="loadingWithdraws" class="loading">⏳ جاري تحميل طلبات السحب...</div>
      <div v-else>
        <div v-if="filteredWithdraws.length === 0" class="empty">لا توجد طلبات سحب حالياً.</div>
        <div class="cards">
          <div class="card withdraw-card" v-for="req in filteredWithdraws" :key="req.id">
            <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ req.userPhone || '—' }}</span></p>
            <p><strong>البريد:</strong> <span class="gold-text">{{ req.userEmail || req.email || '—' }}</span></p>
            <p><strong>المبلغ:</strong> <span class="gold-text">{{ req.amount }} USDT</span></p>
            <p><strong>الشبكة:</strong> {{ req.network || '—' }}</p>
            <p><strong>المحفظة:</strong> {{ req.wallet || req.walletAddress || '—' }}</p>
            <p><strong>مستوى VIP:</strong> {{ req.vipLevel || '—' }}</p>
            <p><strong>الحالة:</strong> 
              <span :class="{
                'status-approved': req.status === 'approved',
                'status-rejected': req.status === 'rejected',
                'status-pending': req.status === 'pending'
              }">
                {{ req.status === 'approved' ? 'موافق' : req.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة' }}
              </span>
            </p>
            <p class="muted">تم الإنشاء: {{ formatDate(req.createdAt) }}</p>
            <div class="card-actions">
              <button class="btn gold" type="button" @click.stop="openApproveModal(req, 'withdraw')" :disabled="processingId === req.id || req.status === 'approved'">موافقة</button>
              <button class="btn red" type="button" @click.stop="openRejectModal(req, 'withdraw')" :disabled="processingId === req.id || req.status === 'rejected'">رفض</button>
              <button class="btn black" type="button" @click.stop="deleteWithdraw(req)" :disabled="processingId === req.id">حذف</button>
              <button class="btn gold-outline" type="button" @click.stop="viewWithdrawDetails(req)">تفاصيل</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- طلبات التعبئة -->
    <div v-if="activeTab === 'recharges'" class="panel">
      <div class="panel-header">
        <h2>طلبات التعبئة</h2>
        <div class="controls">
          <input v-model="rechargeFilter" placeholder="بحث بالبريد أو الشبكة أو الحالة..." />
          <select v-model="rechargeSort">
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="amount_desc">الأعلى مبلغ</option>
            <option value="amount_asc">الأقل مبلغ</option>
            <option value="status_pending">قيد المراجعة</option>
            <option value="status_approved">موافق عليها</option>
            <option value="status_rejected">مرفوضة</option>
          </select>
          <button @click="reloadRechargeRequests" type="button">تحديث</button>
          <button @click="markAllRechargeNotificationsRead" type="button">وضع إشعارات كمقروءة</button>
        </div>
      </div>

      <div v-if="loadingRecharges" class="loading">⏳ جاري تحميل طلبات التعبئة...</div>
      <div v-else>
        <div v-if="filteredRechargeRequests.length === 0" class="empty">لا توجد طلبات تعبئة حالياً.</div>
        <div class="cards">
          <div class="card recharge-card" v-for="r in filteredRechargeRequests" :key="r.id">
            <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ r.userPhone || r.phoneNumber || '—' }}</span></p>
            <p><strong>البريد:</strong> <span class="gold-text">{{ r.email || r.userEmail || '—' }}</span></p>
            <p><strong>المبلغ:</strong> <span class="gold-text">{{ r.amount }} USDT</span></p>
            <p><strong>الشبكة:</strong> {{ r.network || '—' }}</p>
            <p><strong>TxID:</strong> <span class="gold-text">{{ r.txid || '—' }}</span></p>
            <p><strong>حالة:</strong> 
              <span :class="{
                'status-approved': r.status === 'approved',
                'status-rejected': r.status === 'rejected',
                'status-pending': r.status === 'pending'
              }">
                {{ r.status === 'approved' ? 'موافق' : r.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة' }}
              </span>
            </p>
            <p class="muted">تم الإنشاء: {{ formatDate(r.createdAt) }}</p>
            <div class="card-actions">
              <button class="btn gold" type="button" @click.stop="openApproveModal(r, 'recharge')" :disabled="processingId === r.id || r.status === 'approved'">موافقة</button>
              <button class="btn red" type="button" @click.stop="openRejectModal(r, 'recharge')" :disabled="processingId === r.id || r.status === 'rejected'">رفض</button>
              <button class="btn black" type="button" @click.stop="deleteRecharge(r)" :disabled="processingId === r.id">حذف</button>
              <button class="btn gold-outline" type="button" @click.stop="viewRechargeDetails(r)">تفاصيل</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- المستخدمين -->
    <div v-if="activeTab === 'users'" class="panel">
      <div class="panel-header">
        <h2>جميع المستخدمين</h2>
        <div class="controls">
          <input v-model="userFilter" placeholder="بحث بالبريد أو رقم الهاتف..." />
          <select v-model="userSort">
            <option value="email">ترتيب بالبريد</option>
            <option value="phone">ترتيب برقم الهاتف</option>
            <option value="balance_desc">الرصيد (تنازلي)</option>
            <option value="balance_asc">الرصيد (تصاعدي)</option>
            <option value="date_desc">التاريخ (الأحدث أولاً)</option>
            <option value="date_asc">التاريخ (الأقدم أولاً)</option>
          </select>
          <button @click="loadUsers" type="button">تحديث</button>
        </div>
      </div>

      <div v-if="loadingUsers" class="loading">⏳ جاري تحميل المستخدمين...</div>
      <div v-else>
        <div v-if="filteredUsers.length === 0" class="empty">لا يوجد مستخدمين.</div>
        <div class="cards">
          <div class="card user-card" v-for="u in filteredUsers" :key="u.id">
            <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ u.phoneNumber || '—' }}</span></p>
            <p><strong>البريد:</strong> <span class="gold-text">{{ u.email || '—' }}</span></p>
            
            <!-- معلومات الرصيد المحسنة -->
            <p><strong>الرصيد الإجمالي:</strong> <span class="gold-text">{{ formatBalance(u.balance) }} USDT</span></p>
            <p v-if="u.vipLockedAmount > 0">
              <strong>مبلغ VIP المحجوز:</strong> 
              <span class="gold-text" style="color: #fbbf24;">{{ formatBalance(u.vipLockedAmount) }} USDT</span>
              <span style="font-size: 10px; color: rgba(255,255,255,0.5);">(غير قابل للسحب)</span>
            </p>
            <p v-if="u.vipLockedAmount > 0">
              <strong>المتاح للسحب:</strong> 
              <span class="gold-text" style="color: #34d399;">{{ formatBalance(u.availableBalance) }} USDT</span>
            </p>
            
            <p><strong>الحالة:</strong> {{ u.blocked ? 'محظور' : 'فعال' }}</p>
            <p><strong>طريقة التسجيل:</strong> 
              <span :class="{
                'register-phone': u.registrationMethod === 'phone',
                'register-email': u.registrationMethod === 'email'
              }">
                {{ u.registrationMethod === 'phone' ? '📱 رقم هاتف' : '📧 بريد إلكتروني' }}
              </span>
            </p>
            <div class="card-actions">
              <button class="btn gold" type="button" @click="promptRecharge(u)">تعبئة رصيد</button>
              <button class="btn red" type="button" @click="promptDeduct(u)">سحب رصيد</button>
              <button class="btn details-btn" type="button" @click="viewUserDetails(u)">تفاصيل</button>
              <button class="btn blue" type="button" @click="sendResetPassword(u.email)" :disabled="!u.email">إعادة تعيين كلمة السر</button>
              <button class="btn purple" type="button" @click="openAccountDetailsModal(u)">
                <i class="fas fa-user-circle"></i> تفاصيل الحساب
              </button>
              <button class="btn black" type="button" @click="toggleBlockUser(u)">
                {{ u.blocked ? 'إلغاء الحظر' : 'حظر' }}
              </button>
              <button class="btn gold-outline" type="button" @click="viewUserNotifications(u)">
                الإشعارات ({{ u.notificationsCount || 0 }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- الإشعارات -->
    <div v-if="activeTab === 'notifications'" class="panel">
      <div class="panel-header">
        <h2>إشعارات المستخدمين (عرض عام)</h2>
        <div class="controls">
          <input v-model="notifFilter" placeholder="بحث..." />
          <button @click="loadAllNotifications" type="button">تحميل</button>
        </div>
      </div>

      <div v-if="loadingNotifs" class="loading">⏳ جاري تحميل الإشعارات...</div>
      <div v-else>
        <div v-if="allNotifications.length === 0" class="empty">لا توجد إشعارات.</div>
        <div class="cards">
          <div class="card notif-card" v-for="n in filteredNotifications" :key="n.id">
            <p><strong>إلى:</strong> {{ n.email || n.userId }}</p>
            <p><strong>العنوان:</strong> {{ n.title }}</p>
            <p>{{ n.message }}</p>
            <p class="muted">الوقت: {{ formatDate(n.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- سجل السحوبات -->
    <div v-if="activeTab === 'withdrawLogs'" class="panel">
      <div class="panel-header">
        <h2>سجل السحوبات</h2>
        <div class="controls">
          <input v-model="withdrawLogFilter" placeholder="بحث بالبريد أو المحفظة..." />
          <select v-model="withdrawLogSort">
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="amount_desc">الأعلى مبلغ</option>
            <option value="amount_asc">الأقل مبلغ</option>
          </select>
          <button @click="loadWithdrawLogs" type="button">تحديث</button>
        </div>
      </div>

      <div v-if="loadingWithdrawLogs" class="loading">⏳ جاري تحميل السجلات...</div>
      <div v-else>
        <div v-if="filteredWithdrawLogs.length === 0" class="empty">لا توجد سجلات.</div>
        <div class="cards">
          <div class="card log-card" v-for="l in filteredWithdrawLogs" :key="l.id">
            <p><strong>معرف المعاملة:</strong> <span class="gold-text">{{ l.transactionId || l.id || '—' }}</span></p>
            <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ l.userPhone || '—' }}</span></p>
            <p><strong>البريد:</strong> <span class="gold-text">{{ l.userEmail || l.email || '—' }}</span></p>
            <p><strong>المبلغ:</strong> <span class="gold-text">{{ l.amount }} USDT</span></p>
            <p><strong>الشبكة:</strong> {{ l.network || '—' }}</p>
            <p><strong>عنوان المحفظة:</strong> <span class="gold-text">{{ l.wallet || l.walletAddress || '—' }}</span></p>
            <p><strong>مستوى VIP:</strong> {{ l.vipLevel || '—' }}</p>
            <p><strong>المبلغ المحجوز:</strong> {{ l.lockedAmountAtWithdraw || '—' }} USDT</p>
            <p><strong>الرصيد المتاح:</strong> {{ l.availableBalanceAtWithdraw || '—' }} USDT</p>
            <p><strong>الحالة:</strong> 
              <span :class="{
                'status-approved': l.status === 'approved' || l.type === 'approved',
                'status-rejected': l.status === 'rejected' || l.type === 'rejected',
                'status-pending': l.status === 'pending' || l.type === 'pending'
              }">
                {{ l.status === 'approved' || l.type === 'approved' ? 'موافق' : 
                   l.status === 'rejected' || l.type === 'rejected' ? 'مرفوض' : 
                   l.status || l.type || 'قيد المراجعة' }}
              </span>
            </p>
            <p v-if="l.adminMessage && l.adminMessage.includes('تم حذف الطلب')" style="color: #6c757d;">
              <strong>ملاحظة:</strong> {{ l.adminMessage }}
            </p>
            <p v-if="l.reason || l.rejectionReason"><strong>سبب الرفض:</strong> {{ l.reason || l.rejectionReason }}</p>
            <p v-if="l.adminMessage && !l.adminMessage.includes('تم حذف الطلب')"><strong>رسالة الأدمن:</strong> {{ l.adminMessage }}</p>
            <p v-if="l.userMessage"><strong>رسالة المستخدم:</strong> {{ l.userMessage }}</p>
            <p v-if="l.adminAction"><strong>إجراء الأدمن:</strong> {{ l.adminAction }}</p>
            <p class="muted">تاريخ الطلب: {{ formatDate(l.createdAt) }}</p>
            <p v-if="l.processedAt" class="muted">تاريخ المعالجة: {{ formatDate(l.processedAt) }}</p>
            <p v-if="l.approvedAt" class="muted">تاريخ الموافقة: {{ formatDate(l.approvedAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- سجل التعبئة -->
    <div v-if="activeTab === 'rechargeLogs'" class="panel">
      <div class="panel-header">
        <h2>سجل تعبئة الرصيد</h2>
        <div class="controls">
          <input v-model="rechargeLogFilter" placeholder="بحث بالبريد أو المبلغ..." />
          <select v-model="rechargeLogSort">
            <option value="newest">الأحدث أولاً</option>
            <option value="oldest">الأقدم أولاً</option>
            <option value="amount_desc">الأعلى مبلغ</option>
            <option value="amount_asc">الأقل مبلغ</option>
          </select>
          <button @click="loadRechargeLogs" type="button">تحديث</button>
        </div>
      </div>

      <div v-if="loadingRechargeLogs" class="loading">⏳ جاري تحميل سجلات التعبئة...</div>
      <div v-else>
        <div v-if="rechargeLogs.length === 0" class="empty">لا توجد سجلات تعبئة.</div>
        <div class="cards">
          <div class="card log-card" v-for="log in filteredRechargeLogs" :key="log.id">
            <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ log.userPhone || log.phoneNumber || '—' }}</span></p>
            <p><strong>البريد:</strong> <span class="gold-text">{{ log.email || log.userEmail || '—' }}</span></p>
            <p><strong>المبلغ:</strong> <span class="gold-text">{{ log.amount }} USDT</span></p>
            <p><strong>الحالة:</strong> 
              <span :class="{
                'status-approved': log.type === 'approved' || log.status === 'approved',
                'status-rejected': log.type === 'rejected' || log.status === 'rejected',
                'status-pending': log.type === 'pending' || log.status === 'pending'
              }">
                {{ log.type === 'approved' ? 'موافق' : log.type === 'rejected' ? 'مرفوض' : log.type || log.status || '—' }}
              </span>
            </p>
            <p v-if="log.adminMessage && log.adminMessage.includes('تم حذف الطلب')" style="color: #6c757d;">
              <strong>ملاحظة:</strong> {{ log.adminMessage }}
            </p>
            <p v-if="log.reason"><strong>سبب الرفض:</strong> {{ log.reason }}</p>
            <p v-if="log.adminMessage && !log.adminMessage.includes('تم حذف الطلب')"><strong>رسالة الأدمن:</strong> {{ log.adminMessage }}</p>
            <p class="muted">التاريخ: {{ formatDate(log.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal رفض مع سبب -->
    <div v-if="showRejectModal" class="modal-backdrop" @click.self="closeRejectModal">
      <div class="modal">
        <h3>سبب الرفض</h3>
        <p><strong>المبلغ:</strong> <span class="gold-text">{{ rejectModalData.amount }} USDT</span></p>
        <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ rejectModalData.userPhone || rejectModalData.phoneNumber || '—' }}</span></p>
        <p><strong>البريد:</strong> <span class="gold-text">{{ rejectModalData.email || rejectModalData.userEmail || '—' }}</span></p>
        <p><strong>النوع:</strong> {{ rejectType === 'recharge' ? 'تعبئة' : 'سحب' }}</p>
        
        <div class="input-box" style="margin-top: 15px;">
          <label>سبب الرفض (مطلوب 1-500 حرف)</label>
          <textarea 
            v-model="rejectReason" 
            placeholder="أدخل سبب الرفض..."
            rows="4"
            style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #D4AF37; background: #1A1F2A; color: white;"
          ></textarea>
          <div v-if="rejectError" style="color: #ff6b6b; font-size: 12px; margin-top: 5px;">
            {{ rejectError }}
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn red" type="button" @click="confirmReject" :disabled="processingId === rejectModalData.id">
            تأكيد الرفض
          </button>
          <button class="btn gold-outline" type="button" @click="closeRejectModal">إلغاء</button>
        </div>
      </div>
    </div>

    <!-- Modal موافقة مع رسالة -->
    <div v-if="showApproveModal" class="modal-backdrop" @click.self="closeApproveModal">
      <div class="modal">
        <h3>رسالة الموافقة</h3>
        <p><strong>المبلغ:</strong> <span class="gold-text">{{ approveModalData.amount }} USDT</span></p>
        <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ approveModalData.userPhone || approveModalData.phoneNumber || '—' }}</span></p>
        <p><strong>البريد:</strong> <span class="gold-text">{{ approveModalData.email || approveModalData.userEmail || '—' }}</span></p>
        <p><strong>النوع:</strong> {{ approveType === 'recharge' ? 'تعبئة' : 'سحب' }}</p>
        
        <div class="input-box" style="margin-top: 15px;">
          <label>رسالة للمستخدم (اختياري - 0-500 حرف)</label>
          <textarea 
            v-model="approveMessage" 
            placeholder="أدخل رسالة تهنئة أو تعليمات للمستخدم..."
            rows="4"
            style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #D4AF37; background: #1A1F2A; color: white;"
          ></textarea>
          <div v-if="approveError" style="color: #ff6b6b; font-size: 12px; margin-top: 5px;">
            {{ approveError }}
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn white-btn" type="button" @click="confirmApprove" :disabled="processingId === approveModalData.id">
            تأكيد الموافقة
          </button>
          <button class="btn gold-outline" type="button" @click="closeApproveModal">إلغاء</button>
        </div>
      </div>
    </div>

    <!-- Modal تفاصيل الطلب -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3>تفاصيل الطلب</h3>
        <p v-if="modalType === 'withdraw'"><strong>معرف المعاملة:</strong> <span class="gold-text">{{ modalData.transactionId || modalData.id || '—' }}</span></p>
        <p v-if="modalType === 'withdraw'"><strong>رقم الهاتف:</strong> <span class="gold-text">{{ modalData.userPhone || modalData.phoneNumber || '—' }}</span></p>
        <p v-if="modalType === 'withdraw'"><strong>البريد:</strong> <span class="gold-text">{{ modalData.email || modalData.userEmail }}</span></p>
        <p v-if="modalType === 'withdraw'"><strong>المبلغ:</strong> <span class="gold-text">{{ modalData.amount }} USDT</span></p>
        <p v-if="modalType === 'withdraw'"><strong>الشبكة:</strong> {{ modalData.network }}</p>
        <p v-if="modalType === 'withdraw'"><strong>المحفظة:</strong> {{ modalData.wallet || modalData.walletAddress }}</p>
        <p v-if="modalType === 'withdraw'"><strong>مستوى VIP:</strong> {{ modalData.vipLevel || '—' }}</p>
        <p v-if="modalType === 'withdraw'"><strong>المبلغ المحجوز:</strong> {{ modalData.lockedAmountAtWithdraw || '—' }} USDT</p>
        <p v-if="modalType === 'withdraw'"><strong>الرصيد المتاح:</strong> {{ modalData.availableBalanceAtWithdraw || '—' }} USDT</p>
        <p v-if="modalType === 'withdraw'"><strong>الحالة:</strong> 
          <span :class="{
            'status-approved': modalData.status === 'approved',
            'status-rejected': modalData.status === 'rejected',
            'status-pending': modalData.status === 'pending'
          }">
            {{ modalData.status === 'approved' ? 'موافق' : modalData.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة' }}
          </span>
        </p>
        <p v-if="modalData.reason"><strong>سبب الرفض:</strong> {{ modalData.reason }}</p>
        <p v-if="modalData.adminMessage"><strong>رسالة الأدمن:</strong> {{ modalData.adminMessage }}</p>
        <p v-if="modalData.userMessage"><strong>رسالة المستخدم:</strong> {{ modalData.userMessage }}</p>
        
        <p v-if="modalType === 'recharge'"><strong>رقم الهاتف:</strong> <span class="gold-text">{{ modalData.userPhone || modalData.phoneNumber || '—' }}</span></p>
        <p v-if="modalType === 'recharge'"><strong>البريد:</strong> <span class="gold-text">{{ modalData.email || modalData.userEmail }}</span></p>
        <p v-if="modalType === 'recharge'"><strong>المبلغ:</strong> <span class="gold-text">{{ modalData.amount }} USDT</span></p>
        <p v-if="modalType === 'recharge'"><strong>الشبكة:</strong> {{ modalData.network }}</p>
        <p v-if="modalType === 'recharge' && modalData.txid"><strong>TxID:</strong> <span class="gold-text">{{ modalData.txid }}</span></p>
        
        <p class="muted">تم الإنشاء: {{ formatDate(modalData.createdAt) }}</p>
        <div class="modal-actions">
          <button v-if="modalType === 'withdraw'" class="btn gold" type="button" @click.stop="openApproveModal(modalData, 'withdraw')" :disabled="processingId === modalData.id || modalData.status === 'approved'">موافقة</button>
          <button v-if="modalType === 'withdraw'" class="btn red" type="button" @click.stop="openRejectModal(modalData, 'withdraw')" :disabled="processingId === modalData.id || modalData.status === 'rejected'">رفض</button>
          <button v-if="modalType === 'withdraw'" class="btn black" type="button" @click.stop="deleteWithdraw(modalData)" :disabled="processingId === modalData.id">حذف</button>
          <button v-if="modalType === 'recharge'" class="btn gold" type="button" @click.stop="openApproveModal(modalData, 'recharge')" :disabled="processingId === modalData.id || modalData.status === 'approved'">موافقة</button>
          <button v-if="modalType === 'recharge'" class="btn red" type="button" @click.stop="openRejectModal(modalData, 'recharge')" :disabled="processingId === modalData.id || modalData.status === 'rejected'">رفض</button>
          <button v-if="modalType === 'recharge'" class="btn black" type="button" @click.stop="deleteRecharge(modalData)" :disabled="processingId === modalData.id">حذف</button>
          <button class="btn gold-outline" type="button" @click="closeModal">إغلاق</button>
        </div>
      </div>
    </div>

    <!-- Modal تفاصيل المستخدم (جميع مستويات الإحالة) -->
    <div v-if="showUserDetailsModal" class="modal-backdrop" @click.self="closeUserDetailsModal">
      <div class="modal">
        <h3>تفاصيل المستخدم - جميع مستويات الإحالة</h3>
        <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ userDetails.phoneNumber || '—' }}</span></p>
        <p><strong>البريد:</strong> <span class="gold-text">{{ userDetails.email || '—' }}</span></p>
        
        <div class="invited-by-info" v-if="userDetails.invitedBy">
          <h4>🔗 تمت الدعوة بواسطة</h4>
          <p><strong>البريد:</strong> <span class="gold-text">{{ userDetails.invitedByEmail || '—' }}</span></p>
          <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ userDetails.invitedByPhone || '—' }}</span></p>
        </div>
        <div class="invited-by-info" v-else>
          <h4>🔗 تمت الدعوة بواسطة</h4>
          <p class="empty-text">لم تتم دعوته من قبل أي مستخدم (حساب مباشر)</p>
        </div>

        <div class="referral-level">
          <h4>📊 المستوى الأول</h4>
          <p><strong>عدد الإحالات:</strong> <span class="gold-text">{{ userDetails.level1Count || 0 }}</span></p>
          <p><strong>العمولة:</strong> <span class="gold-text">15%</span></p>
          <p><strong>الدخل:</strong> <span class="gold-text">{{ userDetails.level1Earnings?.toFixed(2) || '0.00' }} USDT</span></p>
          <div v-if="userDetails.level1Users && userDetails.level1Users.length > 0" class="users-list">
            <div class="user-item" v-for="refUser in userDetails.level1Users" :key="refUser.id">
              <p><strong>البريد:</strong> <span class="gold-text">{{ refUser.email || '—' }}</span></p>
              <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ refUser.phoneNumber || '—' }}</span></p>
            </div>
          </div>
          <div v-else class="empty-text">لا توجد إحالات في هذا المستوى</div>
        </div>

        <div class="referral-level">
          <h4>📊 المستوى الثاني</h4>
          <p><strong>عدد الإحالات:</strong> <span class="gold-text">{{ userDetails.level2Count || 0 }}</span></p>
          <p><strong>العمولة:</strong> <span class="gold-text">10%</span></p>
          <p><strong>الدخل:</strong> <span class="gold-text">{{ userDetails.level2Earnings?.toFixed(2) || '0.00' }} USDT</span></p>
          <div v-if="userDetails.level2Users && userDetails.level2Users.length > 0" class="users-list">
            <div class="user-item" v-for="refUser in userDetails.level2Users" :key="refUser.id">
              <p><strong>البريد:</strong> <span class="gold-text">{{ refUser.email || '—' }}</span></p>
              <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ refUser.phoneNumber || '—' }}</span></p>
            </div>
          </div>
          <div v-else class="empty-text">لا توجد إحالات في هذا المستوى</div>
        </div>

        <div class="referral-level">
          <h4>📊 المستوى الثالث</h4>
          <p><strong>عدد الإحالات:</strong> <span class="gold-text">{{ userDetails.level3Count || 0 }}</span></p>
          <p><strong>العمولة:</strong> <span class="gold-text">5%</span></p>
          <p><strong>الدخل:</strong> <span class="gold-text">{{ userDetails.level3Earnings?.toFixed(2) || '0.00' }} USDT</span></p>
          <div v-if="userDetails.level3Users && userDetails.level3Users.length > 0" class="users-list">
            <div class="user-item" v-for="refUser in userDetails.level3Users" :key="refUser.id">
              <p><strong>البريد:</strong> <span class="gold-text">{{ refUser.email || '—' }}</span></p>
              <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ refUser.phoneNumber || '—' }}</span></p>
            </div>
          </div>
          <div v-else class="empty-text">لا توجد إحالات في هذا المستوى</div>
        </div>

        <div class="modal-actions">
          <button class="btn gold-outline" type="button" @click="closeUserDetailsModal">إغلاق</button>
        </div>
      </div>
    </div>

    <!-- Modal تفاصيل الحساب -->
    <div v-if="showAccountDetailsModal" class="modal-backdrop" @click.self="closeAccountDetailsModal">
      <div class="modal account-details-modal">
        <h3><i class="fas fa-user-circle"></i> تفاصيل الحساب</h3>
        
        <div class="account-details">
          <div class="detail-item">
            <label>البريد الإلكتروني:</label>
            <div class="detail-value gold-text">{{ accountDetails.email || '—' }}</div>
          </div>
          
          <div class="detail-item">
            <label>رقم الهاتف:</label>
            <div class="detail-value gold-text">{{ accountDetails.phoneNumber || '—' }}</div>
          </div>
          
          <div class="detail-item">
            <label>مستوى VIP:</label>
            <div class="detail-value">
              <span :class="getVipClass(accountDetails.vipLevel)" class="vip-badge">
                {{ getVipText(accountDetails.vipLevel) }}
              </span>
              <span v-if="accountDetails.vipExpiryDate" class="vip-expiry">
                (ينتهي: {{ formatDate(accountDetails.vipExpiryDate) }})
              </span>
            </div>
          </div>
          
          <div class="detail-item">
            <label>تاريخ التسجيل:</label>
            <div class="detail-value">{{ formatDate(accountDetails.createdAt) }}</div>
          </div>
          
          <div class="detail-item">
            <label>الرصيد الإجمالي:</label>
            <div class="detail-value gold-text">{{ formatBalance(accountDetails.balance) }} USDT</div>
          </div>
          
          <div class="detail-item" v-if="accountDetails.vipLockedAmount > 0">
            <label>مبلغ VIP المحجوز:</label>
            <div class="detail-value" style="color: #fbbf24;">{{ formatBalance(accountDetails.vipLockedAmount) }} USDT</div>
          </div>
          
          <div class="detail-item" v-if="accountDetails.vipLockedAmount > 0">
            <label>المتاح للسحب:</label>
            <div class="detail-value" style="color: #34d399;">{{ formatBalance(accountDetails.availableBalance) }} USDT</div>
          </div>
          
          <div class="detail-item">
            <label>حالة الحساب:</label>
            <div class="detail-value">
              <span :class="accountDetails.blocked ? 'status-rejected' : 'status-approved'">
                {{ accountDetails.blocked ? 'محظور' : 'فعال' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="account-buttons">
          <button class="btn gold" @click="showUserWithdrawHistory" type="button">
            📤 سجل السحوبات ({{ accountWithdrawHistory.length }})
          </button>
          <button class="btn gold" @click="showUserRechargeHistory" type="button">
            📥 سجل التعبئة ({{ accountRechargeHistory.length }})
          </button>
        </div>
        
        <div class="danger-zone">
          <h4 style="color: #dc3545; margin: 15px 0 10px 0; border-top: 2px solid #dc3545; padding-top: 15px;">
            ⚠️ منطقة الخطر - حذف سجل المستخدم
          </h4>
          <p style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 10px;">
            سيتم حذف جميع سجلات هذا المستخدم (السحوبات، التعبئة، المعاملات، الإشعارات، الإحالات) نهائياً.
            <br><strong style="color: #dc3545;">لا يمكن التراجع عن هذا الإجراء!</strong>
          </p>
          <button class="btn delete-all-logs-btn" type="button" @click="confirmDeleteAllUserLogs(accountDetails.userId)" :disabled="processingId === accountDetails.userId" style="width: 100%;">
            {{ processingId === accountDetails.userId ? 'جاري الحذف...' : '🗑️ حذف جميع سجلات المستخدم نهائياً' }}
          </button>
        </div>
        
        <div v-if="showWithdrawHistory" class="history-section">
          <h4>سجل السحوبات</h4>
          <div v-if="accountWithdrawHistory.length === 0" class="empty-text">لا توجد سحوبات</div>
          <div v-else class="history-list">
            <div v-for="item in accountWithdrawHistory" :key="item.id" class="history-item">
              <p><strong>المبلغ:</strong> <span class="gold-text">{{ item.amount }} USDT</span></p>
              <p><strong>الشبكة:</strong> {{ item.network || '—' }}</p>
              <p><strong>المحفظة:</strong> {{ item.wallet || item.walletAddress || '—' }}</p>
              <p><strong>الحالة:</strong> 
                <span :class="item.status === 'approved' || item.type === 'approved' ? 'status-approved' : 
                               item.status === 'rejected' || item.type === 'rejected' ? 'status-rejected' : 
                               'status-pending'">
                  {{ item.status === 'approved' || item.type === 'approved' ? 'موافق' : 
                     item.status === 'rejected' || item.type === 'rejected' ? 'مرفوض' : 
                     item.status || item.type || 'قيد المراجعة' }}
                </span>
              </p>
              <p v-if="item.adminMessage && item.adminMessage.includes('تم حذف الطلب')" style="color: #6c757d;">
                <strong>ملاحظة:</strong> {{ item.adminMessage }}
              </p>
              <p v-if="item.reason"><strong>السبب:</strong> {{ item.reason }}</p>
              <p v-if="item.adminMessage && !item.adminMessage.includes('تم حذف الطلب')"><strong>رسالة الأدمن:</strong> {{ item.adminMessage }}</p>
              <p class="muted">التاريخ: {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="showRechargeHistory" class="history-section">
          <h4>سجل التعبئة</h4>
          <div v-if="accountRechargeHistory.length === 0" class="empty-text">لا توجد تعبئات</div>
          <div v-else class="history-list">
            <div v-for="item in accountRechargeHistory" :key="item.id" class="history-item">
              <p><strong>المبلغ:</strong> <span class="gold-text">{{ item.amount }} USDT</span></p>
              <p><strong>الشبكة:</strong> {{ item.network || '—' }}</p>
              <p v-if="item.txid"><strong>TxID:</strong> <span class="gold-text">{{ item.txid }}</span></p>
              <p><strong>الحالة:</strong> 
                <span :class="{
                  'status-approved': item.type === 'approved' || item.status === 'approved',
                  'status-rejected': item.type === 'rejected' || item.status === 'rejected',
                  'status-pending': item.type === 'pending' || item.status === 'pending'
                }">
                  {{ item.type === 'approved' ? 'موافق' : item.type === 'rejected' ? 'مرفوض' : item.type || item.status || 'قيد المراجعة' }}
                </span>
              </p>
              <p v-if="item.adminMessage && item.adminMessage.includes('تم حذف الطلب')" style="color: #6c757d;">
                <strong>ملاحظة:</strong> {{ item.adminMessage }}
              </p>
              <p v-if="item.reason"><strong>سبب الرفض:</strong> {{ item.reason }}</p>
              <p v-if="item.adminMessage && !item.adminMessage.includes('تم حذف الطلب')"><strong>رسالة الأدمن:</strong> {{ item.adminMessage }}</p>
              <p class="muted">التاريخ: {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn gold-outline" type="button" @click="closeAccountDetailsModal">إغلاق</button>
        </div>
      </div>
    </div>

    <!-- Modal تعديل الرصيد -->
    <div v-if="showBalanceModal" class="modal-backdrop" @click.self="closeBalanceModal">
      <div class="modal">
        <h3>{{ balanceModalType === 'add' ? 'تعبئة رصيد' : 'خصم رصيد' }}</h3>
        <p><strong>المستخدم:</strong> <span class="gold-text">{{ balanceModalUser.email || balanceModalUser.phoneNumber || '—' }}</span></p>
        <p><strong>المبلغ:</strong> <span class="gold-text">{{ balanceModalAmount }} USDT</span></p>
        
        <div class="modal-actions">
          <button class="btn white-btn" type="button" @click="confirmBalanceChange">
            تأكيد {{ balanceModalType === 'add' ? 'التعبئة' : 'الخصم' }}
          </button>
          <button class="btn gold-outline" type="button" @click="closeBalanceModal">إلغاء</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  where,
  limit,
  setDoc,
  runTransaction
} from "firebase/firestore";
import { db } from "../firebase";

export default {
  name: "Admin",
  data() {
    return {
      activeTab: "withdraws",
      users: [],
      loadingUsers: true,
      userFilter: "",
      userSort: "email",
      withdraws: [],
      loadingWithdraws: true,
      withdrawFilter: "",
      withdrawSort: "newest",
      rechargeRequests: [],
      loadingRecharges: true,
      rechargeFilter: "",
      rechargeSort: "newest",
      rechargeUnsubscribe: null,
      allNotifications: [],
      loadingNotifs: false,
      notifFilter: "",
      withdrawLogs: [],
      loadingWithdrawLogs: false,
      withdrawLogFilter: "",
      withdrawLogSort: "newest",
      
      rechargeLogs: [],
      loadingRechargeLogs: false,
      rechargeLogFilter: "",
      rechargeLogSort: "newest",
      
      showModal: false,
      modalData: {},
      modalType: "withdraw",
      authChecked: false,
      adminEmails: [
        "azad.333388@gmail.com",
        "admin2@gmail.com",
        "owner@gmail.com",
      ],
      currentUser: null,
      processingId: null,

      showRejectModal: false,
      rejectModalData: {},
      rejectReason: "",
      rejectError: "",
      rejectType: "",

      showApproveModal: false,
      approveModalData: {},
      approveMessage: "",
      approveError: "",
      approveType: "",

      showUserDetailsModal: false,
      userDetails: {
        phoneNumber: "",
        email: "",
        invitedBy: null,
        invitedByEmail: "",
        invitedByPhone: "",
        level1Count: 0,
        level1Earnings: 0,
        level1Users: [],
        level2Count: 0,
        level2Earnings: 0,
        level2Users: [],
        level3Count: 0,
        level3Earnings: 0,
        level3Users: []
      },
      
      showAccountDetailsModal: false,
      accountDetails: {
        email: "",
        phoneNumber: "",
        vipLevel: "عادي",
        vipExpiryDate: null,
        createdAt: null,
        balance: 0,
        vipLockedAmount: 0,
        availableBalance: 0,
        blocked: false,
        userId: null
      },
      accountWithdrawHistory: [],
      accountRechargeHistory: [],
      showWithdrawHistory: false,
      showRechargeHistory: false,

      // Modal تعديل الرصيد
      showBalanceModal: false,
      balanceModalType: 'add',
      balanceModalUser: {},
      balanceModalAmount: 0
    };
  },
  computed: {
    filteredUsers() {
      let list = [...this.users];
      if (this.userFilter) {
        const f = this.userFilter.toLowerCase();
        list = list.filter((u) =>
          String(u.email || "").toLowerCase().includes(f) ||
          String(u.phoneNumber || "").toLowerCase().includes(f)
        );
      }
      
      switch (this.userSort) {
        case "balance_desc":
          list.sort((a, b) => (b.balance || 0) - (a.balance || 0));
          break;
        case "balance_asc":
          list.sort((a, b) => (a.balance || 0) - (b.balance || 0));
          break;
        case "phone":
          list.sort((a, b) => String(a.phoneNumber || "").localeCompare(String(b.phoneNumber || "")));
          break;
        case "date_desc":
          list.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
          break;
        case "date_asc":
          list.sort((a, b) => this.getTimeFromDate(a.createdAt) - this.getTimeFromDate(b.createdAt));
          break;
        case "email":
        default:
          list.sort((a, b) => String(a.email || "").localeCompare(String(b.email || "")));
          break;
      }
      
      return list;
    },
    filteredWithdraws() {
      let list = [...this.withdraws];
      if (this.withdrawFilter) {
        const f = this.withdrawFilter.toLowerCase();
        list = list.filter(
          (r) =>
            (r.userPhone || "").toLowerCase().includes(f) ||
            (r.userEmail || r.email || "").toLowerCase().includes(f) ||
            (r.wallet || r.walletAddress || "").toLowerCase().includes(f)
        );
      }
      if (this.withdrawSort === "newest")
        list.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
      else if (this.withdrawSort === "oldest")
        list.sort((a, b) => this.getTimeFromDate(a.createdAt) - this.getTimeFromDate(b.createdAt));
      else if (this.withdrawSort === "amount_desc")
        list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      else if (this.withdrawSort === "amount_asc")
        list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      return list;
    },
    filteredRechargeRequests() {
      let list = [...this.rechargeRequests];
      if (this.rechargeFilter) {
        const f = this.rechargeFilter.toLowerCase();
        list = list.filter(
          (r) =>
            (r.userPhone || "").toLowerCase().includes(f) ||
            (r.email || r.userEmail || "").toLowerCase().includes(f) ||
            (r.network || "").toLowerCase().includes(f) ||
            (String(r.amount || "") || "").includes(f) ||
            (r.status || "").toLowerCase().includes(f)
        );
      }
      if (this.rechargeSort === "newest")
        list.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
      else if (this.rechargeSort === "oldest")
        list.sort((a, b) => this.getTimeFromDate(a.createdAt) - this.getTimeFromDate(b.createdAt));
      else if (this.rechargeSort === "amount_desc")
        list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      else if (this.rechargeSort === "amount_asc")
        list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      else if (this.rechargeSort === "status_pending")
        list = list.filter((r) => (r.status || "pending") === "pending");
      else if (this.rechargeSort === "status_approved")
        list = list.filter((r) => (r.status || "") === "approved");
      else if (this.rechargeSort === "status_rejected")
        list = list.filter((r) => (r.status || "") === "rejected");
      return list;
    },
    filteredNotifications() {
      if (!this.notifFilter) return this.allNotifications;
      const f = this.notifFilter.toLowerCase();
      return this.allNotifications.filter(
        (n) =>
          (n.message || "").toLowerCase().includes(f) ||
          (n.title || "").toLowerCase().includes(f) ||
          (n.email || "").toLowerCase().includes(f)
      );
    },
    filteredWithdrawLogs() {
      let list = [...this.withdrawLogs];
      
      if (this.withdrawLogFilter) {
        const f = this.withdrawLogFilter.toLowerCase();
        list = list.filter(
          (l) =>
            String(l.amount || "").includes(f) ||
            (l.userPhone || "").toLowerCase().includes(f) ||
            (l.userEmail || l.email || "").toLowerCase().includes(f) ||
            (l.wallet || l.walletAddress || "").toLowerCase().includes(f)
        );
      }
      
      if (this.withdrawLogSort === "newest")
        list.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
      else if (this.withdrawLogSort === "oldest")
        list.sort((a, b) => this.getTimeFromDate(a.createdAt) - this.getTimeFromDate(b.createdAt));
      else if (this.withdrawLogSort === "amount_desc")
        list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      else if (this.withdrawLogSort === "amount_asc")
        list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      
      return list;
    },
    filteredRechargeLogs() {
      let list = [...this.rechargeLogs];
      
      if (this.rechargeLogFilter) {
        const f = this.rechargeLogFilter.toLowerCase();
        list = list.filter(
          (log) =>
            (log.userPhone || "").toLowerCase().includes(f) ||
            (log.email || log.userEmail || "").toLowerCase().includes(f) ||
            String(log.amount || "").includes(f) ||
            (log.type || log.status || "").toLowerCase().includes(f)
        );
      }
      
      if (this.rechargeLogSort === "newest")
        list.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
      else if (this.rechargeLogSort === "oldest")
        list.sort((a, b) => this.getTimeFromDate(a.createdAt) - this.getTimeFromDate(b.createdAt));
      else if (this.rechargeLogSort === "amount_desc")
        list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      else if (this.rechargeLogSort === "amount_asc")
        list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
      
      return list;
    }
  },
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      this.authChecked = true;
      this.currentUser = user || null;
      if (!user) return this.$router.replace("/login");
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;
        const isRoleAdmin =
          userData &&
          (userData.role === "admin" || userData.isAdmin === true);
        if (!isRoleAdmin && !this.adminEmails.includes(user.email)) {
          alert("غير مسموح بالدخول");
          return this.$router.replace("/403");
        }
      } catch (e) {
        console.error("admin check", e);
        return this.$router.replace("/403");
      }
      
      await this.loadAllData();
    });
  },
  beforeUnmount() {
    this.detachRechargeListener();
  },
  methods: {
    getTimeFromDate(date) {
      if (!date) return 0;
      if (date.seconds !== undefined) return date.seconds * 1000;
      if (typeof date.toMillis === 'function') return date.toMillis();
      return new Date(date).getTime();
    },
    
    async loadAllData() {
      await Promise.all([
        this.loadWithdrawRequests(),
        this.loadUsers(),
        this.loadWithdrawLogs(),
        this.loadRechargeRequests(),
        this.loadRechargeLogs()
      ]);
    },
    
    async loadUsers() {
      try {
        this.loadingUsers = true;
        const snap = await getDocs(collection(db, "users"));
        this.users = snap.docs.map((d) => {
          const data = d.data() || {};
          const createdAt = data.createdAt || data.registeredAt || null;
          
          let balance = 0;
          if (typeof data.balance === 'number') {
            balance = data.balance;
          } else if (typeof data.vipBalance === 'number') {
            balance = data.vipBalance + (data.depositBalance || 0);
          }
          
          const vipLockedAmount = data.vipLockedAmount || 0;
          const availableBalance = Math.max(0, balance - vipLockedAmount);
          
          return {
            id: d.id,
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            balance: balance,
            vipLockedAmount: vipLockedAmount,
            availableBalance: availableBalance,
            blocked: data.blocked ?? false,
            notificationsCount: data.notificationsCount ?? 0,
            registrationMethod: data.registrationMethod || (data.phoneNumber ? 'phone' : 'email'),
            createdAt: createdAt,
            vipLevel: data.vipLevel || "عادي",
            vipExpiryDate: data.vipExpiryDate || null
          };
        });
      } catch (e) {
        alert("خطأ عند تحميل المستخدمين");
      } finally {
        this.loadingUsers = false;
      }
    },
    
    promptRecharge(user) {
      const a = prompt("أدخل مبلغ التعبئة:");
      if (!a || isNaN(a)) return;
      this.balanceModalType = 'add';
      this.balanceModalUser = user;
      this.balanceModalAmount = Number(a);
      this.showBalanceModal = true;
    },
    
    promptDeduct(user) {
      const a = prompt("أدخل مبلغ الخصم:");
      if (!a || isNaN(a)) return;
      this.balanceModalType = 'deduct';
      this.balanceModalUser = user;
      this.balanceModalAmount = Number(a);
      this.showBalanceModal = true;
    },
    
    closeBalanceModal() {
      this.showBalanceModal = false;
      this.balanceModalUser = {};
      this.balanceModalAmount = 0;
    },
    
    async confirmBalanceChange() {
      if (!this.balanceModalAmount || this.balanceModalAmount <= 0) {
        alert("الرجاء إدخال مبلغ صحيح");
        return;
      }
      
      const userId = this.balanceModalUser.id;
      const amount = this.balanceModalAmount;
      const isAdd = this.balanceModalType === 'add';
      
      try {
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, "users", userId);
          const userSnap = await transaction.get(userRef);
          
          if (!userSnap.exists()) {
            throw new Error("المستخدم غير موجود");
          }
          
          const userData = userSnap.data();
          const currentBalance = userData.balance || 0;
          
          let newBalance;
          if (isAdd) {
            newBalance = currentBalance + amount;
          } else {
            if (currentBalance < amount) {
              throw new Error(`الرصيد غير كافٍ`);
            }
            newBalance = Math.max(0, currentBalance - amount);
          }
          
          transaction.update(userRef, { balance: newBalance });
        });
        
        await addDoc(collection(db, "transactions"), {
          userId: userId,
          userEmail: this.balanceModalUser.email || null,
          userPhone: this.balanceModalUser.phoneNumber || null,
          type: isAdd ? 'admin_recharge' : 'admin_deduct',
          amount: amount,
          currency: "USDT",
          status: "completed",
          adminEmail: this.currentUser?.email || "admin",
          createdAt: serverTimestamp()
        });
        
        alert(`✔ تم ${isAdd ? 'تعبئة' : 'خصم'} ${amount} USDT`);
        this.closeBalanceModal();
        this.loadUsers();
      } catch (e) {
        console.error("خطأ في تعديل الرصيد:", e);
        alert(e.message || "خطأ أثناء تعديل الرصيد");
      }
    },
    
    formatBalance(balance) {
      if (!balance && balance !== 0) return "0";
      return parseFloat(balance).toFixed(2);
    },
    
    async viewUserDetails(user) {
      try {
        this.showUserDetailsModal = true;
        this.userDetails = {
          phoneNumber: user.phoneNumber || "",
          email: user.email || "",
          invitedBy: null,
          invitedByEmail: "",
          invitedByPhone: "",
          level1Count: 0,
          level1Earnings: 0,
          level1Users: [],
          level2Count: 0,
          level2Earnings: 0,
          level2Users: [],
          level3Count: 0,
          level3Earnings: 0,
          level3Users: []
        };

        const userSnap = await getDoc(doc(db, "users", user.id));
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.invitedBy) {
            try {
              const inviterSnap = await getDoc(doc(db, "users", userData.invitedBy));
              if (inviterSnap.exists()) {
                const inviterData = inviterSnap.data();
                this.userDetails.invitedBy = userData.invitedBy;
                this.userDetails.invitedByEmail = inviterData.email || "";
                this.userDetails.invitedByPhone = inviterData.phoneNumber || "";
              }
            } catch (error) {
              console.error("Error fetching inviter data:", error);
            }
          }
        }

        const level1Query = query(
          collection(db, "users"),
          where("invitedBy", "==", user.id)
        );
        const level1Snap = await getDocs(level1Query);
        const level1Users = [];

        for (const docSnap of level1Snap.docs) {
          const refData = docSnap.data();
          const refId = docSnap.id;
          
          level1Users.push({
            id: refId,
            email: refData.email || "",
            phoneNumber: refData.phoneNumber || "",
            createdAt: refData.createdAt || refData.registeredAt || null
          });
        }

        this.userDetails.level1Count = level1Users.length;
        this.userDetails.level1Users = level1Users;

        // جلب أرباح المستوى 1
        try {
          const rewardsRef = collection(db, "referral_rewards");
          const q = query(rewardsRef, where("receiver", "==", user.id), where("level", "==", 1));
          const s = await getDocs(q);
          this.userDetails.level1Earnings = s.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
        } catch (e) {
          this.userDetails.level1Earnings = 0;
        }

        const level2Users = [];
        for (const level1User of level1Users) {
          const level2Query = query(
            collection(db, "users"),
            where("invitedBy", "==", level1User.id)
          );
          const level2Snap = await getDocs(level2Query);
          
          for (const docSnap of level2Snap.docs) {
            const refData = docSnap.data();
            const refId = docSnap.id;
            
            level2Users.push({
              id: refId,
              email: refData.email || "",
              phoneNumber: refData.phoneNumber || "",
              createdAt: refData.createdAt || refData.registeredAt || null,
              invitedByLevel1: level1User.id
            });
          }
        }

        this.userDetails.level2Count = level2Users.length;
        this.userDetails.level2Users = level2Users;

        try {
          const rewardsRef = collection(db, "referral_rewards");
          const q = query(rewardsRef, where("receiver", "==", user.id), where("level", "==", 2));
          const s = await getDocs(q);
          this.userDetails.level2Earnings = s.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
        } catch (e) {
          this.userDetails.level2Earnings = 0;
        }

        const level3Users = [];
        for (const level2User of level2Users) {
          const level3Query = query(
            collection(db, "users"),
            where("invitedBy", "==", level2User.id)
          );
          const level3Snap = await getDocs(level3Query);
          
          for (const docSnap of level3Snap.docs) {
            const refData = docSnap.data();
            const refId = docSnap.id;
            
            level3Users.push({
              id: refId,
              email: refData.email || "",
              phoneNumber: refData.phoneNumber || "",
              createdAt: refData.createdAt || refData.registeredAt || null,
              invitedByLevel2: level2User.id
            });
          }
        }

        this.userDetails.level3Count = level3Users.length;
        this.userDetails.level3Users = level3Users;

        try {
          const rewardsRef = collection(db, "referral_rewards");
          const q = query(rewardsRef, where("receiver", "==", user.id), where("level", "==", 3));
          const s = await getDocs(q);
          this.userDetails.level3Earnings = s.docs.reduce((sum, d) => sum + Number(d.data().amount || 0), 0);
        } catch (e) {
          this.userDetails.level3Earnings = 0;
        }

      } catch (error) {
        console.error("خطأ في جلب تفاصيل المستخدم:", error);
        alert("حدث خطأ في جلب تفاصيل المستخدم");
      }
    },

    closeUserDetailsModal() {
      this.showUserDetailsModal = false;
      this.userDetails = {
        phoneNumber: "",
        email: "",
        invitedBy: null,
        invitedByEmail: "",
        invitedByPhone: "",
        level1Count: 0,
        level1Earnings: 0,
        level1Users: [],
        level2Count: 0,
        level2Earnings: 0,
        level2Users: [],
        level3Count: 0,
        level3Earnings: 0,
        level3Users: []
      };
    },

    openApproveModal(data, type) {
      this.approveModalData = data;
      this.approveType = type;
      this.approveMessage = "";
      this.approveError = "";
      this.showApproveModal = true;
      this.showModal = false;
    },

    closeApproveModal() {
      this.showApproveModal = false;
      this.approveModalData = {};
      this.approveMessage = "";
      this.approveError = "";
    },

    validateApproveMessage() {
      if (this.approveMessage.length > 500) {
        this.approveError = "الرسالة يجب أن تكون أقل من 500 حرف";
        return false;
      }
      this.approveError = "";
      return true;
    },

    async confirmApprove() {
      if (!this.validateApproveMessage()) return;

      if (this.approveType === 'recharge') {
        await this.approveRechargeWithMessage(this.approveModalData, this.approveMessage);
      } else if (this.approveType === 'withdraw') {
        await this.approveWithdrawWithMessage(this.approveModalData, this.approveMessage);
      }
    },

    openRejectModal(data, type) {
      this.rejectModalData = data;
      this.rejectType = type;
      this.rejectReason = "";
      this.rejectError = "";
      this.showRejectModal = true;
      this.showModal = false;
    },

    closeRejectModal() {
      this.showRejectModal = false;
      this.rejectModalData = {};
      this.rejectReason = "";
      this.rejectError = "";
    },

    validateRejectReason() {
      if (!this.rejectReason || this.rejectReason.trim() === "") {
        this.rejectError = "يجب إدخال سبب الرفض";
        return false;
      }
      if (this.rejectReason.length < 1 || this.rejectReason.length > 500) {
        this.rejectError = "سبب الرفض يجب أن يكون بين 1 و 500 حرف";
        return false;
      }
      this.rejectError = "";
      return true;
    },

    async confirmReject() {
      if (!this.validateRejectReason()) return;

      if (this.rejectType === 'recharge') {
        await this.rejectRecharge(this.rejectModalData, this.rejectReason);
      } else if (this.rejectType === 'withdraw') {
        await this.rejectWithdraw(this.rejectModalData, this.rejectReason);
      }
    },

    async logout() {
      try {
        const auth = getAuth();
        await auth.signOut();
        this.$router.replace("/login");
      } catch (e) {
        alert("خطأ أثناء تسجيل الخروج");
      }
    },
    
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === "withdraws" && this.withdraws.length === 0) {
        this.loadWithdrawRequests();
      } else if (tab === "users" && this.users.length === 0) {
        this.loadUsers();
      } else if (tab === "notifications" && this.allNotifications.length === 0) {
        this.loadAllNotifications();
      } else if (tab === "withdrawLogs" && this.withdrawLogs.length === 0) {
        this.loadWithdrawLogs();
      } else if (tab === "recharges" && this.rechargeRequests.length === 0) {
        this.reloadRechargeRequests();
      } else if (tab === "rechargeLogs" && this.rechargeLogs.length === 0) {
        this.loadRechargeLogs();
      }
    },
    
    async sendResetPassword(email) {
      try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        alert("تم إرسال رابط إعادة التعيين");
      } catch (e) {
        alert("خطأ أثناء إرسال الرابط");
      }
    },
    
    async toggleBlockUser(user) {
      try {
        await updateDoc(doc(db, "users", user.id), {
          blocked: !user.blocked,
        });
        alert("✔ تم تحديث الحالة");
        this.loadUsers();
      } catch (e) {
        alert("خطأ أثناء تحديث الحالة");
      }
    },
    
    async viewUserNotifications(user) {
      await this.loadNotificationsForUser(user.id);
      this.activeTab = "notifications";
    },
    
    async loadWithdrawRequests() {
      try {
        this.loadingWithdraws = true;
        // جلب جميع طلبات السحب من withdraw_requests
        const snap = await getDocs(collection(db, "withdraw_requests"));
        this.withdraws = snap.docs.map((d) => {
          const data = d.data() || {};
          let createdAt = Date.now();
          if (data.createdAt) {
            if (typeof data.createdAt === "number") createdAt = data.createdAt;
            else if (data.createdAt.toMillis) createdAt = data.createdAt.toMillis();
          }
          return {
            id: d.id,
            transactionId: data.transactionId || null,
            userId: data.userId,
            userPhone: data.userPhone || null,
            userEmail: data.userEmail || data.email,
            email: data.userEmail || data.email,
            amount: data.amount || 0,
            network: data.network || "",
            wallet: data.wallet || data.walletAddress || "",
            walletAddress: data.walletAddress || data.wallet || "",
            status: data.status || "pending",
            vipLevel: data.vipLevel || "",
            withdrawDay: data.withdrawDay || "",
            adminAction: data.adminAction || "",
            adminMessage: data.adminMessage || "",
            userMessage: data.userMessage || "",
            reason: data.reason || "",
            lockedAmountAtWithdraw: data.lockedAmountAtWithdraw || 0,
            availableBalanceAtWithdraw: data.availableBalanceAtWithdraw || 0,
            createdAt,
            processedAt: data.processedAt || null,
            approvedAt: data.approvedAt || null
          };
        });
        console.log(`✅ تم تحميل ${this.withdraws.length} طلب سحب من withdraw_requests`);
      } catch (e) {
        console.error("خطأ عند تحميل طلبات السحب:", e);
        alert("خطأ عند تحميل طلبات السحب: " + e.message);
      } finally {
        this.loadingWithdraws = false;
      }
    },
    
    viewWithdrawDetails(req) {
      this.modalData = req || {};
      this.modalType = "withdraw";
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.modalData = {};
      this.modalType = "withdraw";
    },
    
    async ensureAdmin() {
      try {
        const auth = getAuth();
        const user = auth.currentUser || this.currentUser;
        if (!user) return false;
        const d = await getDoc(doc(db, "users", user.uid));
        const u = d.exists() ? d.data() : null;
        if (u && (u.role === "admin" || u.isAdmin === true)) return true;
        if (this.adminEmails.includes(user.email)) return true;
        return false;
      } catch (e) {
        return false;
      }
    },
    
    async createTransactionForUser(userId, email, phoneNumber, type, amount, status, reason = "", adminMessage = "", network = "", wallet = "", vipLevel = "", withdrawDay = "") {
      try {
        const transactionData = {
          transactionId: "TRX" + Date.now() + Math.random().toString(36).substring(2, 9),
          userId: userId,
          userPhone: phoneNumber || null,
          userEmail: email || null,
          type: type,
          amount: amount,
          currency: "USDT",
          status: status,
          adminAction: status === "approved" ? "approved" : status === "rejected" ? "rejected" : "",
          userMessage: status === "approved" ? "تمت الموافقة على طلبك" : 
                      status === "rejected" ? "تم رفض طلبك" : "",
          reason: reason,
          adminMessage: adminMessage,
          network: network,
          wallet: wallet,
          walletAddress: wallet,
          vipLevel: vipLevel,
          withdrawDay: withdrawDay,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        if (status === "approved") {
          transactionData.approvedAt = serverTimestamp();
        } else if (status === "rejected") {
          transactionData.rejectedAt = serverTimestamp();
        }

        await addDoc(collection(db, "transactions"), transactionData);
        console.log("✅ تم إنشاء معاملة جديدة للمستخدم:", userId);
        return true;
      } catch (error) {
        console.error("❌ خطأ في إنشاء المعاملة:", error);
        return false;
      }
    },

    async approveWithdrawWithMessage(req, message = "") {
      if (!req || !req.id) return;
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      if (!confirm(`تأكيد الموافقة على ${req.amount} USDT؟`)) return;
      this.processingId = req.id;
      
      try {
        // تحديث حالة طلب السحب في withdraw_requests
        const r = doc(db, "withdraw_requests", req.id);
        await updateDoc(r, { 
          status: "approved",
          adminAction: "approved",
          adminMessage: message || "",
          processedAt: serverTimestamp(),
          approvedAt: serverTimestamp()
        });
        console.log("✅ تم تحديث حالة طلب السحب إلى approved");
        
        // العمليات الفرعية - كل منها في try-catch منفصل
        
        // 1. إنشاء سجل في withdraw_logs
        try {
          await addDoc(collection(db, "withdraw_logs"), {
            userId: req.userId || null,
            userPhone: req.userPhone || null,
            email: req.userEmail || req.email || null,
            amount: req.amount || 0,
            type: "approved",
            adminMessage: message || "",
            network: req.network,
            wallet: req.wallet || req.walletAddress,
            vipLevel: req.vipLevel,
            withdrawDay: req.withdrawDay,
            createdAt: serverTimestamp(),
          });
          console.log("✅ تم إنشاء سجل في withdraw_logs");
        } catch (e) {
          console.warn("⚠️ فشل إنشاء سجل في withdraw_logs:", e);
        }
        
        // 2. إنشاء معاملة
        if (req.userId) {
          try {
            await this.createTransactionForUser(
              req.userId,
              req.userEmail || req.email,
              req.userPhone,
              "withdraw",
              req.amount,
              "approved",
              "",
              message || "تمت الموافقة على طلب السحب",
              req.network,
              req.wallet || req.walletAddress,
              req.vipLevel,
              req.withdrawDay
            );
            console.log("✅ تم إنشاء المعاملة");
          } catch (e) {
            console.warn("⚠️ فشل إنشاء المعاملة:", e);
          }
        }
        
        // 3. إرسال إشعار للمستخدم
        if (req.userId) {
          try {
            const notificationMessage = message 
              ? `تم تحويل ${req.amount} USDT. ${message}`
              : `تم تحويل ${req.amount} USDT.`;
              
            await addDoc(
              collection(db, "users", req.userId, "notifications"),
              {
                title: "تمت الموافقة على السحب",
                message: notificationMessage,
                read: false,
                createdAt: serverTimestamp(),
              }
            );
            console.log("✅ تم إرسال الإشعار");
          } catch (e) {
            console.warn("⚠️ فشل إرسال الإشعار:", e);
          }
        }
        
        alert("✔ تمت الموافقة بنجاح");
        await this.loadWithdrawRequests();
        await this.loadWithdrawLogs();
        
      } catch (e) {
        console.error("❌ خطأ في الموافقة:", e);
        alert("خطأ في الموافقة: " + e.message);
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeApproveModal();
      }
    },
    
    async approveRechargeWithMessage(r, message = "") {
      if (!r || !r.id) return;
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      if (!confirm(`تأكيد الموافقة على تعبئة ${r.amount} USDT للمستخدم ${r.userEmail || r.email || r.userId || ''}?`)) return;
      this.processingId = r.id;
      
      try {
        // العملية الرئيسية: تحديث حالة الدفع
        const pRef = doc(db, "payments", r.id);
        await updateDoc(pRef, { 
          status: "approved", 
          processedAt: serverTimestamp(),
          adminMessage: message || ""
        });
        console.log("✅ تم تحديث حالة الدفع إلى approved");
        
        // العمليات الفرعية - كل منها في try-catch منفصل
        
        // 1. تحديث رصيد المستخدم
        if (r.userId) {
          try {
            const userRef = doc(db, "users", r.userId);
            await runTransaction(db, async (transaction) => {
              const uSnap = await transaction.get(userRef);
              if (uSnap.exists()) {
                const userData = uSnap.data();
                const currentBalance = userData.balance || 0;
                transaction.update(userRef, { 
                  balance: currentBalance + Number(r.amount || 0) 
                });
              }
            });
            console.log("✅ تم تحديث رصيد المستخدم");
          } catch (err) {
            console.warn("⚠️ فشل تحديث رصيد المستخدم:", err);
          }
        }
        
        // 2. حساب أرباح الإحالة
        if (r.userId) {
          try {
            await this.calculateAndAddReferralEarnings(r.userId, r.amount, r.id);
            console.log("✅ تم حساب أرباح الإحالة");
          } catch (err) {
            console.warn("⚠️ فشل حساب أرباح الإحالة:", err);
          }
        }
        
        // 3. إنشاء سجل في recharge_logs
        try {
          let userPhone = r.userPhone || r.phoneNumber;
          if (!userPhone && r.userId) {
            try {
              const userSnap = await getDoc(doc(db, "users", r.userId));
              if (userSnap.exists()) {
                userPhone = userSnap.data().phoneNumber || null;
              }
            } catch (err) {
              console.warn("⚠️ فشل جلب رقم الهاتف:", err);
            }
          }
          
          await addDoc(collection(db, "recharge_logs"), {
            userId: r.userId || null,
            userPhone: userPhone || null,
            email: r.userEmail || r.email || null,
            amount: r.amount || 0,
            type: "approved",
            adminMessage: message || "",
            network: r.network,
            txid: r.txid,
            createdAt: serverTimestamp(),
          });
          console.log("✅ تم إنشاء سجل في recharge_logs");
        } catch (e) {
          console.warn("⚠️ فشل إنشاء سجل في recharge_logs:", e);
        }
        
        // 4. إنشاء معاملة
        if (r.userId) {
          try {
            let userPhone = r.userPhone || r.phoneNumber;
            if (!userPhone) {
              try {
                const userSnap = await getDoc(doc(db, "users", r.userId));
                if (userSnap.exists()) {
                  userPhone = userSnap.data().phoneNumber || null;
                }
              } catch (err) {}
            }
            
            await this.createTransactionForUser(
              r.userId,
              r.userEmail || r.email,
              userPhone,
              "recharge",
              r.amount,
              "approved",
              "",
              message || "تمت الموافقة على طلب التعبئة",
              r.network,
              "",
              "",
              ""
            );
            console.log("✅ تم إنشاء المعاملة");
          } catch (e) {
            console.warn("⚠️ فشل إنشاء المعاملة:", e);
          }
        }
        
        // 5. إرسال إشعار للمستخدم
        if (r.userId) {
          try {
            const notificationMessage = message 
              ? `تمت إضافة ${r.amount} USDT إلى رصيدك. ${message}`
              : `تمت إضافة ${r.amount} USDT إلى رصيدك. شكراً لك.`;
              
            await addDoc(collection(db, "users", r.userId, "notifications"), {
              title: "تمت الموافقة على طلب التعبئة",
              message: notificationMessage,
              read: false,
              createdAt: serverTimestamp(),
            });
            console.log("✅ تم إرسال الإشعار");
          } catch (e) {
            console.warn("⚠️ فشل إرسال الإشعار:", e);
          }
        }
        
        alert("✔ تمت الموافقة على طلب التعبئة وتمت إضافة المبلغ إلى الرصيد");
        
      } catch (e) {
        console.error("❌ approveRecharge error:", e);
        alert("خطأ أثناء الموافقة على الطلب");
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeApproveModal();
        // تحديث البيانات
        await this.reloadRechargeRequests();
        await this.loadRechargeLogs();
        await this.loadUsers();
      }
    },

    async rejectWithdraw(req, reason = "") {
      if (!req || !req.id) return;
      
      if (!reason) {
        this.openRejectModal(req, 'withdraw');
        return;
      }
      
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح");
      if (!confirm(`تأكيد رفض سحب ${req.amount}؟`)) return;
      this.processingId = req.id;
      
      try {
        // تحديث حالة طلب السحب في withdraw_requests
        const r = doc(db, "withdraw_requests", req.id);
        await updateDoc(r, { 
          status: "rejected",
          adminAction: "rejected",
          reason: reason,
          adminMessage: reason,
          processedAt: serverTimestamp()
        });
        console.log("✅ تم تحديث حالة طلب السحب إلى rejected");
        
        // العمليات الفرعية - كل منها في try-catch منفصل
        
        // 1. إرجاع الرصيد للمستخدم
        if (req.userId && req.amount) {
          try {
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, "users", req.userId);
              const uSnap = await transaction.get(userRef);
              if (uSnap.exists()) {
                const userData = uSnap.data();
                const currentBalance = userData.balance || 0;
                transaction.update(userRef, {
                  balance: currentBalance + Number(req.amount)
                });
              }
            });
            console.log(`✅ تم إرجاع ${req.amount} USDT للمستخدم ${req.userId}`);
          } catch (err) {
            console.warn("⚠️ فشل إرجاع الرصيد:", err);
          }
        }
        
        // 2. إنشاء سجل في withdraw_logs
        try {
          await addDoc(collection(db, "withdraw_logs"), {
            userId: req.userId || null,
            userPhone: req.userPhone || null,
            email: req.userEmail || req.email || null,
            amount: req.amount || 0,
            type: "rejected",
            reason: reason,
            network: req.network,
            wallet: req.wallet || req.walletAddress,
            vipLevel: req.vipLevel,
            withdrawDay: req.withdrawDay,
            createdAt: serverTimestamp(),
          });
          console.log("✅ تم إنشاء سجل في withdraw_logs");
        } catch (e) {
          console.warn("⚠️ فشل إنشاء سجل في withdraw_logs:", e);
        }
        
        // 3. إنشاء معاملة
        if (req.userId) {
          try {
            await this.createTransactionForUser(
              req.userId,
              req.userEmail || req.email,
              req.userPhone,
              "withdraw",
              req.amount,
              "rejected",
              reason,
              "تم رفض طلب السحب",
              req.network,
              req.wallet || req.walletAddress,
              req.vipLevel,
              req.withdrawDay
            );
            console.log("✅ تم إنشاء المعاملة");
          } catch (e) {
            console.warn("⚠️ فشل إنشاء المعاملة:", e);
          }
        }
        
        // 4. إرسال إشعار للمستخدم
        if (req.userId) {
          try {
            await addDoc(
              collection(db, "users", req.userId, "notifications"),
              {
                title: "تم رفض طلب السحب",
                message: `تم رفض سحب ${req.amount} USDT. السبب: ${reason}. تم إرجاع المبلغ إلى رصيدك.`,
                read: false,
                createdAt: serverTimestamp(),
              }
            );
            console.log("✅ تم إرسال الإشعار");
          } catch (e) {
            console.warn("⚠️ فشل إرسال الإشعار:", e);
          }
        }
        
        alert("❌ تم الرفض وإرجاع الرصيد");
        await this.loadWithdrawRequests();
        await this.loadWithdrawLogs();
        
      } catch (e) {
        console.error("❌ خطأ في رفض الطلب:", e);
        alert("خطأ في رفض الطلب: " + e.message);
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeRejectModal();
      }
    },
    
    async deleteWithdraw(req) {
      if (!req || !req.id) return;
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      if (!confirm(`هل أنت متأكد أنك تريد حذف طلب السحب بقيمة ${req.amount} USDT نهائياً؟`)) return;
      this.processingId = req.id;
      try {
        // حذف طلب السحب من withdraw_requests
        await deleteDoc(doc(db, "withdraw_requests", req.id));
        
        // إضافة سجل في withdraw_logs مع الحفاظ على الحالة الأصلية
        await addDoc(collection(db, "withdraw_logs"), {
          userId: req.userId || null,
          userPhone: req.userPhone || null,
          email: req.userEmail || req.email || null,
          amount: req.amount || 0,
          type: req.status || "pending",
          status: req.status || "pending",
          network: req.network,
          wallet: req.wallet || req.walletAddress,
          vipLevel: req.vipLevel,
          withdrawDay: req.withdrawDay,
          adminMessage: "تم حذف الطلب بواسطة الأدمن (تم الإلغاء من قبل الإدارة)",
          createdAt: serverTimestamp(),
          transactionId: req.transactionId || null,
          originalStatus: req.status || "pending",
          deletedByAdmin: true,
          deletedAt: serverTimestamp()
        });
        
        // إضافة إشعار للمستخدم
        if (req.userId) {
          try {
            await addDoc(
              collection(db, "users", req.userId, "notifications"),
              {
                title: "⚠️ تم إلغاء طلب السحب",
                message: `تم إلغاء طلب سحب ${req.amount} USDT بواسطة الإدارة.`,
                read: false,
                createdAt: serverTimestamp(),
              }
            );
          } catch (e) {
            console.warn("⚠️ فشل إرسال الإشعار:", e);
          }
        }
        
        alert("✅ تم حذف طلب السحب بنجاح");
        await this.loadWithdrawRequests();
        await this.loadWithdrawLogs();
      } catch (e) {
        console.error("deleteWithdraw error:", e);
        alert("❌ خطأ أثناء حذف الطلب: " + e.message);
      } finally {
        this.processingId = null;
        this.closeModal();
      }
    },
    
    async loadAllNotifications() {
      try {
        this.loadingNotifs = true;
        const snap = await getDocs(collection(db, "notifications"));
        this.allNotifications = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
      } catch (e) {
        this.allNotifications = [];
      } finally {
        this.loadingNotifs = false;
      }
    },
    
    async loadNotificationsForUser(id) {
      try {
        this.loadingNotifs = true;
        const snap = await getDocs(
          collection(db, "users", id, "notifications")
        );
        this.allNotifications = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          userId: id,
        }));
      } catch (e) {
        this.allNotifications = [];
      } finally {
        this.loadingNotifs = false;
      }
    },
    
    async loadWithdrawLogs() {
      try {
        this.loadingWithdrawLogs = true;
        let allLogs = [];
        
        // 1. جلب من withdraw_requests (الطلبات الموجودة)
        try {
          const snap = await getDocs(collection(db, "withdraw_requests"));
          const logs = snap.docs.map((d) => {
            const data = d.data() || {};
            let createdAt = Date.now();
            if (data.createdAt) {
              if (typeof data.createdAt === "number") createdAt = data.createdAt;
              else if (data.createdAt.toMillis) createdAt = data.createdAt.toMillis();
            }
            return {
              id: d.id,
              transactionId: data.transactionId || null,
              userId: data.userId || null,
              userPhone: data.userPhone || null,
              userEmail: data.userEmail || data.email || null,
              email: data.userEmail || data.email || null,
              amount: data.amount || 0,
              network: data.network || "",
              wallet: data.wallet || data.walletAddress || "",
              walletAddress: data.walletAddress || data.wallet || "",
              status: data.status || "pending",
              type: data.status || "pending",
              vipLevel: data.vipLevel || "",
              withdrawDay: data.withdrawDay || "",
              adminAction: data.adminAction || "",
              adminMessage: data.adminMessage || "",
              userMessage: data.userMessage || "",
              reason: data.reason || "",
              lockedAmountAtWithdraw: data.lockedAmountAtWithdraw || 0,
              availableBalanceAtWithdraw: data.availableBalanceAtWithdraw || 0,
              createdAt,
              processedAt: data.processedAt || null,
              approvedAt: data.approvedAt || null
            };
          });
          allLogs = [...allLogs, ...logs];
        } catch (e) {
          console.warn("⚠️ فشل جلب من withdraw_requests:", e);
        }
        
        // 2. جلب من withdraw_logs (بما فيها المحذوفة)
        try {
          const logsSnap = await getDocs(collection(db, "withdraw_logs"));
          const logs = logsSnap.docs.map((d) => {
            const data = d.data() || {};
            let createdAt = Date.now();
            if (data.createdAt) {
              if (typeof data.createdAt === "number") createdAt = data.createdAt;
              else if (data.createdAt.toMillis) createdAt = data.createdAt.toMillis();
            }
            return {
              id: d.id,
              transactionId: data.transactionId || null,
              userId: data.userId || null,
              userPhone: data.userPhone || null,
              userEmail: data.email || data.userEmail || null,
              email: data.email || data.userEmail || null,
              amount: data.amount || 0,
              network: data.network || "",
              wallet: data.wallet || "",
              walletAddress: data.wallet || "",
              status: data.status || data.type || "pending",
              type: data.type || data.status || "pending",
              vipLevel: data.vipLevel || "",
              withdrawDay: data.withdrawDay || "",
              adminAction: data.adminAction || "",
              adminMessage: data.adminMessage || "",
              userMessage: data.userMessage || "",
              reason: data.reason || "",
              lockedAmountAtWithdraw: data.lockedAmountAtWithdraw || 0,
              availableBalanceAtWithdraw: data.availableBalanceAtWithdraw || 0,
              createdAt,
              processedAt: data.processedAt || null,
              approvedAt: data.approvedAt || null,
              deletedByAdmin: data.deletedByAdmin || false
            };
          });
          allLogs = [...allLogs, ...logs];
        } catch (e) {
          console.warn("⚠️ فشل جلب من withdraw_logs:", e);
        }
        
        // ترتيب السجلات حسب التاريخ (الأحدث أولاً)
        allLogs.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
        
        this.withdrawLogs = allLogs;
        console.log(`✅ تم تحميل ${this.withdrawLogs.length} سجل سحب`);
      } catch (e) {
        console.error("خطأ عند تحميل سجل السحوبات:", e);
        this.withdrawLogs = [];
      } finally {
        this.loadingWithdrawLogs = false;
      }
    },
    
    async loadRechargeLogs() {
      try {
        this.loadingRechargeLogs = true;
        
        try {
          const rechargeLogsSnap = await getDocs(query(
            collection(db, "recharge_logs"),
            orderBy("createdAt", "desc")
          ));
          
          this.rechargeLogs = rechargeLogsSnap.docs.map((d) => {
            const data = d.data() || {};
            return {
              id: d.id,
              type: data.type || data.status || '',
              status: data.status || data.type || '',
              amount: data.amount || 0,
              userPhone: data.userPhone || null,
              email: data.email || data.userEmail || '',
              userEmail: data.userEmail || data.email || '',
              reason: data.reason || '',
              adminMessage: data.adminMessage || '',
              network: data.network || '',
              txid: data.txid || '',
              createdAt: data.createdAt,
              deletedByAdmin: data.deletedByAdmin || false
            };
          });
          
          if (this.rechargeLogs.length > 0) {
            console.log(`✅ تم تحميل ${this.rechargeLogs.length} سجل تعبئة من recharge_logs`);
            return;
          }
        } catch (err) {
          console.log("⚠ لا يوجد collection recharge_logs، جارٍ البحث في transactions...");
        }
        
        try {
          const transactionsSnap = await getDocs(query(
            collection(db, "transactions"),
            where("type", "==", "recharge"),
            orderBy("createdAt", "desc")
          ));
          
          this.rechargeLogs = transactionsSnap.docs.map((d) => {
            const data = d.data() || {};
            return {
              id: d.id,
              type: data.status || '',
              status: data.status || '',
              amount: data.amount || 0,
              userPhone: data.userPhone || null,
              email: data.userEmail || '',
              userEmail: data.userEmail || '',
              reason: data.reason || '',
              adminMessage: data.adminMessage || '',
              network: data.network || '',
              txid: data.txid || '',
              createdAt: data.createdAt,
              deletedByAdmin: false
            };
          });
          
          console.log(`✅ تم تحميل ${this.rechargeLogs.length} سجل تعبئة من transactions`);
          
        } catch (err) {
          console.error("❌ خطأ في تحميل سجلات التعبئة:", err);
          this.rechargeLogs = [];
        }
        
      } catch (e) {
        console.error("خطأ عام في تحميل سجلات التعبئة:", e);
        this.rechargeLogs = [];
      } finally {
        this.loadingRechargeLogs = false;
      }
    },
    
    formatDate(ts) {
      if (!ts) return "-";
      try {
        if (ts.toMillis) ts = ts.toMillis();
        return new Date(Number(ts)).toLocaleString("ar-EG");
      } catch {
        return String(ts);
      }
    },
    
    async reloadRechargeRequests() {
      this.loadingRecharges = true;
      try {
        const snap = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc")));
        this.rechargeRequests = snap.docs.map((d) => {
          const data = d.data() || {};
          let createdAt = Date.now();
          if (data.createdAt) {
            if (typeof data.createdAt === "number") createdAt = data.createdAt;
            else if (data.createdAt.toMillis) createdAt = data.createdAt.toMillis();
          }
          return {
            id: d.id,
            userId: data.userId || null,
            userPhone: data.userPhone || data.phoneNumber || null,
            userEmail: data.email || data.userEmail || "",
            email: data.email || data.userEmail || "",
            amount: data.amount || 0,
            network: data.network || "",
            txid: data.txid || "",
            proofURL: data.proofURL || null,
            status: data.status || "pending",
            createdAt,
          };
        });
      } catch (e) {
        console.error("reloadRechargeRequests error:", e);
      } finally {
        this.loadingRecharges = false;
      }
    },
    
    viewRechargeDetails(r) {
      this.modalData = r || {};
      this.modalType = "recharge";
      this.showModal = true;
    },
    
    async markAllRechargeNotificationsRead() {
      alert("تم وضع إشعارات التعبئة كمقروءة (محلياً).");
    },

    async calculateAndAddReferralEarnings(userId, amount, rechargeId) {
      try {
        console.log(`🔗 بدء حساب أرباح الإحالة للمستخدم: ${userId}, المبلغ: ${amount}`);
        
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          console.log("❌ المستخدم غير موجود");
          return;
        }
        
        const userData = userSnap.data();
        const userEmail = userData.email || "";
        const userPhone = userData.phoneNumber || "";
        
        const commissionRates = {
          level1: 15,
          level2: 10,
          level3: 5,
        };
        
        if (userData.invitedBy) {
          try {
            const level1Ref = doc(db, "users", userData.invitedBy);
            const level1Snap = await getDoc(level1Ref);
            
            if (level1Snap.exists()) {
              const level1Data = level1Snap.data();
              const level1Amount = (amount * commissionRates.level1) / 100;
              const newBalance = (level1Data.balance || 0) + level1Amount;
              
              await updateDoc(level1Ref, { balance: newBalance });
              
              await addDoc(collection(db, "referral_rewards"), {
                receiver: userData.invitedBy,
                fromUser: userId,
                amount: level1Amount,
                level: 1,
                createdAt: serverTimestamp()
              });
              
              await addDoc(collection(db, "transactions"), {
                transactionId: "REF" + Date.now() + Math.random().toString(36).substr(2, 5),
                userId: userData.invitedBy,
                userPhone: userPhone,
                userEmail: userEmail,
                type: "referral_commission",
                amount: level1Amount,
                currency: "USDT",
                status: "completed",
                details: {
                  fromUserId: userId,
                  fromEmail: userEmail,
                  fromPhone: userPhone,
                  level: 1,
                  percentage: commissionRates.level1,
                  baseAmount: amount,
                  rechargeId: rechargeId,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              
              await addDoc(collection(db, "users", userData.invitedBy, "notifications"), {
                title: "💰 عمولة إحالة جديدة",
                message: `لقد حصلت على عمولة إحالة بقيمة ${level1Amount} USDT (${commissionRates.level1}%) من ${userPhone || userEmail}`,
                read: false,
                createdAt: serverTimestamp(),
              });
              
              console.log(`✅ إضافة ${level1Amount} USDT (${commissionRates.level1}%) للمستوى الأول إلى balance: ${level1Data.email}`);
            }
          } catch (error) {
            console.error("❌ خطأ في حساب أرباح المستوى الأول:", error);
          }
        }
        
        if (userData.level2) {
          try {
            const level2Ref = doc(db, "users", userData.level2);
            const level2Snap = await getDoc(level2Ref);
            
            if (level2Snap.exists()) {
              const level2Data = level2Snap.data();
              const level2Amount = (amount * commissionRates.level2) / 100;
              const newBalance = (level2Data.balance || 0) + level2Amount;
              
              await updateDoc(level2Ref, { balance: newBalance });
              
              await addDoc(collection(db, "referral_rewards"), {
                receiver: userData.level2,
                fromUser: userId,
                amount: level2Amount,
                level: 2,
                createdAt: serverTimestamp()
              });
              
              await addDoc(collection(db, "transactions"), {
                transactionId: "REF" + Date.now() + Math.random().toString(36).substr(2, 6),
                userId: userData.level2,
                userPhone: userPhone,
                userEmail: userEmail,
                type: "referral_commission",
                amount: level2Amount,
                currency: "USDT",
                status: "completed",
                details: {
                  fromUserId: userId,
                  fromEmail: userEmail,
                  fromPhone: userPhone,
                  level: 2,
                  percentage: commissionRates.level2,
                  baseAmount: amount,
                  rechargeId: rechargeId,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              
              await addDoc(collection(db, "users", userData.level2, "notifications"), {
                title: "💰 عمولة إحالة جديدة",
                message: `لقد حصلت على عمولة إحالة بقيمة ${level2Amount} USDT (${commissionRates.level2}%) من ${userPhone || userEmail}`,
                read: false,
                createdAt: serverTimestamp(),
              });
              
              console.log(`✅ إضافة ${level2Amount} USDT (${commissionRates.level2}%) للمستوى الثاني إلى balance: ${level2Data.email}`);
            }
          } catch (error) {
            console.error("❌ خطأ في حساب أرباح المستوى الثاني:", error);
          }
        }
        
        if (userData.level3) {
          try {
            const level3Ref = doc(db, "users", userData.level3);
            const level3Snap = await getDoc(level3Ref);
            
            if (level3Snap.exists()) {
              const level3Data = level3Snap.data();
              const level3Amount = (amount * commissionRates.level3) / 100;
              const newBalance = (level3Data.balance || 0) + level3Amount;
              
              await updateDoc(level3Ref, { balance: newBalance });
              
              await addDoc(collection(db, "referral_rewards"), {
                receiver: userData.level3,
                fromUser: userId,
                amount: level3Amount,
                level: 3,
                createdAt: serverTimestamp()
              });
              
              await addDoc(collection(db, "transactions"), {
                transactionId: "REF" + Date.now() + Math.random().toString(36).substr(2, 7),
                userId: userData.level3,
                userPhone: userPhone,
                userEmail: userEmail,
                type: "referral_commission",
                amount: level3Amount,
                currency: "USDT",
                status: "completed",
                details: {
                  fromUserId: userId,
                  fromEmail: userEmail,
                  fromPhone: userPhone,
                  level: 3,
                  percentage: commissionRates.level3,
                  baseAmount: amount,
                  rechargeId: rechargeId,
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              
              await addDoc(collection(db, "users", userData.level3, "notifications"), {
                title: "💰 عمولة إحالة جديدة",
                message: `لقد حصلت على عمولة إحالة بقيمة ${level3Amount} USDT (${commissionRates.level3}%) من ${userPhone || userEmail}`,
                read: false,
                createdAt: serverTimestamp(),
              });
              
              console.log(`✅ إضافة ${level3Amount} USDT (${commissionRates.level3}%) للمستوى الثالث إلى balance: ${level3Data.email}`);
            }
          } catch (error) {
            console.error("❌ خطأ في حساب أرباح المستوى الثالث:", error);
          }
        }
        
        console.log(`🎉 تم إكمال حساب أرباح الإحالة بنجاح`);
        
      } catch (error) {
        console.error("❌ خطأ في حساب أرباح الإحالة:", error);
        throw error;
      }
    },

    async rejectRecharge(r, reason = "") {
      if (!r || !r.id) return;
      
      if (!reason) {
        this.openRejectModal(r, 'recharge');
        return;
      }
      
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      if (!confirm(`تأكيد رفض طلب التعبئة ${r.amount} USDT للمستخدم ${r.userEmail || r.email || r.userId || ''}?`)) return;
      this.processingId = r.id;
      
      try {
        // العملية الرئيسية: تحديث حالة الدفع
        const pRef = doc(db, "payments", r.id);
        await updateDoc(pRef, { status: "rejected", processedAt: serverTimestamp() });
        console.log("✅ تم تحديث حالة الدفع إلى rejected");
        
        // العمليات الفرعية - كل منها في try-catch منفصل
        
        // 1. إنشاء سجل في recharge_logs
        try {
          await addDoc(collection(db, "recharge_logs"), {
            userId: r.userId || null,
            userPhone: r.userPhone || r.phoneNumber || null,
            email: r.userEmail || r.email || null,
            amount: r.amount || 0,
            type: "rejected",
            reason: reason,
            network: r.network,
            txid: r.txid,
            createdAt: serverTimestamp(),
          });
          console.log("✅ تم إنشاء سجل في recharge_logs");
        } catch (e) {
          console.warn("⚠️ فشل إنشاء سجل في recharge_logs:", e);
        }
        
        // 2. إنشاء معاملة
        if (r.userId) {
          try {
            let userPhone = r.userPhone || r.phoneNumber;
            if (!userPhone) {
              try {
                const userSnap = await getDoc(doc(db, "users", r.userId));
                if (userSnap.exists()) {
                  userPhone = userSnap.data().phoneNumber || null;
                }
              } catch (err) {}
            }
            
            await this.createTransactionForUser(
              r.userId,
              r.userEmail || r.email,
              userPhone,
              "recharge",
              r.amount,
              "rejected",
              reason,
              "تم رفض طلب التعبئة",
              r.network,
              "",
              "",
              ""
            );
            console.log("✅ تم إنشاء المعاملة");
          } catch (e) {
            console.warn("⚠️ فشل إنشاء المعاملة:", e);
          }
        }
        
        // 3. إرسال إشعار للمستخدم
        if (r.userId) {
          try {
            await addDoc(collection(db, "users", r.userId, "notifications"), {
              title: "تم رفض طلب التعبئة",
              message: `تم رفض طلب تعبئة ${r.amount} USDT. السبب: ${reason}`,
              read: false,
              createdAt: serverTimestamp(),
            });
            console.log("✅ تم إرسال الإشعار");
          } catch (e) {
            console.warn("⚠️ فشل إرسال الإشعار:", e);
          }
        }
        
        alert("❌ تم رفض طلب التعبئة");
        
      } catch (e) {
        console.error("❌ rejectRecharge error:", e);
        alert("حدث خطأ أثناء رفض الطلب");
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeRejectModal();
        await this.reloadRechargeRequests();
        await this.loadRechargeLogs();
      }
    },
    
    async deleteRecharge(r) {
      if (!r || !r.id) return;
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      if (!confirm("هل أنت متأكد أنك تريد حذف هذا الطلب نهائياً؟")) return;
      this.processingId = r.id;
      try {
        await deleteDoc(doc(db, "payments", r.id));
        
        // إضافة سجل في recharge_logs مع الحفاظ على الحالة الأصلية
        await addDoc(collection(db, "recharge_logs"), {
          userId: r.userId || null,
          userPhone: r.userPhone || r.phoneNumber || null,
          email: r.userEmail || r.email || null,
          amount: r.amount || 0,
          type: r.status || "pending",
          status: r.status || "pending",
          network: r.network,
          txid: r.txid,
          adminMessage: "تم حذف الطلب بواسطة الأدمن (تم الإلغاء من قبل الإدارة)",
          createdAt: serverTimestamp(),
          originalStatus: r.status || "pending",
          deletedByAdmin: true,
          deletedAt: serverTimestamp()
        });
        
        alert("تم حذف الطلب");
        await this.reloadRechargeRequests();
        await this.loadRechargeLogs();
      } catch (e) {
        console.error("deleteRecharge error:", e);
        alert("خطأ أثناء حذف الطلب");
      } finally {
        this.processingId = null;
      }
    },
    
    detachRechargeListener() {
      if (this.rechargeUnsubscribe) {
        try { this.rechargeUnsubscribe(); } catch (e) {}
        this.rechargeUnsubscribe = null;
      }
    },
    
    async openAccountDetailsModal(user) {
      try {
        this.showAccountDetailsModal = true;
        this.showWithdrawHistory = false;
        this.showRechargeHistory = false;
        
        let vipLevel = "عادي";
        let vipExpiryDate = null;
        
        try {
          const vipPurchasesQuery = query(
            collection(db, "vip_purchases"),
            where("userId", "==", user.id),
            where("status", "==", "active"),
            orderBy("expiryDate", "desc"),
            limit(1)
          );
          const vipSnap = await getDocs(vipPurchasesQuery);
          
          if (!vipSnap.empty) {
            const vipData = vipSnap.docs[0].data();
            vipLevel = vipData.vipLevel || "عادي";
            vipExpiryDate = vipData.expiryDate;
          } else if (user.vipLevel && user.vipLevel !== "عادي") {
            vipLevel = user.vipLevel;
            vipExpiryDate = user.vipExpiryDate || null;
          }
        } catch (err) {
          console.warn("Failed to fetch VIP data:", err);
          if (user.vipLevel) {
            vipLevel = user.vipLevel;
          }
        }
        
        const vipLockedAmount = user.vipLockedAmount || 0;
        const availableBalance = Math.max(0, user.balance - vipLockedAmount);
        
        this.accountDetails = {
          email: user.email || "—",
          phoneNumber: user.phoneNumber || "—",
          vipLevel: vipLevel,
          vipExpiryDate: vipExpiryDate,
          createdAt: user.createdAt || null,
          balance: user.balance || 0,
          vipLockedAmount: vipLockedAmount,
          availableBalance: availableBalance,
          blocked: user.blocked || false,
          userId: user.id
        };
        
        await this.loadUserWithdrawHistory(user.id);
        await this.loadUserRechargeHistory(user.id);
        
      } catch (error) {
        console.error("خطأ في جلب تفاصيل الحساب:", error);
        alert("حدث خطأ في جلب تفاصيل الحساب");
      }
    },
    
    async loadUserWithdrawHistory(userId) {
      try {
        let allLogs = [];
        
        // جلب سجل السحوبات من withdraw_requests
        try {
          const withdrawRequestsQuery = query(
            collection(db, "withdraw_requests"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );
          const withdrawSnap = await getDocs(withdrawRequestsQuery);
          const logs = withdrawSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            status: doc.data().status || "pending"
          }));
          allLogs = [...allLogs, ...logs];
        } catch (e) {
          console.warn("⚠️ فشل جلب من withdraw_requests:", e);
        }
        
        // جلب سجلات الحذف من withdraw_logs
        try {
          const logsSnap = await getDocs(query(
            collection(db, "withdraw_logs"),
            where("userId", "==", userId),
            where("deletedByAdmin", "==", true)
          ));
          const deletedLogs = logsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            status: doc.data().status || doc.data().type || "pending",
            type: doc.data().type || doc.data().status || "pending"
          }));
          allLogs = [...allLogs, ...deletedLogs];
        } catch (e) {
          console.warn("⚠️ فشل جلب سجلات الحذف:", e);
        }
        
        // ترتيب حسب التاريخ
        allLogs.sort((a, b) => this.getTimeFromDate(b.createdAt) - this.getTimeFromDate(a.createdAt));
        
        this.accountWithdrawHistory = allLogs;
        console.log(`✅ تم تحميل ${this.accountWithdrawHistory.length} سجل سحب للمستخدم`);
      } catch (error) {
        console.error("خطأ في جلب سجل السحوبات:", error);
        this.accountWithdrawHistory = [];
      }
    },
    
    async loadUserRechargeHistory(userId) {
      try {
        const rechargeLogsQuery = query(
          collection(db, "recharge_logs"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const rechargeSnap = await getDocs(rechargeLogsQuery);
        
        if (!rechargeSnap.empty) {
          this.accountRechargeHistory = rechargeSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("userId", "==", userId),
            where("type", "==", "recharge"),
            orderBy("createdAt", "desc")
          );
          const transSnap = await getDocs(transactionsQuery);
          this.accountRechargeHistory = transSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: doc.data().status
          }));
        }
      } catch (error) {
        console.error("خطأ في جلب سجل التعبئة:", error);
        this.accountRechargeHistory = [];
      }
    },
    
    showUserWithdrawHistory() {
      this.showWithdrawHistory = !this.showWithdrawHistory;
      this.showRechargeHistory = false;
    },
    
    showUserRechargeHistory() {
      this.showRechargeHistory = !this.showRechargeHistory;
      this.showWithdrawHistory = false;
    },
    
    closeAccountDetailsModal() {
      this.showAccountDetailsModal = false;
      this.accountDetails = {
        email: "",
        phoneNumber: "",
        vipLevel: "عادي",
        vipExpiryDate: null,
        createdAt: null,
        balance: 0,
        vipLockedAmount: 0,
        availableBalance: 0,
        blocked: false,
        userId: null
      };
      this.accountWithdrawHistory = [];
      this.accountRechargeHistory = [];
      this.showWithdrawHistory = false;
      this.showRechargeHistory = false;
    },
    
    getVipText(vipLevel) {
      if (!vipLevel || vipLevel === "عادي" || vipLevel === "normal") {
        return "عادي";
      }
      const vipMap = {
        "bronze": "برونزي",
        "silver": "فضي",
        "gold": "ذهبي",
        "platinum": "بلاتيني",
        "diamond": "ألماس",
        "vip1": "VIP 1",
        "vip2": "VIP 2",
        "vip3": "VIP 3",
        "vip4": "VIP 4",
        "vip5": "VIP 5"
      };
      return vipMap[vipLevel.toLowerCase()] || vipLevel;
    },
    
    getVipClass(vipLevel) {
      if (!vipLevel || vipLevel === "عادي" || vipLevel === "normal") {
        return "vip-normal";
      }
      const lowerLevel = vipLevel.toLowerCase();
      if (lowerLevel === "bronze" || lowerLevel === "vip1") return "vip-bronze";
      if (lowerLevel === "silver" || lowerLevel === "vip2") return "vip-silver";
      if (lowerLevel === "gold" || lowerLevel === "vip3") return "vip-gold";
      if (lowerLevel === "platinum" || lowerLevel === "vip4") return "vip-platinum";
      if (lowerLevel === "diamond" || lowerLevel === "vip5") return "vip-diamond";
      return "vip-normal";
    },

    async confirmDeleteAllUserLogs(userId) {
      if (!userId) {
        alert("معرف المستخدم غير صالح");
        return;
      }
      
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        alert("المستخدم غير موجود");
        return;
      }
      
      const userName = user.email || user.phoneNumber || userId;
      
      let totalLogs = 0;
      try {
        const withdrawLogsSnap = await getDocs(query(collection(db, "withdraw_logs"), where("userId", "==", userId)));
        const rechargeLogsSnap = await getDocs(query(collection(db, "recharge_logs"), where("userId", "==", userId)));
        const transactionsSnap = await getDocs(query(collection(db, "transactions"), where("userId", "==", userId)));
        const notificationsSnap = await getDocs(collection(db, "users", userId, "notifications"));
        const referralSnap = await getDocs(query(collection(db, "referral_rewards"), where("receiver", "==", userId)));
        const withdrawRequestsSnap = await getDocs(query(collection(db, "withdraw_requests"), where("userId", "==", userId)));
        const paymentsSnap = await getDocs(query(collection(db, "payments"), where("userId", "==", userId)));
        const vipPurchasesSnap = await getDocs(query(collection(db, "vip_purchases"), where("userId", "==", userId)));
        
        totalLogs = withdrawLogsSnap.size + rechargeLogsSnap.size + transactionsSnap.size + 
                    notificationsSnap.size + referralSnap.size + withdrawRequestsSnap.size +
                    paymentsSnap.size + vipPurchasesSnap.size;
      } catch (e) {
        console.log("⚠️ خطأ في حساب السجلات:", e);
      }
      
      const confirmMessage = `
  ⚠️ تحذير: أنت على وشك حذف جميع سجلات المستخدم!
  
  📌 اسم المستخدم: ${userName}
  📌 الرصيد: ${user.balance || 0} USDT
  📌 عدد السجلات المراد حذفها: ${totalLogs} سجل
  
  سيتم حذف:
  • جميع سجلات السحوبات
  • جميع سجلات التعبئة
  • جميع المعاملات
  • جميع الإشعارات
  • سجل الإحالات
  • طلبات السحب المعلقة
  • طلبات التعبئة المعلقة
  • مشتريات VIP
  
  ⚠️ سيتم الاحتفاظ بحساب المستخدم نفسه (البريد، رقم الهاتف، الرصيد)
  ⚠️ هذا الإجراء لا يمكن التراجع عنه أبداً!
  `;
      
      if (!confirm(confirmMessage)) return;
      if (!confirm("تأكيد نهائي: هل أنت متأكد من حذف جميع سجلات هذا المستخدم نهائياً؟")) return;
      
      const finalConfirm = prompt(`للتأكيد النهائي، اكتب كلمة "حذف" في الحقل أدناه:`);
      if (finalConfirm !== "حذف") {
        alert("❌ لم يتم تأكيد الحذف - الكلمة غير صحيحة");
        return;
      }
      
      this.processingId = userId;
      
      try {
        const deletePromises = [];
        const deletedCounts = {
          withdrawLogs: 0,
          rechargeLogs: 0,
          transactions: 0,
          notifications: 0,
          referralRewards: 0,
          withdrawRequests: 0,
          payments: 0,
          vipPurchases: 0
        };
        
        try {
          const withdrawLogsQuery = await getDocs(query(
            collection(db, "withdraw_logs"),
            where("userId", "==", userId)
          ));
          for (const docSnap of withdrawLogsQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "withdraw_logs", docSnap.id)));
            deletedCounts.withdrawLogs++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف سجلات السحوبات:", e);
        }
        
        try {
          const rechargeLogsQuery = await getDocs(query(
            collection(db, "recharge_logs"),
            where("userId", "==", userId)
          ));
          for (const docSnap of rechargeLogsQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "recharge_logs", docSnap.id)));
            deletedCounts.rechargeLogs++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف سجلات التعبئة:", e);
        }
        
        try {
          const transactionsQuery = await getDocs(query(
            collection(db, "transactions"),
            where("userId", "==", userId)
          ));
          for (const docSnap of transactionsQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "transactions", docSnap.id)));
            deletedCounts.transactions++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف المعاملات:", e);
        }
        
        try {
          const notificationsQuery = await getDocs(
            collection(db, "users", userId, "notifications")
          );
          for (const docSnap of notificationsQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "users", userId, "notifications", docSnap.id)));
            deletedCounts.notifications++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف الإشعارات:", e);
        }
        
        try {
          const referralQuery = await getDocs(query(
            collection(db, "referral_rewards"),
            where("receiver", "==", userId)
          ));
          for (const docSnap of referralQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "referral_rewards", docSnap.id)));
            deletedCounts.referralRewards++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف سجل الإحالات:", e);
        }
        
        try {
          const withdrawRequestsQuery = await getDocs(query(
            collection(db, "withdraw_requests"),
            where("userId", "==", userId)
          ));
          for (const docSnap of withdrawRequestsQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "withdraw_requests", docSnap.id)));
            deletedCounts.withdrawRequests++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف طلبات السحب:", e);
        }
        
        try {
          const paymentsQuery = await getDocs(query(
            collection(db, "payments"),
            where("userId", "==", userId)
          ));
          for (const docSnap of paymentsQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "payments", docSnap.id)));
            deletedCounts.payments++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف طلبات التعبئة:", e);
        }
        
        try {
          const vipQuery = await getDocs(query(
            collection(db, "vip_purchases"),
            where("userId", "==", userId)
          ));
          for (const docSnap of vipQuery.docs) {
            deletePromises.push(deleteDoc(doc(db, "vip_purchases", docSnap.id)));
            deletedCounts.vipPurchases++;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف مشتريات VIP:", e);
        }
        
        await Promise.all(deletePromises);
        
        const totalDeleted = Object.values(deletedCounts).reduce((a, b) => a + b, 0);
        
        await addDoc(collection(db, "admin_logs"), {
          action: "delete_user_logs_permanently",
          userId: userId,
          userEmail: user.email || null,
          userPhone: user.phoneNumber || null,
          deletedCounts: deletedCounts,
          totalDeleted: totalDeleted,
          adminEmail: this.currentUser?.email || "admin",
          timestamp: serverTimestamp()
        });
        
        this.accountWithdrawHistory = [];
        this.accountRechargeHistory = [];
        this.showWithdrawHistory = false;
        this.showRechargeHistory = false;
        
        await this.loadWithdrawLogs();
        await this.loadRechargeLogs();
        await this.loadWithdrawRequests();
        await this.reloadRechargeRequests();
        
        alert(`✅ تم حذف جميع سجلات المستخدم "${userName}" بنجاح!
        
  📊 ملخص الحذف:
  • سجلات السحوبات: ${deletedCounts.withdrawLogs}
  • سجلات التعبئة: ${deletedCounts.rechargeLogs}
  • المعاملات: ${deletedCounts.transactions}
  • الإشعارات: ${deletedCounts.notifications}
  • سجل الإحالات: ${deletedCounts.referralRewards}
  • طلبات السحب: ${deletedCounts.withdrawRequests}
  • طلبات التعبئة: ${deletedCounts.payments}
  • مشتريات VIP: ${deletedCounts.vipPurchases}
  📌 المجموع الكلي: ${totalDeleted} سجل`);
        
      } catch (e) {
        console.error("❌ خطأ في حذف سجلات المستخدم:", e);
        alert(`❌ حدث خطأ أثناء حذف السجلات: ${e.message || 'خطأ غير معروف'}`);
      } finally {
        this.processingId = null;
        this.closeAccountDetailsModal();
      }
    }
  }
};
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.logout-btn {
  background: #ff4444;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
  height: 30px;
}

.admin-page {
  direction: rtl;
  padding: 12px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Cairo', sans-serif;
  min-height: 100vh;
  background: #0A0C10;
  color: #ffffff;
}

.page-title {
  text-align: left;
  font-size: 18px;
  color: #D4AF37;
  margin-bottom: 6px;
  font-weight: 600;
}

.tabs {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tab {
  padding: 6px 10px;
  background: #11151C;
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  min-height: 30px;
  flex: 1;
  min-width: 120px;
  text-align: center;
  color: #ffffff;
  transition: all 0.3s ease;
}

.tab:hover {
  border-color: #D4AF37;
}

.tab.active {
  background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028);
  color: #0A0C10;
  border: none;
}

.panel {
  background: #11151C;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 12px;
  max-height: 500px;
  overflow-y: auto;
  color: #ffffff;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.panel-header h2 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #D4AF37;
}

.controls {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.controls input,
.controls select {
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  background: #1A1F2A;
  color: #ffffff;
  font-size: 11px;
  height: 28px;
  min-width: 150px;
}

.controls input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.controls button {
  padding: 5px 8px;
  border-radius: 6px;
  border: none;
  background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028);
  color: #0A0C10;
  cursor: pointer;
  font-size: 11px;
  height: 28px;
  white-space: nowrap;
  font-weight: 600;
  transition: all 0.3s ease;
}

.controls button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  background: #1A1F2A;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: #ffffff;
}

.card p {
  margin: 4px 0;
  font-size: 11px;
  line-height: 1.3;
}

.card strong {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.gold-text {
  color: #D4AF37;
  font-weight: 600;
}

.muted {
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}

.card-actions {
  display: flex;
  gap: 5px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 10px;
  height: 26px;
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.details-btn {
  background: #6c757d;
}

.white-btn {
  background: #ffffff;
  color: #0A0C10;
  font-weight: 700;
}

.white-btn:hover {
  background: #e0e0e0;
}

.gold {
  background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028);
  color: #0A0C10;
  font-weight: 700;
}

.gold-outline {
  background: transparent;
  border: 1px solid #D4AF37;
  color: #D4AF37;
}

.green {
  background: #28a745;
}

.red {
  background: #dc3545;
}

.blue {
  background: #007bff;
}

.black {
  background: #333;
}

.purple {
  background: #9c27b0;
}

.loading {
  text-align: center;
  padding: 10px;
  color: #D4AF37;
  font-size: 12px;
}

.empty {
  text-align: center;
  padding: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.modal {
  background: #11151C;
  padding: 12px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px #D4AF37;
  max-height: 80vh;
  overflow-y: auto;
  color: #ffffff;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.account-details-modal {
  max-width: 500px;
}

.modal h3 {
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #D4AF37;
  font-weight: 600;
}

.modal h4 {
  font-size: 12px;
  color: #D4AF37;
  margin: 10px 0 5px 0;
}

.modal p {
  margin: 5px 0;
  font-size: 11px;
  line-height: 1.3;
}

.modal label {
  color: #D4AF37;
  font-size: 12px;
  display: block;
  margin-bottom: 5px;
}

.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: flex-end;
}

.danger-zone {
  background: rgba(220, 53, 69, 0.1);
  border: 2px solid #dc3545;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.delete-all-logs-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  transition: all 0.3s ease;
  width: 100%;
}

.delete-all-logs-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.delete-all-logs-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.invited-by-info {
  background: #1A1F2A;
  padding: 8px;
  border-radius: 6px;
  margin: 10px 0;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.referral-level {
  background: #1A1F2A;
  padding: 8px;
  border-radius: 6px;
  margin: 10px 0;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.users-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
}

.user-item {
  background: #11151C;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 6px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.user-item p {
  margin: 2px 0;
  font-size: 10px;
}

.empty-text {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  text-align: center;
  padding: 10px;
}

.account-details {
  margin-top: 15px;
}

.detail-item {
  margin-bottom: 12px;
  padding: 8px;
  background: #1A1F2A;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.detail-item label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
  display: block;
}

.detail-value {
  font-size: 13px;
  font-weight: 500;
}

.vip-expiry {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
  display: block;
}

.account-buttons {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  justify-content: center;
}

.account-buttons .btn {
  flex: 1;
  min-width: auto;
}

.history-section {
  margin-top: 15px;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
  padding-top: 10px;
}

.history-section h4 {
  font-size: 12px;
  color: #D4AF37;
  margin-bottom: 10px;
  text-align: center;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  background: #1A1F2A;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.history-item p {
  margin: 3px 0;
  font-size: 10px;
}

.vip-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 12px;
}

.vip-normal {
  background: #6c757d;
  color: white;
}

.vip-bronze {
  background: #cd7f32;
  color: white;
}

.vip-silver {
  background: #c0c0c0;
  color: #333;
}

.vip-gold {
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0A0C10;
}

.vip-platinum {
  background: #e5e4e2;
  color: #333;
}

.vip-diamond {
  background: linear-gradient(135deg, #b9f2ff, #4ecdc4);
  color: #0A0C10;
}

.status-approved {
  color: #28a745;
  font-weight: bold;
}

.status-rejected {
  color: #dc3545;
  font-weight: bold;
}

.status-pending {
  color: #ffc107;
  font-weight: bold;
}

.register-phone {
  color: #D4AF37;
  font-weight: bold;
  background: rgba(212, 175, 55, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.register-email {
  color: #22c55e;
  font-weight: bold;
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 8px;
  }

  .tabs {
    gap: 4px;
  }

  .tab {
    padding: 5px 8px;
    font-size: 11px;
    min-width: 100px;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .controls {
    width: 100%;
  }

  .controls input,
  .controls select {
    flex: 1;
    min-width: auto;
  }

  .card-actions {
    justify-content: center;
  }

  .btn {
    flex: 1;
    min-width: auto;
  }
  
  .account-buttons {
    flex-direction: column;
  }
}
</style>
