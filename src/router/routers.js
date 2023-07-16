import Main from '@/components/main/Main'
import home from "../components/home/home";

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/components/login/Login')
  },

  {
    path: '/',
    name: '首页',
    redirect: '/',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        name: '首页',
        meta: {
          notCache: true
        },
        component: home
      },
      {
        path: '/chat',
        name: 'chat',
        meta: {
          title: '对话框',
          hideInMenu: true
        },
        component: () => import('@/components/chat/chat')
      },
    ]
  },

  {
    path: '/role',
    name: 'Role',
    meta: {
      icon: 'ios-world-outline',
      title: '角色管理'
    },
    component: Main,
    children: [
      {
        path: 'role-edit',
        name: 'role-edit',
        meta: {
          title: '角色编辑'
        },
        component: () => import('@/components/role/RoleEdit')
      },
      {
        path: 'role-list',
        name: 'role-list',
        meta: {
          title: '角色列表'
        },
        component: () => import('@/components/role/RoleList')
      },
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/components/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/components/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/components/error-page/404.vue')
  }
]
