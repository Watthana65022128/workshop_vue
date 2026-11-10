<template>
  <div class="workshop-shell">
    <header class="site-header page-width">
      <router-link to="/" class="brand" aria-label="Skyroom กลับหน้าแนะนำตัว">
        <span class="brand-mark" aria-hidden="true"><v-icon color="white">mdi-weather-partly-cloudy</v-icon></span>
        <span>skyroom<span class="brand-dot">.</span></span>
      </router-link>
      <span class="header-tag"><span aria-hidden="true" /> MY WORKSHOP</span>
    </header>
    <main id="main-content" class="page-width">
      <nav class="workshop-nav" aria-label="เลือก Workshop">
        <router-link v-for="workshop in workshops" :key="workshop.name"
          :to="{ name: workshop.name }" class="workshop-link" exact active-class="is-active">
          <span class="nav-number">{{ workshop.number }}</span>
          <span>{{ workshop.label }}</span>
          <span v-if="workshop.name === 'upcoming'" class="nav-soon">เร็ว ๆ นี้</span>
        </router-link>
      </nav>
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data: () => ({
    workshops: [
      { name: 'profile', label: 'แนะนำตัว' },
      { name: 'grade', label: 'ตัดเกรด' },
      { name: 'upcoming', label: 'Workshop 3' }
    ]
  })
}
</script>