// 引入Vuex
import Vuex from 'vuex'
import Vue from 'vue'
import defaultState from './state/state'

import defaultMutations from './mutations/mutations'

import defaultGetters from './getters/getters'
import defaultActions from './actions/actions'
Vue.use(Vuex)
export default () => {
  const store = new Vuex.Store({
    // 规范修改
    state: defaultState,
    actions: defaultActions,
    mutations: defaultMutations,
    getters: defaultGetters,
    plugins: [
    ],
    modules: {
    }
  })
  
  return store
}
