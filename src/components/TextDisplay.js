import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

const {width, height} = Dimensions.get('screen');

export default function TextDisplay({heading, content}){
  return(
    <View style = {styles.containerView}>
      <Text style = {styles.headingText}>{heading}</Text>
      <View style = {styles.contentView}>
        <Text>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerView:{
    alignItems: 'center',
    height: 60,
    width: width / 2,
    marginHorizontal: 2.5
  },
  contentView:{
    alignItems: 'center',
    backgroundColor: "#D8D8D8",
    height: 35,
    justifyContent: 'center',
    width: width / 2.5
  },
  headingText:{
    alignSelf: 'center',
    fontSize: 10,
    fontWeight: 'bold'
  }
})