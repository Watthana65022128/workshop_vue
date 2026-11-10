export const gradeRanges = [
  { grade: 'A', minimum: 80, label: '80 – 100' },
  { grade: 'B', minimum: 70, label: '70 – น้อยกว่า 80' },
  { grade: 'C', minimum: 60, label: '60 – น้อยกว่า 70' },
  { grade: 'D', minimum: 50, label: '50 – น้อยกว่า 60' },
  { grade: 'F', minimum: 0, label: '0 – น้อยกว่า 50' }
]

// ตรวจทั้งข้อความก่อนแปลงค่า เพื่อไม่ให้ 80abc, 1e2 หรือ 0x50 ผ่าน
export function evaluateScore(rawScore) {
  const input = String(rawScore == null ? '' : rawScore).trim()
  if (!input) return { error: 'กรุณากรอกคะแนน' }
  if (!/^-?\d+(\.\d+)?$/.test(input)) {
    return { error: 'กรุณากรอกคะแนนเป็นตัวเลข' }
  }

  const score = Number(input)
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return { error: 'คะแนนต้องอยู่ระหว่าง 0–100' }
  }

  // ใช้ส่วนจำนวนเต็มตัดเกรด ป้องกัน floating point ปัด 79.999… ขึ้นเป็น 80
  const integerPart = Number(input.split('.')[0])
  const fraction = input.split('.')[1] || ''
  if ((input.startsWith('-') && /[1-9]/.test(input)) ||
      (integerPart === 100 && /[1-9]/.test(fraction))) {
    return { error: 'คะแนนต้องอยู่ระหว่าง 0–100' }
  }

  return {
    score: input,
    grade: gradeRanges.find(range => integerPart >= range.minimum).grade,
    error: ''
  }
}