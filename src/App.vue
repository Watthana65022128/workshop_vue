<template>
  <v-app>
    <default-layout>
      <router-view />
    </default-layout>
  </v-app>
</template>

<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";

export default {
  name: "App",
  components: { DefaultLayout },
};
</script>
