<template>
	<!-- 好友列表 -->
		<view style="padding:60upx 20upx;">
			<view class="Box" v-if="show">
				<view class="content">
					<view class="inputSearch">
						<image style="width: 50upx;height: 50upx;margin:6upx 25upx;" src="../../static/img/search.png" mode=""></image>
						<input
							type="text"
							name="nickname"
							:value="name" 
							class="input"
							placeholder="请输入昵称"
							maxlength="10"
							placeholder-style="color:#FFFFFF;font-size:28upx"
							/>
					</view>
					<text class="cancel" @click="cancel">取消</text>
				</view>
			</view>
			<!-- @confirm="search" -->
			<!--顶部导航栏-->
			<view class="uni-tab-bar">
				<scroll-view scroll-x class="uni-swiper-tab">
					<block v-for="(tabBar,index) in tabBars" :key="index">
						<view style="" class="swiper-tab-list" :class="{'active': tabIndex==index}" @click="toggleTab(index)">
							{{tabBar.name}}
							<view class="swiper-tab-line">
							</view>
						</view>
					</block>
					
				</scroll-view>
				<view @click="add" style="width: 50upx;height: 50upx;position: absolute;right: 0;top:80upx;margin-right: 30upx;">
					<image style="width: 50upx;height: 50upx;" src="../../static/img/add.png" mode=""></image>
				</view>
			</view>
			<!--内容区-->
			<view class="uni-tab-bar">		    
				<swiper :current="tabIndex" @change="changeTab" :style="{height:swiperHeight+'px'}">
					<swiper-item style="display: flex;" v-for="(content,index) in contentList" :key="index" >
						<scroll-view v-if="index==0">
							<view class="list">
								<navigator v-for="(item,index) in messageList" style="display: flex;width: 95%;justify-content: space-between;margin-top:20upx;" animation-type="pop-in" animation-duration="300" :url="`../dibu/dibu?user_id=${item.last_message.fromid}`">
									<view style="display: flex;">
										<view style="position: relative;">
											<image style="width: 100rpx;height: 100rpx;border-radius: 50%;" :src="item.last_message.photo_url" mode="">
												<view v-if="item.countNoread!=='0'" style="width: 35upx;height: 35upx;background-color: #E03997;position: absolute;top: 0;right: 0;border-radius: 50%;text-align: center;line-height: 35upx;color: #FFFFFF;font-size: 18upx;border: 1px solid #FFFFFF;">
													{{item.countNoread}}
												</view>
											</image>
										</view>
										<view>
											<view style="margin-left: 20rpx;font-weight: bold;">{{item.last_message.nickname}}</view>
											<view style="margin-left: 20rpx;color: #888888;font-size: 18upx;margin-top: 15upx;">{{item.last_message.content}}</view>
										</view>
									</view>
									<view style="margin-left: 20rpx;color: #888888;font-size: 18upx;">
										{{item.last_message.time}}
									</view>
								</navigator>
							</view>
						</scroll-view>
						<scroll-view v-if="index==1">
							<view class="list1">
								1111111111
							</view>
						</scroll-view>
						<scroll-view v-if="index==2">
							<view class="list2">
								<view class="search" @click="Search" v-if='!show'>
									<image v-if='!show' style="width: 40rpx;height: 40rpx;margin-right:15rpx ;" src="../../static/img/search.png" mode=""></image>
									<text>搜索好友</text>
								</view>
								
								
								<input type="text" value="" @input="searchInput" class="u-search-input" />
								<!-- <view class="friendsList" v-if="showSearchBox"> -->
									<!-- <view class="letter1">{{displayName.letter}}</view> -->
									<!-- 显示的位置 -->
									<!-- <view class="flText" v-for="item in list2">
										<image src="../../static/img/Ma'am.png" mode="widthFix"></image>
										<view></view>
										<text class="flName">{{item.name1}}</text>
									</view>
								</view> -->
									
									<!-- 搜索后出现的 -->
								<view class="friendsList">
									<!-- 显示的位置 -->
									<view class="flText" v-for="item in fsearch">
										<image src="../../static/img/addFriends.png" mode="widthFix"></image>
										<view>{{item.name1}}</view>
										<!-- <text class="flName">{{item.name1}}</text> -->
									</view>
								</view>
								
							<!-- 	<view class="">
									<input type="text" value="" @input="searchInput" class="u-search-input" />
									<view class="flText" v-for="item in fsearch">
										<image src="../../static/img/Ma'am.png" mode="widthFix"></image>
										<view>{{item.name1}}</view>
									</view>
								</view> -->
								<view class="one" v-for="item in user">
									<!-- <view class="letter">
										{{item.letter}}
									</view> -->
									<!-- <navigator :url="`/pages/index/information/news?id=${值}&title=值`"> </navigator> -->
									<navigator  class="user" animation-type="pop-in" animation-duration="300" :url="`../dibu/dibu?user_id=${item.user_id}`">
										<image style="width: 100rpx;height: 100rpx;border-radius: 50%;" :src="item.avatarUrl" mode=""></image>
										<text style="display: flex;align-items: center;margin-left: 20rpx;font-weight: bold;">{{item.nickname}}</text>
									</navigator>
								</view>
								<view style="height: 10px;">
									
								</view>
							</view>
						</scroll-view>
						<scroll-view v-if="index==3">
							<view class="list3">
								33333333333
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="addSpringBox" v-if="addFriends">
				<view class="addBg" @click="esc"></view>
				<view class="SpringBox">
					<view>
						<view class="top" @click="clickAdd">
							<image style="width: 50upx;height: 50upx;" src="../../static/img/addFriends.png" mode=""></image>
							<view>
								添加好友
							</view>
						</view>
						<view class="top" style="margin-top: 40upx;">
							<image style="width: 50upx;height: 50upx;" src="../../static/img/scanning.png" mode=""></image>
							<view>
								扫一扫
							</view>
						</view>
					</view>
				</view>
			</view>
			
			
		</view>
</template>

<script>
	export default {
		data() {
			return {
				peopleNearby:'',
				keyword:'猫',
				showSearchBox:true,
				list2:[
					{name1:'狗🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫1234🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫222🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫233334🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫24434🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫555🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫6666🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫9999🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫00098🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫45645🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫76576578🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫456464🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫234234234🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫65765765🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫45🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫3434🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					{name1:'猫1212🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'},
					
					],
				searchModel:'',
				searchKey:'',
				dictArr: ['你好1','你11好2','你好221','你好112231','你好133','你好124','你好123','你好331','你好4441','你好15','你好17','你好18','你好199','你好111120','你好1336','你好1117','你好1899'],
				
				
				// friendInformation:'',
				socketTask :null,
				messageList:'',
				userStorage:'',
				addFriends:false,
				name:'',
				show:false,
				tabIndex: 0,	//选中标签栏的序列
				user:'',
				capital:{a:"A",b:"B",c:"C"},
				contentList: [
								"聊天",
								"推荐",
								"好友",
								"群组"
							 ],
				tabBars:[
					{
						name: '聊天',
						id: 'liaotian'
					},
					{
						name: '推荐',
						id: 'tuijian'
					},
					{
						name: '好友',
						id: 'haoyou'
					},
					{
						name: '群组',
					}
				],
				listHeight:0,  //内部的高度
				swiperHeight:1000,  //外部的高度
			
			}
		},
		computed: {
			fsearch(){
				let newListData = []
				// console.log('start',this.keyword)
				if(this.keyword) {
					this.showSearchBox = false
					this.list2.filter(item => {
						if (item.name1.indexOf(this.keyword) !== -1) {
							newListData.push(item)
						}
					})
				}
				// console.log('111',newListData)
				return newListData
			}
		},
		//获取好友列表接口
		onLoad() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.userStorage=USERSTORAGE[2]
			uni.request({
				url:`http://social.wgzy69.com/api/friends`,
				method:'GET',
				data:{
					token:this.userStorage
				},
			 }).then((res)=>{
				 this.$token(res.code==500)
				 for(var i=0;i<res.length;i++){
				 	var re=res[i]
				 }
				 // console.log(re.data)
				 if(re.data.code==200){
					 this.user=re.data.data;
				 }
			 }).catch((err)=>{
				console.log(err);
			 })
		},
		// 关闭websocket【必须在实例销毁之前关闭,否则会是underfined错误】
		// beforeDestroy() {
		// 	this.socketTask.close({
		// 		success(res) {
		// 			this.is_open_socket = false;
		// 			console.log("关闭成功", res)
		// 		},
		// 		fail(err) {
		// 			console.log("关闭失败", err)
		// 		}
		// 	})
		// },
		onShow() {
			let _this = this;
			setTimeout(function(){
				let list = ".list";
				_this.getlistHeight(list);
			},10) 
			uni.connectSocket({
				url:'ws://47.108.129.142:8484'
			});
			uni.onSocketOpen(function(res){
				// console.log("WebSocket连接已打开！");
				var arr = {"type": "list", "fromid": 77};
				var str = JSON.stringify(arr);
			
				
				
				uni.sendSocketMessage({
					data: str,
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					}
				})
			});
			uni.onSocketMessage(function(res){
				var message = eval("(" + res.data + ")");
				_this.messageList=message;
				// _this.messageList.push(message);
				// console.log(_this.messageList);		
			});
		},
		methods: {
			searchInput(e){
				this.keyword = e.detail.value
			},
			// toid(){
			// 	console.log("11111",this.messageList.last_message.fromid)
			// },
			esc(){
				this.addFriends=false;
			},
			clickAdd(){
				uni.navigateTo({
				    url: '../addFriends/addFriends'
				});
			},
			add(){
				this.addFriends=true;
			},
			toggleTab(index){
				// console.log(index)
				this.tabIndex = index
				
			},
			Search(){
				this.show=true;
			},
			cancel(){
				this.show=false;
			},
			//滑动切换swiper
			tabChange(e){
				const tabIndex = e.detail.current
				this.tabIndex = tabIndex
				// console.log(e.detail);
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
				let _this = this;
				const tabIndex = e.detail.current
				_this.tabIndex = tabIndex;
				// 不同的tab不同的高度赋不同的值
				if(e.target.current==0){
					let list = ".list";
					_this.getlistHeight(list);
				}else if(e.target.current==1){
					let list = ".list1";
					_this.getlistHeight(list);
				}else if(e.target.current==2){
					let list = ".list2";
					_this.getlistHeight(list);
				}else if(e.target.current==3){
					let list = ".list3";
					_this.getlistHeight(list);
				}
			},
		}
	}
</script>

<style>
	.flText{
		display: flex;
		justify-content: left;
		background-color: #FFFFFF;
		padding-top:20upx;
		padding-left:40upx;
		padding-bottom: 20upx;
	}
	.flText>image{
		width: 100upx;
		border-radius: 50%;
	}
	.flName{
		display: flex;
		align-items: center;
		font-size:30upx;
		font-weight:bold;
		color:#242424;
		margin-left: 40upx;
	}
	
	
	.u-search-input{
			margin: 20rpx 30rpx 0 30rpx;
			padding: 20rpx 20rpx;
			height: 60rpx;
			border-radius: 24rpx;
			border: 1px solid #CCCCCC;
		}
		.u-search-list{
			margin: 20rpx 30rpx;
			padding: 11px 20rpx;
			border-radius: 10rpx;
			background: #FFFFFF;
			box-shadow:0px 5px 5px 0px rgba(0, 0, 0, 0.05);
		}
	/* 好友在玩 */
	
	
	swiper{
		height: 550px;
		/* max-width: 100vw; */
	}
	.search{
		/* width: 700rpx; */
		height: 50rpx;
		background-color: #8A6DE9;
		display: flex;
		justify-content: center;
		color: #FFFFFF;
		align-items: center;
		margin-top: 20rpx;
		padding:35upx 0;
		border-radius: 10rpx;
	}
	.letter{
		width: 750rpx;
		height: 50rpx;
		background-color: #CCCCCC;
		color: #8A6DE9;
		align-items: center;
		margin-top: 20rpx;
		padding-left: 28rpx;
		font-weight: bold;
	}
	.user{
		display: flex;
		margin: 20rpx;
	}
	.swiper-tab-list{
		width: 150rpx;
		color: #969696;
		font-weight: bold;
	}
	.uni-swiper-tab{
		width: 600upx;
		border: none !important;
	}
	.uni-tab-bar .active{
		color: #343434;
		font-size: 38rpx;
		color: #8A6DE9;
	}
	.uni-swiper-tab{
		border-bottom: 1upx solid #eeeeee;
	}
	.list{
		padding:0 20upx;
	}
	.list1{
		width: 100%;
		height: 1000upx;
	}
	.list3{
		width: 100%;
		height: 1000upx;
	}
	.Box{
		width:100%;
		position: fixed;
		height:100%;
		bottom:0;
		left:0;
		z-index: 999;
		background-color: rgba(0,0,0,.1);
	}
	.content{
		display: flex;
		width: 100%;
		position: absolute;
		height: 180upx;
		background-color: #FFFFFF;
	}
	.inputSearch{
		width: 80%;
		height: 60upx;
		display: flex;
		justify-content:space-between;
		background-color: #8A6DE9;
		margin:90upx 30upx;
		border-radius: 10upx;
	}
	.input{
		width: 95%;
		margin-top: 8upx;
	}
	.cancel{
		margin:90upx 0;
	}
	/* 添加好友弹框 */
	.addBg{
		width:100%;
		position: fixed;
		height:100%;
		bottom:0;
		left:0;
		background-color: rgba(0,0,0,.3);
		z-index:0;
	}
	.addSpringBox{
		width:100%;
		position: fixed;
		height:100%;
		bottom:0;
		left:0;
		display: flex;
	}
	.SpringBox{
		position: absolute;
		top:150upx;
		right: 0;
		margin-right: 20upx;
		width: 240upx;
		height: 260upx;
		background-color: #FFFFFF;
		border-radius: 20upx;
		display: flex;
		align-items: center;
		padding:30upx;
	}
	.top{
		width: 100%;
		display: flex;
	}
	.top>view{
		margin-left: 15upx;
	}
	uni-page-head .uni-page-head{
		height: 0 !important;
	}
</style>

