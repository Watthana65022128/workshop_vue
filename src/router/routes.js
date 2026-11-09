import WelcomeView from '@/views/WelcomeView.vue'
import HomeView from '@/views/HomeView.vue'

export default [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeView,
    meta: { showToolbar: true }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFoundView.vue')
  }
]
