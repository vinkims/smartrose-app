import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import SubmitButton from '../components/SubmitButton';
import ServerCommunication from '../utils/ServerCommunication';
import globalStyles from '../config/globalStyles';

const {width, height} = Dimensions.get('screen');

export default function LoginScreen({navigation}){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const login = () =>{
        setLoading(true)

        if (!username || !password){
            alert('Please enter credentials')
            return
        }

        checkCredentials();
    }


    const signUp = () =>{
        navigation.reset({
            index: 0,
            routes:[{name: 'Signup'}]
        })
    }


    const checkCredentials = async () =>{
        const userDetails = {
            userContact: username.trim(),
            password: password.trim()
        }

        await ServerCommunication.postNoAuth(`${Config.API_URL}/user/auth`, userDetails)
        .then(resp =>{
            if (resp.status === 200){
                saveToken(resp.content.token)
                navigation.reset({
                    index : 0,
                    routes:[{name: 'Home'}]
                })
            } else if (resp.validationError.errors){
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

        setLoading(false);
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
                labelName = "username"
                value = {username}
                onChangeText = {(text) => setUsername(text)}
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
            {/*<TouchableOpacity style = {styles.signupView} onPress = {signUp}>
                <Text style = {styles.signupText}>No account? Click to signup</Text>
            </TouchableOpacity>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 10
    },
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