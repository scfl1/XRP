<template>
  <div class="bottom-nav">

    <div
      class="item"
      :class="{ active: isActive('/home') }"
      @click="go('/home')"
    >
      <i class="fas fa-home"></i>
      <span>الرئيسية</span>
    </div>

    <div
      class="item"
      :class="{ active: isActive('/tasks') }"
      @click="go('/tasks')"
    >
      <i class="fas fa-list-check"></i>
      <span>الأنشطة</span>
    </div>

    <!-- زر الفريق الجديد -->
    <div
      class="item"
      :class="{ active: isActive('/team') }"
      @click="go('/team')"
    >
      <i class="fas fa-users"></i>
      <span>المجتمع</span>
    </div>

    <div
      class="item"
      :class="{ active: isActive('/vip') }"
      @click="go('/vip')"
    >
      <i class="fas fa-crown"></i>
      <span>الباقات</span>
    </div>

    <div
      class="item"
      :class="{ active: isActive('/profile') }"
      @click="go('/profile')"
    >
      <i class="fas fa-user"></i>
      <span>حسابي</span>
    </div>

  </div>
</template>

<script>
export default {
  name: "BottomNav",
  methods: {
    go(route) {
      this.$router.push(route);
    },
    isActive(route) {
      return this.$route.path === route;
    }
  }
};
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(12,16,31,.94);
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -10px 35px rgba(0,0,0,.35);
  border-radius: 20px 20px 0 0; backdrop-filter: blur(18px); border-top: 1px solid rgba(169,140,255,.22);
}

.item {
  text-align: center;
  color: #7f89a8;
  font-size: 14px;
}

.item i {
  display: block;
  font-size: 20px;
  margin-bottom: 3px;
}

.active {
  color: #a98cff;
}
</style>
