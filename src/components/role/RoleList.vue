<template>
  <div>
    <div style="margin-bottom: 20px" v-if="this.roles.indexOf(`ROLE_ADMIN`) > -1" >
      <div style="display: inline-block">
        <Input v-model="searchPostId"  placeholder="请输入角色Id" style="width: 150px;" clearable></Input>
      </div>

      <div style="display: inline-block">
        <Input v-model="title"  placeholder="请输入角色名称" style="width: 200px;" clearable></Input>
      </div>

      <Select v-model="categoryId" style="width:150px" clearable>
        <Option v-for="item in categoryOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="postStatus" style="width:120px" clearable>
        <Option :value=0>上线</Option>
        <Option :value=1>下线</Option>
        <Option :value=2>私有</Option>
      </Select>
      <Button type="primary" @click="requestPostList">搜索</Button>
      <Button type="ghost" @click="resetSearch">重置</Button>
    </div>
    <Table border stripe :highlight-row="true" :data="postList" :columns="postListColumns" :loading="postListTableLoading"></Table>
    <div style="margin: 20px;overflow: hidden">
      <Page :page-size="pageSize" :total="totalCount" :current="currentPage" @on-change="changePage" show-elevator
            show-total></Page>
    </div>

    <Modal
      @on-visible-change="onVisibleChange"
      :width="1000"
      v-model="commentModal"
      title="文章评论">
      <Table stripe border :columns="commentColumns" :data="commentList" :loading="commentListTableLoading"></Table>

      <div style="margin: 20px;overflow: hidden">
        <Page :page-size="commentPageSize" :total="commentTotalCount" :current="commentCurrentPage"
              @on-change="commentChangePage" show-elevator
              show-total></Page>
      </div>
    </Modal>

    <Modal
      :width="1000"
      v-model="commentReplyModal"
      title="评论回复">
      <Table stripe border :columns="commentReplyColumns" :data="commentReplyList"></Table>
    </Modal>

  </div>
</template>

<script>
import expandRow from './PostDetail';
import expandRow2 from './PostCommentDetail';
import {modifyRoleStatus} from '../../api/post';
import { queryType} from "../../api/category";
import {getRoleList} from "../../api/role";

export default {
    name: "role-list",
    components: {expandRow, expandRow2},
    data() {
      return {
          searchPostId: null,
          title: null,
          categoryId: null,
          categoryOptions: [],
          postStatus: null,
        rankType : null,
        watchCommentPostId: null,
        commentTotalCount: 1,
        commentCurrentPage: 1,
        commentPageSize: 10,
        commentListTableLoading: false,
        commentModal: false,
        commentReplyModal: false,
        //  h('Tag', {props: {color: params.row.original ? 'green' : 'blue'}}, params.row.original ? '原创' : '转载')
        postListTableLoading: false,
        roles: localStorage.getItem('roles'),
        pageSize: 10,
        totalCount: 1,
        currentPage: 1,
        postList: [],
        postListColumns: [
          {
            title:"#",type: 'expand',align: 'center', width: 50, render: (h, params) => {
              return h(expandRow, {props: {row: params.row}})
            }
          },
          {title: 'ID', key: 'id', align: 'center', ellipsis:true, minWidth: 80,},
          {title: '标题', key: 'title', align: 'center', ellipsis:true, minWidth: 300,
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: params.row.title
                  }
                }, params.row.title)
              ])
            }
          },
          {title: '图标', key: 'image', align: 'center', ellipsis: true, minWidth: 70,
            render: (h, params) => {
              return h('img', {
                style: {
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%'
                },
                attrs: {
                  src:params.row.image
                },
              })
            }
          },
          {title: '描述', key: 'description', align: 'center', ellipsis:true, minWidth: 100,},
          {title: '排序', key: 'sortNum', align: 'center', ellipsis:true, minWidth: 100,},
          {title: '分类', key: 'roleTypeId', align: 'center', ellipsis:true, minWidth: 100,
              render: ((h, params) => {
                  let roleTypeId = params.row.roleTypeId;
                  let text = '';
                  this.categoryOptions.forEach(options => {
                      if (options.value === roleTypeId) {
                          text = options.label;
                      }
                  })
                  return h('div', [
                      h('span', {
                          style: {
                              display: 'inline-block',
                              width: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                          },
                          domProps: {
                              title: text
                          }
                      }, text)
                  ])
              })

          },
          {
            title: '状态', key: 'postStatus', align: 'center', ellipsis:true, minWidth: 100,
            render: (h, params) => {
              let postStatus = params.row.postStatus;
              let text = '';
              let color = '';
              if (postStatus === 0) {
                text = '上线';
                color = 'green';
              } else if (postStatus === 1) {
                text = '下线';
                color = 'red';
              } else if (postStatus === 2) {
                text = '私人';
                color = 'lightskyblue';
              }
              return h('Tag', {props: {color: color}}, text);
            }
          },
          {
            title: '操作', key: 'action', align: 'center', ellipsis:true, minWidth: 250, fixed: 'right',
            render: (h, params) => {
              let postStatus = params.row.postStatus;
              let action = [];
              // if (this.roles.indexOf("ROLE_ADMIN") > -1) {
              if (true) {
                //@formatter:off
                  let watchComment = h('Button', {props: {type: 'info', size: 'small'}, style: {marginRight: '5px'}, on: {click: () => {this.watchComment(params)}}}, '评论');
                  let online = h('Button', {props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'}, on: {click: () => {this.online(params.row.id)}}}, '上线');
                  let offline = h('Button', {props: {type: 'warning', size: 'small'}, style: {marginRight: '5px'}, on: {click: () => {this.offline(params.row.id)}}}, '下线');
                  let edit = h('Button', {props: {type: 'primary', size: 'small'}, style: {marginRight: '5px'}, on: {click: () => {this.edit(params.row)}}}, '编辑');
                  //@formatter:on
                if (params.row.comment_count > 0) {
                  action.push(watchComment);
                }
                if (postStatus === 1) {
                  action.push(online);
                } else if (postStatus === 0) {
                  action.push(offline);
                }
                action.push(edit);
              }
              // if (postStatus === 0) {
              //   let watch = h('Button', {props: {type: 'success', size: 'small'}, style: {marginRight: '5px'}, on: {click: () => {this.watchPostById(params.row)}}}, '查看');
              //   action.push(watch);
              // }
              return h('div', [action]);
            }
          }
        ],

      };
    },
    methods: {
      formatTime(val) {
        if (val === "" || val == null) {
          return "";
        }
        let year = parseInt(val.year) + 1900;
        let month = (parseInt(val.month) + 1);
        let date = parseInt(val.date);
        date = date > 9 ? date : ('0' + date);
        let hours = parseInt(val.hours);
        hours = hours > 9 ? hours : ('0' + hours);
        let minutes = parseInt(val.minutes);
        minutes = minutes > 9 ? minutes : ('0' + minutes);
        let seconds = parseInt(val.seconds);
        seconds = seconds > 9 ? seconds : ('0' + seconds);
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
      },
      resetSearch() {
        this.currentPage = 1;
        this.searchPostId = null;
        this.rankType = null;
        this.requestPostList();
      },

      watchPostById(row) {
          let params = {id: row.id, type: "article"};
          this.$router.push({name: 'postContent', params: params});
      },
      onVisibleChange(isShow) {
        if (!isShow) {
          this.watchCommentPostId = '';
          this.commentList = [];
          this.commentCurrentPage = 1;
          this.commentTotalCount = 1;
        }
      },
      online(postId) {
        this.requestModifyPostStatus(postId, 0);
      },
      offline(postId) {
        this.requestModifyPostStatus(postId, 1);
      },
      edit(row) {
        let params = {row: row, currentPage: this.currentPage};
        this.$router.push({name: 'role-edit', params: params})
      },
      changePage(index) {
        this.currentPage = index;
        this.requestPostList();
      },
      requestModifyPostStatus(postId, status) {
        modifyRoleStatus(postId, status).then(() => {
          if (status === 0) {
            this.$Message.success("上线成功");
          } else if (status === 1) {
            this.$Message.success("下线成功");
          }
          this.requestPostList();
        });
      },



      requestPostList() {
        this.postListTableLoading = true;
        const data = {
          id: this.searchPostId,
          token: localStorage.getItem('token'),
          categoryId: this.categoryId,
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          postStatus: this.postStatus
        };

        getRoleList(data).then(res => {
          this.totalCount = res.data.count;
          if (this.totalCount > 0) {
            this.postList = res.data.list;
          } else {
            this.postList = [];
          }
          this.postListTableLoading = false;
        }).catch(() => {
          this.postListTableLoading = false;
        });
      }
    },
    created() {
      queryType().then(result => {
            result.data.forEach(roleType => {
                this.categoryOptions.push({
                    value: roleType.id,
                    label: roleType.roleTypeName
                })
            })
        });
      if (this.$route.params.rankType) {
        this.rankType = this.$route.params.rankType
      }
      if (this.$route.params.currentPage) {
        this.currentPage = this.$route.params.currentPage
      }
      this.requestPostList();
    },
    mounted() {

    }
  };
</script>

<style scoped>

  .ivu-table-column-center {
    white-space: nowrap !important;
  }
  .ivu-table-cell {
    white-space: nowrap !important;
  }
</style>
