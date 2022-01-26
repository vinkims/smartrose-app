import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import NavigationService from './src/services/NavigationService';
import { RootStackNavigator } from './src/navigators/RootStackNavigator';

export default function App(){
  return(
    <NavigationContainer
        ref = {(navRef) => NavigationService.setRootNavigator(navRef)}
    >
      <RootStackNavigator/>
    </NavigationContainer>
  )
}
