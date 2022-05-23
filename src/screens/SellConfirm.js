import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import Config from 'react-native-config';
import { RadioButton } from 'react-native-paper';

import globalStyles from '../config/globalStyles';
import InputText from '../components/InputText';
import Loading from '../components/Loading';
import Logger from '../utils/LoggerUtil';
import RadioView from '../components/RadioView';
import ServerCommunication from '../utils/ServerCommunication';
import StorageUtil from '../utils/StorageUtil';
import SubmitButton from '../components/SubmitButton';
import TextDisplay from '../components/TextDisplay';
import { values } from '../config/values';

const { width, height } = Dimensions.get('screen');

export default function SaleConfirmationScreen({route, navigation}){

  const { prodId, signed } = route.params;

  const [ category, setCategory ] = useState('');
  const [ clothe, setClothe ] = useState('');
  const [ clotheItemId, setClotheItemId ] = useState(0);
  const [ color, setColor ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ imageUrl, setImageUrl ] = useState('');
  const [ isPriceError, setIsPriceError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ expPrice, setExpPrice ] = useState(0);
  const [ paymentChannel, setPaymentChannel ] = useState(1);
  const [ paymentChannels, setPaymentChannels ] = useState(values.paymentChannels);
  const [ reference, setReference ] = useState('');
  const [ saleType, setSaleType ] = useState(1);
  const [ saleTypes, setSaleTypes ] = useState(values.saleTypes);
  const [ sellingPrice, setSellingPrice ] = useState('');
  const [ sellingPriceError, setSellingPriceError ] = useState('');
  const [ size, setSize ] = useState('');
  const [ userId, setUserId ] = useState(0);

  useEffect(() => {
    loadClotheItem()
  }, [])

  useEffect(() => {
    getUser()
  }, [])
  
  const getUser = async() =>{
    let id = await StorageUtil.getUserId();
    Logger.logInformation("User id", id);
    setUserId(parseInt(id));
  }

  const loadClotheItem = async() =>{
    await ServerCommunication.get(`${Config.API_URL}/clothe/item/${prodId}`)
    .then(resp => {
      if (resp.status === 200){
        setCategory(resp.content.category);
        setClothe(resp.content.clotheName);
        setClotheItemId(resp.content.id);
        setColor(resp.content.color);
        setDescription(resp.content.description);
        setExpPrice(resp.content.expectedSellingPrice);
        setSize(resp.content.size);
        if (Object.keys(resp.content.image).length > 0) {
          setImageUrl(signed);
        }
      }
    })
  }

  const sellClothe = async() => {

    if (!sellingPrice){
      setIsPriceError(true);
      setSellingPriceError("Enter selling price");
      return;
    }

    let payload = {
      amount: parseFloat(sellingPrice),
      clotheItemId: clotheItemId,
      paymentChannelId: paymentChannel,
      reference: reference,
      saleTypeId: saleType,
      userId: userId
    }
    Logger.logDebug("Payload: ", payload);

    setLoading(true)
    await ServerCommunication.post(`${Config.API_URL}/sale`, payload)
    .then(resp => {
      if (resp.status === 201){
        setLoading(false);
        ToastAndroid.show("Product sold successfully", ToastAndroid.SHORT);
        navigation.goBack();
      }
    }).catch(error => {
      setLoading(false);
      Logger.logError("SellConfirm.sellClothe", error);
      ToastAndroid.show("Error selling item", ToastAndroid.LONG);
    })
  }

  if (loading){
    return(<Loading/>);
  }

  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        {
          !imageUrl ?
          <Image
            source = {require('../resources/images/clothes.jpg')}
            style = {styles.image}
          />
          :
          <Image
            source = {{uri: imageUrl}}
            style = {styles.image}
          />
        }
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

        <View style = {styles.sellView}>
          <Text>Select sale type</Text>
          <RadioButton.Group
            onValueChange = {val => setSaleType(val)}
            value = {saleType}
          >
            <View style = {styles.radioButtons}>
              {
                saleTypes.map(i => 
                  <RadioView val = {i.value} text = {i.label} />
                )
              }
            </View>
          </RadioButton.Group>
          
          <InputText
            error = {isPriceError}
            errorText = {sellingPriceError}
            keyboardType = "numeric"
            label = "Selling Price"
            onFocus = {() => setIsPriceError(false)}
            onChangeText = {(text) => setSellingPrice(text)}
            placeholder = "e.g 1000"
            showHelper = {isPriceError}
            value = {sellingPrice}
            width = {width / 1.4}
          />
          <View style = {styles.spaceView}/>
          <View style = {styles.spaceView}/>
          <Text>Select payment channel</Text>
          <RadioButton.Group
            onValueChange = {value => setPaymentChannel(value)}
            value = {paymentChannel}
          >
            <View style = {styles.radioButtons}>
              {
                paymentChannels.map(i =>
                  <RadioView val = {i.value} text = {i.label} />
                )
              }
            </View>
          </RadioButton.Group>
          {
            paymentChannel !== 1 &&
            <InputText
              label = "Reference"
              onChangeText = {(text) => setReference(text)}
              placeholder = "e.g M7Y75HO0T"
              value = {reference}
              width = {width / 1.4}
            />
          }
        </View>
        
        <SubmitButton
          buttonTitle = "Sell"
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
  image: {
    height: width / 3,
    margin: 10,
    width: width / 3
  },
  priceText:{
    fontSize: 12
  },
  priceView: {
    marginTop: 20
  },
  radioButtons:{
    flexDirection: 'row'
  },
  sellView: {
    justifyContent: 'flex-start',
    marginTop: 10,
    width: width / 1.3
  },
  spaceView: {
    marginTop: 10
  }
})