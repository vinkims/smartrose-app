import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import LoggerUtil from './src/utils/LoggerUtil';
import NavigationService from './src/services/NavigationService';
import { RootStackNavigator } from './src/navigators/RootStackNavigator';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  LoggerUtil.logDebug("Message handled in the background", remoteMessage);
});

export default function App(){

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      LoggerUtil.logDebug("--> Notification caused app to open", remoteMessage.notification);
    });

    messaging().getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        LoggerUtil.logDebug("---> Notification caused app to open from quit state", remoteMessage.notification);
      }
    });

    messaging().onMessage(async remoteMessage => {
      LoggerUtil.logInformation("Message received", JSON.stringify(remoteMessage));
    });
  }, []);

  return(
    <NavigationContainer
        ref = {(navRef) => NavigationService.setRootNavigator(navRef)}
    >
      <RootStackNavigator/>
    </NavigationContainer>
  )
}
