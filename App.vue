<script>
	export default {
		onLaunch: function() {
			console.log('App启动')
		},
		onShow: function() {
			console.log('App前台')
		},
		onHide: function() {
			console.log('App后台')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行 */
	@import "@/uni_modules/uview-ui/index.scss";
	
	/* 全局样式在此处引入 */
</style>
