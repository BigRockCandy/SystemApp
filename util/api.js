import Vue from "vue"
const {
	http
} = uni.$u

export const userLogin = (params, config = {}) => http.post('/rs/user/userLogin/手机服务', params, config)

export const getDBConfig = async (params, config = {}) => http.post('/phone/rs/db/meta2', params, config)

export const appVersion = async (config = {}) => http.get('/phone/rs/dir/version', config)

export const vueConfig = async (config = {}) => http.get('/phone/rs/vue', config)

export const safeTimeOut = async (params, config = {}) => http.post('/rs/logic/getCheckPlanChanged', params, config)

export const dir2Xml = async (config = {}) => http.get('/phone/rs/dir2/noxml', config)

export const dir2 = async (params, config = {}) => http.post('/phone/rs/dir2', params, config)

export const load = async (methods, url, params, config = {}) => {
	if (methods === 'GET') {
		return http.get(url, config)
	} else if (methods === 'POST')
		return http.post(url, params, config)
}
