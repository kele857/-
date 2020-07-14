<template>
	<view>
		<view class="status_bar-fixed">
			
		</view>
		<view class="status_bar">
			
		</view>
		<!-- 自定义导航栏 -->
		<scroll-view scroll-with-animation :scroll-into-view="goNav" scroll-x style="width: 750rpx;position: fixed;background-color: #FFFFFF; 
		z-index: 10;padding:" :style="{'padding-left':SrPadding+'px',height:SrHeight,
		'padding-right':SrPadding+'px','padding-top':dhTop+'upx'}" >
		<image style="position: absolute;z-index: 400;width: 25px;height: 25px;right: 0;" src="../../static/one/scan.png" mode=""></image>
			<view class="flex-column-start" >
				<view class="flex-row-start" >
					
					<text :class="nav==i?navHoverClass:navClass" :id="'nav'+i" class="nav-tx" v-for="(x,i) in dhList"  
					style="margin-left: 40px;flex-shrink: 0;" @click="changeNav(i)" :key="i" >{{x}}</text>
				</view>
				
				<view id="swt"  class="move-view" 
				:style="{width:wid+'px','margin-left':left+'px','transform':transform,transition:ts}" ></view>
			</view>
		</scroll-view>
		<!-- 组件的上面要预留一个可以隐藏的空间 -->	
	   <!--refresh组件属性-> widthImg刷新图宽 heightRh下拉刷新整体高度(因对应导航栏高度) msgShow(是否显示文字) image(图片路径) -->
		<refresh  @down="$emit('relist')" :heightRh="heightRh" :msgShow="msgShow" :image="image" :widthImg="widthImg" >
				<!-- 你的业务 -->
				<template  slot="refresh" >
					<swiper  :style="{height:listHeight+'px'}" style="width: 750rpx;"    @animationfinish="animationfinish" :current="currentId"
					 @change="changeSw"  :duration="500" @transition="transition"  >
						 <swiper-item v-for="(x,i) in swList" :key="i" >
							<slot :name="'list'+i" ></slot>
						 </swiper-item>
					</swiper>	
				</template>
				
		</refresh>

	</view>
</template>


<script>
	var mp
	// 判断页面是否触顶 ,0触顶,1没有触顶
	var top=0
	// 导航栏节点信息
	var navList
	import refresh  from '@/components/refresh/refresh.vue'
	export default {
		components: {refresh},
		name:"pui-List",
		props:{		
			dhTop:{
				type:Number,
				default:35
			},
			navHoverClass:{
				type:String,
				default:"my-title"
			},	
			navClass:{
				type:String,
				default:""
			},	
			listHeight:{
				type:Number,
				default:10
			},			
			SrHeight:{
				type:String,
				default:"110upx"
			},		
			SrPadding:{
				type:Number,
				default:20
			},
			swLine:{
				type:Number,
				default:10
			},
			swList:{
				type:Array,	
			},
			dhList:{
				type:Array,

			},
			widthImg:{
				type:String,
				default:"40rpx"
			},
			heightRh:{
				type:String,
				default:"70rpx"
			},
			msgShow:{
				type:Boolean,
				default:true
			},
			image:{
				type:String,
				default:"../../static/lt1.png"
			}
				
		},	
		mounted() {
			this.wid=this.swLine
			// 等待dom渲染后执行
			this.$nextTick(()=>{
					
					
				var query=uni.createSelectorQuery().in(this)
				query.selectAll('.nav-tx').boundingClientRect(data => {
					navList=data
					// console.log(data)
					this.left=navList[0].left+ (navList[0].width-this.wid)/2-this.SrPadding
					mp=this.left
				}).exec();
					
				
			})
												
		},
		data() {
			return {
				goNav:"",
				currentId:0,
				ts:"0s",
				transform:"",
				left:0,
				nav:0,
				wid:30
			}
		},
		methods: {
			animationfinish(e){
				this.ts="0s"
			},
			changeSw(e){
				if(e.detail.current>this.nav){
					this.goNav="nav"+this.nav
				}else{
					this.goNav="nav"+(e.detail.current-1)
				}
				this.$emit('navChange',e.detail.current)
				this.nav=e.detail.current
				
				
				this.ts="0.5s"
				this.wid=this.swLine				
				var offX=navList[this.nav].left+ (navList[this.nav].width-this.wid)/4-this.SrPadding
				this.left=offX
				mp=this.left
			},
			changeNav(i){
				this.nav=i
				this.currentId=i
			},
			transition(e){				
				if(this.ts=='0s'){
					var offX=e.detail.dx/4
					if(offX>0){
						if(navList.length-1==this.nav){
							return;
						}
						var offLeft=navList[this.nav+1]
						var lastX=(offLeft.left+offLeft.width/2-navList[this.nav].left-navList[this.nav].width/2)
						if(offX<lastX){
							this.wid=this.swLine+offX
						}
						
					}else{
						if(this.nav==0){
							return;
						}
						var offLeft=navList[this.nav-1]
						var lastX=(navList[this.nav].left+navList[this.nav].width/2-offLeft.left-offLeft.width/2)
						if(Math.abs(offX)<lastX){
							this.wid=this.swLine+Math.abs(offX)
							this.left=mp-Math.abs(offX)
						}
						
					}
				}										
			}
			
		}
	}
</script>




<style>
	.flex-row-start{
		margin-left: -40px;
	}
	.move-view{
		background-color: #EABE5B !important;
	}
</style>
