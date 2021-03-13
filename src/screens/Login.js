import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';

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

        auth().signInWithEmailAndPassword(username.trim(), password)
        .then(resp =>{
            console.log(resp)
        }).catch(error =>{
            setLoading(false)
            console.log('Error: ', error)
            ServerCommunication.firebaseErrors(error)
        })
    }


    const signUp = () =>{
        navigation.reset({
            index: 0,
            routes:[{name: 'Signup'}]
        })
    }


    if (loading){
        return(
            <Loading/>
        );
    }


    return(
        <View style = {globalStyles.container}>
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
            <TouchableOpacity style = {styles.signupView} onPress = {signUp}>
                <Text style = {styles.signupText}>No account? Click to signup</Text>
            </TouchableOpacity>
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
    }
})