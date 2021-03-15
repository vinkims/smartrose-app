import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from '../screens/Signup';
import LoginScreen from '../screens/Login';

const Stack = createStackNavigator();

export default function AuthStack(){
    return(
        <Stack.Navigator initialRouteName = 'Login'>
            <Stack.Screen
                name = "Login"
                component = {LoginScreen}
            />
            <Stack.Screen
                name = "Signup"
                component = {SignupScreen}
            />
        </Stack.Navigator>
    );
}