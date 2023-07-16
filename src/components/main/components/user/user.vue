<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Tag color="blue">{{userName}}</Tag>
      <Icon :size="12" type="arrow-down-b"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { logout } from '@/api/user'

export default {
  name: 'user',
  props: {
    userName: {
      type: String,
      default: 'unknown'
    }
  },
  methods: {
    handleClick (name) {
      switch (name) {
        case 'logout':
          // logout().then(() => {
          //   localStorage.setItem('token', '');
          //   this.$router.push({
          //     name: 'login'
          //   })
          // }).catch(err => {
          //   this.$Message.error(err);
          // });

            localStorage.setItem('token', '');
            this.$router.push({
                name: 'login'
            })
      }
    }
  }
}
</script>
