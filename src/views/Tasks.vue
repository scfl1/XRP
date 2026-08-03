<template>
  <div class="game-page">
    <!-- زر الرجوع - أصبح في الأعلى -->
    <div v-if="gameOpened" class="back-button-container">
      <button @click="closeGame" class="back-button">
        <i class="fas fa-arrow-right"></i>
        رجوع إلى الألعاب
      </button>
    </div>

    <!-- الرصيد - أصبح تحت زر الرجوع مباشرة -->
    <div class="top-bar">
      <div class="balance-gold">
        <i class="fas fa-coins"></i>
        <span>رصيدك: <strong>{{ vipBalance.toFixed(2) }} USDT</strong></span>
      </div>
    </div>

    <!-- رسالة الفوز/الخسارة -->
    <transition name="slide-fade">
      <div v-if="showResultMessage" class="result-message" :class="resultType">
        <i :class="resultIcon"></i>
        <span>{{ resultText }}</span>
      </div>
    </transition>

    <!-- التبويبات -->
    <div v-if="!gameOpened" class="tabs">
      <button 
        v-for="tab in gamesList" 
        :key="tab.id"
        :class="{active: selectedGame === tab.id}" 
        @click="openGame(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-text">{{ tab.name }}</span>
      </button>
    </div>

    <!-- عرض اللعبة -->
    <div v-if="gameOpened" class="game-fullscreen">
      <div v-if="selectedGame === 'wheel-of-fortune'" class="wheel-card">
        <div class="wheel-header">
          <h2>🎡 WHEEL OF FORTUNE</h2>
          <div class="header-glow"></div>
        </div>

        <div class="wheel-content">
          <div class="wheel-wrapper">
            <div class="pointer">▼</div>
            <div class="wheel-container">
              <svg 
                class="wheel-svg" 
                viewBox="0 0 200 200"
                :style="{ transform: `rotate(${wheelRotation}deg)` }"
              >
                <!-- العجلة - للعرض البصري فقط -->
                <g v-for="(segment, index) in wheelSegmentsForDisplay" :key="index">
                  <path
                    :d="getSegmentPath(index)"
                    :fill="getSegmentColor(segment.displayValue)"
                    stroke="white"
                    stroke-width="1"
                  />
                  <text
                    :x="getTextX(index)"
                    :y="getTextY(index)"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    :fill="getTextColor(segment.displayValue)"
                    font-size="14"
                    font-weight="bold"
                  >
                    {{ segment.displayValue }}x
                  </text>
                </g>
                <circle cx="100" cy="100" r="25" fill="#222" stroke="gold" stroke-width="3" />
              </svg>
            </div>
          </div>

          <div class="bet-section">
            <div class="bet-input-wrapper">
              <span class="bet-icon">💰</span>
              <input
                type="number"
                v-model.number="betAmount"
                placeholder="أدخل مبلغ الرهان"
                class="bet-input"
                min="0.01"
                step="0.01"
                :disabled="isSpinning"
              />
              <span class="bet-currency">USDT</span>
            </div>

            <div v-if="betAmount > vipBalance" class="error-message">
              ❌ الرصيد غير كافي
            </div>

            <div v-if="gameError" class="error-message">
              ❌ {{ gameError }}
            </div>

            <button 
              @click="spinWheel"
              class="spin-btn"
              :disabled="!canSpin || isSpinning"
            >
              <span v-if="!isSpinning">🎡 ابدأ الدوران</span>
              <span v-else>جاري الدوران...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db, doc, getDoc, updateDoc, onSnapshot } from "../firebase"

export default {
  name: "Games",
  
  data() {
    return {
      gameOpened: false,
      selectedGame: "wheel-of-fortune",
      showResultMessage: false,
      resultType: '',
      resultIcon: '',
      resultText: '',
      resultTimeout: null,
      
      gamesList: [
        { id: 'wheel-of-fortune', name: 'Wheel of Fortune', icon: '🎡' }
      ],
      
      vipBalance: 0,
      gameError: "",
      
      wheelRotation: 0,
      isSpinning: false,
      betAmount: null,
      
      // ========== الإعدادات العامة من Firebase ==========
      globalSettings: {
        lossRate: 40,
        smallWinRate: 35,
        bigWinRate: 25
      },
      
      // ========== إعدادات المستخدم المخصصة ==========
      userCustomSettings: {
        useGlobalSettings: true,  // هل يستخدم الإعدادات العامة؟
        settings: null            // الإعدادات المخصصة (إذا useGlobalSettings = false)
      },
      
      settingsLoading: false,
      unsubscribeGlobalSettings: null,
      unsubscribeUserSettings: null,
      currentUserId: null,
      
      // قائمة المضاعفات الحقيقية للعبة
      realMultipliers: {
        small: [0.5, 1],
        big: [1.5, 2, 3, 5, 10]
      },
      
      // ========== هذا للعرض البصري فقط ==========
      wheelSegmentsForDisplay: [
        { displayValue: 2, actualValue: 0 },      // قطاع 0 - يظهر 2x لكنه يعطي 0x
        { displayValue: 0.5, actualValue: 3 },    // قطاع 1 - يظهر 0.5x لكنه يعطي 3x
        { displayValue: 1, actualValue: 5 },      // قطاع 2 - يظهر 1x لكنه يعطي 5x
        { displayValue: 1.5, actualValue: 10 },   // قطاع 3 - يظهر 1.5x لكنه يعطي 10x
        { displayValue: 0, actualValue: 2 },      // قطاع 4 - يظهر 0x لكنه يعطي 2x
        { displayValue: 3, actualValue: 0.5 },    // قطاع 5 - يظهر 3x لكنه يعطي 0.5x
        { displayValue: 5, actualValue: 1 },      // قطاع 6 - يظهر 5x لكنه يعطي 1x
        { displayValue: 10, actualValue: 1.5 }    // قطاع 7 - يظهر 10x لكنه يعطي 1.5x
      ],
      
      lastResult: null,
      
      spinSound: null,
      winSound: null,
      loseSound: null,
      clickSound: null
    }
  },
  
  computed: {
    segmentAngle() {
      return 360 / this.wheelSegmentsForDisplay.length
    },
    
    canSpin() {
      return this.betAmount && 
             this.betAmount > 0 && 
             this.betAmount <= this.vipBalance && 
             !this.isSpinning
    },
    
    // ========== الحصول على الإعدادات الفعلية المستخدمة ==========
    activeSettings() {
      // إذا كان المستخدم يستخدم إعدادات مخصصة ولديه إعدادات
      if (!this.userCustomSettings.useGlobalSettings && this.userCustomSettings.settings) {
        console.log("🎯 استخدام إعدادات المستخدم المخصصة:", this.userCustomSettings.settings)
        return this.userCustomSettings.settings
      }
      // وإلا استخدام الإعدادات العامة
      console.log("🎯 استخدام الإعدادات العامة:", this.globalSettings)
      return this.globalSettings
    }
  },
  
  async created() {
    const user = auth.currentUser
    if (!user) return
    
    this.currentUserId = user.uid
    
    // ✅ قراءة vipBalance فقط (القابل للسحب) مع دعم الرصيد القديم
    const snap = await getDoc(doc(db, "users", user.uid))
    if (snap.exists()) {
      const data = snap.data()
      // ✅ قراءة ذكية للرصيد - تدعم النظام القديم والجديد
      if (typeof data.vipBalance === 'number') {
        this.vipBalance = data.vipBalance
      } else if (typeof data.balance === 'number') {
        this.vipBalance = data.balance // 🔥 الرصيد القديم ← vipBalance
      } else {
        this.vipBalance = 0
      }
      console.log(`✅ رصيد VIP القابل للسحب: ${this.vipBalance} USDT`)
    }
    
    // تحميل الإعدادات العامة
    await this.fetchGlobalSettings()
    
    // تحميل إعدادات المستخدم المخصصة
    await this.fetchUserSettings()
    
    // الاشتراك في التحديثات المباشرة
    this.subscribeToGlobalSettings()
    this.subscribeToUserSettings()
    
    this.initSounds()
  },
  
  beforeUnmount() {
    if (this.unsubscribeGlobalSettings) {
      this.unsubscribeGlobalSettings()
    }
    if (this.unsubscribeUserSettings) {
      this.unsubscribeUserSettings()
    }
  },
  
  methods: {
    // ========== جلب الإعدادات العامة ==========
    async fetchGlobalSettings() {
      this.settingsLoading = true
      try {
        const settingsRef = doc(db, "settings", "wheel")
        const settingsDoc = await getDoc(settingsRef)
        
        if (settingsDoc.exists()) {
          this.globalSettings = settingsDoc.data()
        } else {
          await this.createDefaultGlobalSettings()
        }
      } catch (error) {
        console.error("❌ خطأ في جلب الإعدادات العامة:", error)
      } finally {
        this.settingsLoading = false
      }
    },
    
    async createDefaultGlobalSettings() {
      try {
        const defaultSettings = {
          lossRate: 40,
          smallWinRate: 35,
          bigWinRate: 25
        }
        const settingsRef = doc(db, "settings", "wheel")
        await updateDoc(settingsRef, defaultSettings)
        this.globalSettings = defaultSettings
      } catch (error) {
        console.error("❌ خطأ في إنشاء الإعدادات الافتراضية:", error)
      }
    },
    
    subscribeToGlobalSettings() {
      const settingsRef = doc(db, "settings", "wheel")
      this.unsubscribeGlobalSettings = onSnapshot(settingsRef, (doc) => {
        if (doc.exists()) {
          this.globalSettings = doc.data()
          console.log("✅ تم تحديث الإعدادات العامة:", this.globalSettings)
        }
      }, (error) => {
        console.error("❌ خطأ في الاستماع للإعدادات العامة:", error)
      })
    },
    
    // ========== جلب إعدادات المستخدم المخصصة ==========
    async fetchUserSettings() {
      try {
        const userSettingsRef = doc(db, "user_wheel_settings", this.currentUserId)
        const userSettingsDoc = await getDoc(userSettingsRef)
        
        if (userSettingsDoc.exists()) {
          const data = userSettingsDoc.data()
          this.userCustomSettings = {
            useGlobalSettings: data.useGlobalSettings !== false,
            settings: data.settings || null
          }
          console.log("✅ تم تحميل إعدادات المستخدم:", this.userCustomSettings)
        } else {
          console.log("📌 لا توجد إعدادات مخصصة للمستخدم، سيتم استخدام الإعدادات العامة")
          this.userCustomSettings = {
            useGlobalSettings: true,
            settings: null
          }
        }
      } catch (error) {
        console.error("❌ خطأ في جلب إعدادات المستخدم:", error)
        this.userCustomSettings = {
          useGlobalSettings: true,
          settings: null
        }
      }
    },
    
    subscribeToUserSettings() {
      const userSettingsRef = doc(db, "user_wheel_settings", this.currentUserId)
      this.unsubscribeUserSettings = onSnapshot(userSettingsRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data()
          this.userCustomSettings = {
            useGlobalSettings: data.useGlobalSettings !== false,
            settings: data.settings || null
          }
          console.log("✅ تم تحديث إعدادات المستخدم:", this.userCustomSettings)
        } else {
          this.userCustomSettings = {
            useGlobalSettings: true,
            settings: null
          }
        }
      }, (error) => {
        console.error("❌ خطأ في الاستماع لإعدادات المستخدم:", error)
      })
    },
    
    // ========== منطق اللعبة الأساسي - يستخدم activeSettings ==========
    getGameResult() {
      const settings = this.activeSettings
      const { lossRate, smallWinRate, bigWinRate } = settings
      const total = lossRate + smallWinRate + bigWinRate
      const random = Math.random() * total
      
      let resultMultiplier = 0
      let resultMessage = ''
      
      console.log(`🎲 الإعدادات المستخدمة: خسارة ${lossRate}% | ربح صغير ${smallWinRate}% | ربح كبير ${bigWinRate}%`)
      console.log(`🎲 الرقم العشوائي: ${random.toFixed(2)} من أصل ${total}`)
      
      if (random < lossRate) {
        resultMultiplier = 0
        resultMessage = 'خسارة'
        console.log(`🎲 النتيجة: خسارة | المضاعف: 0x`)
      } 
      else if (random < lossRate + smallWinRate) {
        const smallOptions = this.realMultipliers.small
        resultMultiplier = smallOptions[Math.floor(Math.random() * smallOptions.length)]
        resultMessage = resultMultiplier === 0.5 ? 'ربح صغير' : 'تعادل'
        console.log(`🎲 النتيجة: ${resultMessage} | المضاعف: ${resultMultiplier}x`)
      } 
      else {
        const bigOptions = this.realMultipliers.big
        resultMultiplier = bigOptions[Math.floor(Math.random() * bigOptions.length)]
        
        if (resultMultiplier === 10) resultMessage = 'جائزة كبرى'
        else if (resultMultiplier >= 5) resultMessage = 'ربح ممتاز'
        else if (resultMultiplier >= 3) resultMessage = 'ربح كبير'
        else resultMessage = 'ربح متوسط'
        console.log(`🎲 النتيجة: ${resultMessage} | المضاعف: ${resultMultiplier}x`)
      }
      
      return {
        multiplier: resultMultiplier,
        message: resultMessage
      }
    },
    
    // البحث عن قطاع في العجلة له نفس قيمة المضاعف
    findSegmentIndexByMultiplier(multiplier) {
      const index = this.wheelSegmentsForDisplay.findIndex(
        segment => segment.actualValue === multiplier
      )
      
      if (index !== -1) {
        return index
      }
      
      console.warn(`⚠️ لم نجد قطاعاً بقيمة ${multiplier}، نستخدم القطاع 0`)
      return 0
    },
    
    // ========== دوال العرض البصري ==========
    initSounds() {
      try {
        this.spinSound = new Audio('data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVQAAACAgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f38=')
        this.winSound = new Audio('data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVQAAACAgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f38=')
        this.loseSound = new Audio('data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVQAAACAgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f38=')
        this.clickSound = new Audio('data:audio/wav;base64,UklGRlwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVQAAACAgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f3+AgICAf39/f39/f38=')
        
        this.spinSound.volume = 0.3
        this.winSound.volume = 0.5
        this.loseSound.volume = 0.4
        this.clickSound.volume = 0.2
      } catch (e) {
        console.log('الصوت غير مدعوم')
      }
    },
    
    playSound(sound) {
      if (sound) {
        sound.currentTime = 0
        sound.play().catch(e => console.log('تعذر تشغيل الصوت'))
      }
    },
    
    getSegmentColor(value) {
      if (value === 0) return '#d32f2f'
      if (value === 0.5) return '#fb8c00'
      if (value === 1) return '#ffa726'
      if (value === 1.5) return '#ffb74d'
      if (value === 2) return '#66bb6a'
      if (value === 3) return '#4caf50'
      if (value === 5) return '#2e7d32'
      if (value === 10) return '#ffd700'
      return '#388e3c'
    },
    
    getTextColor(value) {
      if (value === 0 || value === 0.5 || value === 1 || value === 1.5 || value === 2 || value === 3 || value === 5) return 'white'
      if (value === 10) return '#222'
      return 'white'
    },
    
    getSegmentPath(index) {
      const centerX = 100, centerY = 100, radius = 85
      const startAngle = (index * this.segmentAngle) * Math.PI / 180
      const endAngle = ((index + 1) * this.segmentAngle) * Math.PI / 180
      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)
      return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`
    },
    
    getTextX(index) {
      const centerX = 100, radius = 60
      const angle = ((index + 0.5) * this.segmentAngle) * Math.PI / 180
      return centerX + radius * Math.cos(angle)
    },
    
    getTextY(index) {
      const centerY = 100, radius = 60
      const angle = ((index + 0.5) * this.segmentAngle) * Math.PI / 180
      return centerY + radius * Math.sin(angle)
    },
    
    openGame(gameId) {
      this.selectedGame = gameId
      this.gameOpened = true
      this.gameError = ""
      this.resetGame()
    },
    
    closeGame() {
      this.gameOpened = false
    },
    
    async updateVipBalance(newBalance) {
      this.vipBalance = newBalance
      const user = auth.currentUser
      if (user) {
        await updateDoc(doc(db, "users", user.uid), { vipBalance: this.vipBalance })
      }
    },
    
    showResult(message, isWin) {
      if (this.resultTimeout) clearTimeout(this.resultTimeout)
      this.resultText = message
      this.resultType = isWin ? 'win-message' : 'lose-message'
      this.resultIcon = isWin ? 'fas fa-trophy' : 'fas fa-skull'
      this.showResultMessage = true
      this.resultTimeout = setTimeout(() => {
        this.showResultMessage = false
      }, 3000)
    },
    
    resetGame() {
      this.wheelRotation = 0
      this.isSpinning = false
      this.lastResult = null
      this.gameError = ''
    },
    
    async spinWheel() {
      if (!this.canSpin) return
      
      if (this.settingsLoading) {
        this.gameError = 'جاري تحميل الإعدادات...'
        return
      }
      
      this.showResultMessage = false
      this.playSound(this.clickSound)
      this.gameError = ''
      this.isSpinning = true
      
      // خصم الرهان من vipBalance (القابل للسحب)
      this.vipBalance -= this.betAmount
      await this.updateVipBalance(this.vipBalance)
      
      this.playSound(this.spinSound)
      
      // ========== الخطوة 1: حساب النتيجة الحقيقية باستخدام الإعدادات الفعلية ==========
      const gameResult = this.getGameResult()
      console.log(`🎯 النتيجة الحقيقية: ${gameResult.multiplier}x - ${gameResult.message}`)
      
      // ========== الخطوة 2: إيجاد القطاع المناسب للعرض البصري ==========
      const targetSegmentIndex = this.findSegmentIndexByMultiplier(gameResult.multiplier)
      const targetSegmentValue = this.wheelSegmentsForDisplay[targetSegmentIndex].displayValue
      
      console.log(`🎯 للعرض البصري: سيتوقف على قطاع ${targetSegmentIndex} (يظهر ${targetSegmentValue}x)`)
      
      // ========== الخطوة 3: حساب زاوية التوقف ==========
      const segmentMiddle = (targetSegmentIndex * this.segmentAngle) + (this.segmentAngle / 2)
      let requiredAngle = 90 - segmentMiddle
      if (requiredAngle < 0) requiredAngle += 360
      
      const spins = 15 + Math.floor(Math.random() * 10)
      const targetRotation = (360 * spins) + requiredAngle
      
      const start = this.wheelRotation
      const duration = 3500
      const startTime = performance.now()
      
      const animate = (time) => {
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        this.wheelRotation = start + ((targetRotation - start) * easeOut)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          this.wheelRotation = targetRotation
          setTimeout(() => {
            this.finishSpin(gameResult)
          }, 200)
        }
      }
      
      requestAnimationFrame(animate)
    },
    
    async finishSpin(gameResult) {
      this.isSpinning = false
      
      const multiplier = gameResult.multiplier
      const winAmount = this.betAmount * multiplier
      let message = ''
      let isWin = false
      
      console.log(`💰 النتيجة النهائية: مضاعف ${multiplier}x | أرباح: ${winAmount.toFixed(2)} USDT`)
      
      if (multiplier === 0) {
        message = `😢 خسرت ${this.betAmount.toFixed(2)} USDT`
        this.playSound(this.loseSound)
        isWin = false
      } 
      else {
        this.vipBalance += winAmount
        await this.updateVipBalance(this.vipBalance)
        
        if (multiplier === 0.5) {
          message = `🎉 ربحت ${winAmount.toFixed(2)} USDT! (ربح صغير ×${multiplier})`
        } else if (multiplier === 1) {
          message = `🤝 تعادل! استرجعت ${this.betAmount.toFixed(2)} USDT`
        } else if (multiplier === 1.5) {
          message = `🎉 ربحت ${winAmount.toFixed(2)} USDT! (ربح متوسط ×${multiplier})`
        } else if (multiplier === 2) {
          message = `🎉🎉 ربحت ${winAmount.toFixed(2)} USDT! (ربح جيد ×${multiplier}) 🎉🎉`
        } else if (multiplier === 3) {
          message = `🎉🎉🎉 ربحت ${winAmount.toFixed(2)} USDT! (ربح كبير ×${multiplier}) 🎉🎉🎉`
        } else if (multiplier === 5) {
          message = `🏆🏆🏆 ربحت ${winAmount.toFixed(2)} USDT! (ربح ممتاز ×${multiplier}) 🏆🏆🏆`
        } else if (multiplier === 10) {
          message = `👑👑👑 جائزة كبرى! ربحت ${winAmount.toFixed(2)} USDT! (×${multiplier}) 👑👑👑`
        } else {
          message = `🎉 ربحت ${winAmount.toFixed(2)} USDT! (×${multiplier})`
        }
        
        this.playSound(this.winSound)
        isWin = true
      }
      
      this.showResult(message, isWin)
      
      this.lastResult = {
        multiplier: multiplier,
        isWin: isWin,
        winAmount: winAmount,
        message: message
      }
    }
  }
}
</script>

<style scoped>
/* ========== التعديلات المطلوبة فقط ========== */

.game-page {
  background: linear-gradient(135deg, #0a0f1e 0%, #1a1f2f 100%);
  min-height: 100vh;
  color: #ffffff;
  padding: 15px;
  text-align: center;
  direction: rtl;
  font-family: 'Montserrat', 'Cairo', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* زر الرجوع - أصبح في الأعلى مع تموضع أفضل */
.back-button-container {
  margin-bottom: 10px;
  text-align: right;
  position: relative;
  z-index: 15;
}

.back-button {
  background: linear-gradient(145deg, #1e2333, #131826);
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 8px 20px; /* أصغر قليلاً */
  border-radius: 50px;
  font-size: 14px; /* خط أصغر */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.back-button:hover {
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  color: #0a0f1e;
  transform: translateX(-5px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4);
}

/* حقل الرصيد - أصغر وأكثر أناقة */
.top-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 15px; /* مسافة أقل */
  z-index: 10;
  position: relative;
}

.balance-gold {
  background: linear-gradient(145deg, #1e2333, #131826);
  padding: 6px 20px; /* أصغر بكثير */
  border-radius: 100px;
  border: 1px solid #ffd700;
  box-shadow: 0 3px 12px rgba(255, 215, 0, 0.15), inset 0 0 8px rgba(255, 215, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.balance-gold i {
  color: #ffd700;
  font-size: 16px; /* أصغر */
  filter: drop-shadow(0 0 5px #ffd700);
}

.balance-gold span {
  font-size: 14px; /* خط أصغر */
  color: #e0e0e0;
}

.balance-gold strong {
  color: #ffd700;
  font-size: 16px; /* أصغر */
  margin-right: 4px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

/* رسالة الفوز/الخسارة - تعديل بسيط للمسافة */
.result-message {
  position: fixed;
  top: 70px; /* تعديل بسيط ليتناسب مع الترتيب الجديد */
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid;
  backdrop-filter: blur(10px);
  min-width: 280px;
  justify-content: center;
  text-align: center;
}

.win-message {
  background: linear-gradient(145deg, #1a2f1a, #0f1f0f);
  border-color: #4caf50;
  box-shadow: 0 0 30px rgba(76, 175, 80, 0.3);
  color: #4caf50;
}

.win-message i {
  color: #4caf50;
  filter: drop-shadow(0 0 8px #4caf50);
}

.lose-message {
  background: linear-gradient(145deg, #2f1a1a, #1f0f0f);
  border-color: #f44336;
  box-shadow: 0 0 30px rgba(244, 67, 54, 0.3);
  color: #f44336;
}

.lose-message i {
  color: #f44336;
  filter: drop-shadow(0 0 8px #f44336);
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}

/* التبويبات - بدون تغيير */
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
  max-height: 200px;
  overflow-y: auto;
  padding: 15px;
  background: rgba(30, 35, 51, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  scrollbar-width: thin;
  scrollbar-color: #ffd700 #1e2333;
}

.tabs button {
  padding: 12px 20px;
  border-radius: 50px;
  background: linear-gradient(145deg, #1e2333, #131826);
  color: #ffffff;
  border: 1px solid rgba(255, 215, 0, 0.3);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.tabs button:hover {
  border-color: #ffd700;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
}

.tabs .active {
  background: linear-gradient(135deg, #ffd700, #ffed4a);
  color: #0a0f1e;
  border: none;
  box-shadow: 0 5px 25px rgba(255, 215, 0, 0.5);
}

/* عرض اللعبة - تعديل المسافة العلوية */
.game-fullscreen {
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0 10px; /* مسافة أقل من الأعلى */
}

.wheel-card {
  background: rgba(20, 25, 40, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 40px;
  padding: 20px; /* padding أقل قليلاً */
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 0 50px rgba(255, 215, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.wheel-header {
  position: relative;
  margin-bottom: 20px; /* مسافة أقل */
  text-align: center;
}

.wheel-header h2 {
  font-size: 26px; /* أصغر قليلاً للتناسب */
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700, #ffed4a, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
  letter-spacing: 2px;
}

.header-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 0;
}

.wheel-content {
  /* بدون تغيير */
}

.wheel-wrapper {
  position: relative;
  width: 280px; /* أصغر قليلاً للتناسب مع المساحة */
  height: 280px;
  margin: 10px auto;
}

@media (max-width: 480px) {
  .wheel-wrapper {
    width: 240px;
    height: 240px;
  }
}

.pointer {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 45px; /* أصغر قليلاً */
  color: gold;
  z-index: 10;
  text-shadow: 0 0 20px gold, 0 0 40px rgba(255, 215, 0, 0.5);
  animation: pointerGlow 1.5s infinite;
}

@keyframes pointerGlow {
  0%, 100% { text-shadow: 0 0 15px gold; }
  50% { text-shadow: 0 0 30px gold; }
}

.wheel-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.wheel-svg {
  width: 100%;
  height: 100%;
  transition: transform 3.5s cubic-bezier(0.1, 0.9, 0.2, 1);
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.3));
}

.bet-section {
  display: flex;
  flex-direction: column;
  gap: 12px; /* مسافة أقل */
  align-items: center;
  margin-top: 20px; /* مسافة أقل */
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.bet-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 300px;
}

.bet-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px; /* أصغر */
  z-index: 2;
  color: #ffd700;
}

.bet-input {
  width: 100%;
  padding: 12px 40px 12px 65px; /* padding أصغر */
  border-radius: 50px;
  background: linear-gradient(145deg, #1e2333, #131826);
  border: 2px solid rgba(255, 215, 0, 0.3);
  color: white;
  font-size: 15px;
  text-align: center;
  transition: all 0.3s;
}

.bet-input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.bet-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bet-currency {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffd700;
  font-weight: 600;
  font-size: 13px;
}

.spin-btn {
  background: linear-gradient(135deg, #ffd700, #ffed4a, #ffd700);
  color: #0a0f1e;
  border: none;
  padding: 12px 30px; /* أصغر قليلاً */
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px; /* أصغر */
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.6);
}

.spin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  font-size: 13px; /* أصغر */
  padding: 8px 15px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 50px;
  border: 1px solid #f44336;
  width: 100%;
  max-width: 300px;
  text-align: center;
}

/* تحسينات للهاتف */
@media (max-width: 480px) {
  .game-page {
    padding: 10px;
  }
  
  .back-button {
    padding: 6px 15px;
    font-size: 13px;
  }
  
  .balance-gold {
    padding: 5px 15px;
  }
  
  .balance-gold i {
    font-size: 14px;
  }
  
  .balance-gold span {
    font-size: 13px;
  }
  
  .balance-gold strong {
    font-size: 14px;
  }
  
  .tabs button {
    padding: 10px 15px;
    font-size: 12px;
  }
  
  .wheel-card {
    padding: 12px;
  }
  
  .wheel-header h2 {
    font-size: 20px;
  }
  
  .pointer {
    font-size: 35px;
    top: -10px;
  }
  
  .bet-section {
    padding: 12px;
  }
  
  .spin-btn {
    padding: 10px 20px;
    font-size: 15px;
  }
  
  .result-message {
    top: 60px;
    min-width: 250px;
    font-size: 14px;
    padding: 10px 20px;
  }
}
</style>
