/**
 * 自动扫描@/views/下的页面
 * by lcs
 * 2023-03-27
 */
import Layout from '@/layout'
import SubMenuLayout from '@/layout/SubMenuLayout'

const componentMaps = {
  Layout
}

const excludePages = ['./admin-user/role/index.vue']
const pagesImport = require.context('@/views', true, /^((?!components).)*index.vue$/)
pagesImport.keys()
  .filter(fileName => !excludePages.includes(fileName))
  .forEach(fileName => {
    const routeName = `@/views${fileName.replace(/^\./, '').replace(/.vue$/, '')}`
    componentMaps[routeName] = pagesImport(fileName).default
  })

/**
 * 直接生成路由(开发使用)
 * @returns
 */
export const genDevMenu = () => {
  if (!process.env.VUE_APP_DEV_ROUTE) return []
  const menuList = Object.keys(componentMaps).sort().filter(k => /^@\/views/.test(k)).map(k => [k.replace(/^@\/views\/?/, ''), componentMaps[k]])
  const toTree = (arr, parent = '') => {
    const parentReg = new RegExp('^' + parent + '[^\/]+')
    const parentList = menuList.map(([name]) => name.match(parentReg)).filter(a => a).map(a => a[0])
    return parentList.unique().map(p => {
      const component = menuList.filter(([name]) => name === p).map(([, component]) => component)[0]
      return {
        path: '/dev/' + p,
        name: 'Dev_' + p.replace(/\//g, '_'),
        component: component || SubMenuLayout,
        redirect: component ? void 0 : `/dev/${p}/index`,
        meta: { title: p.split('/').pop(), ...component?.meta, icon: component ? '' : 'el-icon-potato-strips' },
        children: toTree(arr, p + '/'),
        alwaysShow: false
      }
    })
  }
  return {
    path: '/dev',
    name: 'Dev',
    component: Layout,
    // alwaysShow: true,
    meta: { title: 'Dev', icon: 'el-icon-s-platform' },
    children: toTree(menuList)
  }
}

/**
 * 生成菜单、按钮权限树
 *
 * @returns [{id,pid,label,value}]
 */
export const genPermissionList = () => {
  const env = process.env
  if (!env.VUE_APP_DEV_ROUTE) return []

  const genId = (() => {
    let id = 1
    return () => id++
  })()
  const vpermissionImport = require.context('!v-permission-loader!@/views', true, /^((?!components).)*index.vue$/)
  /**
   * 组件路径
   */
  const menuList = Object.keys(componentMaps).sort().map(k => {
    const id = genId()
    const value = k
    const label = componentMaps[k].meta?.title || k
    const fileName = k.replace('@/views', '.') + '.vue'
    const children = vpermissionImport.keys().includes(fileName) ? vpermissionImport(fileName).default.map(item => ({ ...item, id: genId(), pid: id, isButton: true })) : []
    return { id, pid: 0, value, label, children }
  })

  /**
   * 转树
   * @param {*} parent
   * @param {*} pid
   * @returns
   */
  const toTree = (parent = '', pid = 0) => {
    const parentReg = new RegExp('^' + parent + '[^\/]+')
    const parentList = menuList.map(({ value }) => value.match(parentReg)).filter(a => a).map(a => a[0]).unique()
    return parentList.map(p => {
      const menu = menuList.find(item => item.value === p)
      if (menu) {
        return { ...menu, pid }
      } else {
        const id = genId()
        return {
          id, pid, label: p, value: p, children: toTree(p + '/', id)
        }
      }
    })
  }
  /**
   * 转list
   * @param {*} node
   * @param {*} arr
   * @returns
   */
  const toList = (node, arr = []) => {
    arr.push(node)
    if (node.children) {
      arr = arr.concat(node.children.map(sub => toList(sub)).flat())
    }
    return arr
  }
  return toTree('@/views/').map(node => toList(node)).flat()
}

export default componentMaps
