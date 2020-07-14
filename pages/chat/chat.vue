<template>
	<view>
		<view class="tips color_fff size_12 align_c" :class="{ 'show':ajax.loading }" @tap="getHistoryMsg">{{ajax.loadText}}</view>
		<view class="box-1" id="list-box">
			<!-- v-bind:style="{'margin-top':height1 + 'px;'}"
			v-bind:style="{'color':item.pointTextColor?item.pointTextColor:maskColor}" -->
			<view class="cu-chat" v-bind:style="{'margin-top':height1+'px'}"  id="chat">
				<view v-for="(item,index) in talkList" :key="index" :id="`msg-${item.id}`">
					<view class="cu-item self" v-if="item.fromid==name_id">
						<view class="main">
							<view class="content bg-green shadow">
								<text>{{item.content}}</text>
							</view>
						</view>
						<image class="cu-avatar radius" :src="sface1" mode=""></image>
						<!-- <view class="c u-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view> -->
						<view class="date">{{item.create_time}}</view>
					</view>
					<view class="cu-item" v-if="item.fromid==fromid_id.id">
						<image class="cu-avatar radius" :src="fromid_id.sface" mode=""></image>
						<!-- <view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view> -->
						<view class="main">
							<view class="content shadow">
								<text>{{item.content}}</text>
							</view>
						</view>
						<view class="date">{{item.create_time}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view style="width: 100%;height: 164upx;">
			
		</view> -->
		<view class="box-2">
			<view class="flex_col">
				<view class="flex_grow">
					<input @input="onKeyInput" type="text" class="content" v-model="sendContent" placeholder="请输入聊天内容" placeholder-style="color:#DDD;" :cursor-spacing="6">
				</view>
				<button class="send"  @touchend.prevent="send">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import socket from '../../common/socket.js'
	export default {
		data() {
			return {
				sface1:'',
				talkList:[],
				id:'',
				socketTask: null,
				// 确保websocket是打开状态
				is_open_socket: false,
				//页面高度
				InputBottom: 0,
				// 自己的id
				name_id:'',
				// 好友的id
				fromid_id:'',
				//获取历史消息
				chatRecord:'',
				type:'record',
				//获取发送消息内容
				sendContent:'',
				//对方实时发送消息
				chatCentent:'',
				//发送多条消息内容
				sendSum:[],
				//进入页面的最后一条消息
				lastMessage:'',
				ajax:{
					rows:20,	//每页数量
					page:1,	//页码
					flag:true,	// 请求开关
					loading:true,	// 加载中
					loadText:'正在获取消息'
				},
				content:'',
				inputContent:'',
				height1:0,
				// height3:false
			}
		},
		created() {
			var that = this
			socket.acceptMessage = function(res){
				if(res.type=='record'){
					that.talkList=res.data;
					// console.log("历史记录",that.talkList);
				}else if(res.type=='text'){
					setTimeout(()=>{
						// console.log("收到的罅隙",res.data)
						that.talkList.push(res.data);
						that.$nextTick(()=>{
							uni.pageScrollTo({
							    scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
							    duration: 0
							});
						})
					},500);
				}
			};
		},
		onLoad(option) {
			// socket.init(function() {});
			this.fromid_id=JSON.parse(decodeURIComponent(option.id));
			// this.fromid_id=option.id;
			// console.log("传值的头像","-----",this.fromid_id.sface);
			
			// console.log("--------------传值的ID-----------",this.fromid_id.id);
			 var NAMEID = this.checkLogin("NAMEID");
			 this.name_id=NAMEID[5];
			 // console.log("自己的ID------",this.name_id);
			 // var SFACE=uni.getStorageSync('SFACE');
			 var SFACE = this.checkLogin("SFACE");
			 this.sface1=SFACE[1];
			 // console.log("本人的头像","-----",this.sface1);
			 
			 // console.log("id----------",this.name_id);
		},
		onShow() {
			uni.onKeyboardHeightChange(res => {
				if(res.height!==0){
					this.height1=300;
				}else if(res.height==0){
					this.height1=0;
				}
			  // console.log(res.height)
			})
			// socket.init(function() {});
			this.onSocketSend();
		},
		mounted() {
			// console.log("vuex",this.$store.state.messageList);
			this.$nextTick(()=>{
				this.getHistoryMsg();
			});
			// this.connectSocketInit();
			// console.log("获取元素样式",this.$refs.chat);
			const query = uni.createSelectorQuery().in(this);
			query.select('#list-box').boundingClientRect(data => {
				// console.log("chat的高度",data)
			}).exec();
		},
		onPageScroll(e){
			if(e.scrollTop<5){
				this.getHistoryMsg();
			}
		},
		methods: {
			// height2(){
			// 	console.log("111111",this.height3);
			// 	this.height1=0;
			// 	console.log("211111",this.height3);
			// },
			onKeyInput(e){
				// console.log('eeeeeee',e.detail.value)
				this.inputContent=e.detail.value;
			},
			onSocketSend(){
				socket.send({
					toid:this.fromid_id.id,
					fromid:this.name_id,
					type: "record",
					// content: this.message
				}, () => {

				});
			},
			// 获取历史消息
			getHistoryMsg(){
				if(!this.ajax.flag){
					return; //
				}
				
				// 此处用到 ES7 的 async/await 知识，为使代码更加优美。不懂的请自行学习。
				let get = async ()=>{
					this.hideLoadTips();
					this.ajax.flag = false;
					let data = await this.joinHistoryMsg();
					
					// console.log('----- 模拟数据格式，供参考 -----');
					// console.log(data);	// 查看请求返回的数据结构 
					
					// 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用
					let selector = '';
										
					if(this.ajax.page>1){
						// 非第一页，则取历史消息数据的第一条信息元素
						selector = `#msg-${this.talkList[0].id}`;
					}else{
						// 第一页，则取当前消息数据的最后一条信息元素
						selector = `#msg-${this.talkList[this.talkList.length-1].id}`;
					}
					
					// 将获取到的消息数据合并到消息数组中
					// this.talkList = [...data,...this.talkList];	
					
					// 数据挂载后执行，不懂的请自行阅读 Vue.js 文档对 Vue.nextTick 函数说明。
					this.$nextTick(()=>{
						// 设置当前滚动的位置
						this.setPageScrollTo(selector);
						
						this.hideLoadTips(true);
												
						if(data.length < this.ajax.rows){
							// 当前消息数据条数小于请求要求条数时，则无更多消息，不再允许请求。
							// 可在此处编写无更多消息数据时的逻辑
						}else{
							this.ajax.page ++;
							
							// 延迟 200ms ，以保证设置窗口滚动已完成
							setTimeout(()=>{
								this.ajax.flag = true;
							},200)
						}
						
					})
				}
				get();
			},
			// 拼接历史记录消息，正式项目可替换为请求历史记录接口
			joinHistoryMsg(){
				let join = ()=>{
					let arr = [];
					
					//通过当前页码及页数，模拟数据内容
					let startIndex = (this.ajax.page-1) * this.ajax.rows;
					let endIndex = startIndex + this.ajax.rows;
					for(let i = startIndex; i < endIndex; i++){
						arr.push({
							"id":i,	// 消息的ID
							"content":`这是历史记录的第${i+1}条消息`,	// 消息内容
							"type":Math.random() > 0.5 ? 1 : 0	,// 此为消息类别，设 1 为发出去的消息，0 为收到对方的消息,
							"pic":"/static/logo.png"	// 头像
						})
					}
					
					/*
						颠倒数组中元素的顺序。将最新的数据排在本次接口返回数据的最后面。
						后端接口按 消息的时间降序查找出当前页的数据后，再将本页数据按消息时间降序排序返回。
						这是数据的重点，因为页面滚动条和上拉加载历史的问题。
					 */
					// console.log("数据",arr);
					
					return arr;
				}
				
				// 此处用到 ES6 的 Promise 知识，不懂的请自行学习。
				return new Promise((done,fail)=>{
					// 无数据请求接口，由 setTimeout 模拟，正式项目替换为 ajax 即可。
					setTimeout(()=>{
						let data = join();
						done(data);
					},1500);
				})
			},
			// 设置页面滚动位置
			setPageScrollTo(selector){
				let view = uni.createSelectorQuery().in(this).select(selector);
				view.boundingClientRect((res) => {
					uni.pageScrollTo({
					    scrollTop:res.top - 30,	// -30 为多显示出大半个消息的高度，示意上面还有信息。
					    duration: 0
					});
				}).exec();
			},
			// 隐藏加载提示
			hideLoadTips(flag){
				if(flag){
					this.ajax.loadText = '消息获取成功';
					setTimeout(()=>{
						this.ajax.loading = false;
					},200);
				}else{
						this.ajax.loading = true;
					if(this.talkList.length==0){
						this.ajax.loadText = '没有消息';
						setTimeout(()=>{
							this.ajax.loading = false;
						},500);
					}else{
						this.ajax.loadText = '正在获取消息';
					}
					
				}
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
			send(){
				if(!this.sendContent){
					uni.showToast({
						title:'请输入有效的内容',
						icon:'none'
					})
					return;
				}
				
				// uni.showLoading({
				// 	title:'正在发送'
				// })
				setTimeout(()=>{
					uni.hideLoading();
					
					this.sendSum={
						"create_time":this.time(),
						"content":this.sendContent,
						'fromid':this.name_id,
					}
					
					// console.log("send------1",this.fromid_id.id);
					// console.log("send------2",this.name_id);
					// console.log("send------3",this.sendSum.content);
					if(this.sendSum.content!==''){
						this.talkList.push(this.sendSum);
						// console.log("高度什么？？？？？？？？？？",this.talkList.length);
						// console.log("311111",this.height3);
						// if(this.talkList.length==1 || this.talkList.length==2 || this.talkList.length==4 || this.talkList.length==5 || this.talkList.length==6 || this.talkList.length==7){
						// 	this.height1=300;
						// }
						// else if(this.talkList.length==2){
						// 	this.height1=150;
						// }
						socket.send({
							toid:this.fromid_id.id,
							fromid:this.name_id,
							type: "say",
							content: this.sendSum.content
						}, () => {
						
						});
						// console.log("清空",this.inputContent);
					}
					this.$nextTick(()=>{
						this.sendContent = '';
						uni.pageScrollTo({
						    scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
						    duration: 0
						});
					})
				},500);
			}
		}
	}
</script>

<style lang="scss">
	@import "../../static/lib/global.scss";
	page{
		background-color: #F3F3F3;
		font-size: 28rpx;
	}
	
	/* 加载数据提示 */
	.tips{
		position: fixed;
		left: 0;
		top:var(--window-top);
		width: 100%;
		z-index: 9;
		background-color: rgba(0,0,0,0.15);
		height: 72rpx;
		line-height: 72rpx;
		transform:translateY(-80rpx);
		transition: transform 0.3s ease-in-out 0s;
		
		&.show{
			transform:translateY(0);
		}
	}
	
	.box-1{
		width: 100%;
		height: auto;
		padding-bottom: 100rpx;
		box-sizing: content-box;
		
		/* 兼容iPhoneX */
		margin-bottom: 0;  
		margin-bottom: constant(safe-area-inset-bottom);  
		margin-bottom: env(safe-area-inset-bottom);  
	}
	.box-2{
		position: fixed;
		left: 0;
		width: 100%;
		bottom: 0;
		height: auto;
		z-index: 2;
		border-top: #e5e5e5 solid 1px;
		box-sizing: content-box;
		background-color: #F3F3F3;
		
		/* 兼容iPhoneX */
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
		
		>view{
			padding: 0 20rpx;
			height: 100rpx;
		}
		
		.content{
			background-color: #fff;
			height: 64rpx;
			padding: 0 20rpx;
			border-radius: 32rpx;
			font-size: 28rpx;
		}
		
		.send{
			background-color: #42b983;
			color: #fff;
			height: 64rpx;
			margin-left: 20rpx;
			border-radius: 32rpx;
			padding: 0;
			width: 120rpx;
			line-height: 62rpx;
			
			&:active{
				background-color: #5fc496;
			}
		}
	}
	
	.talk-list{
		padding-bottom: 20rpx;
		
		/* 消息项，基础类 */
		.item{
			padding: 20rpx 20rpx 0 20rpx;
			align-items:flex-start;
			align-content:flex-start;
			color: #333;
			
			.pic{
				width: 92rpx;
				height: 92rpx;
				border-radius: 50%;
				border: #fff solid 1px;
			}
			
			.content{
				padding: 20rpx;
				border-radius: 4px;
				max-width: 500rpx;
				word-break: break-all;
				line-height: 52rpx;
				position: relative;
			}
			
			/* 收到的消息 */
			&.pull{
				.content{
					margin-left: 32rpx;
					background-color: #fff;
					
					&::after{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-right: 20rpx solid #fff;
						position: absolute;
						top: 30rpx;
						left: -18rpx;
					}
				}
			}
			
			/* 发出的消息 */
			&.push{
				/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
				flex-direction: row-reverse;
				
				.content{
					margin-right: 32rpx;
					background-color: #a0e959;
					
					&::after{
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-left: 20rpx solid #a0e959;
						position: absolute;
						top: 30rpx;
						right: -18rpx;
					}
				}
			}
		}
	}
</style>