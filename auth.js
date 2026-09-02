import { defineStore } from 'pinia'
import { ref } from 'vue'
import CryptoJS from 'crypto-js'

// -------------------------------
// التحقق من وجود مفتاح التشفير
// -------------------------------
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY

if (!ENCRYPTION_KEY && import.meta.env.PROD) {
  console.error('CRITICAL: VITE_ENCRYPTION_KEY is not set in production!')
}

// -------------------------------
// خدمة التشفير المحسنة
// -------------------------------
const encryptionService = {
  encrypt(data) {
    try {
      if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key is missing')
      }
      const jsonString = JSON.stringify(data)
      const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
      return encrypted
    } catch (error) {
      // في الإنتاج، لا تطبع تفاصيل الأخطاء الحساسة
      if (import.meta.env.DEV) {
        console.error('Encryption error:', error.message)
      }
      return null
    }
  },

  decrypt(encryptedData) {
    try {
      if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key is missing')
      }
      if (!encryptedData) return null
      
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedString) return null
      
      const parsed = JSON.parse(decryptedString)
      return parsed
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Decryption error:', error.message)
      }
      return null
    }
  },

  setItem(key, value) {
    const encrypted = this.encrypt(value)
    if (encrypted) {
      localStorage.setItem(key, encrypted)
      return true
    }
    return false
  },

  getItem(key) {
    const encrypted = localStorage.getItem(key)
    if (!encrypted) return null
    return this.decrypt(encrypted)
  },

  removeItem(key) {
    localStorage.removeItem(key)
  },
  
  clear() {
    localStorage.clear()
  }
}

// -------------------------------
// التحقق من صحة بيانات المستخدم
// -------------------------------
function isValidUser(userData) {
  if (!userData || typeof userData !== 'object') return false
  // تحقق من وجود الحقول الأساسية
  if (!userData.uid && !userData.id) return false
  return true
}

export const useAuthStore = defineStore('auth', () => {

  // -------------------------------
  // قراءة الـ Token بشكل آمن
  // -------------------------------
  let initialToken = ''
  try {
    const decryptedToken = encryptionService.getItem('token')
    if (decryptedToken && typeof decryptedToken === 'string') {
      initialToken = decryptedToken
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn('Failed to load token')
  }
  const token = ref(initialToken)

  // -------------------------------
  // قراءة بيانات المستخدم بشكل آمن
  // -------------------------------
  let initialUser = null
  try {
    const decryptedUser = encryptionService.getItem('user')
    if (decryptedUser && isValidUser(decryptedUser)) {
      initialUser = decryptedUser
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn('Failed to load user data')
  }
  const user = ref(initialUser)

  // -------------------------------
  // إضافة userId
  // -------------------------------
  const userId = ref(user.value?.uid || user.value?.id || '')

  // -------------------------------
  // اللغة (غير حساسة)
  // -------------------------------
  const lang = ref(localStorage.getItem('lang') || 'ar')
  
  // التحقق من وجود document قبل استخدامه
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lang.value === 'ar' ? 'rtl' : 'ltr'
  }

  // -------------------------------
  // جلسة التطبيق (Session Management)
  // -------------------------------
  const SESSION_DURATION_HOURS = 24 // مدة الجلسة 24 ساعة
  
  function setSessionExpiry() {
    const expiryTime = Date.now() + (SESSION_DURATION_HOURS * 60 * 60 * 1000)
    encryptionService.setItem('session_expiry', expiryTime)
  }
  
  function isSessionValid() {
    const expiry = encryptionService.getItem('session_expiry')
    if (!expiry) return false
    return Date.now() < expiry
  }
  
  function clearSession() {
    encryptionService.removeItem('session_expiry')
  }

  // -------------------------------
  // تخزين معلومات المستخدم بشكل آمن
  // -------------------------------
  function setAuth(t, u) {
    // التحقق من صحة البيانات قبل التخزين
    if (u && !isValidUser(u)) {
      if (import.meta.env.DEV) console.warn('Attempted to store invalid user data')
      return
    }
    
    token.value = t
    user.value = u
    userId.value = u?.uid || u?.id || ''
    
    if (t && typeof t === 'string' && t.length > 0) {
      encryptionService.setItem('token', t)
      setSessionExpiry() // تعيين مدة الجلسة
    } else {
      encryptionService.removeItem('token')
      clearSession()
    }
    
    if (u && isValidUser(u)) {
      encryptionService.setItem('user', u)
    } else {
      encryptionService.removeItem('user')
    }
  }

  // -------------------------------
  // تسجيل الخروج - مسح جميع البيانات
  // -------------------------------
  function logout() {
    token.value = ''
    user.value = null
    userId.value = ''
    encryptionService.removeItem('token')
    encryptionService.removeItem('user')
    clearSession()
  }

  // -------------------------------
  // التحقق من حالة المصادقة
  // -------------------------------
  function isAuthenticated() {
    return !!(token.value && isSessionValid())
  }

  // -------------------------------
  // تغيير اللغة
  // -------------------------------
  function setLang(code) {
    lang.value = code
    localStorage.setItem('lang', code)
    if (typeof document !== 'undefined') {
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    }
  }

  return {
    token,
    user,
    userId,
    lang,
    setAuth,
    logout,
    setLang,
    isAuthenticated, // إضافة دالة التحقق من المصادقة
  }
})
