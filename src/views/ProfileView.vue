<template>
  <div class="page-content">
    <page-heading number="1" category="A LITTLE ABOUT ME" title="ยินดีที่ได้รู้จัก"
      description="" />
    <div class="profile-grid">
      <v-card class="identity-card surface-card" outlined>
        <div class="identity-cover"><span>HELLO, THAT’S ME!</span></div>
        <div class="identity-body">
          <div class="profile-avatar">
            <img src="@/assets/494cbf1d-e341-4af9-a5cc-11b3578ae019.jpg" alt="รูปโปรไฟล์" width="1086" height="1448" />
          </div>
          <span class="mini-label">MY PROFILE</span>
          <h2 class="profile-name">{{ profile.fullName || 'ยังไม่ได้ระบุชื่อ' }}</h2>
          <p class="nickname">ชื่อเล่น: <strong>{{ profile.nickname || 'ยังไม่ได้ระบุ' }}</strong></p>
          <div class="profile-divider" />
          <dl class="education-list">
            <div><dt><v-icon size="19" color="primary">mdi-school-outline</v-icon> มหาวิทยาลัย</dt><dd>{{ profile.university || 'ยังไม่ได้ระบุ' }}</dd></div>
            <div><dt><v-icon size="19" color="primary">mdi-domain</v-icon> คณะ</dt><dd>{{ profile.faculty || 'ยังไม่ได้ระบุ' }}</dd></div>
            <div><dt><v-icon size="19" color="primary">mdi-book-open-page-variant-outline</v-icon> สาขาที่เรียน</dt><dd>{{ profile.major || 'ยังไม่ได้ระบุ' }}</dd></div>
          </dl>
        </div>
      </v-card>
      <div class="interest-grid">
        <profile-card v-for="section in sections" :key="section.key" :title="section.title"
          :icon="section.icon" :tone="section.tone" :items="profile[section.key]" />
        <profile-card title="เรื่องอื่น ๆ" icon="mdi-chat-outline" tone="soft-blue"
          :items="profile.additionalInfo ? [profile.additionalInfo] : []" />
      </div>
    </div>
  </div>
</template>

<script>
import PageHeading from '@/components/layout/PageHeading.vue'
import ProfileCard from '@/components/workshop-one/ProfileCard.vue'
import profile from '@/data/profile'

export default {
  name: 'ProfileView',
  components: { PageHeading, ProfileCard },
  data: () => ({
    profile,
    sections: [
      { key: 'hobbies', title: 'เวลาว่างทำอะไร', icon: 'mdi-palette-outline', tone: 'soft-blue' },
      { key: 'likes', title: 'สิ่งที่ชอบ', icon: 'mdi-heart-outline', tone: 'soft-pink' },
      { key: 'dislikes', title: 'สิ่งที่ไม่ชอบ', icon: 'mdi-emoticon-neutral-outline', tone: 'soft-sand' },
      { key: 'strengths', title: 'จุดแข็งของฉัน', icon: 'mdi-star-outline', tone: 'soft-sand' },
      { key: 'favoriteTeams', title: 'ทีมกีฬาในดวงใจ', icon: 'mdi-trophy-outline', tone: 'soft-mint' }
    ]
  })
}
</script>
<style scoped>
.profile-grid { display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.65fr); gap: 23px; align-items: stretch; }
.identity-card { overflow: hidden; }
.identity-cover { height: 104px; background: linear-gradient(115deg, #d6efff, #eaf9ff); display: flex; justify-content: space-between; padding: 22px 26px; color: #397593; font-size: 10px; letter-spacing: 1.5px; font-weight: 700; }
.identity-cover > span:last-child { font-size: 33px; margin-top: -8px; }
.identity-body { padding: 0 28px 25px; }
.profile-avatar { position: relative; margin: -37px 0 18px; border: 6px solid white; width: 84px; height: 84px; border-radius: 25px; background: #e4f5ff; overflow: hidden; }
.profile-avatar img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }
.profile-name { font-size: 25px; line-height: 1.6; margin: 7px 0 3px; overflow-wrap: anywhere; }
.nickname { color: #617c8d; font-size: 13px; overflow-wrap: anywhere; }
.nickname strong { color: #15384e; font-weight: 500; margin-left: 4px; }
.profile-divider { border-top: 1px solid #deedf5; margin: 23px 0; }
.education-list > div + div { margin-top: 21px; }
.education-list dt { color: #617c8d; font-size: 12px; display: flex; gap: 9px; align-items: center; }
.education-list dd { font-size: 14px; margin: 7px 0 0 28px; overflow-wrap: anywhere; }
@media (max-width: 959px) {
  .profile-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
