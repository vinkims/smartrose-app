import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function AuthLoadingScreen({navigation}){

    useEffect(() =>{
        checkUserStatus();
    }, [])


    /**
     * Check if user is logged in or not
     */
    const checkUserStatus = () =>{
        auth().onAuthStateChanged((user) =>{
            if (user){
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Home'}]
                })
            }else{
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Login'}]
                })
            }
        })
        
    }


    return(
        <View></View>
    );
}