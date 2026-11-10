<template>
  <div class="page-content kit-ui football-shop">
    <page-heading number="3" category="FOOTBALL SHIRT SHOP" title="Watthana Shop"
      description="จัดการสินค้า สต็อก และยอดขายเสื้อฟุตบอล" />
    <div v-if="session.account" class="kit-account-toolbar kit-panel">
      <div class="kit-account"><span class="kit-account-icon" aria-hidden="true"><v-icon size="22">mdi-account-outline</v-icon></span><span class="kit-account-info"><strong>{{ session.account.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้จัดการร้าน' }}</strong><span>{{ session.account.email }}</span></span></div>
      <button type="button" class="kit-button" :disabled="busy" @click="logout"><v-icon size="18">mdi-logout</v-icon>ออกจากระบบ</button>
    </div>

    <p v-if="notice" class="kit-alert kit-alert-success kit-notice" role="status">{{ notice }}<button type="button" class="kit-text-button" aria-label="ปิดข้อความ" @click="notice = ''">ปิด</button></p>
    <shop-auth v-if="!session.token" />

    <section v-else-if="session.account.status === 'pending' && session.account.role === 'shop'" class="kit-pending kit-panel">
      <span class="kit-status-disc"><v-icon size="42">mdi-timer-sand</v-icon></span><span class="kit-kicker">AWAITING APPROVAL</span><h2>ร้านของคุณกำลังรออนุมัติ</h2><p>สมัครร้านเรียบร้อยแล้ว เมื่อแอดมินอนุมัติ<br>เข้าสู่ระบบอีกครั้งเพื่อเริ่มจัดการเสื้อและบันทึกยอดขาย</p><button type="button" class="kit-button kit-button-primary" @click="logout">กลับไปเข้าสู่ระบบ</button>
    </section>

    <template v-else>
      <div class="kit-dashboard-intro"><div><h2>{{ isAdmin ? 'จัดการร้านค้า' : 'จัดการร้านของคุณ' }}</h2><p class="kit-muted">{{ isAdmin ? 'ตรวจสอบและอนุมัติร้านค้าที่พร้อมเริ่มต้น' : 'ดูแลสินค้า เช็กสต็อก และบันทึกยอดขายได้ในที่เดียว' }}</p></div><button type="button" class="kit-button" :disabled="loading || busy" @click="refresh"><v-icon size="18" :class="{ 'kit-spin': loading }">mdi-refresh</v-icon>{{ loading ? 'กำลังโหลด…' : 'อัปเดตข้อมูล' }}</button></div>
      <p v-if="loadError" class="kit-alert" role="alert">{{ loadError }} <button type="button" class="kit-text-button" :disabled="loading || busy" @click="refresh">ลองใหม่</button></p>
      <section v-if="accessDenied" class="kit-empty"><v-icon>mdi-lock-outline</v-icon><h2>ยังเข้าถึงข้อมูลส่วนนี้ไม่ได้</h2><p>กรุณาตรวจสิทธิ์หรือสถานะอนุมัติของบัญชี แล้วเข้าสู่ระบบอีกครั้ง</p><button type="button" class="kit-button kit-button-primary" :disabled="busy" @click="logout">เข้าสู่ระบบอีกครั้ง</button></section>
      <template v-else-if="isAdmin">
        <div class="kit-section-heading"><div><span class="kit-kicker">WAITING FOR THE WHISTLE</span><h2>ร้านที่รออนุมัติ <span class="kit-count">{{ shops.length }}</span></h2></div></div>
        <div v-if="loading && !loaded.shops" class="kit-loading" role="status">กำลังโหลดร้านค้า…</div>
        <div v-else-if="loaded.shops && !shops.length" class="kit-empty"><v-icon>mdi-check-decagram-outline</v-icon><p>ยังไม่มีร้านใหม่ที่รออนุมัติ</p></div>
        <div v-else class="kit-admin-list"><article v-for="shop in shops" :key="shop.id" class="kit-panel kit-admin-card"><span class="kit-admin-icon"><v-icon>mdi-storefront-outline</v-icon></span><div><span class="kit-stock empty">รออนุมัติ</span><h3>{{ shop.email }}</h3><p class="kit-muted">สมัครเมื่อ {{ dateTime(shop.createdAt) }}</p></div><button type="button" class="kit-button kit-button-primary" :disabled="busy || loading" @click="approval = shop; approvalError = ''">อนุมัติร้าน</button></article></div>
      </template>
      <template v-else>
        <nav class="kit-tabs" aria-label="เมนูจัดการร้าน"><button v-for="item in tabs" :key="item.key" type="button" :disabled="busy" :class="{ active: tab === item.key }" :aria-current="tab === item.key ? 'page' : undefined" @click="tab = item.key"><v-icon size="18">{{ item.icon }}</v-icon>{{ item.label }}</button></nav>
        <div v-if="loading && !loaded.products && !loaded.orders" class="kit-loading" role="status">กำลังเตรียมห้องเสื้อของคุณ…</div>
        <template v-else-if="tab === 'overview'">
          <div class="kit-section-heading"><div><span class="kit-kicker">SHOP OVERVIEW</span><h2>ภาพรวมร้าน</h2></div><button type="button" class="kit-button kit-button-primary" :disabled="loading || !loaded.products" @click="tab = 'products'">จัดการสินค้า<v-icon size="18">mdi-arrow-right</v-icon></button></div>
          <div class="kit-stats"><article class="kit-panel kit-stat"><span class="kit-stat-label">เสื้อในร้าน<v-icon size="20">mdi-tshirt-crew-outline</v-icon></span><strong>{{ loaded.products ? products.length : '—' }}<small>รายการ</small></strong><p>แยกสต็อกตามรุ่นและไซซ์</p></article><article class="kit-panel kit-stat"><span class="kit-stat-label">สต็อกพร้อมขาย<v-icon size="20">mdi-package-variant-closed</v-icon></span><strong>{{ loaded.products ? totalStock.toLocaleString('th-TH') : '—' }}<small>ตัว</small></strong><p>{{ loaded.products ? `${products.filter(product => !product.stock).length} รายการสินค้าหมด` : 'ยังโหลดข้อมูลไม่สำเร็จ' }}</p></article><article class="kit-panel kit-stat kit-stat-highlight"><span class="kit-stat-label">ยอดขายสะสม<v-icon size="20">mdi-trending-up</v-icon></span><strong>{{ loaded.orders ? money(totalSales) : '—' }}</strong><p>{{ loaded.orders ? `${orders.length} รายการบันทึกขาย` : 'ยังโหลดข้อมูลไม่สำเร็จ' }}</p></article></div>
          <section class="kit-panel kit-orders-panel"><div class="kit-section-heading"><div><span class="kit-kicker">LATEST ON THE SCORESHEET</span><h2>ยอดขายล่าสุด</h2></div><button type="button" class="kit-text-button" @click="tab = 'orders'">ดูทั้งหมด ↗</button></div><shop-orders v-if="loaded.orders" :orders="orders.slice(0, 5)" /><p v-else class="kit-muted">ยังโหลดประวัติยอดขายไม่สำเร็จ กดอัปเดตข้อมูลเพื่อลองใหม่</p></section>
        </template>
        <shop-products v-else-if="tab === 'products' && loaded.products" :products="products" :disabled="loading || busy" @refresh="refresh" @notice="notice = $event" @busy="busy = $event" @inspect-orders="tab = 'orders'" />
        <section v-else-if="tab === 'orders'" class="kit-panel kit-orders-panel"><div class="kit-section-heading"><div><span class="kit-kicker">THE SCORESHEET</span><h2>ประวัติยอดขาย <span class="kit-count">{{ orders.length }}</span></h2></div></div><p class="kit-muted">ชื่อและราคาเป็นข้อมูล ณ เวลาขาย รวมถึงสินค้าที่ถูกซ่อนแล้ว</p><shop-orders v-if="loaded.orders" :orders="orders" /><p v-else class="kit-muted">ยังโหลดประวัติไม่สำเร็จ กรุณากดอัปเดตข้อมูล</p></section>
        <div v-else class="kit-empty"><p>ยังโหลดสินค้าไม่สำเร็จ กรุณากดอัปเดตข้อมูลเพื่อลองใหม่</p></div>
      </template>
    </template>

    <shop-modal v-if="approval" title="อนุมัติร้านค้า" :busy="busy" @close="approval = null">
      <p v-if="approvalError" class="kit-alert" role="alert">{{ approvalError }}</p><p class="kit-description">อนุมัติร้าน <strong>{{ approval.email }}</strong> ให้เริ่มจัดการสินค้าและบันทึกยอดขายหรือไม่?</p><div class="kit-modal-actions"><button type="button" class="kit-button" :disabled="busy" @click="approval = null">ยกเลิก</button><button type="button" class="kit-button kit-button-primary" :disabled="busy" @click="approve">{{ busy ? 'กำลังอนุมัติ…' : 'ยืนยันอนุมัติร้าน' }}</button></div>
    </shop-modal>
  </div>
</template>

<script>
import PageHeading from '@/components/layout/PageHeading.vue'
import ShopAuth from '@/components/shop/ShopAuth.vue'
import ShopProducts from '@/components/shop/ShopProducts.vue'
import ShopOrders from '@/components/shop/ShopOrders.vue'
import ShopModal from '@/components/shop/ShopModal.vue'
import { shopSession, clearShopSession } from '@/services/shop-session'
import { shopApi, shopError } from '@/services/shop'
import { money, dateTime } from '@/utils/shop'
import '@/styles/shop.scss'

export default {
  name: 'ShopView',
  components: { PageHeading, ShopAuth, ShopProducts, ShopOrders, ShopModal },
  data: () => ({ session: shopSession, products: [], orders: [], shops: [], loaded: { products: false, orders: false, shops: false }, tab: 'overview', loading: false, busy: false, loadError: '', accessDenied: false, notice: '', approval: null, approvalError: '', generation: 0, alive: true, intentionalLogout: false,
    tabs: [{ key: 'overview', label: 'ภาพรวมร้าน', icon: 'mdi-view-dashboard-outline' }, { key: 'products', label: 'ห้องเสื้อ / สินค้า', icon: 'mdi-tshirt-crew-outline' }, { key: 'orders', label: 'ประวัติยอดขาย', icon: 'mdi-receipt-text-outline' }]
  }),
  computed: {
    isAdmin() { return this.session.account && this.session.account.role === 'admin' },
    totalStock() { return this.products.reduce((sum, product) => sum + product.stock, 0) },
    totalSales() { return this.orders.reduce((sum, order) => sum + order.total, 0) }
  },
  watch: {
    'session.token'(token, oldToken) {
      this.generation++; this.loading = false; this.busy = false; this.approval = null
      this.products = []; this.orders = []; this.shops = []; this.loaded = { products: false, orders: false, shops: false }; this.loadError = ''; this.accessDenied = false; this.tab = 'overview'
      if (!token && oldToken) this.notice = this.intentionalLogout ? 'ออกจากระบบแล้ว' : 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง'
      else this.notice = ''
      this.intentionalLogout = false
      if (token) this.refresh()
    }
  },
  mounted() { if (this.session.token) this.refresh() },
  beforeDestroy() { this.alive = false; this.generation++ },
  methods: {
    money, dateTime,
    logout() { if (this.busy) return; this.intentionalLogout = true; clearShopSession() },
    async refresh() {
      if (!this.session.token || !this.session.account || (this.session.account.role === 'shop' && this.session.account.status === 'pending')) return
      const generation = ++this.generation
      this.loading = true; this.loadError = ''; this.accessDenied = false
      const keys = this.isAdmin ? ['shops'] : ['products', 'orders']
      const requests = this.isAdmin ? [shopApi.pendingShops()] : [shopApi.products(), shopApi.orders()]
      const results = await Promise.allSettled(requests)
      if (!this.alive || generation !== this.generation) return
      const errors = []
      results.forEach((result, index) => {
        const key = keys[index]
        if (result.status === 'fulfilled') { this[key] = result.value; this.loaded[key] = true }
        else {
          errors.push(`${{ products: 'สินค้า', orders: 'ประวัติยอดขาย', shops: 'ร้านค้า' }[key]}: ${shopError(result.reason)}`)
          if (result.reason.response && result.reason.response.status === 403) this.accessDenied = true
        }
      })
      this.loadError = errors.join(' / '); this.loading = false
    },
    async approve() {
      if (this.busy || !this.approval) return
      this.busy = true; this.approvalError = ''
      const id = this.approval.id
      try {
        await shopApi.approve(id)
        if (!this.alive) return
        this.shops = this.shops.filter(shop => shop.id !== id); this.approval = null; this.notice = 'อนุมัติร้านแล้ว เจ้าของร้านเข้าสู่ระบบอีกครั้งเพื่อเริ่มใช้งานได้'
        await this.refresh()
      } catch (error) {
        if (!this.alive) return
        if (error.response && error.response.status === 409) { this.approval = null; this.notice = 'ร้านนี้ได้รับการอนุมัติแล้ว'; await this.refresh() }
        else this.approvalError = shopError(error)
      } finally { if (this.alive) this.busy = false }
    }
  }
}
</script>
