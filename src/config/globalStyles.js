import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window')

const globalStyles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 10
    }
})

export default globalStyles