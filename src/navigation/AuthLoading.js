import React, { useEffect } from 'react';

import Loading from '../components/Loading';
import NavigationService from '../services/NavigationService';
import StorageUtil from '../utils/StorageUtil';

export default function AuthLoadingScreen({navigation}){

  useEffect(() =>{
      checkUserStatus();
  }, [])

  /**
   * Check if user is logged in or not
   */
  const checkUserStatus = async () =>{
    await StorageUtil.getToken()
    .then(value =>{
      if(value != null){
        NavigationService.reset('Main');
      }else {
        NavigationService.reset('Login');
      }
    })
  }

  return( <Loading/> );
}
