<template>
	<view class="">
		<u-loading-page :loading="model.seaching" loading-text="正在查询,请耐心等待">
		</u-loading-page>
		<view v-show="!model.seaching" :class='classtype' class="list-flex">
			<slot name="criteria"></slot>
			<!-- <p v-if="model.state === '初始'">请输入查询条件进行查询！</p> -->
			<p v-if="model.state === '错误'">{{ model.error }}</p>
			<view class='span'>
				<slot name="list"></slot>
			</view>
			<!-- <pager v-if='pager' :page-index="model.pageIndex" :model="model" @page-changed='loadPage'
				:count='model.count' :page-size.sync='model.pageSize' :attach="attach" :simple="simple">
			</pager> -->
		</view>
	</view>
</template>

<script>
	import Pager from './Pager'
	import PagedList from '../util/PagedList.js'

	export default {
		props: {
			model: {
				type: Object,
				default: () => {
					return new PagedList()
				}
			},
			pager: {
				type: Boolean,
				default: true
			},
			attach: {
				type: String,
				default: 'name'
			},
			simple: {
				type: Boolean,
				default: false
			},
			classtype: {
				type: String,
				default: 'flex'
			}
		},
		methods: {
			loadPage(pageNo) {
				this.$emit('load-page')
				this.model.loadPage(pageNo)
			},
			search(args) {
				console.log('6666666')
				this.model.search(args.condition, args.model, args.condValue)
			}
		},
		components: {
			Pager
		}
	}
</script>
