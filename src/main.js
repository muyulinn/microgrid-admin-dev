import Vue from 'vue'
import axios from '@/http'
// import { from } from "_array-flatten@2.1.2@array-flatten";
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css全局样式
// import '@/assets/css/global.css' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// 精度
// import { math } from './util.js'
// Vue.prototype.$math = math

// 表单验证
import rules from '@/utils/rules'
Vue.prototype.$rules = rules

import permission from '@/directive/permission'
Vue.use(permission) //权限控制、按钮权限、页面权限、指令权限的插件

// 引入echarts
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

import mixin from '@/utils/mixin'
Vue.mixin(mixin)

import PageTable from '@/components/PageTable'
import DateRangePicker from '@/components/DateRangePicker'
import EnumOption from '@/components/EnumOption'
import FsImg from '@/components/FsImg'

[PageTable, DateRangePicker, EnumOption, FsImg].forEach(item => {
  Vue.component(item.name, item)
})

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.prototype.$getEnumDesc = (enumData, string, valParam) => {
  try {
    const stringArray = string.split('.')
    const array = enumData[stringArray[0]][stringArray[1]]
    if (array.length > 0) {
      const obj = array.find(item => item.val === valParam)
      if (obj !== undefined) {
        return obj.desc
      }
    }
    return ''
  } catch (e) {
    console.log(e, '获取枚举值失败')
    return ''
  }
}

import 'font-awesome/css/font-awesome.min.css'
// eslint-disable-next-line no-extend-native

new Vue({             // 创建整个前端应用
  el: '#app',         // vue挂载到HTML中id为app的元素上
  router,             // 注入路由
  store,              // 注入vuex状态管理
  render: h => h(App) // 将App组件渲染到页面上
})
