import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import Config from 'react-native-config';

import HomeButton from '../components/HomeButton';
import ActionButton from '../components/ActionButton';
import Loading from '../components/Loading';
import globalStyles from '../config/globalStyles';
import ServerCommunication from '../utils/ServerCommunication';

export default function HomeScreen({navigation}){

    const [admin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState('');

    useEffect(() =>{
        checkTokenValidity()
    }, [])

    const addProduct = () =>{
        navigation.navigate('AddProduct')
    }

    const sellProduct = () =>{
        navigation.navigate('SellProduct')
    }

    const signup = () =>{
        navigation.navigate('Signup')
    }

    const viewStock = () =>{
        navigation.navigate('ViewStock')
    }

    const viewSold = () => {
        navigation.navigate('ViewSold')
    }

    const viewTransactions = () =>{
        navigation.navigate('Transactions');
    }

    const checkTokenValidity = async() =>{

        let token = await AsyncStorage.getItem("token")
        var dateNow = new Date()
        let decoded = jwt_decode(token)
        
        if (decoded.role === "system-admin"){
            setAdmin(true)
        }

        saveUserId(decoded.userId)
        setUser(decoded.firstName)

        if (decoded.exp * 1000 < dateNow.getTime()){
            console.log("Token expired")
            removeToken()
        }else{
            console.log("Valid token")
        }
    }

    const logout = async() =>{
        setLoading(true)

        let token = await AsyncStorage.getItem("token");
        let decoded = jwt_decode(token)
        let userId = decoded.userId

        let payload = {
            token: token,
            userId: userId
        }


        await ServerCommunication.post(`${Config.API_URL}/user/auth/sign-out`, payload)
        .then(result =>{
            console.log("Signout result", result)
            if(result.status === 200){
                console.log('Signout success')
                removeToken()
            } else if (result.validationError.errors){
                console.log(result.validationError.errors)
                removeToken()
            }
        })
        .catch(error =>{
            console.log('Failed to signout', error)
            removeToken()
        })
    }

    const removeToken = () =>{
        AsyncStorage.clear()
        .then(navigation.reset({
            index: 0,
            routes: [{name: 'Login'}]
        }))
    }

    const saveUserId = async(userId) =>{
        await AsyncStorage.setItem("userId", JSON.stringify(userId))
        .catch(error => {
            console.log("Error saving userId", error)
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
            <Text style = {styles.welcomeText}>Welcome, {user}</Text>
            {
                admin ? (
                    <View style = {styles.buttonView}>
                        <HomeButton
                            iconName = "briefcase-plus-outline"
                            buttonTitle = "Add Product"
                            onPress = {addProduct}
                        />
                        <HomeButton
                            iconName = "briefcase-minus-outline"
                            buttonTitle = "Sell Product"
                            onPress = {sellProduct}
                        />
                        <HomeButton
                            iconName = "hanger"
                            buttonTitle = "View Stock"
                            onPress = {viewStock}
                        />
                        <HomeButton
                            iconName = "cash"
                            buttonTitle = "View Sold"
                            onPress = {viewSold}
                        />
                        <HomeButton
                            iconName = "file-document-outline"
                            buttonTitle = "View Transactions"
                            onPress = {viewTransactions}
                        />
                    </View>
                ) : (
                    <View>
                        <HomeButton
                            iconName = "briefcase-minus-outline"
                            buttonTitle = "Sell Product"
                            onPress = {sellProduct}
                        />
                        <HomeButton
                            iconName = "hanger"
                            buttonTitle = "View Stock"
                            onPress = {viewStock}
                        />
                        <HomeButton
                            iconName = "cash"
                            buttonTitle = "View Sold"
                            onPress = {viewSold}
                        />
                    </View>
                )
            }

            <ActionButton
                iconName = "logout" 
                buttonTitle = "Logout" 
                buttonColor = "#ff0000" 
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
