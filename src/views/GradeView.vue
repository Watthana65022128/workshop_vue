<template>
  <div class="page-content">
    <page-heading
      number="2"
      category="LET’S DO THE MATH"
      title="คะแนนนี้ ได้เกรดอะไร"
      description="ใส่คะแนน แล้วมาดูผลลัพธ์ไปด้วยกัน"
    />
    <div class="grade-grid">
      <v-card class="score-card surface-card" outlined>
        <div class="card-topline">
          <span class="icon-tile"
            ><v-icon color="primary">mdi-pencil-outline</v-icon></span
          ><span class="mini-label">YOUR SCORE</span>
        </div>
        <p class="muted-text">รองรับทั้งจำนวนเต็มและทศนิยม ตั้งแต่ 0 ถึง 100</p>
        <form novalidate @submit.prevent="calculate">
          <label for="score-input" class="score-label"
            >คะแนนที่ได้ <span class="muted-text">(เต็ม 100 คะแนน)</span></label
          >
          <v-text-field
            id="score-input"
            ref="scoreInput"
            v-model="score"
            type="text"
            inputmode="decimal"
            placeholder="เช่น 79.5"
            outlined
            color="primary"
            suffix="/ 100"
            :error-messages="error"
            :aria-invalid="error ? 'true' : 'false'"
            aria-describedby="score-help"
            @input="clearFeedback"
          />
          <p id="score-help" class="input-hint">
            กรอกเป็นตัวเลข ใช้จุด (.) สำหรับคะแนนทศนิยม
          </p>
          <div class="form-actions">
            <v-btn type="submit" color="primary" depressed large
              ><v-icon left size="20">mdi-calculator-variant-outline</v-icon
              >คำนวณเกรด</v-btn
            >
            <v-btn
              type="button"
              outlined
              large
              class="reset-button"
              @click="reset"
              >ล้างค่า</v-btn
            >
          </div>
        </form>
        <div
          class="result-region"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div v-if="result" class="grade-result">
            <div>
              <span class="mini-label">YOUR RESULT</span>
              <h3>คะแนน {{ result.score }} ได้เกรด</h3>
              <p>คำนวณตามคะแนนจริง โดยไม่ปัดเศษ</p>
            </div>
            <strong class="result-letter">{{ result.grade }}</strong>
          </div>
          <div v-else class="result-placeholder">
            <v-icon color="primary" size="27">mdi-sparkles</v-icon>
            <p>
              เกรดของคุณจะแสดงที่นี่<br /><span>เมื่อกรอกคะแนนแล้วกดคำนวณ</span>
            </p>
          </div>
        </div>
      </v-card>
      <aside>
        <v-card class="criteria-card surface-card" outlined>
          <span class="mini-label">THE GRADING SCALE</span>
          <h2>เกณฑ์การตัดเกรด</h2>
          <p class="muted-text">เช็กช่วงคะแนนได้ที่นี่เลย</p>
          <table class="grade-table">
            <caption class="sr-only">
              ช่วงคะแนนสำหรับเกรด A ถึง F
            </caption>
            <thead>
              <tr>
                <th scope="col">เกรด</th>
                <th scope="col">ช่วงคะแนน</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="range in ranges"
                :key="range.grade"
                :class="{
                  'selected-grade': result && result.grade === range.grade,
                }"
              >
                <th scope="row">
                  <span class="grade-badge">{{ range.grade }}</span>
                </th>
                <td>{{ range.label }}</td>
              </tr>
            </tbody>
          </table>
          <p class="criteria-note">
            <v-icon size="18" color="primary">mdi-information-outline</v-icon>
            เช่น 79.5 คะแนน จะได้เกรด B
          </p>
        </v-card>
      </aside>
    </div>
  </div>
</template>

<script>
import PageHeading from "@/components/layout/PageHeading.vue";
import { evaluateScore, gradeRanges } from "@/utils/grade";

export default {
  name: "GradeView",
  components: { PageHeading },
  data: () => ({ score: "", error: "", result: null, ranges: gradeRanges }),
  methods: {
    clearFeedback() {
      this.error = "";
      this.result = null;
    },
    calculate() {
      const evaluation = evaluateScore(this.score);
      this.error = evaluation.error;
      this.result = evaluation.error ? null : evaluation;
    },
    reset() {
      this.score = "";
      this.clearFeedback();
      this.$nextTick(() => this.$refs.scoreInput.focus());
    },
  },
};
</script>
<style scoped>
.grade-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
  gap: 24px;
  align-items: stretch;
}
.grade-grid > aside {
  display: flex;
}
.score-card {
  padding: 31px;
}
.card-topline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 23px;
}
.step-tag {
  margin-left: auto;
  font-size: 10px;
  color: #617c8d;
}
.score-card h2,
.criteria-card h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 9px;
}
.score-card form {
  margin-top: 28px;
}
.score-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}
.score-label .muted-text {
  font-size: 11px;
  font-weight: 400;
  margin-left: 5px;
}
.score-card ::v-deep .v-text-field--outlined {
  border-radius: 12px;
}
.score-card ::v-deep .v-text-field input {
  font-size: 21px;
  font-family: inherit;
}
.score-card ::v-deep .v-text-field__suffix {
  font-size: 15px;
  color: #617c8d;
}
.input-hint {
  color: #617c8d;
  font-size: 11px;
  margin: -4px 0 23px !important;
}
.form-actions {
  display: flex;
  gap: 12px;
}
.form-actions > .v-btn:first-child {
  flex: 1;
}
.reset-button {
  color: #527486 !important;
  border-color: #d0e4f0 !important;
}
.result-region {
  margin-top: 28px;
}
.result-placeholder {
  min-height: 142px;
  border: 1px dashed #c9e2f0;
  border-radius: 14px;
  background: #f8fcff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
.result-placeholder p {
  margin: 0;
  color: #397593;
  font-size: 13px;
  line-height: 1.9;
}
.result-placeholder p span {
  color: #617c8d;
  font-size: 11px;
}
.grade-result {
  min-height: 142px;
  border-radius: 14px;
  padding: 23px;
  background: #eaf7ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
.grade-result h3 {
  font-size: 16px;
  margin: 7px 0;
  overflow-wrap: anywhere;
}
.grade-result p {
  color: #617c8d;
  font-size: 11px;
  margin: 0;
}
.result-letter {
  color: #0369a1;
  font-size: 65px;
  line-height: 1;
}
.criteria-card {
  flex: 1;
  min-width: 0;
  padding: 29px;
}
.criteria-card h2 {
  margin-top: 10px;
}
.grade-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 22px;
  text-align: left;
}
.grade-table thead {
  border-bottom: 1px solid #deedf5;
}
.grade-table thead th {
  color: #617c8d;
  font-size: 11px;
  font-weight: 400;
  padding: 0 10px 12px;
}
.grade-table tbody th,
.grade-table td {
  padding: 11px 10px;
  border-bottom: 1px solid #edf4f9;
  font-size: 13px;
}
.grade-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-grid;
  place-items: center;
  background: #edf7fd;
  color: #0369a1;
  font-size: 17px;
}
.selected-grade {
  background: #eaf7ff;
}
.selected-grade .grade-badge {
  background: #0369a1;
  color: white;
}
.criteria-note {
  display: flex;
  gap: 7px;
  align-items: flex-start;
  font-size: 11px;
  color: #617c8d;
  margin: 20px 0 0 !important;
}
@media (max-width: 959px) {
  .grade-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 599px) {
  .score-card,
  .criteria-card {
    padding: 23px;
  }
  .card-topline {
    gap: 8px;
  }
  .step-tag {
    font-size: 9px;
  }
  .card-topline .mini-label {
    font-size: 9px;
    letter-spacing: 1px;
  }
  .score-card h2 {
    font-size: 20px;
  }
  .grade-result {
    padding: 18px;
  }
  .grade-result h3 {
    font-size: 14px;
  }
  .result-letter {
    font-size: 50px;
  }
}
</style>
