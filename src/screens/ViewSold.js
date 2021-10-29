import React, {useEffect, useState} from "react";
import {ActivityIndicator, BackHandler ,Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from "react-native-config";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from "react-native-orientation-locker";

import FormattingUtil from "../utils/FormattingUtil";
import globalStyles from "../config/globalStyles";
import Loading from "../components/Loading";
import ServerCommunication from "../utils/ServerCommunication";
import TableColumn from "../components/TableColumn";

const {width, height} = Dimensions.get('screen');

export default function ViewSoldScreen({}){

  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadSummary, setLoadSummary] = useState(false);
  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [soldItems, setSoldItems] = useState([]);
  const [totalBP, setTotalBP] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSP, setTotalSP] = useState(0);

  useEffect(() => {
    loadSold()
  }, [])

  useEffect(() => {
    Orientation.lockToLandscape()
  })

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      () => Orientation.lockToPortrait()
    )
  })

  const getSaleSummary = async() => {
    
    const start = FormattingUtil.formatServerDate(startDate.toISOString())
    const end = FormattingUtil.formatServerDate(endDate.toISOString())

    setLoadSummary(true)
    await ServerCommunication.get(`${Config.API_URL}/sale/summary?startDate=${start}_00:00&endDate=${end}_23:59`)
    .then(resp => {
      console.log("Summary: ", resp.content.saleRange)
      console.log("Transaction summary: ", resp.content.transactionSummary)
      if (resp.status === 200){
        setSoldItems(resp.content.saleRange)
        setLoadSummary(false)
        resp.content.transactionSummary.map( i =>{
          setTotalBP(i.totalBuyingPrice)
          setTotalProfit(i.totalProfit)
          setTotalSP(i.totalSellingPrice)
        })
      }
    }).catch(error => {
      console.log(error)
      alert("Error fetching sale details")
    })
  }

  const loadSold = async() => {
    setLoading(true)
    await ServerCommunication.get(`${Config.API_URL}/sale?pgSize=1000`)
    .then(resp => {
      console.log(resp.content.data)
      if (resp.status === 200 && resp.content.data.length){
        setSoldItems(resp.content.data)
        setLoading(false)
      }else{
        setLoading(false)
        alert('No products found')
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

  if (loading){
    return( <Loading/> );
  }

  return(
    <View style = {globalStyles.container}>
      <View style = {styles.dateSelectView}>
        <View>
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
        </View>
        <View style = {styles.transactionView}>
          <Text>Total buying price: {totalBP}</Text>
          <Text>Total selling price: {totalSP}</Text>
          <Text>Total profit: {totalProfit}</Text>
        </View>
      </View>

      <ScrollView style = {styles.table}>

        {open &&
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

        <Card>
          <CardItem cardBody>
            <TableColumn
              cText = "DATE SOLD"
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "NAME"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "DESC"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "SIZE"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "SELLER"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "ORDER"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "BP - SP"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "PROFIT"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
          </CardItem>
          {
            soldItems.map((item, index) =>
              <CardItem style = {styles.tableRow} key = {index} cardBody>
                <TableColumn
                  cText = {FormattingUtil.formatDate(item.dateSold)}
                  columnStyle = {globalStyles.tableValueColumn}
                />
                <TableColumn
                  cText = {item.clotheDetails.name}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.clotheDetails.description}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.clotheDetails.size}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.user}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.saleType}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.clotheDetails.buyingPrice + '   ' + item.sellingPrice}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.profit}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
              </CardItem>
            )
          }
        </Card>
        <View style = {globalStyles.tableEnd}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer:{
    flexDirection: 'row'
  },
  dateSelectView:{
    flexDirection: 'row',
    width : width * 1.5
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
  searchView:{
    height: 25,
    width: 25
  },
  table:{
    height: height * 0.3,
    paddingTop: 10,
    width: width * 1.5
  },
  tableRow:{
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  transactionView:{
    paddingLeft: 20
  }
})