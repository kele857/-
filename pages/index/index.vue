<template>
	<view class="index" id="index" :style="{height:scrollH + 'px;'}">
		<view class="personalInformation">
			<view class="task">
				<image @click="porsonal" :src="sface" mode=""></image>
				<!-- <image @click="porsonal" src="../../static/one/newFriends.png" mode="widthFix"></image> -->
			</view>
			<view class="name">
				<view class="NGinformation">
					<view class="nametext">
						{{sname}}
					</view>
					<view class="grade">
						{{info.levels}}级
					</view>
				</view>
				<!-- <view class="nametext">
					奔雷手文泰
				</view> -->
				<view class="goldCoin">
					<image src="../../static/one/goldCoin.png"></image>
					<text>{{info.gold}}</text>
					<!-- <image src="../../static/one/add.png"></image> -->
				</view>
			</view>
		</view>
		<view class="indexNavigation">
			<!-- taskTo -->
			<view class="task" @click="$dianji(taskTo)">
				<image src="../../static/one/task.png"></image>
				<view class="taskText">任务</view>
			</view>
			<view class="task" @click="getinto">
				<image src="../../static/one/room.png"></image>
				<view class="taskText">房间</view>
			</view>
			<view class="task" @click="$dianji(signIn)">
				<image src="../../static/one/SignIn.png"></image>
				<view class="taskText">签到</view>
			</view>
		</view>
		<view class="friendsPlaying">
			<view class="fptop" @click="cs">
				<view class="fptopText">
					好友在玩
				</view>
				<view class="fptopRight">
					<text>更多</text>
					<image src="../../static/one/left.png"></image>
				</view>
			</view>
			<view class="fpbottom" @click="map">
				<view>
					<image src="../../static/one/top.png"></image>
					<view class="fpname">
						<view class="fpnameTex">
							<text></text>
							<!-- <image src="../../static/one/male.png"></image> -->
						</view>
						<view class="fpnameTex1">
							<text>物格天地</text>
							<image src="../../static/one/left.png"></image>
						</view>
					</view>
				</view>
				<view>
					<image src="../../static/one/top.png"></image>
					<view class="fpname">
						<view class="fpnameTex">
							<text></text>
							<!-- <image src="../../static/one/male.png"></image> -->
						</view>
						<view class="fpnameTex1">
							<text>物格天地</text>
							<image src="../../static/one/left.png"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="game">
			<view class="gametop">
				游戏
			</view>
			<!-- <view  @click="map"> -->
			<image @click="map" style="border-radius: 20upx;width: 660upx;" src="../../static/one/game.png" mode="widthFix"></image>
			<!-- </view> -->
		</view>
		<view class="room" v-if="root">
			<view class="bg" @click="cancel"></view>
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
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				roomNumber:'',
				root:false,
				sname:'',
				sface:'',
				sex:'',
				scrollH:'',
				info:'',
				token:'',
				onoff:true
			}
		},
		created() {
			var SNAME = this.checkLogin("SNAME");
			this.sname=SNAME[0];
			// console.log("snameIndex",this.sname);
		},
		onLoad() {
			var aa = getApp().globalData.userinfo
			console.log('aa',aa)
			

		},
		onShow() {
			uni.getSystemInfo({
				success: res => {
					// console.log("高度",res);
					this.scrollH = res.windowHeight - uni.upx2px(10);
					// console.log("高度",this.scrollH);
				}
			});
			
			
			
				var that=this;
				var SNAME = that.checkLogin("SNAME");
				var SFACE = that.checkLogin("SFACE");
				var SEX = that.checkLogin("SEX");
				var INFO = that.checkLogin("INFO");
				var USERSTORAGE = that.checkLogin("USERSTORAGE");
				that.token=USERSTORAGE[2];
				// console.log("地图",that.token);
				that.sname=SNAME[0];
				that.sface=SFACE[1];
				that.sex=SEX[6];
				that.info=INFO[9];
				// console.log("1.----sname",that.info);
				// console.log("2.----sface",that.sex);
				// console.log("3.----sface",that.info);
				// console.log("4.----info",that.sex);
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
				        // console.log('当前位置的经度：' + res.longitude);
				        // console.log('当前位置的纬度：' + res.latitude);
						let data={
							token:that.token,
							longitude:res.longitude,
							latitude:res.latitude,
						};
						request.post('location',data).then(res=>{
							// console.log("定位",res);
							that.$token(res.code);
						})
				    }
				});
			
			
			// this.$nextTick(function() {
			// 	uni.getSystemInfo({
			// 		success: res => {
			// 			const query = uni.createSelectorQuery().in(this);
			// 			query.select('#index').boundingClientRect(data => {
			// 					// this.scrollH = `${data.height}px;`;
			// 					console.log("高度",data.height)
			// 				}).exec();
			// 		}
			// 	});
			// });
		},
		methods: {
			cs(){
				uni.navigateTo({
					url:"../map/map"
				})
				// uni.navigateTo({
				//     url: '../login/login'
				// });
			},
			// room(){
			// 	uni.navigateTo({
			// 	    url: '../room/room'
			// 	});
			// },
			porsonal(){
				uni.navigateTo({
				    url: '../friendInformation/friendInformation'
				});
			},
			signIn(){
				uni.navigateTo({
				    url: '../signIn1/signIn1'
				});
				return
			},
			map(){
				uni.navigateTo({
					url:"../map/map"
				})
			},
			taskTo(){
				uni.navigateTo({
					url: '../task/task'
				});
				return
			},
			getinto(){
				uni.navigateTo({
					url:"../map/map"
				})
				// this.root=true;
			},
			cancel(){
				this.root=false;
			}
		}
	}
</script>

<style>
	/* .webView{
		background-image: url(../../static/one/game.png);
		background-repeat: no-repeat;
	} */
	.index{
		width: 100%;
		padding: 15% 32upx;
	}
	/* 个人信息 */
	.personalInformation{
		width: 100%;
		display: flex;
	}
	.personalInformation>image{
		width: 96upx;
		height: 96upx;
		border-radius: 50%;
	}
	.name{
		font-size:32upx;
		margin: 0 30upx;
	}
	.NGinformation{
		display: flex;
	}
	.nametext{
		font-size:32upx;
		/* font-family:PingFang SC; */
		font-weight:bold;
	}
	.goldCoin{
		display: flex;
		margin-top: 20upx;
	}
	.goldCoin>text{
		display: flex;
		padding:0 10upx;
		font-size: 24upx;
		color: #797979;
	}
	.goldCoin>image{
		width: 32upx;
		height: 32upx;
	}
	.grade{
		width: 76upx;
		height: 30upx;
		font-size:20upx;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(153,98,21,1);
		background-color: #EABE5B;
		text-align: center;
		border-radius: 40upx;
		margin-top: 10upx;
		margin-left: 20upx;
	}
	/* 导航 */
	.indexNavigation{
		width: 75%;
		margin:15% auto;
		margin-bottom: 20%;
		display: flex;
		justify-content: space-between;
	}
	.taskText{
		font-size:30upx;
		font-family:PingFang SC;
		font-weight:500;
		color:#707070;
	}
	.task{
		text-align: center;
	}
	.task>image{
		width: 96upx;
		height: 96upx;
		border-radius: 50%;
	}
	/* 好友在玩 */
	.friendsPlaying{
		margin-top:15%;
	}
	.fptop{
		display: flex;
		justify-content: space-between;
	}
	.fptopText{
		font-size:32upx;
		font-weight:bold;
		color:#252525;
	}
	.fptopRight{
		display: flex;
		align-items: center;
		font-size:24upx;
	}
	.fptopRight>text{
		display: block;
		font-size: 24upx;
	}
	.fptopRight>image{
		width: 16upx;
		height: 16upx;
		margin-left: 10upx;
	}
	.fpbottom{
		display: flex;
		justify-content: space-between;
		font-size:24upx;
		margin-top:50upx;
	}
	.fpbottom>view{
		display: flex;
		justify-content: space-between;
	}
	.fpbottom>view>image{
		width: 108upx;
		height: 108upx;
	}
	.fpname{
		margin-top:10upx;
	}
	.fpnameTex1{
		display: flex;
		align-items: center;
		margin-top:30upx;
	}
	.fpnameTex>text,.fpnameTex1>text{
		margin-right: 20upx;
		font-size: 24upx;
	}
	.fpnameTex,.fpnameTex1{
		margin-left: 20upx;
	}
	.fpnameTex>image{
		width: 18upx;
		height: 18upx;
	}
	.fpnameTex1>image{
		width: 14upx;
		height: 14upx;
	}
	.game{
		text-align: center;
		margin-top:20%;
	}
	.gametop{
		text-align: left;
		font-size: 32upx;
		font-weight: bold;
		color:#252525;
		margin-bottom: 50upx;
	}
	.gamebottom{
		width: 85%;
		height: 278upx;
		background-color: #252525;
		margin: auto;
		border-radius: 10upx;
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
		height: 380upx;
		background-color: #FFFFFF;
		margin:auto;
		border-radius: 10upx;
	}
	.roomTitle{
		color:#313131;
		margin-bottom: 20upx;
		font-weight:bold;
		margin-top: 30upx;
		margin-bottom: 40upx;
		font-size: 32upx;
	}
	.top{
		display: flex;
		height: 70upx;
		margin:auto;
		border-radius: 10upx;
		width: 80%;
		background-color: #DFDFDF;
	}
	.top>input{
		width: 100%;
		margin-top:15upx;
	}
	.option{
		width: 65%;
		margin:80upx auto;
		display: flex;
		justify-content: space-between;
	}
	.Rcancel,.determine{
		width: 170upx;
		font-weight:bold;
		color:#313131;
		font-size: 32upx;
		padding:12upx;
		border-radius: 40upx;
	}
	.Rcancel{
		background-color: #DFDFDF;
	}
	.determine{
		background-color: #FCF15D;
	}
</style>
