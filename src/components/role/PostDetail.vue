<template>
  <div>
    <br>
    <span class="expand-key">第一句话: </span>
    <span class="expand-value">{{ row.chat }}</span>
    <br>
    <br>
    <span class="expand-key">描述信息: </span>
    <span class="expand-value">{{ row.description }}</span>
    <br>
    <br>
    <span class="expand-key">是否原创: </span>
    <span class="expand-value">{{ row.prop === 0 ? '原创' : '转载' }}</span>
    <br>
    <br>
    <span class="expand-key">是否公开: </span>
    <span class="expand-value">{{ row.postStatus === 1 ? '个人' : '公开' }}</span>
    <br>
    <br>
  </div>
</template>

<script>

  export default {
    name: "post-detail",
    props: {
      row: Object
    },
    data() {
      return {
        isAdmin: localStorage.getItem('roles').indexOf("ROLE_ADMIN") > -1
      }
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
