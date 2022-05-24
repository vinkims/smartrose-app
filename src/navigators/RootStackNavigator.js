import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthLoadingScreen from '../navigation/AuthLoading';
import DrawerNavigator from '../navigators/DrawerNavigator';
import LoginScreen from '../screens/Login';
import SaleConfirmationScreen from '../screens/SellConfirm';

const Stack = createStackNavigator();

const RootStackNavigator = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name = "AuthLoading"
        component = {AuthLoadingScreen}
        options = {{ headerShown: false }}
      />
      <Stack.Screen
        name = "Login"
        component = {LoginScreen}
        options = {{ headerShown: false }}
      />
      <Stack.Screen
        name = "Main"
        component = {DrawerNavigator}
        options = {{ headerShown: false }}
      />
      <Stack.Screen
        name = "SaleConfirm"
        component = {SaleConfirmationScreen}
        options = {{ title: 'Confirm Sale' }}
      />
    </Stack.Navigator>
  );
}

export { RootStackNavigator };