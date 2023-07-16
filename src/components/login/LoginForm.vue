<template>
  <div @keyup.enter="submitLogin">
    <Form ref="loginForm" :model="form" :rules="rules" >
      <FormItem prop="username">
        <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="person"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="locked"></Icon>
        </span>
        </Input>
      </FormItem>
      <FormItem>
        <Button @click="submitLogin" type="primary" long>登录</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import { login } from '../../api/user';

  export default {
    name: 'LoginForm',
    props: {
      usernameRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ]
        }
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    data() {
      return {
        form: {
          username: localStorage.getItem('username'),
          password: ''
        }
      }
    },
    computed: {
      rules() {
        return {
          username: this.usernameRules,
          password: this.passwordRules
        }
      }
    },
    methods: {
      submitLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            const username = this.form.username;
            const password = this.form.password;
            login({
              username,
              password
            }).then(res => {
              localStorage.setItem('username', username);
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('roles', res.data.roles);
              this.$router.push({
                name: 'home'
              })
            })
          }
        })
      }
    }
  }
</script>
