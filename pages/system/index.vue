<template>
	<view class="u-page">
		<view class="u-page__item">
			<view class="">
				<view v-show="currentTab===index" v-for="(item,index) in phonetab" :key="index">
					<!-- {{item.name}}组件预留位置 -->
					<grid :baseList="item.children"></grid>
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
			console.log('进入主页面', this.user, this.phonetab)
			this.baseList = this.phonetab ? this.phonetab[0].children : []
			console.log('aaaa', this.$appUtil.replaceMap("(t_check_plan_item:f_plan_id)"))
			const testData = {
				data: {
					f_checker: 15130,
					services: {
						rows: []
					}
				}
			}
			safeTimeOut(testData).then(res => {
				console.log('res', res)
				console.log("aaa")
				const inserts = res.data.result.inserts
				for (var i = 0; i < inserts.length; i++) {
					this.entity('t_check_plan', inserts[i])
				}
			})

		},
		methods: {
			entity(tableName, data) {
				console.log(tableName, uni.getStorageSync(tableName))
				const table = uni.getStorageSync(tableName)
				if (!table) {
					console.error('表结构不存在', tableName)
					return
				}
				console.log(table.columns)
				const columns = table.columns
				const idName = table.idName
				console.log(idName)
				const idValue = data[idName]
				console.log(idValue)
				if (!idValue) {
					this.doInsert(tableName, columns, data)
				} else {
					delete data[idName]
					this.doInsert(tableName, columns, data)
				}
			},
			doInsert(tableName, columns, data) {
				let sql1 = 'insert into ' + tableName + '('
				let sql2 = ') values('
				for (let column in columns) {
					if (data.hasOwnProperty(column)) {
						sql1 += column + ','
						if (data[column] === null || this.$appUtil.replaceMap(columns[column])[1] === 'NUMBER') {
							sql2 += `${data[column]},`
						} else {
							sql2 += `'${data[column]}',`
						}
					}
				}
				sql1 = sql1.substring(0, sql1.lastIndexOf(','))
				sql2 = sql2.substring(0, sql2.lastIndexOf(',')) + ')'
				let sql = sql1 + sql2
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
			...mapGetters(['phonetab']),
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
