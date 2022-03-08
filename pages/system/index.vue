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
	import {
		addSql,
		updateSql,
		executeSql,
		openSqlite,
		selectSql,
		closedb
	} from "@/util/database";
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
			async entity(tableName, data) {
				console.log(tableName, uni.getStorageSync(tableName))
				const table = uni.getStorageSync(tableName)
				if (!table) {
					console.error('表结构不存在', tableName)
					return
				}
				console.log('99999999', table)
				log.d('warn', '9999999999')
				const columns = table.columns
				const idName = table.idName
				const idType = table.idType
				const idGenerator = table.idGenerator
				console.log(idName)
				delete data[idName]
				const idValue = data[idName]
				console.log(idValue)
				if (!idValue) {
					await this.doInsert(tableName, columns, data, idGenerator, idName, idType)
					// await addSql(tableName,data)
				} else {
					this.doUpdate(tableName, columns, data, idName, idType)
				}
			},
			async doInsert(tableName, columns, data, idGenerator, idName, idType) {
				try {
					let sql1 = 'insert into ' + tableName + '('
					let sql2 = ') values('
					let insertId
					if (idGenerator === 'ID_GUID') {
						insertId = this.$appUtil.uuid()
						sql1 += idName + ','
						sql2 += idType === 'NUMBER' ? insertId : "'" + insertId + "'" + ","
					} else if (idGenerator === 'ID_SEQ') {

					} else if (idGenerator === 'ID_ASSIGNED') {
						insertId = this.$appUtil.uuid()
						sql1 += idName + ','
						sql2 += idType === 'NUMBER' ? insertId : "'" + insertId + "'" + ","
					} else if (idGenerator === 'ID_FOREIGNER') {
						insertId = this.$appUtil.uuid()
						sql1 += idName + ','
						sql2 += idType === 'NUMBER' ? insertId : "'" + insertId + "'" + ","
					}
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
					var sql = sql1 + sql2
					console.log('生成的insert', sql)
					await executeSql(sql)
					return insertId
				} catch (e) {
					//TODO handle the exception
					console.log('插入表', tableName, '失败', e)
				}

			},
			doUpdate(tableName, columns, data, idName, idType) {
				let sql1 = 'update ' + tableName + ' set '
				let sql2 = ` where ${idName}=${idType==='NUMBER'?data[idName]:"'"+data[idName]+"'"}`
				for (let column in columns) {
					if (data.hasOwnProperty(column)) {
						if (data[column] === null || this.$appUtil.replaceMap(columns[column])[1] === 'NUMBER') {
							sql1 += `${column}=${data[column]},`
						} else {
							sql1 += `${column}='${data[column]}',`
						}
					}
				}
				sql1 = sql1.substring(0, sql1.lastIndexOf(','))
				let sql = sql1 + sql2
				console.log('生成的update', sql)
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
