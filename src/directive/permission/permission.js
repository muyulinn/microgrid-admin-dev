import { hasPermission } from '@/store/modules/permission'

/**
 * 角色或权限任意一个匹配都通过
 * @param {*} el
 * @param {*} binding
 */
function checkPermission(el, binding, vnode) {
  if (!el.parentNode) return

  const { value } = binding
  if (!value) {
    throw new Error(`need permissionName! Like v-permission="'custimerList'"`)
  }

  if (hasPermission(value)) return

  vnode.componentInstance.$destroy()
  el.parentNode.removeChild(el)
}

export default {
  inserted(el, binding, vnode) {
    console.debug('checkPermission', arguments)
    checkPermission(el, binding, vnode)
  }
}
