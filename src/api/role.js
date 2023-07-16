import axios from '@/libs/axios'
import {
  getAllCardType,
  chatModel, postImgUploadUrl, deleteImg,postRoleUrl
} from '../api/url';

export const uploadCard = (data) => {
  return axios.request({
    url: postImgUploadUrl,
    data,
    method: 'post'
  })
};

export const doDeleteCard = (imageName) => {
  const data = {
    imageName
  }
  return axios.request({
    url: deleteImg,
    data: data,
    method: 'post',
  })
};

export const getCardType = () => {
  return axios.request({
    url: getAllCardType,
    method: 'get'
  })
};


export const postRole = (data) => {
  return axios.request({
    url: postRoleUrl,
    data,
    method: 'post'
  })
};

export const getRoleList = (data) => {
  return axios.request({
    url: chatModel,
    data,
    method: 'post'
  })
}

