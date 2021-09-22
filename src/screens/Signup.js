import React, {useState} from 'react';
import {View, Text, ToastAndroid, ScrollView, StyleSheet} from 'react-native';
import Config from 'react-native-config';
import {RadioButton} from 'react-native-paper';

import FormInput from '../components/FormInput';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import RadioView from '../components/RadioView';
import ServerCommunication from '../utils/ServerCommunication';
import SubmitButton from '../components/SubmitButton';

export default function SignupScreen({navigation}){

  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roleId, setRoleId] = useState('');
  

  /**
   * Check if passwords entered match
   */
  const checkPassword = () =>{
    if (confirmPassword !== password ){
      return(
        <Text style = {styles.confirmText}>Passwords do not match</Text>
      );
    }else{
      return(
        <SubmitButton
          buttonTitle = "Submit"
          onPress = {signUp}
        />
      )
    }
  }


  const signUp = async() =>{

    if (!firstName || !lastName || !phoneNumber || !password){
      alert('Please enter all details')
      return
    }

    let payload = {
      contacts : [{
        contactTypeId : 1,
        value : phoneNumber
      }],
      firstName : firstName,
      lastName : lastName,
      passcode : password,
      roleId : parseInt(roleId)
    }

    setLoading(true)
    console.log("Payload: ", payload)
    await ServerCommunication.post(`${Config.API_URL}/user`, payload)
    .then(resp => {
      if (resp.status === 201){
        setLoading(false)
        ToastAndroid.show("User added successfully", ToastAndroid.SHORT)
        setConfirmPassword('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setPhoneNumber('')
      }else if(resp.validationError.errors){
        setLoading(false)
        alert('Error saving user')
      }
    }).catch(error => {
      setLoading(false)
      console.log(error)
      alert('There was a problem saving user')
    })
  }


  if (loading){
    return(
      <Loading/>
    );
  }


  return(
  <ScrollView>
    <View style = {globalStyles.container}>
      <View style = {styles.formView}>
        <Text style = {styles.descriptionText}>FIRSTNAME</Text>
        <FormInput
          labelName = "First name"
          value = {firstName}
          onChangeText = {(text) => setFirstName(text)}
        />
      </View>

      <View style = {styles.formView}>
        <Text style = {styles.descriptionText}>LASTNAME</Text>
        <FormInput
          labelName = "Last name"
          value = {lastName}
          onChangeText = {(text) => setLastName(text)}
        />
      </View>

      <View style = {styles.formView}>
        <Text style = {styles.descriptionText}>PHONE NUMBER</Text>
        <FormInput
          labelName = "Phone number"
          value = {phoneNumber}
          onChangeText = {(text) => setPhoneNumber(text)}
        />
      </View>

      <RadioButton.Group
        onValueChange = {newVal => setRoleId(newVal)}
        value = {roleId}
      >
        <View style = {styles.radioButtons}>
          <RadioView val = "1" text = "System-admin"/>
          <RadioView val = "2" text = "Sales-person" />
        </View>
      </RadioButton.Group>

      <View style = {styles.formView}>
        <Text style = {styles.descriptionText}>PASSWORD</Text>
        <FormInput
          labelName = "Password"
          value = {password}
          secureTextEntry = {true}
          onChangeText = {(text) => setPassword(text)}
        />
      </View>

      <View style = {styles.formView}>
        <Text style = {styles.descriptionText}>CONFIRM PASSWORD</Text>
        <FormInput
          labelName = "Confirm password"
          value = {confirmPassword}
          onChangeText = {(text) => setConfirmPassword(text)}
          secureTextEntry = {true}
        />
      </View>

      {
        checkPassword()
      }

    </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
  confirmText:{
    color: 'red'
  },
  descriptionText:{
    fontSize: 11,
    marginBottom: -5
  },
  formView:{
    marginBottom: 10
  },
  radioButtons:{
    flexDirection: 'row'
  },
})