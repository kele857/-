<template>
	<view class="PhotoWall">
		<!-- <image v-for="item in photo" :src="'http://social.wgzy69.com/'+item.circle_url" mode=""></image> -->
		<view style="width: 100%;display: flex;flex-wrap:wrap;" >
			<view v-if="photo.length==0">该用户还没有上传图片哟！</view>
			<view style="padding: 16upx;" v-for="(item,index) in photo" @click="previewImage(photo,index)">
				<image  :src="'http://social.wgzy69.com/'+item.circle_url" lazy-load style="width: 200upx;height: 200upx;margin-top: 20upx;border-radius: 20upx;" mode="aspectFill"></image>
			</view>
			
		</view>
		<!-- <view v-if="photo.length==0"  style="width: 100%;display: flex;justify-content: space-between;flex-wrap:wrap">
			<view v-if="photo==''">该用户还没有上传图片哟！</view>
			<image v-for="item in photo" :src="'http://social.wgzy69.com/'+item.circle_url" style="width: 200upx;height: 200upx;margin-top: 20upx;border-radius: 20upx;" mode="aspectFill"></image>
		</view> -->
	</view>
</template>

<script>
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				friendInformation:'',
				photo:''
			}
		},
		onLoad(option) {
		    const photo = JSON.parse(decodeURIComponent(option.ph));
			this.photo=photo;
			console.log("个人中心的图片",this.photo);
		},
		onShow() {
			// var USERSTORAGE = this.checkLogin("USERSTORAGE");
			// this.token=USERSTORAGE[2];
			// var FRIENFIN = this.checkLogin("FRIENFIN");
			// this.friendInformation=FRIENFIN[3];
			// console.log("xaingc",this.friendInformation);
		},
		methods:{
			previewImage(imageList, image_index) {
				var imgList=[];
				for(var i=0;i<imageList.length;i++){
					imgList.push('http://social.wgzy69.com/'+imageList[i].circle_url);
				}
				var current = imageList[image_index];
				uni.previewImage({
					current: current.circle_url,
					urls: imgList
				});
			},
		}		
	}
</script>

<style>
   .PhotoWall{
	   margin: 0 30upx;
   }
</style>
