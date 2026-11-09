<template>
  <v-container class="py-8">
    <card-img :src="imageUrl" alt="นักฟุตบอลนอนอยู่บนสนามหญ้า" />
  </v-container>
</template>

<script>
  import CardImg from '../components/cardImg.vue'
  import homeImage from '../assets/gettyimages-2264072918-612x612.jpg'

  export default {
    name: 'Home',

    components: {
      CardImg,
    },

    data: () => ({
      imageUrl: homeImage,
    }),
  }
</script>
