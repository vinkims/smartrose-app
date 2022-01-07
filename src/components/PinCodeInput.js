import React from "react";
import { StyleSheet, Text, View} from 'react-native';
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

import { colors } from "../config/values";

export default function PinCodeInput({ descText, errorText, ...rest}){
  return(
    <View style = {styles.pinView}>
      <Text style = {styles.descText}>{descText}</Text>
      <SmoothPinCodeInput
        cellStyle = {{
          backgroundColor: colors.white,
          borderColor: colors.borderGrey,
          borderRadius: 4,
          borderWidth: 1,
          height: 50,
          width: 50
        }}
        {...rest}
      />
      <Text style = {styles.required}>{errorText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  descText: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 13
  },
  pinView: {
    marginTop: 25
  },
  required: {
    alignSelf: 'flex-start',
    color: colors.red,
    fontSize: 11
  }
});