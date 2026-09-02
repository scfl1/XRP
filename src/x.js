import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// ===== Import Views =====
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import Tasks from "../views/Tasks.vue";
import VIP from "../views/VIP.vue";
import Shares from "../views/Shares.vue";
import Profile from "../views/Profile.vue";
import Recharge from "../views/Recharge.vue";
import Withdraw from "../views/Withdraw.vue";
import Team from "../views/Team.vue";
import Admin from "../views/Admin.vue";
import Forbidden from "../views/Forbidden.vue";
import Transactions from "../views/Transactions.vue";

// ===== Admin Emails =====
const admins = [
  "azad.333388@gmail.com",
  "admin2@gmail.com",
  "owner@gmail.com",
];

// ===== Routes =====
const routes = [
  { path: "/", redirect: "/login" },

  {
    path: "/login",
    name: "login",
    component: Login,
    meta: { guestOnly: true },
  },

  {
    path: "/register",
    name: "register",
    component: Register,
    meta: { guestOnly: true },
  },

  // ===== User Pages =====
  {
    path: "/home",
    component: Home,
    meta: { requiresAuth: true },
  },

  {
    path: "/tasks",
    component: Tasks,
    meta: { requiresAuth: true },
  },

  {
    path: "/vip",
    component: VIP,
    meta: { requiresAuth: true },
  },

  {
    path: "/shares",
    component: Shares,
    meta: { requiresAuth: true },
  },

  {
    path: "/profile",
    component: Profile,
    meta: { requiresAuth: true },
  },

  {
    path: "/recharge",
    component: Recharge,
    meta: { requiresAuth: true },
  },

  {
    path: "/withdraw",
    component: Withdraw,
    meta: { requiresAuth: true },
  },

  {
    path: "/team",
    component: Team,
    meta: { requiresAuth: true },
  },

  {
    path: "/transactions",
    component: Transactions,
    meta: { requiresAuth: true },
  },

  // ===== Admin =====
  {
    path: "/admin",
    component: Admin,
    meta: { requiresAdmin: true },
  },

  // ===== Forbidden =====
  {
    path: "/403",
    component: Forbidden,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ===================================================
// Firebase Auth State
// ===================================================
const auth = getAuth();

let authReady = false;
let currentUser = null;

// تحميل المستخدم مرة واحدة
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  authReady = true;
});

// ===================================================
// التحقق من حظر المستخدم
// ===================================================
async function isUserBlocked(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.blocked === true;
    }

    return false;
  } catch (error) {
    console.error("خطأ في التحقق من الحظر:", error);
    return false;
  }
}

// ===================================================
// Navigation Guard
// ===================================================
router.beforeEach(async (to, from, next) => {

  // انتظار Firebase Auth
  if (!authReady) {
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        if (authReady) {
          clearInterval(timer);
          resolve();
        }
      }, 20);
    });
  }

  const { requiresAuth, guestOnly, requiresAdmin } = to.meta;

  // ===================================================
  // التحقق من الحظر
  // ===================================================
  if (currentUser) {
    const blocked = await isUserBlocked(currentUser.uid);

    if (blocked) {
      await signOut(auth);
      currentUser = null;

      // تحويل لصفحة الحظر الجميلة
      return next("/403");
    }
  }

  // ===================================================
  // صفحات الضيوف فقط
  // ===================================================
  if (guestOnly && currentUser) {
    if (admins.includes(currentUser.email)) {
      return next("/admin");
    }

    return next("/home");
  }

  // ===================================================
  // يتطلب تسجيل دخول
  // ===================================================
  if (requiresAuth && !currentUser) {
    return next("/login");
  }

  // ===================================================
  // يتطلب Admin
  // ===================================================
  if (requiresAdmin) {

    if (!currentUser) {
      return next("/login");
    }

    if (!admins.includes(currentUser.email)) {
      return next("/403");
    }

    return next();
  }

  return next();
});

export default router;
