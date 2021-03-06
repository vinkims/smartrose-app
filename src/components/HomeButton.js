import React from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const {width, height} = Dimensions.get('screen')

export default function HomeButton({iconName, buttonTitle, ...rest}){
    return(
        <TouchableOpacity style = {styles.buttonView} {...rest}>
            <MaterialCommunityIcons name = {iconName} size = {80} color = {'#a7fc00'} />
            <Text style = {styles.text}>{buttonTitle}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonView:{
        borderRadius:5,
        borderColor: '#bfc1c2',
        borderWidth: 1,
        width: width / 3,
        height: width / 3,
        alignItems:'center',
        justifyContent: 'center',
        margin: 20
    },
    text:{
        fontSize: 15,
        paddingTop:5
    }
})