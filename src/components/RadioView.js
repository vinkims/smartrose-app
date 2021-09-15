import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';

export default function RadioView({val, text}){
    return(
        <View style = {styles.radioView}>
            <RadioButton value = {val}/>
            <Text>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    radioView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10
    }
})