// 前端应用的启动器，负责引导整个应用的运行
import Vue from 'vue'
import axios from '@/http' // 引入封装的http请求模块
import Cookies from 'js-cookie' // 引入js-cookie库，用于操作浏览器的cookie

import 'normalize.css/normalize.css' // 统一不同浏览器的默认样式

import Element from 'element-ui' // 引入element-ui组件库
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css全局样式
// 比如：字体、颜色、布局等全局样式

import App from './App' // 引入根组件App.vue
import store from './store' // 引入vuex状态管理
import router from './router' // 页面跳转核心

import './icons' // svg图标自动注册
import './permission' // 后台系统文件
import './utils/error-log' // 全局错误捕捉

import * as filters from './filters' // global filters

// 精度
// import { math } from './util.js'
// Vue.prototype.$math = math

// 表单验证
import rules from '@/utils/rules'
Vue.prototype.$rules = rules

import permission from '@/directive/permission'
Vue.use(permission) // 权限控制、按钮权限、页面权限、指令权限的插件

// 引入echarts
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

Vue.use(Element, {
  size: Cookies.get('size') || 'mini'// set element-ui default size
}) // 通过cookie获取用户设置的element-ui组件大小，默认为'mini'

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
}) // 将filters对象中的每个函数注册为Vue的
// 全局过滤器，方便在模板中使用
Vue.prototype.$http = axios
// 将封装的http请求模块挂载到Vue原型上，方便在组件中通过this.$http访问
Vue.config.productionTip = false
// 生产环境提示，设置为false可以阻止Vue在启动时生成生产提示

import mixin from '@/utils/mixin'
Vue.mixin(mixin)
// 将mixin对象混入到所有Vue组件中，所有组件自动继承一部分代码

import PageTable from '@/components/PageTable'
import DateRangePicker from '@/components/DateRangePicker'
import EnumOption from '@/components/EnumOption'
import FsImg from '@/components/FsImg'

[PageTable, DateRangePicker, EnumOption, FsImg].forEach((item) => {
  Vue.component(item.name, item)
}) // 将一些常用的组件注册为全局组件，方便在模板中直接使用

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 将echarts库挂载到Vue原型上，
// 方便在组件中通过this.$echarts访问

Vue.prototype.$getEnumDesc = (enumData, string, valParam) => {
  try {
    const stringArray = string.split('.')
    const array = enumData[stringArray[0]][stringArray[1]]
    if (array.length > 0) {
      const obj = array.find((item) => item.val === valParam)
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

new Vue({
  // 创建整个前端应用
  el: '#app', // vue挂载到HTML中id为app的元素上
  router, // 注入路由
  store, // 注入vuex状态管理
  render: (h) => h(App) // 将App组件渲染到页面上
})
