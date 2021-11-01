import React, {useState, useEffect} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from 'react-native-config';
import {useIsFocused} from '@react-navigation/native';

import DropDown from '../components/DropDown';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import ServerCommunication from '../utils/ServerCommunication';
import TableButton from '../components/TableButton';
import TableColumn from '../components/TableColumn';

const {width, height} = Dimensions.get('window')


export default function SellProductScreen({navigation}){
  
  const isFocused = useIsFocused();

  const [clotheItemList, setClotheItemList] = useState([]);
  const [clotheList, setClotheList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadSelect, setLoadSelect] = useState(false);
  const [showTable, setShowTable] = useState(false);
  

  useEffect(() => {
    loadClothes()
  }, [])


  useEffect(() => {
    setShowTable(false)
  }, [isFocused])


  const loadClothes = async() => {
    setLoading(true);
    await ServerCommunication.get(`${Config.API_URL}/clothe`)
    .then(resp => {
      setLoading(false);
      console.log(resp.content.data)
      setClotheList(resp.content.data.map(i => ({
        value: i,
        label: i.name
      })))
    })
    .catch(error => {
      setLoading(false);
      console.log("SellProduct.loadClothes() error: ", error);
      ToastAndroid.show("Error loading clothes", ToastAndroid.SHORT);
    })
  }


  const selectClothe = async(val) =>{
    console.log(val.id)
    
    setLoadSelect(true);
    await ServerCommunication.get(`${Config.API_URL}/clothe/item?q=clothe.idEQ${val.id},status.idEQ1&pgSize=1000`)
    .then(resp => {
      console.log(resp)
      if (resp.status === 200 && resp.content.data.length){
        setLoadSelect(false);
        console.log(resp.content.data)
        setClotheItemList(resp.content.data)
        setShowTable(true)
      }else{
        setLoadSelect(false);
        setClotheItemList([]);
        ToastAndroid.show("No products found", ToastAndroid.LONG);
      }
    })
    .catch(error => {
      console.log("SellProduct.selectClothe() error: ", error);
      ToastAndroid.show("Error getting selected clothes", ToastAndroid.LONG);
    })
  } 

  const sell = (data) =>{
    console.log("Data: ", data)
    navigation.navigate('SaleConfirm', {prodId: data.id})
  }

  if (loading){
    return(
      <Loading/>
    );
  }

  return(
    <View style = {globalStyles.container}>
      <Text>Sell Product</Text>
      <DropDown
        placeholder = "Select clothe"
        wdth = {width / 1.3}
        dropDownItems = {clotheList}
        onChangeItem = {item =>{
          selectClothe(item.value)
        }}
      />
      {
        loadSelect && <Loading/>
      }

      <ScrollView style = {[globalStyles.tableView, styles.scrollview]}>
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
              cText = "S.P"
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
        <View style = {globalStyles.tableEnd}/>
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
    height: height / 1.6,
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
  },
  loadSelectView:{
    paddingTop: 10
  }
})
