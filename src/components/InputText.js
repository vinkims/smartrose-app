import React from "react";
import { StyleSheet, View} from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { colors } from "../config/values";

export default function InputText({error, errorText, label, showHelper, ...rest}){
  return(
    <View style = {styles.textView}>
      <TextInput
        error = {error}
        label = {label}
        mode = "outlined"
        style = {styles.input}
        {...rest}
      />
      <HelperText type = "error" visible = {showHelper}>
        {errorText}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white
  },
  textView: {
    height: 40,
    marginBottom: 20
  }
});