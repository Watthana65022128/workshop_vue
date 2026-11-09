# Workshop

โปรเจกต์ Vue 2 + Vue CLI 5 + Vuetify 2 ใช้ JavaScript, Vue Router 3 และ Vuex 3

## เริ่มพัฒนา

ติดตั้ง Node.js ที่เข้ากับ Vue CLI 5 และ npm ให้เรียกจาก terminal ได้ ตรวจด้วย `node -v` และ `npm -v` ก่อนเริ่ม

```sh
npm install
```

คัดลอก `.env.example` เป็น `.env.local` (Windows Command Prompt):

```bat
copy .env.example .env.local
```

หากใช้ PowerShell:

```powershell
Copy-Item .env.example .env.local
```

จากนั้นเปิด dev server และใช้ URL ที่ terminal แจ้ง:

```sh
npm run serve
```

## คำสั่ง

| คำสั่ง | หน้าที่ |
| --- | --- |
| `npm run serve` | เปิด dev server พร้อม hot reload |
| `npm run lint:check` | ตรวจ ESLint โดยไม่แก้ไฟล์ |
| `npm run lint` | ตรวจและแก้ปัญหาที่ ESLint แก้อัตโนมัติได้ |
| `npm run build` | สร้างไฟล์ production ใน `dist/` |

## โครงสร้าง

```text
src/
  assets/                 รูปภาพและไฟล์ประกอบ
  components/
    common/               component ที่ใช้ซ้ำ เช่น CardImg
    layout/               ส่วนประกอบ layout เช่น AppToolbar
    HelloWorld.vue        เนื้อหาหน้าต้อนรับ
  layouts/                โครงหน้าที่ครอบ views
  views/                  หน้าจอที่ผูกกับ routes
  router/                 การสร้าง router และรายการ routes
  services/               HTTP client และ API services
  config/                 ค่า configuration จาก environment
  store/                  Vuex สำหรับข้อมูลที่แชร์ข้ามหน้า
  styles/                 style ส่วนกลาง
  plugins/                การตั้งค่า plugin เช่น Vuetify
  App.vue                 root component
  main.js                 จุดเริ่มต้นแอป
  registerServiceWorker.js การลงทะเบียน PWA ใน production
```

ใช้ `@/` แทน `src/` ใน import ตั้งชื่อ component และไฟล์ Vue เป็น PascalCase และเก็บ CSS เฉพาะ component ใน `<style scoped>` ส่วน style ที่ใช้ร่วมกันอยู่ใน `styles/main.scss`

## หน้าเว็บและ layout

| เส้นทาง | หน้า | Toolbar |
| --- | --- | --- |
| `/` | WelcomeView แสดง HelloWorld | มี |
| `/home` | HomeView แสดงรูปใน CardImg | ไม่มี |
| `/about` | AboutView | ไม่มี |
| เส้นทางอื่น | NotFoundView พร้อมปุ่มกลับหน้าหลัก | ไม่มี |

เพิ่มหน้าใหม่โดยสร้างไฟล์ใน `views/` แล้วลงทะเบียนใน `router/routes.js` ก่อน route `*` หากต้องการ toolbar ให้เพิ่ม `meta: { showToolbar: true }` ใน route นั้น

`DefaultLayout` เป็นผู้แสดง toolbar และพื้นที่ `<v-main>` ส่วน `App.vue` เป็นจุดครอบแอปด้วย `<v-app>`

## เพิ่ม component

สร้าง component ที่ใช้ซ้ำใน `components/common/` แล้ว import เฉพาะหน้าที่ใช้งาน เช่น:

```vue
<template>
  <card-img :src="imageUrl" alt="คำอธิบายรูป" />
</template>

<script>
import CardImg from '@/components/common/CardImg.vue'

export default {
  name: 'ExampleView',
  components: { CardImg },
  data: () => ({ imageUrl: '' })
}
</script>
```

`CardImg` รับ props `src` และ `alt` เป็น string หาก `src` ว่างจะแสดง placeholder ส่วนรูปใน `/home` เปลี่ยนได้ที่ import ใน `HomeView.vue`

## การต่อ API

ตั้งค่าใน `.env.local`:

```dotenv
VUE_APP_API_BASE_URL=https://api.example.com
```

เมื่อแก้ env ต้องเริ่ม dev server ใหม่ ค่าเริ่มต้น `/api` จะเรียกไปยัง origin เดียวกับหน้าเว็บ โปรเจกต์ยังไม่ได้ตั้ง dev proxy หาก API อยู่คนละ origin ให้ตั้ง URL จริงและให้ backend รองรับ CORS

ค่าที่ขึ้นต้นด้วย `VUE_APP_` จะถูกรวมใน frontend bundle จึงไม่ใช้เก็บ secret ส่วน `.env.local` ถูก ignore โดย Git แล้ว

`services/http.js` export Axios instance กลาง ตั้ง timeout 10 วินาที ไม่แก้รูปแบบ response/error และไม่ส่ง request เมื่อ import

เพิ่ม service ตามระบบจริง เช่น `services/products.js`:

```js
import http from '@/services/http'

export function getProducts() {
  return http.get('/products')
}
```

ตัวอย่างนี้เป็นแนวทาง ต้องปรับ endpoint ให้ตรง backend ของคุณ ใน view ใช้ `async/await` พร้อม `try/catch/finally` เพื่อจัดการข้อมูล, error และ loading โดยข้อมูลที่ API ส่งกลับอยู่ใน `response.data`

ใช้ Axios โดย import client โดยตรง ไม่ต้องลงทะเบียน vue-axios เพิ่ม ยังไม่มีการตั้ง token, cookie authentication หรือ interceptor ส่วน Vuex คงไว้สำหรับ state ที่ต้องแชร์จริงในอนาคต

## ตรวจงานก่อนส่ง

รัน lint และ build แล้วตรวจหน้าจอ:

- `/` แสดง HelloWorld และ toolbar
- `/home` แสดงรูปเดิม โดยไม่มี toolbar
- `/about` ไม่มี toolbar
- URL ที่ไม่มีอยู่แสดง 404 และปุ่มกลับไป `/` ทำงาน
- CardImg แสดง placeholder เมื่อ `src` ว่าง และแสดงรูปเมื่อมี `src`
- เปิดหน้าเว็บแล้วไม่มี request ไป `/api` โดยอัตโนมัติ

## Production

นำ `dist/` ไปวางบน static web server เนื่องจาก router ใช้ history mode ต้องตั้ง server ให้ส่ง `index.html` กลับสำหรับ URL ของ frontend เช่น `/home` และ `/about` โดยไม่ rewrite เส้นทาง API หรือไฟล์ static ที่มีอยู่

Service worker ลงทะเบียนเฉพาะ production หากเห็นหน้าเก่าหลัง deploy ให้ตรวจ cache และ service worker ใน browser ด้วย
