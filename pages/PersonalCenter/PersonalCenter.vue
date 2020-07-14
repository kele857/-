<template>
	<!-- 个人中心 -->
	<view class="personal">
		<view class="HeadPortrait">
			<text @click="Jump()" style="position: absolute;z-index: 10;right: 40rpx;top:20rpx;color: #8A6DE9;">编辑</text>
			<image style="width: 100%;height: 550rpx;" :src="picture" mode=""></image>
		</view>
		<view class="userInformation">
			<view class="one">
				<view class="name">
					<view style="width:150rpx;center;white-space:nowrap;overflow:hidden;text-overflow : ellipsis;">{{name}}</view>
					<view style="margin: 0 20rpx;background-color: #f4ea2a;border-radius:10rpx;padding:3rpx 15rpx;">1级</view>
					<image style="width: 80rpx;height: 50rpx;" src="../../static/img/female.png" mode=""></image>
				</view>
				<view class="level">
					<view>
						魅力值
					</view>
					<view style="margin:0 90rpx">
						身价
					</view>
				</view>
			</view>
			<view class="QRcode">
				<image style="width: 80rpx;height: 80rpx;" src="../../static/img/QRcode.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				picture:'',
				name:'',
			};
		},
		methods: {
			Jump(){
				uni.navigateTo({
				    url: '../edit/edit'
				});
			}
		},
		mounted() {
			var SNAME = this.checkLogin("SNAME");
			this.name=SNAME[0]
			this.picture=SNAME[1]
		}
	};
</script>

<style>
	.userInformation{
		position: relative;
		display: flex;
		/* align-items: center; */
		justify-content: space-between;
	}
	.name{
		/* width: 200rpx; */
		margin: 0 20rpx;
		display: flex;
	}
	.QRcode{
		margin-right: 20rpx;
	}
	.level{
		display: flex;
		margin-left: 20rpx;
		margin-top: 10rpx;
	}
</style>
