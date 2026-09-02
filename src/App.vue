<template>
  <div class="app" :dir="dir">
    <router-view />
    <BottomNav v-if="showNav" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
const route = useRoute()
const showNav = computed(() => route.meta.bottomNav === true)
const dir = computed(() => localStorage.getItem('cwaax_lang') === 'en' ? 'ltr' : 'rtl')
</script>
