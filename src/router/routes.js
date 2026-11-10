import ProfileView from '@/views/ProfileView.vue'

export default [
  { path: '/', name: 'profile', component: ProfileView },
  {
    path: '/workshop-2',
    name: 'grade',
    component: () => import(/* webpackChunkName: "grade" */ '@/views/GradeView.vue')
  },
  {
    path: '/workshop-3',
    name: 'upcoming',
    component: () => import(/* webpackChunkName: "upcoming" */ '@/views/UpcomingView.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFoundView.vue')
  }
]