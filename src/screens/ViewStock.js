import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from 'react-native-config';

import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import ServerCommunication from '../utils/ServerCommunication';
import TableColumn from '../components/TableColumn';

const {width, height} = Dimensions.get('window');

export default function ViewStockScreen(){

  const [clotheItemList, setClotheItemList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() =>{
    loadClotheItems()
  }, [])

  const loadClotheItems = async() => {
    setLoading(true)
    await ServerCommunication.get(`${Config.API_URL}/clothe/item?q=status.idEQ1&pgSize=1000`)
    .then(resp => {
      console.log(resp.content.data)
      if (resp.status === 200 && resp.content.data.length){
        setClotheItemList(resp.content.data)
        setLoading(false)
      }else{
        setLoading(false)
        alert('No products found in stock')
      }
    })
  }
  
  if (loading){
    return( <Loading/> );
  }

  const renderTable = () =>{
    return(
      <View style = {globalStyles.tableView}>
        <Card>
          <CardItem cardBody>
            <TableColumn
              cText = "CLOTHE"
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "DESC"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "CATEGORY"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "COLOR"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "SIZE"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "BUYING PRICE"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
          </CardItem>
          {
            clotheItemList.map((item, index) =>
              <CardItem style = {styles.tableRow} key = {index} cardBody>
                <TableColumn
                  cText = {item.clotheName}
                  columnStyle = {globalStyles.tableValueColumn}
                />
                <TableColumn
                  cText = {item.description}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.category}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.color}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.size}
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
    );
  }

  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        <Text>Stock</Text>
        <ScrollView style = {styles.tableScroll}>
            {renderTable()}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    tableRow:{
        borderTopWidth: 1,
        borderColor: 'gray'
    },
    tableView:{
        width: width
    },
    headingText:{
        fontWeight: 'bold'
    },
    tableScroll:{
        width: width,
        height: height / 3.5
    }
})