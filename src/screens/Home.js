import React, {useEffect, useState} from 'react';
import { ScrollView, StyleSheet, Text, View} from 'react-native';
import jwt_decode from 'jwt-decode';

import { colors } from '../config/values';
import ActionButton from '../components/ActionButton';
import globalStyles from '../config/globalStyles';
import HomeButton from '../components/HomeButton';
import Loading from '../components/Loading';
import LoggerUtil from '../utils/LoggerUtil';
import NavigationService from '../services/NavigationService';
import ServerCommunication from '../utils/ServerCommunication';
import StorageUtil from '../utils/StorageUtil';

export default function HomeScreen({navigation}){

  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() =>{
    checkTokenValidity();
  }, [])

  const signup = () =>{
    navigation.navigate('Signup');
  }

  const checkTokenValidity = async() =>{
    let token = await StorageUtil.getToken();
    var dateNow = new Date();
    let decoded = jwt_decode(token);
    
    if (decoded.role === "system-admin"){
      setAdmin(true);
    }

    StorageUtil.storeUserId(decoded.userId);
    setUser(decoded.firstName);

    if (decoded.exp * 1000 < dateNow.getTime()){
      LoggerUtil.logInformation("TOKEN EXPIRED!");
      removeToken();
    }else{
      LoggerUtil.logInformation("Valid token");
    }
  }

  const logout = async() =>{
    setLoading(true);

    let token = await StorageUtil.getToken();
    let decoded = jwt_decode(token);
    let userId = decoded.userId;

    let payload = {
      token: token,
      userId: userId
    }

    await ServerCommunication.logout(payload)
    .then(result =>{
      if(result.status === 200){
        LoggerUtil.logInformation('Signout success');
        removeToken();
      } else if (result.validationError.errors){
        LoggerUtil.logError(result.validationError.errors);
        removeToken();
      }
    })
    .catch(error =>{
      LoggerUtil.logError('Failed to signout', error);
      removeToken();
    })
  }

  const navigateToScreen = (screen) => {
    NavigationService.navigate(screen);
  }

  const removeToken = () =>{
    StorageUtil.removeKeys();
    NavigationService.reset("Login");
  }

  if (loading){
    return(<Loading/>);
  }

  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        <Text style = {styles.welcomeText}>Welcome, {user}</Text>
        {
          admin ? (
            <View style = {styles.buttonView}>
              <HomeButton
                iconName = "briefcase-plus-outline"
                buttonTitle = "Add Product"
                onPress = {() => navigateToScreen('AddProduct')}
              />
              <HomeButton
                iconName = "briefcase-minus-outline"
                buttonTitle = "Sell Product"
                onPress = {() => navigateToScreen('SellProduct')}
              />
              <HomeButton
                iconName = "hanger"
                buttonTitle = "View Stock"
                onPress = {() => navigateToScreen('ViewStock')}
              />
              <HomeButton
                iconName = "cash"
                buttonTitle = "View Sold"
                onPress = {() => navigateToScreen('ViewSold')}
              />
              <HomeButton
                iconName = "file-document-outline"
                buttonTitle = "View Transactions"
                onPress = {() => navigateToScreen('Transactions')}
              />
            </View>
          ) : (
            <View>
              <HomeButton
                iconName = "briefcase-minus-outline"
                buttonTitle = "Sell Product"
                onPress = {() => navigateToScreen('SellProduct')}
              />
              <HomeButton
                iconName = "hanger"
                buttonTitle = "View Stock"
                onPress = {() => navigateToScreen('ViewStock')}
              />
              <HomeButton
                iconName = "cash"
                buttonTitle = "View Sold"
                onPress = {() => navigateToScreen('ViewSold')}
              />
            </View>
          )
        }

        <ActionButton
          iconName = "logout" 
          buttonTitle = "Logout" 
          buttonColor = {colors.lightRed}
          onPress = {logout}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonView:{
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  container:{
    alignItems: 'center',
    padding: 10
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})
