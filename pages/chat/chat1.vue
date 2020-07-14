<template>
	<view>
		<view class="chatInterface" id="content" :style="{height: style.contentViewHeight + 'px'}">
		<!-- <view class="content" id="content" :style="{height: style.contentViewHeight + 'px'}"> -->
			<view class="chat-scroll-container">
				<scroll-view ref="myScroll" scroll-y="true" class="scroll-view" id="scrollview" :style="{height: style.contentViewHeight + 'px'}" :scroll-with-animation="true" :scroll-top="scrollTop">
				<!-- <scroll-view id="scrollview" class="chat-window" scroll-y="true" :style="{height: style.contentViewHeight + 'px'}" :scroll-with-animation="true" :scroll-top="scrollTop"> -->
					<!-- <div :class="[loading ? 'top' : 'top gray']" @click="loadMoreHistoryMessage">
						<span>{{loading ? '点击加载更多历史消息' : '已经没有更多的历史消息'}}</span>
					</div> -->
					<!-- <div>{{messages}}</div> -->
					<view v-for="(message, key) in messages || []"
						 :id="'message' + message.id"
						 :key="key"
						 class="m-item"
						 :class="[message.fromid == name_id ? 'self message-item' : 'message-item']">
						<view v-if="message.fromid != name_id">
							<!-- :class="friend.online ? 'avatar' : 'avatar offline-gray'" -->
							 <view>好友</view>
							<!-- <image :src="friend.avatar" ></image> -->
						</view>
						<view class="avatar" v-else>
							<view>自己</view>
							<!-- <image :src="currentUser.avatar"></image> -->
						</view>
						<view class="content">
							<span>{{message.content}}</span>
						</view>
					</view>
					<view></view>
				</scroll-view>
			</view>
		</view>
		<view class="action-box">
			<input type="text" placeholder="发送消息" class="message-input" v-model="contentList">
			<span class="send-message-btn" @click="sendList">发送</span>
		</view>
	</view>
</template>

<script>
	import socket from '../../common/socket.js'
	export default {
		name: "private",
		data() {
			return {
				contentList: '',
				friend: null,
				currentUser: null,
				messages: [],
				loading: true,
				contentPosition : '',
				
				fromid_id:'',
				name_id:'',
				style:{
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0
				},
				scrollTop:''
			}
		},
		created() {
			var that = this
			const res = uni.getSystemInfoSync();   //获取手机可使用窗口高度     api为获取系统信息同步接口
			that.style.pageHeight = res.windowHeight;
			that.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100) - 70; //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下 
			that.scrollToBottom();   //创建后调用回到底部方法
			console.log("手机高",res);
			socket.acceptMessage = function(res){
				console.log("VUEX",res);
				if(res.type=='record'){
					that.messages=res.data;
				}else if(res.type=='text'){
					that.messages.push(res.data);
				}
			}
		},
		onLoad(options) {
			this.fromid_id=85;
			 // console.log("好友",option.id);
			 this.name_id=82;

			//对话数据
			this.friend = JSON.parse(options.friend);
			this.currentUser = this.imService.currentUser;
			this.messages = this.imService.getPrivateMessages(this.fromid_id);

			//传入监听器，收到一条私聊消息总是滚到到页面底部
			this.imService.onNewPrivateMessageReceive =  (friendId, message)=> {
				if (friendId == this.fromid_id) {
					//收到新消息，是滚动到最底部
					this.$nextTick(() => {
						this.contentPosition = 'message' + message.id
					})
				}
			};

			//传入监听器，完成一次私聊历史加载时，如果加载结果为空，显示没有更多消息
			this.imService.onPrivateHistoryLoad = (fromid_id, messages) =>{
				if (messages.length == 0) {
					//灰色，就不能点击了
					this.loading = false
				}
			};
			
			//每次进入聊天页面，总是滚动到底部
			this.$nextTick(() => {
				this.contentPosition = 'message1'
			})

		},
		onShow() {
			this.onSocketSend();
		},
		onUnload() {
			//退出聊天页面之前，清空页面传入的监听器
			this.imService.onNewPrivateMessageReceive =  (fromid_id, message)=> {};
			this.imService.onPrivateHistoryLoad = (fromid_id, messages) =>{};
			//将未读消息数清零
			this.imService.resetFriendUnReadMessage(this.friend);
		},
		methods: {
			onSocketSend(){
				socket.send({
					toid:this.fromid_id,
					fromid:this.name_id,
					type: "record",
				}, () => {
			
				});
			},
			
			
			scrollToBottom() {
				let that = this;
				let query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();
				query.exec((res) => {
					that.style.mitemHeight = 0;
					res[0].forEach((rect) => that.style.mitemHeight = that.style.mitemHeight + rect.height + 40)   //获取所有内部子元素的高度
	　　　　　　　　　// 因为vue的虚拟DOM 每次生成的新消息都是之前的，所以采用异步setTimeout    主要就是添加了这红字
　　　　　　　　　　 setTimeout(() => {
					　　if (that.style.mitemHeight > (that.style.contentViewHeight - 100)) {   //判断子元素高度是否大于显示高度
						　　that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight    //用子元素的高度减去显示的高度就获益获得序言滚动的高度
					　　}
　　　　　　　　　	}, 100)
				})
			},
			
			
			
			//生成时间
			time() {
			    var _date = new Date();
				var year=_date.getFullYear() + '-';
				var month=(_date.getMonth()+1 < 10 ? '0'+(_date.getMonth()+1) : _date.getMonth()+1) + '-';
				var data= _date.getDate() + ' ';
			    var hours = _date.getHours();
			    var minutes = _date.getMinutes();
			    var seconds = _date.getSeconds();
				var	date =year+month+data+hours+':'+minutes+':'+seconds;
			    return date;
			},
			// 发送信息
			sendList(){
				if(!this.contentList){
					uni.showToast({
						title:'请输入有效的内容',
						icon:'none'
					})
					return;
				}
				
				
				setTimeout(()=>{
					uni.hideLoading();
					
					this.sendSum={
						"create_time":this.time(),
						"content":this.contentList,
						'fromid':82,
					}
					if(this.sendSum.content!==''){
						this.messages.push(this.sendSum);
						socket.send({
							toid:85,
							fromid:82,
							type: "say",
							content: this.sendSum.content
						}, () => {
						
						});
					}
					this.$nextTick(()=>{
						this.contentList = '';
					})
				},500);
			},
			
			
			sendMessage() {//发送消息
				if (this.content.trim() != '') {
					this.imService.sendPrivateMessage(this.friend.uuid, this.content);
				}
				this.content = "";
			},
			loadMoreHistoryMessage() {//历史消息
				let lastMessageTimeStamp = Date.now();
				let lastMessage = this.messages[0];
				if (lastMessage) {
					lastMessageTimeStamp = lastMessage.timestamp;
				}
				this.imService.loadPrivateHistoryMessage(this.friend.uuid, lastMessageTimeStamp);
			}
		}
	}
</script>

<style>
	page {
		height: 100%;;
	}

	uni-page-body {
		height: 100%;;
	}
	#content{
		height: 100%;;
	}
	.chatInterface .avatar{
	    overflow: hidden;
	    float: left;
	}
	.chatInterface .avatar img{
	    width: 100%;
	    height: 100%;
	    display: block;
	}
	.chatInterface .content{
	    float: left;
	    overflow: hidden;
	}
	.chatInterface .content span{
	    font-family: Source Han Sans CN;
	    letter-spacing: -0.41px;
	    color: #262628;
	    background: #efefef;
	    display: inline-block;
	    word-break: break-all;
	}
	.chatInterface .message-item.self{
	    margin-right: 0;
	}
	.chatInterface .message-item.self .avatar{
	    margin-right: 0;
	    float: right;
	}
	.chatInterface .message-item.self .content{
	    text-align: right;
	    float: right;
	}
	.chatInterface .message-item.self .content span{
	    color: #ffffff;
	    background:#D02129;
	    word-break: break-all;
	    text-align: left;
	}
	.action-box{
		position: absolute;
		bottom: 0;
	    background: #FAFAFA;
	    display: flex;
	    align-content: center;
	    align-items: center;
	}
	.message-input{
	    background: #efefef;
	    border: 0;
	    outline: none;
	}
	
	.send-message-btn{
	    flex-grow: 1;
	    text-align: center;
	    color: #95949A;
	}
	
	.chatInterface .member-layer{
	    width:100%;
	    height: 100%;
	    background: #FFFFFF;
	    top: 0;
	    left: 0;
	    position: absolute;
	}
	.member-layer .member{
	    display: flex;
	    flex-wrap: wrap;
	}
	
	.chatInterface .group-icon{
	    position: absolute;
	}
	
	.chatInterface .gray{
	    color: gray!important;
	    text-decoration: none!important;
	}
	.chatInterface{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}
	.chatInterface .header{
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		font-size: 36rpx;
		background: linear-gradient(0deg, #D02129, #D02129), linear-gradient(195.96deg, #F33A3A 9.83%, #D02129 105.7%);
		display: flex;
		color: #ffffff;
		justify-content: center;
		align-content: flex-start;
	}
	.chatInterface .back-btn{
		position: absolute;
		left: 20rpx;
	}
	.chatInterface .group-icon{
		right: 20rpx;
		width: 60rpx;
		height: 60rpx;
		top:14rpx
	}
	.chatInterface .chat-scroll-container{
		overflow: hidden;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 100%;
		display: flex;
		flex: 1;
	}
	.chatInterface .scroll-view{
		flex: 1;
		overflow: auto;
		box-sizing: border-box;
	}
	.chatInterface .top{
		font-size: 24rpx;
		height: 90rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		-webkit-tap-highlight-color: transparent;
		color: blue;
	}
	.chatInterface .top span{
		text-decoration: underline;
	}

	.chatInterface .message-item{
		max-height: 400rpx;
		margin-top: 40rpx;
		overflow: hidden;
	}
	.chatInterface .avatar{
		width: 80rpx;
		height: 80rpx;
		margin-right:20rpx ;
	}
	.chatInterface .content{
		font-size: 34rpx;
		line-height: 44rpx;
		max-height: 400rpx;
	}
	.chatInterface .content span{
		padding: 16rpx;
		border-radius: 12rpx;
	}

	.chatInterface .message-item.self .avatar{
		margin-left: 20rpx;
	}
	.chatInterface .message-item.self .avatar image{
		width: 100%;
		height: 100%;
	}
	.chatInterface .message-item .avatar image{
		width: 100%;
		height: 100%;
	}

	.action-box{
		height: 130rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 32rpx;
		backdrop-filter: blur(0.27rpx);
		width: 100%;
	}
	.message-input{
		width: 500rpx;
		height: 80rpx;
		border-radius: 12rpx;
		padding-top: 18rpx;
		padding-bottom: 18rpx;
		padding-left: 40rpx;
		padding-right: 40rpx;
		font-size: 28rpx;
	}
	.send-message-btn{
		font-size: 32rpx;
	}
</style>
