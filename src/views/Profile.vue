<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-container">
      <div class="gold-spinner"></div>
      <p class="loading-text">جاري تحميل بيانات الحساب...</p>
    </div>

    <div v-else class="profile-container">
      <!-- رأس الصفحة -->
      <div class="profile-header">
        <div class="avatar-box">
          <div class="avatar-circle" :style="avatarStyle">
            <span v-if="!userData.avatar">{{ userData.username ? userData.username.charAt(0).toUpperCase() : 'U' }}</span>
          </div>
        </div>
        <h2 class="username-display">{{ userData.username || "المستخدم" }}</h2>
        <p class="user-email">{{ userData.email || "" }}</p>
      </div>

      <!-- قسم معلومات الحساب -->
      <div class="fields-section">
        <h3 class="section-label"><i class="fas fa-user-circle"></i> معلومات الحساب</h3>
        
        <div class="gold-field">
          <label><i class="fas fa-id-badge"></i> معرف المستخدم (ID)</label>
          <div class="field-input-group">
            <input type="text" :value="userData.uid" readonly class="gold-input-field">
            <button class="field-action-btn" @click="copy(userData.uid)">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="gold-field">
          <label><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
          <div class="field-input-group">
            <input type="text" :value="userData.email || 'غير مسجل'" readonly class="gold-input-field">
            <button class="field-action-btn" @click="copy(userData.email)" v-if="userData.email">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="gold-field">
          <label><i class="fas fa-phone-alt"></i> رقم الهاتف</label>
          <div class="field-input-group">
            <input type="text" :value="userData.phoneNumber || 'لم يتم الربط بعد'" readonly class="gold-input-field">
            <button class="field-action-btn link-btn" @click="openPhoneModal">
              <i class="fas fa-link"></i> {{ userData.phoneNumber ? 'تحديث' : 'ربط الآن' }}
            </button>
          </div>
        </div>

        <div class="gold-field" v-if="userData.referralCode">
          <label><i class="fas fa-share-nodes"></i> كود الإحالة الخاص بك</label>
          <div class="field-input-group">
            <input type="text" :value="userData.referralCode" readonly class="gold-input-field highlight-gold">
            <button class="field-action-btn" @click="copy(userData.referralCode)">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- قسم الرصيد -->
      <div class="fields-section">
        <h3 class="section-label"><i class="fas fa-chart-line"></i> الرصيد والبيانات</h3>
        
        <div class="gold-field balance-field">
          <label><i class="fas fa-wallet"></i> الرصيد القابل للسحب (USDT)</label>
          <div class="field-input-group">
            <input type="text" :value="Number(vipBalance).toFixed(2)" readonly class="gold-input-field balance-text">
            <span class="currency-tag">USDT</span>
          </div>
        </div>

        <div class="gold-field">
          <label><i class="fas fa-calendar-day"></i> تاريخ الانضمام</label>
          <input type="text" :value="formattedDate" readonly class="gold-input-field">
        </div>
      </div>

      <!-- الأزرار -->
      <div class="action-buttons">
        <button class="main-gold-btn" @click="openEditProfileModal">
          <i class="fas fa-user-edit"></i> تعديل الملف الشخصي
        </button>
        
        <button class="main-gold-btn" @click="openChangePasswordModal">
          <i class="fas fa-key"></i> تغيير كلمة المرور
        </button>
        
        <button class="outline-gold-btn" @click="copyReferralLink" v-if="userData.referralCode">
          <i class="fas fa-link"></i> نسخ رابط الدعوة
        </button>

        <button class="danger-btn" @click="confirmLogout">
          <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
        </button>
      </div>
    </div>

    <!-- نافذة تعديل الملف الشخصي -->
    <transition name="modal-fade-scale">
      <div v-if="showEditProfileModal" class="custom-modal-overlay" @click.self="closeEditProfileModal">
        <div class="custom-modal-container small">
          <div class="custom-modal-header info">
            <div class="header-icon">
              <i class="fas fa-user-edit"></i>
            </div>
            <h3>تعديل الملف الشخصي</h3>
            <button class="modal-close-btn" @click="closeEditProfileModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="custom-modal-body">
            <!-- قسم الصورة -->
            <div class="edit-avatar-section">
              <div class="edit-avatar-circle" :style="editAvatarStyle">
                <span v-if="!editAvatarPreview && !userData.avatar">{{ editUsername ? editUsername.charAt(0).toUpperCase() : 'U' }}</span>
              </div>
              <div class="avatar-upload-buttons">
                <label class="upload-avatar-btn">
                  <i class="fas fa-camera"></i> اختيار صورة
                  <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;">
                </label>
                <button v-if="editAvatarPreview || userData.avatar" class="remove-avatar-btn" @click="removeAvatar">
                  <i class="fas fa-trash-alt"></i> إزالة
                </button>
              </div>
            </div>

            <!-- قسم الاسم -->
            <div class="gold-field">
              <label><i class="fas fa-user"></i> اسم المستخدم</label>
              <input 
                type="text" 
                v-model="editUsername" 
                placeholder="أدخل اسم المستخدم الجديد"
                class="gold-input-field"
                maxlength="30"
              >
            </div>
            
            <p v-if="editProfileError" class="error-txt">{{ editProfileError }}</p>
          </div>
          
          <div class="custom-modal-footer">
            <button class="modal-btn modal-btn-primary" @click="saveProfileChanges" :disabled="editProfileLoading">
              <i class="fas fa-save"></i> {{ editProfileLoading ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
            </button>
          </div>
          <div class="modal-gold-line"></div>
        </div>
      </div>
    </transition>

    <!-- نافذة منبثقة عامة -->
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

    <!-- نافذة ربط الهاتف -->
    <transition name="modal-fade-scale">
      <div v-if="showPhoneModal" class="custom-modal-overlay" @click.self="closePhoneModal">
        <div class="custom-modal-container small">
          <div class="custom-modal-header info">
            <div class="header-icon">
              <i class="fas fa-mobile-screen-button"></i>
            </div>
            <h3>ربط رقم الهاتف</h3>
            <button class="modal-close-btn" @click="closePhoneModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="custom-modal-body">
            <div class="gold-field">
              <label>اختر الدولة ورقم الهاتف</label>
              <div class="phone-input-box">
                <select v-model="phoneForm.countryCode" class="country-select" @change="updatePhoneLimit">
                  <option value="">اختر الرمز</option>
                  <option value="+964">🇮🇶 العراق (+964)</option>
                  <option value="+966">🇸🇦 السعودية (+966)</option>
                  <option value="+971">🇦🇪 الإمارات (+971)</option>
                  <option value="+965">🇰🇼 الكويت (+965)</option>
                  <option value="+974">🇶🇦 قطر (+974)</option>
                  <option value="+973">🇧🇭 البحرين (+973)</option>
                  <option value="+968">🇴🇲 عمان (+968)</option>
                  <option value="+962">🇯🇴 الأردن (+962)</option>
                  <option value="+20">🇪🇬 مصر (+20)</option>
                  <option value="+963">🇸🇾 سوريا (+963)</option>
                  <option value="+961">🇱🇧 لبنان (+961)</option>
                  <option value="+218">🇱🇾 ليبيا (+218)</option>
                  <option value="+216">🇹🇳 تونس (+216)</option>
                  <option value="+213">🇩🇿 الجزائر (+213)</option>
                  <option value="+212">🇲🇦 المغرب (+212)</option>
                  <option value="+222">🇲🇷 موريتانيا (+222)</option>
                  <option value="+249">🇸🇩 السودان (+249)</option>
                  <option value="+967">🇾🇪 اليمن (+967)</option>
                  <option value="+970">🇵🇸 فلسطين (+970)</option>
                  <option value="+90">🇹🇷 تركيا (+90)</option>
                  <option value="+44">🇬🇧 بريطانيا (+44)</option>
                  <option value="+1">🇺🇸 أمريكا (+1)</option>
                  <option value="+49">🇩🇪 ألمانيا (+49)</option>
                  <option value="+33">🇫🇷 فرنسا (+33)</option>
                  <option value="+39">🇮🇹 إيطاليا (+39)</option>
                  <option value="+34">🇪🇸 إسبانيا (+34)</option>
                  <option value="+31">🇳🇱 هولندا (+31)</option>
                  <option value="+46">🇸🇪 السويد (+46)</option>
                  <option value="+47">🇳🇴 النرويج (+47)</option>
                  <option value="+45">🇩🇰 الدنمارك (+45)</option>
                  <option value="+358">🇫🇮 فنلندا (+358)</option>
                  <option value="+41">🇨🇭 سويسرا (+41)</option>
                  <option value="+43">🇦🇹 النمسا (+43)</option>
                  <option value="+32">🇧🇪 بلجيكا (+32)</option>
                  <option value="+48">🇵🇱 بولندا (+48)</option>
                  <option value="+420">🇨🇿 التشيك (+420)</option>
                  <option value="+36">🇭🇺 المجر (+36)</option>
                  <option value="+40">🇷🇴 رومانيا (+40)</option>
                  <option value="+359">🇧🇬 بلغاريا (+359)</option>
                  <option value="+30">🇬🇷 اليونان (+30)</option>
                  <option value="+351">🇵🇹 البرتغال (+351)</option>
                  <option value="+7">🇷🇺 روسيا (+7)</option>
                  <option value="+380">🇺🇦 أوكرانيا (+380)</option>
                  <option value="+375">🇧🇾 بيلاروسيا (+375)</option>
                  <option value="+86">🇨🇳 الصين (+86)</option>
                  <option value="+91">🇮🇳 الهند (+91)</option>
                  <option value="+92">🇵🇰 باكستان (+92)</option>
                  <option value="+81">🇯🇵 اليابان (+81)</option>
                  <option value="+82">🇰🇷 كوريا الجنوبية (+82)</option>
                </select>
                <input 
                  type="tel" 
                  v-model="phoneForm.phone" 
                  placeholder="رقم الهاتف" 
                  class="gold-input-field"
                  @input="handlePhoneInput"
                >
              </div>
              <p class="phone-hint" v-if="phoneForm.countryCode">
                <i class="fas fa-info-circle"></i> 
                يجب إدخال <span>{{ phoneLimit }}</span> أرقام لهذا الرمز (أدخلت: {{ phoneForm.phone.length }})
              </p>
            </div>
            <div class="gold-field">
              <label>كلمة المرور للتأكيد</label>
              <input type="password" v-model="phoneForm.password" placeholder="أدخل كلمة المرور" class="gold-input-field">
            </div>
            <p v-if="phoneError" class="error-txt">{{ phoneError }}</p>
          </div>
          
          <div class="custom-modal-footer">
            <button class="modal-btn modal-btn-primary" @click="updatePhoneNumber" :disabled="phoneLoading">
              {{ phoneLoading ? 'جاري المعالجة...' : 'تأكيد الربط' }}
            </button>
          </div>
          <div class="modal-gold-line"></div>
        </div>
      </div>
    </transition>

    <!-- نافذة تغيير كلمة المرور -->
    <transition name="modal-fade-scale">
      <div v-if="showChangePasswordModal" class="custom-modal-overlay" @click.self="closeChangePasswordModal">
        <div class="custom-modal-container small">
          <div class="custom-modal-header info">
            <div class="header-icon">
              <i class="fas fa-key"></i>
            </div>
            <h3>تغيير كلمة المرور</h3>
            <button class="modal-close-btn" @click="closeChangePasswordModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="custom-modal-body">
            <div class="gold-field">
              <label>كلمة المرور الحالية</label>
              <input type="password" v-model="passwordForm.currentPassword" placeholder="أدخل كلمة المرور الحالية" class="gold-input-field">
            </div>
            <div class="gold-field">
              <label>كلمة المرور الجديدة</label>
              <input type="password" v-model="passwordForm.newPassword" placeholder="أدخل كلمة المرور الجديدة" class="gold-input-field">
            </div>
            <div class="gold-field">
              <label>تأكيد كلمة المرور الجديدة</label>
              <input type="password" v-model="passwordForm.confirmPassword" placeholder="أكد كلمة المرور الجديدة" class="gold-input-field">
            </div>
            <p v-if="passwordError" class="error-txt">{{ passwordError }}</p>
          </div>
          
          <div class="custom-modal-footer">
            <button class="modal-btn modal-btn-primary" @click="updatePassword" :disabled="passwordLoading">
              {{ passwordLoading ? 'جاري التحديث...' : 'حفظ التغييرات' }}
            </button>
          </div>
          <div class="modal-gold-line"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, db, cacheManager, batchUpdateUserData } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";

// ==================== PROFILE CACHE MANAGER ====================
class ProfileCacheManager {
  static CACHE_PREFIX = 'profile_data';
  static AVATAR_PREFIX = 'user_avatar_';
  
  static getProfileFromCache(userId) {
    try {
      const cacheKey = `${this.CACHE_PREFIX}_${userId}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        // الكاش صالح لمدة 10 دقائق
        if (now - parsed.timestamp < 10 * 60 * 1000) {
          return parsed.data;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  
  static setProfileToCache(userId, data) {
    try {
      const cacheKey = `${this.CACHE_PREFIX}_${userId}`;
      const cacheData = {
        data: data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Failed to cache profile:', e);
    }
  }
  
  static clearProfileCache(userId) {
    try {
      const cacheKey = `${this.CACHE_PREFIX}_${userId}`;
      sessionStorage.removeItem(cacheKey);
    } catch (e) {
      console.warn('Failed to clear profile cache:', e);
    }
  }
  
  static saveAvatarToLocal(userId, avatarData) {
    if (avatarData) {
      localStorage.setItem(`${this.AVATAR_PREFIX}${userId}`, avatarData);
    } else {
      localStorage.removeItem(`${this.AVATAR_PREFIX}${userId}`);
    }
  }
  
  static getAvatarFromLocal(userId) {
    return localStorage.getItem(`${this.AVATAR_PREFIX}${userId}`);
  }
}

export default {
  name: "Profile",
  data() {
    return {
      loading: true,
      showChangePasswordModal: false,
      showPhoneModal: false,
      showEditProfileModal: false,
      passwordLoading: false,
      phoneLoading: false,
      editProfileLoading: false,
      passwordError: "",
      phoneError: "",
      editProfileError: "",
      phoneLimit: 9,
      editUsername: "",
      editAvatarPreview: null,
      selectedImageFile: null,
      passwordForm: { currentPassword: "", newPassword: "", confirmPassword: "" },
      phoneForm: { countryCode: "+966", phone: "", password: "" },
      userData: { 
        email: "", 
        phoneNumber: "", 
        uid: "", 
        createdAt: "", 
        username: "", 
        referralCode: "",
        avatar: ""
      },
      vipBalance: 0,
      unsubscribeUser: null,
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
      _isDestroyed: false,
      _authUnsubscribe: null
    };
  },
  
  computed: {
    formattedDate() {
      if (!this.userData.createdAt) return "غير متوفر";
      let date;
      if (this.userData.createdAt.toDate) {
        date = this.userData.createdAt.toDate();
      } else if (this.userData.createdAt.seconds) {
        date = new Date(this.userData.createdAt.seconds * 1000);
      } else {
        date = new Date(this.userData.createdAt);
      }
      return isNaN(date.getTime()) ? "غير متوفر" : date.toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' });
    },
    referralLink() { return `${window.location.origin}/register?ref=${this.userData.referralCode}`; },
    
    avatarStyle() {
      if (this.userData.avatar && this.userData.avatar.startsWith('data:image')) {
        return { backgroundImage: `url(${this.userData.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      }
      return {};
    },
    
    editAvatarStyle() {
      if (this.editAvatarPreview && this.editAvatarPreview.startsWith('data:image')) {
        return { backgroundImage: `url(${this.editAvatarPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      }
      if (this.userData.avatar && this.userData.avatar.startsWith('data:image')) {
        return { backgroundImage: `url(${this.userData.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      }
      return {};
    }
  },
  
  created() { 
    this.initProfile();
  },
  
  beforeUnmount() {
    this.cleanup();
  },
  
  methods: {
    /**
     * تنظيف جميع الموارد عند مغادرة الصفحة
     */
    cleanup() {
      this._isDestroyed = true;
      
      // إلغاء الاشتراك في Auth
      if (this._authUnsubscribe) {
        this._authUnsubscribe();
        this._authUnsubscribe = null;
      }
      
      // إلغاء الاشتراك في Firestore
      if (this.unsubscribeUser) {
        this.unsubscribeUser();
        this.unsubscribeUser = null;
      }
      
      // إغلاق جميع النوافذ
      this.showEditProfileModal = false;
      this.showChangePasswordModal = false;
      this.showPhoneModal = false;
      this.modal.visible = false;
      
      // استعادة التمرير
      document.body.style.overflow = 'auto';
    },
    
    /**
     * تهيئة الملف الشخصي مع نظام الكاش
     */
    async initProfile() {
      try {
        // محاولة تحميل البيانات من الكاش أولاً
        const cachedUser = auth.currentUser ? ProfileCacheManager.getProfileFromCache(auth.currentUser.uid) : null;
        
        this._authUnsubscribe = onAuthStateChanged(auth, async (user) => {
          if (this._isDestroyed) return;
          
          if (!user) { 
            this.loading = false; 
            this.$router.push("/login"); 
            return; 
          }
          
          try {
            // إذا كانت البيانات موجودة في الكاش، عرضها فوراً
            if (cachedUser && cachedUser.uid === user.uid) {
              this.applyUserData(cachedUser);
              this.loading = false;
            }
            
            // إعداد المستمع المباشر
            await this.setupRealtimeListener(user);
            
          } catch (err) {
            if (!this._isDestroyed) {
              console.error("Error loading profile:", err); 
              this.showError("حدث خطأ في تحميل البيانات");
              this.loading = false;
            }
          }
        });
        
      } catch (err) {
        console.error("Error in initProfile:", err);
        this.loading = false;
      }
    },
    
    /**
     * تطبيق بيانات المستخدم
     */
    applyUserData(data) {
      if (this._isDestroyed) return;
      
      this.userData = {
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        uid: data.uid || "",
        createdAt: data.createdAt || "",
        username: data.username || (data.email ? data.email.split("@")[0] : "مستخدم"),
        referralCode: data.referralCode || "",
        avatar: data.avatar || ""
      };
      
      this.vipBalance = typeof data.vipBalance === 'number' ? data.vipBalance : 0;
      this.editUsername = this.userData.username;
      
      // تحميل الصورة الرمزية المحلية
      const localAvatar = ProfileCacheManager.getAvatarFromLocal(data.uid);
      if (localAvatar && !this.userData.avatar) {
        this.userData.avatar = localAvatar;
      }
    },
    
    /**
     * إعداد مستمع Firestore مع تحسينات
     */
    async setupRealtimeListener(user) {
      if (this._isDestroyed) return;
      
      // إلغاء المستمع السابق
      if (this.unsubscribeUser) {
        this.unsubscribeUser();
        this.unsubscribeUser = null;
      }
      
      const userRef = doc(db, "users", user.uid);
      
      // استخدام متغير لتتبع أول تحميل
      let isFirstLoad = true;
      
      this.unsubscribeUser = onSnapshot(userRef, 
        (docSnap) => {
          if (this._isDestroyed) return;
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            const userData = {
              email: data.email || user.email || "",
              phoneNumber: data.phoneNumber || "",
              uid: user.uid,
              createdAt: data.createdAt || user.metadata.creationTime,
              username: data.username || (data.email ? data.email.split("@")[0] : "مستخدم"),
              referralCode: data.referralCode || user.uid.substring(0, 6),
              avatar: data.avatar || "",
              vipBalance: typeof data.vipBalance === 'number' ? data.vipBalance : 0
            };
            
            this.applyUserData(userData);
            
            // تخزين في الكاش للتحديثات المستقبلية
            ProfileCacheManager.setProfileToCache(user.uid, userData);
            
            if (isFirstLoad) {
              isFirstLoad = false;
              this.loading = false;
            }
          }
        },
        (error) => {
          if (!this._isDestroyed) {
            console.error("Listener error:", error);
            this.loading = false;
          }
        }
      );
    },
    
    // ==================== MODAL METHODS ====================
    showModal(options) {
      if (this._isDestroyed) return;
      
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
      if (this._isDestroyed) return;
      
      this.modal.visible = false;
      document.body.style.overflow = 'auto';
      this.modal.callback = null;
    },

    handleConfirm() {
      if (this._isDestroyed) return;
      
      if (this.modal.callback) {
        this.modal.callback();
      }
      this.closeModal();
    },

    showSuccess(message) {
      this.showModal({
        type: 'success',
        title: 'تم بنجاح',
        message: message,
        buttonText: 'حسناً'
      });
    },

    showError(message) {
      this.showModal({
        type: 'error',
        title: 'خطأ',
        message: message,
        buttonText: 'حسناً'
      });
    },

    showConfirm(title, message, callback) {
      this.showModal({
        type: 'confirm',
        title: title,
        message: message,
        confirmText: 'تأكيد',
        cancelText: 'إلغاء',
        callback: callback
      });
    },

    // ==================== AVATAR METHODS ====================
    saveAvatarToLocal(avatarData) {
      ProfileCacheManager.saveAvatarToLocal(this.userData.uid, avatarData);
    },

    loadLocalAvatar() {
      const savedAvatar = ProfileCacheManager.getAvatarFromLocal(this.userData.uid);
      if (savedAvatar && !this.userData.avatar) {
        this.userData.avatar = savedAvatar;
      }
    },

    // ==================== PROFILE EDIT METHODS ====================
    openEditProfileModal() {
      if (this._isDestroyed) return;
      
      this.editUsername = this.userData.username;
      this.editAvatarPreview = null;
      this.selectedImageFile = null;
      this.editProfileError = "";
      this.showEditProfileModal = true;
      document.body.style.overflow = 'hidden';
    },

    closeEditProfileModal() {
      this.showEditProfileModal = false;
      document.body.style.overflow = 'auto';
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        this.editProfileError = "الرجاء اختيار ملف صورة صالح";
        return;
      }
      
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.editAvatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.editProfileError = "";
    },

    removeAvatar() {
      this.editAvatarPreview = null;
      this.selectedImageFile = null;
    },

    validateUsername(name) {
      if (!name || name.trim().length === 0) {
        return "الاسم لا يمكن أن يكون فارغاً";
      }
      if (name.length > 30) {
        return "الاسم طويل جداً (الحد الأقصى 30 حرف)";
      }
      if (name.length < 3) {
        return "الاسم قصير جداً (الحد الأدنى 3 أحرف)";
      }
      const validRegex = /^[\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9\s]+$/;
      if (!validRegex.test(name)) {
        return "الاسم يحتوي على أحرف غير مسموحة";
      }
      return null;
    },

    async saveProfileChanges() {
      if (this._isDestroyed) return;
      
      const validationError = this.validateUsername(this.editUsername);
      if (validationError) {
        this.editProfileError = validationError;
        return;
      }

      this.editProfileLoading = true;
      this.editProfileError = "";

      try {
        const user = auth.currentUser;
        if (!user) throw new Error("المستخدم غير مسجل الدخول");
        
        // تجهيز التحديثات في كائن واحد
        const updates = { 
          username: this.editUsername.trim()
        };
        
        if (this.selectedImageFile) {
          const reader = new FileReader();
          const avatarBase64 = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(this.selectedImageFile);
          });
          
          this.saveAvatarToLocal(avatarBase64);
          updates.avatar = avatarBase64;
          this.userData.avatar = avatarBase64;
        } else if (this.editAvatarPreview === null && this.userData.avatar) {
          this.saveAvatarToLocal(null);
          updates.avatar = "";
          this.userData.avatar = "";
        }
        
        // استخدام التحديث المجمع لتقليل عمليات الكتابة
        await batchUpdateUserData(user.uid, updates);
        
        // تحديث Auth Profile إذا تغير الاسم
        if (updates.username !== this.userData.username) {
          try {
            await updateProfile(user, { displayName: updates.username });
          } catch (e) {
            console.log("Auth profile update skipped:", e.message);
          }
        }
        
        this.userData.username = this.editUsername.trim();
        
        // تحديث الكاش
        ProfileCacheManager.setProfileToCache(user.uid, this.userData);
        
        this.closeEditProfileModal();
        this.showSuccess("تم تحديث الملف الشخصي بنجاح ✓");
        
      } catch (error) {
        console.error("Error updating profile:", error);
        this.editProfileError = "حدث خطأ في تحديث الملف الشخصي، يرجى المحاولة مرة أخرى";
      } finally {
        if (!this._isDestroyed) {
          this.editProfileLoading = false;
        }
      }
    },

    // ==================== UTILITY METHODS ====================
    copy(text) { 
      if (!text || this._isDestroyed) return; 
      navigator.clipboard.writeText(text); 
      this.showSuccess("تم النسخ بنجاح ✓");
    },

    copyReferralLink() { this.copy(this.referralLink); },

    // ==================== PASSWORD METHODS ====================
    openChangePasswordModal() { 
      if (this._isDestroyed) return;
      
      this.showChangePasswordModal = true; 
      this.passwordError = ""; 
      this.passwordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };
      document.body.style.overflow = 'hidden';
    },
    
    closeChangePasswordModal() { 
      this.showChangePasswordModal = false; 
      document.body.style.overflow = 'auto';
    },
    
    translateError(error) {
      const code = error.code || error.message;
      if (code.includes('wrong-password') || code.includes('invalid-credential')) {
        return 'كلمة المرور غير صحيحة';
      }
      switch (code) {
        case 'auth/user-not-found': return 'المستخدم غير موجود';
        case 'auth/too-many-requests': return 'محاولات كثيرة جداً، يرجى المحاولة لاحقاً';
        case 'auth/network-request-failed': return 'خطأ في الاتصال بالشبكة';
        case 'auth/weak-password': return 'كلمة المرور الجديدة ضعيفة جداً';
        default: return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
      }
    },

    async updatePassword() {
      if (this._isDestroyed) return;
      
      this.passwordError = "";
      if (!this.passwordForm.currentPassword) { 
        this.passwordError = "يرجى إدخال كلمة المرور الحالية"; 
        return; 
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) { 
        this.passwordError = "كلمات المرور الجديدة غير متطابقة"; 
        return; 
      }
      if (this.passwordForm.newPassword.length < 6) {
        this.passwordError = "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل";
        return;
      }
      
      this.passwordLoading = true;
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, this.passwordForm.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, this.passwordForm.newPassword);
        this.closeChangePasswordModal();
        this.showSuccess("تم تحديث كلمة المرور بنجاح ✓");
      } catch (e) { 
        this.passwordError = this.translateError(e);
      } finally {
        if (!this._isDestroyed) {
          this.passwordLoading = false;
        }
      }
    },

    // ==================== PHONE METHODS ====================
    openPhoneModal() { 
      if (this._isDestroyed) return;
      
      this.showPhoneModal = true; 
      this.phoneError = ""; 
      this.phoneForm = { countryCode: "+966", phone: "", password: "" };
      this.updatePhoneLimit(); 
      document.body.style.overflow = 'hidden';
    },
    
    closePhoneModal() { 
      this.showPhoneModal = false; 
      document.body.style.overflow = 'auto';
    },
    
    updatePhoneLimit() {
      const limits = {
        "+964": 10, "+966": 9, "+971": 9, "+965": 8, "+974": 8, "+973": 8, 
        "+968": 8, "+962": 9, "+20": 10, "+963": 9, "+961": 8, "+218": 9,
        "+216": 8, "+213": 9, "+212": 9, "+222": 8, "+249": 9, "+967": 9,
        "+970": 9, "+90": 10, "+44": 10, "+1": 10, "+49": 11, "+33": 9,
        "+39": 10, "+34": 9, "+31": 9, "+46": 9, "+47": 8, "+45": 8,
        "+358": 9, "+41": 9, "+43": 10, "+32": 9, "+48": 9, "+420": 9,
        "+36": 9, "+40": 9, "+359": 9, "+30": 10, "+351": 9, "+7": 10,
        "+380": 9, "+375": 9, "+86": 11, "+91": 10, "+92": 10, "+81": 10,
        "+82": 10
      };
      this.phoneLimit = limits[this.phoneForm.countryCode] || 10;
      if (this.phoneForm.phone.length > this.phoneLimit) {
        this.phoneForm.phone = this.phoneForm.phone.substring(0, this.phoneLimit);
      }
    },

    handlePhoneInput(e) {
      this.phoneForm.phone = e.target.value.replace(/\D/g, '');
      if (this.phoneForm.phone.length > this.phoneLimit) {
        this.phoneForm.phone = this.phoneForm.phone.substring(0, this.phoneLimit);
      }
    },

    async updatePhoneNumber() {
      if (this._isDestroyed) return;
      
      this.phoneError = "";
      if (!this.phoneForm.countryCode) { 
        this.phoneError = "الرجاء اختيار رمز الدولة"; 
        return; 
      }
      if (this.phoneForm.phone.length !== this.phoneLimit) { 
        this.phoneError = `رقم الهاتف لهذه الدولة يجب أن يكون ${this.phoneLimit} أرقام`; 
        return; 
      }
      if (!this.phoneForm.password) { 
        this.phoneError = "الرجاء إدخال كلمة المرور للتأكيد"; 
        return; 
      }
      
      this.phoneLoading = true;
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, this.phoneForm.password);
        await reauthenticateWithCredential(user, credential);
        const fullPhone = this.phoneForm.countryCode + this.phoneForm.phone;
        
        // استخدام التحديث المجمع
        await batchUpdateUserData(user.uid, { phoneNumber: fullPhone });
        
        this.userData.phoneNumber = fullPhone;
        this.closePhoneModal();
        this.showSuccess("تم ربط رقم الهاتف بنجاح ✓");
      } catch (e) { 
        this.phoneError = this.translateError(e);
      } finally {
        if (!this._isDestroyed) {
          this.phoneLoading = false;
        }
      }
    },

    // ==================== LOGOUT METHOD ====================
    confirmLogout() {
      if (this._isDestroyed) return;
      
      this.showConfirm(
        'تسجيل الخروج',
        'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
        async () => {
          // تنظيف الموارد
          this.cleanup();
          
          // مسح كاش المستخدم
          if (auth.currentUser) {
            ProfileCacheManager.clearProfileCache(auth.currentUser.uid);
          }
          
          // تسجيل الخروج
          await signOut(auth);
          this.$router.push("/login");
        }
      );
    }
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  color: #ffffff;
  padding: 20px;
  padding-top: 60px;
  padding-bottom: 100px;
  direction: rtl;
  font-family: 'Cairo', sans-serif;
}

.profile-container {
  max-width: 450px;
  margin: 0 auto;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-box {
  position: relative;
  display: inline-block;
  margin-bottom: 15px;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border: 2px solid #D4AF37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  color: #D4AF37;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
  background-size: cover;
  background-position: center;
}

.username-display {
  font-size: 20px;
  color: #F6E27A;
  font-weight: 700;
  margin-bottom: 5px;
}

.user-email {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.edit-avatar-section {
  text-align: center;
  margin-bottom: 25px;
}

.edit-avatar-circle {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  border: 2px solid #D4AF37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: bold;
  color: #D4AF37;
  margin: 0 auto 15px;
  background-size: cover;
  background-position: center;
}

.avatar-upload-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.upload-avatar-btn {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid #D4AF37;
  color: #D4AF37;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.upload-avatar-btn:hover {
  background: #D4AF37;
  color: #0f1419;
}

.remove-avatar-btn {
  background: rgba(255, 68, 68, 0.15);
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.remove-avatar-btn:hover {
  background: #ff4444;
  color: #fff;
}

.fields-section {
  margin-bottom: 25px;
  background: linear-gradient(135deg, #1a1f2e, #0f1419);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.section-label {
  font-size: 16px;
  color: #D4AF37;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.gold-field {
  margin-bottom: 18px;
}

.gold-field label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
  margin-right: 4px;
}

.field-input-group {
  display: flex;
  gap: 8px;
}

.gold-input-field {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  width: 100%;
}

.gold-input-field:focus {
  border-color: #D4AF37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

.highlight-gold {
  color: #D4AF37 !important;
  font-weight: bold;
}

.field-action-btn {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid #D4AF37;
  color: #D4AF37;
  padding: 0 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.field-action-btn:hover {
  background: #D4AF37;
  color: #0f1419;
  transform: translateY(-2px);
}

.link-btn {
  min-width: 90px;
  justify-content: center;
  font-weight: 700;
}

.balance-field .gold-input-field {
  border-color: #D4AF37;
  background: rgba(212, 175, 55, 0.05);
}

.balance-text {
  font-size: 24px !important;
  font-weight: 900 !important;
  color: #F6E27A !important;
  text-align: center;
}

.currency-tag {
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0f1419;
  padding: 0 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 25px;
}

.main-gold-btn {
  background: linear-gradient(135deg, #D4AF37, #F6E27A);
  color: #0f1419;
  border: none;
  border-radius: 50px;
  padding: 14px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.main-gold-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.35);
}

.outline-gold-btn {
  background: transparent;
  border: 1px solid #D4AF37;
  color: #D4AF37;
  border-radius: 50px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.outline-gold-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.danger-btn {
  background: transparent;
  border: 1px solid #ff4444;
  color: #ff4444;
  border-radius: 50px;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 5px;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: rgba(255, 68, 68, 0.1);
  transform: translateY(-2px);
}

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

.modal-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
}

.modal-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.phone-input-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.country-select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 12px;
  color: #D4AF37;
  font-weight: bold;
  outline: none;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
}

.phone-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
  margin-right: 5px;
}

.phone-hint span {
  color: #D4AF37;
  font-weight: bold;
}

.error-txt {
  color: #ff4444;
  font-size: 13px;
  margin-top: 15px;
  text-align: center;
  background: rgba(255, 68, 68, 0.1);
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

.loading-container {
  text-align: center;
  padding: 100px 0;
}

.gold-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.1);
  border-top-color: #D4AF37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

@media (max-width: 480px) {
  .profile-page {
    padding: 15px;
    padding-top: 50px;
  }
  
  .fields-section {
    padding: 15px;
  }
  
  .custom-modal-container {
    margin: 20px;
  }
  
  .custom-modal-header h3 {
    font-size: 18px;
  }
  
  .balance-text {
    font-size: 20px !important;
  }
  
  .avatar-circle {
    width: 70px;
    height: 70px;
    font-size: 28px;
  }
  
  .username-display {
    font-size: 18px;
  }
  
  .edit-avatar-circle {
    width: 80px;
    height: 80px;
    font-size: 34px;
  }
}
</style>
