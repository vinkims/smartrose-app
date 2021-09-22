/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import AuthLoadingScreen from './src/navigation/AuthLoading';
import AddProductScreen from './src/screens/AddProduct';
import HomeScreen from './src/screens/Home';
import LoginScreen from './src/screens/Login';
import SaleConfirmationScreen from './src/screens/SellConfirm';
import SellProductScreen from './src/screens/SellProduct';
import SignupScreen from './src/screens/Signup';
import Transactions from './src/screens/Transactions';
import ViewSoldScreen from './src/screens/ViewSold';
import ViewStockScreen from './src/screens/ViewStock';

const Stack = createStackNavigator();

export default function App(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name = 'AuthLoading'
                    component = {AuthLoadingScreen}
                    options = {{headerShown: false}}
                />
                <Stack.Screen
                    name = 'Login'
                    component = {LoginScreen}
                />
                <Stack.Screen
                    name = 'Signup'
                    component = {SignupScreen}
                    options = {{title: 'Add User'}}
                />
                <Stack.Screen
                    name = 'Home'
                    component = {HomeScreen}
                />
                <Stack.Screen
                    name = 'AddProduct'
                    component = {AddProductScreen}
                    options = {{title: 'Add Product'}}
                />
                <Stack.Screen
                    name = 'SellProduct'
                    component = {SellProductScreen}
                    options = {{title: 'Sell Product'}}
                />
                <Stack.Screen
                    name = 'ViewStock'
                    component = {ViewStockScreen}
                    options = {{title: 'Stock'}}
                />
                <Stack.Screen
                    name = 'Transactions'
                    component = {Transactions}
                />
                <Stack.Screen
                    name = 'SaleConfirm'
                    component = {SaleConfirmationScreen}
                />
                <Stack.Screen
                    name = 'ViewSold'
                    component = {ViewSoldScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

