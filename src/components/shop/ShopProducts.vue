<template>
  <section>
    <div class="kit-section-heading">
      <div>
        <span class="kit-kicker">THE KIT ROOM</span>
        <h2>
          เสื้อในร้าน <span class="kit-count">{{ products.length }}</span>
        </h2>
      </div>
      <button
        type="button"
        class="kit-button kit-button-primary"
        :disabled="disabled"
        @click="openEditor()"
      >
        <v-icon size="18">mdi-plus</v-icon>เพิ่มสินค้า
      </button>
    </div>
    <div class="kit-filters">
      <label class="kit-search"
        ><v-icon size="20">mdi-magnify</v-icon
        ><input
          v-model="search"
          type="search"
          placeholder="ค้นหาชื่อทีม รุ่น หรือไซซ์เสื้อ"
          aria-label="ค้นหาสินค้า"
      /></label>
      <label class="kit-checkbox"
        ><input v-model="outOfStock" type="checkbox" />เฉพาะสินค้าหมด</label
      >
    </div>
    <div v-if="!filtered.length" class="kit-empty">
      <v-icon>mdi-tshirt-crew-outline</v-icon>
      <h3>
        {{
          products.length
            ? "ไม่พบเสื้อที่ค้นหา"
            : "ห้องเสื้อพร้อมสำหรับคอลเลกชันแรก"
        }}
      </h3>
      <p>
        {{
          products.length
            ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง"
            : "เพิ่มเสื้อแต่ละไซซ์เป็นสินค้าคนละรายการ เพื่อแยกสต็อกได้ชัดเจน"
        }}
      </p>
    </div>
    <div v-else class="kit-products">
      <article
        v-for="product in filtered"
        :key="product._id"
        class="kit-product-card"
      >
        <button
          type="button"
          class="kit-image-button"
          :disabled="disabled"
          :aria-label="`ดูรายละเอียด ${product.name}`"
          @click="openDetails(product)"
        >
          <shop-image :product="product" />
        </button>
        <div class="kit-product-body">
          <span class="kit-stock" :class="{ empty: product.stock === 0 }"
            ><span />{{
              product.stock ? `คงเหลือ ${product.stock} ตัว` : "สินค้าหมด"
            }}</span
          >
          <h3>{{ product.name }}</h3>
          <p class="kit-product-description">
            {{ product.description || "ยังไม่มีรายละเอียดสินค้า" }}
          </p>
          <div class="kit-product-price">
            <strong>{{ money(product.price) }}</strong
            ><button
              type="button"
              class="kit-icon-button"
              :disabled="disabled"
              :aria-label="`แก้ไข ${product.name}`"
              @click="openEditor(product)"
            >
              <v-icon size="19">mdi-pencil-outline</v-icon>
            </button>
          </div>
          <button
            type="button"
            class="kit-button kit-button-primary kit-full"
            :disabled="disabled || product.stock === 0"
            @click="openSale(product)"
          >
            <v-icon size="18">mdi-receipt-text-plus-outline</v-icon>บันทึกยอดขาย
          </button>
        </div>
      </article>
    </div>

    <shop-modal v-if="dialog" :title="dialogTitle" :busy="busy" @close="close">
      <p v-if="error" class="kit-alert" role="alert">{{ error }}</p>

      <form v-if="dialog === 'editor'" class="kit-form" @submit.prevent="save">
        <p class="kit-muted">
          แยกสินค้าต่อไซซ์ เช่น Barcelona Home 2025/26 — M
        </p>
        <fieldset :disabled="busy || blockedSave">
          <label
            >ชื่อเสื้อ / รุ่น / ไซซ์<input
              v-model="form.name"
              required
              minlength="2"
              maxlength="120"
              placeholder="Barcelona Home 2025/26 — M"
          /></label>
          <label
            >รายละเอียด<textarea
              v-model="form.description"
              rows="3"
              maxlength="1000"
              placeholder="ทีม ฤดูกาล สี เนื้อผ้า และรายละเอียดเสื้อ"
            />
          </label>
          <div class="kit-form-row">
            <label
              >ราคา (บาท)<input
                v-model="form.price"
                required
                type="number"
                min="0"
                step="any"
                inputmode="decimal" /></label
            ><label
              >สต็อกคงเหลือ (ตัว)<input
                v-model="form.stock"
                required
                type="number"
                min="0"
                step="1"
                inputmode="numeric"
            /></label>
          </div>
          <label class="kit-file"
            >{{ editId ? "เพิ่มหรือเปลี่ยนรูปเสื้อ" : "รูปเสื้อ (ไม่บังคับ)"
            }}<input
              ref="imageInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              @change="chooseImage"
            /><span class="kit-muted"
              >JPEG, PNG หรือ WebP ขนาดไม่เกิน 5 MB</span
            ></label
          >
          <img
            v-if="preview"
            class="kit-upload-preview"
            :src="preview"
            alt="ตัวอย่างรูปเสื้อที่จะอัปโหลด"
          />
          <p v-if="file" class="kit-muted">
            ไฟล์ที่เลือก: {{ file.name }}
            <button type="button" class="kit-text-button" @click="clearFile">
              ยกเลิกรูปที่เลือก
            </button>
          </p>
        </fieldset>
        <p
          v-if="savedDetails"
          class="kit-alert kit-alert-success"
          role="status"
        >
          บันทึกข้อมูลสินค้าแล้ว
          สามารถเลือกภาพใหม่และบันทึกเพื่อลองอัปโหลดอีกครั้งได้
        </p>
        <div class="kit-modal-actions">
          <button
            type="button"
            class="kit-button"
            :disabled="busy"
            @click="close"
          >
            {{ blockedSave ? "ตรวจรายการสินค้า" : "ยกเลิก" }}
          </button>
          <button
            v-if="!blockedSave"
            type="submit"
            class="kit-button kit-button-primary"
            :disabled="busy"
          >
            {{ busy ? "กำลังบันทึก…" : "บันทึกสินค้า" }}
          </button>
        </div>
      </form>

      <template v-if="dialog === 'details' && selected">
        <div v-if="detailLoading" class="kit-loading" role="status">
          กำลังโหลดรายละเอียด…
        </div>
        <button
          v-if="error"
          type="button"
          class="kit-button"
          :disabled="detailLoading"
          @click="loadDetails(selected._id)"
        >
          โหลดรายละเอียดอีกครั้ง
        </button>
        <div class="kit-detail-layout">
          <shop-image :product="selected" />
          <div>
            <span class="kit-stock" :class="{ empty: !selected.stock }"
              >คงเหลือ {{ selected.stock }} ตัว</span
            >
            <h3>{{ selected.name }}</h3>
            <strong class="kit-detail-price">{{
              money(selected.price)
            }}</strong>
            <p class="kit-description">
              {{ selected.description || "ยังไม่มีรายละเอียดสินค้า" }}
            </p>
            <div class="kit-action-wrap">
              <button
                type="button"
                class="kit-button"
                :disabled="disabled || detailLoading"
                @click="openEditor(selected)"
              >
                แก้ไข / เปลี่ยนรูป</button
              ><button
                type="button"
                class="kit-button kit-button-primary"
                :disabled="
                  disabled ||
                  detailLoading ||
                  !selected.stock ||
                  !selected.isActive
                "
                @click="openSale(selected)"
              >
                บันทึกยอดขาย
              </button>
            </div>
          </div>
        </div>
        <div class="kit-action-wrap kit-danger-actions">
          <button
            type="button"
            class="kit-text-button kit-danger"
            :disabled="disabled || detailLoading"
            @click="confirm('hide')"
          >
            ซ่อนสินค้า</button
          ><button
            v-if="selected.image"
            type="button"
            class="kit-text-button kit-danger"
            :disabled="disabled || detailLoading"
            @click="confirm('delete-image')"
          >
            ลบรูปสินค้า
          </button>
        </div>
        <h3 class="kit-subheading">ประวัติยอดขายของเสื้อตัวนี้</h3>
        <shop-orders v-if="!detailLoading && !error" :orders="history" />
      </template>

      <form
        v-if="dialog === 'sale' && selected"
        class="kit-form"
        @submit.prevent="sell"
      >
        <div class="kit-sale-summary">
          <span class="kit-kicker">MATCH DAY SALE</span>
          <h3>{{ selected.name }}</h3>
          <p>
            {{ money(selected.price) }} / ตัว
            <span class="kit-muted">· คงเหลือ {{ selected.stock }} ตัว</span>
          </p>
        </div>
        <fieldset :disabled="busy || uncertain">
          <label
            >จำนวนขาย (ตัว)<input
              v-model="quantity"
              required
              type="number"
              min="1"
              :max="selected.stock"
              step="1"
              inputmode="numeric"
          /></label>
          <label
            >หมายเหตุ<textarea
              v-model="note"
              maxlength="500"
              rows="3"
              placeholder="เช่น ขายหน้าร้าน / เลขอ้างอิงการขาย"
            />
          </label>
        </fieldset>
        <div class="kit-sale-total">
          <span>ยอดรวมโดยประมาณ</span
          ><strong>{{ money(estimatedTotal) }}</strong>
        </div>
        <p class="kit-muted">
          ระบบจะบันทึกราคาล่าสุดและหักสต็อกเมื่อยืนยันสำเร็จ
        </p>
        <p v-if="uncertain" class="kit-alert" role="status">
          ยังยืนยันผลการบันทึกไม่ได้ กรุณาตรวจประวัติยอดขายก่อนบันทึกอีกครั้ง
          เพื่อป้องกันยอดซ้ำ
        </p>
        <div class="kit-modal-actions">
          <button
            type="button"
            class="kit-button"
            :disabled="busy"
            @click="close"
          >
            ปิด</button
          ><button
            v-if="uncertain"
            type="button"
            class="kit-button kit-button-primary"
            @click="inspectOrders"
          >
            ตรวจประวัติยอดขาย</button
          ><button
            v-else
            type="submit"
            class="kit-button kit-button-primary"
            :disabled="busy || disabled || !selected.stock"
          >
            {{ busy ? "กำลังบันทึก…" : "ยืนยันบันทึกยอดขาย" }}
          </button>
        </div>
      </form>

      <template
        v-if="(dialog === 'hide' || dialog === 'delete-image') && selected"
      >
        <p class="kit-description">
          {{
            dialog === "hide"
              ? `ซ่อน “${selected.name}” จากรายการสินค้า? จะไม่สามารถบันทึกยอดขายใหม่ของสินค้านี้ได้ แต่ประวัติยอดขายยังอยู่`
              : `ลบรูปของ “${selected.name}”? ข้อมูลสินค้าและสต็อกจะยังอยู่`
          }}
        </p>
        <div class="kit-modal-actions">
          <button
            type="button"
            class="kit-button"
            :disabled="busy"
            @click="close"
          >
            ยกเลิก</button
          ><button
            type="button"
            class="kit-button kit-button-danger"
            :disabled="busy"
            @click="performRemoval"
          >
            {{
              busy
                ? "กำลังดำเนินการ…"
                : dialog === "hide"
                ? "ยืนยันซ่อนสินค้า"
                : "ยืนยันลบรูป"
            }}
          </button>
        </div>
      </template>
    </shop-modal>
  </section>
</template>

<script>
import ShopModal from "./ShopModal.vue";
import ShopImage from "./ShopImage.vue";
import ShopOrders from "./ShopOrders.vue";
import { shopApi, shopError } from "@/services/shop";
import { money, productError, imageError, orderError } from "@/utils/shop";

const blankForm = () => ({ name: "", description: "", price: "", stock: "" });

export default {
  name: "ShopProducts",
  components: { ShopModal, ShopImage, ShopOrders },
  props: { products: { type: Array, default: () => [] }, disabled: Boolean },
  data: () => ({
    search: "",
    outOfStock: false,
    dialog: "",
    snapshot: null,
    detailProduct: null,
    editId: "",
    form: blankForm(),
    file: null,
    preview: "",
    busy: false,
    error: "",
    quantity: "1",
    note: "",
    uncertain: false,
    blockedSave: false,
    savedDetails: false,
    history: [],
    detailLoading: false,
    generation: 0,
    alive: true,
  }),
  computed: {
    filtered() {
      const search = this.search.trim().toLocaleLowerCase();
      return this.products.filter(
        (product) =>
          (!this.outOfStock || product.stock === 0) &&
          product.name.toLocaleLowerCase().includes(search)
      );
    },
    selected() {
      return (
        this.detailProduct ||
        this.products.find(
          (product) => this.snapshot && product._id === this.snapshot._id
        ) ||
        this.snapshot
      );
    },
    dialogTitle() {
      return {
        editor: this.editId ? "แก้ไขเสื้อในร้าน" : "เพิ่มเสื้อ",
        details: "รายละเอียดสินค้า",
        sale: "บันทึกยอดขาย",
        hide: "ยืนยันซ่อนสินค้า",
        "delete-image": "ยืนยันลบรูปสินค้า",
      }[this.dialog];
    },
    estimatedTotal() {
      const quantity = Number(this.quantity);
      const total = quantity * (this.selected ? this.selected.price : 0);
      return quantity > 0 && Number.isFinite(total) ? total : 0;
    },
  },
  watch: {
    busy(value) {
      this.$emit("busy", value);
    },
  },
  beforeDestroy() {
    this.alive = false;
    this.generation++;
    this.releasePreview();
    this.$emit("busy", false);
  },
  methods: {
    money,
    releasePreview() {
      if (this.preview) URL.revokeObjectURL(this.preview);
      this.preview = "";
    },
    clearFile() {
      this.file = null;
      this.releasePreview();
      if (this.$refs.imageInput) this.$refs.imageInput.value = "";
    },
    reset() {
      this.generation++;
      this.error = "";
      this.detailProduct = null;
      this.detailLoading = false;
      this.uncertain = false;
      this.blockedSave = false;
      this.savedDetails = false;
      this.clearFile();
    },
    close() {
      if (this.busy) return;
      const refresh = this.blockedSave;
      this.reset();
      this.dialog = "";
      if (refresh) this.$emit("refresh");
    },
    openEditor(product) {
      this.reset();
      this.snapshot = product || null;
      this.editId = product ? product._id : "";
      this.form = product
        ? {
            name: product.name,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
          }
        : blankForm();
      this.dialog = "editor";
    },
    openDetails(product) {
      this.reset();
      this.snapshot = product;
      this.history = [];
      this.dialog = "details";
      this.loadDetails(product._id);
    },
    async loadDetails(id) {
      const generation = ++this.generation;
      this.error = "";
      this.detailLoading = true;
      try {
        const [product, orders] = await Promise.all([
          shopApi.product(id),
          shopApi.productOrders(id),
        ]);
        if (generation !== this.generation || !this.alive) return;
        this.detailProduct = product;
        this.history = orders;
      } catch (error) {
        if (generation === this.generation && this.alive)
          this.error = shopError(error);
      } finally {
        if (generation === this.generation && this.alive)
          this.detailLoading = false;
      }
    },
    openSale(product) {
      this.reset();
      this.snapshot = product;
      this.quantity = "1";
      this.note = "";
      this.dialog = "sale";
    },
    confirm(type) {
      const product = this.selected;
      this.reset();
      this.snapshot = product;
      this.dialog = type;
    },
    chooseImage(event) {
      const file = event.target.files && event.target.files[0];
      this.file = file || null;
      this.releasePreview();
      if (!file) return;
      this.error = imageError(file);
      if (this.error) return;
      this.preview = URL.createObjectURL(file);
    },
    async save() {
      if (this.busy || this.blockedSave) return;
      this.error = productError(this.form) || imageError(this.file);
      if (this.error) return;
      this.busy = true;
      const creating = !this.editId;
      const data = {
        name: this.form.name.trim(),
        description: this.form.description.trim(),
        price: Number(this.form.price),
        stock: Number(this.form.stock),
      };
      try {
        const product = this.editId
          ? await shopApi.updateProduct(this.editId, data)
          : await shopApi.createProduct(data);
        if (!this.alive) return;
        this.editId = product._id;
        this.snapshot = product;
        if (this.file) {
          try {
            await shopApi.uploadImage(product._id, this.file);
          } catch (error) {
            if (!this.alive) return;
            this.savedDetails = true;
            this.error = `บันทึกสินค้าแล้ว แต่อัปโหลดรูปไม่สำเร็จ: ${shopError(
              error
            )}`;
            this.$emit("refresh");
            return;
          }
        }
        if (!this.alive) return;
        this.$emit("notice", "บันทึกสินค้าเรียบร้อยแล้ว");
        this.dialog = "";
        this.clearFile();
        this.$emit("refresh");
      } catch (error) {
        if (!this.alive) return;
        this.error = shopError(error);
        if (creating && (!error.response || error.response.status >= 500)) {
          this.blockedSave = true;
          this.error += " กรุณาตรวจรายการสินค้าก่อนเพิ่มซ้ำ";
        }
      } finally {
        if (this.alive) this.busy = false;
      }
    },
    async sell() {
      if (this.busy || this.disabled || this.uncertain || !this.selected)
        return;
      this.error = orderError(this.quantity, this.selected.stock, this.note);
      if (this.error) return;
      this.busy = true;
      try {
        const order = await shopApi.sell(this.selected._id, {
          quantity: Number(this.quantity),
          note: this.note.trim(),
        });
        if (!this.alive) return;
        this.$emit(
          "notice",
          `บันทึกยอดขาย ${money(order.total)} เรียบร้อยแล้ว`
        );
        this.dialog = "";
        this.$emit("refresh");
      } catch (error) {
        if (!this.alive) return;
        this.error = shopError(error);
        if (!error.response || error.response.status >= 500)
          this.uncertain = true;
        if (error.response && error.response.status === 409) {
          this.error =
            "สต็อกไม่เพียงพอ กำลังโหลดสต็อกล่าสุด กรุณาตรวจจำนวนอีกครั้ง";
          this.$emit("refresh");
        }
        if (error.response && error.response.status === 404)
          this.$emit("refresh");
      } finally {
        if (this.alive) this.busy = false;
      }
    },
    inspectOrders() {
      this.close();
      this.$emit("inspect-orders");
      this.$emit("refresh");
    },
    async performRemoval() {
      if (this.busy || !this.selected) return;
      this.busy = true;
      this.error = "";
      const hiding = this.dialog === "hide";
      try {
        if (hiding) await shopApi.hideProduct(this.selected._id);
        else await shopApi.deleteImage(this.selected._id);
        if (!this.alive) return;
        this.dialog = "";
        this.$emit(
          "notice",
          hiding ? "ซ่อนสินค้าแล้ว ประวัติยอดขายยังอยู่" : "ลบรูปสินค้าแล้ว"
        );
        this.$emit("refresh");
      } catch (error) {
        if (this.alive) this.error = shopError(error);
      } finally {
        if (this.alive) this.busy = false;
      }
    },
  },
};
</script>
