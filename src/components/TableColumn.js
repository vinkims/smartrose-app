import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import globalStyles from '../config/globalStyles';

export default function TableColumn({columnStyle, cText, textStyle}){
    return(
        <View style = {[globalStyles.tableColumn, columnStyle]}>
            <Text style = {[globalStyles.cardText, textStyle]}>{cText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tableColumnHeading:{
        flex: 1,
        paddingHorizontal: 4
    },
    cardText: {
        fontSize: 12
    }
})