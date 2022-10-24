import Vue from 'vue'
import VueRouter from 'vue-router'
import Lives from '../components/lives/table.vue'
import News from '../components/news/table.vue'
import Podcast from '../components/podcasts/series/table.vue'
import Ads from '../components/ads/table.vue'
import Reports from '../components/reports.vue'
import Users from '../components/users/table.vue'
import Account from '../components/account.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Account',
    component: Account
  },
  {
    path: '/podcast',
    name: 'Podcast',
    component: Podcast
  },
  {
    path: '/news',
    name: 'News',
    component: News
  },
  {
    path: '/podcast/:serie_id',
    name: 'Podcast',
    component: () => import('../components/podcasts/table.vue')
  },
  {
    path: '/lives',
    name: 'Lives',
    component: Lives
  },
  {
    path: '/ads',
    name: 'Ads',
    component: Ads
  },
  /*
  {
    path: '/ads/:campaign_id',
    name: 'Ads',
    component: () => import('../components/ads/table.vue')
  },
  */
  {
    path: '/reports',
    name: 'Reports',
    component: Reports
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
]

const router = new VueRouter({
  routes
})

export default router
