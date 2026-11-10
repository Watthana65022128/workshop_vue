<template>
  <v-dialog
    :value="true"
    :persistent="busy"
    max-width="720"
    content-class="football-dialog"
    @input="!$event && $emit('close')"
  >
    <section class="kit-ui kit-modal" :aria-label="title">
      <header class="kit-modal-heading">
        <div>
          <span class="kit-kicker">Watthana Shop / WORKSHOP 03</span>
          <h2>{{ title }}</h2>
        </div>
        <button
          type="button"
          class="kit-icon-button"
          :disabled="busy"
          aria-label="ปิดหน้าต่าง"
          @click="$emit('close')"
        >
          <v-icon>mdi-close</v-icon>
        </button>
      </header>
      <slot />
    </section>
  </v-dialog>
</template>

<script>
export default {
  name: "ShopModal",
  props: { title: { type: String, required: true }, busy: Boolean },
};
</script>
