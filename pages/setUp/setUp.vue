<template>
	<view class="setUp">
		<!-- <view style="width: 100%;height: 6upx;"></view> -->
		<view class="modifyNotes" @click="nickname">
			<view class="">修改备注名</view>
			<image src="../../static/one/dateRight.png" mode="widthFix"></image>
		</view>
		<view class="STcontent">
			<view class="uni-padding-wrap uni-common-mt STTop" style="border-bottom: 6upx solid #F4F4F4;">
				<view style="display: flex;align-items: center;">加入黑名单</view>
				<view class="uni-list-cell uni-list-cell-pd">
					<switch color="#F9DE4A" @change="switch1Change" />
				</view>
			</view>
			<view class="STBottom" @click="report">
				<view class="">举报此用户</view>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="delete" @click="dele">
			删除好友
		</view>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				id:''
			}
		},
		onShow() {
			var USERSTORAGE =this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			// console.log(this.token);
		},
		onLoad(option) {
			this.id=option.id;
			 // console.log("好友",option.id);
		},
		methods: {
			nickname(){
				uni.navigateTo({
				    url:`../ModifyNotes/ModifyNotes?id=${this.id}`
				});
			},
			blacklist(val) {
				// console.log(this.token);
				let data={
					token:this.token,
					friend_id:this.id,
					bla_type:val
				};
				request.get('blacklist',data).then(res=>{
					this.$token(res.code==500);
					// console.log("黑名单",res);
				})
			},
			dele(){
				console.log("1111");
				let data={
					token:this.token,
					friend_id:this.id
				};
				request.get('DeleteFriend',data).then(res=>{
					this.$token(res.code==500);
					// console.log("删除接口",res.msg);
					if(res.code==200){
						uni.showToast({
							title: res.msg,
							icon: 'success',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
	        switch1Change: function (e) {
	            console.log(e.target.value)
				if(e.target.value==true){
					this.blacklist(1);
				}else if(e.target.value==false){
					this.blacklist(2);
				}
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

<style scoped>
	/* page{
		background: #F3F3F3;
	} */
	.setUp{
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
	.modifyNotes>image{
		width: 24upx;
	}
	.modifyNotes{
		margin-top:36upx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding:30upx 20upx;
	}
	.STcontent{
		margin-top:36upx;
	}
	.STcontent>view>image{
		width: 24upx;
	}
	.STTop{
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding:24upx 20upx;
	}
	.STBottom{
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding:30upx 20upx;
	}
	.switch{
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: #FFFFFF;
	}
	.delete{
		margin-top:36upx;
		background-color: #FFFFFF;
		padding:30upx 20upx;
		text-align: center;
		color: #D55047;
	}
</style>
