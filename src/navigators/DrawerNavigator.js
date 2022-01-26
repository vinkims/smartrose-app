import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../config/values';
import AddProductScreen from '../screens/AddProduct';
import HomeScreen from '../screens/Home';
import ViewSoldScreen from '../screens/ViewSold';
import ViewStockScreen from '../screens/ViewStock';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return(
    <Drawer.Navigator
      screenOptions = {{
        drawerActiveTintColor: colors.blueBackground,
        drawerInactiveTintColor: colors.iconGrey
      }}
    >
      <Drawer.Screen
        name = "Home"
        component = {HomeScreen}
        options = {{
          drawerIcon: ({}) => (
            <Icon name = "home-outline" size = {25} />
          )
        }}
      />
      <Drawer.Screen
        name = "Add Products"
        component = {AddProductScreen}
        options = {{
          drawerIcon: ({}) => (
            <Icon name = "briefcase-plus-outline" size = {25} />
          )
        }}
      />
      <Drawer.Screen
        name = "Stock"
        component = {ViewStockScreen}
        options = {{
          drawerIcon: ({}) => (
            <Icon name = "hanger" size = {25} />
          )
        }}
      />
      <Drawer.Screen
        name = "View Sold"
        component = {ViewSoldScreen}
        options = {{
          drawerIcon: ({}) => (
            <Icon name = "cash" size = {25} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;