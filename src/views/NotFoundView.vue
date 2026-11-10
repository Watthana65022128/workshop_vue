<template>
  <div class="page-content">
    <v-card class="upcoming-card surface-card not-found" outlined>
      <p class="error-number">404</p>
      <p class="muted-text">ไม่พบหน้า</p>
      <v-btn :to="{ name: 'profile' }" color="primary" depressed large>กลับหน้าแรก</v-btn>
    </v-card>
  </div>
</template>

<script>
export default { name: 'NotFoundView' }
</script>