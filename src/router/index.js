const id = 'G-R4LTKVRQ0P'
import Vue from 'vue'
import Router from 'vue-router'
// import { getToken } from '@/utils/auth';
import Layout from '@/layout'
import axios from '@/http'
import VueGtag from 'vue-gtag'

Vue.use(Router)

// 首页和登录页
// import Home from '@/views/home.vue'
import Login from '@/views/login.vue'

// // 开发中
const UnderConstruction = () => import('@/views/error-page/UnderConstruction')
import menus from './modules/menus'
import user from './modules/user'
import pageCompoents from './views'
import { genDevMenu } from './views'

export const asyncRoutes = [].concat(user).concat(menus)

export const constantRoutes = [{
  path: '/',
  component: Layout,
  redirect: '/main-dashboard2',
  children: [{
    path: 'home', name: 'Home', redirect: '/dashboard', hidden: true
  }, {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard'),
    meta: { title: '首页', icon: 'dashboard', affix: true }
  }]
}, {
  path: '/login', name: 'login', component: Login
}, {
  path: '/main-dashboard', name: 'main-dashboard', component: () => import('@/views/main-dashboard')
}, {
  path: '/main-dashboard2', name: 'main-dashboard2', component: () => import('@/views/main-dashboard2')
}, {
  path: '/app-list', name: 'app-list', component: () => import('@/views/main-dashboard/app-list')
}, {
  path: '/under-construction', name: 'UnderConstruction', component: UnderConstruction
}, {
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  }, {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }, {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }]
}].concat(genDevMenu())
console.log('constantRoutes', constantRoutes)
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
Vue.use(VueGtag, { config: { id }}, router)
// router.beforeEach((to, from, next) => {
//   console.log(to.path)
//   if (to.path === '/login') return next()
//   if (to.path.includes('/redirect/')) return next()
//   const tokenStr = getToken()
//   if (!tokenStr) return next('/login')
//   next()
// })
console.log('pageCompoents', pageCompoents)
/**
 * 动态权限路由构建
 * @param {} arr
 * @returns
 */
export async function apiRoutes(arr) {
  const permissionIds = arr.map(item => item.permissionId)
  const menusTree = await axios.getParam('/api/user/getPermissionVoList')
  return forEachTree(menusTree, item => {
    if (permissionIds.includes(item.id) && item.isRoute === 1) {
      return {
        ...item,
        component: pageCompoents[item.component],
        show: true,
        path: item.url,
        meta: { title: item.name, icon: item.icon }
      }
    }
    return false
  })
}

/**
 * 树遍历
 * @param {} treeArr
 * @param {*} cb
 * @returns
 */
const forEachTree = (treeArr, cb) => {
  return treeArr.map(item => {
    if (item.children) {
      item.children = forEachTree(item.children, cb)
    }
    return cb(item)
  }).filter(item => item)
}

export function resetRouter() {
  // debugger
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

// export const subRouter = _subRouter
