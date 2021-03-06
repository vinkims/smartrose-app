import React from 'react';
import {Text, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('screen');

export default function ActionButton({buttonColor, iconName, buttonTitle, ...rest}){
    return(
        <TouchableOpacity style = {styles.buttonView} {...rest}>
            <MaterialCommunityIcons name = {iconName} size = {20} color = {buttonColor} />
            <Text style = {[styles.text, {color : buttonColor}]}>{buttonTitle}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonView:{
        flexDirection: 'row',
        marginTop: 40
    },
    text:{
        fontSize: 15,
        paddingLeft: 5
    }
})