import Vue from 'vue'
import Router from 'vue-router'
import Visualisation from './views/Visualisation.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'visualisation',
      component: Visualisation
    },
    {
      path: '/bibliographie',
      name: 'bibliographie',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Bibliographie.vue')
    }
  ]
})
