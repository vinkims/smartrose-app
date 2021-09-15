import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, ToastAndroid, View} from 'react-native';
import Config from 'react-native-config';
import {RadioButton} from 'react-native-paper';

import FormInput from '../components/FormInput';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import RadioView from '../components/RadioView';
import ServerCommunication from '../utils/ServerCommunication';
import SubmitButton from '../components/SubmitButton';

const {width, height} = Dimensions.get('screen')

export default function SaleConfirmationScreen({route, navigation}){

  const {prodId} = route.params;

  const [category, setCategory] = useState('')
  const [clothe, setClothe] = useState('')
  const [clotheItemId, setClotheItemId] = useState(0)
  const [color, setColor] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [expPrice, setExpPrice] = useState(0)
  const [paymentChannel, setPaymentChannel] = useState(0)
  const [sellingPrice, setSellingPrice] = useState(0)
  const [size, setSize] = useState('')


  useEffect(() => {
    loadClotheItem()
  }, [])


  const loadClotheItem = async() =>{
    await ServerCommunication.get(`${Config.API_URL}/clothe/item/${prodId}`)
    .then(resp => {
      console.log(resp)
      if (resp.status === 200){
        setCategory(resp.content.category)
        setClothe(resp.content.clotheName)
        setClotheItemId(resp.content.id)
        setColor(resp.content.color)
        setDescription(resp.content.description)
        setExpPrice(resp.content.expectedSellingPrice)
        setSize(resp.content.size)
      }
    })
  }


  const sellClothe = async() => {

    if (!sellingPrice){
      alert("Please enter the selling price")
      return
    }

    let payload = {
      amount: sellingPrice,
      clotheItemId: clotheItemId,
      paymentChannelId: parseInt(paymentChannel)
    }
    console.log("Payload: ", payload)

    setLoading(true)
    await ServerCommunication.post(`${Config.API_URL}/sale`, payload)
    .then(resp => {
      console.log(resp)
      if (resp.status === 201){
        setLoading(false)
        ToastAndroid.show("Product sold successfully", ToastAndroid.SHORT)
      }
    }).catch(error => {
      setLoading(false)
      console.log(error)
      alert("Error saving sale details")
    })
  }


  if (loading){
    return(<Loading/>);
  }


  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        <FormInput
          labelName = "Clothe"
          value = {clothe}
        />
        <FormInput
          labelName = "Description"
          value = {description}
        />
        <FormInput
          labelName = "Category"
          value = {category}
        />
        <FormInput
          labelName = "Color"
          value = {color}
        />
        <FormInput
          labelName = "Size"
          value = {size}
        />
        <FormInput
          labelName = "Set price"
          value = {JSON.stringify(expPrice)}
        />
        <FormInput
          labelName = "Selling Price"
          value = {sellingPrice}
          onChangeText = {(number) => setSellingPrice(number)}
          keyboardType = "numeric"
        />

        <RadioButton.Group
          onValueChange = {value => setPaymentChannel(value)}
          value = {paymentChannel}
        >
          <View style = {styles.radioButtons}>
            <RadioView val = "1" text = "cash"/>
            <RadioView val = "2" text = "m-pesa"/>
            <RadioView val = "3" text = "equity"/>
          </View>
        </RadioButton.Group>
        
        <SubmitButton
          buttonTitle = "Submit"
          onPress = {sellClothe}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  radioButtons:{
    flexDirection: 'row',
    paddingTop: 10
  }
})