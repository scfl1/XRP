// ===============================  
// firebase.js — الإصدار النهائي المحسن  
// مع نظام كاش متقدم لتقليل استهلاك Firebase  
// بدون أي خطأ — تشغيل Analytics بأمان  
// مع تصدير جميع الدوال المطلوبة للملف الشخصي ونظام الأسهم
// ===============================  

import { initializeApp } from "firebase/app";  
import {  
  getAuth,  
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";  
  
import {   
  getFirestore,   
  collection,   
  query,   
  where,   
  orderBy,   
  getDocs,
  getDocsFromCache,
  doc,
  getDoc,
  getDocFromCache,
  setDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence
} from "firebase/firestore";  
  
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";  
  
import {  
  getAnalytics,  
  isSupported  
} from "firebase/analytics";  
  
import { getFunctions } from "firebase/functions";  

// -------------------------------------------  
// إعدادات Firebase الخاصة بتطبيقك  
// -------------------------------------------  
const firebaseConfig = {  
  apiKey: "AIzaSyDa0XdGA05G3vt-enGPBfDTD16K4OdoMik",  
  authDomain: "american-54cbd.firebaseapp.com",  
  projectId: "american-54cbd",  
  storageBucket: "american-54cbd.appspot.com",  
  messagingSenderId: "166955679884",  
  appId: "1:166955679884:web:5d8701f7ed3e3f78d33ba9",  
  measurementId: "G-ZL7XR4VCV3"  
};  

// -------------------------------------------  
// تشغيل Firebase  
// -------------------------------------------  
const app = initializeApp(firebaseConfig);  

// -------------------------------------------  
// تشغيل Analytics بدون أخطاء (بيئة متصفح فقط)  
// -------------------------------------------  
let analytics = null;  

isSupported().then((supported) => {  
  if (supported && typeof window !== 'undefined') {  
    try {  
      analytics = getAnalytics(app);  
      console.log("✅ Firebase Analytics initialized");  
    } catch (err) {  
      console.warn("⚠️ Analytics disabled:", err.message);  
    }  
  }  
});  

// -------------------------------------------  
// تهيئة الخدمات  
// -------------------------------------------  
export const auth = getAuth(app);  
export const googleProvider = new GoogleAuthProvider();  
export const db = getFirestore(app);  
export const storage = getStorage(app);  
export const functions = getFunctions(app);  

// -------------------------------------------  
// تفعيل التخزين المؤقت المحلي (Offline Persistence)  
// -------------------------------------------  
const enableOfflinePersistence = async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log("✅ Firestore Offline Persistence enabled");
  } catch (err) {
    if (err.code === 'failed-precondition') {
      console.warn("⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("⚠️ The current browser does not support all of the features required to enable persistence");
    }
  }
};

// تفعيل التخزين المؤقت تلقائياً
if (typeof window !== 'undefined') {
  enableOfflinePersistence();
}

// ============================================  
// نظام الكاش المتقدم (Advanced Cache Manager)  
// ============================================  
class AdvancedCacheManager {
  constructor() {
    if (!AdvancedCacheManager.instance) {
      this.memoryCache = new Map();
      this.cacheTimestamps = new Map();
      this.pendingRequests = new Map();
      this.DEFAULT_TTL = 5 * 60 * 1000; // 5 دقائق افتراضياً
      this.SHORT_TTL = 60 * 1000; // دقيقة واحدة للبيانات المتغيرة
      this.LONG_TTL = 30 * 60 * 1000; // 30 دقيقة للبيانات الثابتة
      AdvancedCacheManager.instance = this;
    }
    return AdvancedCacheManager.instance;
  }

  /**
   * إنشاء مفتاح فريد للكاش
   */
  generateCacheKey(type, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    return `${type}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * جلب البيانات من الكاش
   */
  getFromCache(key) {
    const cached = this.memoryCache.get(key);
    const timestamp = this.cacheTimestamps.get(key);
    
    if (!cached || !timestamp) return null;
    
    const now = Date.now();
    if (now - timestamp < cached.ttl) {
      console.log(`✅ Cache hit: ${key}`);
      return cached.data;
    }
    
    // انتهت صلاحية الكاش
    this.memoryCache.delete(key);
    this.cacheTimestamps.delete(key);
    return null;
  }

  /**
   * تخزين البيانات في الكاش
   */
  setToCache(key, data, ttl = this.DEFAULT_TTL) {
    this.memoryCache.set(key, {
      data,
      ttl,
      storedAt: Date.now()
    });
    this.cacheTimestamps.set(key, Date.now());
  }

  /**
   * حذف الكاش المرتبط بنوع معين
   */
  invalidateCacheByType(type) {
    for (const [key] of this.memoryCache) {
      if (key.startsWith(`${type}:`)) {
        this.memoryCache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }

  /**
   * حذف كل الكاش
   */
  clearAllCache() {
    this.memoryCache.clear();
    this.cacheTimestamps.clear();
    this.pendingRequests.clear();
  }

  /**
   * حذف الكاش المرتبط بمستخدم معين
   */
  invalidateUserCache(userId) {
    for (const [key] of this.memoryCache) {
      if (key.includes(userId)) {
        this.memoryCache.delete(key);
        this.cacheTimestamps.delete(key);
      }
    }
  }

  /**
   * منع تنفيذ طلبات مكررة لنفس البيانات (Request Deduplication)
   */
  async deduplicateRequest(key, requestFn, ttl = this.DEFAULT_TTL) {
    // التحقق من الكاش أولاً
    const cached = this.getFromCache(key);
    if (cached) return cached;

    // التحقق من وجود طلب معلق لنفس المفتاح
    if (this.pendingRequests.has(key)) {
      console.log(`⏳ Waiting for pending request: ${key}`);
      return this.pendingRequests.get(key);
    }

    // تنفيذ الطلب وتخزينه
    const requestPromise = requestFn()
      .then(data => {
        this.setToCache(key, data, ttl);
        this.pendingRequests.delete(key);
        return data;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }
}

// تصدير نسخة واحدة من مدير الكاش
export const cacheManager = new AdvancedCacheManager();

// ============================================  
// دوال Firestore محسنة مع الكاش  
// ============================================  

/**
 * getDoc محسنة مع الكاش
 */
export const getCachedDoc = async (docRef, options = {}) => {
  const { ttl = cacheManager.SHORT_TTL, forceRefresh = false } = options;
  const cacheKey = cacheManager.generateCacheKey('doc', {
    path: docRef.path
  });

  return cacheManager.deduplicateRequest(cacheKey, async () => {
    try {
      // محاولة الجلب من الكاش المحلي لـ Firebase أولاً
      if (!forceRefresh) {
        try {
          const cachedDoc = await getDocFromCache(docRef);
          if (cachedDoc.exists()) {
            console.log(`📦 Loaded from Firestore cache: ${docRef.path}`);
            return cachedDoc;
          }
        } catch (e) {
          // الكاش المحلي غير متاح
        }
      }

      // الجلب من السيرفر
      const docSnap = await getDoc(docRef);
      return docSnap;
    } catch (error) {
      console.error(`❌ Error fetching doc ${docRef.path}:`, error);
      throw error;
    }
  }, ttl);
};

/**
 * getDocs محسنة مع الكاش
 */
export const getCachedDocs = async (queryObj, options = {}) => {
  const { ttl = cacheManager.SHORT_TTL, forceRefresh = false, queryKey = '' } = options;
  
  // إنشاء مفتاح فريد للاستعلام
  const queryConstraints = {
    collection: queryObj._query?.path || queryObj.type,
    filters: queryObj._query?.filters || [],
    orders: queryObj._query?.orders || [],
    key: queryKey
  };
  
  const cacheKey = cacheManager.generateCacheKey('query', queryConstraints);

  return cacheManager.deduplicateRequest(cacheKey, async () => {
    try {
      // محاولة الجلب من الكاش المحلي لـ Firebase أولاً
      if (!forceRefresh) {
        try {
          const cachedDocs = await getDocsFromCache(queryObj);
          if (!cachedDocs.empty) {
            console.log(`📦 Loaded from Firestore cache: ${queryKey || 'query'}`);
            return cachedDocs;
          }
        } catch (e) {
          // الكاش المحلي غير متاح
        }
      }

      // الجلب من السيرفر
      const snapshot = await getDocs(queryObj);
      return snapshot;
    } catch (error) {
      console.error(`❌ Error fetching query:`, error);
      throw error;
    }
  }, ttl);
};

/**
 * onSnapshot محسنة مع تنظيف تلقائي
 */
export const createManagedSnapshot = (queryObj, callback, options = {}) => {
  const { onError = null } = options;
  
  const unsubscribe = onSnapshot(
    queryObj,
    (snapshot) => {
      // تحديث الكاش عند استلام بيانات جديدة
      const queryKey = options.cacheKey || 'snapshot';
      cacheManager.setToCache(queryKey, snapshot, cacheManager.SHORT_TTL);
      callback(snapshot);
    },
    (error) => {
      console.error("❌ Snapshot error:", error);
      if (onError) onError(error);
    }
  );

  // إرجاع دالة التنظيف
  return () => {
    console.log("🔌 Snapshot unsubscribed");
    unsubscribe();
  };
};

// -------------------------------------------  
// تصدير دوال Authentication  
// -------------------------------------------  
export {  
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
};

// -------------------------------------------  
// تصدير دوال Firestore  
// -------------------------------------------  
export {   
  collection,   
  query,   
  where,   
  orderBy,   
  getDocs,
  getDocsFromCache,
  doc,
  getDoc,
  getDocFromCache,
  setDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp
};  

// -------------------------------------------  
// تصدير دوال Storage  
// -------------------------------------------  
export {  
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// -------------------------------------------  
// دالة جلب المعاملات حسب معرف المستخدم (محسنة)  
// -------------------------------------------  
export const getTransactionsByUserId = async (userId) => {  
  if (!userId) {
    console.error("❌ userId مطلوب");
    return [];
  }
  
  const cacheKey = cacheManager.generateCacheKey('transactions', { userId });
  
  return cacheManager.deduplicateRequest(cacheKey, async () => {
    try {  
      const transactionsRef = collection(db, "transactions");
      const q = query(  
        transactionsRef,  
        where("userId", "==", userId)
      );  
      
      // استخدام getCachedDocs للاستفادة من الكاش
      const snapshot = await getDocs(q);  
      
      // جلب البيانات وترتيبها يدوياً في الذاكرة
      const transactions = snapshot.docs.map(doc => ({  
        id: doc.id,  
        ...doc.data()  
      }));
      
      // ترتيب يدوي من الأحدث إلى الأقدم
      transactions.sort((a, b) => {
        const dateA = getTimestampValue(a.createdAt);
        const dateB = getTimestampValue(b.createdAt);
        return dateB - dateA;
      });
      
      return transactions;
    } catch (error) {  
      console.error("❌ خطأ في جلب المعاملات:", error);  
      return [];  
    }  
  }, cacheManager.SHORT_TTL); // TTL قصير للمعاملات لأنها تتغير كثيراً
};  

// -------------------------------------------  
// دالة مساعدة لاستخراج قيمة الوقت من timestamp  
// -------------------------------------------  
const getTimestampValue = (ts) => {
  if (!ts) return 0;
  try {
    if (ts.toDate) {
      return ts.toDate().getTime();
    } else if (ts.seconds) {
      return ts.seconds * 1000;
    } else if (typeof ts === 'number') {
      return ts;
    } else if (ts instanceof Date) {
      return ts.getTime();
    }
    return new Date(ts).getTime();
  } catch (error) {
    return 0;
  }
};

// -------------------------------------------  
// دالة رفع الصورة وحفظها في Storage  
// -------------------------------------------  
export const uploadUserAvatar = async (userId, file) => {
  if (!userId || !file) {
    throw new Error("userId وملف الصورة مطلوبان");
  }
  
  try {
    // إنشاء اسم فريد للصورة
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar_${userId}_${timestamp}.${fileExt}`;
    const storageRef = ref(storage, `avatars/${userId}/${fileName}`);
    
    // رفع الصورة
    const snapshot = await uploadBytes(storageRef, file);
    console.log("✅ تم رفع الصورة بنجاح");
    
    // الحصول على رابط التحميل
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log("✅ تم الحصول على رابط الصورة");
    
    // حذف الكاش المرتبط بالمستخدم بعد تحديث الصورة
    cacheManager.invalidateUserCache(userId);
    
    return downloadUrl;
  } catch (error) {
    console.error("❌ خطأ في رفع الصورة:", error);
    throw error;
  }
};

// -------------------------------------------  
// دالة حذف الصورة القديمة من Storage  
// -------------------------------------------  
export const deleteUserAvatar = async (avatarUrl) => {
  if (!avatarUrl || !avatarUrl.includes('firebasestorage')) {
    return;
  }
  
  try {
    const avatarRef = ref(storage, avatarUrl);
    await deleteObject(avatarRef);
    console.log("✅ تم حذف الصورة القديمة");
  } catch (error) {
    console.warn("⚠️ خطأ في حذف الصورة (قد لا تكون موجودة):", error.message);
  }
};

// -------------------------------------------  
// دالة مساعدة لدمج عمليات الكتابة  
// -------------------------------------------  
export const batchUpdateUserData = async (userId, updates) => {
  if (!userId || !updates) {
    throw new Error("userId و updates مطلوبان");
  }
  
  try {
    const userRef = doc(db, "users", userId);
    
    // دمج جميع التحديثات في عملية واحدة
    await updateDoc(userRef, updates);
    
    // حذف الكاش المرتبط بالمستخدم
    cacheManager.invalidateUserCache(userId);
    
    console.log("✅ تم تحديث بيانات المستخدم بنجاح");
    return true;
  } catch (error) {
    console.error("❌ خطأ في تحديث بيانات المستخدم:", error);
    throw error;
  }
};

// -------------------------------------------  
// تصدير analytics  
// -------------------------------------------  
export { analytics };

// -------------------------------------------  
// تصدير دوال إدارة الكاش للاستخدام الخارجي  
// -------------------------------------------  
export const clearAppCache = () => cacheManager.clearAllCache();
export const clearUserCache = (userId) => cacheManager.invalidateUserCache(userId);
export const clearCacheByType = (type) => cacheManager.invalidateCacheByType(type);

// -------------------------------------------  
// تكوين Google Auth Provider  
// -------------------------------------------  
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
