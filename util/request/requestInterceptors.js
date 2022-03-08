/**
 * 请求拦截
 * @param {Object} http
 */
module.exports = (vm) => {
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
			// console.log('config', JSON.stringify(config))
			// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
			config.data = config.data || {}
			// console.log(typeof config.data)
			if (!(typeof config.data === 'string')) {
				// console.log("666666666666")
				try {
					config.data = JSON.stringify(config.data)
				} catch (e) {
					//TODO handle the exception
					console.log('转字符串错误')
				}
			}
			// config.header.Token = vm.$store.state.token
			if (config.url === '/phone/rs/vue') {
				config.header.Token = vm.$store.state.token
			}

			// console.log('config', JSON.stringify(config))
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			// console.log(vm.$store.state.token);
			return config
		}, (config) => // 可使用async await 做异步操作
		Promise.reject(config))
}
