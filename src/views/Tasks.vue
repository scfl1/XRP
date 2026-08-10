<template>
  <div class="crypto-page">
    <!-- الشريط العلوي -->
    <div class="top-bar">
      <div class="balance-display">
        <i class="fas fa-wallet"></i>
        <span>رصيدك: <strong>{{ balance.toFixed(2) }} USDT</strong></span>
      </div>
    </div>

    <!-- العنوان -->
    <div class="page-header">
      <h1>أسعار العملات الرقمية</h1>
      <p class="subtitle">السوق الآن</p>
    </div>

    <!-- قائمة العملات -->
    <div class="crypto-list">
      <div 
        v-for="crypto in cryptos" 
        :key="crypto.symbol"
        class="crypto-card"
      >
        <div class="crypto-main">
          <div class="crypto-icon-wrapper">
            <span class="crypto-icon">{{ crypto.icon }}</span>
          </div>
          <div class="crypto-info">
            <span class="crypto-name">{{ crypto.name }}</span>
            <span class="crypto-symbol">{{ crypto.symbol }}</span>
          </div>
        </div>
        
        <div class="crypto-price-section">
          <div class="crypto-price">${{ formatPrice(crypto.price) }}</div>
          <div class="crypto-change" :class="crypto.change >= 0 ? 'positive' : 'negative'">
            <i :class="crypto.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- تنبيه - بيانات تجريبية -->
    <div class="disclaimer">
      <i class="fas fa-info-circle"></i>
      <span>الأسعار المعروضة هي بيانات تجريبية وتستخدم لأغراض توضيحية فقط</span>
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
      
      cryptos: [
        { 
          name: 'Bitcoin', 
          symbol: 'BTC', 
          icon: '₿', 
          price: 67234.50, 
          change: 2.35 
        },
        { 
          name: 'Ethereum', 
          symbol: 'ETH', 
          icon: '⟠', 
          price: 3456.20, 
          change: 1.85 
        },
        { 
          name: 'XRP', 
          symbol: 'XRP', 
          icon: '✕', 
          price: 0.6245, 
          change: -0.42 
        },
        { 
          name: 'Tether', 
          symbol: 'USDT', 
          icon: '₮', 
          price: 1.0002, 
          change: 0.01 
        },
        { 
          name: 'BNB', 
          symbol: 'BNB', 
          icon: '◆', 
          price: 598.75, 
          change: 3.12 
        },
        { 
          name: 'Solana', 
          symbol: 'SOL', 
          icon: '◎', 
          price: 142.30, 
          change: 5.67 
        },
        { 
          name: 'Dogecoin', 
          symbol: 'DOGE', 
          icon: 'Ð', 
          price: 0.1520, 
          change: -1.23 
        },
        { 
          name: 'Cardano', 
          symbol: 'ADA', 
          icon: '₳', 
          price: 0.3840, 
          change: 0.75 
        },
        { 
          name: 'TRON', 
          symbol: 'TRX', 
          icon: '◈', 
          price: 0.1280, 
          change: 2.10 
        },
        { 
          name: 'Avalanche', 
          symbol: 'AVAX', 
          icon: '◆', 
          price: 28.45, 
          change: -0.85 
        }
      ]
    }
  },
  
  async created() {
    const user = auth.currentUser
    if (!user) return
    
    try {
      const snap = await getDoc(doc(db, "users", user.uid))
      if (snap.exists()) {
        this.balance = Number(snap.data().balance || 0)
      }
    } catch (error) {
      console.error("خطأ في جلب الرصيد:", error)
    }
  },
  
  methods: {
    formatPrice(price) {
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
  justify-content: center;
  margin-bottom: 30px;
}

.balance-display {
  background: #151e2b;
  padding: 14px 30px;
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
  font-size: 15px;
  margin: 0;
  font-weight: 400;
}

/* ===== قائمة العملات ===== */
.crypto-list {
  max-width: 600px;
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

/* ===== التنبيه ===== */
.disclaimer {
  max-width: 600px;
  margin: 25px auto 0;
  padding: 14px 20px;
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

  .balance-display {
    padding: 10px 20px;
    font-size: 14px;
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

  .crypto-icon {
    font-size: 16px;
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
