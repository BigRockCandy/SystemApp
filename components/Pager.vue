<template>
	<view class="">


		<nav>
			<ul class="pager" v-if="!simple">
				<li>第<input size='4' v-model='pageIndex' number :id="'vc-page-input'+attach">页/{{totalPage}}页&nbsp;
				<li><a href="#" @click="goIndex" :id="'vc-page-index'+attach">跳转</a></li>
				共{{count}}行 &nbsp;

				每页<input size='4' v-model='pageSize' number>行</li>
				<li class="margin-left"><a href="#" @click="gotoFirst" :disable="pageIndex !== 1"
						:id="'vc-page-first'+attach">首页</a></li>
				<li><a href="#" @click="gotoPre" :id="'vc-page-pre'+attach">上页</a></li>
				<li><a href="#" @click="gotoNext" :id="'vc-page-next'+attach">下页</a></li>
				<li><a href="#" @click="gotoLast" :id="'vc-page-last'+attach">末页</a></li>
			</ul>

			<ul class="pager" v-if="simple">
				<li><a href="#" @click="gotoFirst" :disable="pageIndex !== 1" :id="'vc-page-first'+attach">首页</a></li>
				<li><a href="#" @click="gotoPre" :id="'vc-page-pre'+attach">上页</a></li>
				&nbsp;&nbsp;&nbsp;<li>第{{pageIndex}}页/{{totalPage}}页&nbsp;&nbsp;&nbsp;
				<li><a href="#" @click="gotoNext" :id="'vc-page-next'+attach">下页</a></li>
				<li><a href="#" @click="gotoLast" :id="'vc-page-last'+attach">末页</a></li>
			</ul>
		</nav>
	</view>
</template>

<script>
	export default {
		props: {
			count: {
				type: Number,
				default: 0
			},
			pageSize: {
				type: Number,
				default: 20
			},
			pageIndex: {
				type: Number,
				default: 1
			},
			attach: {
				type: String,
				default: 'name'
			},
			simple: {
				type: Boolean,
				default: false
			},
			model: {
				type: Object,
				default: () => {
					return new PagedList()
				}
			}
		},

		// data () {
		//   return {
		//     pageIndex: 1
		//   }
		// },

		computed: {
			totalPage() {
				let total = Math.floor((this.count - 1) / this.pageSize) + 1
				return total
			}
		},

		methods: {
			gotoPage(pageNo) {
				// 页号没变，直接返回
				if (pageNo === this.pageIndex) {
					return
				}

				// 超出范围，回到头尾
				if (pageNo < 1) {
					this.pageIndex = 1
				} else if (pageNo > this.totalPage) {
					this.pageIndex = this.totalPage
				} else {
					this.pageIndex = pageNo
				}
				this.$emit('page-changed', this.pageIndex)
			},

			gotoFirst() {
				if (this.pageIndex === 1) return
				this.gotoPage(1)
			},

			gotoLast() {
				if (this.pageIndex === this.totalPage) return
				this.gotoPage(this.totalPage)
			},

			gotoNext() {
				if (this.pageIndex === this.totalPage) return
				this.gotoPage(this.pageIndex + 1)
			},

			gotoPre() {
				if (this.pageIndex === 1) return
				this.gotoPage(this.pageIndex - 1)
			},
			goIndex() {
				// 如果输入的页码不在翻页范围内，默默地失败
				if (this.pageIndex <= this.totalPage && this.pageIndex >= 1) {
					this.$emit('page-changed', this.pageIndex)
				}
			}
		},
		watch: {
			'pageSize'() {
				if (this.pageSize > 1000) {
					this.pageSize = 1000
				}
			}
		}
	}
</script>
<style>
	.margin-left {
		margin-left: 50px;
	}

	@media screen and (max-width:768px) {
		.pager {
			margin: 5px 0px !important;
		}

		.margin-left {
			margin-left: 0px;
		}

		.margin-left:before {
			display: block;
			content: '';
			white-space: pre;
		}
	}
</style>
