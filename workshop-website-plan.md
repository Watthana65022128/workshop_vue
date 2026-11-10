# แผนพัฒนาเว็บไซต์ Workshop โทนฟ้าขาว

## เป้าหมายและเทคโนโลยี

- Vue 2, Vuetify 2, Vue Router 3, JavaScript และ Vue CLI เดิม
- ทำใน repository เดิม เก็บ .git ไม่เพิ่ม dependency ไม่มี backend/login/database
- Options API, PascalCase, @/ imports, สองช่อง, single quotes และไม่ใส่ semicolon

## หน้าตาและโครงสร้าง

- พื้น #F0F9FF การ์ดขาว สีหลัก #0284C7 ข้อความเข้ม การ์ดมุมโค้ง ขอบบาง เงาเบา
- เนื้อหากว้างไม่เกิน 1,100px มือถือหนึ่งคอลัมน์ desktop สองคอลัมน์ตามเนื้อหา
- เมนูสลับ Workshop มีสถานะหน้าปัจจุบัน รองรับคีย์บอร์ด label และข้อความประกอบสี
- views เก็บหน้าตาม route; components/layout เก็บส่วนร่วม; components/workshop-one เก็บการ์ด
- src/data/profile.js เก็บข้อมูล; src/utils/grade.js แยก validation และคำนวณจาก UI
- อ้างอิง https://v2.vuetifyjs.com/en/components/cards/

## หน้าและเส้นทาง

| URL         | หน้า                 |
| ----------- | -------------------- |
| /           | Workshop 1 แนะนำตัว  |
| /workshop-2 | Workshop 2 ตัดเกรด   |
| /workshop-3 | Workshop 3 รอโจทย์   |
| URL อื่น    | 404 พร้อมกลับหน้าแรก |

### Workshop 1

- ชื่อ–นามสกุล ชื่อเล่น มหาวิทยาลัย สาขา งานอดิเรก สิ่งที่ชอบ/ไม่ชอบ จุดแข็ง ทีมกีฬา และข้อมูลเพิ่มเติม
- string และ array เริ่มค่าว่าง แสดง “ยังไม่ได้ระบุ” ไม่แต่งข้อมูลส่วนตัว
- ไม่มีฟอร์มแก้ไขหรือ persistence รองรับข้อความยาวและรายการหลายข้อ

### Workshop 2

- textfield รับข้อความดิบ ปุ่มคำนวณ ปุ่มล้างค่า ตารางเกณฑ์ ผลลัพธ์ใต้ฟอร์ม
- รองรับทศนิยม ไม่ปัดคะแนน: A [80,100], B [70,80), C [60,70), D [50,60), F [0,50)
- trim ก่อนตรวจ รับเลขฐานสิบและจุดทศนิยม ไม่รับ comma, scientific notation, hexadecimal
- ว่าง: “กรุณากรอกคะแนน”; รูปแบบผิด: “กรุณากรอกคะแนนเป็นตัวเลข”; นอกช่วง: “คะแนนต้องอยู่ระหว่าง 0–100”
- Enter คำนวณได้ error อยู่ใต้ช่อง ไม่แสดงเกรดเมื่อผิด แก้คะแนนแล้วซ่อนผลเดิม
- ล้างค่าลบคะแนน ผล และ error พร้อมคืน focus

### Workshop 3

- หน้า “รอโจทย์ Workshop 3” พร้อมเมนูไปหน้าอื่น ไม่มี logic เพิ่ม

## ขั้นตอน implement

1. จัด layout, theme, routes, 404 ให้ dev server เปิดและสลับหน้าได้
2. ทำโปรไฟล์และการ์ด ตรวจว่าง/ยาว/หลายข้อและ responsive
3. ทำ validation และคำนวณแยกจาก UI เชื่อม form/error/result
4. เพิ่มหน้ารอโจทย์ ปรับ README ตรวจ lint/build/browser

## เกณฑ์ตรวจรับ

- npm run serve ไม่มี compile error; npm run lint:check และ npm run build ผ่าน
- เปิด URL ตรง Back/Forward และ 404 ทำงาน
- 360, 768, 1440px ไม่ล้นแนวนอน โปรไฟล์รองรับว่าง/ยาว/หลายข้อ
- คะแนน: 0,49.99,50,59.99,60,69.99,70,79.99,80,100
- input ผิด: ว่าง,ช่องว่างล้วน,abc,80abc,-1,100.01,1e2,0x50,79,5
- ตรวจ Enter ล้างค่า แก้หลังได้ผล และกรอกผิดหลังได้ผล
- ไม่มี runtime error หรือ API อัตโนมัติ ไม่มี test runner เดิม รายงานเฉพาะการตรวจจริง
- production hosting ต้อง history fallback ไป index.html
