import React, {useEffect, useState} from "react";
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from "react-native-config";

import FormattingUtil from "../utils/FormattingUtil";
import globalStyles from "../config/globalStyles";
import Loading from "../components/Loading";
import ServerCommunication from "../utils/ServerCommunication";
import TableColumn from "../components/TableColumn";

const {width, height} = Dimensions.get('screen');

export default function ViewSoldScreen({}){

  const [loading, setLoading] = useState(false);
  const [soldItems, setSoldItems] = useState([]);

  useEffect(() => {
    loadSold()
  }, [])

  const loadSold = async() => {
    setLoading(true)
    await ServerCommunication.get(`${Config.API_URL}/sale`)
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

  if (loading){
    return( <Loading/> );
  }

  return(
    <View style = {globalStyles.container}>
      <ScrollView style = {globalStyles.tableView}>
        <Card>
          <CardItem cardBody>
            <TableColumn
              cText = "NAME"
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "DESC"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "DATE SOLD"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "SIZE"
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
                  cText = {item.clotheDetails.name}
                  columnStyle = {globalStyles.tableValueColumn}
                />
                <TableColumn
                  cText = {item.clotheDetails.description}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {FormattingUtil.formatDate(item.dateSold)}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.clotheDetails.size}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableColumn
                  cText = {item.clotheDetails.buyingPrice + ' - ' + item.sellingPrice}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headingText:{
    fontWeight: 'bold'
  },
  tableRow:{
    borderTopWidth: 1,
    borderColor: 'gray'
  }
})