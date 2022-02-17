<!-- 蓝色登录页面2 -->
<template>
	<view style="height:100vh;background: #fff;">
		<view class="img-a">
			<view class="t-b">
				您好，
				<br />
				欢迎使用智能燃气终端
			</view>
		</view>
		<view class="login-view" style="">
			<view class="t-login">
				<view class="cl">
					<view class="t-a">
						<text class="txt">账号</text>
						<input type="text" name="ename" placeholder="请输入您的账号" maxlength="11" v-model="ename" />
					</view>
					<view class="t-a">
						<text class="txt">密码</text>
						<input type="password" name="password" maxlength="18" placeholder="请输入您的密码"
							v-model="password" />
					</view>
					<button @click="login()" :loading="disabled" :disabled="disabled" loadingText="正在登录">登 录</button>
				</view>
			</view>
		</view>
		<u-loading-page :loading="disabled" bgColor="rgba(0, 0, 0, 0.5)" loadingMode="spinner" loading-text="正在登陆">
		</u-loading-page>
		<u-loading-page :loading="initSqllite" loading-text="正在初始化,请耐心等待">
		</u-loading-page>
	</view>
</template>
<script>
	import JSEncrypt from '../../util/jsencrypt.js'
	import {
		mapMutations
	} from 'vuex'
	import {
		userLogin,
		getDBConfig
	} from '../../util/api'
	export default {
		data() {
			return {
				ename: '', //账号
				password: '', //密码
				disabled: false,
				initSqllite: false
			};
		},
		async onLoad() {
			//判断是否是首次进入app，首次进入需要对sqllite进行初始化
			try {
				const value = uni.getStorageSync('initLogin')
				if (value) {
					console.log('非首次进入，无须初始化，直接开始加载登陆页')
					console.log('t_serviceworkorder',JSON.stringify(uni.getStorageSync('t_serviceworkorder')))

				} else {
					console.log('首次进入，开始初始化sqlite')
					this.initSqllite = true
					/*
					sqllite初始化方法
					*/
					await this.initSqlite()
					this.initSqllite = false
					console.log('初始化sqlite完成')
					uni.setStorageSync('initLogin', true);
				}
			} catch (e) {
				// error
				console.log('初始化异常', e)
			}

		},
		methods: {
			...mapMutations(['setLoginUser']),
			//当前登录按钮操作
			login(e) {
				var that = this;
				if (!that.ename) {
					uni.showToast({
						title: '请输入您的手机号',
						icon: 'none'
					})
					return
				}
				if (!that.password) {
					uni.showToast({
						title: '请输入您的密码',
						icon: 'none'
					})
					return
				}
				let data = {
					username: this.ename,
					password: this.password
				}
				console.log('获取登陆信息：' + data)
				let encrypt = new JSEncrypt();
				encrypt.setPublicKey(
					'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqPvovSfXcwBbW8cKMCgwqNpsYuzF8RPAPFb7LGsnVo44JhM/xxzDyzoYtdfNmtbIuKVi9PzIsyp6rg+09gbuI6UGwBZ5DWBDBMqv5MPdOF5dCQkB2Bbr5yPfURPENypUz+pBFBg41d+BC+rwRiXELwKy7Y9caD/MtJyHydj8OUwIDAQAB'
				);
				data = encrypt.encrypt(JSON.stringify(data))
				console.log(data)
				this.disabled = true
				userLogin(data).then(res => {
					console.log('获取登陆信息：' + JSON.stringify(res.data))
					console.log('当前登录人员：' + res.data.name)
					// uni.showToast({
					// 	title: '登录成功！',
					// 	icon: 'none'
					// })
					console.log('99999999999999')
					console.log(this.$store)
					this.setLoginUser(res.data)
					this.disabled = false
					uni.navigateTo({
						url: './index'
					})
				}).catch(err => {
					uni.showToast({
						title: '登陆失败,请检查账号密码是否有误,如多次失败请联系管理员核对账号密码！',
						icon: 'none',
						duration: 4000
					})
					this.disabled = false
					return
				})

			},
			async initSqlite() {
				// setTimeout(()=>{
				// 	console.log('6666666666')
				// },5000)
				let res = await getDBConfig({})
				const tables = res.data
				for (let table in tables) {
					console.log('table', table)
					uni.setStorageSync(table, tables[table])
				}

			}
		}
	}
</script>
<style>
	.txt {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	.img-a {
		width: 100%;
		height: 450rpx;
		background-image: url('../../static/image/head.png');
		background-size: 100%;
	}

	.reg {
		font-size: 28rpx;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
		background: #f5f6fa;
		color: #000000;
		text-align: center;
		margin-top: 30rpx;
	}

	.login-view {
		width: 100%;
		position: relative;
		margin-top: -120rpx;
		background-color: #ffffff;
		border-radius: 8% 8% 0% 0;
	}

	.t-login {
		width: 600rpx;
		margin: 20rpx auto;
		font-size: 28rpx;
		padding-top: 80rpx;
	}

	.t-login button {
		font-size: 28rpx;
		background: #2796f2;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
	}

	.t-login input {
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		border-bottom: 1px solid #e9e9e9;
		font-size: 28rpx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-b {
		text-align: left;
		font-size: 42rpx;
		color: #ffffff;
		padding: 130rpx 0 0 70rpx;
		font-weight: bold;
		line-height: 70rpx;
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #5677fc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 150rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #aeaeae;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}
</style>
