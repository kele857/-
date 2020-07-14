<template>
	<view class="PhotoWall">
		<view style="width: 100%;display: flex;justify-content: space-between;flex-wrap:wrap">
			<view vi-if="url==''">该用户还没有上传图片哟！</view>
			<image v-for="item in url" style="width: 200upx;height: 200upx;margin-top: 20upx;border-radius: 20upx;" :src="'http://social.wgzy69.com/'+item.circle_url" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				url:'',
				img:["../../static/img/login1.png","../../static/one/game.png"],
			}
		},
		onShow() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			var FRIENFIN = this.checkLogin("FRIENFIN");
			this.friendInformation=FRIENFIN[3];
		},
		methods:{
			// 照片墙
			PhotoWall(){
				let data={token:this.token};
				request.get('PhotoWall',data).then(res=>{
					this.$token(res.code)
					this.url=res;
					// console.log("照片墙",res);
				})
			}
		}		
	}
</script>

<style>
   .PhotoWall{
	   margin: 0 40upx;
   }
</style>
