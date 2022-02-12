module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
			disableHostCheck: true,
			port: 8080,
			proxy: {
				'/rs': {
					target: 'http://121.41.19.238:8555',
					changeOrigin: true,
					secure: true,
					pathRewrite: {
						'^/rs': ''
					}
				}
			}
		}
	}
	// productionSourceMap: false,
}
