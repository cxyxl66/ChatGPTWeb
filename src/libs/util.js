import { forEach, hasOneOf } from '../libs/tools'

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
};

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.roles && item.meta.roles.length) {
    if (hasOneOf(item.meta.roles, access)) return true;
    else return false
  } else return true
};
/**
 * {Array} list 通过路由列表得到菜单列表 {Array} roles 用户权限
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = [];
  forEach(list, item => {
    if (item.meta && !item.meta.hideInMenu) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      };
      if (hasChild(item) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  });
  return res
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched) => {
  let res = routeMetched.map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    };
    return obj
  });
  res = res.filter(item => {
    return !item.meta.hideInMenu
  });
  return [{
    name: '首页',
    to: '/'
  }, ...res]
};

export const showTitle = (item, vm) => ((item.meta && item.meta.title) || item.name);

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1;
  let len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    let item = routers[i];
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children);
      if (res.name) return res
    } else {
      if (item.name === '首页') homeRoute = item
    }
  }
  return homeRoute
};

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.roles) return hasOneOf(access, route.meta.roles);
  else return true
};

/**
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const getHasAccessRouteNames = (list) => {
    let res = [];
    list.forEach(item => {
      if (item.children && item.children.length) {
        res = [].concat(res, getHasAccessRouteNames(item.children))
      } else {
        if (item.meta && item.meta.roles) {
          console.log(item.meta.roles)
          if (hasAccess(access, item)) res.push(item.name)
        } else {
          res.push(item.name)
        }
      }
    });
    return res
  };
  const canTurnToNames = getHasAccessRouteNames(routes);
  return canTurnToNames.indexOf(name) > -1
};
