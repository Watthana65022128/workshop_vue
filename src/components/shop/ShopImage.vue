<template>
  <div class="kit-product-image">
    <img
      v-if="url && !failed"
      :src="url"
      :alt="product.name"
      @error="failed = true"
    />
    <div v-else class="kit-shirt-placeholder">
      <v-icon aria-hidden="true">mdi-tshirt-crew-outline</v-icon>
      <span>{{
        loading ? "กำลังโหลดรูป" : failed ? "โหลดรูปไม่ได้" : "ยังไม่มีรูปเสื้อ"
      }}</span>
      <button
        v-if="failed && !loading"
        type="button"
        class="kit-text-button"
        @click="load"
      >
        ลองใหม่
      </button>
    </div>
  </div>
</template>

<script>
import { shopApi } from "@/services/shop";
import { shopSession } from "@/services/shop-session";

export default {
  name: "ShopImage",
  props: { product: { type: Object, required: true } },
  data: () => ({
    url: "",
    loading: false,
    failed: false,
    generation: 0,
    session: shopSession,
  }),
  computed: {
    imageKey() {
      return `${this.session.token}|${this.product._id}|${JSON.stringify(
        this.product.image
      )}|${this.product.updatedAt}`;
    },
  },
  watch: {
    imageKey: {
      immediate: true,
      handler() {
        this.load();
      },
    },
  },
  beforeDestroy() {
    this.generation++;
    this.release();
  },
  methods: {
    release() {
      if (this.url) URL.revokeObjectURL(this.url);
      this.url = "";
    },
    async load() {
      const generation = ++this.generation;
      this.release();
      this.failed = false;
      this.loading = false;
      if (!this.product.image || !this.session.token) return;
      this.loading = true;
      try {
        const blob = await shopApi.image(this.product._id);
        if (generation === this.generation)
          this.url = URL.createObjectURL(blob);
      } catch {
        if (generation === this.generation) this.failed = true;
      } finally {
        if (generation === this.generation) this.loading = false;
      }
    },
  },
};
</script>
