<template>
  <div class="crypto-page">
    <!-- الشريط العلوي -->
    <div class="top-bar">
      <div class="balance-display">
        <i class="fas fa-wallet"></i>
        <span>رصيدك: <strong>{{ balance.toFixed(2) }} USDT</strong></span>
      </div>
      <button class="refresh-btn" @click="fetchCryptoPrices" :disabled="loading">
        <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
        <span v-if="!loading">تحديث</span>
        <span v-else>جاري التحديث...</span>
      </button>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading && cryptos.length === 0" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل الأسعار...</p>
    </div>

    <!-- العنوان -->
    <div class="page-header" v-else>
      <h1>أسعار العملات الرقمية</h1>
      <p class="subtitle">آخر تحديث: {{ lastUpdated }}</p>
    </div>

    <!-- قائمة العملات -->
    <div class="crypto-list" v-if="cryptos.length > 0">
      <div 
        v-for="crypto in cryptos" 
        :key="crypto.symbol"
        class="crypto-card"
      >
        <div class="crypto-main">
          <div class="crypto-icon-wrapper">
            <img 
              :src="crypto.image" 
              :alt="crypto.name"
              class="crypto-image"
              @error="handleImageError(crypto)"
            />
          </div>
          <div class="crypto-info">
            <span class="crypto-name">{{ crypto.name }}</span>
            <span class="crypto-symbol">{{ crypto.symbol.toUpperCase() }}</span>
          </div>
        </div>
        
        <div class="crypto-price-section">
          <div class="crypto-price">${{ formatPrice(crypto.current_price) }}</div>
          <div class="crypto-change" :class="crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'">
            <i :class="crypto.price_change_percentage_24h >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ crypto.price_change_percentage_24h >= 0 ? '+' : '' }}{{ crypto.price_change_percentage_24h?.toFixed(2) || '0.00' }}%
          </div>
        </div>
      </div>
    </div>

    <!-- رسالة الخطأ -->
    <div v-if="errorMessage" class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ errorMessage }}</span>
      <button @click="fetchCryptoPrices" class="retry-btn">إعادة المحاولة</button>
    </div>

    <!-- تنبيه -->
    <div class="disclaimer" v-if="cryptos.length > 0">
      <i class="fas fa-info-circle"></i>
      <span>الأسعار محدثة من CoinGecko API</span>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../firebase"
import { doc, getDoc } from "firebase/firestore"

export default {
  name: "CryptoPage",
  
  data() {
    return {
      balance: 0,
      cryptos: [],
      loading: false,
      errorMessage: '',
      lastUpdated: 'جاري التحميل...',
      refreshInterval: null,
      
      // قائمة العملات المطلوبة
      cryptoIds: [
        'bitcoin',
        'ethereum',
        'ripple',
        'tether',
        'bnb',
        'solana',
        'dogecoin',
        'cardano',
        'tron',
        'avalanche-2'
      ],
      
      // الأسماء البديلة للصور عند فشل التحميل
      fallbackIcons: {
        'bitcoin': '₿',
        'ethereum': '⟠',
        'ripple': '✕',
        'tether': '₮',
        'bnb': '◆',
        'solana': '◎',
        'dogecoin': 'Ð',
        'cardano': '₳',
        'tron': '◈',
        'avalanche-2': '◆'
      }
    }
  },
  
  async created() {
    // جلب رصيد المستخدم
    await this.fetchBalance()
    
    // جلب أسعار العملات
    await this.fetchCryptoPrices()
    
    // تحديث الأسعار كل 60 ثانية
    this.refreshInterval = setInterval(() => {
      this.fetchCryptoPrices()
    }, 60000)
  },
  
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  
  methods: {
    async fetchBalance() {
      try {
        const user = auth.currentUser
        if (!user) return
        
        const snap = await getDoc(doc(db, "users", user.uid))
        if (snap.exists()) {
          this.balance = Number(snap.data().balance || 0)
        }
      } catch (error) {
        console.error("خطأ في جلب الرصيد:", error)
      }
    },
    
    async fetchCryptoPrices() {
      if (this.loading) return
      
      this.loading = true
      this.errorMessage = ''
      
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${this.cryptoIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        )
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data && data.length > 0) {
          this.cryptos = data
          this.lastUpdated = new Date().toLocaleString('ar-SA')
        } else {
          throw new Error('لم يتم العثور على بيانات')
        }
      } catch (error) {
        console.error('خطأ في جلب الأسعار:', error)
        this.errorMessage = error.message || 'حدث خطأ في تحميل الأسعار'
        
        // إذا كانت القائمة فارغة، استخدم البيانات التجريبية
        if (this.cryptos.length === 0) {
          this.useFallbackData()
        }
      } finally {
        this.loading = false
      }
    },
    
    useFallbackData() {
      this.cryptos = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 67234.50, price_change_percentage_24h: 2.35, image: '' },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3456.20, price_change_percentage_24h: 1.85, image: '' },
        { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.6245, price_change_percentage_24h: -0.42, image: '' },
        { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.0002, price_change_percentage_24h: 0.01, image: '' },
        { id: 'bnb', symbol: 'bnb', name: 'BNB', current_price: 598.75, price_change_percentage_24h: 3.12, image: '' },
        { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 142.30, price_change_percentage_24h: 5.67, image: '' },
        { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.1520, price_change_percentage_24h: -1.23, image: '' },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.3840, price_change_percentage_24h: 0.75, image: '' },
        { id: 'tron', symbol: 'trx', name: 'TRON', current_price: 0.1280, price_change_percentage_24h: 2.10, image: '' },
        { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', current_price: 28.45, price_change_percentage_24h: -0.85, image: '' }
      ]
      this.lastUpdated = 'بيانات تجريبية'
      this.errorMessage = 'تعذر الاتصال بالخادم، يتم عرض بيانات تجريبية'
    },
    
    handleImageError(crypto) {
      // استخدام أيقونة بديلة عند فشل تحميل الصورة
      const fallback = this.fallbackIcons[crypto.id] || '₿'
      crypto.image = ''
      crypto.fallbackIcon = fallback
    },
    
    formatPrice(price) {
      if (price === undefined || price === null) return '0.00'
      if (price >= 1000) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      } else if (price >= 1) {
        return price.toFixed(2)
      } else {
        return price.toFixed(4)
      }
    }
  }
}
</script>

<style scoped>
/* ===== التصميم العام ===== */
.crypto-page {
  background: #0a0e17;
  min-height: 100vh;
  color: #ffffff;
  padding: 20px;
  direction: rtl;
  font-family: 'Cairo', 'Montserrat', sans-serif;
}

/* ===== الشريط العلوي ===== */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 12px;
}

.balance-display {
  background: #151e2b;
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.balance-display i {
  color: #9ca3af;
  font-size: 18px;
}

.balance-display strong {
  color: #ffffff;
  font-weight: 700;
}

.refresh-btn {
  background: #151e2b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #1a2433;
  border-color: rgba(255, 255, 255, 0.15);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== حالة التحميل ===== */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #9ca3af;
}

/* ===== العنوان ===== */
.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
  font-weight: 400;
}

/* ===== قائمة العملات ===== */
.crypto-list {
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.crypto-card {
  background: #151e2b;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: default;
}

.crypto-card:hover {
  background: #1a2433;
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.crypto-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.crypto-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #0a0e17;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  flex-shrink: 0;
}

.crypto-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.crypto-icon {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
}

.crypto-info {
  display: flex;
  flex-direction: column;
}

.crypto-name {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
}

.crypto-symbol {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.crypto-price-section {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.crypto-price {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Courier New', monospace;
}

.crypto-change {
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.crypto-change.positive {
  color: #4caf50;
}

.crypto-change.negative {
  color: #ef5350;
}

.crypto-change i {
  font-size: 12px;
}

/* ===== رسالة الخطأ ===== */
.error-message {
  max-width: 650px;
  margin: 20px auto 0;
  padding: 16px 20px;
  background: rgba(239, 83, 80, 0.1);
  border: 1px solid rgba(239, 83, 80, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ef5350;
  font-size: 14px;
  flex-wrap: wrap;
  justify-content: center;
}

.error-message i {
  font-size: 18px;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* ===== التنبيه ===== */
.disclaimer {
  max-width: 650px;
  margin: 25px auto 0;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #9ca3af;
  font-size: 12px;
}

.disclaimer i {
  color: #9ca3af;
  font-size: 16px;
}

/* ===== تحسينات الجوال ===== */
@media (max-width: 480px) {
  .crypto-page {
    padding: 12px;
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .balance-display {
    padding: 10px 18px;
    font-size: 14px;
    justify-content: center;
  }

  .refresh-btn {
    justify-content: center;
    padding: 8px 16px;
    font-size: 13px;
  }

  .page-header h1 {
    font-size: 22px;
  }

  .subtitle {
    font-size: 13px;
  }

  .crypto-card {
    padding: 14px 16px;
  }

  .crypto-icon-wrapper {
    width: 38px;
    height: 38px;
  }

  .crypto-image {
    width: 26px;
    height: 26px;
  }

  .crypto-name {
    font-size: 14px;
  }

  .crypto-price {
    font-size: 14px;
  }

  .crypto-change {
    font-size: 12px;
  }

  .disclaimer {
    font-size: 11px;
    padding: 10px 14px;
  }

  .error-message {
    font-size: 13px;
    padding: 12px 16px;
  }
}

@media (max-width: 380px) {
  .crypto-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .crypto-price-section {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
