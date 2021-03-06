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

import LoginScreen from './src/screens/Login';
import AuthLoadingScreen from './src/navigation/AuthLoading';
import SignupScreen from './src/screens/Signup';
import HomeScreen from './src/screens/Home';

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
                />
                <Stack.Screen
                    name = 'Home'
                    component = {HomeScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

