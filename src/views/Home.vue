<template>
<main class="page home">
  <header class="topbar">
    <div class="tools">
      <button class="icon-btn notify" @click="go('/messages')"><i class="far fa-bell"></i><em></em></button>
      <button class="icon-btn"><i class="fas fa-wallet"></i></button>
      <button class="icon-btn history" @click="go('/assets')"><i class="far fa-clock"></i><i class="fas fa-bars-staggered mini"></i></button>
    </div>
    <button class="search" @click="go('/assets')"><span>بحث</span><i class="fas fa-search"></i></button>
    <button class="brand" @click="go('/menu')"><CwaLogo/><i class="fas fa-bars"></i></button>
  </header>

  <section class="balance">
    <div class="label"><i class="far fa-eye"></i> محفظة الحساب</div>
    <div class="balance-row"><button class="all" @click="go('/assets')">جميع الأصول <i class="fas fa-chevron-left"></i></button><div class="amount"><strong>${{total.toFixed(2)}}</strong><span>خلال 24 ساعة <b>0.00% <i class="fas fa-arrow-up-right"></i></b></span></div></div>
  </section>

  <section class="quick">
    <Quick icon="fas fa-arrow-up" text="دفع" @click="go('/deposit')"/><Quick icon="fas fa-arrow-down" text="استقبال" @click="go('/deposit')"/><Quick icon="fas fa-landmark" text="شراء/بيع" @click="go('/trade')"/><Quick icon="fas fa-right-left" text="تبديل" @click="go('/trade')"/><Quick icon="fas fa-shapes" text="أكثر" @click="go('/menu')"/>
  </section>

  <section class="promos"><article class="promo cozy"><h3>Get a Cozy Card</h3><p>Works with <b>Pay</b> <span>G Pay</span></p><div class="black-card">COZY <small>USD</small><b>VISA</b></div><Dots count="2"/></article><article class="promo leverage"><h3>1001x <u>1001</u></h3><p>استخدم رافعة مالية<br><b>1000x</b> لزيادة مكاسبك</p><Dots count="3"/></article></section>

  <section class="start"><div class="section-head"><button>إخفاء الكل</button><h2>البدء</h2></div><button class="verify" @click="go('/menu')"><i class="fas fa-chevron-left"></i><span><b>إعداد المصادقة</b><small>تفعيل إجراء التحقق بخطوتين لتعزيز الأمان</small></span><i class="far fa-id-card"></i></button></section>
  <section class="markets"><h2>الأسواق</h2><div class="market-grid"><Market v-for="m in markets" :key="m.symbol" :m="m"/></div></section>
</main>
</template>
<script setup>
import {computed,ref,onMounted} from 'vue';import {useRouter} from 'vue-router';import {auth,db} from '../firebase';import {doc,getDoc} from 'firebase/firestore';import {onAuthStateChanged} from 'firebase/auth'
import Quick from '../components/Quick.vue';import Dots from '../components/Dots.vue';import Market from '../components/Market.vue';import CwaLogo from '../components/CwaLogo.vue'
const router=useRouter(),balance=ref(0),vip=ref(0),deposit=ref(0),total=computed(()=>balance.value+vip.value+deposit.value),go=p=>router.push(p)
const markets=[{symbol:'TRX',price:'$0.32',change:'1.66%',down:true},{symbol:'USDT',price:'$0.99',change:'0.02%',down:true},{symbol:'XRP',price:'$1.32',change:'4.28%',down:true},{symbol:'DOGE',price:'$0.08',change:'2.68%',down:true},{symbol:'XLM',price:'$0.17',change:'3.13%',down:true}]
onMounted(()=>onAuthStateChanged(auth,async u=>{if(!u)return;try{const s=await getDoc(doc(db,'users',u.uid));if(s.exists()){const d=s.data();balance.value=Number(d.balance||0);vip.value=Number(d.vipBalance||0);deposit.value=Number(d.depositBalance||0)}}catch{}}))
</script>
<style scoped>
.home{padding:18px 46px 110px}.topbar{height:88px;display:flex;align-items:center;gap:22px;direction:rtl}.tools{display:flex;gap:22px;align-items:center;direction:ltr;flex:1}.icon-btn{font-size:27px;position:relative}.notify em{position:absolute;width:8px;height:8px;background:#82a91b;border-radius:50%;top:1px;right:0}.mini{position:absolute;font-size:10px;right:0;bottom:6px}.search{width:190px;height:62px;border:0;background:#f5f5f7;border-radius:18px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;color:#b1b2b7}.search i{font-size:26px;color:#777}.brand{display:flex;align-items:center;gap:12px;border:0;background:none;color:#b1b2b8;font-size:22px}.balance{margin-top:24px}.label{text-align:right;color:#919299;font-size:20px;display:flex;justify-content:flex-end;gap:8px}.balance-row{display:flex;justify-content:space-between;margin-top:12px}.all{border:0;background:none;color:#8c8d93;font-size:20px;display:flex;gap:15px;align-items:center}.amount{text-align:right}.amount strong{font-size:44px;line-height:1;display:block}.amount span{font-size:19px;color:#92939a}.amount b{color:#51a163;margin-right:8px}.quick{display:grid;grid-template-columns:repeat(5,1fr);direction:rtl;margin:68px 0 55px}.quick button{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:13px;color:#25272c;font-size:17px}.quick i{font-size:34px;color:#526c23}.promos{display:grid;grid-template-columns:1fr 1fr;gap:30px;direction:ltr}.promo{height:236px;border:1px solid #e7e7ea;border-radius:22px;position:relative;padding:34px 38px;overflow:hidden}.promo h3{margin:0;font-size:24px}.promo p{color:#85868c;font-size:19px;line-height:1.8;margin-top:24px}.cozy .black-card{position:absolute;right:29px;bottom:72px;width:91px;height:61px;border-radius:9px;background:#17181c;color:#fff;padding:8px;font-weight:800;font-size:13px}.black-card small{display:block;font-size:7px}.black-card b{position:absolute;right:7px;bottom:5px;font-size:8px}.leverage{text-align:center}.leverage h3{font-size:21px}.leverage p{margin-top:27px}.leverage p b{font-weight:700}.section-head{display:flex;justify-content:space-between;align-items:center;margin-top:118px}.section-head h2{font-size:20px;margin:0}.section-head button{border:0;background:none;color:#8c8d93;font-size:18px}.verify{margin-top:42px;width:100%;min-height:143px;border:1px solid #e7e7ea;border-radius:21px;background:#fff;display:flex;align-items:center;gap:20px;padding:25px 30px;text-align:right}.verify>i:first-child{color:#8b8c92}.verify>i:last-child{font-size:28px}.verify span{flex:1}.verify b{display:block;font-size:19px}.verify small{display:block;color:#999ba0;font-size:16px;margin-top:8px}.markets{margin-top:60px}.markets h2{text-align:right;font-size:22px}.market-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.market{min-width:0}
@media(max-width:600px){.home{padding:12px 46px 110px}.topbar{gap:16px}.tools{gap:17px}.search{width:190px;height:62px}.balance{margin-top:24px}.quick{margin-top:65px}.promos{gap:30px}.promo{height:236px;padding:34px 38px}.market-grid{display:block}.market-grid>*{display:none}.market-grid>*:first-child{display:block}.section-head{margin-top:116px}}
</style>
