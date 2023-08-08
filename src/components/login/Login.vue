<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card title="程序员修炼" :bordered="false">
        <div class="form-con">
          <login-form></login-form>
          <p class="login-tip">请输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import loginForm from './LoginForm'
export default {
  components: {
    loginForm
  },
}
</script>

<style>

</style>
