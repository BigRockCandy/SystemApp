import Vue from 'vue'
import App from './App'

// vuex
import store from './store/store'

// 引入全局uView 
import uView from '@/uni_modules/uview-ui'

import mixin from './config/mixin'

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)


Vue.mixin(mixin)

const app = new Vue({
    store,
    ...App
})

// 引入请求封装
require('./util/request/index')(app)

app.$mount()
