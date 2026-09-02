import {createRouter,createWebHistory} from 'vue-router'
import {auth} from '../firebase'
import {onAuthStateChanged} from 'firebase/auth'
import Login from '../views/Login.vue';import Register from '../views/Register.vue';import Home from '../views/Home.vue';import Assets from '../views/Assets.vue';import Menu from '../views/Menu.vue';import Messages from '../views/Messages.vue';import Trade from '../views/Trade.vue';import Predict from '../views/Predict.vue'
const routes=[
 {path:'/',redirect:'/home'},
 {path:'/login',component:Login,meta:{guestOnly:true}},
 {path:'/register',component:Register,meta:{guestOnly:true}},
 {path:'/home',component:Home,meta:{requiresAuth:true,bottomNav:true}},
 {path:'/assets',component:Assets,meta:{requiresAuth:true,bottomNav:true}},
 {path:'/messages',component:Messages,meta:{requiresAuth:true,bottomNav:true}},
 {path:'/trade',component:Trade,meta:{requiresAuth:true,bottomNav:true}},
 {path:'/predict',component:Predict,meta:{requiresAuth:true,bottomNav:true}},
 {path:'/menu',component:Menu,meta:{requiresAuth:true}},
 {path:'/:pathMatch(.*)*',redirect:'/home'}]
const router=createRouter({history:createWebHistory(),routes})
let ready=false,user=null
onAuthStateChanged(auth,u=>{user=u;ready=true})
router.beforeEach(async(to)=>{if(!ready)await new Promise(r=>{const t=setInterval(()=>{if(ready){clearInterval(t);r()}},20)});if(to.meta.requiresAuth&&!user)return '/login';if(to.meta.guestOnly&&user)return '/home'})
export default router
