<template>
	<view ref='ele'>
		<slot name="default"></slot>
		<button type="default" @click="search()">查询</button>
	</view>
</template>

<script>
	export default {
		props: {
			model: {
				type: Object,
				default: () => {
					return new PagedList()
				}
			},
		},
		mounted() {
			const elements = this.$slots['default']
			// each callback is not used on elements array here because of function context issues
			for (let i = 0; i < elements.length; i++) {
				if (elements[i].data && elements[i].data.attrs) {
					if (elements[i].data.attrs['variable']) {
						const name = elements[i].data.attrs['variable']
						const defaultValue = elements[i].data.attrs['default-value']
						if (defaultValue) {
							try {
								/*eslint-disable */
								this.$set(this.model, name, eval(defaultValue))
								/*eslint-enable */
							} catch (e) {
								// console.warn(`Evaluation error, default: ${defaultValue}, error: ${e}`)
							}
						} else {
							this.$set(this.model, name, '')
							// this.$set(`model.${name}`, '')
						}

						const condition = elements[i].data.attrs['condition']
						if (condition) {
							// this.conditions放的是查询条件
							this.conditions[name] = condition
						}
					}
				}

			}
		},
		data() {
			return {
				// // 保存用户输入的数据
				// model: {},
				// 配置的条件内容
				conditions: {},
				// 配置的后台条件内容, 格式为: {属性名: {cond: 条件, dateType: 日期类型}}
				condValues: {},
				// 最终产生的查询条件
				condition: '',
				// 产生的后台查询条件
				condValue: [],
				// 用于验证的字符数组
				character: ["and ", "exec", "insert ", "select ", "delete ", "update ", "or ", "count", "*", "%", "chr",
					"mid", "master", "truncate", "char", "declare", ";", "--", "+"
				],
				// 控制多余查询条件显示与否
				criteriaShow: false
			}
		},

		methods: {
			search() {
				try {
					// 拼接前台条件
					console.log('6666666666', this.model.f_userinfo_code, this.$parent.model)
					this.condition = this.buildFrontCondition()
					const args = {
						condition: this.condition,
						model: this.model
					}
					this.$emit('condition-changed', args)
					return args
				} catch (e) {
					// 如果是查询条件非法，警告
					if (e === '查询条件包含非法字符,请重输') {
						alert('查询条件包含非法字符,请重输')
					} else {
						throw e
					}
				}
			},
			// 拼接前台条件
			buildFrontCondition() {
				let condition = ' 1=1 '
				console.log('33333333', this.conditions)
				for (const name in this.conditions) {
					if (typeof this.model[name] == 'string') {
						this.model[name] = String(this.model[name]).trim()
					}
					const value = this.model[name]
					// 检查是否包含敏感的SQL字符
					if (this.checkValue(value)) {
						throw '查询条件包含非法字符,请重输'
					}
					if (this.conditions[name].includes('$parent') && value && (value + '').length > 0) {
						console.log('7777777777779')
						const sqlStr = this.getSql(value, this.conditions[name])
						if (sqlStr) {
							condition += ' and ' + sqlStr.split('{}').join(this.packCondition(sqlStr, this.model[name]) +
								'')
						}
					} else if (value && (value + '').length > 0) {
						console.log('7777777777778')
						// 查看条件中包含几个{}插入符
						let len = this.conditions[name].match(/{}/g).length
						if (len == 1) {
							condition += ' and ' + this.conditions[name].split('{}').join(this.packCondition(this
								.conditions[name], this.model[name]) + '')
						} else if (len > 1) {
							let conditionsStr = this.conditions[name]
							for (let i = 0; i < len; i++) {
								conditionsStr = conditionsStr.replace('{}', this.packCondition(this.conditions[name], this
									.model[name][i]))
							}
							condition += ' and ' + conditionsStr
						}
					}
				}
				// 通知外部查询条件变化了
				return condition
			},
			getSql(val, exp) { // val: 调取函数时，需要的参数。exp：掉去函数的字符串
				/*eslint-disable */
				return eval('this.' + exp)
				/*eslint-enable */
			},
			packCondition(str, param) {
				console.log('查询条件，，，，', str, param)
				if (param instanceof Array) {
					return param.length > 1 ? this.recombine(param) : (str.indexOf(' in ') > 0 ? this.recombine(param) :
						param)
				} else {
					return param
				}
			},
			recombine(param) {
				// 条件拼接数据，多用于in （）。将数组转成字符串时加上单引号处理
				let str = ''
				if (param && param.length > 0) {
					param.forEach((p) => {
						str += `'${p}',`
					})
				}
				return `(${str.substring(0, str.length - 1)})`
			},
			checkValue(val) {
				// 只有字符串才校验
				if (!val || typeof(val) !== 'string') {
					return false
				}
				for (let i = 0; i < this.character.length; i++) {
					if (val.toLowerCase().indexOf(this.character[i]) !== -1) {
						return true
					}
				}
				return false
			},
			// 清空查询条件
			clear() {
				this.model = {}
			}
		}
	}
</script>
