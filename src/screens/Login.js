import React, {useState} from 'react';
import {Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import FormattingUtil from '../utils/FormattingUtil';
import globalStyles from '../config/globalStyles';
import InputText from '../components/InputText';
import Loading from '../components/Loading';
import LoggerUtil from '../utils/LoggerUtil';
import NavigationService from '../services/NavigationService';
import PinCodeInput from '../components/PinCodeInput';
import ServerCommunication from '../utils/ServerCommunication';
import StorageUtil from '../utils/StorageUtil';
import SubmitButton from '../components/SubmitButton';

const {width, height} = Dimensions.get('screen');

export default function LoginScreen({navigation}){

  const [ isMobileError, setIsMobileError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ mobileError, setMobileError ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ pinError, setPinError ] = useState('');

  const login = async() =>{

    if (!phoneNumber){
      setIsMobileError(true);
      setMobileError("Please enter mobile number");
      return;
    }

    if (!password){
      setPinError("Enter PIN");
      return;
    }

    if (password.length !== 4){
      setPinError("Enter complete PIN");
      return;
    }

    const userDetails = {
      userContact: FormattingUtil.formatPhoneNumber(phoneNumber),
      password: password.trim()
    }

    setLoading(true);
    await ServerCommunication.login(userDetails)
    .then(resp =>{
      if (resp.status === 200){
        LoggerUtil.logInformation("Login successful!");
        StorageUtil.storeToken(resp.content.token);
        NavigationService.reset("Main");
      } else if (resp.validationError.errors){
        setLoading(false);
        alert('Invalid credentials provided');
      }
    })
    .catch(error =>{
      setLoading(false);
      LoggerUtil.logError('Login.login: ', error);
      if (error.toString().includes("Network request failed")){
        alert('Please check your internet connection')
      }
    })
  }

  if (loading){
    return(<Loading/>);
  }

  return(
  <ScrollView>
    <View style = {[globalStyles.container, styles.centerView]}>
      <Image
        source = {require('../resources/images/Smartrose_full.jpeg')}
        style = {styles.image}
      />
      <View style = {styles.formView}>
        <InputText
          error = {isMobileError}
          errorText = {mobileError}
          keyboardType = "numeric"
          label = "Mobile number"
          onFocus = {() => setIsMobileError(false)}
          onChangeText = {(text) => setPhoneNumber(text)}
          placeholder = "e.g 0712345678"
          showHelper = {isMobileError}
          value = {phoneNumber}
          width = {width / 1.5}
        />
        <PinCodeInput
          descText = "PIN"
          errorText = {pinError}
          onFocus = {() => setPinError('')}
          onTextChange = {(code) => setPassword(code)}
          password mask = "*"
          value = {password}
        />
      </View>

      <SubmitButton
        buttonTitle = "Login"
        onPress = {login}
      />
    </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
  signupText:{
    color: 'red',
    fontSize: 16
  },
  signupView:{
    paddingTop:20
  },
  centerView:{
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: 50
  },
  descriptionText:{
    alignSelf: 'center',
    fontSize: 13
  },
  formView:{
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    borderRadius: width / 4.4,
    height: width / 2.2,
    width: width / 2.2
  }
})