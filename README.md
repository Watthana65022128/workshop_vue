# Skyroom — My Workshop

เว็บไซต์ Workshop ภาษาไทย โทนฟ้าขาว ใช้ Vue 2, Vue CLI 5, Vuetify 2 และ Vue Router 3

## เริ่มต้น

ติดตั้ง Node.js/npm และตรวจว่า terminal เรียก `node -v` และ `npm -v` ได้ จากนั้น:

```sh
npm install
npm run serve
```

เปิด Local URL ที่ terminal แสดง หาก PowerShell ไม่อนุญาตให้เรียก npm.ps1 ให้ใช้ `npm.cmd run serve`

## หน้าเว็บไซต์

| เส้นทาง | รายละเอียด |
| --- | --- |
| `/` | Workshop 1 แนะนำตัว |
| `/workshop-2` | Workshop 2 คำนวณเกรด |
| `/workshop-3` | Watthana Shop — ระบบหลังร้านขายเสื้อฟุตบอล |
| เส้นทางอื่น | 404 พร้อมปุ่มกลับหน้าแรก |

## แก้ไขข้อมูลโปรไฟล์

แก้ `src/data/profile.js` ข้อความใช้ string รายการหลายข้อใช้ array เช่น:

```js
fullName: 'ชื่อ นามสกุล',
nickname: 'ชื่อเล่น',
university: 'มหาวิทยาลัย',
faculty: 'คณะ',
major: 'สาขา',
hobbies: ['อ่านหนังสือ', 'ถ่ายภาพ'],
likes: ['ดนตรี'],
dislikes: [],
strengths: ['การทำงานเป็นทีม'],
favoriteTeams: ['ทีมที่ชอบ'],
additionalInfo: 'เรื่องราวเพิ่มเติม'
```

ข้อมูลโปรไฟล์ที่เว้นว่างจะแสดง “ยังไม่ได้ระบุ” ส่วนโปรไฟล์ไม่มีฟอร์มบันทึกหรือการเรียก API

## เกณฑ์เกรด

รับเลขฐานสิบ 0–100 รวมทศนิยม ใช้จุด เช่น `79.5` ไม่ปัดเศษก่อนคำนวณ

| เกรด | คะแนน |
| --- | --- |
| A | 80–100 |
| B | ตั้งแต่ 70 แต่น้อยกว่า 80 |
| C | ตั้งแต่ 60 แต่น้อยกว่า 70 |
| D | ตั้งแต่ 50 แต่น้อยกว่า 60 |
| F | ตั้งแต่ 0 แต่น้อยกว่า 50 |

กด Enter หรือปุ่มคำนวณเพื่อดูผล เมื่อแก้คะแนนจะซ่อนผลเดิม ปุ่มล้างค่าคืน focus ที่ช่องกรอก
ข้อความว่าง ตัวอักษร comma, scientific notation, hexadecimal และคะแนนนอกช่วงจะแจ้งเตือนใต้ช่อง

## Workshop 3 — Watthana Shop

ระบบหลังร้านโทนกรมท่า–เขียวสนาม อ้างอิง OpenAPI ที่ `http://localhost:3000/openapi.json` และหน้าเอกสาร `http://localhost:3000/api-docs`

- สมัครร้านและล็อกอินด้วยอีเมล/รหัสผ่าน ร้านใหม่เป็น `pending` ต้องให้แอดมินอนุมัติ แล้วเข้าสู่ระบบอีกครั้ง
- ร้านที่อนุมัติแล้วดูภาพรวมสินค้า สต็อก และยอดขาย เพิ่ม/แก้ไข/ซ่อนสินค้า จัดการรูป และดูรายละเอียดพร้อมประวัติการขายรายสินค้าได้
- แยกสินค้าแต่ละไซซ์เป็นคนละรายการ เช่น `Barcelona Home 2025/26 — M` ใช้ชื่อ รายละเอียด ราคา และสต็อกตาม schema เดิม
- รูป JPEG/PNG/WebP ไม่เกิน 5 MB สร้างสินค้าก่อนอัปโหลดรูปแยก หากรูปอัปโหลดไม่สำเร็จจะเก็บ ID สินค้าไว้เพื่อลองใหม่โดยไม่สร้างรายการซ้ำ
- รูปสินค้าถูกโหลดเป็น Blob พร้อม Bearer token และคืน object URL เมื่อเลิกใช้งาน
- บันทึกขายครั้งละหนึ่งสินค้า ระบุจำนวน/หมายเหตุ ระบบใช้ยอดรวมจาก backend แล้วโหลดสต็อกและออร์เดอร์ใหม่ ไม่มีตะกร้า ชำระเงิน หรือจัดส่ง
- หากบันทึกขาย timeout หรือพบข้อผิดพลาดฝั่งเซิร์ฟเวอร์ จะแนะนำให้ตรวจประวัติก่อนลองใหม่ ไม่ส่งคำสั่งซ้ำอัตโนมัติ
- แอดมินใช้หน้าล็อกอินเดียวกัน เพื่อดูและอนุมัติร้านที่รอ ไม่เปิดหน้าจัดการสินค้าร้านอื่น
- เก็บ token/account ใน `sessionStorage` ของแท็บนั้น ไม่เก็บรหัสผ่าน เมื่อได้รับ 401 จากคำขอที่ใช้ token ปัจจุบันจะล้าง session

เริ่ม backend ที่พอร์ต 3000 แล้วเปิด frontend ด้วย `npm run serve` ค่า `VUE_APP_API_BASE_URL=/api` จะเรียกผ่าน dev proxy ไป backend โดยไม่ต้องตั้ง CORS สำหรับการพัฒนาบนเครื่อง หากมี dev server เดิมเปิดอยู่ **ต้องหยุดแล้วเปิดใหม่** เพื่อให้ proxy ใน `vue.config.js` มีผล

การบันทึกยอดขายต้องใช้ MongoDB replica set ตามข้อกำหนด backend ข้อมูลบนหน้าจอมาจาก API จริง ไม่มีการ seed สินค้าหรือฝังบัญชีทดสอบอัตโนมัติ

## โครงสร้าง

- `src/views/`: หน้าแต่ละ workshop และ 404
- `src/layouts/` และ `src/components/layout/`: โครงหน้าร่วม เมนู และหัวข้อ
- `src/components/workshop-one/`: การ์ดข้อมูลแนะนำตัว
- `src/data/profile.js`: ข้อมูลส่วนตัว
- `src/utils/grade.js`: ตรวจคะแนนและคำนวณ แยกจาก UI
- `src/styles/main.scss`: theme และ style ร่วม
- `src/components/shop/`, `src/views/ShopView.vue`, `src/styles/shop.scss`: หน้าจอหลังร้านและสไตล์แยกจาก Workshop อื่น
- `src/services/shop.js`, `src/services/shop-session.js`: API และ session ของร้าน
- `src/utils/shop.js`, `tests/shop.test.js`: ตรวจข้อมูลและ regression tests ของหลังร้าน
- `workshop-website-plan.md`: แผนก่อน implement

ใช้ Vue 2 Options API, PascalCase, @/ imports, single quotes และไม่ใส่ semicolon ไม่ใช้ Vuex สำหรับ state เฉพาะหน้า
ใช้ Axios client เดิมกับ Workshop 3 ส่วน Vuex store เดิมยังไม่ได้ใช้งาน

## ตรวจสอบ

```sh
npm run lint:check
npm run test:shop
npm run build
```

ชุดทดสอบหลังร้านใช้ Node.js built-in test runner (Node 20.18+ หรือ 22+) และ Babel ที่มีอยู่ในโปรเจกต์ ทดสอบ service/component logic ด้วย API จำลอง ไม่สร้างข้อมูลบน backend จริง ครอบคลุม validation, auth, multipart/blob, การอัปโหลดล้มเหลวหลังสร้างสินค้า, คำขอซ้ำ, สต็อกไม่พอ, session, สิทธิ์แอดมิน และผลตอบกลับที่มาถึงผิดลำดับ

การตรวจ logic เกรดเฉพาะกิจเดิมผ่าน 27 กรณี: ขอบเกรด ทศนิยม ช่องว่าง ตัวอักษร รูปแบบตัวเลขที่ไม่รองรับ และคะแนนนอกช่วง
Lint ผ่าน และ build สำเร็จพร้อม warning ขนาด bundle และ default export ของ scoped CSS จาก vue-loader

ผลตรวจ Chrome เดิมของหน้าโปรไฟล์/เกรด/Coming Soon/404 อยู่ใน [chrome-qa.md](chrome-qa.md) ไม่ใช่ผลตรวจร้าน Watthana Shop รุ่นใหม่ สำหรับร้านใหม่ตรวจ build, logic tests, เส้นทาง HTML และ dev proxy แล้ว แต่เครื่องมือ Chrome หยุดเพราะยืนยัน URL ไม่ได้ จึงยังไม่ยืนยัน visual QA ที่ 360/768/1440px หรือ flow หลังล็อกอินกับบัญชีจริง
ตรวจจอแคบประมาณ 380 CSS pixels ด้วย Chrome zoom 400% แล้ว ยังไม่ใช่ mobile emulation และยังต้องตรวจขนาดแน่นอน 360/768/1440px รวมถึงข้อมูลโปรไฟล์ยาว/หลายข้อ หากสไตล์หาย ให้หยุดและเปิด dev server ใหม่: รอบ QA พบ server เดิมส่ง CSS ว่าง แต่ server ที่เปิดใหม่แสดงผลถูกต้อง

## Production

นำ `dist/` ไปวางบน static hosting ที่รองรับ history fallback ไป `index.html` สำหรับเส้นทางหน้าเว็บ
ตั้ง reverse proxy `/api` ไป backend บน production ด้วย (dev proxy ใช้ได้เฉพาะ `npm run serve`) หรือกำหนด `VUE_APP_API_BASE_URL` ก่อน build และเปิด CORS ฝั่ง backend ให้รองรับ origin จริง ไม่รวม `/v1` ใน base URL เพราะ API service เติมส่วนนี้ให้แล้ว
ฟอนต์ Google Fonts และไอคอน MDI โหลดจาก CDN จึงต้องใช้อินเทอร์เน็ตเพื่อแสดงผลเหมือนดีไซน์
แอปไม่ได้ลงทะเบียน service worker ในรุ่นนี้ หากเคยลงทะเบียนรุ่นเก่าบน origin เดียวกัน ให้ล้าง service worker/cache เก่าก่อนตรวจรุ่นใหม่
