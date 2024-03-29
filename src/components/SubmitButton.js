import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

import { colors } from '../config/values';

const {width, height} = Dimensions.get('screen');

export default function SubmitButton({buttonTitle, ...rest}){
  return(
    <TouchableOpacity style = {styles.buttonView} {...rest}>
      <Text style = {styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonView:{
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    width: width / 2,
    marginTop:20,
    backgroundColor: colors.blueBackground,
    justifyContent: 'center'
  },
  buttonText:{
    fontSize:16,
    color: 'black',
    alignSelf: 'center'
  }
})