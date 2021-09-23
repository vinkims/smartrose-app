import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FormattingUtil from '../utils/FormattingUtil';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import SubmitButton from '../components/SubmitButton';
import ServerCommunication from '../utils/ServerCommunication';
import globalStyles from '../config/globalStyles';

const {width, height} = Dimensions.get('screen');

export default function LoginScreen({navigation}){

    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const login = () =>{
        setLoading(true)

        if (!phoneNumber || !password){
            alert('Please enter credentials')
            return
        }

        checkCredentials();
    }

    const checkCredentials = async () =>{

        let validatedNo = FormattingUtil.formatPhoneNumber(phoneNumber.trim())

        const userDetails = {
            userContact: validatedNo,
            password: password.trim()
        }

        savePhoneNumber(validatedNo)

        await ServerCommunication.postNoAuth(`${Config.API_URL}/user/auth`, userDetails)
        .then(resp =>{
            if (resp.status === 200){
                saveToken(resp.content.token)
                navigation.reset({
                    index : 0,
                    routes:[{name: 'Home'}]
                })
            } else if (resp.validationError.errors){
                setLoading(false);
                alert('Invalid credentials provided')
            }
        })
        .catch(error =>{
            setLoading(false)
            console.log(error)
            if (error.toString().includes("Network request failed")){
                alert('Please check your internet connection')
            }
        })
    }

    const savePhoneNumber = async(phoneNo) => {
        await AsyncStorage.setItem("phone", phoneNo)
        .catch(error => {
            console.log("Error saving phone number", error)
        })
    }


    /**
     * Save token to Asyncstorage
     */
    const saveToken = async(token) =>{
        await AsyncStorage.setItem("token", token)
        .catch(error =>{
            console.log("Error saving token ", error);
        })
    }


    if (loading){
        return(
            <Loading/>
        );
    }


    return(
        <View style = {[globalStyles.container, styles.centerView]}>
            <Text>Login</Text>
            <FormInput
                labelName = "Phone number"
                value = {phoneNumber}
                onChangeText = {(text) => setPhoneNumber(text)}
            />
            <FormInput
                labelName = "password"
                value = {password}
                secureTextEntry = {true}
                onChangeText = {(text) => setPassword(text)}
            />
            <SubmitButton
                buttonTitle = "Login"
                onPress = {login}
            />
        </View>
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
        alignContent: 'center'
    }
})