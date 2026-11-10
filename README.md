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
| `/workshop-3` | Workshop 3 รอโจทย์ ยังไม่มีฟังก์ชันเพิ่มเติม |
| เส้นทางอื่น | 404 พร้อมปุ่มกลับหน้าแรก |

## แก้ไขข้อมูลโปรไฟล์

แก้ `src/data/profile.js` ข้อความใช้ string รายการหลายข้อใช้ array เช่น:

```js
fullName: 'ชื่อ นามสกุล',
nickname: 'ชื่อเล่น',
university: 'มหาวิทยาลัย',
major: 'สาขา',
hobbies: ['อ่านหนังสือ', 'ถ่ายภาพ'],
likes: ['ดนตรี'],
dislikes: [],
strengths: ['การทำงานเป็นทีม'],
favoriteTeams: ['ทีมที่ชอบ'],
additionalInfo: 'เรื่องราวเพิ่มเติม'
```

ข้อมูลเริ่มต้นเป็นค่าว่างและแสดง “ยังไม่ได้ระบุ” ไม่มีฟอร์มบันทึก ไม่มี backend หรือการเรียก API อัตโนมัติ

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

## โครงสร้าง

- `src/views/`: หน้าแต่ละ workshop และ 404
- `src/layouts/` และ `src/components/layout/`: โครงหน้าร่วม เมนู และหัวข้อ
- `src/components/workshop-one/`: การ์ดข้อมูลแนะนำตัว
- `src/data/profile.js`: ข้อมูลส่วนตัว
- `src/utils/grade.js`: ตรวจคะแนนและคำนวณ แยกจาก UI
- `src/styles/main.scss`: theme และ style ร่วม
- `workshop-website-plan.md`: แผนก่อน implement

ใช้ Vue 2 Options API, PascalCase, @/ imports, single quotes และไม่ใส่ semicolon ไม่ใช้ Vuex สำหรับ state เฉพาะหน้า
ไฟล์ API/store เดิมยังเก็บไว้ แต่แอป Workshop ไม่ได้ใช้งาน

## ตรวจสอบ

```sh
npm run lint:check
npm run build
```

ไม่มี test runner ใน repository การตรวจ logic เฉพาะกิจผ่าน 27 กรณี: ขอบเกรด ทศนิยม ช่องว่าง ตัวอักษร รูปแบบตัวเลขที่ไม่รองรับ และคะแนนนอกช่วง
Lint ผ่าน และ build สำเร็จพร้อม warning ขนาด bundle และ default export ของ scoped CSS จาก vue-loader

ตรวจ Google Chrome แล้ว: หน้า desktop, เกรด A–F และทศนิยม, validation, Enter/ล้างค่า/focus, การซ่อนผลเดิม, Back/Forward, Workshop 3 และ 404 รายละเอียดอยู่ใน [chrome-qa.md](chrome-qa.md)
ตรวจจอแคบประมาณ 380 CSS pixels ด้วย Chrome zoom 400% แล้ว ยังไม่ใช่ mobile emulation และยังต้องตรวจขนาดแน่นอน 360/768/1440px รวมถึงข้อมูลโปรไฟล์ยาว/หลายข้อ หากสไตล์หาย ให้หยุดและเปิด dev server ใหม่: รอบ QA พบ server เดิมส่ง CSS ว่าง แต่ server ที่เปิดใหม่แสดงผลถูกต้อง

## Production

นำ `dist/` ไปวางบน static hosting ที่รองรับ history fallback ไป `index.html` สำหรับเส้นทางหน้าเว็บ
ฟอนต์ Google Fonts และไอคอน MDI โหลดจาก CDN จึงต้องใช้อินเทอร์เน็ตเพื่อแสดงผลเหมือนดีไซน์
แอปไม่ได้ลงทะเบียน service worker ในรุ่นนี้ หากเคยลงทะเบียนรุ่นเก่าบน origin เดียวกัน ให้ล้าง service worker/cache เก่าก่อนตรวจรุ่นใหม่
