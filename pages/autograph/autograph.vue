<template>
	<!-- 个签 -->
	<view class="autograph">
		<view class="autographTop">
			<view class="autographContent" v-if="tagList4==''">
				添加符合你的8个标签
			</view>
			<view style="display: flex;flex-wrap:wrap;">
				<view class="tagItem tagBgSuccess active" v-bind:key="index" v-for="(tagText,index) in tagList4">
					<text @tap="tapTag" :data-text="tagText">{{tagText}}</text>
				</view>
			</view>
		</view>
		<view class="signature">
			<view class="next">文化</view>
			<view style="display: flex;flex-wrap:wrap">
				<view class="tagItem tagBgSuccess" :class="{'active':addStyle(tagText)}" v-bind:key="index" v-for="(tagText,index) in tagList">
					<text @tap="tapTag" :data-text="tagText">{{tagText}}</text>
				</view>
			</view>
		</view>
		<view class="signature">
			<view class="next">二次元</view>
			<view style="display: flex;flex-wrap:wrap">
				<view class="tagItem tagBgSuccess" :class="{'active':addStyle(tagText)}" v-bind:key="index" v-for="(tagText,index) in tagList1">
					<text @tap="tapTag" :data-text="tagText">{{tagText}}</text>
				</view>
			</view>
		</view>
		<view class="signature">
			<view class="next">古风</view>
			<view style="display: flex;flex-wrap:wrap">
				<view class="tagItem tagBgSuccess" :class="{'active':addStyle(tagText)}" v-bind:key="index" v-for="(tagText,index) in tagList2">
					<text @tap="tapTag" :data-text="tagText">{{tagText}}</text>
				</view>
			</view>
		</view>
		<view class="signature">
			<view class="next">嘻哈</view>
			<view style="display: flex;flex-wrap:wrap">
				<view class="tagItem tagBgSuccess" :class="{'active':addStyle(tagText)}"  v-bind:key="index" v-for="(tagText,index) in tagList3">
					<text @tap="tapTag" :data-text="tagText">{{tagText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	export default{
		data(){
			return{
				tagList: ['文化','二次元','古风','嘻哈','朝'],
				tagList1:["娱乐","电影","美剧","日剧","动画","游戏"],
				tagList2:["摄影","声控","画手","段子","pia戏","cosplay"],
				tagList3:["生活","旅行","健身","吃货","萌宠","运动","纹身"],
				tagList4:[],
				list:'',
				state:false,
				guigeShow:false
			}
		},
		onShow() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
		},
		onNavigationBarButtonTap(e) {
			// console.log("个签传值",this.tagList4);
			let data={
				token:this.token,
				signature:this.tagList4,
			};
			request.post('Asign',data).then(res=>{
				this.$token(res.code==500);
				if(res.code==200){
					this.tagList4=[];
					uni.showToast({
						title: "保存"+res.msg,
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
				console.log("接口",res);
			})
		},
		methods:{
			tapTag(e){
				this.state=e.currentTarget.dataset.text;
				// console.log("zheshi",e.currentTarget.dataset.text);
				let aa = this.tagList4.findIndex(item => {     //aa 返回的是数组中的序列
					return item == e.currentTarget.dataset.text;
				});
				if (aa != -1) {       //如果数组中存在   删除调
					this.tagList4.splice(aa, 1);
					this.choose = false;
					// console.log(this.tagList4);
				} else {   //如果数组中不存在   push
					if(this.tagList4.length<8){
						this.tagList4.push(e.currentTarget.dataset.text);
					}
					// this.tagList4.forEach(item=>{
					// 	console.log("样式",item);
					// })
				}
			},
			//添加样式
			addStyle(text){
				let isHas = this.tagList4.findIndex(item => {     //aa 返回的是数组中的序列
					return item == text;
				});
				return isHas > -1 ? true : false
			} 
		}
	}
</script>

<style>
	.active{
		border: none !important;
		color: #1B1B1B !important;
		background-color: #FCF15D !important;
	}
	.tagItem{
		padding: 10upx 20upx;
		margin: 12upx;
		border-radius: 40upx;
		color: white;
		background-color: #4CA2FF;
	}
	.next{
		margin-bottom: 10upx;
	}
	.tagBgSuccess{
		width: 140upx;
		text-align: center;
		border: 1px solid #1B1B1B;
		background-color: #FFFFFF;
		color: #1B1B1B;
	}
	.autographTop{
		width: 100%;
		padding:20upx 40upx;
		height: 260upx;
		border-bottom: 20rpx solid #F2F2F2;
	}
	.autographContent{
		padding:0 25upx;
		font-size: 36upx;
		color: #AAAAAA;
	}
	.signature{
		padding:20upx 40upx;
	}
	.tag{ 
		width: 150upx;
		margin: 10upx 10upx;
	}
	.uni-tag--default{
		font-size: 22upx !important;
		color: #808080 !important;
	}
	.uni-tag-text{
		font-size: 22upx !important;
	}
</style>
