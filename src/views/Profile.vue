<template>
  <div class="profile-page">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
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
        
        <div class="field">
          <label><i class="fas fa-id-badge"></i> معرف المستخدم (ID)</label>
          <div class="field-input-group">
            <input type="text" :value="userData.uid" readonly class="input-field">
            <button class="action-btn" @click="copy(userData.uid)">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="field">
          <label><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
          <div class="field-input-group">
            <input type="text" :value="userData.email || 'غير مسجل'" readonly class="input-field">
            <button class="action-btn" @click="copy(userData.email)" v-if="userData.email">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="field">
          <label><i class="fas fa-phone-alt"></i> رقم الهاتف</label>
          <div class="field-input-group">
            <input type="text" :value="userData.phoneNumber || 'لم يتم الربط بعد'" readonly class="input-field">
            <button class="action-btn link-btn" @click="openPhoneModal">
              <i class="fas fa-link"></i> {{ userData.phoneNumber ? 'تحديث' : 'ربط' }}
            </button>
          </div>
        </div>

        <div class="field" v-if="userData.referralCode">
          <label><i class="fas fa-share-nodes"></i> كود الإحالة</label>
          <div class="field-input-group">
            <input type="text" :value="userData.referralCode" readonly class="input-field highlight-code">
            <button class="action-btn" @click="copy(userData.referralCode)">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- قسم الرصيد -->
      <div class="fields-section">
        <h3 class="section-label"><i class="fas fa-wallet"></i> الرصيد</h3>
        
        <div class="field balance-field">
          <label><i class="fas fa-coins"></i> الرصيد (USDT)</label>
          <div class="field-input-group">
            <input type="text" :value="Number(vipBalance).toFixed(2)" readonly class="input-field balance-text">
            <span class="currency-tag">USDT</span>
          </div>
        </div>

        <div class="field">
          <label><i class="fas fa-calendar-day"></i> تاريخ الانضمام</label>
          <input type="text" :value="formattedDate" readonly class="input-field">
        </div>
      </div>

      <!-- الأزرار -->
      <div class="action-buttons">
        <button class="action-btn-main" @click="openEditProfileModal">
          <i class="fas fa-user-edit"></i> تعديل
        </button>
        
        <button class="action-btn-main" @click="copyReferralLink" v-if="userData.referralCode">
          <i class="fas fa-link"></i> نسخ الرابط
        </button>

        <button class="action-btn-danger" @click="confirmLogout">
          <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
        </button>
      </div>
    </div>

    <!-- نافذة تعديل الملف الشخصي -->
    <transition name="modal-fade-scale">
      <div v-if="showEditProfileModal" class="modal-overlay" @click.self="closeEditProfileModal">
        <div class="modal-container small">
          <div class="modal-header">
            <div class="header-icon">
              <i class="fas fa-user-edit"></i>
            </div>
            <h3>تعديل الملف الشخصي</h3>
            <button class="modal-close-btn" @click="closeEditProfileModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <!-- قسم الصورة -->
            <div class="edit-avatar-section">
              <div class="edit-avatar-circle" :style="editAvatarStyle">
                <span v-if="!editAvatarPreview && !userData.avatar">{{ editUsername ? editUsername.charAt(0).toUpperCase() : 'U' }}</span>
              </div>
              <div class="avatar-upload-buttons">
                <label class="upload-avatar-btn">
                  <i class="fas fa-camera"></i> صورة
                  <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;">
                </label>
                <button v-if="editAvatarPreview || userData.avatar" class="remove-avatar-btn" @click="removeAvatar">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <!-- قسم الاسم -->
            <div class="field">
              <label><i class="fas fa-user"></i> اسم المستخدم</label>
              <input 
                type="text" 
                v-model="editUsername" 
                placeholder="أدخل اسم المستخدم الجديد"
                class="input-field"
                maxlength="30"
              >
            </div>
            
            <p v-if="editProfileError" class="error-txt">{{ editProfileError }}</p>
          </div>
          
          <div class="modal-footer">
            <button class="modal-btn modal-btn-primary" @click="saveProfileChanges" :disabled="editProfileLoading">
              <i class="fas fa-save"></i> {{ editProfileLoading ? 'جاري...' : 'حفظ' }}
            </button>
          </div>
          <div class="modal-line"></div>
        </div>
      </div>
    </transition>

    <!-- نافذة منبثقة عامة -->
    <transition name="modal-fade-scale">
      <div v-if="modal.visible" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container" :class="modal.size">
          <div class="modal-header" :class="modal.type">
            <div class="header-icon">
              <i :class="modal.icon"></i>
            </div>
            <h3>{{ modal.title }}</h3>
            <button class="modal-close-btn" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
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
          
          <div class="modal-footer" v-if="modal.type !== 'confirm'">
            <button class="modal-btn modal-btn-primary" @click="closeModal">
              {{ modal.buttonText || 'فهمت' }}
            </button>
          </div>
          <div class="modal-line"></div>
        </div>
      </div>
    </transition>

    <!-- نافذة ربط الهاتف -->
    <transition name="modal-fade-scale">
      <div v-if="showPhoneModal" class="modal-overlay" @click.self="closePhoneModal">
        <div class="modal-container small">
          <div class="modal-header">
            <div class="header-icon">
              <i class="fas fa-mobile-screen-button"></i>
            </div>
            <h3>ربط رقم الهاتف</h3>
            <button class="modal-close-btn" @click="closePhoneModal">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="field">
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
                  class="input-field"
                  @input="handlePhoneInput"
                >
              </div>
              <p class="phone-hint" v-if="phoneForm.countryCode">
                <i class="fas fa-info-circle"></i> 
                يجب إدخال <span>{{ phoneLimit }}</span> أرقام (أدخلت: {{ phoneForm.phone.length }})
              </p>
            </div>
            <div class="field">
              <label>كلمة المرور للتأكيد</label>
              <input type="password" v-model="phoneForm.password" placeholder="أدخل كلمة المرور" class="input-field">
            </div>
            <p v-if="phoneError" class="error-txt">{{ phoneError }}</p>
          </div>
          
          <div class="modal-footer">
            <button class="modal-btn modal-btn-primary" @click="updatePhoneNumber" :disabled="phoneLoading">
              {{ phoneLoading ? 'جاري...' : 'تأكيد الربط' }}
            </button>
          </div>
          <div class="modal-line"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, db, batchUpdateUserData } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";

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
      showPhoneModal: false,
      showEditProfileModal: false,
      phoneLoading: false,
      editProfileLoading: false,
      phoneError: "",
      editProfileError: "",
      phoneLimit: 9,
      editUsername: "",
      editAvatarPreview: null,
      selectedImageFile: null,
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
    cleanup() {
      this._isDestroyed = true;
      
      if (this._authUnsubscribe) {
        this._authUnsubscribe();
        this._authUnsubscribe = null;
      }
      
      if (this.unsubscribeUser) {
        this.unsubscribeUser();
        this.unsubscribeUser = null;
      }
      
      this.showEditProfileModal = false;
      this.showPhoneModal = false;
      this.modal.visible = false;
      document.body.style.overflow = 'auto';
    },
    
    async initProfile() {
      try {
        const cachedUser = auth.currentUser ? ProfileCacheManager.getProfileFromCache(auth.currentUser.uid) : null;
        
        this._authUnsubscribe = onAuthStateChanged(auth, async (user) => {
          if (this._isDestroyed) return;
          
          if (!user) { 
            this.loading = false; 
            this.$router.push("/login"); 
            return; 
          }
          
          try {
            if (cachedUser && cachedUser.uid === user.uid) {
              this.applyUserData(cachedUser);
              this.loading = false;
            }
            
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
      
      const localAvatar = ProfileCacheManager.getAvatarFromLocal(data.uid);
      if (localAvatar && !this.userData.avatar) {
        this.userData.avatar = localAvatar;
      }
    },
    
    async setupRealtimeListener(user) {
      if (this._isDestroyed) return;
      
      if (this.unsubscribeUser) {
        this.unsubscribeUser();
        this.unsubscribeUser = null;
      }
      
      const userRef = doc(db, "users", user.uid);
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
        
        const updates = { 
          username: this.editUsername.trim()
        };
        
        if (this.selectedImageFile) {
          const reader = new FileReader();
          const avatarBase64 = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(this.selectedImageFile);
          });
          
          ProfileCacheManager.saveAvatarToLocal(user.uid, avatarBase64);
          updates.avatar = avatarBase64;
          this.userData.avatar = avatarBase64;
        } else if (this.editAvatarPreview === null && this.userData.avatar) {
          ProfileCacheManager.saveAvatarToLocal(user.uid, null);
          updates.avatar = "";
          this.userData.avatar = "";
        }
        
        await batchUpdateUserData(user.uid, updates);
        
        if (updates.username !== this.userData.username) {
          try {
            await updateProfile(user, { displayName: updates.username });
          } catch (e) {
            console.log("Auth profile update skipped:", e.message);
          }
        }
        
        this.userData.username = this.editUsername.trim();
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

    translateError(error) {
      const code = error.code || error.message;
      if (code.includes('wrong-password') || code.includes('invalid-credential')) {
        return 'كلمة المرور غير صحيحة';
      }
      switch (code) {
        case 'auth/user-not-found': return 'المستخدم غير موجود';
        case 'auth/too-many-requests': return 'محاولات كثيرة جداً، يرجى المحاولة لاحقاً';
        case 'auth/network-request-failed': return 'خطأ في الاتصال بالشبكة';
        default: return 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';
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
        const fullPhone = this.phoneForm.countryCode + this.phoneForm.phone;
        
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
          this.cleanup();
          
          if (auth.currentUser) {
            ProfileCacheManager.clearProfileCache(auth.currentUser.uid);
          }
          
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
  background: #f5f7fa;
  color: #1a1a2e;
  padding: 20px;
  padding-top: 40px;
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
  width: 80px;
  height: 80px;
  background: #e8eaed;
  border: 2px solid #1a1a2e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #1a1a2e;
  background-size: cover;
  background-position: center;
}

.username-display {
  font-size: 20px;
  color: #1a1a2e;
  font-weight: 700;
  margin-bottom: 4px;
}

.user-email {
  font-size: 13px;
  color: #6b7280;
}

.edit-avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.edit-avatar-circle {
  width: 80px;
  height: 80px;
  background: #e8eaed;
  border: 2px solid #1a1a2e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  font-weight: bold;
  color: #1a1a2e;
  margin: 0 auto 12px;
  background-size: cover;
  background-position: center;
}

.avatar-upload-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.upload-avatar-btn {
  background: #1a1a2e;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
}

.upload-avatar-btn:hover {
  background: #2a2a4e;
}

.remove-avatar-btn {
  background: #e8eaed;
  color: #dc3545;
  padding: 6px 12px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #dc3545;
}

.remove-avatar-btn:hover {
  background: #dc3545;
  color: #ffffff;
}

.fields-section {
  margin-bottom: 20px;
  background: #ffffff;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.section-label {
  font-size: 15px;
  color: #1a1a2e;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
}

.field {
  margin-bottom: 14px;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 5px;
  margin-right: 4px;
  font-weight: 500;
}

.field-input-group {
  display: flex;
  gap: 8px;
}

.input-field {
  flex: 1;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 14px;
  color: #1a1a2e;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  width: 100%;
  font-family: 'Cairo', sans-serif;
}

.input-field:focus {
  border-color: #1a1a2e;
  box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.08);
}

.input-field:read-only {
  cursor: default;
}

.highlight-code {
  color: #1a1a2e;
  font-weight: 700;
  letter-spacing: 1px;
}

.action-btn {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
}

.action-btn:hover {
  background: #1a1a2e;
  color: #ffffff;
  border-color: #1a1a2e;
}

.link-btn {
  min-width: 60px;
  justify-content: center;
  font-weight: 600;
}

.balance-field .input-field {
  border-color: #1a1a2e;
  background: #f0f2f5;
}

.balance-text {
  font-size: 22px !important;
  font-weight: 800 !important;
  color: #1a1a2e !important;
  text-align: center;
}

.currency-tag {
  background: #1a1a2e;
  color: #ffffff;
  padding: 0 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.action-btn-main {
  background: #1a1a2e;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  min-width: 100px;
}

.action-btn-main:hover {
  background: #2a2a4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 26, 46, 0.2);
}

.action-btn-danger {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 50px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  min-width: 100px;
}

.action-btn-danger:hover {
  background: #dc3545;
  color: #ffffff;
  transform: translateY(-2px);
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-container {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: modalFloatIn 0.35s cubic-bezier(0.21, 1.11, 0.35, 1);
}

.modal-container.small {
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

.modal-header {
  padding: 18px 20px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header .header-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: #f0f2f5;
  color: #1a1a2e;
}

.modal-header.info .header-icon {
  background: #e3f2fd;
  color: #1565c0;
}

.modal-header.success .header-icon {
  background: #e8f5e9;
  color: #2e7d32;
}

.modal-header.error .header-icon {
  background: #fce4ec;
  color: #c62828;
}

.modal-header.confirm .header-icon {
  background: #fff3e0;
  color: #e65100;
}

.modal-header h3 {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1a1a2e;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f9fa;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-btn:hover {
  background: #e5e7eb;
  color: #1a1a2e;
  transform: rotate(90deg);
}

.modal-body {
  padding: 20px;
}

.modal-body p {
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

.modal-footer {
  padding: 14px 20px 20px;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.modal-btn-primary {
  background: #1a1a2e;
  color: #ffffff;
  font-weight: 700;
}

.modal-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 26, 46, 0.25);
}

.modal-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-btn-confirm {
  background: #1a1a2e;
  color: #ffffff;
  flex: 1;
}

.modal-btn-cancel {
  background: #f8f9fa;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  flex: 1;
}

.modal-btn-cancel:hover {
  background: #e5e7eb;
}

.modal-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #1a1a2e;
}

/* ===== PHONE INPUT ===== */
.phone-input-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.country-select {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 14px;
  color: #1a1a2e;
  font-weight: 500;
  outline: none;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
  font-family: 'Cairo', sans-serif;
}

.country-select:focus {
  border-color: #1a1a2e;
  box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.08);
}

.phone-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
  margin-right: 4px;
}

.phone-hint span {
  color: #1a1a2e;
  font-weight: bold;
}

.error-txt {
  color: #dc3545;
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
  background: rgba(220, 53, 69, 0.05);
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(220, 53, 69, 0.15);
}

/* ===== LOADING ===== */
.loading-container {
  text-align: center;
  padding: 80px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #1a1a2e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 14px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
  .profile-page {
    padding: 12px;
    padding-top: 30px;
  }
  
  .fields-section {
    padding: 14px 16px;
  }
  
  .modal-container {
    margin: 16px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .balance-text {
    font-size: 18px !important;
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
    width: 70px;
    height: 70px;
    font-size: 28px;
  }
  
  .action-btn-main, .action-btn-danger {
    font-size: 12px;
    padding: 8px 14px;
    min-width: 70px;
  }
  
  .action-buttons {
    gap: 8px;
  }
}
</style>
