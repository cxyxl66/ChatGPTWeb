import axios from '@/libs/axios'
import {topicListUrl, topicUpdateUrl} from '../api/url';

export const getTopicList = (categoryId, pageNum, pageSize) => {
  const data = {
    categoryId,
    pageNum,
    pageSize
  };
  return axios.request({
    url: topicListUrl,
    data,
    method: 'post'
  })
};

export const upsertTopic = (id, name, sort) => {
  const data = {
    id,
    name,
    sort
  };
  return axios.request({
    url: topicUpdateUrl,
    data,
    method: 'post'
  })
};
