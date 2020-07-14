<template>
	<view class="newFriends">
		<view class="nfTop">
			<image style="width: 23px;height: 21px;margin:5upx 25upx;" src="../../static/one/search.png" mode=""></image>
			<input
				type="text"
				class="input"
				placeholder="请输入用户ID"
				placeholder-class="graywords"
				maxlength="10"
				placeholder-style="color:#B1B1B1;font-size:14px;"
				v-model="number"
				/>
		</view>
		<view class="search" @click="sear">
			搜索
		</view>
		<view class="QRcode" @click="state">
			<view class="QRcodeTop">
				<image src="../../static/one/meQRcode.png" mode=""></image>
				<text class="meQRcode">我的二维码</text>
			</view>
			<view class="QRcodeLeft">
				<image src="../../static/one/left.png" mode=""></image>
			</view>
		</view>
		<view class="QRcode"  @click="state">
			<view class="QRcodeTop">
				<image src="../../static/one/scan1.png" mode=""></image>
				<text class="meQRcode">扫一扫</text>
			</view>
			<view class="QRcodeLeft">
				<image src="../../static/one/left.png" mode=""></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				number:'',
				token:''
			};
		},
		onShow() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2]
		},
		methods: {
			state(){
				uni.showToast({
					title: "功能暂未开放",
					icon: 'none',
					duration: 2000
				}); 
			},
			//搜索好友接口
			sear(){
				// console.log("1111")
				// console.log(this.token)
				uni.setStorageSync('FRIENDSID',this.number);
				uni.request({
					url:`http://social.wgzy69.com/api/addFriends`,
					method:'GET',
					data:{
						token:this.token,
						friends_id:this.number
					},
				 }).then((res)=>{
					 this.$token(res.code);
					 for(var i=0;i<res.length;i++){
					 	var re=res[i]
					 }
					 // uni.setStorageSync('FRIENFIN',re.data.data);
					 // console.log(re.data);
					 if(re.data.code==200){
						 uni.navigateTo({
						     url: `../friendInformation1/friendInformation1?item=${encodeURIComponent(JSON.stringify(re.data.data))}`
						 });
					 }
					 // else{
						// uni.showToast({
						// 	title: re.data.msg,
						// 	icon: 'none',
						// 	duration: 2000
						// });
					 // }
					 // else if(re.data.code==300){
						//  uni.navigateTo({
						//      url: '../PersonalCenter/PersonalCenter'
						//  });
					 // }
				 }).catch((err)=>{
					console.log(err);
				 })
			},
		},
		mounted() {
			// console.log(this.date)
		},
	};
</script>

<style>
	.nfTop{
		display: flex;
		justify-content: center;
		width: 90%;
		margin:24px auto;
		background-color: #F6F7F9;
		border-radius: 20px;
		padding:5px 0;
	}
	.input{
		width: 30%;
		margin-top:5upx;
	}
	.search{
		width: 80px;
		text-align: center;
		background-color: #FCF15D;
		border-radius: 20px;
		margin:-10px auto;
		font-weight:bold;
		font-size: 14px;
		padding:3px;
	}
	.QRcode{
		width: 90%;
		margin: auto;
		display: flex;
		justify-content: space-between;
		margin-top:25px;
	}
	.QRcodeTop{
		display: flex;
		justify-content: left;
		align-items: center;
	}
	.meQRcode{
		font-weight:bold;
		color:#242424;
		margin-left: 20px;
		font-size: 14px;
	}
	.QRcodeTop>image{
		width: 50px;
		height: 50px;
	}
	.QRcodeLeft{
		display: flex;
		align-items: center;
	}
	.QRcodeLeft>image{
		width: 10px;
		height: 14px;
	}
</style>
