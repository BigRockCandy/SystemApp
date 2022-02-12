<template>
	<view class="u-page">
		<view class="u-page__item">
			<view class="">
				<view v-show="currentTab===index" v-for="(item,index) in phonetab" :key="index">
				  {{item.name}}组件预留位置
				</view>
			</view>
			
			<u-gap height="150"></u-gap>
			<u-tabbar :value="currentTab" @change="name => currentTab = name" :fixed="true" :placeholder="true"
				:safeAreaInsetBottom="true">
				<u-tabbar-item :text="item.name" v-for="(item,index) in phonetab" :key="index" @click="currentTab=index">
					<image class="u-page__item__slot-icon" slot="active-icon"
						:src="'../../static/image/'+item.name+'选中.png'"></image>
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						:src="'../../static/image/'+item.name+'未选中.png'"></image>
				</u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				currentTab: 0
			}
		},
		onLoad() {
			console.log('进入主页面', this.user, this.phonetab)

		},
		methods: {
			gotoPage(item) {
				console.log('item', item)
				uni.navigateTo({
					url:"./test?item="+encodeURIComponent(JSON.stringify(item))
				})
			}
		},
		computed: {
			...mapGetters(['user', 'phonetab'])
		}
	}
</script>
<u-tabbar-item></u-tabbar-item>
<style lang="scss" scoped>
	.u-page {
		padding: 0;

		&__item {

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 36rpx;
				font-size: 36rpx;

				&__slot-title {
					color: $u-primary;
					font-size: 34rpx;
				}
			}

			&__slot-icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
