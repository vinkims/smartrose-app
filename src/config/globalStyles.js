import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window')

const globalStyles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 10
    },
    tableColumn:{
        flex: 1,
        paddingHorizontal: 4,
        height: 20
    },
    cardText:{
        fontSize: 10
    },
    tableColumnSeparator:{
        borderLeftWidth: 1,
        borderColor: 'gray'
    },
    tableValueColumn: {
        alignItems: 'flex-start'
    },
    tableView:{
        width: width,
        paddingTop: 10,
    },
})

export default globalStyles