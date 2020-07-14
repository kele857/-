import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		like:{},
		list:[],  //posts数据
		// likeinfo:{}
	},
	mutations: {
		upedateLike(state,val){
			state.like=val
		},
		upedateMessage(state,val){
			state.list=val
		}
	}
})

export default store
