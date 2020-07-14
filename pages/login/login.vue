<template>
	<!-- 登录 -->
	<view>
			<view style="width: 100%;text-align: center;">
				<view class="content">
					<image style="width: 300upx;" src="../../static/img/icon.png"  mode="widthFix"></image>
					<view class="font1">一物一格</view>
					<view class="font2">社交天地</view>
				</view>
				<view style="margin-top: 55%;">
					<image @click="SignIn()" style="width:400upx;15upx;" src="../../static/img/wx.png" mode="widthFix"></image>
				</view>
				<!-- <view style="display: flex;margin-top: 460upx;padding-left: 15upx;padding-right: 15upx;">
					<image @click="log" style="margin: 15upx;" src="../../static/img/wx.png" mode="widthFix"></image>
					<image style="margin: 15upx;" src="../../static/img/Apple.png"  mode="widthFix"></image>
				</view> -->
					<view class="Agreement">
						<image @click="selection" v-if="agreement" style="width: 30upx;height: 30upx;margin-top:2upx;" src="../../static/img/Selection.png" mode=""></image>
						<image @click="checked" v-if='!agreement' style="width: 30upx;height: 30upx;margin-top:2upx;" src="../../static/img/Unchecked.png" mode=""></image>
						<text style="display: block;margin-left:10upx;">
							<text class="gray">登陆即代表你已阅读并同意</text>
							<text class="back">《用户使用协议》</text>
							<text class="gray">和</text>
							<text class="back">《隐私政策》</text>
						</text>
					</view>
				</view>
			</view>
			<!-- <view style="display: flex;height: 1000upx;"> -->
				<!-- <image style="margin: auto;border-radius: 20upx;" src="../../static/img/login.png" mode=""></image> -->
			<!-- </view> -->
			<!-- <button  style="position: absolute;bottom:100upx;width: 100%;" type="default">登录</button> -->
			
			
		</view>
</template>

<script>
	export default {
		data() {
			return {
				yonghuwx: [],
				token:'',	
				agreement:false,
				WinHeight:'',
				token1:'',
				ios:false
				
			}
		},
		// created() {
		// 	let that = this;
		// 	var USERSTORAGE = that.checkLogin("USERSTORAGE");
		// 	that.token1=USERSTORAGE[2];
		// 	console.log("判断登录TOKEN------",that.token1);
		// 	if(this.token1 != ''){
		// 		console.log("1--------1");
		// 		uni.switchTab({
		// 			url:'../index/index'
		// 		})
		// 	}else {
		// 		console.log('2-----2');
		// 	}
		// },
		// onShow() {
			
		// },
		onLoad(e) {
			if(uni.getSystemInfoSync().platform == 'ios'){
				this.ios=true
			}else{
				this.ios=false
			}
			
			// console.log(uni.getSystemInfoSync().platform == 'ios');
			// uni.getSystemInfo({
			// 	success(res){
			// 		that.WinHeight = res.windowHeight*0.2;
			// 		// console.log("屏幕高度",that.WinHeight);
			// 	}
			// });

		},
		methods: {
			
			selection(){
				this.agreement=false;
			},
			checked(){
				this.agreement=true;
			},
			SignIn(){
				// uni.showModal({ content: '登录中', showCancel: false, });
				uni.showLoading({title:'登录中'});
				let that = this;
				if(this.agreement){
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							// 获取用户信息				
							uni.getUserInfo({
								provider: 'weixin',
								success: function(infoRes) {
									that.yonghuwx = infoRes.userInfo
									uni.request({
										url:'http://social.wgzy69.com/api/userStorage',
										method:'POST',
										data:that.yonghuwx
									}).then((res)=>{
										 for(var i=0;i<res.length;i++){
											 var re=res[i]
										 }
										 that.key=re.data.token;
										if(re.data.code==200){
											 uni.setStorageSync('USERSTORAGE',that.key);
											 console.log(that.key);
											 uni.request({
											 	url:`http://social.wgzy69.com/api/getUserInfo`,
												method:'GET',
												data:{
													token:that.key
												},
											 }).then((res)=>{
												 uni.hideLoading();
												 console.log("22222",res);
												 for(var i=0;i<res.length;i++){
													var re=res[i]
												 }
												 if(re.data.code == 200){
													 uni.setStorageSync('INFO',re.data.data);
													 uni.setStorageSync('NAMEID',re.data.data.user_id);
													 uni.setStorageSync('SNAME',re.data.data.nickname);
													 uni.setStorageSync('SFACE',re.data.data.photo_url);
													 uni.setStorageSync('USERSTORAGE',that.key);
													 uni.setStorageSync('SEX',re.data.data.sex);
													 uni.setStorageSync('ACTION',re.data.data.location);
													 uni.setStorageSync('BIRTHDAY',re.data.data.birthday);
													 uni.hideLoading();
													 uni.switchTab({
														url: '../index/index'
													 });
												 }else{
													 setTimeout(function() {
														 uni.showModal({ content: '登录失败', showCancel: false, });
													 	// uni.showLoading({title:'登录失败'});
													 }, 6000);
													 uni.hideLoading();
												 }
											 }).catch((err)=>{
												 console.log(err);
											 })
										 }
									}).catch((err)=>{
										console.log(err);
									})
								}
							});
						}
					});
				}else{
					uni.showToast({
						title: "请先阅读并同意",
						icon: 'none',
						duration: 2000
					});
				}
				
			}
		},
	}
</script>

<style>
	.content{
		width: 100%;
		/* position: absolute; */
		margin-top: 20%;
		/* margin: 0 auto; */
	}
	.font1{
		font-size:60upx;
		font-family:PingFang SC;
		font-weight:bold;
		color:#D4DAE6;
		margin-top: 10upx;
	}
	.font2{
		font-size:60upx;
		font-family:PingFang SC;
		font-weight:bold;
		color:#939AA8;
		margin-top: 10upx;
	}
	.Agreement{
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 24upx;
		margin-top:15%;
	}
	.gray{
		color:#9198A7;
	}
</style>
