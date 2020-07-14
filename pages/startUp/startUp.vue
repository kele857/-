<template>
	<!-- 启动页面 -->
	<!-- <view class="content"> -->
		<image style="width: 100%;" src="../../static/img/startUp.png" mode="widthFix"></image>
	<!-- </view> -->
</template>

<script>
	export default{
		data(){
			return{
				time:4,//创建一个时间
				QHeight:0,
				Qwidth:0,
				sname:'',
				sface:'',
				token:'',
				zt:''
			}
		},
		onShow() {
		},
		onLoad(e) {
			// let that = this;
			uni.getSystemInfo({
				success(res){
					this.WinHeight = res.windowHeight;
					// console.log("屏幕高度",this.WinHeight);
				}
			})
			
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			
			//当页面启动的时候就调用定时器
			let timeS=this.time;
			this.QTime(timeS);
		},
		methods:{
			QTime(timeS){
				console.log(this.zt);
				let state=this.token;
				let timeStart=setInterval(function(){
					timeS--;
					//判断
					if(timeS==0){
						//当time的时间等于0时关闭定时器
						clearInterval(timeStart);
							// uni.switchTab ({
							// 	url:"../index/index"
							// })	
						if(state==''){
							console.log("state",state);
							uni.navigateTo({
								url:'../login/login'
							})
						}else{
							uni.switchTab ({
								url:"../index/index"
							})	
						}
					}
					console.log(timeS)
				},1000,timeS)
			}
		}
	}
</script>

<style>
	/* page{
		background-image: url(../../static/img/startUp.png);
		background-size: 100%;
		background-repeat: no-repeat;
	} */
	/* .content{
		width: 100%;
		height: 100%;
	}
	.content>image{
		width: 100%;
	} */
</style>
