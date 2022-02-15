<template>
	<view>
		<u-grid :border="false" @click="click" col="2">
			<u-grid-item  v-for="(baseListItem,baseListIndex) in baseList"
				:key="baseListIndex" style="margin-top: 30rpx;">
				<view style="border-radius: 30rpx;border: 1px solid #eee;margin: auto;display: flex;flex-direction: column;justify-content: space-between;padding-left: 100rpx;padding-right:100rpx;">
					<image src="../static/image/weixiudaiban.png" style="height: 66rpx;width: 66rpx;margin:auto;padding-top: 30rpx;"></image>
					<text class="grid-text" style="line-height: 50rpx;text-align: center;">{{baseListItem.name}}</text>
				</view>
			</u-grid-item>
		</u-grid>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			baseList: {
				type: Array,
				required: true
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
