<template>
	<view>
		<model-calendar
		 ref="model"
		:active='dayactive'
		:sendYear="toYear" :sendMonth="toMonth"
		:dataSource="signData" :totalNum="sumCount"
		 @dateChange="getData" @clickChange="clickSignUp"	 >
		 </model-calendar>
		 
		 
		<!-- <view class='count'>
			<text>截至目前，已坚持打卡</text>
			<view class='daynumber'>
				<text class='number'>{{sumCount}}</text>
				<text class='day'>天</text>
			</view>

			<view>本月累积打卡<text class="monthSum">{{signData.length}}</text>天</view>
			<text>请再接再厉，继续努力!</text>
		</view> -->
	</view>
</template>

<script>
	//页面引入
	import request from '../../common/request.js'
	import modelCalendar from '@/components/Calendar.vue';

	export default {
		data() {
			return {
				dayactive:false,
				today: parseInt(new Date().getDate()), //本日
				toYear: parseInt(new Date().getFullYear()), //本日
				toMonth: parseInt(new Date().getMonth() + 1), //本月
				sumCount: 0,
				signData: [],
				token:'',
				daylist:[]
			};
		},
		components: {
			modelCalendar
		},
		onShow() {
			
		},
		onLoad() {
			var USERSTORAGE = this.checkLogin("USERSTORAGE");
			this.token=USERSTORAGE[2];
		},
		created() {
			var that = this
			uni.request({
				url:'http://social.wgzy69.com/api/getSignList',
				data: {token:that.token},
				success:res => {
					that.$token(res.code==500);
					// console.log(res);
					// console.log("接口",res.data);
					that.daylist = res.data.data;
					this.getData(this.toYear+"-"+this.toMonth);
				}
			})
			//获取当前用户当前任务的签到状态  			
		},
		// mounted() {
		// 	console.log("报错",this.daylist);
		// 	this.getData(this.toYear+"-"+this.toMonth);
		// },
		methods: {
			clickSignUp(day) {
				let data={token:this.token};
				request.get('checksign',data).then(res=>{
					this.$token(res.code==500);
					console.log(res);
				})
				//console.log("在模版页签到了", day);
				this.signData.push(day);
				this.sumCount++;
				//this.$http.postHttp("Comment/UpdateRecord", day, (res) => {//可以通过后台接口添加当前用户当日打卡记录，
				// 		//console.log(res);
				// 		//if (res!= undefined) {
				// 			uni.showToast({
				// 				title: "打卡成功"+day,
				// 				icon: 'success',
				// 				duration: 2000
				// 			});
				// 		
				// 		//}
				//  })	
			},
			//当模板的时候可以直接引入，然后触发子组件事件到父界面去控制数据

			//获取当前用户该任务的签到数组
			getData(val) {
				// console.log("最后一个值",this.daylist[this.daylist.length-1])
				let y=val.split('-')[0];
				let m=val.split('-')[1];
				//this.$http.postHttp("Comment/GetRecord", {//可以通过后台接口去获取你的打卡数据
				// 	Year: y,
				// 	Month: m,
				// }, (res) => {
				//console.log(res);
				this.sumCount = 88; //res.SumCount
				if (y == this.toYear && m == this.toMonth) {
					let num=this.daylist,newSign=[],today=new Date().getDate();
					for(let i=0;i<6;i++){
						if(parseInt(num[i])>today){
							break;
						}
						newSign.push(y+"-"+m+"-"+num[i])
					}
					if(today==this.daylist[this.daylist.length-1]){
						console.log(this.$refs.model.active);
						this.$refs.model.active=false;
					}
					//console.log(newSign);//最后传给组件的格式看这里-------------
					this.signData = newSign;
				} else {
				 	this.signData = [];
				 }
				// })
			},
		}
	}
</script>

<style lang='scss'>
	.count .daynumber {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.count .daynumber .day {
		margin-top: 50rpx;
	}

	.count {
		margin: 20rpx;
		padding: 30rpx;
		display: flex;
		text-align: center;
		border-radius: 10px;
		flex-direction: column;
		justify-content: center;
		background-color: #fff;
		align-items: center;
	}

	.count .number {
		color: #fff;
		font-size: 60rpx;
		background-color: #94db98;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 20rpx;
	}

	.monthSum {
		color: red;
		font-size: 40rpx;
	}

	.count text {
		margin: 10rpx;
	}
</style>
