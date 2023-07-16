import { getBreadCrumbList, getMenuByRouter, getHomeRoute } from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    homeRoute: getHomeRoute(routers)
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, localStorage.getItem('roles').split(","))
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    }
  }
}
