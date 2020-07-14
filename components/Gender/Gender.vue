<template>
	<view class="page page-fill" v-if="state1">
		<view class="bg" @click="esc"></view>
		<view class="butt">
			<view class="text">
				选择性别
			</view>
			<view class="Gender">
				<view class="male" @click="male">
					<image style="width: 150rpx;height: 150rpx;display: block;" src="../../static/img/male.png" mode=""></image>
					<text style="display: block;">男</text>
				</view>
				<view class="male" @click="female">
					<image style="width: 150rpx;height: 150rpx;display: block;" src="../../static/img/Ma'am.png" mode=""></image>
					<text style="display: block;">女</text>
				</view>
			</view>
			<view class="cancel" @click="cancel">
				取消
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
		  show1: {
		    type: Boolean,
		    default: false,
			// gender:'女',
		  },
		  gender: {
		    type: String,
		    gender: '女'
		  },
		},
		data() {
			return {
				state1: this.show1,
				genderval:this.gender
			};
		},
		watch: {
		  show1 (val) {
		    // this.init();
		    this.state1 = val;
		  },
		  state1 (val) {
		    this.$emit('update:show1', val);
		  },
		  gender(val){
			this.genderval=val;  
		  },
		  genderval(val){
			  this.$emit('update:gender',val);
		  }
		 //  gender(val){
			// this.$emit('update:gender', val);  
		 //  }
		},
		onLoad() {
			var me = this;
			var globalUser = me.getGlobalUser("globalUser");
			me.globalUser = globalUser;
			me.sex = globalUser.sex;
		},
		methods:{
			cancel(){
				this.state1=false;
				console.log(this.state1)
			},
			esc(){
				this.state1=false;
			},
			male(){
				this.gender="男"
				// console.log(this.gender)
			},
			female(){
				this.gender="女"
				// console.log(this.gender)
			}
		},
		// mounted() {
		// 	console.log(this.gender)
		// }
	}
</script>

<style>
/* 页面铺满屏幕 */
.bg{
	width:100%;
	position: fixed;
	height:100%;
	bottom:0;
	left:0;
	background-color: rgba(0,0,0,.6);
}
.page-fill {
	width:100%;
	position: fixed;
	height:100%;
	bottom:0;
	left:0;
	z-index: 999;
}
.butt{
	width:100%;
	height: 450rpx;
	position: absolute;
	z-index: 10;
	background-color: #FFFFFF;
	bottom: 0;
}
.text{
	text-align: center;
	color: #969696;
}
.img{
	/* background-image: url(../../static/img/男.png); */
	background-repeat: no-repeat;
}
.male{
	width: 150rpx;
	display: block;
	text-align: center;
}
.Gender{
	margin: 0 auto;
	width: 60%;
	display: flex;
	justify-content: space-between;
}
.cancel{
	border-top: 10rpx solid #EAEAEA;
	width: 100%;
	height: 120rpx;
	position: absolute;
	bottom: 0;
	font-size: 28rpx;
	color: #969696;
	text-align: center;
	padding-top: 10rpx;
}
</style>
