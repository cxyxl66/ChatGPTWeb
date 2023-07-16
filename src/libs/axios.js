import Axios from 'axios'
import {Message, Spin} from 'iview';
import router from '@/router'

class httpRequest {
  constructor() {
    this.options = {
      method: '',
      url: ''
    };
    // 存储请求队列
    this.queue = {}
  }

  // 销毁请求实例
  destroy(url) {
    delete this.queue[url];
    const queue = Object.keys(this.queue);
    return queue.length
  }

  // 请求拦截
  interceptors(instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      // Spin.show();
      // 在发送请求之前做些什么
      return config
    }, error => {
      // 对请求错误做些什么
      console.log("error: " + JSON.stringify(error));
      return Promise.reject(error)
    });

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      let {data} = res;
      const is = this.destroy(url);
      if (!is) {
        /*setTimeout(() => {
          Spin.hide()
        }, 500)*/
      }
      if (data.code !== 200) {
        Message.error(data.msg);
        return Promise.reject(data.msg);
      }
      return data
    }, (error) => {
      // 对响应错误做点什么
      let res = error.response;
      if (res.status === 401) {
        localStorage.setItem('token', '');
        Message.error('登录状态过期，请重新登录');
        setTimeout(() => {
          router.push({name: 'login'})
        }, 1500);
      } else {
        Message.error(res.statusText);
      }
      return Promise.reject(error)
    })
  }

  // 创建实例
  create() {
    let conf = {
      baseURL: process.env.BASE_URL,
      withCredentials: true,
      // timeout: 2000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // 'X-URL-PATH': location.pathname
        'token': localStorage.getItem('token')
      }
    };
    return Axios.create(conf)
  }

  // 合并请求实例
  mergeReqest(instances = []) {
    //
  }

  // 请求实例
  request(options) {
    let instance = this.create();
    this.interceptors(instance, options.url);
    options = Object.assign({}, options);
    this.queue[options.url] = instance;
    return instance(options)
  }

  get(url, options) {
    let instance = this.create();
    this.interceptors(instance, options.url);
    return instance.get(url, options)
  }


}

const axios = new httpRequest();
export default axios
