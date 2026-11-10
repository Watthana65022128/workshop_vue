<template>
  <div class="kit-auth-layout">
    <section class="kit-auth-story">
      <span class="kit-kicker">THE GAME BEHIND THE GAME</span>
      <h2>ทุกเสื้อมีเรื่องราว<br>ทุกร้านมี<span>เกมของตัวเอง.</span></h2>
      <p>จัดการเสื้อทีมโปรด ดูแลสต็อก และบันทึกทุกยอดขาย<br>พร้อมลงสนามในพื้นที่เดียว</p>
      <div class="kit-pitch" aria-hidden="true"><span class="kit-pitch-circle" /><v-icon>mdi-tshirt-crew-outline</v-icon><span class="kit-pitch-label">YOUR CLUB. YOUR COLLECTION.</span></div>
      <div class="kit-story-bottom"><span>01 / จัดการสินค้า</span><span>02 / เช็กสต็อก</span><span>03 / บันทึกยอดขาย</span></div>
    </section>
    <section class="kit-panel kit-auth-panel">
      <div class="kit-toggle" aria-label="เลือกเข้าสู่ระบบหรือสมัครร้าน">
        <button type="button" :disabled="busy" :aria-pressed="mode === 'login'" :class="{ active: mode === 'login' }" @click="switchMode('login')">เข้าสู่ระบบ</button>
        <button type="button" :disabled="busy" :aria-pressed="mode === 'register'" :class="{ active: mode === 'register' }" @click="switchMode('register')">สมัครร้าน</button>
      </div>
      <span class="kit-kicker">{{ mode === 'login' ? 'WELCOME BACK, MANAGER' : 'BUILD YOUR OWN CLUB' }}</span>
      <h2>{{ mode === 'login' ? 'พร้อมลงสนามแล้วหรือยัง' : 'เริ่มต้นร้านของคุณ' }}</h2>
      <p class="kit-muted">{{ mode === 'login' ? 'เข้าสู่ระบบด้วยบัญชีร้านค้าหรือแอดมิน' : 'สมัครด้วยอีเมล แล้วรอแอดมินอนุมัติร้าน' }}</p>
      <p v-if="success" class="kit-alert kit-alert-success" role="status">{{ success }}</p>
      <p v-if="error" class="kit-alert" role="alert">{{ error }}</p>
      <form class="kit-form" @submit.prevent="submit">
        <label>อีเมล<input v-model="email" type="email" autocomplete="username" required maxlength="254" placeholder="you@club.com" :disabled="busy" /></label>
        <label>รหัสผ่าน<input v-model="password" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" minlength="8" required :disabled="busy" placeholder="อย่างน้อย 8 ตัวอักษร" /></label>
        <button class="kit-button kit-button-primary kit-full" type="submit" :disabled="busy">{{ busy ? 'กำลังดำเนินการ…' : mode === 'login' ? 'เข้าสู่ระบบร้าน' : 'สมัครร้านค้า' }}<v-icon size="18">mdi-arrow-right</v-icon></button>
      </form>
      <p class="kit-auth-note"><v-icon size="16">mdi-shield-check-outline</v-icon> พื้นที่สำหรับเจ้าของร้านและผู้ดูแลระบบ</p>
    </section>
  </div>
</template>

<script>
import { shopApi, shopError } from '@/services/shop'
import { saveShopSession } from '@/services/shop-session'
import { credentialsError } from '@/utils/shop'

export default {
  name: 'ShopAuth',
  data: () => ({ mode: 'login', email: '', password: '', busy: false, error: '', success: '', alive: true }),
  beforeDestroy() { this.alive = false },
  methods: {
    switchMode(mode) { this.mode = mode; this.error = ''; this.success = ''; this.password = '' },
    async submit() {
      if (this.busy) return
      this.error = credentialsError(this.email, this.password)
      this.success = ''
      if (this.error) return
      this.busy = true
      const credentials = { email: this.email.trim().toLowerCase(), password: this.password }
      try {
        if (this.mode === 'register') {
          await shopApi.register(credentials)
          if (!this.alive) return
          this.mode = 'login'
          this.password = ''
          this.success = 'สมัครร้านสำเร็จ เข้าสู่ระบบเพื่อดูสถานะการอนุมัติได้เลย'
        } else {
          const session = await shopApi.login(credentials)
          if (this.alive) saveShopSession(session)
        }
      } catch (error) {
        if (this.alive) this.error = error.response && error.response.status === 409 ? 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบหรือใช้อีเมลอื่น' : shopError(error)
      } finally { if (this.alive) this.busy = false }
    }
  }
}
</script>
