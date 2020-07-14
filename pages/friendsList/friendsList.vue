<template>
	<view class="friendsList">
		<view style="width: 90%;margin:auto">
			<view class="FLtop">
				<image style="width: 100upx;height: 100upx;border-radius: 50%;" :src="totalData.photo_url" mode=""></image>
				<!-- <view style="width: 100upx;height: 100upx;background-color: #00B26A;border-radius: 50%;"></view> -->
				<view class="FLname">
					<view>{{totalData.nickName}}</view>
					<view style="margin-top: 30upx;">{{totalData.time}}</view>
				</view>
			</view>
			<view class="thumbnails" style="margin-bottom: 30upx;">{{totalData.content}}</view>
			<view class="thumbnails">
				<view :class="totalData.url.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in totalData.url" :key="index_images">
					<image class="gallery_img" lazy-load mode="aspectFill"  :src="'http://social.wgzy69.com/'+image.circle_url"  @tap="previewImage(totalData.url,index_images)"></image>
				</view>
			</view>
			<view class="toolbar1">
				<view class="tool" @click="like(totalData)">
					<image :src="totalData.type==2?'../../static/one/love1.png':'../../static/one/redlove1.png'"></image>
					<!-- <image :src="changeImg" mode="widthFix"></image> -->
					<text style="margin-top:10upx;margin-left: 10upx;">{{totalData.zan}}</text>
				</view>
				<view @click="openText" class="tool">
					<image src="../../static/one/comment1.png"></image>
					<text style="margin-top:10upx;margin-left: 10upx;">{{totalData.ping}}</text>
				</view>
				<!-- <view class="tool">
					<image src="../../static/one/share1.png"></image>
				</view> -->
			</view>
			<view class="textList" v-for="item in totalData.msg">
				<view class="" @click="reply(item.user_id)">
					<view class="comment">
						<image style="width: 60upx;height: 60upx;border-radius: 50%;margin-right: 20upx;" :src="item.Photo" mode=""></image>
						<view class="" v-if="item.to_name">
							回复
						</view>
						<view v-if="item.to_name" style="font-weight: bold;color: #6F6EEE;">{{item.to_name}}</view>
						<view v-if="!item.to_name" style="font-weight: bold;color: #6F6EEE;">{{item.user_name}}</view>
					</view>
					<view style="width: 90%;margin: auto;padding-left: 80upx;">
						{{item.content}}
					</view>
				</view>
			</view>
			<!-- <view class="textList">
				<view class="">
					<view class="comment">
						<view style="width: 60upx;height: 60upx;background-color: #0081FF;border-radius: 50%;margin-right: 20upx;"></view>
						<view style="font-weight: bold;color: #6F6EEE;">京京</view>
					</view>
					<view style="width: 90%;margin: auto;padding-left: 80upx;">
						把我的好运分你一半
					</view>
				</view>
			</view> -->
		</view>
		<view v-if="text" style="background-color:#E1D7F0" class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<input class="solid-bottom" @focus="InputFocus" @blur="InputBlur" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" v-model="sendContent"></input>
			<button class="cu-btn bg-green shadow" @click="send">发送</button>
		</view>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	export default {
		data(){
			return{
				islike:false,
				totalData:'',
				circle_id:'',
				token:'',
				text:false,
				InputBottom: 0,
				sendContent:'',
				src:[
					"../../static/index/test/bgi.jpg",
					"../../static/index/test/bear.jpg",
					"../../static/index/test/header01.jpg",
					"../../static/index/test/header05.jpg",
					"../../static/index/test/pig-01.jpg",
					"../../static/index/test/pig-07.jpg",
					"../../static/index/test/header05.jpg",
					"../../static/index/test/pig-01.jpg",
					"../../static/index/test/pig-07.jpg",
				],
				touid:'',
			}
		},
		onLoad(option) {
			this.circle_id=option.item;
		    //console.log(this.circle_id);
		},
		onShow(){
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			this.list();
		},
		methods:{
			//回复
			reply(val){
				this.touid=val;
				let data={
					token:this.token,
					circle_id:this.totalData,
					content:this.sendContent,
					touid:val,
				};
				if(this.sendContent!==''){
					request.post('comment',data).then(res=>{
						// //console.log("回复评论",res);
						// if(res.code==200){
						// 	this.list();
						// }
						// this.peopleNearby=res.data;
					})
				}
				// //console.log(val);
				this.text=true;
			},
			//评论接口
			// comment(){
			// 	let data={
			// 		token:this.token,
			// 		circle_id:item.id,
			// 		key:
			// 	};
			// 	request.post('comment',data).then(res=>{
			// 		//console.log("点赞",res);
			// 		// this.peopleNearby=res.data;
			// 	})
			// }
			// 点赞
			like(item) {
				//console.log("点击",item.id);
				let data={
					token:this.token,
					circle_id:item.id,
					};
				request.post('give',data).then(res=>{
					this.$token(res.code==500);
					//console.log("朋友圈信息接口点赞",res);
					// this.peopleNearby=res.data;
				})
				if(item.type==2){
					this.islike=true
					item.type=1;
					item.zan+=1;
				}else{
					item.type=2;
					item.zan-=1
					this.islike=false                
				}
				// for(let i=0;i<this.$store.state.list.length;i++){
				// 	if(this.$store.state.list[i].id===item.id){
				// 		 this.$store.state.list[i]=item;
				// 	}
				// }
				// this.$store.commit('upedateMessage',this.$store.state.list)
			},
			//朋友圈详情接口
			list(){
				// //console.log("235423534",this.circle_id);
				let data={
					token:this.token,
					circle_id:this.circle_id,
					};
				request.post('CircleDetails',data).then(res=>{
					//console.log(res)
					this.totalData=res;
					// //console.log("--32--32----3-4",this.totalData);
					for(let i=0;i<this.$store.state.list.length;i++){
						if(this.$store.state.list[i].id===this.totalData.id){
							 this.$store.state.list[i]=this.totalData;
						}
					}
					//console.log("3");
					// //console.log("这是什么",this.totalData);
					this.$store.commit('upedateMessage',this.totalData);
					// //console.log("这是什么XXXXXX",this.$store.state.list);
				})
				
			},
			
			
			
			
			send(){
				//console.log("1",this.totalData);
				let data={
					token:this.token,
					circle_id:this.totalData.id,
					content:this.sendContent,
					touid:this.touid,
				};
				if(this.sendContent!==''){
					request.post('comment',data).then(res=>{
						this.$token(res.code);
						//console.log("评论",res);
						if(res.code==200){
							this.sendContent='';
							this.touid='';
							this.list();
						}
						this.peopleNearby=res.data;
						this.text=false;
						//console.log("pinglun12112212222",this.peopleNearby);
					})
				}
				//console.log("2");
				
				// //console.log("评论11111111111",this.$store.state.list);
				// for(let i=0;i<this.$store.state.list.length;i++){
				// 	if(this.$store.state.list[i].id===item.id){
				// 		 this.$store.state.list[i]=item;
				// 	}
				// }
				// //console.log("vuex中的新数据",this.$store.state.list);
				// this.$store.commit('upedateMessage',this.$store.state.list)
				//console.log("4");
			},
			openText(){
				if(this.text==false){
					this.text=true;
				}else{
					this.text=false;
				}
			},
			//页面高度
			InputFocus(e) {
					this.InputBottom = e.detail.height;
			},
			InputBlur(e) {
					this.InputBottom = 0
			},
			previewImage(imageList, image_index) {
				var imgList=[];
				for(var i=0;i<imageList.length;i++){
					imgList.push('http://social.wgzy69.com/'+imageList[i].circle_url);
				}
				var current = imageList[image_index];
				uni.previewImage({
					current: current.circle_url,
					urls: imgList
				});
			},
			previewImage(imageList, image_index) {
				var imgList=[];
				for(var i=0;i<imageList.length;i++){
					imgList.push('http://social.wgzy69.com/'+imageList[i].circle_url);
				}
				var current = imageList[image_index];
				uni.previewImage({
					current: current.circle_url,
					urls: imgList
				});
			},
		}
	}
</script>

<style>
	.textList{
		margin-top:20upx;
	}
	.comment{
		width: 90%;
		margin: auto;
		display: flex;
		align-items: center;
		margin-top:10upx;
	}
	.toolbar1>view>image{
		width: 40upx;
		height: 40upx;
	}
	.tool{
		display: flex;
		align-items: center;
		margin-right: 30upx;
	}
	.toolbar1{
		margin-left: 30upx;
		margin-top:30upx;
		display: flex;
		align-items: center;
	}
	.FLtop{
		padding-bottom: 30upx;
		display: flex;
		align-items: center;
	}
	.FLname{
		margin-left: 20upx;
	}
	.thumbnails {
		/* width: 200%; */
		padding-left: 20upx;
		display: flex;
		align-items: center;
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		-webkit-flex-wrap: wrap;
		-ms-flex-wrap: wrap;
	}
	
	.thumbnails .thumbnail {
		width: 30%;
		height: 180upx;
		margin: 4upx;
		background: #757575;
		overflow: hidden;
	}
	
	.my-gallery{
		width: 250upx;
		height: 400upx;
		margin: 4upx;
		background: #757575;
		overflow: hidden
	}
	
	.gallery_img {
		width: 100%;
		height: 100%
	}
</style>
