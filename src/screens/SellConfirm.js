import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {RadioButton} from 'react-native-paper';

import FormInput from '../components/FormInput';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import RadioView from '../components/RadioView';
import ServerCommunication from '../utils/ServerCommunication';
import SubmitButton from '../components/SubmitButton';
import TextDisplay from '../components/TextDisplay';

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
  const [paymentChannel, setPaymentChannel] = useState('')
  const [reference, setReference] = useState('')
  const [saleType, setSaleType] = useState('')
  const [sellingPrice, setSellingPrice] = useState(0)
  const [size, setSize] = useState('')
  const [userId, setUserId] = useState(0)


  useEffect(() => {
    loadClotheItem()
  }, [])

  useEffect(() => {
    getUser()
  }, [])


  const addReference = () =>{
    if (paymentChannel === '1'){
      return(
        <View/>
      )
    }else{
      return(
        <View>
          <Text style = {styles.priceText}>REFERENCE</Text>
          <FormInput
            labelName = "Reference"
            onChangeText = {(text) => setReference(text)}
            value = {reference}
          />
        </View>
      )
    }
  }
  
  const getUser = async() =>{
    
    let id = await AsyncStorage.getItem("userId")
    console.log("UserId", id)
    if (userId == null){
      return
    }
    setUserId(parseInt(id))
  }

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

    if (!sellingPrice || !paymentChannel || !saleType){
      alert("Please fill the all details")
      return
    }

    let payload = {
      amount: sellingPrice,
      clotheItemId: clotheItemId,
      paymentChannelId: parseInt(paymentChannel),
      reference: reference,
      saleTypeId: parseInt(saleType),
      userId: userId
    }
    console.log("Payload: ", payload)

    setLoading(true)
    await ServerCommunication.post(`${Config.API_URL}/sale`, payload)
    .then(resp => {
      console.log(resp)
      if (resp.status === 201){
        setLoading(false)
        ToastAndroid.show("Product sold successfully", ToastAndroid.SHORT)
        navigation.navigate('SellProduct')
      }
    }).catch(error => {
      setLoading(false)
      console.log("SellConfirm.sellClothe() error: ", error)
      ToastAndroid.show("Error selling item", ToastAndroid.LONG);
    })
  }


  if (loading){
    return(<Loading/>);
  }


  return(
    <ScrollView style = {{paddingTop: 20}}>
      <View style = {globalStyles.container}>
        <View style = {styles.detailsView}>
          <TextDisplay
            heading = "DESC"
            content = {description}
          />
          <TextDisplay
            heading = "CLOTHE"
            content = {clothe}
          />
        </View>

        <View style = {styles.detailsView}>
          <TextDisplay
            heading = "CATEGORY"
            content = {category}
          />
          <TextDisplay
            heading = "SIZE"
            content = {size}
          />
        </View>

        <View style = {styles.detailsView}>
          <TextDisplay
            heading = "COLOR"
            content = {color}
          />
          <TextDisplay
            heading = "SET SELLING PRICE"
            content = {expPrice}
          />
        </View>

        <RadioButton.Group
          onValueChange = {val => setSaleType(val)}
          value = {saleType}
        >
          <View style = {styles.radioButtons}>
            <RadioView val = "1" text = "shop-sale" />
            <RadioView val = "2" text = "online-order" />
          </View>
        </RadioButton.Group>
        
        <View>
          <Text style = {styles.priceText}>Enter selling price</Text>
          <FormInput
            labelName = "Selling Price"
            value = {sellingPrice}
            onChangeText = {(number) => setSellingPrice(number)}
            keyboardType = "numeric"
          />
        </View>

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

        {
          addReference()
        }
        
        <SubmitButton
          buttonTitle = "Submit"
          onPress = {sellClothe}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  detailsView:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingLeft: 10
  },
  priceText:{
    fontSize: 12
  },
  priceView: {
    marginTop: 20
  },
  radioButtons:{
    flexDirection: 'row',
    paddingTop: 10
  }
})