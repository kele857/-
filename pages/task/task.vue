<template>
	<view class="task">
		<view class="Tnavigation">
			<view class="TNleft">
				<view :class="{'chooseWord':state}">每日任务</view>
				<view class="TNborder" v-if="state"></view>
			</view>
			<!-- <view class="TNleft" @click="nav">
				<view :class="{'chooseWord':!state}">成长任务</view>
				<view class="TNborder" v-if="!state"></view>
			</view> -->
		</view>
		<view class="taskContent">
			<view class="tc">
				<view class="tcTop">
					<view>签到</view>
					<view>0/1</view>
				</view>
				<view class="tcBootm">
					<view class="iconfont">
						<view class="Itext">
							<image src="../../static/one/goldCoin.png" mode=""></image>
							<text class="iconfontText">金币X123</text>
						</view>
						<view class="Itext">
							<image src="../../static/one/integral.png" mode=""></image>
							<text class="iconfontText">经验X123</text>
						</view>
					</view>
					<view class="ButtonTask" @click="signIn">做任务</view>
				</view>
			</view>
		</view>
		<view class="taskContent">
			<view class="tc">
				<view class="tcTop">
					<view>加好友</view>
					<view>0/1</view>
				</view>
				<view class="tcBootm">
					<view class="iconfont">
						<view class="Itext">
							<image src="../../static/one/goldCoin.png" mode=""></image>
							<text class="iconfontText">金币X123</text>
						</view>
						<view class="Itext">
							<image src="../../static/one/integral.png" mode=""></image>
							<text class="iconfontText">经验X123</text>
						</view>
					</view>
					<view class="ButtonTask" @click="newFriends">做任务</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				state:true,
				CheckStatus:''
			};
		},
		onShow() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			this.interface();
		},
		onLoad() {
			
		},
		methods: {
			newFriends(){
				uni.switchTab ({
					url:"../news/news"
				})
			},
			signIn(){	
				uni.navigateTo({
				    url: '../signIn1/signIn1'
				});
			},
			interface() {
				let data={token:this.token};
				request.get('TaskList',data).then(res=>{
					this.$token(res.code==500);
					// console.log("接口",res);
				})
			},
			nav(){
				uni.showToast({
					title: "功能暂未开放",
					icon: 'none',
					duration: 2000
				}); 
				// if(this.state==true){
				// 	this.state=false
				// }else{
				// 	this.state=true
				// }
			}
		}
	};
</script>

<style>
	.Tnavigation{
		display: flex;
		justify-content: space-between;
		width: 80%;
		margin: auto;
		padding: 20px;
	}
	
	.TNleft {
		font-weight: 800;
		color: #AAAAAA;
		font-size: 32upx;
	}
	
	.chooseWord {
		color: #000!important;
	}
	
	.TNborder{
		margin:auto;
		width: 40px;
		height: 4px;
		margin-top:10upx;
		background-color: #F9DE4A;
		border-radius: 10px;
	}
	.taskContent{
		width: 100%;
		padding:10px 25px;
	}
	.tcTop{
		display: flex;
		justify-content: space-between;
		font-weight:bold;
		color:#242424;
	}
	.tcBootm{
		display: flex;
		justify-content: space-between;
		margin-top:15px;
	}
	.iconfont{
		width: 50%;
		display: flex;
		justify-content: space-between;
	}
	.Itext{
		display: flex;
		align-items: center;
		font-size: 12px;
	}
	.Itext>image{
		width: 28px;
		height: 28px;
	}
	.iconfontText{
		width: 40px;
		font-size: 12px;
		margin-left: 10px;
		color: #242424;
	}
	.ButtonTask{
		width: 50px;
		background-color: #F9DE4A;
		border-radius: 5px;
		text-align: center;
		padding-top:5px;
		font-weight:800;
		margin-right: -15px;
	}
</style>
