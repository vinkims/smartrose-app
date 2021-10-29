import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from 'react-native-config';

import DropDown from '../components/DropDown';
import FormattingUtil from '../utils/FormattingUtil';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import ServerCommunication from '../utils/ServerCommunication';
import TableColumn from '../components/TableColumn';
import { values } from '../config/values';

const {width, height} = Dimensions.get('screen');

export default function Transactions(){

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState(values.transactions);


  useEffect(() => {
    loadTransactions()
  }, [])


  const loadTransactions = async() => {
    setLoading(true);
    await ServerCommunication.get(`${Config.API_URL}/transaction?pgSize=1000`)
    .then(resp => {
      if (resp.status === 200){
        setLoading(false);
        setTransactions(resp.content.data);
      }
    })
  }

  const selectTransactionType = async(val) =>{
    await ServerCommunication.get(`${Config.API_URL}/transaction?q=transactionType.idEQ${val}&pgSize=1000`)
    .then(resp => {
      if (resp.status === 200 && resp.content.data.length){
        setTransactions(resp.content.data)
      }else{
        alert('Specified transactions not found')
      }
    })
  }


  if (loading){
    return(<Loading/>);
  }


  return(
    <View style = {globalStyles.container}>
      <DropDown
        placeholder = "Select transaction to view"
        wdth = {width / 1.3}
        dropDownItems = {transactionType}
        onChangeItem = {item => {
          selectTransactionType(item.value)
        }}
      />
      <ScrollView style = {styles.scrollview}>
        <View style = {globalStyles.tableView}>
          <Card>
            <CardItem cardBody>
              <TableColumn
                cText = "Clothe"
                textStyle = {styles.headingText}
              />
              <TableColumn
                cText = "Size"
                columnStyle = {globalStyles.tableColumnSeparator}
                textStyle = {styles.headingText}
              />
              <TableColumn
                cText = "Color"
                columnStyle = {globalStyles.tableColumnSeparator}
                textStyle = {styles.headingText}
              />
              <TableColumn
                cText = "Date"
                columnStyle = {globalStyles.tableColumnSeparator}
                textStyle = {styles.headingText}
              />
              <TableColumn
                cText = "Type"
                columnStyle = {globalStyles.tableColumnSeparator}
                textStyle = {styles.headingText}
              />
              <TableColumn
                cText = "Amount"
                columnStyle = {globalStyles.tableColumnSeparator}
                textStyle = {styles.headingText}
              />
            </CardItem>
            {
              transactions.map((item, index) =>
                <CardItem style = {styles.tableRow} key = {index} cardBody>
                  <TableColumn
                    cText = {item.clotheInfo.description}
                    columnStyle = {globalStyles.tableValueColumn}
                  />
                  <TableColumn
                    cText = {item.clotheInfo.size}
                    columnStyle = {globalStyles.tableColumnSeparator}
                  />
                  <TableColumn
                    cText = {item.clotheInfo.color}
                    columnStyle = {globalStyles.tableColumnSeparator}
                  />
                  <TableColumn
                    cText = {FormattingUtil.formatDate(item.createdOn)}
                    columnStyle = {globalStyles.tableColumnSeparator}
                  />
                  <TableColumn
                    cText = {item.transactionType}
                    columnStyle = {globalStyles.tableColumnSeparator}
                  />
                  <TableColumn
                    cText = {item.amount}
                    columnStyle = {globalStyles.tableColumnSeparator}
                  />
                </CardItem>
              )
            }
          </Card>
        </View>
        <View style = {globalStyles.tableEnd}/>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  headingText:{
    fontWeight: 'bold'
  },
  scrollview:{
    height: height * 0.7,
    marginTop: 10
  },
  tableRow:{
    borderTopWidth: 1,
    borderColor: 'gray'
  }
})
