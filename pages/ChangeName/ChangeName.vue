<template>
	<!-- 修改昵称 -->
	<view class="page page-fill">
		<!-- <view style="position: absolute;top:0;">
			确定
		</view> -->
		<!-- @formSubmitNickname -->
		<form>
			
			<view class="page-block" style="margin-top: 20upx;display: flex;justify-content: space-between;margin-right: 40upx;">
				<input 
					type="text"
					class="input"
					placeholder="设置昵称"
					placeholder-class="graywords"
					maxlength="10"
					v-model="name"
					/>
					<image v-if="name!==''" style="width: 40upx;height: 40upx;margin-top:15upx;" src="../../static/one/annual.png" mode="" @click="annual"></image>
			</view>
			
			<!-- <button type="primary" form-type="submit" class="submitBtn" @click="modifyName">保存</button> -->
			
		</form>
		
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	export default {
		data() {
			return {
				name:'',
				sname:''
			};
		},
		onShow() {
			var SNAME = this.checkLogin("SNAME");
			this.sname=SNAME[0];
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
		},
		onNavigationBarButtonTap(e) {
			console.log(this.token);
			// console.log(e);
			// console.log("name",this.name);
			if(this.name==''){
				uni.showModal({ content: '内容不能为空', showCancel: false, });
			}else{
				let data={
					token:this.token,
					type:1,
					nickname:this.name,
				};
				request.post('UpdateUser',data).then(res=>{
					console.log("1111",res);
					// this.$token(res.code);
					console.log("接口",res.data.username);
					if(res.code==200){
						uni.setStorageSync('SNAME',res.data.username);
						uni.navigateTo({
						    url: '../edit/edit'
						});
					}
				})
			}
		},
		methods: {
			annual(){
				this.name=''
			},
			// determine(){
			// 	console.log(this.name)
			// }
		}
	}
</script>

<style>
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
}

.graywords {
	color: #EAEAEA;
}

.input {
	height: 80upx;
	line-height: 80upx;
	width: 500upx;
	margin-left: 40upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
