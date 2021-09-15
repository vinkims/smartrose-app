import React, {useState, useEffect} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from 'react-native-config';

import DropDown from '../components/DropDown';
import globalStyles from '../config/globalStyles';
import ServerCommunication from '../utils/ServerCommunication';
import TableButton from '../components/TableButton';
import TableColumn from '../components/TableColumn';

const {width, height} = Dimensions.get('window')


export default function SellProductScreen({navigation}){
  
  const [clotheItemList, setClotheItemList] = useState([]);
  const [clotheList, setClotheList] = useState([]);
  const [showTable, setShowTable] = useState(false);
  

  useEffect(() => {
    loadClothes()
  }, [])


  const loadClothes = async() => {
    await ServerCommunication.get(`${Config.API_URL}/clothe`)
    .then(resp => {
      console.log(resp.content.data)
      setClotheList(resp.content.data.map(i => ({
        value: i,
        label: i.name
      })))
    })
  }


  const selectClothe = async(val) =>{
    console.log(val)
    console.log(val.id)
    
    await ServerCommunication.get(`${Config.API_URL}/clothe/item?q=clothe.idEQ${val.id},status.idEQ1`)
    .then(resp => {
      console.log(resp)
      if (resp.status === 200 && resp.content.data.length){
        console.log(resp.content.data)
        setClotheItemList(resp.content.data)
        setShowTable(true)
      }else{
        alert('No products matching the clothe found')
      }
    })
  } 

  const sell = (data) =>{
    console.log("Data: ", data)
    navigation.navigate('SaleConfirm', {prodId: data.id})
  }


  return(
    <View style = {globalStyles.container}>
      <Text>Sell Product</Text>
      <DropDown
        placeholder = "Select clothe"
        dropDownItems = {clotheList}
        onChangeItem = {item =>{
          selectClothe(item.value)
        }}
      />  

      <ScrollView style = {globalStyles.tableView}>
        {
        showTable && (
      
        <Card>
          <CardItem cardBody>
            <TableColumn
              cText = "Desc"
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "Category"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "Color"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "Size"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = "Set Price"
              columnStyle = {globalStyles.tableColumnSeparator}
              textStyle = {styles.headingText}
            />
            <TableColumn
              cText = ""
              columnStyle = {globalStyles.tableColumnSeparator}
            />
          </CardItem>
          {
            clotheItemList.map((item, index) =>
              <CardItem style = {styles.tableRow} key = {index} cardBody>
                <TableColumn
                  cText = {item.description}
                  columnStyle = {globalStyles.tableValueColumn}
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
                  cText = {item.expectedSellingPrice}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
                <TableButton
                  title = "Sell"
                  columnStyle = {globalStyles.tableColumnSeparator}
                  onPress = {() => sell(item)}
                />
              </CardItem>
            )
          }
  
        </Card>)
        }
      </ScrollView>                
    </View>
  );
}

const styles = StyleSheet.create({
  categoryText:{
    alignSelf: 'flex-start'
  },
  clotheItemsView:{
    borderRadius: 5,
    borderWidth: 0.5,
    margin: 5,
    padding: 5,
    width: width / 3
  },
  clotheView:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  descText:{
    fontSize: 12,
    fontWeight: 'bold'
  },
  sizeText:{
    alignSelf: 'flex-end'
  },
  subView:{
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  scrollview:{
    height: height / 2,
    marginTop: 10,
    width: width / 1.1
  },
  tableRow:{
      borderTopWidth: 1,
      borderColor: 'gray'
  },
  tableView:{
      width: width,
      position: 'relative',
      paddingTop: 20
  },
  headingText:{
      fontWeight: 'bold'
  },
  centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50
  },
  modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
  },
  buttonsView:{
      flexDirection: 'row',
      width: width / 2,
      justifyContent: 'space-evenly'
  }
})