<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed">
      <side-menu accordion :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con" @click="jumpToHome">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-name="userName"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content>
        <Layout style="margin: 20px;">
          <Content>
              <router-view style="padding:20px;background: white"/>
          </Content>
        </Layout>
      </Content>
      <Footer style="text-align: center">
        <p>&copy; {{new Date().getFullYear()}} <a href="/" target="_blank">公众号：程序员修炼</a></p>
      </Footer>
    </Layout>
  </Layout>
</template>
<script>
import sideMenu from './components/side-menu'
import headerBar from './components/header-bar'
import user from './components/user'
import { mapMutations } from 'vuex'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'
import Fullscreen from './components/fullscreen'
import './main.less'
export default {
  name: 'Main',
  components: {
    sideMenu,
    headerBar,
    user,
    Fullscreen
  },
  data () {
    return {
      collapsed: localStorage.getItem('collapsed') === 'true',
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    userName () {
      return localStorage.getItem('username')
    },
    menuList () {
      return this.$store.getters.menuList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb'
    ]),
    turnToPage (name) {
      this.$router.push({
        name: name
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state;
      localStorage.setItem('collapsed', state)
    },
    handleClick (item) {
      this.turnToPage(item.name)
    },
    jumpToHome() {
      this.$router.push({
        name: '首页'
      })
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setBreadCrumb(this.$route.matched)
  }
}
</script>

<style>
  .ivu-layout-sider-children {
    overflow-y: scroll;
  }
  .ivu-layout-sider-children::-webkit-scrollbar{
    display:none
  }
  .ivu-layout-sider {
    background: white;
  }
</style>
