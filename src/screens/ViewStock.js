import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, Text, ScrollView, StyleSheet, Dimensions, ToastAndroid, TouchableOpacity} from 'react-native';
import {Card, CardItem} from 'native-base';
import Config from 'react-native-config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DropDown from '../components/DropDown';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import ServerCommunication from '../utils/ServerCommunication';
import TableColumn from '../components/TableColumn';
import { values } from '../config/values';

const {width, height} = Dimensions.get('window');

export default function ViewStockScreen(){

  const [category, setCategory] = useState(values.categories);
  const [categoryId, setCategoryId] = useState(0);
  const [clotheId, setClotheId] = useState(0);
  const [clotheList, setClotheList] = useState([]);
  const [clotheItemList, setClotheItemList] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadFilter, setLoadFilter] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [stockValue, setStockValue] = useState(0);

  const reducer = (prev, curr) => prev + curr;

  useEffect(() =>{
    loadClotheItems()
  }, [])

  useEffect(() => {
    loadClothes()
  }, [])

  const closeFilter = () => {
    setShowFilter(false);
    loadClotheItems()
  }

  const filterClothes = async() => {
    setLoadFilter(true)

    if (clotheId === 0 && categoryId === 0){
      setLoadFilter(false)
      alert("Select at least one filter")
      return;
    }

    let searchParams;

    if (categoryId !== 0 && clotheId === 0){
      searchParams = `q=status.idEQ1,category.idEQ${categoryId}&pgSize=1000`;
    } else if (categoryId === 0 && clotheId !== 0){
      searchParams = `q=status.idEQ1,clothe.idEQ${clotheId}&pgSize=1000`;
    } else if (categoryId !== 0 && clotheId !== 0){
      searchParams = `q=status.idEQ1,category.idEQ${categoryId},clothe.idEQ${clotheId}&pgSize=1000`;
    }

    console.log("Search params: ", searchParams);

    await ServerCommunication.get(`${Config.API_URL}/clothe/item?${searchParams}`)
    .then(resp => {
      if (resp.status === 200){
        setLoadFilter(false);
        setClotheItemList(resp.content.data);
        let sum = resp.content.data.reduce((acc, curr) => acc + curr.amount, 0)
        setStockValue(sum);
        setItemCount(resp.content.data.length)
      }
    })
    .catch(error => {
      setLoadFilter(false);
      console.log(error);
      ToastAndroid.show("Error applying filter. Try again", ToastAndroid.LONG);
    })
  }

  const loadClothes = async () => {
    await ServerCommunication.get(`${Config.API_URL}/clothe`)
    .then(resp => {
      if (resp.status === 200){
        setClotheList(resp.content.data.map(i => ({
          value: i,
          label: i.name
        })))
      }
    })
    .catch(error => {
      console.log(error)
      alert('error loading clothe')
    })
  }

  const loadClotheItems = async() => {
    setLoading(true)
    await ServerCommunication.get(`${Config.API_URL}/clothe/item?q=status.idEQ1&pgSize=1000`)
    .then(resp => {
      console.log(resp.content.data)
      if (resp.status === 200 && resp.content.data.length){
        setClotheItemList(resp.content.data)
        setLoading(false)
        let sum = resp.content.data.reduce((acc, curr) => acc + curr.amount, 0)
        setStockValue(sum)
        setItemCount(resp.content.data.length)
      }else{
        setLoading(false)
        alert('No products found in stock')
      }
    })
  }

  const selectCategory = (val) => {
    console.log(val)
    setCategoryId(val)
  }

  const selectClothe = (val) => {
    console.log(val)
    setClotheId(val.id)
  }

  const selectFilter = () => {
    setShowFilter(true)
  }
  
  if (loading){
    return( <Loading/> );
  }

  const renderFilter = () => {
    return(
      <View>
        <View style = {styles.filterView}>
          <DropDown
            placeholder = "Select clothe"
            wdth = {width / 3}
            dropDownItems = {clotheList}
            onChangeItem = {item => {
              selectClothe(item.value)
            }}
          />
          <View style = {{width: 10}} />
          <DropDown
            placeholder = "Select category"
            wdth = {width / 3}
            dropDownItems = {category}
            onChangeItem = {item => {
              selectCategory(item.value)
            }}
          />
          {
            loadFilter ? (
              <View style = {styles.filterLoad}>
                <ActivityIndicator color = "#EE6E55" size = "small" />
              </View>
            ) : (
              <TouchableOpacity style = {styles.filterButtonView} onPress = {filterClothes}>
                <MaterialCommunityIcons name = "magnify" size = {25} color = "#EE6E55" />
              </TouchableOpacity>
            )
          }
        </View>
        <TouchableOpacity style = {styles.filterCloseView} onPress = {closeFilter}>
          <Text style = {styles.filterCloseText}>Close filter</Text>
        </TouchableOpacity>
      </View>
    );
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
              cText = "BP -- SP"
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
                  cText = {item.amount + '  ' + item.expectedSellingPrice}
                  columnStyle = {globalStyles.tableColumnSeparator}
                />
              </CardItem>
            )
          }
        </Card>
        <View style = {globalStyles.tableEnd}/>
      </View>
    );
  }

  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        <TouchableOpacity onPress = {selectFilter}>
          <Text style = {styles.filterText}>Click to apply filter</Text>
        </TouchableOpacity>
        {
          showFilter && renderFilter()
        }
        <ScrollView style = {styles.tableScroll}>
            {renderTable()}
        </ScrollView>
      </View>
      <View style = {styles.summaryView}>
        <View style = {styles.summaryTextView}>
          <Text style = {styles.summaryText}>Stock value: </Text>
          <Text style = {styles.summaryTextNo}>{stockValue}</Text>
        </View>
          <View style = {styles.summaryTextView}>
            <Text style = {styles.summaryText}>Item count: </Text>
            <Text style = {styles.summaryTextNo}>{itemCount}</Text>
          </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterButtonView: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    height: 30,
    marginLeft: 15,
    marginTop: 15,
    paddingRight: 5
  },
  filterCloseText: {
    color: '#FE3E05',
    fontSize: 14,
    fontWeight: 'bold'
  },
  filterCloseView: {
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 3
  },
  filterLoad: {
    alignItems: 'center',
    height: 30,
    marginLeft: 15,
    marginTop: 15
  },
  filterText: {
    color: '#18E042',
    fontSize: 14,
    fontWeight: 'bold'
  },
  filterView:{
    flexDirection: 'row'
  },
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
    height: height / 2
  },
  summaryText: {
    fontSize: 16
  },
  summaryTextNo: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold'
  },
  summaryTextView: {
    flexDirection: 'row'
  },
  summaryView: {
    margin: 10
  }
})