export const money = (value) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(
    value
  );
export const dateTime = (value) =>
  new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export function credentialsError(email, password) {
  if (
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  )
    return "กรุณากรอกอีเมลให้ถูกต้อง";
  if (password.length < 8 || new TextEncoder().encode(password).length > 72)
    return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร และไม่เกิน 72 bytes";
  return "";
}

export function productError(form) {
  if (form.name.trim().length < 2 || form.name.trim().length > 120)
    return "ชื่อสินค้าต้องมี 2–120 ตัวอักษร";
  if (form.description.trim().length > 1000)
    return "รายละเอียดต้องไม่เกิน 1,000 ตัวอักษร";
  if (
    String(form.price).trim() === "" ||
    !Number.isFinite(Number(form.price)) ||
    Number(form.price) < 0
  )
    return "กรุณาระบุราคาตั้งแต่ 0 บาทขึ้นไป";
  if (
    !/^\d+$/.test(String(form.stock)) ||
    !Number.isSafeInteger(Number(form.stock))
  )
    return "สต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0 และไม่เกินค่าที่ระบบรองรับ";
  return "";
}

export function imageError(file) {
  if (!file) return "";
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "รองรับรูป JPEG, PNG และ WebP เท่านั้น";
  if (file.size < 1 || file.size > 5242880)
    return "รูปต้องมีขนาดมากกว่า 0 และไม่เกิน 5 MB";
  return "";
}

export function orderError(quantity, stock, note) {
  if (
    !/^\d+$/.test(String(quantity)) ||
    !Number.isSafeInteger(Number(quantity)) ||
    Number(quantity) < 1
  )
    return "จำนวนขายต้องเป็นจำนวนเต็มอย่างน้อย 1 ตัว";
  if (Number(quantity) > stock) return "จำนวนขายเกินสต็อกที่มีอยู่";
  if (note.trim().length > 500) return "หมายเหตุต้องไม่เกิน 500 ตัวอักษร";
  return "";
}
