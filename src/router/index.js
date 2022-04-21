import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Chat from '@/components/Chat'
import store from '../store'
const Home = () => import('@/components/Home')
const Layout = () => import('@/layout/index')
const EditInfo = () => import('@/components/EditInfo')
const AddFriends = () => import('@/components/AddFriends')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/mychat',
      name: 'mychat',
      component: Chat,
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/editInfo',
      name: 'EditInfo',
      component: EditInfo
    },
    {
      path: '/addFriends',
      name: 'AddFriends',
      component: AddFriends
    },
  ]
})

// 登录拦截
router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth) { // 判断路由是否需要登录权限
    if (store.state.token) { // 通过vuex state
      await next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
