<template>
	<view class="setUp1">
		<view class="uni-padding-wrap uni-common-mt STTop" style="border-bottom: 6upx solid #F4F4F4;" @click="report">
			<view style="display: flex;align-items: center;">举报此用户</view>
			<view class="STBottom" @click="report">
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:''
			}
		},
		onLoad(option) {
			this.id=option.id;
			 // console.log("好友",option.id);
		},
		methods: {
	        switch1Change: function (e) {
	            console.log(e.target.value)
	        },
			report(){
				console.log(this.id);
				uni.navigateTo({
				    url:`../report/report?id=${this.id}`
				});
			}
		}
	}
</script>

<style>
	.setUp1{
		font-size:28upx;
		font-weight:bold;
		color:#3D3D3D;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #F3F3F3;
	}
	.STTop{
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding:30upx 20upx;
		margin-top: 36upx;
	}
	.STBottom>image{
		width: 24upx;
	}
	/* .STBottom{
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding:30upx 20upx;
	} */
</style>
