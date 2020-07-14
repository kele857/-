<template>
	<view class="page" @touchstart="touchStart" @touchend="touchEnd">
		<form>
			<view class="uni-textarea">
				<textarea placeholder="这一刻的想法..." v-model="input_content" />
			</view>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in imageList" :key="index">
									<view class="uni-uploader__file" style="position: relative;">
										<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
										<view class="close-view" @click="close(index)">×</view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-show="imageList.length < 9">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
								</view>
							</view>
						</view>
						<view class="uni-uploader-head">
							<view class="uni-uploader-title"></view>
							<view class="uni-uploader-info">{{imageList.length}}/9</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- <view class="footer">
				<button type="default" class="feedback-submit" @click="publish">提交</button>
			</view> -->
		</form>
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
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				
				//侧滑返回start
				startX: 0, //点击屏幕起始位置
				movedX: 0, //横向移动的距离
				endX: 0, //接触屏幕后移开时的位置
				//end
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
				this.countIndex = 8;
		},
		onLoad() {
			var SNAME = this.checkLogin("SNAME");
			var SFACE = this.checkLogin("SFACE");
			// var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.sname=SNAME[0];
			this.sface=SFACE[1];
			// console.log("dadsdaa",this.sface);
			
			
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
		},
		methods: {
			async publish(){
				// var location = await this.getLocation();//位置信息,可删除,主要想记录一下异步转同步处理
				var images = [];
				for(var i = 0,len = this.imageList.length; i < len; i++){
					var image_obj = {name:'image-'+i,uri:this.imageList[i]};
					images.push(image_obj);
				}
				if (this.input_content=='' && images=='') {
					uni.showModal({ content: '内容不能为空', showCancel: false, });
					return;
				}
				
				uni.showLoading({title:'发布中'});
				
				// console.log("发布中的token",this.token);
				if(images.length==0){
					let data={
						token:this.token,
						text:this.input_content,
					};
					request.post('update_circle',data).then(res=>{
						// this.$token(res.code);
						console.log("文字发布",res);
						if(res.code==100){
							uni.hideLoading();
							uni.showModal({ content: res.msg, showCancel: false, });
						}else{
							uni.hideLoading();
							uni.switchTab({
							    url: '../find/find'
							});
						}
					})
					return
				}
				
				
				uni.uploadFile({//该上传仅为示例,可根据自己业务修改或封装,注意:统一上传可能会导致服务器压力过大
					url: 'http://social.wgzy69.com/api/update_circle', //仅为示例，非真实的接口地址
					files:images,//有files时,会忽略filePath和name
					filePath: '',
					name: '',
					formData: {//后台以post方式接收
						// 'user_id':'1',//自己系统中的用户id
						'text': this.input_content,//moment文字部分
						'token':this.token,
						// 'longitude':location.longitude,//经度
						// 'latitude':location.latitude//纬度
					},
					success: (res) => {
						// console.log("211111111111113",res);
						// console.log("返回发布后的状态码",res);
						res=JSON.parse(res.data);
						console.log("返回发布后的状态码-------",res.code);
						if(res.code==200){
							uni.hideLoading();
							uni.switchTab({
							    url: '../find/find'
							});
						}else if(res.code==100){
							uni.hideLoading();
							uni.showModal({ content: res.msg, showCancel: false, });
						}else{
							uni.showModal({ content: '服务器开小差', showCancel: false, });
						}
					},
					fail: (e) => {
						// console.log("e: " + JSON.stringify(e));
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
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					// console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
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
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
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
			}
		}
	}
</script>

<style scoped>
	@import url("uni.css");
	.footer {
		margin-top: 80upx;
	}
	
	.cell-pd {
		padding: 20upx 30upx;
	}

	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 150upx;
	}
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
	.page {
		width: 750upx;
		height: 100%;
	}
</style>
