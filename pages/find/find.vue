<template>
	<view class="find" id="moments">
		<view class="findTOP">
			<view class="findTitle">
				发现
			</view>
			<view @click="release" style="height: 60upx;width: 100upx;background-color: #FCF15D;padding:5upx;padding-top:8upx;text-align: center;border-radius: 10upx;">
				发布
			</view>
		</view>

		<view class="moments__post" v-for="(post,index) in valList" :key="index" :id="'post-'+index">
			<!-- <navigator animation-duration="300" :url="`../friendsList/friendsList?friendId=${post.id}`"> -->
				<view @click="jump(post)" class="post-left">
					<image class="post_header" :src="post.photo_url"></image>
					<view class="name">
						<view class="post-username">{{post.nickName}}</view>
						<view class="gray">{{post.time}}</view>
					</view>
				</view>
						
				<view class="post_right">
					<view @click="jump(post)" id="paragraph" class="paragraph">{{post.content}}</view>
					<!-- 相册 -->
					<view class="thumbnails">
						<view :class="post.url.length === 1?'my-gallery':'thumbnail'" v-for="(image, index_images) in post.url" :key="index_images">
							<image class="gallery_img" lazy-load mode="aspectFill" :src="'http://social.wgzy69.com/'+image.circle_url" :data-src="'http://social.wgzy69.com/'+image.circle_url" @tap="previewImage(post.url,index_images)"></image>
						</view>
					</view>
					<view class="toolbar1">
						<view class="tool" @click="like(post)">
							<image :src="post.type==2?'../../static/one/love1.png':'../../static/one/redlove1.png'"></image>
							<!-- <image :src="changeImg" mode="widthFix"></image> -->
							<text style="margin-top:10upx;margin-left: 10upx;">{{post.zan}}</text>
						</view>
						<view class="tool" @click="jump(post)">
							<image src="../../static/one/comment1.png"></image>
							<text style="margin-top:10upx;margin-left: 10upx;">{{post.ping}}</text>
						</view>
					</view>
				</view>
			<!-- 结束 post -->
		</view>
		
		<view class="foot" v-show="showInput">
			<chat-input @send-message="send_comment" @blur="blur" :focus="focus" :placeholder="input_placeholder"></chat-input>
		</view>
		<view style="text-align: center;" class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	import chatInput from '../../components/im-chat/chatinput.vue'; //input框
	import postData from '../../common/index/index.post.data.js';//朋友圈数据
	export default {
		components: {
			chatInput
		},
		data() {
			return {
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
				valList:''
			}
		},
		watch: {
			'$store.state.list'	:function(val){
				let that=this;
				// this.valList=val
				setTimeout(function() {
					that.valList=val;
					console.log("++++++++++",that.valList);
				}, 120);
			}
		},
		onLoad() {
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
			// console.log("token",this.token);
		},
		onShow() {
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
			uni.startPullDownRefresh();
			this.jk();
		},
		
		onReachBottom() { //监听上拉触底事件
			var that=this;
			that.showLoadMore = true;
			setTimeout(() => { 
			//获取数据
				that.jkPage++;
				that.jk();
			}, 1000);
		},
		
		onPullDownRefresh() { //监听下拉刷新动作
			// 这里获取数据
			setTimeout(function() {
				//初始化数据
				uni.stopPullDownRefresh(); //停止下拉刷新
			}, 1000);
		},
		onNavigationBarButtonTap(e) {//监听标题栏点击事件
			if (e.index == 0) {
				this.navigateTo('../publish/publish')
			}
		},
		methods: {
			//朋友圈信息接口
			jump(item){    
				// console.log("朋友圈详情信息",item);
				// uni.navigateTo({
				//     url: `../friendInformation1/friendInformation1?item=${encodeURIComponent(JSON.stringify(re.data.data))}`
				// });
				uni.navigateTo({
				    url: `../friendsList/friendsList?item=${item.id}`
				});
			},
			// 初始化
			jk(){
				let data={
					token:this.token,
					page:this.jkPage,
				};
				request.get('circle',data).then(res=>{
					// console.log("朋友圈数据",res)
					this.$token(res.code==500);
					if(this.jkPage==1){
						this.posts=res.rows;
						this.$store.commit('upedateMessage',this.posts)
						
					}else{
						res.rows.map(item => {
							return this.posts.push(item);
						})
						// this.posts.push(res.rows);
						if(res.rows.length==0){
							this.loadMoreText = "暂无更多";
						}
						this.$store.commit('upedateMessage',this.posts)
						// console.log("空空空",this.posts);
					}
				})
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
				this.$store.state.list.filter(post => {
					// console.log("查找item是否相等",post);
					if(post==item){
						// console.log("0000000000",post);
						// if(post.type==2){
						// 	this.islike=true
						// 	post.type=1;
						// 	post.zan+=1;
						// }else{
						// 	post.type=2;
						// 	post.zan-=1
						// 	this.islike=false                
						// }
					}
				})
				/*
					1.拿vuex中的list
					2.如果vuex的list中包含当前item，就把vuex的list的item的type和zan赋值过来再进行点击操作；没有就用当前点击获取的值进行操作
				 */
				
				
				
				// console.log("点击",item);
				let data={
					token:this.token,
					circle_id:item.id,
					};
				request.post('give',data).then(res=>{
					this.$token(res.code);
					// console.log("朋友圈点赞",res);
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
				let data1={
					zan:item.zan,
					type:item.type,
				};
				this.$store.commit('upedateLike',data1);
				// console.log("全部数据",this.$store.state.list)
				// console.log("点赞---------vuex---------",this.$store.state.like.zan)
			},
			comment(index) {
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
				// console.log('1111',imageList);
				// console.log('1111',image_index);
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
				// console.log("redlove",val);
			}
		}
	}
</script>

<style scoped>
	@import url("../../common/index/index.css");
	.tool>image{
		width: 40upx;
		height: 40upx;
	}
	.find{
		width: 100%;
		padding: 10% 34upx;
	}
	.findTOP{
		display: flex;
		justify-content: space-between;
	}
	.findTitle{
		font-size:44upx;
		font-weight:bold;
	}
</style>

