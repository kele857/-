<template>
	<view class="romm">
		<view class="title">
			推荐房间
		</view>
		<view class="rommContent">
			<view class="headPortrait"></view>
			<view class="rContent">
				<view>
					<view class="roomNumber">房号：163286</view>
					<view class="roomNumber1">建设那个默默</view>
				</view>
				<view class="getInto">
					进入
				</view>
			</view>
		</view>
		<view class="rommContent">
			<view class="headPortrait"></view>
			<view class="rContent">
				<view>
					<view class="roomNumber">房号：163286</view>
					<view class="roomNumber1">建设那个默默</view>
				</view>
				<view class="getInto">
					进入
				</view>
			</view>
		</view>
		<view class="rommContent">
			<view class="headPortrait"></view>
			<view class="rContent">
				<view>
					<view class="roomNumber">房号：163286</view>
					<view class="roomNumber1">建设那个默默</view>
				</view>
				<view class="getInto">
					进入
				</view>
			</view>
		</view>
		<view class="rbottom">
			<view class="rbcontent">
				<image @click="getinto" src="../../static/one/radius.png" mode="">
				
				</image>
			</view>
		</view>
		<!-- 房间弹窗 -->
		<view class="room" v-if="root">
			<view class="bg" @click="esc"></view>
			<view class="content">
				<view class="roomTitle">
					搜索房间号
				</view>
				<view class="top">
					<!-- <image style="width: 50upx;height: 50upx;margin:5upx 25upx;" src="../../static/img/root.png" mode=""></image> -->
					<input
						type="text"
						class="input"
						placeholder="输入房间ID"
						placeholder-class="graywords"
						maxlength="10"
						placeholder-style="font-weight:bold;font-size:14px;color:#898989;text-align: center;"
						v-model="roomNumber"
						/>
				</view>
				<view class="option">
					<view @click="cancel" class="Rcancel">取消</view>
					<view class="determine">确定</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		// components: {uniCalendar},
		data() {
			return {
				name:'',
				picture:'',
				roomNumber:'',
				oldroomNumber:'321118977',
				root:false,
				token:''
			};
		},
		onShow() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			var SNAME = this.checkLogin("SNAME");
			var SFACE = this.checkLogin("SFACE");
			var PHOTO = this.checkLogin("PHOTO");
			this.name=SNAME[0]
			this.picture=SNAME[1]
		},
		//获取当前经纬度
		mounted() {
			let me = this;
			// console.log(this.token);
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
			        // console.log('当前位置的经度：' + res.longitude + '当前位置的纬度：' + res.latitude);
					uni.request({
						url:`http://social.wgzy69.com/api/location`,
						method:'POST',
						data:{
							token:me.token,
							longitude:res.longitude,
							latitude:res.latitude
						},
					}).then((res)=>{
						me.$token(res.code==500)
						// console.log("返回",res);
					}).catch((err)=>{
						console.log(err);
					})
			    }
			});
		},
		methods:{
			getinto(){
				this.root=true;
			},
			cancel(){
				this.root=false;
			},
			esc(){
				this.root=false;
			},
		},
	}
</script>

<style>
	.romm{
		margin-left: 20px;
	}
	.title{
		font-size:16px;
		font-weight:bold;
		color: #000000;
		margin-top: 10px;
	}
	.rommContent{
		display: flex;
		justify-content: space-between;
		margin-top:20px;
	}
	.headPortrait{
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background-color: #6739B6;
	}
	.rContent{
		display: flex;
		justify-content: space-between;
		width: 73%;
		border-bottom: 1px dashed #000000;
		margin-top:10px;
		padding-bottom:15px;
	}
	.getInto{
		width: 50px;
		text-align: center;
		height: 30px;
		border-radius: 5px;
		background-color: #FCF15D;
		font-size:14px;
		font-weight:bold;
		color:#313131;
		line-height: 30px;
		margin-right: 20px;
		margin-top:15px;
	}
	.roomNumber{
		font-size:14px;
		font-weight:bold;
		color:#313131;
	}
	.roomNumber1{
		font-size:32px;
		font-size:14px;
		color:#AAAAAA;
	}
	.rbottom{
		width: 100%;
		height: 90px;
		position: absolute;
		bottom:0;
	}
	.rbcontent{
		margin-left:23%;
	}
	.rbcontent>image{
		width: 180px;
		height: 40px;
	}
	/* 房间弹窗 */
	.bg{
		width:100%;
		position: fixed;
		height:100%;
		bottom:0;
		left:0;
		background-color: rgba(0,0,0,.6);
	}
	.room{
		width:100%;
		position: fixed;
		height:100%;
		bottom:0;
		left:0;
		display: flex;
		align-items: center;	
	}
	.content{
		position: relative;
		text-align: center;
		width: 80%;
		height: 180PX;
		background-color: #FFFFFF;
		margin:auto;
		border-radius: 5PX;
	}
	.roomTitle{
		color:#313131;
		margin-bottom: 10px;
		font-weight:bold;
		margin-top: 15PX;
		margin-bottom: 20PX;
		font-size: 16px;
	}
	.top{
		display: flex;
		height: 35PX;
		margin:auto;
		border-radius: 5PX;
		width: 80%;
		background-color: #DFDFDF;
	}
	.top>input{
		width: 100%;
		margin-top:15upx;
	}
	.option{
		width: 65%;
		margin:40px auto;
		display: flex;
		justify-content: space-between;
	}
	.Rcancel,.determine{
		width: 85px;
		font-weight:bold;
		color:#313131;
		font-size: 16px;
		padding:6px;
		border-radius: 20px;
	}
	.Rcancel{
		background-color: #DFDFDF;
	}
	.determine{
		background-color: #FCF15D;
	}
</style>
