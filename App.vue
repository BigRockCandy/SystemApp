<script>
	import {
		LogCat
	} from './util/LogCat.js'
	export default {
		onLaunch: function() {
			console.log('App启动')
			plus.navigator.setFullscreen(true)
			plus.navigator.hideSystemNavigation()
			LogCat.init()
		},
		onShow: function() {
			console.log('App前台')
			plus.navigator.setFullscreen(true)
			plus.navigator.hideSystemNavigation()
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
