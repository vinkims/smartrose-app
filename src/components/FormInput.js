import React from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export default function FormInput({labelName, ...rest}){
    return(
        <View style = {styles.formView}>
            <TextInput
                placeholder = {labelName}
                style = {styles.textInput}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    formView:{
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#696969',
        height: 40,
        width: width / 1.5,
        marginTop: 10
    },
    textInput:{
        width: width / 1.5,
        height: 40,
    }
})