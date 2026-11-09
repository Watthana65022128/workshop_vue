<template>
  <v-card class="card-img mx-auto" max-width="600" outlined rounded="lg">
    <v-img
      v-if="src"
      :src="src"
      :alt="alt"
      :aspect-ratio="4 / 3"
      contain
    />
    <div v-else class="card-img__placeholder">
      <v-icon size="48" color="grey">mdi-image-outline</v-icon>
      <p class="mt-3 mb-0">ยังไม่ได้ใส่รูปภาพ</p>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'CardImg',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: 'รูปภาพ'
    }
  }
}
</script>

<style scoped>
.card-img {
  overflow: hidden;
}

.card-img__placeholder {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #616161;
}
</style>
