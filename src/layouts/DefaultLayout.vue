<template>
  <div>
    <app-toolbar v-if="$route.meta.showToolbar === true" />
    <v-main>
      <slot />
    </v-main>
  </div>
</template>

<script>
import AppToolbar from '@/components/layout/AppToolbar.vue'

export default {
  name: 'DefaultLayout',
  components: { AppToolbar }
}
</script>
