<template>
	<view class="u-page">
		<view class="u-page__item">
			<view class="">
				<view v-show="currentTab===index" v-for="(item,index) in phonetab" :key="index">
					<!-- {{item.name}}组件预留位置 -->
					<grid :baseList="item.children" @navTo="navTo"></grid>
				</view>
			</view>

			<!-- <u-gap height="150"></u-gap> -->
			<u-tabbar :value="currentTab" @change="name => currentTab = name" :fixed="true" :placeholder="true"
				:safeAreaInsetBottom="true">
				<u-tabbar-item :text="item.name" v-for="(item,index) in phonetab" :key="index"
					@click="currentTab=index">
					<image class="u-page__item__slot-icon" slot="active-icon"
						:src="'../../static/image/'+item.link+'-selected.png'"></image>
					<image class="u-page__item__slot-icon" slot="inactive-icon"
						:src="'../../static/image/'+item.link+'.png'"></image>
				</u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import Grid from '../../components/Grid.vue'
	import {
		safeTimeOut
	} from '../../util/api'
	export default {
		data() {
			return {
				currentTab: 0,
				baseList: []
			}
		},
		components: {
			Grid
		},
		onLoad() {
			try {
				this.phonetab = uni.getStorageSync('user').functions
				this.baseList = this.phonetab ? this.phonetab[0].children : []
				const testData = {
					data: {
						f_checker: 15130,
						services: {
							rows: []
						}
					}
				}
				safeTimeOut(testData).then(res => {
					const inserts = res.data.result.inserts
					for (let i = 0; i < inserts.length; i++) {
						this.$sql.entityPartialSave('t_check_plan', inserts[i])
					}
				})
			} catch (e) {
				console.log(e)
			}

		},
		methods: {
			navTo(baseListItem) {
				console.log('9999999', baseListItem)
				uni.navigateTo({
					url: "../safecheck/currentCreate"
				})
			},
			changeTab(item, index) {
				this.currentTab = index
				this.baseList = item.children
				console.log('baseList', this.baseList)
			},
			gotoPage(item) {
				console.log('item', item)
				uni.navigateTo({
					url: "./test?item=" + encodeURIComponent(JSON.stringify(item))
				})
			}
		},
		computed: {
			// ...mapGetters(['phonetab']),
			...mapState(['user'])
		}
	}
</script>
<style lang="scss" scoped>
	.u-page {
		padding: 0;

		&__item {
			height: 80rpx;

			&__title {
				color: $u-tips-color;
				background-color: $u-bg-color;
				padding: 56rpx;
				font-size: 56rpx;

				&__slot-title {
					color: $u-primary;
					font-size: 54rpx;
				}
			}

			&__slot-icon {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}

	.u-page /deep/ .u-tabbar__content__item-wrapper {
		height: 120rpx;
	}
</style>
