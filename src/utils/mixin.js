/**
 * by lcs
 * 2020-09-21
 */

import { Message } from 'element-ui'

import { parseTime } from '@/utils'
import { hasPermission } from '@/store/modules/permission'
// import { filters } from '@/filters/enum';
/**
 * 判断是否promise对象
 * @param {*} val
 * @returns
 */
const isPromise = val => {
  return val && val.constructor === Promise
}
export default {
  /**
   * 对组件内的异步方法调用做统一的处理
   * @returns
   */
  beforeCreate() {
    const methods = this.$options.methods || {}
    if (!methods._errorHandle) return
    Object.keys(methods)
      .filter(key => !/^(\$|_)/.test(key))
      .filter(key => !['_errorHandle', 'notImpl'].includes(key))
      // .filter(key => /^add|edit|reset|post/.test(key))
      .forEach(key => {
        const fn = methods[key]
        methods[key] = function resetMethod(...args) {
          const ret = fn.apply(this, args)
          if (!isPromise(ret)) return ret
          return ret.catch(e => {
            console.error('beforeCreate', e)
            methods._errorHandle.apply(this, [e, key])
            return Promise.reject({ method: key, error: e })
          }).finally(() => this._finallyHandle && this._finallyHandle.apply(this))
        }
      })
  },
  methods: {
    /**
     * 提示接口没有对接
     */
    notImpl() {
      Message({
        message: 'not impl',
        type: 'error',
        duration: 5 * 1000
      })
    },
    $formatDate(row, column, value, index) { return value ? parseTime(value, '{y}-{m}-{d}') : '-' },
    $formatDateTime(row, column, value, index) { return value ? parseTime(value) : '-' },
    $formatMomey(row, column, value, index) { return (value || row || 0).toFixed(0) },
    /**
       * 添加 tab
       * @see Router.prototype.addTag
       * @param {*} param
       */
    $addTag(param) {
      const { route } = this.$router.resolve(param)
      route.meta.title = param.title || route.meta.title
      return this.$router.push({ ...route })
    },
    /**
     * 设置 tag title
     * @param {*} title
     */
    $setTitle(title) {
      this.$store.dispatch('tagsView/updateVisitedView', { path: this.$route.path, title })
    },
    /**
     * 关闭 tag
     * @param {*} path
     */
    $closeTag(path) {
      path = path || this.$route.path
      this.$store.dispatch('tagsView/delView', { path }).then(({ visitedViews }) => {
        const lastView = visitedViews.pop()
        this.$router.push(lastView || '/')
      })
    },
    /**
     * el-table enum formater
     * @param {*} enumName
     */
    // $formatEnum(enumName) {
    //   return (row, col, val) => {
    //     return filters[`\$${enumName}`](val);
    //   };
    // },
    /**
     * el-table enum formater
     * @param {*} enumName
     */
    $formatEnum(enumName, defaultVal = '-') {
      return (row, col, val) => {
        const keys = enumName.split('.')
        let data = this.$store.getters.enumData
        keys.forEach(key => {
          if (data) {
            data = data[key]
          }
        })
        console.assert(data, '$formatEnum error for', enumName)
        const item = data.filter(item => item.val === val)[0]
        if (!item) {
          console.warn('unknown val', val, enumName, data)
          return defaultVal
        }
        // return item.desc + '_test'
        return item.desc
      }
    },
    /**
     * 成功消息
     */
    $success(message, type = 'success') {
      return this.$message({ message, type })
    },
    /**
     * 权限判断
     * @param {} val
     * @returns
     */
    $hasPermission(val) {
      const b = hasPermission(val)
      console.debug('mixin hasPermission', val, b)
      return b
    },
    /**
     * 默认错误处理
     */
    _errorHandle(method, error) {
      console.log('errorHandle', method, error)
      this.loading = false
    }
  }
}
