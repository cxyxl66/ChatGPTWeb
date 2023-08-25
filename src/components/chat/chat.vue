<template>
  <div style="height: 800px;" class="chat">
    <div style="width: 15%;float: left; ">
      <Menu :theme="theme" active-name="1" style="height: 700px;overflow: scroll">
        <div v-for="item in chatItem" :key="item.id">
          <MenuItem :name="item.id" v-on:click.native="selectItem(item)">
            <div style="height: 50px;">
              <div style="width: 60px; float: left;" >
                <img class="image" :src="item.image" >
              </div>
              <div style="float: left;padding-top: 15px;padding-left: 10px;font-size: 17px">{{item.title}}</div>
            </div>
          </MenuItem>
        </div>
      </Menu>
    </div>

    <div style="height:620px;width: 84%;float: left;background-color:#f0f9eb; overflow-y: auto">
      <div style="width: 100%;height: 30px;">
        <div style="text-align: center; font-size: 17px;padding-top: 5px;">{{item.title}}</div>
      </div>
      <div style="display: flex;flex-wrap: wrap;">
        <div v-for="msg in msgList" style="width: 100%;">
            <div v-if="msg.role === 'user'" style="margin-top: 10px;">
              <img class="image" src="https://www.jingyoushui.cn/image/b6dbf7a5-af40-43fb-b23b-33fd3268dba5.png" style="float: right;">
              <div class="rightMsg" style="float: right;">
                {{msg.content}}
              </div>
            </div>
            <div v-if="msg.role === 'assistant'" style="margin-top: 10px;margin-left: 10px;">
              <img class="image" :src="item.image" style="float: left;">
              <div class="leftMsg" style="float: left;" >
                <VueMarkdown  :source="msg.content"  :options="options"></VueMarkdown>
              </div>

            </div>
          </div>

      </div>
    </div>
    <div style="height:140px;width: 84%;;float: left;margin-top: 5px; " >
      <Space direction="vertical" size="large" type="flex">
        <Input v-model="userInput" type="textarea" :rows="5" placeholder="Enter something..." />

        <Button type="success" style="float:right;margin-top: 10px;margin-left: 20px" @click="sendMessage" :disabled="!isOpen">发送</Button>
        <Button type="error" style="float:right;margin-top: 10px;" @click="clearMessage" >清空</Button>
      </Space>
    </div>
  </div>


</template>

<script>
  import axios from '@/libs/axios'
  import {chatModel, chatModelType} from '@/api/url';
  import marked from 'marked';
  import VueMarkdown from 'vue-markdown';
export default {
  name: 'chat',
  components: {
    VueMarkdown
  },
  data() {
    return {
      websock: null,
      chatItem: [],
      userInput: '',
      item: {},
      msgList:[],
      isOpen: false,
      options: {
        html: true,
        typographer: true,
        linkify: true,
        breaks: true,

      }
    }
  },
  created() {
    if (this.$route.params.item) {
      var item = this.$route.params.item;
      this.item = item;
      this.$store.commit('setChatItem', item)
      this.chatItem = this.$store.state.chatItem;
      this.initWebSocket()
    }

  },
  destroyed() {
    this.websock.close();
    console.log("离开")
    localStorage.setItem('role-'+this.item.roleId, JSON.stringify(this.msgList));
  },

  methods: {
    initWebSocket() {
      this.initData();
      const userName =  localStorage.getItem('username');
      const wssUrl = "ws://127.0.0.1:8085/chatWebSocketForWeb/"+ userName;
      this.websock = new WebSocket(wssUrl);
      this.websock.onmessage = this.websocketOnMessage;
      this.websock.onopen = this.websocketOnOpen;
      this.websock.onerror = this.websocketOnError;
      this.websock.onclose = this.websocketClose;
    },
    initData() {
      console.log(this.item.roleId)
      let message = localStorage.getItem('role-'+this.item.roleId);
      if (message != null && message != '') {
        this.msgList = JSON.parse(message)
      }
      if (this.msgList.length === 0) {
        this.msgList.push({
          role: 'assistant',
          content: this.item.chat
        })
      }
    },
    websocketOnOpen() { //连接建立之后执行send方法发送数据
      console.log("onOpen")
      this.isOpen = true;
    },
    websocketOnError() {//连接建立失败重连
      this.initWebSocket();
    },
    websocketOnMessage(result){ //数据接收
      if (result.data === "[DONE]" || result.data === "{}") {
        return;
      }
      const json_data = JSON.parse(result.data);
      if (json_data === null || json_data.content === null || json_data.content === 'undefined') {
        return;
      }
      let text = json_data.content;
      let size = this.msgList.length - 1;
      let messageList = this.msgList;
      let message = messageList[size].content + text;
      messageList[size].content = message;
      this.msgList = messageList;

    },
    websocketSend(Data){//数据发送
      if (this.isOpen) {
        this.websock.send(Data);
      }
    },
    websocketClose(e){  //关闭
      console.log('断开连接',e);
      this.isOpen = false;
    },

    selectItem(item) {
      localStorage.setItem('role-'+this.item.roleId, JSON.stringify(this.msgList));
      this.item = item;
      this.initData()
    },
    sendMessage() {
      this.msgList.push({
        role: 'user',
        content: this.userInput
      })
      const data = {
        roleId: this.item.roleId,
        message:JSON.stringify(this.msgList)
      }
      this.websocketSend(JSON.stringify(data));
      this.userInput = '';
      this.msgList.push({
        role: 'assistant',
        content: ''
      })

    },
    clearMessage() {
      this.msgList = [
        {
          role: 'assistant',
          content: this.item.chat
        }

      ]
    }

  }
}
</script>

<style lang="less">
::-webkit-scrollbar {
  display: none;
}

.image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: 100% 100%;
}

.leftMsg {
  margin-top: 10px;
  padding: 10px;
  font-size: 15px;
  color: #444;
  line-height: 20px;
  background-color: #fff;
  margin-left: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  max-width: 90%;
  white-space: pre-wrap;
}

.rightMsg {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 15px;
  color: white;
  line-height: 20px;
  background-color: green;
  margin-right: 10px;
  border-radius: 10px;
  word-wrap: break-word;
  max-width: 90%;
  white-space: pre-line;
}
</style>
