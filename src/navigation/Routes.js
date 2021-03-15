import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';
import Loading from '../components/Loading';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';


export default function Routes(){
    
    const [user, setUser] = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);


    useEffect(() =>{
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [])


    /**
     * Handle user state changes
     */
    function onAuthStateChanged(user){
        setUser(user);
        if (initializing){
            setInitializing(false);
        }
        setLoading(false);
    }


    if(loading){
        return(
            <Loading/>
        )
    }


    return(
        <NavigationContainer>
            { user ? <HomeStack/> : <AuthStack/> }
        </NavigationContainer>
    )
}