// 引入Vuex
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import defaultState from './state/state'

import defaultMutations from './mutations/mutations'

import defaultGetters from './getters/getters'
import defaultActions from './actions/actions'

const store = new Vuex.Store({
	// 规范修改
	state: defaultState,
	actions: defaultActions,
	mutations: defaultMutations,
	getters: defaultGetters
})
export default store
