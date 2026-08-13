<template>
  <div class="shares-page">
    <div class="container">
      <!-- Header -->
      <div class="shares-header">
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-right"></i>
        </button>
        <h1 class="page-title">📈 أسهم الشركة</h1>
        <div class="header-spacer"></div>
      </div>

      <!-- Company Info Card -->
      <div class="company-card">
        <div class="company-logo">
          <div class="logo-icon">🏦</div>
          <h2 class="company-name">Palm Treasure</h2>
        </div>
        <div class="stock-status">
          <span class="status-badge open">
            <span class="pulse-dot"></span>
            السوق مفتوح
          </span>
        </div>
      </div>

      <!-- Stock Price Card -->
      <div class="price-card" v-if="stockData">
        <div class="price-main">
          <div class="current-price">
            <span class="price-value">{{ formatPrice(stockData.currentPrice) }}</span>
            <span class="currency">USDT</span>
          </div>
          <div class="price-change" :class="priceChange >= 0 ? 'positive' : 'negative'">
            <i :class="priceChange >= 0 ? 'fas fa-caret-up' : 'fas fa-caret-down'"></i>
            <span>{{ formatPrice(Math.abs(priceChange)) }}</span>
            <span>({{ priceChangePercent >= 0 ? '+' : '' }}{{ formatPrice(priceChangePercent) }}%)</span>
          </div>
        </div>
        
        <div class="price-details">
          <div class="detail-item">
            <span class="detail-label">أعلى سعر</span>
            <span class="detail-value high">{{ formatPrice(stockData.highPrice) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">أدنى سعر</span>
            <span class="detail-value low">{{ formatPrice(stockData.lowPrice) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">حجم التداول</span>
            <span class="detail-value">{{ formatVolume(stockData.volume) }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-card">
        <div class="gold-spinner"></div>
        <div class="loading-text">جاري تحميل البيانات...</div>
      </div>

      <!-- Shares Statistics -->
      <div class="stats-card" v-if="!loading && stockData">
        <h3 class="stats-title">📊 إحصائيات الأسهم</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">إجمالي الأسهم</span>
            <span class="stat-value">{{ formatNumber(stockData.totalShares) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">الأسهم المباعة</span>
            <span class="stat-value">{{ formatNumber(stockData.soldShares) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">الأسهم المتاحة</span>
            <span class="stat-value highlight">{{ formatNumber(stockData.availableShares) }}</span>
          </div>
          <div class="stat-item full-width">
            <span class="stat-label">نسبة البيع</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: soldPercentage + '%' }"></div>
            </div>
            <span class="stat-value">{{ formatPrice(soldPercentage) }}%</span>
          </div>
        </div>
        <div v-if="stockData.availableShares <= 0" class="sold-out-message">
          🚫 تم بيع جميع أسهم الشركة
        </div>
      </div>

      <!-- Market Info -->
      <div class="market-info-card" v-if="!loading && stockData">
        <div class="market-info-header">
          <i class="fas fa-chart-line"></i>
          <span>معلومات السوق</span>
        </div>
        <div class="market-info-grid">
          <div class="market-info-item">
            <span class="market-label">آخر تحديث</span>
            <span class="market-value">{{ lastUpdateTime }}</span>
          </div>
          <div class="market-info-item">
            <span class="market-label">سعر الافتتاح</span>
            <span class="market-value gold">{{ formatPrice(stockData.openingPrice || stockData.currentPrice) }} USDT</span>
          </div>
          <div class="market-info-item">
            <span class="market-label">التغير اليومي</span>
            <span class="market-value" :class="dailyChange >= 0 ? 'profit' : 'loss'">
              {{ dailyChange >= 0 ? '+' : '' }}{{ formatPrice(dailyChange) }} USDT
            </span>
          </div>
        </div>
      </div>

      <!-- User Portfolio -->
      <div class="portfolio-card" v-if="!loading && userShares">
        <h3 class="portfolio-title">💼 محفظتي</h3>
        <div class="portfolio-grid">
          <div class="portfolio-item">
            <span class="portfolio-label">الأسهم المملوكة</span>
            <span class="portfolio-value">{{ userShares.shares }}</span>
          </div>
          <div class="portfolio-item">
            <span class="portfolio-label">متوسط سعر الشراء</span>
            <span class="portfolio-value">{{ formatPrice(userShares.avgPrice) }} USDT</span>
          </div>
          <div class="portfolio-item">
            <span class="portfolio-label">القيمة الحالية</span>
            <span class="portfolio-value">{{ formatPrice(userShares.shares * stockData.currentPrice) }} USDT</span>
          </div>
          <div class="portfolio-item">
            <span class="portfolio-label">إجمالي الاستثمار</span>
            <span class="portfolio-value">{{ formatPrice(userShares.invested) }} USDT</span>
          </div>
          <div class="portfolio-item full-width">
            <span class="portfolio-label">الربح/الخسارة</span>
            <span class="portfolio-value" :class="portfolioProfit >= 0 ? 'profit' : 'loss'">
              {{ portfolioProfit >= 0 ? '+' : '' }}{{ formatPrice(portfolioProfit) }} USDT
              ({{ profitPercentage >= 0 ? '+' : '' }}{{ formatPrice(profitPercentage) }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- عرض الرصيد -->
      <div class="balance-card" v-if="!loading">
        <div class="balance-display">
          <div class="balance-icon">💰</div>
          <div class="balance-content">
            <span class="balance-label">رصيدك المتاح</span>
            <span class="balance-amount">{{ formatPrice(userBalance) }} USDT</span>
          </div>
          <button @click="refreshBalance" class="refresh-btn" title="تحديث الرصيد">
            <i class="fas fa-sync-alt" :class="{ spinning: refreshing }"></i>
          </button>
        </div>
      </div>

      <!-- Trade Buttons -->
      <div class="trade-buttons" v-if="!loading && stockData">
        <button 
          @click="openTradeModal('buy')" 
          class="trade-btn buy-btn"
          :disabled="stockData.availableShares <= 0"
        >
          <i class="fas fa-shopping-cart"></i>
          شراء الأسهم
        </button>
        <button 
          @click="openTradeModal('sell')" 
          class="trade-btn sell-btn"
          :disabled="!userShares || userShares.shares <= 0"
        >
          <i class="fas fa-money-bill-wave"></i>
          بيع الأسهم
        </button>
      </div>
    </div>

    <!-- Trade Modal -->
    <transition name="modal-fade-scale">
      <div v-if="showTradeModal" class="modal-overlay" @click.self="closeTradeModal">
        <div class="modal-content trade-modal">
          <div class="modal-header">
            <h3>{{ tradeType === 'buy' ? '🛒 شراء الأسهم' : '💰 بيع الأسهم' }}</h3>
            <button class="close-btn" @click="closeTradeModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="trade-info">
              <div class="info-row">
                <span>السعر الحالي:</span>
                <span class="price-highlight">{{ formatPrice(stockData.currentPrice) }} USDT</span>
              </div>
              <div class="info-row" v-if="tradeType === 'buy'">
                <span>الأسهم المتاحة:</span>
                <span class="price-highlight">{{ formatNumber(stockData.availableShares) }}</span>
              </div>
              <div class="info-row" v-else>
                <span>أسهمك:</span>
                <span class="price-highlight">{{ userShares ? userShares.shares : 0 }}</span>
              </div>
            </div>

            <div class="input-group">
              <label>عدد الأسهم</label>
              <input 
                v-model.number="tradeQuantity" 
                type="number" 
                min="1" 
                :max="maxTradeQuantity"
                placeholder="أدخل عدد الأسهم"
                class="trade-input"
                @input="validateQuantity"
              />
            </div>

            <div v-if="tradeType === 'buy' && tradeQuantity > 0" class="cost-info">
              <span>💵 المبلغ المطلوب:</span>
              <span class="cost-value" :class="{ 'insufficient': tradeQuantity * stockData.currentPrice > userBalance }">
                {{ formatPrice(tradeQuantity * stockData.currentPrice) }} USDT
              </span>
            </div>

            <div v-if="tradeType === 'buy'" class="balance-info">
              <span>💰 رصيدك المتاح:</span>
              <span class="balance-value" :class="{ 'insufficient-balance': userBalance <= 0 }">
                {{ formatPrice(userBalance) }} USDT
              </span>
            </div>

            <div v-if="errorMessage" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errorMessage }}
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeTradeModal">إلغاء</button>
            <button 
              class="btn-confirm" 
              @click="executeTrade"
              :disabled="!isTradeValid || processing"
            >
              <i v-if="processing" class="fas fa-spinner fa-spin"></i>
              <span v-else>{{ tradeType === 'buy' ? 'تأكيد الشراء' : 'تأكيد البيع' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Notification -->
    <transition name="slide-down">
      <div v-if="showNotification" class="notification" :class="notificationType">
        <i :class="notificationType === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { auth, db } from "../firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc,
  serverTimestamp,
  runTransaction,
  onSnapshot
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "Shares",
  data() {
    return {
      loading: true,
      refreshing: false,
      processing: false,
      stockData: null,
      userShares: null,
      userBalance: 0,
      showTradeModal: false,
      tradeType: 'buy',
      tradeQuantity: 1,
      errorMessage: '',
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
      lastUpdateTime: '--',
      dailyChange: 0,
      stockReady: false,
      unsubscribeUser: null,
      
      // ===== متغيرات نظام السعر الجديد =====
      priceInterval: null,
      hasShareholders: false,      // هل يوجد مالكين للأسهم؟
      minimumPrice: 0.10,          // الحد الأدنى للسعر
      declineSpeed: 0.0005,        // سرعة الانخفاض (0.05% لكل تحديث)
      naturalVolatility: 0.008,    // تقلب السعر الطبيعي (0.8%)
      priceUpdateInterval: 5000,   // مدة التحديث (5 ثواني)
      // =====================================
    };
  },

  computed: {
    priceChange() {
      if (!this.stockData) return 0;
      return this.stockData.currentPrice - this.stockData.previousPrice;
    },
    priceChangePercent() {
      if (!this.stockData || this.stockData.previousPrice === 0) return 0;
      return (this.priceChange / this.stockData.previousPrice) * 100;
    },
    soldPercentage() {
      if (!this.stockData || this.stockData.totalShares === 0) return 0;
      return (this.stockData.soldShares / this.stockData.totalShares) * 100;
    },
    maxTradeQuantity() {
      if (!this.stockData) return 0;
      if (this.tradeType === 'buy') {
        return this.stockData.availableShares;
      } else {
        return this.userShares ? this.userShares.shares : 0;
      }
    },
    isTradeValid() {
      if (!this.tradeQuantity || this.tradeQuantity <= 0 || !this.stockData) return false;
      if (this.tradeQuantity > this.maxTradeQuantity) return false;
      
      if (this.tradeType === 'buy') {
        const totalCost = this.tradeQuantity * this.stockData.currentPrice;
        if (totalCost > this.userBalance) return false;
      }
      
      return true;
    },
    portfolioProfit() {
      if (!this.userShares || !this.stockData) return 0;
      const currentValue = this.userShares.shares * this.stockData.currentPrice;
      return currentValue - this.userShares.invested;
    },
    profitPercentage() {
      if (!this.userShares || !this.stockData || this.userShares.invested === 0) return 0;
      const currentValue = this.userShares.shares * this.stockData.currentPrice;
      return ((currentValue - this.userShares.invested) / this.userShares.invested) * 100;
    }
  },

  mounted() {
    this.initLocalData();
  },

  beforeUnmount() {
    if (this.unsubscribeUser) {
      this.unsubscribeUser();
    }
    if (this.priceInterval) {
      clearInterval(this.priceInterval);
    }
  },

  methods: {
    async initLocalData() {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          this.$router.push("/login");
          return;
        }
        
        // محاولة تحميل السعر من localStorage
        const savedPrice = this.loadPriceFromLocalStorage();
        
        if (savedPrice) {
          // استخدام السعر المحفوظ
          this.stockData = {
            currentPrice: savedPrice.currentPrice,
            previousPrice: savedPrice.currentPrice,
            highPrice: savedPrice.highPrice || 850,
            lowPrice: savedPrice.lowPrice || 0.10,
            volume: 50000000,
            totalShares: 300000000,
            availableShares: 100000,
            soldShares: 299900000,
            openingPrice: savedPrice.openingPrice || savedPrice.currentPrice
          };
        } else {
          // إنشاء سعر ابتدائي جديد
          const initialPrice = 650;
          this.stockData = {
            currentPrice: initialPrice,
            previousPrice: initialPrice,
            highPrice: 850,
            lowPrice: 0.10,
            volume: 50000000,
            totalShares: 300000000,
            availableShares: 100000,
            soldShares: 299900000,
            openingPrice: initialPrice
          };
          // حفظ السعر في localStorage
          this.savePriceToLocalStorage(this.stockData);
        }
        
        this.dailyChange = 0;
        this.lastUpdateTime = new Date().toLocaleTimeString('ar-SA');
        this.stockReady = true;
        
        await this.loadUserData();
        this.listenToUserBalance();
        
        // بدء تحديث السعر التلقائي
        this.startPriceUpdates();
        
        this.loading = false;
      });
    },

    // ================================================================
    // ===== دوال حفظ وقراءة السعر من localStorage =====
    // ================================================================

    savePriceToLocalStorage(stockData) {
      try {
        const priceData = {
          currentPrice: stockData.currentPrice,
          highPrice: stockData.highPrice,
          lowPrice: stockData.lowPrice,
          openingPrice: stockData.openingPrice,
          lastUpdate: Date.now()
        };
        localStorage.setItem('palmTreasurePrice', JSON.stringify(priceData));
        console.log('✅ تم حفظ السعر في localStorage:', priceData.currentPrice);
      } catch (error) {
        console.error('❌ خطأ في حفظ السعر:', error);
      }
    },

    loadPriceFromLocalStorage() {
      try {
        const savedData = localStorage.getItem('palmTreasurePrice');
        if (savedData) {
          const priceData = JSON.parse(savedData);
          console.log('✅ تم تحميل السعر من localStorage:', priceData.currentPrice);
          return priceData;
        }
      } catch (error) {
        console.error('❌ خطأ في قراءة السعر:', error);
      }
      return null;
    },

    // ================================================================
    // ===== نظام تحريك السعر الجديد (تم تعديله فقط هنا) =====
    // ================================================================

    startPriceUpdates() {
      if (this.priceInterval) {
        clearInterval(this.priceInterval);
      }
      
      this.priceInterval = setInterval(() => {
        this.updateStockPrice();
      }, this.priceUpdateInterval);
    },

    updateStockPrice() {
      if (!this.stockData) return;
      
      // حفظ السعر السابق
      this.stockData.previousPrice = this.stockData.currentPrice;
      
      // التحقق من وجود مالكين (بناءً على أسهم المستخدم الحالي)
      const hasShareholders = this.userShares && this.userShares.shares > 0;
      
      if (hasShareholders) {
        // === وضع الانخفاض التدريجي (لا يرتفع أبداً) ===
        this.updatePriceDeclining();
      } else {
        // === وضع الحركة الطبيعية (صعود وهبوط) ===
        this.updatePriceNatural();
      }
      
      // تحديث أعلى وأدنى سعر
      if (this.stockData.currentPrice > this.stockData.highPrice) {
        this.stockData.highPrice = this.stockData.currentPrice;
      }
      if (this.stockData.currentPrice < this.stockData.lowPrice) {
        this.stockData.lowPrice = this.stockData.currentPrice;
      }
      
      // حفظ السعر في localStorage بعد كل تحديث
      this.savePriceToLocalStorage(this.stockData);
      
      // تحديث وقت آخر تحديث
      this.lastUpdateTime = new Date().toLocaleTimeString('ar-SA');
      
      // تحديث التغير اليومي
      this.dailyChange = this.stockData.currentPrice - this.stockData.openingPrice;
    },

    // دالة الانخفاض التدريجي (تنزل فقط حتى الحد الأدنى)
    updatePriceDeclining() {
      const currentPrice = this.stockData.currentPrice;
      const targetPrice = this.minimumPrice;
      
      // إذا كان السعر عند الحد الأدنى أو أقل، يبقى ثابت
      if (currentPrice <= targetPrice) {
        this.stockData.currentPrice = targetPrice;
        return;
      }
      
      // حساب مقدار الانخفاض
      let declineAmount = currentPrice * this.declineSpeed;
      
      // التأكد من عدم النزول تحت الحد الأدنى
      if (currentPrice - declineAmount < targetPrice) {
        this.stockData.currentPrice = targetPrice;
      } else {
        this.stockData.currentPrice = Math.round((currentPrice - declineAmount) * 100) / 100;
      }
    },

    // دالة الحركة الطبيعية (صعود وهبوط عشوائي)
    updatePriceNatural() {
      const currentPrice = this.stockData.currentPrice;
      
      // تغير عشوائي بين -0.8% و +0.8%
      const randomChange = (Math.random() * 2 - 1) * this.naturalVolatility;
      let newPrice = currentPrice * (1 + randomChange);
      
      // التأكد من عدم النزول تحت الحد الأدنى
      if (newPrice < this.minimumPrice) {
        newPrice = this.minimumPrice;
      }
      
      // منع الارتفاع المفاجئ الكبير (حماية)
      if (newPrice > currentPrice * 1.05) {
        newPrice = currentPrice * 1.05;
      }
      
      this.stockData.currentPrice = Math.round(newPrice * 100) / 100;
    },

    // ===== نهاية نظام تحريك السعر =====
    // ================================================================

    listenToUserBalance() {
      const user = auth.currentUser;
      if (!user) return;

      if (this.unsubscribeUser) {
        this.unsubscribeUser();
      }

      const userRef = doc(db, "users", user.uid);
      this.unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.userBalance = data.vipBalance || data.withdrawBalance || 0;
          console.log("✅ تم تحديث الرصيد:", this.userBalance);
        }
      }, (error) => {
        console.error("❌ خطأ في الاستماع لرصيد المستخدم:", error);
      });
    },

    async loadUserData() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          this.userBalance = data.vipBalance || data.withdrawBalance || 0;
          console.log("✅ تم تحميل الرصيد:", this.userBalance);
        }

        const sharesDoc = await getDoc(doc(db, "users", user.uid, "shares", "portfolio"));
        if (sharesDoc.exists()) {
          this.userShares = sharesDoc.data();
        } else {
          this.userShares = null;
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    },

    async refreshBalance() {
      this.refreshing = true;
      await this.loadUserData();
      setTimeout(() => {
        this.refreshing = false;
      }, 500);
      this.showNotificationMessage('success', `✅ تم تحديث الرصيد: ${this.formatPrice(this.userBalance)} USDT`);
    },

    async openTradeModal(type) {
      if (!this.stockData || !this.stockReady) {
        this.showNotificationMessage('error', '❌ جاري تحميل بيانات السهم، يرجى الانتظار لحظة...');
        return;
      }
      
      await this.loadUserData();
      
      this.tradeType = type;
      this.tradeQuantity = 1;
      this.errorMessage = '';
      this.showTradeModal = true;
    },

    closeTradeModal() {
      this.showTradeModal = false;
      this.tradeQuantity = 1;
      this.errorMessage = '';
    },

    validateQuantity() {
      this.errorMessage = '';
      
      if (!this.tradeQuantity || this.tradeQuantity <= 0) {
        this.errorMessage = 'يجب أن يكون عدد الأسهم أكبر من 0';
        return;
      }
      
      if (this.tradeQuantity > this.maxTradeQuantity) {
        this.errorMessage = `لا يمكنك ${this.tradeType === 'buy' ? 'شراء' : 'بيع'} أكثر من ${this.formatNumber(this.maxTradeQuantity)} سهم`;
        return;
      }
      
      if (this.tradeType === 'buy' && this.stockData) {
        const totalCost = this.tradeQuantity * this.stockData.currentPrice;
        if (totalCost > this.userBalance) {
          this.errorMessage = `رصيدك غير كافٍ (المطلوب: ${this.formatPrice(totalCost)} USDT، المتاح: ${this.formatPrice(this.userBalance)} USDT)`;
          return;
        }
      }
    },

    async executeTrade() {
      if (!this.isTradeValid || !this.stockData || !this.stockReady) {
        this.showNotificationMessage('error', '❌ بيانات السهم غير متوفرة، يرجى المحاولة لاحقاً');
        return;
      }
      
      this.processing = true;
      
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("يجب تسجيل الدخول أولاً");
        
        const quantity = this.tradeQuantity;
        const price = this.stockData.currentPrice;
        const totalAmount = quantity * price;
        
        const userRef = doc(db, "users", user.uid);
        const sharesRef = doc(db, "users", user.uid, "shares", "portfolio");
        
        await runTransaction(db, async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists()) throw new Error("المستخدم غير موجود");
          
          const sharesDoc = await transaction.get(sharesRef);
          
          const userData = userDoc.data();
          const userBalance = userData.vipBalance || userData.withdrawBalance || 0;
          
          console.log("💰 الرصيد من Firestore:", userBalance);
          
          if (this.tradeType === 'buy') {
            if (this.stockData.availableShares < quantity) {
              throw new Error("الأسهم المتاحة غير كافية");
            }
            
            if (userBalance < totalAmount) {
              throw new Error(`رصيدك غير كافٍ (المطلوب: ${this.formatPrice(totalAmount)} USDT، المتاح: ${this.formatPrice(userBalance)} USDT)`);
            }
            
            // ✅ تم التعديل: لا يتم تغيير السعر عند الشراء،
            // السعر سيتغير تدريجياً عن طريق نظام التحديث التلقائي
            
            // تحديث الأسهم فقط
            this.stockData.availableShares -= quantity;
            this.stockData.soldShares += quantity;
            this.stockData.volume += totalAmount;
            this.lastUpdateTime = new Date().toLocaleTimeString('ar-SA');
            
            // حفظ السعر بعد التحديث
            this.savePriceToLocalStorage(this.stockData);
            
            // خصم من رصيد المستخدم
            transaction.update(userRef, {
              vipBalance: userBalance - totalAmount
            });
            
            this.userBalance = userBalance - totalAmount;
            
            if (sharesDoc.exists()) {
              const currentShares = sharesDoc.data();
              const newTotalShares = (currentShares.shares || 0) + quantity;
              const newInvested = (currentShares.invested || 0) + totalAmount;
              const newAvgPrice = newInvested / newTotalShares;
              
              transaction.update(sharesRef, {
                shares: newTotalShares,
                avgPrice: newAvgPrice,
                invested: newInvested,
                updatedAt: serverTimestamp()
              });
            } else {
              transaction.set(sharesRef, {
                shares: quantity,
                avgPrice: price,
                invested: totalAmount,
                totalProfit: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            }
            
          } else {
            // عملية بيع
            if (!sharesDoc.exists()) throw new Error("لا تمتلك أي أسهم");
            
            const currentShares = sharesDoc.data();
            const userSharesCount = currentShares.shares || 0;
            
            if (userSharesCount < quantity) {
              throw new Error("لا تمتلك هذا العدد من الأسهم");
            }
            
            const newShares = userSharesCount - quantity;
            const sellRatio = quantity / userSharesCount;
            const soldInvested = currentShares.invested * sellRatio;
            const newInvested = currentShares.invested - soldInvested;
            const profit = totalAmount - soldInvested;
            
            // ✅ تم التعديل: لا يتم تغيير السعر عند البيع
            // السعر سيتغير حسب نظام التحديث التلقائي
            
            this.stockData.availableShares += quantity;
            this.stockData.soldShares -= quantity;
            this.stockData.volume += totalAmount;
            this.lastUpdateTime = new Date().toLocaleTimeString('ar-SA');
            
            // حفظ السعر بعد التحديث
            this.savePriceToLocalStorage(this.stockData);
            
            // إضافة إلى رصيد المستخدم
            transaction.update(userRef, {
              vipBalance: userBalance + totalAmount
            });
            
            this.userBalance = userBalance + totalAmount;
            
            if (newShares > 0) {
              transaction.update(sharesRef, {
                shares: newShares,
                invested: newInvested,
                avgPrice: newInvested > 0 ? newInvested / newShares : 0,
                totalProfit: (currentShares.totalProfit || 0) + profit,
                updatedAt: serverTimestamp()
              });
            } else {
              transaction.delete(sharesRef);
            }
          }
          
          // تسجيل المعاملة
          const transactionsRef = collection(db, "transactions");
          const logRef = doc(transactionsRef);
          transaction.set(logRef, {
            userId: user.uid,
            type: this.tradeType === 'buy' ? 'stock_buy' : 'stock_sell',
            amount: totalAmount,
            quantity: quantity,
            price: price,
            createdAt: serverTimestamp(),
            status: 'completed'
          });
        });
        
        await this.loadUserData();
        
        this.showNotificationMessage('success', this.tradeType === 'buy' 
          ? `✅ تم شراء ${quantity} سهم بنجاح بقيمة ${this.formatPrice(totalAmount)} USDT`
          : `✅ تم بيع ${quantity} سهم بنجاح بقيمة ${this.formatPrice(totalAmount)} USDT`);
        
        this.closeTradeModal();
        
      } catch (error) {
        console.error("Trade error:", error);
        this.showNotificationMessage('error', `❌ ${error.message}`);
        this.errorMessage = error.message;
      } finally {
        this.processing = false;
      }
    },

    showNotificationMessage(type, message) {
      this.notificationType = type;
      this.notificationMessage = message;
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },

    formatPrice(value) {
      if (value === null || value === undefined) return '0';
      return Number(value).toFixed(2);
    },

    formatNumber(value) {
      if (value === null || value === undefined) return '0';
      return Number(value).toLocaleString('en-US');
    },

    formatVolume(value) {
      if (!value) return '0';
      if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + 'B';
      } else if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(2) + 'K';
      }
      return value.toFixed(2);
    },

    goBack() {
      this.$router.push('/vip');
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.shares-page {
  min-height: 100vh;
  background: #0b0e11;
  color: #fff;
  direction: rtl;
  padding: 15px;
  font-family: 'Cairo', sans-serif;
}

.container {
  max-width: 500px;
  margin: 0 auto;
}

.shares-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(252, 213, 53, 0.3);
  color: #fcd535;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(252, 213, 53, 0.2);
  border-color: #fcd535;
  transform: scale(1.05);
}

.page-title {
  font-size: 20px;
  font-weight: 800;
  color: #fcd535;
  text-align: center;
  flex: 1;
  text-shadow: 0 0 15px rgba(252, 213, 53, 0.3);
}

.header-spacer {
  width: 40px;
}

.company-card {
  background: linear-gradient(135deg, #1a1f2e 0%, #141820 100%);
  border: 2px solid #fcd535;
  border-radius: 20px;
  padding: 25px 20px;
  margin-bottom: 18px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(252, 213, 53, 0.1);
}

.company-logo {
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 45px;
  margin-bottom: 8px;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(252, 213, 53, 0.3));
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.company-name {
  font-size: 22px;
  font-weight: 900;
  color: #fcd535;
  text-shadow: 0 0 15px rgba(252, 213, 53, 0.4);
  letter-spacing: 1px;
}

.stock-status {
  margin-top: 10px;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-badge.open {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.3); }
}

.price-card {
  background: #181a20;
  border: 1px solid rgba(252, 213, 53, 0.25);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.price-main {
  text-align: center;
  margin-bottom: 18px;
}

.current-price {
  margin-bottom: 8px;
}

.price-value {
  font-size: 38px;
  font-weight: 900;
  color: #fcd535;
  text-shadow: 0 0 25px rgba(252, 213, 53, 0.4);
  transition: all 0.3s ease;
  letter-spacing: -1px;
}

.currency {
  font-size: 16px;
  color: #848e9c;
  margin-right: 6px;
  font-weight: 600;
}

.price-change {
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.price-change.positive {
  color: #00ff88;
}

.price-change.negative {
  color: #ff4444;
}

.price-change i {
  font-size: 18px;
}

.price-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(252, 213, 53, 0.12);
}

.detail-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 10px 5px;
}

.detail-label {
  display: block;
  font-size: 10px;
  color: #848e9c;
  margin-bottom: 5px;
  font-weight: 600;
}

.detail-value {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.detail-value.high {
  color: #00ff88;
}

.detail-value.low {
  color: #ff4444;
}

.loading-card {
  background: #181a20;
  border: 1px solid rgba(252, 213, 53, 0.25);
  border-radius: 16px;
  padding: 50px 20px;
  margin-bottom: 18px;
  text-align: center;
}

.gold-spinner {
  width: 45px;
  height: 45px;
  border: 4px solid rgba(252, 213, 53, 0.1);
  border-top: 4px solid #fcd535;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #fcd535;
  font-size: 15px;
  font-weight: 600;
}

.stats-card {
  background: #181a20;
  border: 1px solid rgba(252, 213, 53, 0.25);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.stats-title {
  font-size: 17px;
  font-weight: 800;
  color: #fcd535;
  margin-bottom: 15px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat-item {
  background: linear-gradient(135deg, rgba(30, 35, 41, 0.8), rgba(20, 24, 30, 0.8));
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  border: 1px solid rgba(252, 213, 53, 0.15);
}

.stat-item.full-width {
  grid-column: span 2;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #848e9c;
  margin-bottom: 6px;
  font-weight: 600;
}

.stat-value {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
}

.stat-value.highlight {
  color: #fcd535;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fcd535, #ffed8a, #fcd535);
  border-radius: 10px;
  transition: width 0.6s ease;
  box-shadow: 0 0 10px rgba(252, 213, 53, 0.3);
}

.sold-out-message {
  text-align: center;
  padding: 15px;
  background: rgba(255, 0, 0, 0.08);
  border: 1px solid rgba(255, 0, 0, 0.25);
  border-radius: 12px;
  color: #ff4444;
  font-weight: 700;
  margin-top: 15px;
  font-size: 14px;
}

.market-info-card {
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.06), rgba(255, 237, 138, 0.03));
  border: 1px solid rgba(252, 213, 53, 0.25);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 18px;
}

.market-info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fcd535;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(252, 213, 53, 0.1);
}

.market-info-header i {
  font-size: 16px;
}

.market-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.market-info-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 10px 5px;
}

.market-label {
  display: block;
  font-size: 10px;
  color: #848e9c;
  margin-bottom: 5px;
  font-weight: 600;
}

.market-value {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.market-value.gold {
  color: #fcd535;
}

.market-value.profit {
  color: #00ff88;
}

.market-value.loss {
  color: #ff4444;
}

.portfolio-card {
  background: linear-gradient(135deg, #1a1f2e 0%, #141820 100%);
  border: 2px solid #fcd535;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 18px;
  box-shadow: 0 8px 30px rgba(252, 213, 53, 0.08);
}

.portfolio-title {
  font-size: 17px;
  font-weight: 800;
  color: #fcd535;
  margin-bottom: 15px;
  text-align: center;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.portfolio-item {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  border: 1px solid rgba(252, 213, 53, 0.1);
}

.portfolio-item.full-width {
  grid-column: span 2;
  background: rgba(252, 213, 53, 0.05);
}

.portfolio-label {
  display: block;
  font-size: 11px;
  color: #848e9c;
  margin-bottom: 5px;
  font-weight: 600;
}

.portfolio-value {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.portfolio-value.profit {
  color: #00ff88;
}

.portfolio-value.loss {
  color: #ff4444;
}

.balance-card {
  background: linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%);
  border: 2px solid #fcd535;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 18px;
  box-shadow: 0 4px 20px rgba(252, 213, 53, 0.15);
}

.balance-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.balance-icon {
  font-size: 28px;
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.balance-content {
  flex: 1;
}

.balance-label {
  display: block;
  font-size: 12px;
  color: #848e9c;
  font-weight: 600;
}

.balance-amount {
  display: block;
  font-size: 22px;
  font-weight: 900;
  color: #fcd535;
  text-shadow: 0 0 20px rgba(252, 213, 53, 0.3);
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(252, 213, 53, 0.3);
  color: #fcd535;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(252, 213, 53, 0.15);
  border-color: #fcd535;
  transform: rotate(45deg);
}

.refresh-btn .spinning {
  animation: spin 1s linear infinite;
}

.trade-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
}

.trade-btn {
  flex: 1;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.trade-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.trade-btn:hover:not(:disabled)::before {
  transform: translateX(0);
}

.trade-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.trade-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.buy-btn {
  background: linear-gradient(135deg, #00cc6a, #009944);
  color: #fff;
}

.sell-btn {
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: #fff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  padding: 20px;
}

.modal-content {
  background: #181a20;
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
  border: 1px solid #fcd535;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(252, 213, 53, 0.15);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(252, 213, 53, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(252, 213, 53, 0.1), rgba(255, 237, 138, 0.03));
}

.modal-header h3 {
  color: #fcd535;
  font-size: 17px;
  font-weight: 800;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #848e9c;
  font-size: 26px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.modal-body {
  padding: 20px;
}

.trade-info {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 18px;
  border: 1px solid rgba(252, 213, 53, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.price-highlight {
  color: #fcd535;
  font-weight: 700;
}

.input-group {
  margin-bottom: 18px;
}

.input-group label {
  display: block;
  color: #848e9c;
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: 600;
}

.trade-input {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(252, 213, 53, 0.3);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Cairo', sans-serif;
}

.trade-input:focus {
  border-color: #fcd535;
  box-shadow: 0 0 0 3px rgba(252, 213, 53, 0.1);
}

.cost-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(252, 213, 53, 0.06);
  border: 1px solid rgba(252, 213, 53, 0.15);
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 14px;
}

.cost-value {
  font-weight: 700;
  color: #fcd535;
}

.cost-value.insufficient {
  color: #ff4444;
}

.balance-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: rgba(252, 213, 53, 0.08);
  border: 1px solid rgba(252, 213, 53, 0.2);
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 14px;
}

.balance-value {
  color: #fcd535;
  font-weight: 700;
  font-size: 16px;
}

.balance-value.insufficient-balance {
  color: #ff4444;
}

.error-message {
  margin-top: 14px;
  padding: 10px 14px;
  background: rgba(255, 0, 0, 0.08);
  border: 1px solid rgba(255, 0, 0, 0.25);
  border-radius: 10px;
  color: #ff4444;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid rgba(252, 213, 53, 0.15);
}

.btn-cancel {
  flex: 1;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-confirm {
  flex: 1;
  background: linear-gradient(135deg, #fcd535, #e6b800);
  border: none;
  color: #0b0e11;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(252, 213, 53, 0.2);
}

.btn-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(252, 213, 53, 0.4);
  background: linear-gradient(135deg, #ffed8a, #fcd535);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 24px;
  border-radius: 50px;
  font-weight: 700;
  z-index: 3000;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  max-width: 90%;
  text-align: center;
}

.notification.success {
  background: linear-gradient(135deg, #00cc6a, #009944);
  color: #fff;
}

.notification.error {
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: #fff;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.35s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateX(-50%) translateY(-100px);
  opacity: 0;
}

.modal-fade-scale-enter-active,
.modal-fade-scale-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-scale-enter-from,
.modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 17px;
  }
  
  .price-value {
    font-size: 30px;
  }
  
  .company-name {
    font-size: 19px;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .portfolio-item.full-width {
    grid-column: span 1;
  }
  
  .trade-buttons {
    flex-direction: column;
  }
  
  .market-info-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  
  .market-value {
    font-size: 11px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item.full-width {
    grid-column: span 1;
  }
  
  .balance-amount {
    font-size: 18px;
  }
}
</style>
