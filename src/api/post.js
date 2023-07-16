import axios from '@/libs/axios'
import {
  postListUrl,
  articleListUrl,
  postDeleteTopicUrl,
  postCommentUrl,
  deletePostCommentUrl,
  postImgUploadUrl,
  deleteImg,
  cardRoleUrl
} from '../api/url';

export const getPostList = (id, title, categoryId, postStatus, pageNum, pageSize) => {
  const data = {
    id,
    title,
    categoryId,
    postStatus,
    pageNum,
    pageSize
  };
  return axios.request({
    url: postListUrl,
    data,
    method: 'post'
  })
};

export const getArticleList = (id, title, categoryId, postStatus, pageNum, pageSize) => {
  const data = {
    id,
    title,
    categoryId,
    postStatus,
    pageNum,
    pageSize
  };
  return axios.request({
    url: articleListUrl,
    data,
    method: 'post'
  })
};


export const modifyRoleStatus = (id, status) => {
  const data = {
    id,
    status
  };
  return axios.request({
    url: cardRoleUrl,
    data,
    method: 'post'
  })
};


export const deletePostTopic = (post_id, topic) => {
  const data = {
    post_id,
    topic
  };
  return axios.request({
    url: postDeleteTopicUrl,
    data,
    method: 'post'
  })
};

export const getPostCommentList = (post_id, page, size) => {
  const data = {
    post_id,
    page,
    size,
  };
  return axios.request({
    url: postCommentUrl,
    data,
    method: 'post'
  })
};

export const deletePostComment = (post_id, comment_id) => {
  const data = {
    post_id,
    comment_id
  };
  return axios.request({
    url: deletePostCommentUrl,
    data,
    method: 'post'
  })
};

export const uploadPostImg = (formData) => {
  return axios.request({
    url: postImgUploadUrl,
    data: formData,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};


export const doDeleteImg = (imageName) => {
  const data = {
    imageName
  }
  return axios.request({
    url: deleteImg,
    data: data,
    method: 'post',
  })
}
