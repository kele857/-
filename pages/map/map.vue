<template>
    <view>
        <web-view  :webview-styles="webviewStyles" :src="'http://social.wgzy69.com/?token='+token">
		</web-view>
    </view>
</template>
<script>
var wv;//计划创建的webview
export default {
	data() {
		return {
			 webviewStyles: {
	            progress: {
	                color: '#FF3333'
	            }
	        },
			info:''
		}
	},
	onNavigationBarButtonTap(e){
		// console.log("11111111111111111");
		uni.switchTab({
		    url: '../index/index'
		});
	},
	onLoad() {
		var USERSTORAGE = this.checkLogin("USERSTORAGE");
		this.token=USERSTORAGE[2];
		// console.log("info",this.token);
	}
    // onReady() {
    //     // #ifdef APP-PLUS
    //     var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
    //     setTimeout(function() {
    //         wv = currentWebview.children()[0]
    //         wv.setStyle({top:50,height:900})
    //     }, 1000); //如果是页面初始化调用时，需要延时一下
    //     // #endif
    //     }
    };
</script>




