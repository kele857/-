import Vue from 'vue'
import App from './App'

//引入vuex
import store from './store'
import {dianji} from './common/Jump.js'
import {token} from './common/token.js'
//把vuex定义成全局组件
Vue.prototype.$store = store;
Vue.prototype.$dianji = dianji;
Vue.prototype.$token = token;

Vue.config.productionTip = false
Vue.prototype.checkLogin=function(){
	//本人的微信名
	var SNAME=uni.getStorageSync('SNAME');
	//本人的微信头像
	var SFACE=uni.getStorageSync('SFACE');
	//token
	var USERSTORAGE=uni.getStorageSync('USERSTORAGE');
	//搜索好友接口返回的好友信息
	var FRIENFIN=uni.getStorageSync('FRIENFIN');
	//搜索好友时输入的好友id
	var FRIENDSID=uni.getStorageSync('FRIENDSID');
	//自己的user_id
	var NAMEID=uni.getStorageSync('NAMEID');
	//本人的性别
	var SEX=uni.getStorageSync('SEX');
	//本人的地址
	var ACTION=uni.getStorageSync('ACTION');
	//本人的生日
	var BIRTHDAY=uni.getStorageSync('BIRTHDAY');
	// console.log('main.js中的token',USERSTORAGE);
	//在APP中接收的消息列表的消息
	// var MESSAGELIST=uni.getStorageSync('MESSAGELIST');
	//登录个人信息保存
	var INFO=uni.getStorageSync('INFO');
	return [SNAME,SFACE,USERSTORAGE,FRIENFIN,FRIENDSID,NAMEID,SEX,ACTION,BIRTHDAY,INFO];
}


App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()




