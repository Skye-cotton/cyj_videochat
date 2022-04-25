import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import myChat from '@/components/Chat'
import store from '../store'
const Home = () => import('@/components/Home')
const Layout = () => import('@/layout/index')
// const EditInfo = () => import('@/components/EditInfo')
const AddFriends = () => import('@/components/AddFriends')



const EditInfo = () => import('@/views/editInfo')
const Chat = () => import('@/views/chat')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Layout,
      redirect: '/editInfo',
      children: [
        {
          path: '/editInfo',
          name: 'editInfo',
          component: EditInfo
        },
        {
          path: '/chat',
          name: 'chat',
          component: Chat
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/myChat',
      name: 'myChat',
      component: myChat
    }
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
