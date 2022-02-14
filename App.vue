<script>
	export default {
		onLaunch: function() {
			console.log('App启动')
			plus.navigator.setFullscreen(true)
			plus.navigator.hideSystemNavigation()
		},
		onShow: function() {
			console.log('App前台')
			plus.navigator.setFullscreen(true)
			plus.navigator.hideSystemNavigation()
		},
	}
</script>

<style lang="scss">
	/* 注意要写在第一行 */
	@import "@/uni_modules/uview-ui/index.scss";
	
	/* 全局样式在此处引入 */
</style>
