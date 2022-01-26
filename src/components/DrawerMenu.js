import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import jwt_decode from 'jwt-decode';

import { colors } from '../config/values';
import Loading from './Loading';
import Logger from '../utils/LoggerUtil';
import NavigationService from '../services/NavigationService';
import ServerCommunication from '../utils/ServerCommunication';
import StorageUtil from '../utils/StorageUtil';

export default function DrawerMenu(props){

  const [ loading, setLoading ] = useState(false);
  const [ name, setName ] = useState('');
  const [ token, setToken ] = useState('');
  const [ userId, setUserId ] = useState(0);

  useEffect(() => {
    decodeToken();
  }, [])

  const decodeToken = async () => {
    let token = await StorageUtil.getToken();
    setToken(token);
    
    let decoded = jwt_decode(token);
    setName(decoded.firstName);
    setUserId(decoded.userId);
  }

  const logout = async() => {

    let payload = {
      token: token,
      userId: userId
    }

    setLoading(true);
    await ServerCommunication.logout(payload)
    .then(resp => {
      if (resp.status === 200){
        setLoading(false);
        StorageUtil.removeKeys();
        NavigationService.reset('Login');
      }
    })
    .catch(error => {
      setLoading(false);
      Logger.logError("DrawerMenu.logout", error);
      StorageUtil.removeKeys();
      NavigationService.reset('Login');
    })
  }

  if (loading){
    return(<Loading/>);
  }

  return (
    <DrawerContentScrollView {...props}>
      <Text style = {styles.welcomeText}>Welcome, {name}</Text>
      <DrawerItemList {...props} />
      <View style = {styles.logoutView}>
        <TouchableOpacity style = {styles.logoutButton} onPress = {logout}>
          <Icon name = "logout" size = {20} color = {colors.red} />
          <Text style = {styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row'
  },
  logoutText: {
    color: colors.red,
    fontSize: 14,
    marginLeft: 5
  },
  logoutView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  welcomeText: {
    color: colors.red,
    fontSize: 17,
    lineHeight:50,
    textAlign: 'center'
  }
})