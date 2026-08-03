// ===============================
//  main.js (نسخة صحيحة 100%)
// ===============================

// منع تشغيل الموقع على أي دومين غير الدومين الرسمي
if (window.location.hostname !== "scfl1.huh630841.workers.dev") {
  document.body.innerHTML = "403 Forbidden";
  throw new Error("Domain not allowed");
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// استدعاء ملف التنسيقات العامة
import './assets/style.css'

// ⚠️ تمت إزالة FontAwesome (npm import)
// لأن npm فشل ولن يعمل داخل Termux
// وسيتم استخدام CDN من index.html فقط

// إنشاء التطبيق
const app = createApp(App)

// تحميل الإضافات
app.use(createPinia())
app.use(router)

// تشغيل التطبيق
app.mount('#app')
