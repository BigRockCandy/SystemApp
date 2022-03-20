<template>
	<view class="u-page">
		<u-list>
			<u-list-item v-for="(item, index) in model.rows" :key="index">
				<slot name="default" v-bind:row="item"></slot>
			</u-list-item>
		</u-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1
			}
		},
		onLoad() {
			console.log(this.model.rows)
		},
		methods: {
			// scrolltolower() {
			// 	console.log('77777777777', this.model.pageIndex)
			// 	this.pageNo += 1
			// 	this.model.loadPage(this.model.pageIndex + 1, true)
			// }
		},
		props: {
			model: {
				type: Object
			},
			attach: {
				type: String,
				default: 'name'
			}
		}
	}
</script>
