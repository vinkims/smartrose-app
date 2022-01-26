import Config from 'react-native-config';

import LoggerUtil from './LoggerUtil';
import NavigationService from '../services/NavigationService';
import StorageUtil from './StorageUtil';

function basicResponseHandler(url, resp){  
  if (resp.ok){
    return resp.json();
  } else if (resp.status === 400){
    return resp.json()
    .then( jsonResp =>{
      return {validationError: jsonResp}
    });
  } else{
    if (resp.status === 401 || resp.status === 403){
      LoggerUtil.logError(`Auth failed for URL, ${url}`);
      StorageUtil.removeKeys();
      NavigationService.resetToRoute('Login');
    }
    throw Error(`Failed to call URL: ${url}, \nStatus code: ${resp.status}`)
  }
}


function get(url){
  return new Promise((resolve, reject) =>{
    StorageUtil.getToken()
    .then(token =>{
      fetch(url, {
        headers:{
          Accept: 'application/json',
          'Content-Type' : 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .then( resp => basicResponseHandler(url, resp))
      .then(respJson =>{
        LoggerUtil.logDebug(`Successfully retrieved from ${url}`, respJson);
        resolve(respJson);
      })
      .catch(error =>{
        LoggerUtil.logError(`Error retrieving from ${url}`, error);
        reject(error);
      })
    })
  })
}


function post(url, payload){
  return new Promise(async(resolve, reject) =>{
    StorageUtil.getToken()
    .then(token =>{
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type' : 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(resp => basicResponseHandler(url, resp))
      .then(respJson => {
        resolve(respJson);
      })
      .catch(error =>{
        LoggerUtil.logError(`Error posting to ${url}`, error);
        reject(error);
      })
    })
  })
}


function postNoAuth(url, payload){
  return new Promise(async(resolve, reject) =>{
    try{
      let request = {
        method: 'POST',
        headers:{
          Accept: 'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(payload)
      }

      const resp = await fetch(url, request);
      const json = basicResponseHandler(url, resp);
      resolve(json);
    } catch(error){
      LoggerUtil.logError(`Error posting to ${url} `, error);
      reject(error);
    }
  })
}


function patch(url, payload){
  return new Promise(async(resolve, reject) =>{
    StorageUtil.getToken()
    .then(token =>{
      fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type' : 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(resp => basicResponseHandler(url, resp))
      .then(respJson =>{
        resolve(respJson)
      })
      .catch(error =>{
        LoggerUtil.logError(`Error posting to ${url} `, error);
        reject(error)
      })
    })
  })
}

export default{
  post,
  postNoAuth,
  patch,
  get,

  async addClothe(payload){
    return post(`${Config.API_URL}/clothe`, payload)
  },

  async addClotheItem(payload){
    return post(`${Config.API_URL}/clothe/item`, payload)
  },

  async getClotheItemInStock(){
    return get(`${Config.API_URL}/clothe/item?q=status.idEQ1&pgSize=1000`)
  },

  async getClothes(){
    return get(`${Config.API_URL}/clothe`)
  },

  async getFilteredClotheItems(params){
    return get(`${Config.API_URL}/clothe/item?${params}`)
  },

  async getSaleSummary(param){
    return get(`${Config.API_URL}/sale/summary${param}`)
  },

  async getSoldClothes(){
    return get(`${Config.API_URL}/sale?pgSize=1000`)
  },
  
  async login(credentials){
    return postNoAuth(`${Config.API_URL}/user/auth`, credentials)
  },

  async logout(payload){
    return post(`${Config.API_URL}/user/auth/sign-out`, payload)
  }
}