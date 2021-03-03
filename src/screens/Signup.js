import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import SubmitButton from '../components/SubmitButton';
import auth from '@react-native-firebase/auth';
import FormCompleteButton from '../components/FormCompleteButton';
import ServerCommunication from '../utils/ServerCommunication';

export default function SignupScreen({navigation}){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


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
                    buttonTitle = "Signup"
                    onPress = {signUp}
                />
            )
        }
    }


    const signUp = () =>{
        setLoading(true)

        if (!username || !password){
            alert('Please enter your credentials')
            return
        }

        auth().createUserWithEmailAndPassword(username, password)
        .then(resp =>{
            console.log(resp)
        })
        .catch(error =>{
            setLoading(false)
            console.log('Error: ', error)
            ServerCommunication.firebaseErrors(error)
        })
    }


    if (loading){
        return(
            <Loading/>
        );
    }


    return(
        <View style = {styles.container}>
            <Text>Signup</Text>
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
            <FormInput
                labelName = "confirm password"
                value = {confirmPassword}
                secureTextEntry = {true}
                onChangeText = {(text) => setConfirmPassword(text)}
            />
            {
                checkPassword()
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 10
    },
    confirmText:{
        color: 'red'
    }
})