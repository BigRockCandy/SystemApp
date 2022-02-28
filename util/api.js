const {
	http
} = uni.$u

export const userLogin = (params, config = {}) => http.post('/rs/user/userLogin/手机服务', params, config)

export const getDBConfig = async (params, config = {}) => http.post('/phone/rs/db/meta2', params, config)

export const appVersion = async (config = {}) => http.get('/phone/rs/dir/version', config)

export const vueConfig = async (config = {}) => http.get('/phone/rs/vue', config)

export const safeTimeOut = async (params, config = {}) => http.post('/rs/logic/getCheckPlanChanged', params, config)
