import React, { useEffect, useState } from "react";
import {ActivityIndicator ,Dimensions, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';

import { colors } from "../config/values";
import FormattingUtil from "../utils/FormattingUtil";
import globalStyles from "../config/globalStyles";
import Loading from "../components/Loading";
import Logger from "../utils/LoggerUtil";
import ServerCommunication from "../utils/ServerCommunication";

const {width, height} = Dimensions.get('screen');

var aws = require('aws-sdk');

export default function ViewSoldScreen({navigation}){

  const [ endDate, setEndDate ] = useState(new Date());
  const [ loading, setLoading ] = useState(false);
  const [ loadSummary, setLoadSummary ] = useState(false);
  const [ open, setOpen ] = useState(false);
  const [ openEnd, setOpenEnd ] = useState(false);
  const [ soldItems, setSoldItems ] = useState([]);
  const [ startDate, setStartDate ] = useState(new Date());
  const [ totalBP, setTotalBP ] = useState(0);
  const [ totalProfit, setTotalProfit ] = useState(0);
  const [ totalSP, setTotalSP ] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSold();
    })
    return unsubscribe;
  }, [navigation])

  const getSaleSummary = async() => {
    
    const start = FormattingUtil.formatServerDate(startDate.toISOString()) + "_00:00";
    const end = FormattingUtil.formatServerDate(endDate.toISOString()) + "_23:59";
    let param = `?startDate=${start}&endDate=${end}`;

    setLoadSummary(true)
    await ServerCommunication.getSaleSummary(param)
    .then(resp => {
      Logger.logDebug("Summary: ", resp.content.saleRange);
      Logger.logDebug("Transaction summary: ", resp.content.transactionSummary);
      if (resp.status === 200){
        setSoldItems(resp.content.saleRange);
        setLoadSummary(false);
        resp.content.transactionSummary.map( i =>{
          setTotalBP(i.totalBuyingPrice);
          setTotalProfit(i.totalProfit);
          setTotalSP(i.totalSellingPrice);
        })
      }
    }).catch(error => {
      setLoadSummary(false);
      Logger.logError("ViewSold.getSaleSummary", error);
      ToastAndroid.show("Error fetching sale details", ToastAndroid.LONG);
    })
  }

  const loadSold = async() => {
    setLoading(true);
    await ServerCommunication.getSoldClothes()
    .then(resp => {
      Logger.logDebug(resp.content.data);
      if (resp.status === 200 && resp.content.data.length){
        setSoldItems(resp.content.data);
        setLoading(false);
      }else{
        setLoading(false);
        ToastAndroid.show("No sold clothes found", ToastAndroid.LONG);
      }
    })
  }

  const selectEndDate = (event, selectedEndDate) => {
    const currentDate = selectedEndDate || endDate;
    console.log("End date: ", currentDate)
    setEndDate(currentDate)
    setOpenEnd(false)
  }

  const selectStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    console.log("Current date", currentDate)
    setStartDate(currentDate)
    setOpen(false)
  }

  const renderClothe = (cl) => {
    let signedUrl;
    var s3 = new aws.S3({
      accessKeyId: Config.AWS_ACCESS_KEY_ID, 
      secretAccessKey: Config.AWS_SECRET_ACCESS_KEY, 
      region:'us-east-1',
      signatureVersion: "v4"
    });
    if (typeof cl.clotheDetails.image !== 'undefined') {
      if (Object.keys(cl.clotheDetails.image).length > 0) {
        var params = {Bucket: 'smartrose', Key: `images/${cl.clotheDetails.image.name}`};
        signedUrl = s3.getSignedUrl('getObject', params);
      }
    }

    return(
      <View style = {styles.clotheView}>
        {
          typeof signedUrl === 'undefined' ?
          <Image
            source = {require('../resources/images/clothes.jpg')}
            style = {styles.image}
          />
          :
          <Image
            source = {{uri: signedUrl}}
            style = {styles.image}
          />
        }
        <View style = {styles.soldDateView}>
          <Text style = {[styles.boldText, styles.soldText]}>{FormattingUtil.formatDate(cl.dateSold)}</Text>
          <View style = {styles.priceView}>
            <Text style = {styles.soldText}>B.P: </Text>
            <Text style = {[styles.boldText, styles.soldText]}>{cl.clotheDetails.buyingPrice}</Text>
            <Text style = {styles.soldText}>  S.P: </Text>
            <Text style = {[styles.boldText, styles.soldText]}>{cl.sellingPrice}</Text>
          </View>
          <View style = {styles.priceView}>
            <Text style = {styles.soldText}>Profit: </Text>
            <Text style = {[styles.boldText, styles.soldText]}>{cl.profit}</Text>
          </View>
          <Text style = {styles.soldText}>Seller: {cl.user}</Text>
        </View>
        <View style = {styles.soldDateView}>
          <Text style = {styles.soldText}>{cl.clotheDetails.name} {cl.clotheDetails.description}</Text>
          <View style = {styles.priceView}>
            <Text style = {styles.soldText}>Size: </Text>
            <Text style = {[styles.soldText, styles.boldText]}>{cl.clotheDetails.size}</Text>
          </View>
          <View style = {styles.priceView}>
            <Text style = {styles.soldText}>Color: </Text>
            <Text style = {[styles.soldText, styles.boldText]}>{cl.clotheDetails.color}</Text>
          </View>
          <Text style = {styles.soldText}>Category: {cl.clotheDetails.category}</Text>
        </View>
      </View>
    );
  }

  if (loading){
    return( <Loading/> );
  }

  return(
    <View style = {globalStyles.container}>
      <View style = {styles.dateSelectView}>
        <Text>Click to select dates to view</Text>
        <View style = {styles.dateContainer}>
          <TouchableOpacity onPress = {() => setOpen(true)} style = {styles.dateView}>
            <Text style = {styles.dateText}>{FormattingUtil.formatDate(startDate.toISOString())}</Text>
          </TouchableOpacity>
          <Text>to</Text>
          <TouchableOpacity onPress = {() => setOpenEnd(true)} style = {styles.dateView}>
            <Text style = {styles.dateText}>{FormattingUtil.formatDate(endDate.toISOString())}</Text>
          </TouchableOpacity>
          {
            loadSummary ? (
              <View>
                <ActivityIndicator
                  color = "red"
                  size = "small"
                />
              </View>
            ) : (<TouchableOpacity style = {styles.searchView} onPress = {getSaleSummary}>
              <MaterialCommunityIcons name = "magnify" color = "red" size = {20} />
            </TouchableOpacity>
            )
          }
        </View>
        <View style = {styles.transactionView}>
          <Text>Total B.P: {totalBP}</Text>
          <Text>    S.P: {totalSP}</Text>
          <Text>    Profit: {totalProfit}</Text>
        </View>
      </View>
      <View style = {styles.clotheScroll}>
        <ScrollView style = {styles.scrollView}>
          {
            soldItems.map(i => renderClothe(i))
          }
        </ScrollView>
        <View style = {styles.scrollEnd}/>
      </View>

      {
        open &&
        <DateTimePicker
          value = {startDate}
          mode = "date"
          display = "calendar"
          onChange = {selectStartDate}
        />
      }

      {
        openEnd && 
        <DateTimePicker
          value = {endDate}
          mode = "date"
          display = "calendar"
          onChange = {selectEndDate}
        />
      }

    </View>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold'
  },
  clotheScroll: {
    height: height * 0.7
  },
  clotheView: {
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    elevation: 5,
    flexDirection: 'row',
    height: 70,
    marginTop: 10,
    width: width / 1.05
  },
  dateContainer:{
    flexDirection: 'row'
  },
  dateSelectView:{
    width : width / 1.1
  },
  dateText:{
    alignSelf: 'center'
  },
  dateView:{
    borderColor: '#696969',
    borderRadius: 5,
    borderWidth: 1,
    height: 25,
    marginHorizontal: 10,
    width : width * 0.25
  },
  headingText:{
    fontWeight: 'bold'
  },
  image: {
    borderRadius: 10,
    height: 70,
    width: 70
  },
  priceView: {
    flexDirection: 'row'
  },
  scrollEnd: {
    marginTop: 10
  },
  scrollView: {
    flexGrow: 0
  },
  searchView:{
    height: 25,
    width: 25
  },
  soldDateView: {
    marginLeft: 20
  },
  soldText: {
    fontSize: 12
  },
  transactionView:{
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
  }
})