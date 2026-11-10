<template>
  <div class="page-content">
    <page-heading number="03" category="SOMETHING TO LOOK FORWARD TO" title="พื้นที่สำหรับสิ่งต่อไป"
      description="อีกหนึ่งบทเรียนใหม่ ที่เราจะได้ทดลองไปด้วยกัน" />
    <v-card class="upcoming-card surface-card" outlined>
      <span class="upcoming-status"><span /> COMING SOON</span>
      <div class="upcoming-icon" aria-hidden="true"><v-icon size="62" color="primary">mdi-rocket-launch-outline</v-icon><span>✦</span></div>
      <p class="eyebrow">THE NEXT CHAPTER</p>
      <h2>รอโจทย์ Workshop 3</h2>
      <p class="muted-text">พักไว้ตรงนี้ก่อน แล้วพบกันเมื่อโจทย์ใหม่พร้อม</p>
      <v-btn :to="{ name: 'profile' }" color="primary" depressed large>กลับไปหน้าแนะนำตัว<v-icon right size="18">mdi-arrow-right</v-icon></v-btn>
    </v-card>
  </div>
</template>

<script>
import PageHeading from '@/components/layout/PageHeading.vue'

export default {
  name: 'UpcomingView',
  components: { PageHeading }
}
</script>
