<template>
	<view class="news">
		<jui-list @relist="relist" :dhList="list" :listHeight="listHeight" @navChange="navChange" :swList="swList">
			<!-- 写法要注意 -->	
			<view :id="'item'+i" :slot="'list'+i" v-for=" (x,i) in swList " :key="i">
				<view class="bg-gradual-index-row" v-if="i==0">
					<view style="width: 100%;height: 5px;"></view>
					<view class="contTop1" v-if="nearbyFriends">
						<view style="font-weight: bold;font-size: 30upx;">         
							附近的人
						</view>
						<view @click="shut" style="height: 50upx;">
							<image  style="width: 30upx;height: 20upx;" src="../../static/one/bottom.png" mode=""></image>
						</view>
					</view>
					<view class="scroll" v-if="!nearbyFriends">
						<view class="contTop">
							<view style="font-weight: bold;">
								附近的人
							</view>
							<view @click="open" style="height: 50upx;">
								<image  style="width: 30upx;height: 20upx;" src="../../static/one/topiconft.png" mode=""></image>
							</view>
						</view>
						<scroll-view scroll-x="true">
							<view class="box" v-for="item in nearby">
								<view class="listBox" @click="addfriend(item.user_id)">
									<image class="boxch" :src="item.photo_url" mode="aspectFill"></image>
									<!-- <view class="boxch"></view> -->
									<view class="nameLength" style="font-weight: bold;">{{item.nickName}}</view>
									<view style="font-size: 18upx;">{{item.meters}}m</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 消息列表 -->
					
					<view :class="messageList.length<6 ? 'heig' : ''">
						<view @click="chat(item.fromid,item.photo_url)" v-for="item in messageList">
							<view class="messageList">
								<view class="mlLeft">
									<image style="width: 100upx;height: 100upx;border-radius: 50%;position: relative;" :src="item.photo_url" mode="aspectFill">
										<view v-if="item.CountNoread!==0" style="width: 40upx;height: 40upx;background-color: #E03997;color: #FFFFFF;border-radius: 50%;margin-left: -30upx;z-index: 10;text-align: center;line-height: 40upx;">
											{{item.CountNoread}}
										</view>
									</image>
									<view class="mlLeftText">
										<view class="text1">{{item.nickname}}</view>
										<view class="text2">{{item.content}}</view>
									</view>
								</view>
								<view class="time">
									{{item.time}}
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<!--   -->
				<view class="bg-gradual-blue-sm" v-if="i==1" style="width: 750rpx;">
					<view style="width: 100%;height: 5px;"></view>
					<view class="recommend" :class="nearby.length<7 ? 'heig1' : ''">
						<view class="rTop">
							<text class="rTopText">附近的人</text>
							<image src="../../static/one/rlist.png" mode=""></image>
						</view>
						<view class="rText" v-for="item in nearby">
							<view class="rTextLeft" @click="addfriend(item.user_id)">
								<image style="width: 100upx;height: 100upx;border-radius: 50%;" :src="item.photo_url" mode="aspectFill"></image>
								<view class="rTextContent">
									<text class="rName nameLength">{{item.nickName}}</text>
									<image :src="item.img" mode=""></image>
								</view>
							</view>
							<view class="distance">{{item.meters}}m</view>
						</view>
					</view>
				</view>
				
				<view class="bg-gradual-blue-sm" v-if="i==2">
					<view style="width: 100%;height: 5px;"></view>
					<!-- 好友 -->
					<view style="background-color: #F4F4F4;" :class="user.length<4 ? 'heig2' : ''">
						<view class="listTop">
							<view class="search">
								<image src="../../static/one/search.png" mode="widthFix"></image>
								<!-- 搜索 -->
								<input type="text" placeholder="搜索" @input="searchInput" class="u-search-input" />
							</view>
							<view class="newFriends" @click="newFriends">
								<image src="../../static/one/newFriends.png" mode=""></image>
								<text class="nfText">新的好友</text>
							</view>
						</view>
						<view>
							<view class="friendsList" v-if="showSearchBox || keyword==''">
								<view v-for="(item,index) in user">
									<view class="letter1">{{index}}</view>
									<view class="flText" v-for="(list,index) in item" @click="chat(list.user_id,list.photo_url)">
										<image :src="list.photo_url" mode="aspectFill"></image>
										<view></view>
										<text class="flName">{{list.nickname}}</text>
									</view>
								</view>
							</view>
							<view class="friendsList" v-if="!showSearchBox || !keyword==''">
								<view class="flText" v-for="item in fsearch">
									<image :src="item.photo_url" mode="aspectFill"></image>
									<view></view>
									<text class="flName">{{item.nickname}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				
			</view>									
						
		</jui-list>
		
	</view>
</template>


<script>
	//页面引入
	import socket from '../../common/socket.js'
	import request from '../../common/request.js'
	import juiList  from '@/components/jui-list/jui-list.vue';
	export default {
		components: {juiList},
		onReady() {	
			// 让swiper高度自适应
			this.getSwiper(0)
		},
		data() {
			return {
				messageList:[],
				name:'',
				widt:'100%',
				// 好友列表
				user:'',
				token:'',
				listHeight:1000,
				list:["聊天","推荐","好友"],
				// 俩个list 长度要一致
				swList:[1,2,3],
				nearbyFriends:false,
				list2:[
					{name1:'狗🐕',time:'05-19 01: 45',gray:'晚上打游戏呀'}
					
					],
				list1:[
					{name:'C',img:'../../static/one/gender1.png',gender:'183KM'}
					],
				displayName:[],
				a:'',
				nearby:'',
				keyword:'',
				showSearchBox:true,
				nameId:'',
				fs:[]
			}
		},
		created() {
			
		},
		
		onUnload(){
			console.log("退出");
		},		
		
		// 搜索
		computed:{
			fsearch(){
				let newListData = []
				// console.log('start',this.keyword)
				if(this.keyword) {
					this.showSearchBox = false;
					// console.log("这是个什么鬼",this.fs);
					this.fs.filter(item => {
						if (item.nickname.indexOf(this.keyword) !== -1) {
							newListData.push(item)
						}
					})
				}
				return this.unique(newListData)
				// return newListData
			}
			
		},
		// onLoad() {
		// 	socket.init(function() {});
		// },
		onShow() {
			socket.init(function() {});
			let _that=this;
			var USERSTORAGE = _that.checkLogin("USERSTORAGE");
			_that.token=USERSTORAGE[2];
			
			var NAMEID = _that.checkLogin("NAMEID");
			_that.nameId=NAMEID[5];
			
			_that.onSocketSend();
			_that.friends();
			_that.jjs();
			
			// console.log('hello~~~')
			// var that = this;
			// console.log("1-------");
			socket.acceptMessage = function(res){
				// console.log("消息列表接口-----",res);
				if(res.type=="list"){
					// console.log("1------------");
					_that.messageList=res.data;
					// console.log("消息列表接口",res);
				}else if(res.type=="text"){
					socket.send({
						type: "list",
						fromid: _that.nameId
					}, () => {
								
					});
					// console.log("消息列表接口+++++++++",res);
					_that.messageList=res.data;
				}
			}
		},
		methods: {
			unique(arr){
				let res=new Map();
				return arr.filter((arr)=> !res.has(arr.id) && res.set(arr.id,1))
			},
			// inpu(){
				
			// 	console.log(this.keyword);
			// 	this.keyword = 
			// 	console.log(11111);
			// },
			onSocketSend(){
				socket.send({
					type: "list",
					fromid: this.nameId,
				}, () => {
			
				});
			},
			chat(val,sface){
				// console.log("点击传入值 ",val,sface);
				// console.log("传递id",val);
				let obj = new Object();
				    //为对象添加动态属性
				 obj.id = val;
				 obj.sface = sface;
				 // console.log("对象",obj);
				 uni.navigateTo({url:'../chat/chat?id='+encodeURIComponent(JSON.stringify(obj))})
				// uni.navigateTo({
				//      url: `../chat/chat?id=${val}+${sface}`
				// });
			},
			searchInput(e){ 
				this.keyword = e.detail.value;
				// console.log("input",this.keyword);
			},
			inputFunc(){},
			addfriend(val){
				// console.log("点击到朋友",val);
				uni.request({
					url:`http://social.wgzy69.com/api/addFriends`,
					method:'GET',
					data:{
						token:this.token,
						friends_id:val
					},
				 }).then((res)=>{
					 // console.log("好友******************",res);
					 this.$token(res.code);
					 for(var i=0;i<res.length;i++){
					 	var re=res[i]
					 }
					 // uni.setStorageSync('FRIENFIN',re.data.data);
					 // console.log("传的值",re.data.data);
					 if(re.data.code==200){
						 uni.navigateTo({
						      url: `../friendInformation1/friendInformation1?item=${encodeURIComponent(JSON.stringify(re.data.data))}`
						 });
					 }
					 // else if(re.data.code==300){
						//  uni.navigateTo({
						//      url: '../PersonalCenter/PersonalCenter'
						//  });
					 // }
				 }).catch((err)=>{
					console.log(err);
				 })
			},
			//调用好友列表
			friends() {
				// console.log("封装接口");
				let data={token:this.token};
				request.get('friends',data).then(res=>{
					this.$token(res.code==500);
					this.user=res.data;
					// console.log("-------好友数据-------",res.data);
					for(let i in this.user){
						let abc=this.user[i];
						for(var f=0;f<abc.length;f++){
							this.fs.push(abc[f])
						}
					}
					// console.log('iiiiiiiiii',this.fs)
					// for(let i in res.data){
					// 	console.log("属性名",i);
					// 	console.log("属性值",res.data[i])
					// }
					// for(var i=0;i<res.data.length;i++){
					// 	console.log("好友列表循环处理");
					// }
					res.data.forEach((item)=>{
						// console.log("-------",item);
					})
					// console.log("好友列表",this.aa);
					if(res.code==200){
						this.user=res.data;
						// this.pySort(this.user)
					}
				})
			},
			//附近的人接口
			jjs(){
				let data={token:this.token};
				request.post('hobby',data).then(res=>{
					// console.log("附近的人",res.data);
					this.$token(res.code==500);
					this.nearby=res.data;
				})
			},
			//按大写字母分类
			 pySort(arrList){
			    var $this = this;
			    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split('');//ABCDEFGHJKLMNOPQRSTWXYZ
			    var result = [];
			    var curr;
			    for(let i=0;i<letters.length;i++){
					curr = {letter: letters[i], data:[]}; //字母对象，data数据
					arrList.forEach((n)=>{
						let initial = n.letter.charAt(0);//截取第一个字符
						if(initial==letters[i]){//首字符是英文的
							curr.data.push(n);
						}
					})
					result.push(curr)
					$this.displayName.push(curr);
			    }
				result.forEach((item)=>{
					if(item.data.length>0){
						this.displayName=item;
						// console.log("好友",this.displayName.data);
						// console.log("displayName",this.displayName)
					}
				})
				
			},
			isChinese(temp){
			    var re=/[^\u4E00-\u9FA5]/;
			    if (re.test(temp)){return false;}
			    return true ;
			},
			isChar(char){
			    var reg = /[A-Za-z]/;
			    if (!reg.test(char)){return false ;}
			    return true ;
			},
			// 新好友
			newFriends(){
				uni.navigateTo({
				    url: '../newFriends/newFriends'
				});
			},
			//关闭附近好友
			shut(){
				// console.log("关闭");
				this.nearbyFriends=false;
				},
			open(){
				// console.log("打开");
				this.nearbyFriends=true;
				// console.log("ref",this.$refs.nav.navData);
			},
			// 改变nav时触发 e为当前nav的索引
			navChange(e){				
				this.getSwiper(e)
			},
			// 自适应swiper高度
			getSwiper(id){
				// 等待虚拟dom渲染
				this.$nextTick(()=>{
					var query=uni.createSelectorQuery()
					query.select('#item'+id).boundingClientRect(data => {
						// 给swiper高度
						this.listHeight=data.height
					
					}).exec();
				})
			},
			// 刷新
			relist(){
				// 这里写刷新业务
				setTimeout(()=>{
					// 收回下拉刷新
					uni.$emit("reMsg",-1)
				},2000)
			}
		}
	}
</script>




<style scoped> 
.nameLength{
	max-width: 120upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.heig{
	height: 800upx;
}
.heig1{
	height: 1100upx;
}
.heig2{
	height: 1400upx;
}
/* 附近好友 */
	.scroll {
	    width: 96%;
	    overflow: hidden;
	    white-space: nowrap;
		background-color: #F6F7F9;
		margin:auto;
		margin-top:36upx;
		border-radius: 20upx;
		padding:10px;
	}
	.contTop1{
		width: 96%;
		height: 80upx;
		display: flex;
		justify-content: space-between;
		background-color: #F6F7F9;
		border-radius: 20upx;
		padding:20upx 40upx;
		margin: 35upx auto;
	}
	 .contTop{
		width: 95%;
		height: 80upx;
		text-align: left;
		padding:8upx 0;
		display: flex;
		justify-content: space-between;
		margin: auto;
	} 
	.box {
	    display: inline-block;
	    margin-right: 25upx;
	}
	.listBox{
		width: 120upx;
		text-align: center;
	}
	.boxch{
		width: 100upx;
		height: 100upx;
		/* background-color: #8DC63F; */
		border-radius: 50%;
	}
	/* 好友列表 */
	.messageList{
		display: flex;
		justify-content: space-between;
		margin-top:60upx;
		padding:0 40upx;
		
	}
	.mlLeft{
		display: flex;
		justify-content: space-between;
	}
	.mlLeftText{
		margin-left: 20upx;
	}
	.text1{
		font-size:30upx;
		font-weight:bold;
		color:#242424;
	}
	.text2{
		font-size:30upx;
		font-weight:400;
		color:#AAAAAA;
		margin-top:15upx;
	}
	.time{
		color: #AAAAAA;
	}
	/* 推荐 */
	.recommend{
		width: 95%;
		margin-left: 40upx;
		margin-top:35upx;
	}
	.rTop{
		display: flex;
		justify-content: space-between;	
		border-bottom: 1upx solid #f2eeee;
		padding-bottom: 12upx;
	}
	.rTopText{
		font-weight:bold;
		color:#434343;
	}
	.rTop>image{
		width: 40upx;
		height: 28upx;
		margin-right: 40upx;
		margin-top: 10upx;
	}
	.rText{
		display: flex;
		justify-content: space-between;	
		border-bottom: 1upx solid #f2eeee;
		padding:20upx 0;
	}
	.rTextLeft{
		display: flex;
	}
	.rTextContent{
		display: flex;
		align-items: center;
	}
	.rName{
		font-size:30upx;
		font-weight:bold;
		color:#242424;
		margin: 0 20upx;
	}
	.rTextContent>image{
		width: 30upx;
		height: 30upx;
	}
	.distance{
		display: flex;
		align-items: center;
		margin-right: 40upx;
		color: #AAAAAA;
		font-size: 28upx;
	}
	/* 好友列表 */
	.listTop{
		width: 100%;
		background-color: #FFFFFF;
	}
	.search{
		width: 90%;
		height: 60upx;
		border-radius: 40upx;
		background-color: #E5E5E5;
		margin:auto;
		margin-top:40upx;
		display: flex;
		align-items: center;
		padding-top:8upx;
	}
	.search>image{
		margin-left: 260upx;
		margin-right: 20upx;
		width: 46upx;
		/* height: 46upx; */
		height: 42upx;
	}
	.searchText{
		font-size:28upx;
		font-weight:bold;
		color:#B1B1B1;
		margin-left: 10upx;
	}
	.newFriends{
		width: 90%;
		display: flex;
		justify-content: left;
		margin: auto;
		margin:0 40upx;
		padding:40upx 0;
	}
	.newFriends>image{
		width: 100upx;
		height: 100upx;
	}
	.nfText{
		display: flex;
		align-items: center;
		font-size:30upx;
		font-weight:bold;
		color:#242424;
		margin-left: 40upx;
	}
	.letter1{
		margin-left: 70upx;
		font-weight:bold;
		color:#242424;
		font-size:30upx;
	}
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
		height: 100upx;
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
</style>
