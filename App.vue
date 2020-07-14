<script>
	import socket from 'common/socket.js'
	export default {
		// globalData: {
		// 	userinfo: []
		// },
		
		
		// addUserInfo(userinfo){
		// 	console.log('re.data',userinfo)
		// 	this.globalData.userinfo.push(userinfo);
		// },
		
			
		onLaunch: function() {
			console.log('App Launch');
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			let token=USERSTORAGE[2];
			console.log("app______",token=='');
			//判断是否存在登录信息
			if(token==''){
				//不存在则跳转登录页
				uni.reLaunch({
					url:"/pages/login/login",
					success:()=>{
						//跳转完页面后再关闭启动页
						plus.navigator.closeSplashscreen();
					}
				})
			}else{
				uni.reLaunch({
					url:"/pages/index/index",
					success:()=>{
						//跳转完页面后再关闭启动页
						plus.navigator.closeSplashscreen();
					}
				})
			}
		},
		
		
		
		onLoad: function(){
		// console.log('App 2');
		},
		onShow: function() {
			socket.init(function() {});	
			// console.log('App 3');
		},
		onHide: function() {
			// console.log('App 4');
		},
	}
</script>

<style>
	@import "static/css/main.css";
	/*  #endif  */ 
	@import "static/css/index-app.css";
</style>
