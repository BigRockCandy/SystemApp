<template>
	<view>
		<criteria-paged :model="model" ref="paged">
			<template v-slot:criteria>
				<criteria @condition-changed="search" ref="cri" :model="model">
					<template>

						<u--input type="text" v-model="model.f_userinfo_code" variable="f_userinfo_code"
							condition="f_userinfo_code like '%{}%'" />
						<uni-data-picker :localdata="usertypes" popup-title="请选择用户类型" v-model="model.f_user_type"
							variable="f_user_type" condition="f_user_type = '{}'">
						</uni-data-picker>
						<uni-datetime-picker v-model="model.f_create_time" condition="f_create_time >'{}'"
							variable="f_create_time" />

					</template>
					<!-- <uni-section :title="'日期用法：' + model.data" type="line"></uni-section> -->
				</criteria>
			</template>
			<template v-slot:list>
				<list :model="model">
					<template v-slot="{row}">
						{{row.f_user_name}}
					</template>

				</list>
			</template>
		</criteria-paged>

	</view>
</template>

<script>
	import CriteriaPaged from '../../components/CriteriaPaged.vue'
	import Criteria from '../../components/Criteria.vue'
	import List from '../../components/List.vue'
	import PagedList from '../../util/PagedList.js'
	export default {
		data() {
			return {
				model: new PagedList('rs/sql/androidGetuserinfo', 50),
				show: false,
				usertypes: [{
						text: "民用",
						value: "民用"
					},
					{
						text: "非民用",
						value: "非民用"
					}
				]

			}
		},
		components: {
			CriteriaPaged,
			Criteria,
			List
		},
		onLoad(option) {
			console.log('进入安检待办')
		},
		onReachBottom() {
			console.log(this.model.pageIndex + 1)
			this.model.loadPage(this.model.pageIndex + 1, true)
		},
		methods: {
			selfSearch() {
				this.model.search('1=1')
			},
			confirm(date) {
				this.model.f_date = date
			},
			csaaa(val) {
				console.log('5555555', val)
			},
			search(args) {
				args.condition += ' and 1=1'
				this.model.search(args.condition, args.model)
			},
		},
		// watch: {
		// 	'model.f_userinfo_code'() {
		// 		console.log(this.model.f_userinfo_code)
		// 		console.log(this.$refs.paged.model)
		// 	}
		// }
	}
</script>

<style>

</style>
