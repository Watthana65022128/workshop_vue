import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0369A1',
        secondary: '#075985',
        accent: '#0284C7',
        error: '#B42318',
        success: '#157347'
      }
    }
  }
})