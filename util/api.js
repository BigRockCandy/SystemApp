const { http } = uni.$u

export const userLogin = (params, config = {}) => http.post('/rs/user/userLogin/手机服务', params, config)
