import AsyncStorage from "@react-native-async-storage/async-storage";
import LoggerUtil from './LoggerUtil';

const TOKEN = "accessToken";
const USERID = "userId";

let storageKeys = [];

export default {

  async getToken(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(TOKEN)
      .then(value => {
        if (value == null){
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("error reading from storage", error);
        reject(error);
      })
    })
  },

  async getUserId(){
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(USERID)
      .then(value => {
        if (value == null){
          return resolve(null);
        }
        resolve(value);
      })
      .catch(error => {
        LoggerUtil.logError("Error reading from storage", error);
        reject(error);
      })
    })
  },

  async removeKeys(){
    let keys = storageKeys;
    keys.push(TOKEN, USERID);
    try{
      await AsyncStorage.multiRemove(keys);
      return storageKeys = [];
    } catch(error){
      LoggerUtil.logError("Error removing keys", error);
    }
  },

  async storeToken(token){
    await AsyncStorage.setItem(TOKEN, token)
    .catch(error => {
      LoggerUtil.logError("error saving token", error);
    })
  },

  async storeUserId(id){
    await AsyncStorage.setItem(USERID, JSON.stringify(id))
    .catch(error => {
      LoggerUtil.logError("Error saving user id", error);
    })
  }
}