import axios from '../libs/axios'
import {getQuestionCategory, getAllCardType, getQuestionById, getArticleById, chatModelType} from '../api/url';

export const getCategory = (level) => {
  return axios.get(getQuestionCategory, {
    url: getQuestionCategory,
    params:{level: level},
    method: 'get'
  })
};

export const getCardAllType = () => {
  return axios.get(getAllCardType, {
    url: getAllCardType,
    method: 'get'
  })
};

export const queryType = () => {
  return axios.request({
    url: chatModelType,
    method: 'post'
  })
};


export const getQuestion = (id) => {
  return axios.get(getQuestionById + id, {
    url: getQuestionById + id,
    method: 'get'
  })
};


export const getArticle = (id) => {
  return axios.get(getArticleById + id, {
    url: getArticleById + id,
    method: 'get'
  })
};

export const getCard = (id) => {
  return axios.get(getQuestionById + id, {
    url: getQuestionById + id,
    method: 'get'
  })
};

export const getPdf = (id) => {
  return axios.get(getQuestionById + id, {
    url: getQuestionById + id,
    method: 'get'
  })
};
