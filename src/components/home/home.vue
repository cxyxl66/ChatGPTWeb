<template>
  <div>
    <Tabs type="card" @on-click="changeType">
      <div v-for="item in roleType"  >
        <TabPane :label="item.roleTypeName" :name="item.id">
        </TabPane>
      </div>
    </Tabs>
    <div style="height: 600px;display: flex;flex-wrap: wrap;" >
      <div v-for="item in roles" :key="item.id" style="width:20%; ">
        <Card style="width:90%; height: 240px;border-radius: 20px;" v-on:click.native="chat(item)">
          <div style="text-align:center">
            <img class="imageStyle" :src="item.image">
            <h2>{{item.title}}</h2>
            <h4>{{item.description}}</h4>
          </div>
        </Card>
      </div>

    </div>
    <Page :total="count" @on-change="changePage"/>
  </div>


</template>

<script>
  import axios from '@/libs/axios'
  import {chatModel, chatModelType} from '@/api/url';
export default {
  name: 'home',
  components: {

  },
  data() {
    return {
      roles:[],
      activeType: '1001',
      page: 1,
      pageSize: 10,
      roleType:[],
      count: 0
    }
  },
  created() {
   this.queryType();
   this.queryChatModel();
  },

  methods: {
    queryType() {
      axios.request({
        url: chatModelType,
        method: 'post'
      }).then(res => {
        if (res.code === 200) {
          this.roleType = res.data;
        }
      });
    },
    queryChatModel() {
      const data = {
        token: localStorage.getItem('token'),
        categoryId: this.activeType,
        pageNum: this.page,
        pageSize: this.pageSize,
        postStatus: 0
      };
      axios.request({
        url: chatModel,
        data,
        method: 'post'
      }).then(res => {
        console.log(res.data);
        if (res.code === 200) {
          this.roles = res.data.list;
          this.count = res.data.count;
        }

      });
    },
    changeType(id) {
      this.activeType = id;
      this.page = 1;
      this.queryChatModel();
    },
    changePage(index) {
      this.page = index;
      this.queryChatModel();

    },
    chat(item) {
      let params = {item: item};
      this.$router.push({name: 'chat', params: params})
    },
  }
}
</script>

<style lang="less">

  .imageStyle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-size: 100% 100%;
    margin-top: 10px;
  }

</style>
