// import Vue from 'vue'
import Vuex from 'vuex'

import app from './module/app'

// Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    chatItem: []
  },
  mutations: {
    setChatItem(state, value) {
      state.chatItem.push(value);
      const result = state.chatItem.reduce((acc, curr) => {
        const index = acc.findIndex((item) => item.id === curr.id);
        if (index < 0) {
          acc.push(curr)
        }
        return acc
      }, [])
      state.chatItem = result;
    }
  },
  actions: {
    //
  },
  getters: {
    getChatItem: state => state.chatItem
  },
  modules: {
    app,
  }
})
