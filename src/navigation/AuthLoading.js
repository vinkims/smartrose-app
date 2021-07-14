import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';

export default function AuthLoadingScreen({navigation}){

    useEffect(() =>{
        checkUserStatus();
    }, [])


    /**
     * Check if user is logged in or not
     */
    const checkUserStatus = () =>{

        AsyncStorage.getItem("token")
        .then(value =>{
            if(value != null){
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Home'}]
                })
            }else {
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Login'}]
                })
            }
        })
        
    }


    return(
        <Loading/>
    );
}