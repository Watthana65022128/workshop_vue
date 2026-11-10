<template>
  <v-card class="profile-detail surface-card" outlined>
    <div class="detail-heading">
      <span class="icon-tile" :class="tone"><v-icon color="primary" size="23">{{ icon }}</v-icon></span>
      <h2>{{ title }}</h2>
    </div>
    <ul v-if="items.length" class="interest-list">
      <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </ul>
    <p v-else class="empty-value">ยังไม่ได้ระบุ</p>
  </v-card>
</template>

<script>
export default {
  name: 'ProfileCard',
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    tone: { type: String, default: '' },
    items: { type: Array, default: () => [] }
  }
}
</script>