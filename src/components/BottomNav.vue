<template>
  <nav class="bottom-nav">
    <button v-for="item in items" :key="item.path" :class="['nav-item',{active:isActive(item.path)}]" @click="router.push(item.path)">
      <i :class="item.icon"></i><span>{{item.label}}</span>
    </button>
  </nav>
</template>
<script setup>
import { useRoute,useRouter } from 'vue-router'
const route=useRoute(),router=useRouter()
const items=[
 {path:'/messages',icon:'far fa-comment-dots',label:'المحادثات'},
 {path:'/assets',icon:'fas fa-wallet',label:'الأصول'},
 {path:'/trade',icon:'fas fa-chart-simple',label:'تجارة'},
 {path:'/predict',icon:'fas fa-circle-plus',label:'توقع'},
 {path:'/home',icon:'fas fa-house',label:'الرئيسية'}]
const isActive=p=>p==='/home'?route.path==='/home':route.path.startsWith(p)
</script>
<style scoped>
.bottom-nav{position:fixed;z-index:50;left:0;right:0;bottom:0;height:82px;background:rgba(255,255,255,.98);border-top:1px solid #eee;display:grid;grid-template-columns:repeat(5,1fr);padding-bottom:env(safe-area-inset-bottom);direction:rtl}.nav-item{border:0;background:none;color:#202228;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-size:12px;font-weight:600}.nav-item i{font-size:25px;line-height:1}.nav-item.active{color:var(--green)}
@media(min-width:760px){.bottom-nav{left:50%;right:auto;transform:translateX(-50%);width:760px}}
</style>
