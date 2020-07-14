<template>
	<view class="report">
		<view class="repottTop">
			<view class="uni-textarea">
				<textarea placeholder="请告诉我们举报理由" v-model="input_content" />
			</view>
			<!-- <view class="retext">请告诉我们举报理由</view> -->
			<view class="blackCharacter">
				<view class="uni-list">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd reContent" v-for="(item, index) in items" :key="item.value">
							<view class="word">{{item.name}}</view>
							<view>
								<radio color="#FF0000" :value="item.value"/>
							</view>
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<!-- <view class="repottBottom">
			<view class="reImgContent">
				<view class="black">图片证据</view>
				<view class="ash">0/3</view>
			</view>
			<view class="reImg">
				<image src="../../static/one/PictureUpload.png" mode="widthFix"></image>
				<view style="width: 150upx;height: 150upx;background-color: #F2F2F2;"></view>
				<view style="width: 150upx;height: 150upx;background-color: #F2F2F2;"></view>
			</view>
		</view> -->
		<view class="uni-list list-pd">
			<view class="uni-list-cell cell-pd">
				<view class="uni-uploader">
					<view class="uni-uploader-head">
						<view style="font-size: 32upx;font-weight: 800;">图片证据</view>
						<view class="uni-uploader-info">{{imageList.length}}/3</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files" >
							<block style="margin: auto;" v-for="(image,index) in imageList" :key="index">
								<view class="uni-uploader__file" style="position: relative;">
									<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
									<view class="close-view" @click="close(index)">×</view>
								</view>
							</block>
							<view class="uni-uploader__input-box" v-show="imageList.length < 3">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../common/request.js'
	import image from '@/common/image.js';
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				sface:'',
				token:'',
				// title: 'choose/previewImage',
				input_content:'',
				imageList: [],
				
				
				
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 2,
				count: [1, 2, 3],
				
				//侧滑返回start
				startX: 0, //点击屏幕起始位置
				movedX: 0, //横向移动的距离
				endX: 0, //接触屏幕后移开时的位置
				//图片部分
				input_content:'',
				items: [{
						value: 'one',
						name: '淫秽色情'
					},
					{
						value: 'two',
						name: '骂人',
					},
					{
						value: 'three',
						name: '刷屏'
					},
					{
						value: 'four',
						name: '虚假消息'
					},
					{
						value: 'five',
						name: '推销广告'
					},
					{
						value: 'six',
						name: '其他',
						// checked: 'true'
					},
				],
				current: 0,
				illegality:'',
				id:'',
			}
		},
		
		
		onNavigationBarButtonTap(e) {
			this.publish();
		},
		onUnload() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 2;
		},
		onLoad(option) {
			this.id=option.id;
			 // console.log("好友",option.id);
		},
		onShow() {
			var SNAME = this.checkLogin("SNAME");
			var SFACE = this.checkLogin("SFACE");
			// var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.sname=SNAME[0];
			this.sface=SFACE[1];
			// console.log("dadsdaa",this.sface);
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
		},
		//图片部分
		methods: {
			async publish(){
				
				// var location = await this.getLocation();//位置信息,可删除,主要想记录一下异步转同步处理
				var images = [];
				for(var i = 0,len = this.imageList.length; i < len; i++){
					var image_obj = {name:'image-'+i,uri:this.imageList[i]};
					images.push(image_obj);
				}
				if (this.input_content=='' && images=='' && this.illegality=='') {
					uni.showModal({ content: '内容不能为空', showCancel: false, });
					return;
				}
				// console.log("22222",this.illegality);
				// console.log("token",this.token);
				uni.uploadFile({//该上传仅为示例,可根据自己业务修改或封装,注意:统一上传可能会导致服务器压力过大
					url: 'http://social.wgzy69.com/api/report', //仅为示例，非真实的接口地址
					files:images,//有files时,会忽略filePath和name
					filePath: '',
					name: '',
					formData: {//后台以post方式接收
						'content': this.input_content,
						'token':this.token,
						'illegality':this.illegality,
						'touid':this.id,
					},
					success: (res) => {
						this.$token(res.code==500)
						let list=JSON.parse(res.data);
						// console.log("举报返回",list);
						if(list.code==200){
							uni.showModal({ content: '举报成功！等待审核', showCancel: false, });
						}
					},
					fail: (e) => {
						console.log("e: " + JSON.stringify(e));
						uni.hideLoading();
						uni.showToast({
							icon:'none',
							title:"发布失败,请检查网络"
						})
					}
				});
			},
			
			getLocation(){//h5中可能不支持,自己选择
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'wgs84',
						success: function (res) {
							resolve(res);
						},
						fail: (e) => {  
							reject(e);
						}
					});
				} )
			},
			
			close(e){
			    this.imageList.splice(e,1);
			},
			chooseImage: async function() {
				if (this.imageList.length === 3) {
					let isContinue = await this.isFullImg();
					// console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 3 ? 3 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
			
						// #ifdef APP-PLUS
						//提交压缩,因为使用了H5+ Api,所以自定义压缩目前仅支持APP平台
						var compressd = cp_images=> {
							this.imageList = this.imageList.concat(cp_images)//压缩后的图片路径
						}
						image.compress(res.tempFilePaths,compressd);
						// #endif
						
						// #ifndef APP-PLUS
						this.imageList = this.imageList.concat(res.tempFilePaths)//非APP平台不支持自定义压缩,暂时没有处理,可通过uni-app上传组件的sizeType属性压缩
						// #endif
						
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有3张图片了,是否清空现有图片？",
						success: (e) => {
							this.$token(e.code==500);
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			touchStart: function(e) {
				this.startX = e.mp.changedTouches[0].pageX;
			},
			
			touchEnd: function(e) {
				this.endX = e.mp.changedTouches[0].pageX;
				if (this.endX - this.startX > 200) {
					uni.navigateBack();
				}
			},
			//图片部分
	        radioChange(evt) {
				// console.log(evt.target)
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						this.illegality=this.items[i].name;
						// console.log("1111",this.illegality);
						break;
					}
				}
			}
		}
	}
</script>

<style scoped>
	@import url("uni.css");
	.uni-textarea {
		width: auto;
		/* padding: 0 25upx; */
		line-height: 1.6;
		height: 150upx;
	}
	.repottTop{
		border-top:20upx solid #F2F2F2;
		border-bottom:20upx solid #F2F2F2;
	}
	.retext{
		color:#999999;
		font-size: 32upx;
		padding:40upx;
	}
	.blackCharacter{
		padding:20upx;
	}
	.reContent{
		padding: 20upx;
		display: flex;
		justify-content: space-between;
	}
	.word{
		font-size:32upx;
		font-weight:bold;
	}
	.repottBottom{
		padding:40upx 60upx;
		font-size:32upx;
		font-weight:bold;
	}
	.reImgContent{
		display: flex;
		justify-content: space-between;
	}
	.black{
		font-size:32upx;
		font-weight:bold;
	}
	.ash{
		font-size:32upx;
		font-weight:bold;
		color:#D3D3D6;
	}
	.reImg{
		margin-top:40upx;
		width: 90%;
		display: flex;
		justify-content: space-between;
	}
	.reImg>image{
		width: 150upx;
	}
	
	
	/* 上传图片 */
	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
	}
	.close-view{
	    text-align: center;
		line-height:30upx;
		height: 35upx;
		width: 35upx;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 1upx;
		right: 1upx;
		font-size: 35upx;
		border-radius: 8upx;
	}
</style>
