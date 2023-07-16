<template>
  <div>
    <Form>
      <FormItem label="角色名称" :label-width="80">
        <Input v-model="postTitle" placeholder="请输入角色名称..." clearable></Input>
      </FormItem>
      <FormItem label="开场白" :label-width="80">
        <Input v-model="chat" placeholder="请输入开场白..." clearable></Input>
      </FormItem>
      <FormItem label="角色简介" :label-width="80">
        <Space direction="vertical" size="large" type="flex">
          <Input v-model="description" type="textarea" :rows="2" placeholder="输入角色简介..."/>
        </Space>
      </FormItem>
      <FormItem label="prompt" :label-width="80">
        <Space direction="vertical" size="large" type="flex">
          <Input v-model="prompt" type="textarea" :rows="3" placeholder="输入角色prompt..."/>
        </Space>
      </FormItem>
      <FormItem label="chtGPT模型" :label-width="80">
        <Input v-model="model" placeholder="请输入chtGPT模型..." clearable></Input>
      </FormItem>
      <FormItem label="最大Token" :label-width="80">
        <Input v-model="maxToken" placeholder="最大Token..." clearable></Input>
      </FormItem>
    </Form>
    <div>
      <el-upload
        action="#"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :http-request="uploadAvatar"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
    <Button style="margin-top: 20px;margin-left: 48%" type="success" :loading="publishLoading"
            @click="publishCardModal = true">提交
    </Button>

    <Modal
      :mask-closable="false"
      v-model="publishCardModal"
      title="角色"
      @on-ok="postPublish"
      @on-cancel="cancel">

      <div style="margin-top: 20px">
        角色分类：
        <Select v-model="cardTypeId" style="width:120px">
          <Option v-for="item in categoryOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>

      <div style="margin-top: 20px">
        角色排序：
        <Input v-model="sortNum" placeholder="数字类型" clearable style="width:120px"></Input>
      </div>

      <div style="margin-top: 20px">
        角色属性：
        <Select v-model="postStatus" style="width:120px">
          <Option :value=0>上线</Option>
          <Option :value=1>下线</Option>
          <Option :value=2>私有</Option>
        </Select>
      </div>

    </Modal>
  </div>

</template>

<script>

    import {doDeleteCard, uploadCard, postRole} from "../../api/role";

    //in ES6
    import * as imageConversion from 'image-conversion';
    import {queryType} from "../../api/category";


    export default {
        name: "role-edit",
        data() {
          return {
              postTitle: "",
              description: "",
              authorToken: {
                  'token': localStorage.getItem("token")
              },
              publishLoading: false,
              publishCardModal: false,

              dialogImageUrl: '',
              dialogVisible: false,
              picList: [],
              fileList: [],

              sortNum: 0,
              postStatus: 0,
              cardTypeId: '',
              categoryOptions: [],

              chat: "",
              model: "",
              prompt: "",
              maxToken: 2048



          }

        },
        created() {
          queryType().then( result => {
                result.data.forEach(roleType => {
                  this.categoryOptions.push({
                    value: roleType.id,
                    label: roleType.roleTypeName
                  })
                })
                console.log(result)
            });
            if (this.$route.params.row) {
                let res= this.$route.params.row;
                console.log(res)
                this.updateCard(res)



            }

        },
        methods: {
            updateCard(res) {
                this.postTitle = res.title;
                this.description = res.description;
                this.postStatus = res.postStatus;
                this.cardTypeId = res.cardTypeId;
                this.integral = res.integral;
                this.sortNum = res.sortNum;
                this.picList = res.images;
            },
            uploadAvatar(item) {
                const formData = new FormData()
                formData.append('image', item.file)
                const uid = item.file.uid
                uploadCard(formData).then(res => {
                    console.log(res);
                    this.picList.push({key: uid, value: res.data})
                    this.emptyUpload()
                }).catch(() => {
                    this.$message.error('上传失败，请重新上传')
                    this.emptyUpload()
                })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isPng = file.type === 'image/png'
                const isLt2M = file.size / 1024 / 1024 < 2

                if (!isJPG && !isPng) {
                    this.$message.error('上传图片只能是 JPG或png 格式!')
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!')
                    return false;
                }
                return new Promise((resolve) => {
                    // 压缩到100KB,这里的100就是要压缩的大小，可自定义
                    imageConversion.compressAccurately(file, 80).then((res) => {
                        resolve(res)
                    })
                })
            },
            handleRemove(file, fileList) {
                for (const i in this.picList) {
                    if (this.picList[i].key === file.uid) {
                        doDeleteCard(this.picList[i].value).then(result => {
                            if (result.code === 200) {
                                this.picList.splice(i, 1)
                            }
                        })

                    }
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            /**
             * 清空上传组件
             */
            emptyUpload() {
                const mainImg = this.$refs.upload
                if (mainImg) {
                    if (mainImg.length) {
                        mainImg.forEach(item => {
                            item.clearFiles()
                        })
                    } else {
                        this.$refs.upload.clearFiles()
                    }
                }
            },
            postPublish() {
                if (!this.postTitle) {
                    this.$Message.error("标题不能为空");
                    return;
                }
                if (!this.description) {
                    this.$Message.error("描述不能为空");
                    return;
                }
                if (!this.picList || this.picList.length === 0) {
                    this.$Message.error("图片不能为空");
                    return;
                }
                let images = [];
                this.picList.forEach(pic => {
                    images.push(pic.value);
                })
                let data = {
                    title: this.postTitle,
                    description: this.description,
                    cardTypeId: this.cardTypeId,
                    sortNum: this.sortNum,
                    postStatus: this.postStatus,
                    image: images[0],
                    chat: this.chat,
                    model: this.model,
                    prompt: this.prompt,
                    maxToken: this.maxToken
                };
                if (this.$route.params.row) {
                    data.id = this.$route.params.row.id
                }
                console.log(data);
                postRole(data).then(result => {
                    if (result.code === 200) {
                        this.$Message.success("保存成功");
                        this.clear();
                    } else (
                        this.$Message.error("保存失败")
                    )
                })

            },
            clear() {
                this.picList = [];
                this.fileList = [];
                this.postTitle = "";
                this.description = "";
                this.sortNum = parseInt(this.sortNum) + 1;
                this.chat = "";
                this.model = "";
                this.prompt = "";
                this.maxToken = 2048;
            },
            cancel() {

            }

        }
    }
</script>
<style>
  /*去除upload组件过渡效果*/
  .el-upload-list__item {
    transition: none !important;
  }

  .hide >>> .el-upload--picture-card {
    display: none;
  }
</style>
