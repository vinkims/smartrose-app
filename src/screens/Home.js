import React, {useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

import SubmitButton from '../components/SubmitButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeButton from '../components/HomeButton';
import ActionButton from '../components/ActionButton';
import globalStyles from '../config/globalStyles';
import DatabaseUtil from '../utils/DatabaseUtil';

export default function HomeScreen({navigation}){

    useEffect(() =>{
        DatabaseUtil.initDB()
    }, [])

    const addProduct = () =>{
        navigation.navigate('AddProduct')
    }

    const sellProduct = () =>{
        navigation.navigate('SellProduct')
    }

    const viewStock = () =>{
        navigation.navigate('ViewStock')
    }

    const logout = () =>{
        auth().signOut()
    }

    return(
        <View style = {globalStyles.container}>
            <Text>Home</Text>
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
                    iconName = "file-document-outline"
                    buttonTitle = "View Transactions"
                />
            </View>
            <ActionButton
                iconName = "logout" 
                buttonTitle = "Logout" 
                buttonColor = "#ff0000" 
                onPress = {logout}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 10
    },
    buttonView:{
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})
