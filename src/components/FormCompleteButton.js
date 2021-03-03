import React from 'react';
import {TouchableOpacity, StyleSheet, Dimensions, Text, View} from 'react-native';

const {width, height} = Dimensions.get('screen');

export default function FormCompleteButton({enabled, buttonTitle, ...rest}){
    return(
        enabled ? (
            <TouchableOpacity style = {styles.enabledButton} {...rest}>
                <Text style = {styles.buttonText}>{buttonTitle}</Text>
            </TouchableOpacity>
        ) : (
            <View style = {styles.disabled}>
                <Text style = {styles.disabledText}>{buttonTitle}</Text>
            </View>
        )
    );
}

const styles = StyleSheet.create({
    enabledButton:{
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        width: width / 2,
        marginTop: 20,
        backgroundColor: '#77b5fe',
        justifyContent: 'center'
    },
    disabled: {
        borderRadius: 5,
        borderWidth: 1,
        height: 40,
        width: width / 2,
        marginTop: 20,
        borderColor: 'red',
        backgroundColor: '#77b5fe',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 16,
        color: 'black',
        alignSelf: 'center'
    }, 
    disabledText:{
        fontSize: 16,
        color: 'red',
        alignSelf: 'center'
    }
})