<template>
  <view class="cp-dateNew-wrapper" v-if="state">
    <view class="bg" @click="esc"></view>
    <view class="content-wrapper">
      <view class="header">
        <view class="left" @click="esc">取消</view>
        <view class="center">
			<view style="color: #333333;padding-top:10rpx;">请选择</view>
		</view>
        <view class="right" @click="ok">确定</view>
      </view>
      <picker-view class="date-wrapper" 
        :value="initTime" 
        indicator-class="select"
        @change="select"
        :indicator-style="'height:' + selectHeight + 'px;line-height:' + selectHeight + 'px'"
      >
        <picker-view-column class="date-list">
          <view v-for="(item, index) in years" :key="index" :style="'line-height:' + selectHeight + 'px'">{{item.text}}年</view>
        </picker-view-column>
        <picker-view-column class="date-list">
          <view v-for="(item, index) in months" :key="index" :style="'line-height:' + selectHeight + 'px'">{{item.text * 1}}月</view>
        </picker-view-column>
        <picker-view-column class="date-list">
          <view v-for="(item, index) in days" :key="index" :style="'line-height:' + selectHeight + 'px'">{{item.text * 1}}日</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<script>
//页面引入
import request from '../../common/request.js'
  export default{
    props: {
      show: {
        type: Boolean,
        default: false
      },
      startYear: {
        type: String,
        default: '1960'
      },
      endYear: {
        type: String,
        default: () => {
          return String(new Date().getFullYear());
        }
      },
      SelectTime: {
        type: String,
        default: '1960-01-01'
      }
    },
    computed: {
      selectHeight () {
        let height = uni.upx2px(80);
        if (height % 2 !== 0) {
           height += 1
        }
        return height;
      }
    },
    data () {
      return {
        state: this.show,
        years: [],
        months: [],
        days:[],
        initTime: [],
        MstartYear: this.startYear,
        MendYear: this.endYear,
        currentYear: null,
        currentMonth: null,
        currentDay: null,
		token:'',
		birthday1:'',
		// date:''
      }
    },
    watch: {
      show (val) {
        this.init();
        this.state = val;
      },
      state (val) {
        this.$emit('update:show', val);
      }
    },
	created() {
		var USERSTORAGE = this.checkLogin("USERSTORAGE");
		this.token=USERSTORAGE[2];
	},
    methods: {
      ok () {
        setTimeout(() => {
          let obj = {
            format: `${this.currentYear}-${this.currentMonth}-${this.currentDay}`,
            year: this.currentYear,
            month: this.currentMonth,
            day: this.currentDay
          }
          this.$emit('update:SelectTime', obj.format);
          this.$emit('callback', obj);
          this.esc();
		  uni.setStorageSync('DATE',obj.format);
		  // console.log("components",obj.format);
		  let data={
		  	token:this.token,
		  	type:4,
		  	birthday:obj.format,
		  };
		  request.post('UpdateUser',data).then(res=>{
		  	// console.log("测试生日",res);
			this.$token(res.code==500);
			if(res.code==200){
				uni.setStorageSync('BIRTHDAY',res.data.birthday);
				// this.state = false;
				uni.redirectTo({
				    url:"../../pages/edit/edit"
				});
				uni.showToast({
					title: "修改成功",
					icon: 'success',
					duration: 2000
				});
			}
			var BIRTHDAY = this.checkLogin("BIRTHDAY");
			this.birthday1=BIRTHDAY[8];
			console.log("生日刷新",this.birthday1);
		  })
        }, 500);
      },
      esc () {
        this.state = false;
      },
      select (e) {
        let value = e.detail.value;
        this.currentYear = this.years[value[0]].text;
        this.currentMonth = this.months[value[1]].text;
        let day = this.days[value[2]]
        if (day) {
          this.currentDay = day.text;
        } else {
          this.currentDay = this.days[0].text;
        }
        this.initDay(value[1] + 1);
      },
      initYear () {
        let year = this.MendYear * 1;
        let arr = []
        for (let i = this.MstartYear * 1; i < year + 1; i++) {
          let obj = {
            text: '',
            className: ''
          }
          obj.text = i
          arr.push(obj)
        }
        this.years = arr;
      },
      initMonth () {
        let arr = [];
		// let className=["水瓶座","双鱼座","白羊座","金牛座","双鱼座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座"]
        for (let i = 1; i < 13; i++) {
          let obj = {
            text: '',
            className: ''
          }
          if (i > 12) {
            arr.push(obj);
          }  else {
            if (i < 10) {
              obj.text = '0' + i;
            } else {
              obj.text = i;
            }
           arr.push(obj);
          }
        }
        this.months = arr;
		// console.log(this.months);
      },
      initDay (month) {
        month = month * 1;
        let num = 0;
        let months = [1, 3, 5, 7, 8, 10, 12];
        let currentYear = this.currentYear
        if (months.indexOf(month) > -1) {
          num = 31;
        } else {
          num = 30
          if (month === 2) {
            if (currentYear % 400 === 0 || currentYear % 4 === 0 && currentYear % 100 !== 0) {
             num = 29;
            } else {
             num = 28;
            }
          }
        }
        let arr = []
        for (let i = 1; i < num + 1; i++) {
          let obj = {
            text: '',
            className: ''
          }
          if (i < 10) {
           obj.text = '0' + i
           arr.push(obj);
          } else {
            if (!(i >= num + 1)) {
              obj.text = i
            }
            arr.push(obj);
          }
        }
        this.days = arr;
      },
      init () {
        let time = this.SelectTime.split('-');
        this.currentYear = time[0];
        this.currentMonth = time[1];
        this.currentDay = time[2];
        let yearIndex = this.currentYear - this.MstartYear * 1;
        this.initTime = [yearIndex, time[1] * 1 - 1, time[2] * 1 - 1];
        this.initYear();
        this.initMonth();
        this.initDay(this.currentMonth);
      }
    },
  }
</script>

<style lang="scss">
	.cp-dateNew-wrapper .date-wrapper[data-v-3e8c219d] {
	    top: 100rpx !important;
	}
  .cp-dateNew-wrapper{
    width:100%;
    position: fixed;
    height:100%;
    bottom:0;
    left:0;
    z-index: 999;
    .bg{
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.6);
	  z-index: 0;
    }
    .content-wrapper{
      background-color:#FFFFFF;
      position: absolute;
      bottom: 0;
      left: 0;
      overflow: hidden;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      width: 100%;
      height: 620rpx;
      .header{
        display: flex;
        justify-content: space-between;
        padding: 15rpx 30rpx;
        box-sizing: border-box;
        font-size: 30rpx;
        line-height:60rpx;
		background-color: #8A6DE9;
        .left{
		  margin-top: 10rpx;
		  font-size: 30rpx;
		  font-weight: bold;
          color: #FED100;
        }
        .right{
		  margin-top: 10rpx;
		  font-size: 30rpx;
	      font-weight: bold;
          color: #FFFFFF;
        }
        .center{
			// margin-top:-20rpx;
		  // color: #F4EA2A;
          text-align: center;
        }
      }
    }
    .date-wrapper{
      position: absolute;
      left: 0;
      top: 160rpx;
      height: 500rpx;
      width: 100%;
      z-index: 100;
      .date-list{
        text-align: center;
      }
    }
    .select{
      border:1px solid transparent !important;
      background-image: none !important;
      border-bottom: 1px solid #333333;
    }
  }
</style>
