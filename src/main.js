import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Element from 'element-ui'

// import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import animate from 'animate.css'
import App from './app'
import router from './router'
import './router/before'
import * as filters from './filters'

import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control

import ReadConfig from './utils/config.js'

import Global from '@/libs/mixins/global'

import TreeView from 'vue-json-tree-view'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// import '@/assets/common.less'
import dataV from '@jiaminghi/data-view'

Vue.use(dataV)

Vue.config.productionTip = false

Vue.use(TreeView)
Vue.mixin(Global)

Vue.use(Element, {
  size: 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
})
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.silent = true
Vue.config.productionTip = false
Vue.config.sys_error_show = true
Vue.config.lang = 'zh_CN'


Vue.config.permissionSwitch = true
Vue.config.pagination = {
  limitAlias: 'pageSize',
  offsetAlias: 'pageNum',
}

const create = async () => {
  await ReadConfig(Vue)
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: {
      App
    },
  })
}
create()
