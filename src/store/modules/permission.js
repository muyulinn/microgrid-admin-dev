import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
import axios from '@/http'
import { apiRoutes } from '@/router'
/**
 * 使用数组的some来进行判断
 * @param permissions
 */
export function hasPermission(permissions) {
  if (!permissions) return false

  if (store.getters.name === 'admin') return true

  if (!(permissions instanceof Array)) {
    permissions = [permissions]
  }
  const userPermissions = store.getters.permissions || []
  // console.debug('hasPermission', userPermissions, permissions)
  return permissions.some(name => userPermissions.includes(name))
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes) {
  const res = []
  // console.log('routes', routes, permissions);
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp.name)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children)
      }
      res.push(tmp)
    }
  })
  return res
}

// 添加meta
function addMeta(routes) {
  routes.forEach((item, index) => {
    if (item.menuType === 2) {
      // console.log(routes.length)
      var routesLength = routes.length
      routes.splice(index, routesLength)
    } else {
      if (item.hidden === 1) {
        item.hidden = true
      } else {
        item.hidden = false
      }
      // item.hidden = false
      item.path = item.url
      item.meta = {}
      item.meta.title = item.name
      if (item.icon) {
        item.meta.icon = item.icon
      }
      item.meta.roles = []
      if (item.children) {
        addMeta(item.children)
      } else {
        delete item.children
      }
    }
  })
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSION_LIST: (state, permissionList) => {
    state.permissions = (permissionList || []).map(p => p.name)
    var btnData = []
    permissionList.forEach(item => {
      if (item.menuType === 2) {
        btnData.push(item.permissionFlag)
      }
    })
    state.btnList = btnData
  }
}

const actions = {

  generateRoutes({ commit }) {
    return axios.getParam('/api/user/getCurrentUserRolePermission').then(permissions => {
      commit('SET_PERMISSION_LIST', permissions)
      // console.log(permissions)
      return permissions
    }).then(apiRoutes).then(res => {
      addMeta(res)
      return new Promise(resolve => {
        const accessedRoutes = filterAsyncRoutes(asyncRoutes)
        console.log(accessedRoutes)
        commit('SET_ROUTES', res)
        resolve(res)
      })
    })
    // -----------------------------------------------------------------
    // return new Promise(resolve => {
    //   const accessedRoutes = filterAsyncRoutes(asyncRoutes)
    //   // console.log(rolePermissionList, 'accessedRoutes'); //
    //   // if (roles.includes('admin')) {
    //   //   accessedRoutes = asyncRoutes;
    //   // } else {
    //   //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, permissions);
    //   // }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
