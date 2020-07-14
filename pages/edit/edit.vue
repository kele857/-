<template>
	<!-- 编辑 -->
	<view class="edit">
		<view class="line"></view>
		<view class="editContent" @click="photo">
			<view class="editLeft">
				头像
			</view>
			<view class="editRight">
				<image class="sface" style="width: 80upx;height: 80upx; border-radius: 50%;" :src="sface" mode=""></image>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="editContent" @click="nickname">
			<view class="editLeft">
				昵称
			</view>
			<view class="editRight">
				<view>{{sname}}</view>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="editContent">
			<view class="editLeft">
				用户名ID
			</view>
			<view class="editRight">
				<view>{{id}}</view>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="editContent" @click='genderOpen'>
			<view class="editLeft">
				性别
			</view>
			<view class="editRight">
				<view>{{sex}}</view>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="editContent" @click="position">
			<view class="editLeft">
				地区
			</view>
			<view class="editRight">
				<view>{{location}}</view>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="editContent" @click="showBirthday">
			<view class="editLeft">
				生日
			</view>
			<view class="editRight">
				<view>{{birthday}}</view>
				<image src="../../static/one/dateRight.png" mode="widthFix"></image>
			</view>
		</view>
		<view class="page page-fill" v-if="state1">
			<view class="bg" @click="genderEsc"></view>
			<view class="butt">
				<view class="text">
					选择性别
				</view>
				<view class="Gender">
					<view class="male" @click="male">
						<image v-if="gender=='1'" style="width: 100upx;height: 100upx;display: block;" src="../../static/one/blue.png" mode=""></image>
						<image v-else style="width: 100upx;height: 100upx;display: block;" src="../../static/one/blue1.png" mode=""></image>
						<text style="display: block;" :class="gender!=='1'?'active':''">男</text>
					</view>
					<view class="male" @click="female">
						<image v-if="gender=='0'" style="width: 100upx;height: 100upx;display: block;" src="../../static/one/pink.png" mode=""></image>
						<image v-else style="width: 100upx;height: 100upx;display: block;" src="../../static/one/pink1.png" mode=""></image>
						<text style="display: block;" :class="gender!=='0'?'active':''">女</text>
					</view>
				</view>
				<view class="">
					<view class="cancel" @click="determine">
						确认
					</view>
					<view class="cancel" @click="genderEsc">
						取消
					</view>
				</view>
			</view>
		</view>
		<Birthday :show='show' startYear='1660' SelectTime='1960-01-01' endYear='2020' ref='display'></Birthday>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	import Birthday from "../../components/zzh-selectYearAndMonthAndSay/index";
	export default {
		components: {
			Birthday
		},
		data() {
			return {
				SelectTime:'',
				state1:false,
				gender:'',
				address:'',
				sname:'',
				sface:'',
				show:false,
				sex:'',
				location:'',
				birthday:'',
			};
		},
		onShow() {
			// NAMEID
			var SNAME = this.checkLogin("SNAME");
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			var SFACE = this.checkLogin("SFACE");
			var SEX = this.checkLogin("SEX");
			var ACTION = this.checkLogin("ACTION");
			var BIRTHDAY = this.checkLogin("BIRTHDAY");
			var NAMEID = this.checkLogin("NAMEID");
			// var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.sname=SNAME[0];
			this.sface=SFACE[1];
			this.token=USERSTORAGE[2];
			this.sex=SEX[6];
			this.location=ACTION[7];
			this.birthday=ACTION[8];
			this.id=NAMEID[5];
			if(this.sex==1){
				this.sex='男'
			}else{
				this.sex='女'
			}
			// console.log("地址",this.location)
		},
		methods: {
			//头像
			photo(){
				var me = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						// console.log(res.errMsg)
						// if(res.errMsg=="chooseImage:ok"){
						// 	uni.navigateTo({
						// 		url:'../meFace/meFace'
						// 	})
						// }
						const imgsFile=res.tempFilePaths;
						uni.uploadFile({
							url:`http://social.wgzy69.com/api/getUserPhoto`,
							filePath:imgsFile[0],
							fileType:'image',
							name:'img',
							formData: {
								'token':me.token
							},
							success:function(res1){
								console.log("res1======",res1)
								res=JSON.parse(res1.data)
								// console.log("返回值",res);
								if(res.code==200){
									me.sface=res.url;
									uni.setStorageSync('SFACE',me.sface);
								}else{
									uni.showToast({
										title: "修改失败",
										icon: 'none',
										duration: 2000
									});
								}
							}
						})
					}
				});
			},
			determine(){
				let data={
					token:this.token,
					type:2,
					sex:this.gender,
				};
				request.post('UpdateUser',data).then(res=>{
					this.$token(res.code==500);
					console.log(res);
					if(res.code==200){
						this.state1=false;
						this.sex=res.data.gender;
						uni.setStorageSync('sex',res.data.gender);
					}
				})
			},
			showBirthday(){
				if(this.show=true){
					this.$refs.display.state=true
				}
			},
			// 性别
			genderEsc(){
				this.state1=false;
			},
			male(){
				this.gender="1"
				// console.log(this.gender)
			},
			female(){
				this.gender="0"
				// console.log(this.gender)
			},
			genderOpen(){
				this.state1=true;
			},
			nickname(){
				uni.navigateTo({
				    url: '../ChangeName/ChangeName'
				});
			},
			//地区
			position(){
				console.log("1111111111");
				var that=this;
				that.show1=false;
				uni.chooseLocation({
				    success: function (res) {
						console.log("获取当前位置",res);
						that.address=res.address;
						let address= res.longitude+','+ res.latitude;
						console.log(address);
						let data={
							token:that.token,
							type:3,
							longitude:address,
						};
						request.post('UpdateUser',data).then(res=>{
							// this.$token(res.code);
							// console.log("修改地理位置",res);
							if(res.code==200){
								this.location=res.data.location;
								// console.log("修改地理1",res);
								// console.log("修改地理",this.location);
								uni.setStorageSync('ACTION',res.data.location);
								uni.redirectTo({
								    url:"../../pages/edit/edit"
								});
								uni.showToast({
									title: "修改成功",
									icon: 'success',
									duration: 2000
								});
							}
						})

				    }
				});
				// uni.navigateBack();
			},
		},
	};
</script>

<style>
	.line{
		width: 100%;
		border-bottom: 14upx solid #F4F4F4;
	}
	.editContent{
		padding: 26upx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 60upx;
		border-bottom: 6upx solid #F4F4F4;
		padding-right: 40upx;
	}
	.editRight{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.editRight>.sface,.editRight>view{
		margin-right: 40upx;
		border-radius: 50%;
		color: #AAAAAA;
	}
	.editRight>image{
		width: 16upx;
	}
	.bg{
		width:100%;
		position: fixed;
		height:100%;
		bottom:0;
		left:0;
		background-color: rgba(0,0,0,.6);
		z-index:1;
	}
	.butt{
		width:100%;
		height: 440rpx;
		position: absolute;
		z-index: 10;
		background-color: #FFFFFF;
		bottom: 0;
	}
	.text{
		text-align: center;
		color: #969696;
		padding:20upx 0;
	}
	.img{
		/* background-image: url(../../static/img/男.png); */
		background-repeat: no-repeat;
	}
	.male{
		display: block;
		text-align: center;
		margin-top:20upx;
	}
	.Gender{
		margin: 0 auto;
		padding-bottom: 30upx;
		width: 60%;
		display: flex;
		justify-content: space-between;
	}
	.cancel1{
		position: absolute;
		bottom: 0;
	}
	.cancel{
		border-top: 16rpx solid #F4F4F4;
		width: 100%;
		/* position: absolute;
		bottom: 0; */
		font-size: 28rpx;
		color: #AAAAAA;
		text-align: center;
		padding:16upx 0;
	}
	.active{
		color: #AAAAAA;
	}
</style>
