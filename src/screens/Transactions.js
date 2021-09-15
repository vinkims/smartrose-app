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

const {width, height} = Dimensions.get('screen');

export default function Transactions(){

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState();
  const [transactions, setTransactions] = useState([]);


  useEffect(() => {
    loadTransactions()
  }, [])


  const loadTransactions = async() => {
    setLoading(true);
    await ServerCommunication.get(`${Config.API_URL}/transaction`)
    .then(resp => {
      if (resp.status === 200){
        setLoading(false);
        setTransactions(resp.content.data);
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
      />
      <ScrollView style = {styles.scrollview}>
        <Text>start here</Text>
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
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  headingText:{
    fontWeight: 'bold'
  },
  scrollview:{
    marginTop: 10
  },
  tableRow:{
    borderTopWidth: 1,
    borderColor: 'gray'
  }
})
