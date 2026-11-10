<template>
  <section class="page-heading">
    <div>
      <p class="eyebrow">WORKSHOP {{ number }} <span aria-hidden="true">/</span> {{ category }}</p>
      <h1>{{ title }}<span class="heading-dot">.</span></h1>
      <p class="page-description">{{ description }}</p>
    </div>
    <div class="heading-art" aria-hidden="true">
      <span class="art-orbit" />
      <span class="art-disc"><v-icon size="38" color="primary">{{ icon }}</v-icon></span>
      <span class="art-number">{{ number }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PageHeading',
  props: {
    number: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'mdi-weather-sunny' }
  }
}
</script>