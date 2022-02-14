<template>
	<view>
		<u-grid :border="false" @click="click" col="2">
			<u-grid-item v-for="(baseListItem,baseListIndex) in baseList" :key="baseListIndex" style="margin-top: 70rpx;">
				<image src="../static/image/weixiudaiban.png" style="height: 132rpx;width: 132rpx;"></image>
				<text class="grid-text" style="line-height: 50rpx;">{{baseListItem.name}}</text>
			</u-grid-item>
		</u-grid>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		props:{
			baseList:{
				type:Array,
				required:true
			}
		},
		methods: {
			click(name) {
				this.$refs.uToast.success(`点击了第${name}个`)
			}
		}
	}
</script>

<style lang="scss">
	.grid-text {
		font-size: 14px;
		color: #909399;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>
