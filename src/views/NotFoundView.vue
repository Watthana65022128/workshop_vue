<template>
  <v-container class="py-12 text-center">
    <h1>404 — ไม่พบหน้านี้</h1>
    <p class="mt-4">เส้นทางที่คุณเปิดไม่มีอยู่ในระบบ</p>
    <v-btn :to="{ name: 'welcome' }" color="primary" exact>
      กลับหน้าหลัก
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>
