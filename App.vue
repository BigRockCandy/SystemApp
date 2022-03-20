<script>
	// #ifdef APP-PLUS
	import {
		LogCat
	} from './util/LogCat.js'
	// #endif
	export default {
		onLaunch: function() {
			console.log('App启动')
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true)
			plus.navigator.hideSystemNavigation()
			LogCat.init()
			// #endif
		},
		onShow: function() {
			console.log('App前台')
			// #ifdef APP-PLUS
			plus.navigator.setFullscreen(true)
			plus.navigator.hideSystemNavigation()
			// #endif
		},
		onError: function(err) {
			console.error(err)
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行 */
	@import "@/uni_modules/uview-ui/index.scss";

	/* 全局样式在此处引入 */
</style>
