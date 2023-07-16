import axios from '@/libs/axios'
import {loginUrl, logoutUrl} from '@/api/url';

export const login = ({username, password}) => {
  const data = {
    username,
    password
  };

  return axios.request({
    url: loginUrl,
    data,
    method: 'post',
  })
};

export const logout = () => {
  return axios.request({
    url: logoutUrl,
    method: 'post'
  })
};
