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
        سجل السحوبات
      </button>
      <button :class="['tab', activeTab === 'rechargeLogs' ? 'active' : '']" @click="switchTab('rechargeLogs')">
        سجل التعبئة
      </button>
      <button :class="['tab', activeTab === 'wheelSettings' ? 'active' : '']" @click="switchTab('wheelSettings')">
        🎡 إعدادات العجلة
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
            <p><strong>يوم السحب:</strong> {{ req.withdrawDay || '—' }}</p>
            <p><strong>مصدر السحب:</strong> <span class="gold-text">{{ req.withdrawFrom || 'vipBalance' }}</span></p>
            <p class="muted">تم الإنشاء: {{ formatDate(req.createdAt) }}</p>
            <div class="card-actions">
              <button class="btn gold" type="button" @click.stop="openApproveModal(req, 'withdraw')" :disabled="processingId === req.id">موافقة</button>
              <button class="btn red" type="button" @click.stop="openRejectModal(req, 'withdraw')" :disabled="processingId === req.id">رفض</button>
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
            <p><strong>رصيد VIP:</strong> <span class="gold-text">{{ formatBalance(u.vipBalance) }} USDT</span></p>
            <p><strong>رصيد الترقية:</strong> <span class="gold-text">{{ formatBalance(u.depositBalance) }} USDT</span></p>
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
              <button class="btn wheel-settings-btn" type="button" @click="openUserWheelSettings(u)">
                🎡 إعدادات العجلة
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
          <input v-model="withdrawLogFilter" placeholder="بحث بالسعر أو البريد..." />
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
        <div v-if="withdrawLogs.length === 0" class="empty">لا توجد سجلات.</div>
        <div class="cards">
          <div class="card log-card" v-for="l in filteredWithdrawLogs" :key="l.id">
            <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ l.userPhone || l.phoneNumber || '—' }}</span></p>
            <p><strong>البريد:</strong> <span class="gold-text">{{ l.email || l.userEmail || '—' }}</span></p>
            <p><strong>المبلغ:</strong> <span class="gold-text">{{ l.amount }} USDT</span></p>
            <p><strong>المحفظة:</strong> <span class="gold-text">{{ l.wallet || l.walletAddress || '—' }}</span></p>
            <p><strong>النوع:</strong> 
              <span :class="{
                'status-approved': l.type === 'approved',
                'status-rejected': l.type === 'rejected'
              }">
                {{ l.type === 'approved' ? 'موافق' : l.type === 'rejected' ? 'مرفوض' : l.type }}
              </span>
            </p>
            <p v-if="l.reason"><strong>السبب:</strong> {{ l.reason }}</p>
            <p v-if="l.adminMessage"><strong>رسالة الأدمن:</strong> {{ l.adminMessage }}</p>
            <p><strong>مصدر السحب:</strong> <span class="gold-text">{{ l.withdrawFrom || 'vipBalance' }}</span></p>
            <p class="muted">الوقت: {{ formatDate(l.createdAt) }}</p>
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
            <p v-if="log.reason"><strong>سبب الرفض:</strong> {{ log.reason }}</p>
            <p v-if="log.adminMessage"><strong>رسالة الأدمن:</strong> {{ log.adminMessage }}</p>
            <p><strong>الرصيد المستهدف:</strong> <span class="gold-text">{{ log.targetBalance || 'depositBalance' }}</span></p>
            <p class="muted">التاريخ: {{ formatDate(log.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- إعدادات عجلة الحظ العامة -->
    <div v-if="activeTab === 'wheelSettings'" class="panel">
      <div class="panel-header">
        <h2>🎡 إعدادات عجلة الحظ (العامة)</h2>
        <div class="controls">
          <button @click="loadWheelSettings" type="button">تحديث</button>
          <button @click="resetToDefaultSettings" type="button">استعادة الإعدادات الافتراضية</button>
        </div>
      </div>

      <div v-if="loadingWheelSettings" class="loading">⏳ جاري تحميل إعدادات العجلة...</div>
      <div v-else>
        <div class="wheel-settings-form">
          <div class="form-group">
            <label>نسبة الخسارة (%)</label>
            <input 
              type="number" 
              v-model.number="wheelSettings.lossRate" 
              @input="validateWheelRates"
              min="0" 
              max="100"
              step="0.1"
              class="settings-input"
            />
            <span class="value-display">{{ wheelSettings.lossRate }}%</span>
          </div>
          
          <div class="form-group">
            <label>نسبة الربح الصغير (%)</label>
            <input 
              type="number" 
              v-model.number="wheelSettings.smallWinRate" 
              @input="validateWheelRates"
              min="0" 
              max="100"
              step="0.1"
              class="settings-input"
            />
            <span class="value-display">{{ wheelSettings.smallWinRate }}%</span>
            <small class="hint">(مضاعف 0.5x)</small>
          </div>
          
          <div class="form-group">
            <label>نسبة الربح الكبير (%)</label>
            <input 
              type="number" 
              v-model.number="wheelSettings.bigWinRate" 
              @input="validateWheelRates"
              min="0" 
              max="100"
              step="0.1"
              class="settings-input"
            />
            <span class="value-display">{{ wheelSettings.bigWinRate }}%</span>
            <small class="hint">(مضاعف 1.5x)</small>
          </div>
          
          <div class="total-info" :class="{ 'error': wheelSettingsTotal !== 100 }">
            <strong>المجموع: {{ wheelSettingsTotal }}%</strong>
            <span v-if="wheelSettingsTotal !== 100" class="error-message">
              يجب أن يكون المجموع 100% (الفرق: {{ (100 - wheelSettingsTotal).toFixed(1) }}%)
            </span>
            <span v-else class="success-message">
              ✓ النسب صحيحة
            </span>
          </div>
          
          <div class="preview">
            <h3>معاينة النسب الحالية</h3>
            <div class="preview-bars">
              <div class="bar loss" :style="{ width: wheelSettings.lossRate + '%' }">
                خسارة: {{ wheelSettings.lossRate }}%
              </div>
              <div class="bar small-win" :style="{ width: wheelSettings.smallWinRate + '%' }">
                ربح صغير: {{ wheelSettings.smallWinRate }}%
              </div>
              <div class="bar big-win" :style="{ width: wheelSettings.bigWinRate + '%' }">
                ربح كبير: {{ wheelSettings.bigWinRate }}%
              </div>
            </div>
          </div>
          
          <button 
            @click="saveWheelSettings" 
            :disabled="!wheelSettingsValid || savingWheelSettings"
            class="save-btn"
          >
            {{ savingWheelSettings ? 'جاري الحفظ...' : '💾 حفظ الإعدادات العامة' }}
          </button>
          
          <div v-if="wheelSettingsMessage" class="save-message" :class="wheelSettingsMessageType">
            {{ wheelSettingsMessage }}
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
        <p v-if="approveType === 'recharge'"><strong>سيتم الإضافة إلى:</strong> <span class="gold-text">depositBalance (رصيد الترقية)</span></p>
        <p v-if="approveType === 'withdraw'"><strong>سيتم الخصم من:</strong> <span class="gold-text">vipBalance (رصيد الأرباح)</span></p>
        
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
          <button class="btn gold" type="button" @click="confirmApprove" :disabled="processingId === approveModalData.id">
            تأكيد الموافقة
          </button>
          <button class="btn gold-outline" type="button" @click="closeApproveModal">إلغاء</button>
        </div>
      </div>
    </div>

    <!-- Modal إعدادات العجلة للمستخدم -->
    <div v-if="showUserWheelModal" class="modal-backdrop" @click.self="closeUserWheelModal">
      <div class="modal user-wheel-modal">
        <h3>🎡 إعدادات عجلة الحظ للمستخدم</h3>
        <p><strong>المستخدم:</strong> <span class="gold-text">{{ selectedUser.email || selectedUser.phoneNumber || '—' }}</span></p>
        <p class="muted">تحديد "استخدام الإعدادات العامة" يعني أن اللعبة ستستخدم إعدادات العجلة العامة</p>
        
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="useGlobalSettingsForUser" @change="onUseGlobalSettingsChange" />
            <span>استخدام الإعدادات العامة</span>
          </label>
        </div>
        
        <div v-if="!useGlobalSettingsForUser" class="user-settings-form">
          <div class="form-group">
            <label>نسبة الخسارة (%)</label>
            <input 
              type="number" 
              v-model.number="userWheelSettings.lossRate" 
              @input="validateUserWheelRates"
              min="0" 
              max="100"
              step="0.1"
              class="settings-input"
            />
            <span class="value-display">{{ userWheelSettings.lossRate }}%</span>
          </div>
          
          <div class="form-group">
            <label>نسبة الربح الصغير (%)</label>
            <input 
              type="number" 
              v-model.number="userWheelSettings.smallWinRate" 
              @input="validateUserWheelRates"
              min="0" 
              max="100"
              step="0.1"
              class="settings-input"
            />
            <span class="value-display">{{ userWheelSettings.smallWinRate }}%</span>
            <small class="hint">(مضاعف 0.5x)</small>
          </div>
          
          <div class="form-group">
            <label>نسبة الربح الكبير (%)</label>
            <input 
              type="number" 
              v-model.number="userWheelSettings.bigWinRate" 
              @input="validateUserWheelRates"
              min="0" 
              max="100"
              step="0.1"
              class="settings-input"
            />
            <span class="value-display">{{ userWheelSettings.bigWinRate }}%</span>
            <small class="hint">(مضاعف 1.5x)</small>
          </div>
          
          <div class="total-info" :class="{ 'error': userWheelSettingsTotal !== 100 }">
            <strong>المجموع: {{ userWheelSettingsTotal }}%</strong>
            <span v-if="userWheelSettingsTotal !== 100" class="error-message">
              يجب أن يكون المجموع 100% (الفرق: {{ (100 - userWheelSettingsTotal).toFixed(1) }}%)
            </span>
            <span v-else class="success-message">
              ✓ النسب صحيحة
            </span>
          </div>
        </div>
        
        <div v-else class="global-settings-info">
          <p>سيتم استخدام الإعدادات العامة التالية:</p>
          <div class="global-preview">
            <div class="preview-item">خسارة: {{ globalWheelSettings.lossRate }}%</div>
            <div class="preview-item">ربح صغير: {{ globalWheelSettings.smallWinRate }}%</div>
            <div class="preview-item">ربح كبير: {{ globalWheelSettings.bigWinRate }}%</div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn gold" type="button" @click="saveUserWheelSettings" :disabled="savingUserWheelSettings">
            {{ savingUserWheelSettings ? 'جاري الحفظ...' : '💾 حفظ الإعدادات' }}
          </button>
          <button class="btn gold-outline" type="button" @click="closeUserWheelModal">إلغاء</button>
        </div>
        
        <div v-if="userWheelSettingsMessage" class="save-message" :class="userWheelSettingsMessageType">
          {{ userWheelSettingsMessage }}
        </div>
      </div>
    </div>

    <!-- Modal تفاصيل السحب/التعبئة -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3>تفاصيل الطلب</h3>
        <p v-if="modalType === 'withdraw'"><strong>رقم الهاتف:</strong> <span class="gold-text">{{ modalData.userPhone || modalData.phoneNumber || '—' }}</span></p>
        <p v-if="modalType === 'withdraw'"><strong>البريد:</strong> <span class="gold-text">{{ modalData.email || modalData.userEmail }}</span></p>
        <p v-if="modalType === 'withdraw'"><strong>المبلغ:</strong> <span class="gold-text">{{ modalData.amount }} USDT</span></p>
        <p v-if="modalType === 'withdraw'"><strong>الشبكة:</strong> {{ modalData.network }}</p>
        <p v-if="modalType === 'withdraw'"><strong>المحفظة:</strong> {{ modalData.wallet || modalData.walletAddress }}</p>
        <p v-if="modalType === 'withdraw'"><strong>مستوى VIP:</strong> {{ modalData.vipLevel || '—' }}</p>
        <p v-if="modalType === 'withdraw'"><strong>يوم السحب:</strong> {{ modalData.withdrawDay || '—' }}</p>
        <p v-if="modalType === 'withdraw'"><strong>مصدر السحب:</strong> <span class="gold-text">{{ modalData.withdrawFrom || 'vipBalance' }}</span></p>
        
        <p v-if="modalType === 'recharge'"><strong>رقم الهاتف:</strong> <span class="gold-text">{{ modalData.userPhone || modalData.phoneNumber || '—' }}</span></p>
        <p v-if="modalType === 'recharge'"><strong>البريد:</strong> <span class="gold-text">{{ modalData.email || modalData.userEmail }}</span></p>
        <p v-if="modalType === 'recharge'"><strong>المبلغ:</strong> <span class="gold-text">{{ modalData.amount }} USDT</span></p>
        <p v-if="modalType === 'recharge'"><strong>الشبكة:</strong> {{ modalData.network }}</p>
        <p v-if="modalType === 'recharge' && modalData.txid"><strong>TxID:</strong> <span class="gold-text">{{ modalData.txid }}</span></p>
        <p v-if="modalType === 'recharge'"><strong>الرصيد المستهدف:</strong> <span class="gold-text">depositBalance (رصيد الترقية)</span></p>
        
        <p class="muted">تم الإنشاء: {{ formatDate(modalData.createdAt) }}</p>
        <div class="modal-actions">
          <button v-if="modalType === 'withdraw'" class="btn gold" type="button" @click.stop="openApproveModal(modalData, 'withdraw')" :disabled="processingId === modalData.id">موافقة</button>
          <button v-if="modalType === 'withdraw'" class="btn red" type="button" @click.stop="openRejectModal(modalData, 'withdraw')" :disabled="processingId === modalData.id">رفض</button>
          <button v-if="modalType === 'recharge'" class="btn gold" type="button" @click.stop="openApproveModal(modalData, 'recharge')" :disabled="processingId === modalData.id || modalData.status === 'approved'">موافقة</button>
          <button v-if="modalType === 'recharge'" class="btn red" type="button" @click.stop="openRejectModal(modalData, 'recharge')" :disabled="processingId === modalData.id || modalData.status === 'rejected'">رفض</button>
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
        
        <!-- معلومات الحساب الداعي -->
        <div class="invited-by-info" v-if="userDetails.invitedBy">
          <h4>🔗 تمت الدعوة بواسطة</h4>
          <p><strong>البريد:</strong> <span class="gold-text">{{ userDetails.invitedByEmail || '—' }}</span></p>
          <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ userDetails.invitedByPhone || '—' }}</span></p>
        </div>
        <div class="invited-by-info" v-else>
          <h4>🔗 تمت الدعوة بواسطة</h4>
          <p class="empty-text">لم تتم دعوته من قبل أي مستخدم (حساب مباشر)</p>
        </div>

        <!-- المستوى 1 -->
        <div class="referral-level">
          <h4>📊 المستوى الأول</h4>
          <p><strong>عدد الإحالات:</strong> <span class="gold-text">{{ userDetails.level1Count || 0 }}</span></p>
          <p><strong>مبلغ الشحن الكلي:</strong> <span class="gold-text">{{ userDetails.level1RechargeTotal || 0 }} USDT</span></p>
          <div v-if="userDetails.level1Users && userDetails.level1Users.length > 0" class="users-list">
            <div class="user-item" v-for="refUser in userDetails.level1Users" :key="refUser.id">
              <p><strong>البريد:</strong> <span class="gold-text">{{ refUser.email || '—' }}</span></p>
              <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ refUser.phoneNumber || '—' }}</span></p>
              <p><strong>تاريخ التسجيل:</strong> {{ formatDate(refUser.createdAt) }}</p>
              <p><strong>إجمالي الشحن:</strong> <span class="gold-text">{{ refUser.totalRecharge || 0 }} USDT</span></p>
            </div>
          </div>
          <div v-else class="empty-text">لا توجد إحالات في هذا المستوى</div>
        </div>

        <!-- المستوى 2 -->
        <div class="referral-level">
          <h4>📊 المستوى الثاني</h4>
          <p><strong>عدد الإحالات:</strong> <span class="gold-text">{{ userDetails.level2Count || 0 }}</span></p>
          <p><strong>مبلغ الشحن الكلي:</strong> <span class="gold-text">{{ userDetails.level2RechargeTotal || 0 }} USDT</span></p>
          <div v-if="userDetails.level2Users && userDetails.level2Users.length > 0" class="users-list">
            <div class="user-item" v-for="refUser in userDetails.level2Users" :key="refUser.id">
              <p><strong>البريد:</strong> <span class="gold-text">{{ refUser.email || '—' }}</span></p>
              <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ refUser.phoneNumber || '—' }}</span></p>
              <p><strong>تاريخ التسجيل:</strong> {{ formatDate(refUser.createdAt) }}</p>
              <p><strong>إجمالي الشحن:</strong> <span class="gold-text">{{ refUser.totalRecharge || 0 }} USDT</span></p>
            </div>
          </div>
          <div v-else class="empty-text">لا توجد إحالات في هذا المستوى</div>
        </div>

        <!-- المستوى 3 -->
        <div class="referral-level">
          <h4>📊 المستوى الثالث</h4>
          <p><strong>عدد الإحالات:</strong> <span class="gold-text">{{ userDetails.level3Count || 0 }}</span></p>
          <p><strong>مبلغ الشحن الكلي:</strong> <span class="gold-text">{{ userDetails.level3RechargeTotal || 0 }} USDT</span></p>
          <div v-if="userDetails.level3Users && userDetails.level3Users.length > 0" class="users-list">
            <div class="user-item" v-for="refUser in userDetails.level3Users" :key="refUser.id">
              <p><strong>البريد:</strong> <span class="gold-text">{{ refUser.email || '—' }}</span></p>
              <p><strong>رقم الهاتف:</strong> <span class="gold-text">{{ refUser.phoneNumber || '—' }}</span></p>
              <p><strong>تاريخ التسجيل:</strong> {{ formatDate(refUser.createdAt) }}</p>
              <p><strong>إجمالي الشحن:</strong> <span class="gold-text">{{ refUser.totalRecharge || 0 }} USDT</span></p>
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
            <label>رصيد VIP:</label>
            <div class="detail-value gold-text">{{ formatBalance(accountDetails.vipBalance) }} USDT</div>
            <small class="vip-expiry">رصيد الأرباح القابل للسحب</small>
          </div>
          
          <div class="detail-item">
            <label>رصيد الترقية:</label>
            <div class="detail-value gold-text">{{ formatBalance(accountDetails.depositBalance) }} USDT</div>
            <small class="vip-expiry">رصيد الإيداع المخصص للترقية</small>
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
        
        <!-- زر حذف سجل المستخدم بالكامل -->
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
                <span :class="item.type === 'approved' ? 'status-approved' : 'status-rejected'">
                  {{ item.type === 'approved' ? 'موافق' : item.type === 'rejected' ? 'مرفوض' : item.type }}
                </span>
              </p>
              <p v-if="item.reason"><strong>السبب:</strong> {{ item.reason }}</p>
              <p v-if="item.adminMessage"><strong>رسالة الأدمن:</strong> {{ item.adminMessage }}</p>
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
              <p v-if="item.reason"><strong>سبب الرفض:</strong> {{ item.reason }}</p>
              <p v-if="item.adminMessage"><strong>رسالة الأدمن:</strong> {{ item.adminMessage }}</p>
              <p class="muted">التاريخ: {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn gold-outline" type="button" @click="closeAccountDetailsModal">إغلاق</button>
        </div>
      </div>
    </div>

    <!-- Modal تعديل الرصيد مع اختيار النوع -->
    <div v-if="showBalanceModal" class="modal-backdrop" @click.self="closeBalanceModal">
      <div class="modal">
        <h3>{{ balanceModalType === 'add' ? 'تعبئة رصيد' : 'خصم رصيد' }}</h3>
        <p><strong>المستخدم:</strong> <span class="gold-text">{{ balanceModalUser.email || balanceModalUser.phoneNumber || '—' }}</span></p>
        <p><strong>المبلغ:</strong> <span class="gold-text">{{ balanceModalAmount }} USDT</span></p>
        
        <div class="input-box" style="margin-top: 15px;">
          <label>اختر نوع الرصيد المراد تعديله:</label>
          <div class="balance-type-selector">
            <label class="radio-label">
              <input type="radio" v-model="selectedBalanceType" value="vipBalance" />
              <span>رصيد VIP (الأرباح القابلة للسحب)</span>
              <small>الحالي: {{ formatBalance(balanceModalUser.vipBalance) }} USDT</small>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="selectedBalanceType" value="depositBalance" />
              <span>رصيد الترقية (الإيداع)</span>
              <small>الحالي: {{ formatBalance(balanceModalUser.depositBalance) }} USDT</small>
            </label>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn gold" type="button" @click="confirmBalanceChange">
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
  increment,
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
        level1RechargeTotal: 0,
        level1Users: [],
        level2Count: 0,
        level2RechargeTotal: 0,
        level2Users: [],
        level3Count: 0,
        level3RechargeTotal: 0,
        level3Users: []
      },
      
      showAccountDetailsModal: false,
      accountDetails: {
        email: "",
        phoneNumber: "",
        vipLevel: "عادي",
        vipExpiryDate: null,
        createdAt: null,
        vipBalance: 0,
        depositBalance: 0,
        blocked: false,
        userId: null
      },
      accountWithdrawHistory: [],
      accountRechargeHistory: [],
      showWithdrawHistory: false,
      showRechargeHistory: false,
      
      wheelSettings: {
        lossRate: 40,
        smallWinRate: 35,
        bigWinRate: 25
      },
      globalWheelSettings: {
        lossRate: 40,
        smallWinRate: 35,
        bigWinRate: 25
      },
      loadingWheelSettings: false,
      savingWheelSettings: false,
      wheelSettingsMessage: "",
      wheelSettingsMessageType: "",
      
      showUserWheelModal: false,
      selectedUser: null,
      useGlobalSettingsForUser: true,
      userWheelSettings: {
        lossRate: 40,
        smallWinRate: 35,
        bigWinRate: 25
      },
      savingUserWheelSettings: false,
      userWheelSettingsMessage: "",
      userWheelSettingsMessageType: "",

      // Modal تعديل الرصيد
      showBalanceModal: false,
      balanceModalType: 'add',
      balanceModalUser: {},
      balanceModalAmount: 0,
      selectedBalanceType: 'depositBalance'
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
          list.sort((a, b) => ((b.vipBalance || 0) + (b.depositBalance || 0)) - ((a.vipBalance || 0) + (a.depositBalance || 0)));
          break;
        case "balance_asc":
          list.sort((a, b) => ((a.vipBalance || 0) + (a.depositBalance || 0)) - ((b.vipBalance || 0) + (b.depositBalance || 0)));
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
            (l.email || l.userEmail || "").toLowerCase().includes(f)
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
    },
    wheelSettingsTotal() {
      return this.wheelSettings.lossRate + this.wheelSettings.smallWinRate + this.wheelSettings.bigWinRate;
    },
    wheelSettingsValid() {
      return Math.abs(this.wheelSettingsTotal - 100) < 0.01 &&
             this.wheelSettings.lossRate >= 0 && 
             this.wheelSettings.smallWinRate >= 0 && 
             this.wheelSettings.bigWinRate >= 0;
    },
    userWheelSettingsTotal() {
      return this.userWheelSettings.lossRate + this.userWheelSettings.smallWinRate + this.userWheelSettings.bigWinRate;
    },
    userWheelSettingsValid() {
      return Math.abs(this.userWheelSettingsTotal - 100) < 0.01 &&
             this.userWheelSettings.lossRate >= 0 && 
             this.userWheelSettings.smallWinRate >= 0 && 
             this.userWheelSettings.bigWinRate >= 0;
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
      
      // تحميل جميع البيانات مرة واحدة فقط عند تسجيل الدخول
      await this.loadAllData();
    });
  },
  beforeUnmount() {
    // إلغاء الـ listener عند مغادرة الصفحة
    this.detachRechargeListener();
  },
  methods: {
    getTimeFromDate(date) {
      if (!date) return 0;
      
      if (date.seconds !== undefined) {
        return date.seconds * 1000;
      }
      
      if (typeof date.toMillis === 'function') {
        return date.toMillis();
      }
      
      return new Date(date).getTime();
    },
    
    // تحميل جميع البيانات مرة واحدة
    async loadAllData() {
      await Promise.all([
        this.loadWithdrawRequests(),
        this.loadUsers(),
        this.loadWithdrawLogs(),
        this.loadWheelSettings(),
        this.loadRechargeRequests(),
        this.loadRechargeLogs()
      ]);
    },
    
    async loadWheelSettings() {
      this.loadingWheelSettings = true;
      try {
        const settingsRef = doc(db, "settings", "wheel");
        const settingsDoc = await getDoc(settingsRef);
        
        if (settingsDoc.exists()) {
          this.wheelSettings = settingsDoc.data();
          this.globalWheelSettings = { ...this.wheelSettings };
        } else {
          await this.createDefaultWheelSettings();
        }
      } catch (error) {
        console.error("خطأ في تحميل إعدادات العجلة:", error);
        this.wheelSettingsMessage = "حدث خطأ في تحميل الإعدادات";
        this.wheelSettingsMessageType = "error";
      } finally {
        this.loadingWheelSettings = false;
      }
    },
    
    async createDefaultWheelSettings() {
      try {
        const defaultSettings = {
          lossRate: 40,
          smallWinRate: 35,
          bigWinRate: 25
        };
        const settingsRef = doc(db, "settings", "wheel");
        await setDoc(settingsRef, defaultSettings);
        this.wheelSettings = defaultSettings;
        this.globalWheelSettings = { ...defaultSettings };
      } catch (error) {
        console.error("خطأ في إنشاء الإعدادات الافتراضية:", error);
      }
    },
    
    validateWheelRates() {
      this.wheelSettings.lossRate = Math.min(100, Math.max(0, this.wheelSettings.lossRate || 0));
      this.wheelSettings.smallWinRate = Math.min(100, Math.max(0, this.wheelSettings.smallWinRate || 0));
      this.wheelSettings.bigWinRate = Math.min(100, Math.max(0, this.wheelSettings.bigWinRate || 0));
      this.wheelSettingsMessage = "";
    },
    
    async saveWheelSettings() {
      if (!this.wheelSettingsValid) {
        this.wheelSettingsMessage = "الرجاء التأكد من أن مجموع النسب يساوي 100%";
        this.wheelSettingsMessageType = "error";
        return;
      }
      
      this.savingWheelSettings = true;
      this.wheelSettingsMessage = "";
      
      try {
        const settingsRef = doc(db, "settings", "wheel");
        await updateDoc(settingsRef, {
          lossRate: this.wheelSettings.lossRate,
          smallWinRate: this.wheelSettings.smallWinRate,
          bigWinRate: this.wheelSettings.bigWinRate
        });
        
        this.globalWheelSettings = { ...this.wheelSettings };
        this.wheelSettingsMessage = "تم حفظ الإعدادات العامة بنجاح!";
        this.wheelSettingsMessageType = "success";
        
        setTimeout(() => {
          this.wheelSettingsMessage = "";
        }, 3000);
      } catch (error) {
        console.error("خطأ في حفظ الإعدادات:", error);
        this.wheelSettingsMessage = "حدث خطأ أثناء حفظ الإعدادات";
        this.wheelSettingsMessageType = "error";
      } finally {
        this.savingWheelSettings = false;
      }
    },
    
    async resetToDefaultSettings() {
      if (!confirm("هل أنت متأكد من استعادة الإعدادات الافتراضية؟")) return;
      
      this.wheelSettings = {
        lossRate: 40,
        smallWinRate: 35,
        bigWinRate: 25
      };
      
      await this.saveWheelSettings();
    },
    
    async openUserWheelSettings(user) {
      this.selectedUser = user;
      this.userWheelSettingsMessage = "";
      this.savingUserWheelSettings = false;
      
      try {
        const userSettingsRef = doc(db, "user_wheel_settings", user.id);
        const userSettingsDoc = await getDoc(userSettingsRef);
        
        if (userSettingsDoc.exists()) {
          const data = userSettingsDoc.data();
          this.useGlobalSettingsForUser = data.useGlobalSettings !== false;
          
          if (!this.useGlobalSettingsForUser && data.settings) {
            this.userWheelSettings = {
              lossRate: data.settings.lossRate || 40,
              smallWinRate: data.settings.smallWinRate || 35,
              bigWinRate: data.settings.bigWinRate || 25
            };
          } else {
            this.userWheelSettings = { ...this.globalWheelSettings };
          }
        } else {
          this.useGlobalSettingsForUser = true;
          this.userWheelSettings = { ...this.globalWheelSettings };
        }
        
        this.showUserWheelModal = true;
      } catch (error) {
        console.error("خطأ في تحميل إعدادات المستخدم:", error);
        alert("حدث خطأ في تحميل الإعدادات");
      }
    },
    
    closeUserWheelModal() {
      this.showUserWheelModal = false;
      this.selectedUser = null;
      this.userWheelSettingsMessage = "";
    },
    
    validateUserWheelRates() {
      this.userWheelSettings.lossRate = Math.min(100, Math.max(0, this.userWheelSettings.lossRate || 0));
      this.userWheelSettings.smallWinRate = Math.min(100, Math.max(0, this.userWheelSettings.smallWinRate || 0));
      this.userWheelSettings.bigWinRate = Math.min(100, Math.max(0, this.userWheelSettings.bigWinRate || 0));
      this.userWheelSettingsMessage = "";
    },
    
    onUseGlobalSettingsChange() {
      if (this.useGlobalSettingsForUser) {
        this.userWheelSettings = { ...this.globalWheelSettings };
      }
    },
    
    async saveUserWheelSettings() {
      if (!this.useGlobalSettingsForUser && !this.userWheelSettingsValid) {
        this.userWheelSettingsMessage = "الرجاء التأكد من أن مجموع النسب يساوي 100%";
        this.userWheelSettingsMessageType = "error";
        return;
      }
      
      this.savingUserWheelSettings = true;
      this.userWheelSettingsMessage = "";
      
      try {
        const userSettingsRef = doc(db, "user_wheel_settings", this.selectedUser.id);
        
        const dataToSave = {
          userId: this.selectedUser.id,
          userEmail: this.selectedUser.email,
          userPhone: this.selectedUser.phoneNumber,
          useGlobalSettings: this.useGlobalSettingsForUser,
          updatedAt: serverTimestamp(),
          updatedBy: this.currentUser?.email || "admin"
        };
        
        if (!this.useGlobalSettingsForUser) {
          dataToSave.settings = {
            lossRate: this.userWheelSettings.lossRate,
            smallWinRate: this.userWheelSettings.smallWinRate,
            bigWinRate: this.userWheelSettings.bigWinRate
          };
        }
        
        await setDoc(userSettingsRef, dataToSave, { merge: true });
        
        this.userWheelSettingsMessage = "تم حفظ إعدادات المستخدم بنجاح!";
        this.userWheelSettingsMessageType = "success";
        
        setTimeout(() => {
          this.userWheelSettingsMessage = "";
        }, 2000);
        
        setTimeout(() => {
          this.closeUserWheelModal();
        }, 1500);
      } catch (error) {
        console.error("خطأ في حفظ إعدادات المستخدم:", error);
        this.userWheelSettingsMessage = "حدث خطأ أثناء حفظ الإعدادات";
        this.userWheelSettingsMessageType = "error";
      } finally {
        this.savingUserWheelSettings = false;
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
        
        this.accountDetails = {
          email: user.email || "—",
          phoneNumber: user.phoneNumber || "—",
          vipLevel: vipLevel,
          vipExpiryDate: vipExpiryDate,
          createdAt: user.createdAt || null,
          vipBalance: user.vipBalance || 0,
          depositBalance: user.depositBalance || 0,
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
        const withdrawLogsQuery = query(
          collection(db, "withdraw_logs"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const withdrawSnap = await getDocs(withdrawLogsQuery);
        
        if (!withdrawSnap.empty) {
          this.accountWithdrawHistory = withdrawSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("userId", "==", userId),
            where("type", "==", "withdraw"),
            orderBy("createdAt", "desc")
          );
          const transSnap = await getDocs(transactionsQuery);
          this.accountWithdrawHistory = transSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: doc.data().status
          }));
        }
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
        vipBalance: 0,
        depositBalance: 0,
        blocked: false,
        userId: null
      };
      this.accountWithdrawHistory = [];
      this.accountRechargeHistory = [];
      this.showWithdrawHistory = false;
      this.showRechargeHistory = false;
    },
    
    formatBalance(balance) {
      if (!balance && balance !== 0) return "0";
      return parseFloat(balance).toFixed(2);
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
    
    async getUserTotalRecharge(userId) {
      try {
        let totalRecharge = 0;
        try {
          const transactionsQuery = query(
            collection(db, "transactions"),
            where("userId", "==", userId),
            where("type", "in", ["recharge", "approved_recharge"]),
            where("status", "in", ["approved", "completed", "success"])
          );
          const transactionsSnap = await getDocs(transactionsQuery);
          transactionsSnap.docs.forEach(transactionDoc => {
            const transactionData = transactionDoc.data();
            totalRecharge += Number(transactionData.amount || 0);
          });
        } catch (error) {
          console.error("Error calculating total recharge:", error);
        }
        return totalRecharge;
      } catch (error) {
        console.error("Error in getUserTotalRecharge:", error);
        return 0;
      }
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
          level1RechargeTotal: 0,
          level1Users: [],
          level2Count: 0,
          level2RechargeTotal: 0,
          level2Users: [],
          level3Count: 0,
          level3RechargeTotal: 0,
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
        let level1Total = 0;

        for (const docSnap of level1Snap.docs) {
          const refData = docSnap.data();
          const refId = docSnap.id;
          const totalRecharge = await this.getUserTotalRecharge(refId);
          
          level1Users.push({
            id: refId,
            email: refData.email || "",
            phoneNumber: refData.phoneNumber || "",
            createdAt: refData.createdAt || refData.registeredAt || null,
            totalRecharge: totalRecharge
          });
          level1Total += totalRecharge;
        }

        this.userDetails.level1Count = level1Users.length;
        this.userDetails.level1RechargeTotal = level1Total;
        this.userDetails.level1Users = level1Users;

        const level2Users = [];
        let level2Total = 0;

        for (const level1User of level1Users) {
          const level2Query = query(
            collection(db, "users"),
            where("invitedBy", "==", level1User.id)
          );
          const level2Snap = await getDocs(level2Query);
          
          for (const docSnap of level2Snap.docs) {
            const refData = docSnap.data();
            const refId = docSnap.id;
            const totalRecharge = await this.getUserTotalRecharge(refId);
            
            level2Users.push({
              id: refId,
              email: refData.email || "",
              phoneNumber: refData.phoneNumber || "",
              createdAt: refData.createdAt || refData.registeredAt || null,
              totalRecharge: totalRecharge,
              invitedByLevel1: level1User.id
            });
            level2Total += totalRecharge;
          }
        }

        this.userDetails.level2Count = level2Users.length;
        this.userDetails.level2RechargeTotal = level2Total;
        this.userDetails.level2Users = level2Users;

        const level3Users = [];
        let level3Total = 0;

        for (const level2User of level2Users) {
          const level3Query = query(
            collection(db, "users"),
            where("invitedBy", "==", level2User.id)
          );
          const level3Snap = await getDocs(level3Query);
          
          for (const docSnap of level3Snap.docs) {
            const refData = docSnap.data();
            const refId = docSnap.id;
            const totalRecharge = await this.getUserTotalRecharge(refId);
            
            level3Users.push({
              id: refId,
              email: refData.email || "",
              phoneNumber: refData.phoneNumber || "",
              createdAt: refData.createdAt || refData.registeredAt || null,
              totalRecharge: totalRecharge,
              invitedByLevel2: level2User.id
            });
            level3Total += totalRecharge;
          }
        }

        this.userDetails.level3Count = level3Users.length;
        this.userDetails.level3RechargeTotal = level3Total;
        this.userDetails.level3Users = level3Users;

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
        level1RechargeTotal: 0,
        level1Users: [],
        level2Count: 0,
        level2RechargeTotal: 0,
        level2Users: [],
        level3Count: 0,
        level3RechargeTotal: 0,
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
      // عند التبديل بين التبويبات، نستخدم البيانات المحملة مسبقاً
      // ولا نعيد تحميل البيانات إلا إذا كانت فارغة
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
      } else if (tab === "wheelSettings") {
        this.loadWheelSettings();
      }
    },
    
    async loadUsers() {
      try {
        this.loadingUsers = true;
        const snap = await getDocs(collection(db, "users"));
        this.users = snap.docs.map((d) => {
          const data = d.data() || {};
          const createdAt = data.createdAt || data.registeredAt || null;
          
          let vipBalance = 0;
          let depositBalance = 0;
          
          if (typeof data.vipBalance === 'number') {
            vipBalance = data.vipBalance;
          } else if (typeof data.balance === 'number') {
            vipBalance = data.balance;
          }
          
          if (typeof data.depositBalance === 'number') {
            depositBalance = data.depositBalance;
          }
          
          return {
            id: d.id,
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            vipBalance: vipBalance,
            depositBalance: depositBalance,
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
      this.selectedBalanceType = 'depositBalance';
      this.showBalanceModal = true;
    },
    
    promptDeduct(user) {
      const a = prompt("أدخل مبلغ الخصم:");
      if (!a || isNaN(a)) return;
      this.balanceModalType = 'deduct';
      this.balanceModalUser = user;
      this.balanceModalAmount = Number(a);
      this.selectedBalanceType = 'vipBalance';
      this.showBalanceModal = true;
    },
    
    closeBalanceModal() {
      this.showBalanceModal = false;
      this.balanceModalUser = {};
      this.balanceModalAmount = 0;
      this.selectedBalanceType = 'depositBalance';
    },
    
    async confirmBalanceChange() {
      if (!this.balanceModalAmount || this.balanceModalAmount <= 0) {
        alert("الرجاء إدخال مبلغ صحيح");
        return;
      }
      
      const userId = this.balanceModalUser.id;
      const amount = this.balanceModalAmount;
      const balanceField = this.selectedBalanceType;
      const isAdd = this.balanceModalType === 'add';
      
      try {
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, "users", userId);
          const userSnap = await transaction.get(userRef);
          
          if (!userSnap.exists()) {
            throw new Error("المستخدم غير موجود");
          }
          
          const userData = userSnap.data();
          const currentBalance = userData[balanceField] || 0;
          
          let newBalance;
          if (isAdd) {
            newBalance = currentBalance + amount;
          } else {
            if (currentBalance < amount) {
              throw new Error(`رصيد ${balanceField === 'vipBalance' ? 'VIP' : 'الترقية'} غير كافٍ`);
            }
            newBalance = Math.max(0, currentBalance - amount);
          }
          
          transaction.update(userRef, {
            [balanceField]: newBalance
          });
        });
        
        await addDoc(collection(db, "transactions"), {
          userId: userId,
          userEmail: this.balanceModalUser.email || null,
          userPhone: this.balanceModalUser.phoneNumber || null,
          type: isAdd ? 'admin_recharge' : 'admin_deduct',
          amount: amount,
          balanceField: balanceField,
          currency: "USDT",
          status: "completed",
          adminEmail: this.currentUser?.email || "admin",
          createdAt: serverTimestamp()
        });
        
        alert(`✔ تم ${isAdd ? 'تعبئة' : 'خصم'} ${amount} USDT ${isAdd ? 'إلى' : 'من'} ${balanceField === 'vipBalance' ? 'رصيد VIP' : 'رصيد الترقية'}`);
        this.closeBalanceModal();
        this.loadUsers();
      } catch (e) {
        console.error("خطأ في تعديل الرصيد:", e);
        alert(e.message || "خطأ أثناء تعديل الرصيد");
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
            userId: data.userId,
            userPhone: data.userPhone || null,
            userEmail: data.userEmail || data.email,
            email: data.userEmail || data.email,
            amount: data.amount,
            network: data.network,
            wallet: data.wallet,
            walletAddress: data.walletAddress || data.wallet,
            vipLevel: data.vipLevel,
            withdrawDay: data.withdrawDay,
            withdrawFrom: data.withdrawFrom || 'vipBalance',
            oldBalance: data.oldBalance ?? null,
            createdAt,
          };
        });
      } catch (e) {
        alert("خطأ عند تحميل طلبات السحب");
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
    
    async updateTransactionDirectly(transactionId, updateData) {
      try {
        const transactionRef = doc(db, "transactions", transactionId);
        await updateDoc(transactionRef, {
          ...updateData,
          updatedAt: serverTimestamp()
        });
        console.log("✅ تم تحديث المعاملة:", transactionId);
        return true;
      } catch (error) {
        console.error("❌ خطأ في تحديث المعاملة:", error);
        return false;
      }
    },

    async createTransactionForUser(userId, email, phoneNumber, type, amount, status, reason = "", adminMessage = "", network = "", wallet = "", vipLevel = "", withdrawDay = "", targetBalance = "") {
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
          targetBalance: targetBalance,
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
        if (req.userId) {
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
            req.withdrawDay,
            req.withdrawFrom || 'vipBalance'
          );
        }

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
          withdrawFrom: req.withdrawFrom || 'vipBalance',
          createdAt: serverTimestamp(),
        });
        
        if (req.userId) {
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
        }
        
        const r = doc(db, "withdraw_requests", req.id);
        const ex = await getDoc(r);
        if (ex.exists()) await deleteDoc(r);
        
        alert("✔ تمت الموافقة");
        await this.loadWithdrawRequests();
        await this.loadWithdrawLogs();
      } catch (e) {
        console.error("خطأ في الموافقة:", e);
        alert("خطأ في الموافقة");
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
        const pRef = doc(db, "payments", r.id);
        await updateDoc(pRef, { 
          status: "approved", 
          processedAt: serverTimestamp(),
          adminMessage: message || "",
          targetBalance: "depositBalance"
        });

        if (r.userId) {
          let userPhone = r.userPhone || r.phoneNumber;
          if (!userPhone) {
            try {
              const userSnap = await getDoc(doc(db, "users", r.userId));
              if (userSnap.exists()) {
                userPhone = userSnap.data().phoneNumber || null;
              }
            } catch (err) {
              console.warn("Failed to get user phone:", err);
            }
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
            "",
            "depositBalance"
          );
        }

        await addDoc(collection(db, "recharge_logs"), {
          userId: r.userId || null,
          userPhone: r.userPhone || r.phoneNumber || null,
          email: r.userEmail || r.email || null,
          amount: r.amount || 0,
          type: "approved",
          adminMessage: message || "",
          network: r.network,
          txid: r.txid,
          targetBalance: "depositBalance",
          createdAt: serverTimestamp(),
        });

        if (r.userId) {
          const notificationMessage = message 
            ? `تمت إضافة ${r.amount} USDT إلى رصيد الترقية الخاص بك. ${message}`
            : `تمت إضافة ${r.amount} USDT إلى رصيد الترقية الخاص بك. شكراً لك.`;
            
          await addDoc(collection(db, "users", r.userId, "notifications"), {
            title: "تمت الموافقة على طلب التعبئة",
            message: notificationMessage,
            read: false,
            createdAt: serverTimestamp(),
          });

          try {
            const userRef = doc(db, "users", r.userId);
            await runTransaction(db, async (transaction) => {
              const uSnap = await transaction.get(userRef);
              if (uSnap.exists()) {
                const userData = uSnap.data();
                const currentDepositBalance = userData.depositBalance || 0;
                transaction.update(userRef, { 
                  depositBalance: currentDepositBalance + Number(r.amount || 0) 
                });
              }
            });

            await this.calculateAndAddReferralEarnings(r.userId, r.amount, r.id);

          } catch (err) {
            console.warn("failed to update user depositBalance after recharge approval:", err);
          }
        }

        alert("✔ تمت الموافقة على طلب التعبئة وتمت إضافة المبلغ إلى رصيد الترقية");
      } catch (e) {
        console.error("approveRecharge error:", e);
        alert("خطأ أثناء الموافقة على الطلب");
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeApproveModal();
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
        if (req.userId) {
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
            req.withdrawDay,
            req.withdrawFrom || 'vipBalance'
          );
        }

        if (req.userId && req.amount) {
          try {
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, "users", req.userId);
              const uSnap = await transaction.get(userRef);
              if (uSnap.exists()) {
                const userData = uSnap.data();
                const currentVipBalance = userData.vipBalance || 0;
                transaction.update(userRef, {
                  vipBalance: currentVipBalance + Number(req.amount)
                });
              }
            });
            console.log(`✅ تم إرجاع ${req.amount} USDT إلى vipBalance للمستخدم ${req.userId}`);
          } catch (err) {
            console.error("❌ خطأ في إرجاع الرصيد:", err);
          }
        }

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
          withdrawFrom: req.withdrawFrom || 'vipBalance',
          createdAt: serverTimestamp(),
        });

        if (req.userId) {
          await addDoc(
            collection(db, "users", req.userId, "notifications"),
            {
              title: "تم رفض طلب السحب",
              message: `تم رفض سحب ${req.amount} USDT. السبب: ${reason}. تم إرجاع المبلغ إلى رصيد VIP الخاص بك.`,
              read: false,
              createdAt: serverTimestamp(),
            }
          );
        }

        const r = doc(db, "withdraw_requests", req.id);
        const ex = await getDoc(r);
        if (ex.exists()) await deleteDoc(r);
        
        alert("❌ تم الرفض وإرجاع الرصيد إلى vipBalance");
        await this.loadWithdrawRequests();
        await this.loadWithdrawLogs();
      } catch (e) {
        console.error("خطأ في رفض الطلب:", e);
        alert("خطأ في رفض الطلب");
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeRejectModal();
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
        const snap = await getDocs(collection(db, "withdraw_logs"));
        this.withdrawLogs = snap.docs.map((d) => {
          const data = d.data() || {};
          return {
            id: d.id,
            ...data,
            userPhone: data.userPhone || null,
            email: data.email || data.userEmail,
            userEmail: data.userEmail || data.email,
            wallet: data.wallet || data.walletAddress || null,
            walletAddress: data.walletAddress || data.wallet || null,
            withdrawFrom: data.withdrawFrom || 'vipBalance',
          };
        });
      } catch (e) {
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
              type: data.type || '',
              amount: data.amount || 0,
              userPhone: data.userPhone || null,
              email: data.email || data.userEmail || '',
              userEmail: data.userEmail || data.email || '',
              reason: data.reason || '',
              adminMessage: data.adminMessage || '',
              network: data.network || '',
              txid: data.txid || '',
              targetBalance: data.targetBalance || 'depositBalance',
              createdAt: data.createdAt,
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
              targetBalance: data.targetBalance || 'depositBalance',
              createdAt: data.createdAt,
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
    
    // تم إزالة onSnapshot بالكامل واستخدام getDocs فقط
    // هذا يقلل بشكل كبير من عدد القراءات
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
            targetBalance: data.targetBalance || "depositBalance",
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
          level1: 5,
          level2: 2,
          level3: 1,
        };
        
        if (userData.invitedBy) {
          try {
            const level1Ref = doc(db, "users", userData.invitedBy);
            const level1Snap = await getDoc(level1Ref);
            
            if (level1Snap.exists()) {
              const level1Data = level1Snap.data();
              const level1Amount = (amount * commissionRates.level1) / 100;
              const newBalance = (level1Data.vipBalance || 0) + level1Amount;
              
              await updateDoc(level1Ref, { vipBalance: newBalance });
              
              await addDoc(collection(db, "referral_rewards"), {
                receiver: userData.invitedBy,
                fromUser: userId,
                amount: level1Amount,
                level: 1,
                targetBalance: 'vipBalance',
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
                targetBalance: 'vipBalance',
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
              
              console.log(`✅ إضافة ${level1Amount} USDT (${commissionRates.level1}%) للمستوى الأول إلى vipBalance: ${level1Data.email}`);
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
              const newBalance = (level2Data.vipBalance || 0) + level2Amount;
              
              await updateDoc(level2Ref, { vipBalance: newBalance });
              
              await addDoc(collection(db, "referral_rewards"), {
                receiver: userData.level2,
                fromUser: userId,
                amount: level2Amount,
                level: 2,
                targetBalance: 'vipBalance',
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
                targetBalance: 'vipBalance',
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
              
              console.log(`✅ إضافة ${level2Amount} USDT (${commissionRates.level2}%) للمستوى الثاني إلى vipBalance: ${level2Data.email}`);
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
              const newBalance = (level3Data.vipBalance || 0) + level3Amount;
              
              await updateDoc(level3Ref, { vipBalance: newBalance });
              
              await addDoc(collection(db, "referral_rewards"), {
                receiver: userData.level3,
                fromUser: userId,
                amount: level3Amount,
                level: 3,
                targetBalance: 'vipBalance',
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
                targetBalance: 'vipBalance',
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
              
              console.log(`✅ إضافة ${level3Amount} USDT (${commissionRates.level3}%) للمستوى الثالث إلى vipBalance: ${level3Data.email}`);
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
        const pRef = doc(db, "payments", r.id);
        await updateDoc(pRef, { status: "rejected", processedAt: serverTimestamp() });

        if (r.userId) {
          let userPhone = r.userPhone || r.phoneNumber;
          if (!userPhone) {
            try {
              const userSnap = await getDoc(doc(db, "users", r.userId));
              if (userSnap.exists()) {
                userPhone = userSnap.data().phoneNumber || null;
              }
            } catch (err) {
              console.warn("Failed to get user phone:", err);
            }
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
            "",
            "depositBalance"
          );
        }

        await addDoc(collection(db, "recharge_logs"), {
          userId: r.userId || null,
          userPhone: r.userPhone || r.phoneNumber || null,
          email: r.userEmail || r.email || null,
          amount: r.amount || 0,
          type: "rejected",
          reason: reason,
          network: r.network,
          txid: r.txid,
          targetBalance: "depositBalance",
          createdAt: serverTimestamp(),
        });

        if (r.userId) {
          await addDoc(collection(db, "users", r.userId, "notifications"), {
            title: "تم رفض طلب التعبئة",
            message: `تم رفض طلب تعبئة ${r.amount} USDT. السبب: ${reason}`,
            read: false,
            createdAt: serverTimestamp(),
          });
        }

        alert("❌ تم رفض طلب التعبئة");
      } catch (e) {
        console.error("rejectRecharge error:", e);
        alert("حدث خطأ أثناء رفض الطلب");
      } finally {
        this.processingId = null;
        this.closeModal();
        this.closeRejectModal();
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
        await addDoc(collection(db, "recharge_logs"), {
          userId: r.userId || null,
          userPhone: r.userPhone || r.phoneNumber || null,
          email: r.userEmail || r.email || null,
          amount: r.amount || 0,
          type: "deleted",
          network: r.network,
          txid: r.txid,
          targetBalance: "depositBalance",
          createdAt: serverTimestamp(),
        });
        alert("تم حذف الطلب");
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
    
    async markAllRechargeNotificationsReadServerSide() {
      alert("ميزة وضع الإشعارات كمقروءة تحتاج تنفيذ على حسب تصميم قاعدة البيانات.");
    },

    // ========== دالة حذف جميع سجلات المستخدم بالكامل ==========
    async confirmDeleteAllUserLogs(userId) {
      if (!userId) {
        alert("معرف المستخدم غير صالح");
        return;
      }
      
      const allowed = await this.ensureAdmin();
      if (!allowed) return alert("غير مصرح لك");
      
      // البحث عن المستخدم
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        alert("المستخدم غير موجود");
        return;
      }
      
      const userName = user.email || user.phoneNumber || userId;
      
      // حساب عدد السجلات قبل الحذف
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
      
      // رسالة تأكيد
      const confirmMessage = `
  ⚠️ تحذير: أنت على وشك حذف جميع سجلات المستخدم!
  
  📌 اسم المستخدم: ${userName}
  📌 رصيد VIP: ${user.vipBalance || 0} USDT
  📌 رصيد الترقية: ${user.depositBalance || 0} USDT
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
  • إعدادات العجلة الخاصة
  
  ⚠️ سيتم الاحتفاظ بحساب المستخدم نفسه (البريد، رقم الهاتف، الرصيد)
  ⚠️ هذا الإجراء لا يمكن التراجع عنه أبداً!
  `;
      
      if (!confirm(confirmMessage)) return;
      
      // تأكيد إضافي
      if (!confirm("تأكيد نهائي: هل أنت متأكد من حذف جميع سجلات هذا المستخدم نهائياً؟")) return;
      
      // تأكيد نهائي بكتابة "حذف"
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
          vipPurchases: 0,
          userWheelSettings: 0
        };
        
        // 1. حذف سجلات السحوبات
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
        
        // 2. حذف سجلات التعبئة
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
        
        // 3. حذف المعاملات
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
        
        // 4. حذف الإشعارات
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
        
        // 5. حذف سجل الإحالات
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
        
        // 6. حذف طلبات السحب المعلقة
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
        
        // 7. حذف طلبات التعبئة المعلقة
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
        
        // 8. حذف مشتريات VIP
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
        
        // 9. حذف إعدادات العجلة الخاصة
        try {
          const wheelSettingsRef = doc(db, "user_wheel_settings", userId);
          const wheelSettingsSnap = await getDoc(wheelSettingsRef);
          if (wheelSettingsSnap.exists()) {
            deletePromises.push(deleteDoc(wheelSettingsRef));
            deletedCounts.userWheelSettings = 1;
          }
        } catch (e) {
          console.log("⚠️ خطأ في حذف إعدادات العجلة:", e);
        }
        
        // تنفيذ جميع عمليات الحذف
        await Promise.all(deletePromises);
        
        // حساب إجمالي السجلات المحذوفة
        const totalDeleted = Object.values(deletedCounts).reduce((a, b) => a + b, 0);
        
        // تسجيل عملية الحذف في سجل الإدارة
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
        
        // تحديث القوائم المحلية
        this.accountWithdrawHistory = [];
        this.accountRechargeHistory = [];
        this.showWithdrawHistory = false;
        this.showRechargeHistory = false;
        
        // إعادة تحميل السجلات العامة
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
  • إعدادات العجلة: ${deletedCounts.userWheelSettings}
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

.wheel-settings-btn {
  background: #ff9800;
  color: #0A0C10;
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

.user-wheel-modal {
  max-width: 450px;
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

.balance-type-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: #1A1F2A;
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  cursor: pointer;
}

.radio-label input {
  margin: 0;
}

.radio-label span {
  color: #D4AF37;
  font-weight: 600;
}

.radio-label small {
  color: rgba(255, 255, 255, 0.5);
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

.wheel-settings-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.form-group label {
  width: 150px;
  font-weight: 600;
  color: #D4AF37;
}

.settings-input {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  background: #1A1F2A;
  color: white;
  font-size: 14px;
}

.settings-input:focus {
  outline: none;
  border-color: #D4AF37;
}

.value-display {
  min-width: 60px;
  color: #D4AF37;
  font-weight: bold;
}

.hint {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  margin-right: 8px;
}

.total-info {
  padding: 10px;
  border-radius: 6px;
  background: #1A1F2A;
  text-align: center;
}

.total-info.error {
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid #dc3545;
}

.total-info .error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.total-info .success-message {
  color: #28a745;
  font-size: 12px;
  margin-top: 5px;
}

.preview {
  margin-top: 15px;
  padding: 10px;
  background: #1A1F2A;
  border-radius: 8px;
}

.preview h3 {
  font-size: 12px;
  margin-bottom: 10px;
  text-align: center;
}

.preview-bars {
  display: flex;
  height: 30px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 10px;
  font-weight: bold;
}

.preview-bars .bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 0 2px black;
}

.bar.loss {
  background: #dc3545;
}

.bar.small-win {
  background: #ff9800;
}

.bar.big-win {
  background: #28a745;
}

.save-btn {
  background: linear-gradient(135deg, #D4AF37, #F6E27A, #C5A028);
  color: #0A0C10;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.save-message {
  margin-top: 10px;
  padding: 8px;
  border-radius: 6px;
  text-align: center;
  font-size: 12px;
}

.save-message.success {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid #28a745;
}

.save-message.error {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid #dc3545;
}

.global-settings-info {
  padding: 10px;
  background: #1A1F2A;
  border-radius: 6px;
  margin-top: 10px;
}

.global-preview {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.global-preview .preview-item {
  padding: 4px 8px;
  background: #11151C;
  border-radius: 4px;
  font-size: 11px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.user-settings-form {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
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

.referred-users {
  margin-top: 15px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  padding-top: 10px;
}

.referred-users h4 {
  font-size: 12px;
  color: #D4AF37;
  margin-bottom: 8px;
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
  
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-group label {
    width: auto;
  }
  
  .settings-input {
    width: 100%;
  }
}
</style>
