import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

/**
 * 初始化操作
 */
const initAPP = async() => {
  await Promise.all([
    store.dispatch('enumData/getEnumData', { url: '/api/enumData' }),
    store.dispatch('user/getInfo')
  ])

  const accessRoutes = await store.dispatch('permission/generateRoutes')
  console.debug('accessRoutes', accessRoutes)
  router.addRoutes(accessRoutes)
  router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
}

const whiteList = ['/login', '/auth-redirect', '/dataCenter'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // determine whether the user has logged in
  const hasToken = !!getToken()

  if (!hasToken) {
    return whiteList.indexOf(to.path) !== -1 ? next() : next(`/login?redirect=${to.path}`)
  }

  if (to.path === '/login') {
    return next({ path: '/' })
  }

  console.debug('store.getters.hasInit', store.getters.hasInit, to.path)
  if (store.getters.hasInit) {
    return next()
  }

  try {
    await initAPP()
    next({ ...to, replace: true })
  } catch (error) {
    await store.dispatch('user/resetToken')
    Message.error(error || 'Has Error')
    next(`/login?redirect=${to.path}`)
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  next()
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
