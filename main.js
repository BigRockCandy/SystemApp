import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
// vuex
import store from './store/store'
import * as appUtil from './util/util.js'
// import *  from './util/database.js'
const sql = require('./util/database.js')// 用法
import "./util/JConsole.js";
// import * as sql from './util/database.js'
// 引入全局uView 
import uView from '@/uni_modules/uview-ui'
import mixin from './config/mixin'
Vue.use(Vuex)
Vue.prototype.$store = store
Vue.prototype.$appUtil = appUtil
Vue.prototype.$sql = sql
Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView)
Vue.mixin(mixin)
const app = new Vue({
	store,
	...App
})
// 请求拦截
require('./util/request/index')(app)

app.$mount()
