<template>
  <div class="tasks-page" dir="rtl">
    <section class="hero-card">
      <div class="hero-icon"><i class="fas fa-layer-group"></i></div>
      <div>
        <span class="eyebrow">NOVA DEMO</span>
        <h1>المهام والأنشطة</h1>
        <p>مساحة تجريبية لإدارة الأنشطة اليومية بدون جوائز مالية تلقائية.</p>
      </div>
    </section>

    <div class="notice">
      <i class="fas fa-circle-info"></i>
      <span>هذا الإصدار تجريبي. لا توجد رهانات أو عجلة حظ أو عوائد مالية مضمونة.</span>
    </div>

    <section class="task-list">
      <article v-for="task in tasks" :key="task.id" class="task-card">
        <div class="task-icon"><i :class="task.icon"></i></div>
        <div class="task-body">
          <h2>{{ task.title }}</h2>
          <p>{{ task.description }}</p>
          <div class="progress"><span :style="{ width: task.progress + '%' }"></span></div>
          <small>{{ task.progress }}% مكتمل</small>
        </div>
        <button class="task-btn" @click="completeTask(task)">
          {{ task.done ? 'مكتملة' : 'فتح' }}
        </button>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Tasks',
  data() {
    return {
      tasks: [
        { id: 1, title: 'مراجعة الملف الشخصي', description: 'تأكد من اكتمال بيانات الحساب التجريبي.', icon: 'fas fa-user-check', progress: 65, done: false },
        { id: 2, title: 'استكشاف لوحة التحكم', description: 'تصفح الأقسام الرئيسية وتعرّف على وظائف المنصة.', icon: 'fas fa-compass', progress: 40, done: false },
        { id: 3, title: 'قراءة الإرشادات', description: 'اطّلع على قواعد الاستخدام وملاحظات النسخة التجريبية.', icon: 'fas fa-book-open', progress: 100, done: true }
      ]
    }
  },
  methods: {
    completeTask(task) {
      task.progress = 100
      task.done = true
    }
  }
}
</script>

<style scoped>
.tasks-page{max-width:900px;margin:0 auto;padding:24px 16px 110px;color:#eef2ff}
.hero-card{display:flex;gap:16px;align-items:center;padding:24px;border:1px solid rgba(124,92,255,.25);background:linear-gradient(135deg,#15192b,#202643);border-radius:24px;box-shadow:0 18px 50px rgba(0,0,0,.25)}
.hero-icon,.task-icon{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;background:linear-gradient(135deg,#7257ff,#9b7cff);font-size:22px;flex:none}
.eyebrow{font-size:11px;letter-spacing:2px;color:#a99cff;font-weight:800}.hero-card h1{margin:5px 0;font-size:28px}.hero-card p{margin:0;color:#aeb7d4}
.notice{margin:16px 0;padding:14px 16px;border-radius:16px;background:#11182a;border:1px solid rgba(255,255,255,.08);display:flex;gap:10px;align-items:center;color:#c7cde0}.notice i{color:#9b7cff}
.task-list{display:grid;gap:12px}.task-card{display:flex;align-items:center;gap:14px;padding:18px;background:#151a2b;border:1px solid rgba(255,255,255,.07);border-radius:20px}.task-body{flex:1}.task-body h2{font-size:17px;margin:0 0 5px}.task-body p{margin:0 0 12px;color:#9da7c3;font-size:13px}.progress{height:7px;background:#282f46;border-radius:99px;overflow:hidden}.progress span{display:block;height:100%;background:linear-gradient(90deg,#7257ff,#b18cff);border-radius:99px}.task-body small{display:block;margin-top:6px;color:#8994b1}.task-btn{border:0;border-radius:12px;padding:10px 16px;background:#7257ff;color:white;font-weight:700;cursor:pointer}.task-btn:disabled{opacity:.7}
@media(max-width:600px){.task-card{align-items:flex-start}.task-btn{padding:9px 12px}.hero-card h1{font-size:23px}}
</style>
