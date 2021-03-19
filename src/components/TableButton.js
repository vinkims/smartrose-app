import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import globalStyles from '../config/globalStyles';

export default function TableButton({title, columnStyle, ...rest}){
    return(
        <TouchableOpacity style = {[globalStyles.tableColumn, columnStyle, styles.buttonView]} {...rest}>
            <Text style = {styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonView:{
        backgroundColor: '#77b5fe',
        borderRadius: 5,
        height: 18
    },
    text:{
        alignSelf: 'center'
    }
})