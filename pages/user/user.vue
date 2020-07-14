<template>
	<view class="user">
		<view class="messageList">
			<view class="mlLeft" @click="porsonal">
				<image style="width: 100upx;height: 100upx;border-radius: 50%;" :src="sface" mode=""></image>
				<!-- <view style="width: 100upx;height: 100upx;border-radius: 50%;background-color: #6739B6;"></view> -->
				<view class="mlLeftText">
					<view class="text1">{{sname}}</view>
					<view class="text2">ID：{{info.user_id}}</view>
				</view>
			</view>
			<view class="time">
				<!-- <image src="../../static/one/dateRight.png"></image> -->
			</view>
		</view>
		<view class="userBottom">
			<view class="value">
				<view class="left">
					<image src="../../static/one/stars.png"></image>
					<view class="typeface">身价</view>
				</view>
				<view class="textColor">{{info.gold}}金币</view>
				<view class="time">
					<!-- <image src="../../static/one/dateRight.png"></image> -->
				</view>
			</view>
			<view class="value">
				<view class="left">
					<image src="../../static/one/Grade.png"></image>
					<view class="typeface">等级</view>
				</view>
				<view class="textColor">LV{{info.levels}}</view>
				<view class="time">
					<!-- <image src="../../static/one/dateRight.png"></image> -->
				</view>
			</view>
			<view class="value" @click="personal">
				<view class="left">
					<image src="../../static/one/data.png"></image>
					<view class="typeface">资料</view>
				</view>
				<view class="time">
					<image src="../../static/one/dateRight.png"></image>
				</view>
			</view>
			<view class="value" @click="PhotoWall">
				<view class="left">
					<image src="../../static/one/album.png" mode="aspectFill" class="album"></image>
					<view class="typeface">相册</view>
				</view>
				<view class="time">
					<image src="../../static/one/dateRight.png"></image>
				</view>
			</view>
			<view class="value" @click="autograph1">
				<view class="left">
					<image src="../../static/one/signature.png"></image>
					<view class="typeface">个签</view>
				</view>
				<view class="time">
					<image src="../../static/one/dateRight.png"></image>
				</view>
			</view>
			<view class="value">
				<view class="left">
					<image src="../../static/one/setup.png"></image>
					<view class="typeface">设置</view>
				</view>
				<view class="time">
					<image src="../../static/one/dateRight.png"></image>
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
				sface:'',
				sname:'',
				info:''
			}
		},
		onShow() {
			var SNAME = this.checkLogin("SNAME");
			var SFACE = this.checkLogin("SFACE");
			// var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.sname=SNAME[0];
			this.sface=SFACE[1];
			
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			// console.log(this.token);
			let data={token:this.token};
			request.get('getUserInfo',data).then(res=>{
				this.$token(res.code==500);
				this.info=res.data;
				this.autograph=this.info.signature.split(",")
				// console.log("个人信息接口",this.info);
				if(this.info.photo.length!==0){
					this.ph=this.info.photo.slice(0,5);
					// console.log("图片",this.ph);
				}
				// if(res.code==200){
				// 	this.friendInformation=res.data;
				// 	console.log("INFO中的值",this.friendInformation);
				// 	this.autograph=this.data.signature.split(",");
				// }
			})
		},
		methods:{
			porsonal(){
				uni.navigateTo({
				    url: '../friendInformation/friendInformation'
				});
			},
			PhotoWall(){
				uni.navigateTo({
				    url:`../album/album?ph=${encodeURIComponent(JSON.stringify(this.info.photo))}`
				});
			},
			autograph1(){
				uni.navigateTo({
				    url: '../autograph/autograph'
				});
			},
			personal(){
				uni.navigateTo({
				    url: '../edit/edit',
					animationDuration: 1
				});
			},
		}		
	}
</script>

<style scoped>
   .user{
		width: 100%;
		padding: 80upx 0;
   }
   .messageList{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10%;
		padding-bottom: 40upx;
		border-bottom: 16upx solid #F4F4F4;
   }
   .mlLeft{
		display: flex;
		align-items: center;
   }
   .mlLeftText{
		margin-left: 20upx;
   }
   .text1{
		font-size:30upx;
		font-weight:bold;
		color:#242424;
   }
   .text2{
		font-size:30upx;
		font-weight:400;
		color:#AAAAAA;
		margin-top:15upx;
   }
   .time{
		display: flex;
		align-items: center;
   }
   .time>image{
	    width: 16upx;
		height: 20upx;
   }
   .value{
	    margin-left: 40upx;
	    padding: 32upx 42upx;
	    display: flex;
	    justify-content: space-between;
	    border-bottom: 6upx solid #F4F4F4;
   }
   .left{
	    display: flex;
	    justify-content: space-between;
   }
   .left>image{
	    width: 40upx;
		height: 40upx;
   }
   
   .album {
	   width: 40upx!important;
	   height: 32upx!important;
   }
   .textColor{
	    color:#AAAAAA;
	    margin-left: -40upx;
	    display: flex;
	    align-items: center;
   }
   .typeface{
		margin-left: 20upx;
		display: flex;
		align-items: center;
   }
</style>
