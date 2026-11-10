<template>
  <div>
    <div v-if="!orders.length" class="kit-empty"><v-icon>mdi-receipt-text-outline</v-icon><h3>ยังไม่มียอดขาย</h3><p>รายการจะปรากฏที่นี่เมื่อบันทึกยอดขายสำเร็จ</p></div>
    <div v-else class="kit-table-wrap" tabindex="0" role="region" aria-label="ประวัติยอดขาย เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด">
      <table class="kit-table">
        <caption class="sr-only">ประวัติยอดขาย เรียงใหม่ไปเก่า</caption>
        <thead><tr><th scope="col">วันเวลา / รายการ</th><th scope="col">สินค้า</th><th scope="col">ราคาต่อชิ้น</th><th scope="col">จำนวน</th><th scope="col">ยอดรวม</th><th scope="col">หมายเหตุ</th></tr></thead>
        <tbody><tr v-for="order in orders" :key="order._id">
          <td><time :datetime="order.createdAt">{{ dateTime(order.createdAt) }}</time><small>#{{ order._id.slice(-8).toUpperCase() }}</small></td>
          <td class="kit-order-name">{{ order.productName }}</td><td>{{ money(order.unitPrice) }}</td><td>{{ order.quantity }}</td><td class="kit-accent">{{ money(order.total) }}</td><td class="kit-order-note">{{ order.note || '—' }}</td>
        </tr></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { money, dateTime } from '@/utils/shop'
export default {
  name: 'ShopOrders',
  props: { orders: { type: Array, default: () => [] } },
  methods: { money, dateTime }
}
</script>
