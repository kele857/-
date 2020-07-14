<template>
	<view class="information">
		<view class="IFbutton">
			<image v-if="state" @click="addfriend" src="../../static/one/IFadd.png" mode="widthFix"></image>
			<image v-if="!state" @click="sendMessage" src="../../static/one/sendMessage.png" mode="widthFix"></image>
		</view>
		<view class="inforImg">
			<!-- <view class="Navigation" style="position: absolute;display: flex;justify-content: space-between;width: 100%;margin: auto;padding:20upx 40upx;padding-top:30upx;"> -->
				<!-- <image @click="navigateBack" style="width: 36upx;" src="../../static/one/dateLeft.png" mode="widthFix"></image> -->
				<!-- <image style="width: 48upx;" src="../../static/one/three.png" mode="widthFix"></image> -->
				<!-- <text @click="setUp">设置</text> -->
			<!-- </view> -->
			<image style="width: 750upx;height: 700upx;" :src="friendInformation.photo_url" mode="aspectFill"></image>
		</view>
		<view class="IFcontent">
			<view style="margin-left: 23upx;">
				<view class="IFcontentTop">
					<view class="IFname nameLength">{{friendInformation.nickName}}</view>
					<image class="IFimg" :src="friendInformation.sex==2 ? '../../static/one/gender1.png' : '../../static/one/gender1.png'"></image>
					<view class="IFgrade">{{friendInformation.levels}}级</view>
				</view>
				<view class="IFcontentB">
					<view>魅力值：{{friendInformation.zan}}</view>
					<view>身价：{{friendInformation.gold}}</view>
					<view class="IFaddress">{{friendInformation.location}}</view>
				</view>
			</view>
			
			
			<view class="container">
				<!-- 导航栏 -->
				<view class="uni-tab-bar">
					<scroll-view scroll-x class="uni-swiper-tab">
						<view style="display: flex;">
							<block v-for="(tabBar,index) in tabBars" :key="index">
								<view class="swiper-tab-list" :class="{'active': tabIndex==index}" @tap="toggleTab(index)">		
									{{tabBar.name}}			
								</view>		
							</block>
						</view>		
					</scroll-view>		
				</view>	
				
				<view class="uni-tab-bar">	
					<swiper :current="tabIndex" @change="changeTab" :style="{height:swiperHeight+'px'}">
						<swiper-item>		
							<view class="swiper-item list">
							<view style="margin-left: 23upx;">
								<view class="IFid">
									ID：{{friendInformation.user_id}}
								</view>
								<view>
									<view class="IFalbum" @click="album">
										<view class="IFalbumTop">
											相册
										</view>
										<image src="../../static/one/dateRight.png" mode="widthFix"></image>
									</view>
									<view class="photo">
										<image v-for="item in ph" style="width: 120upx;margin:0 16upx;height: 120upx;border-radius: 10upx;" :src="'http://social.wgzy69.com/'+item.circle_url" mode="aspectFill"></image>
									</view>
								</view>
								<view class="IFalbum">
									<view class="IFalbumTop">
										个签
									</view>
									<!-- <image src="../../static/one/dateRight.png" mode="widthFix"></image> -->
								</view>
								<view class="sina">
									<view class="signature" v-for="item in autograph">
										{{item}}
									</view>
									<!-- <view class="signature">
										疯狂连胜 LV.5
									</view>
									<view class="signature">
										疯狂连胜 LV.5
									</view> -->
								</view>
								<view style="width: 100%;height: 180upx;"></view>								
							</view>
							</view>
						</swiper-item>	
						<swiper-item>
							<view class="swiper-item list1">
								<view class="moments__post" v-for="(post,index) in posts" :key="index" :id="'post-'+index">
									<!-- <navigator animation-duration="300" :url="`../friendsList/friendsList?friendId=${post.id}`"> -->
									<!-- @click="jump(post.id)" -->
										<view  class="post-left">
											<image class="post_header" :src="friendInformation.photo_url"></image>
											<view class="name">
												<view class="post-username">{{friendInformation.nickName}}</view>
												<view class="gray">{{post.time}}</view>
											</view>
										</view>
												
										<view class="post_right post_right1">
											<!-- @click="jump(post.id)" -->
											<view id="paragraph" class="paragraph">{{post.content}}</view>
											<!-- 相册 -->
											<view class="thumbnails">
												<view :class="post.circle_all.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in post.circle_all" :key="index_images">
													<!-- <image class="gallery_img" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(post.content.images,index_images)"></image> -->
													<image class="gallery_img" lazy-load mode="aspectFill" :src="'http://social.wgzy69.com/'+image.circle_url" :data-src="'http://social.wgzy69.com/'+image.circle_url" @click="previewImage(post.circle_all,index_images)"></image>
												</view>
											</view>
											<view class="toolbar1">
												<view class="tool" @click="like(post)">
													<image :src="post.type==2?'../../static/one/love1.png':'../../static/one/redlove1.png'"></image>
													<!-- <image :src="changeImg" mode="widthFix"></image> -->
													<text style="margin-top:10upx;margin-left: 10upx;">{{post.zan}}</text>
												</view>
												 <!-- @click="jump(post.id)" -->
												<view class="tool">
													<image src="../../static/one/comment1.png"></image>
													<text style="margin-top:10upx;margin-left: 10upx;">123</text>
												</view>
												<!-- <view class="tool">
													<image src="../../static/one/share1.png"></image>
												</view> -->
											</view>
										</view>
									<!-- </navigator> -->
									<!-- 结束 post -->
								</view>
								
								<view class="foot" v-show="showInput">
									<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
									<!-- <chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input> -->
								</view>
								<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
								<view style="width: 100%;height: 180upx;"></view>
							</view>
						</swiper-item>
					</swiper>		
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	import chatInput from '../../components/im-chat/chatinput.vue'; //input框
	import postData from '../../common/index/index.post.data.js';
	export default {
		data() {
			return {
				state:false,
				posts: '',//模拟数据
				user_id: 4,
				username: 'Liuxy',
				jkPage:1,
				index: '',
				comment_index: '',
				
				input_placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				is_reply: false, //回复还是评论
				showInput: false, //评论输入框
				
				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '' ,//可用窗口高度(不计入软键盘)
				
				loadMoreText: "加载中...",
				showLoadMore: false,
				islike:false,
				img:[],
				
				
				
				
				
				tabIndex: 0, //选中标签栏的序列
				contentList: ["资料","动态"],
				tabBars:[
					{name: '资料',id: 'guanzhu'},
					{name: '动态',id: 'tuijian'}
				],
				swiperHeight: 0,
				swiperHeight:1080,
				list:[1,2,3,4,5,6,7,8,9,10],
				ph:'',
				autograph:''
			}
		},
		onNavigationBarButtonTap(e) {
			this.setUp();
		},
		mounted() {
			uni.getStorage({
				key: 'posts',
				success: function (res) {
					this.posts = res.data;
				}
			});	
		},
		onLoad(option) {
		    const item = JSON.parse(decodeURIComponent(option.item));
			this.friendInformation=item;
			// console.log("-----------数据---------",this.friendInformation);
			if(this.friendInformation.type==2){
				this.state=true
			}else if(this.friendInformation.type==1){
				this.state=false
			}
			if(this.friendInformation.photo.length!==0){
				this.ph=this.friendInformation.photo.slice(0,5);
			}
			this.autograph=this.friendInformation.signature.split(",")
			// console.log("个签-----",this.autograph);
		},
		onShow() {
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
			uni.startPullDownRefresh();
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			this.posts=this.friendInformation.circle;
			
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if(this.platform === 'ios'){
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				}else{
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
		},
		methods: {
			//发消息
			sendMessage(){
				uni.navigateTo({
				    url:`../chat/chat?id=${this.friendInformation.user_id}`
				});
			},
			album(){
				uni.navigateTo({
					url:`../album/album?ph=${encodeURIComponent(JSON.stringify(this.friendInformation.photo))}`
				    // url:'../album/album'
				});
			},
			//朋友圈信息接口
				jump(item){
					uni.navigateTo({
					    url: `../friendsList/friendsList?list=${item}`
					});
				},
				test(){
					this.navigateTo('../test/test');
				},
				navigateTo(url) {
					uni.navigateTo({
						url: url
					});
				},
				
				// 点赞
				like(item) {
					// console.log("点击",item.id);
					let data={
						token:this.token,
						circle_id:item.id,
						};
					request.post('give',data).then(res=>{
						this.$token(res.code==500);
						// console.log("点赞",res);
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
					// console.log(item);
				},
				comment(index) {
					// console.log("index",index);
					this.showInput = true; //调起input框
					this.focus = true;
					this.index = index;
				},
				
				
				
				adjust() { //当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
					return;
					uni.createSelectorQuery().selectViewport().scrollOffset(res => {
						var scrollTop = res.scrollTop;
						
						
						let view = uni.createSelectorQuery().select("#post-" + this.index);
						view.boundingClientRect(data => {
							console.log("data:" + JSON.stringify(data));
							console.log("手机屏幕高度:" + this.screenHeight);
							console.log("竖直滚动位置" + scrollTop);
							console.log("节点离页面顶部的距离为" + data.top);
							console.log("节点高度为" + data.height);
							console.log("窗口高度为" + this.windowHeight);
			
							uni.pageScrollTo({
								scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
								// scrollTop: 50, 
								duration: 300
							});
						}).exec();
					}).exec();
				},
				
				
				
				reply(index, comment_index) {
					this.is_reply = true; //回复中
					this.showInput = true; //调起input框
					let replyTo = this.posts[index].comments.comment[comment_index].username;
					this.input_placeholder = '回复' + replyTo;
					this.index = index; //post索引
					this.comment_index = comment_index; //评论索引
					this.focus = true;
				},
				
				
				
				blur: function() {
					this.init_input();
				},
				send_comment: function(message) {
					this.posts[this.index].comments.total += 1;
					this.posts[this.index].comments.comment.push({
						"uid": this.user_id,
						"username": this.username,
						"content": comment_content //直接获取input中的值
					});
					this.init_input();
				},
				init_input() {
					this.showInput = false;
					this.focus = false;
					this.input_placeholder = '评论';
					this.is_reply = false;
				},
				previewImage(imageList, image_index) {
					var imgList=[];
					for(var i=0;i<imageList.length;i++){
						imgList.push('http://social.wgzy69.com/api/CircleUrl/'+imageList[i].circle_url);
					}
					var current = imageList[image_index];
					uni.previewImage({
						current: current.circle_url,
						urls: imgList
					});
				},
				goPublish() {
					uni.navigateTo({
						url: './publish/publish',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				},
				release(){
					uni.navigateTo({
					    url: '../release/release'
					});
				},
				redlove(val){
					console.log("redlove",val);
				},
			
			
			
			//添加好友接口
			addfriend(){
				
				// if(this.state==false){
				// 	this.state=true
				// }else if(this.state==true){
				// 	this.state=false
				// }
				uni.request({
					url:`http://social.wgzy69.com/api/addUser`,
					method:'GET',
					data:{
						token:this.token,
						friends_id:this.friendInformation.user_id,
					},
				 }).then((res)=>{
					 this.$token(res.code==500);
					 // console.log("加好友",res);
					 for(var i=0;i<res.length;i++){
						 var re=res[i]
					 }
					 // console.log("添加好友接口",re);
					 if(re.data.code==200){
						 this.state=false;
						 // console.log("加好友",this.friendInformation);
						 // console.log("加好友",this.state);
						 // uni.navigateTo({
						 //     url:'../news/news'
						 // });
						uni.showToast({
							title: "添加成功",
							icon: 'success',
							duration: 2000
						});
					 }else{
						 uni.showToast({
						 	title: "添加失败",
						 	icon: 'none',
						 	duration: 2000
						 }); 
					 }
					// console.log(,res);
				 }).catch((err)=>{
					console.log(err);
				 })
			},
			setUp(){
				console.log("111",this.friendInformation.type);
				if(this.friendInformation.type==1){
					uni.navigateTo({
					    url:`../setUp/setUp?id=${this.friendInformation.user_id}`
					});
				}else if(this.friendInformation.type==2){
					uni.navigateTo({
					    url:`../setUp1/setUp1?id=${this.friendInformation.user_id}`
					});
				}
			},
			// 内容高度自适应
			getlistHeight(list){
				let _this = this
				let info = uni.createSelectorQuery().select(list);
				info.boundingClientRect(function(data) {
					// console.log(data)  // 获取元素的各种参数
					 _this.listHeight = data.height ; // 获取元素高度
					_this.getHeight();
				}).exec();
			},
			getHeight(){
				let _this = this;
				_this.swiperHeight = _this.listHeight;
				return _this.swiperHeight;
			},
			changeTab(e) { 
				// console.log("11111",e.target.current)
				const tabIndex = e.detail.current
				this.tabIndex = tabIndex;
				// 不同的tab不同的高度赋不同的值
				if(e.target.current==0){
					let list = ".list";
					this.getlistHeight(list);
				}else if(e.target.current==1){
					let list = ".list1";
					this.getlistHeight(list);
				}
			},
			navigateBack(){
				uni.navigateBack();
			},
			toggleTab(index){
				// console.log(index)
				this.tabIndex = index
			},
			//滑动切换swiper
			tabChange(e){
				// console.log(e.detail)
				const tabIndex = e.detail.current
				this.tabIndex = tabIndex
			}
		}
	}
</script>

<style scoped>
	@import url("../../common/index/index.css");
	.nameLength{
		max-width: 120upx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.post_right1{
		padding: 0 40upx;
	}
	.list1{
		padding:0 40upx;
	}
	
	.tool>image{
		width: 40upx;
		height: 40upx;
	}
	.find{
		width: 100%;
		padding: 40upx 34upx;
	}
	.findTOP{
		display: flex;
		justify-content: space-between;
	}
	.findTitle{
		font-size:44upx;
		font-weight:bold;
	}
	/* .Navigation{
		background-color: rgba(0,0,0,0.2);
	}
	.Navigation>text{
		color: #FFFFFF;
	}
	.IFcontent{
		margin-left: 23upx;
	} */
	.IFcontentTop{
		/* width: 60%; */
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		margin-top:24upx;
	}
	.IFname{
		font-size:32upx;
		font-weight:bold;
	}
	.IFimg{
		width: 24upx;
		height: 24upx;
		margin:0 20upx;
	}
	.IFgrade{
		width: 100upx;
		background-color: #F5DD74;
		border-radius: 20upx;
		text-align: center;
	}
	.IFcontentB{
		width: 95%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		margin-top:24upx;
	}
	.IFaddress{
		font-size:28upx;
		font-weight:bold;
		color:#9C9C9C;
	}
	.IFdata{
		font-size:38upx;
		font-weight:800;
		margin-top:36upx;
	}
	.IFid{
		font-size:30upx;
		font-weight:600;
		color:#333333;
		margin-top: 24upx;
	}
	.IFalbum{
		width: 95%;
		margin-top: 24upx;
		display: flex;
		justify-content: space-between;
	}
	.IFalbum>image{
		width: 16upx;
	}
	.photo{
		width: 95%;
		display: flex;
		margin-top: 24upx;
	}
	.sina{
		width: 95%;
		margin-top: 20upx;
		display: flex;
		flex-wrap:wrap;
	}
	.signature{
		text-align: center;
		width: 190upx;
		background-color:#F6F7F9;
		font-size: 22upx;
		padding: 8upx 30upx;
		border-radius: 20upx;
		margin: 20upx;
	}
	.IFbutton{
		z-index: 100;
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 120upx;
		background-color: #FFFFFF;
	}
	.IFbutton>image{
		display: block;
		margin: auto;
		margin-top:20upx;
	}
	/* .IFadd{
		width: 85%;
		height: 80upx;
		border-radius: 20upx;
		margin: auto;
		background-color: #F9DE4A;
		text-align: center;
	} */
	/* 导航 */
	.uni-swiper-tab{
		font-size:38upx;
		font-weight:800;
		margin-top:36upx;
		border: none !important;
	}
	.swiper-tab-list{
		margin:20upx;
		color: #969696;
		font-weight: bold;
	}
	.uni-tab-bar .active{
		color: #343434;
	}
	.active .swiper-tab-line{
		border-bottom: 6upx solid #FEDE33;
		width: 70upx;
		margin: auto;
		border-top: 6upx solid #FEDE33;
		border-radius: 20upx;
	}
	.uni-swiper-tab{
		border-bottom: 1upx solid #eeeeee;
	}
	
	
	
	/* 动态 */
	.findText{
		margin:40upx 0;
	}
	.FTtop{
		display: flex;
		justify-content: left;
	}
	.FTcontent{
		margin-left: 30upx;
		margin-top: 6upx;
	}
	.FTname,.FTtime{
		font-size: 24upx;
	}
	.FTname{
		font-weight: 600;
	}
	.FTtime{
		color: #B5B5B5;
		margin-top: 20upx;
	}
	.FTpicture{
		margin:40upx 20upx;
		display: flex;
		justify-content: space-between;
	}
	.love,.comment{
		display: flex;
	}
	.TFbottom{
		width: 60%;
		display: flex;
		justify-content: space-between;
		margin-left: 20upx;
	}
	.love>image,.comment>image{
		width: 40upx;
		margin-right: 10upx;
	}
	.share{
		width: 40upx;
	}
</style>
