import React, {useState, useEffect} from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DropDown from '../components/DropDown';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import LoggerUtil from '../utils/LoggerUtil';
import ServerCommunication from '../utils/ServerCommunication';
import { colors, values } from '../config/values';

const {width, height} = Dimensions.get('window');

export default function ViewStockScreen({navigation}){

  const [ category, setCategory ] = useState(values.categories);
  const [ categoryId, setCategoryId ] = useState(0);
  const [ clotheId, setClotheId ] = useState(0);
  const [ clotheList, setClotheList ] = useState([]);
  const [ clotheItemList, setClotheItemList ] = useState([]);
  const [ itemCount, setItemCount ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const [ loadFilter, setLoadFilter ] = useState(false);
  const [ showFilter, setShowFilter ] = useState(false);
  const [ stockValue, setStockValue ] = useState(0);

  const reducer = (prev, curr) => prev + sumcurr;

  useEffect(() =>{
    const unsubscribe = navigation.addListener('focus', () => {
      loadClotheItems();
    })
    return unsubscribe;
  }, [navigation])

  useEffect(() => {
    loadClothes();
  }, [])

  const closeFilter = () => {
    setCategoryId(0);
    setShowFilter(false);console
    loadClotheItems();
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

    LoggerUtil.logInformation("Search params: ", searchParams);

    await ServerCommunication.getFilteredClotheItems(searchParams)
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
      LoggerUtil.logError("ViewStock.filterClothes", error);
      ToastAndroid.show("Error applying filter. Try again", ToastAndroid.LONG);
    })
  }

  const loadClothes = async () => {
    await ServerCommunication.getClothes()
    .then(resp => {
      if (resp.status === 200){
        setClotheList(resp.content.data.map(i => ({
          value: i,
          label: i.name
        })))
      }
    })
    .catch(error => {
      LoggerUtil.logError("ViewStock.loadClothes", error);
      alert('error loading clothe');
    })
  }

  const loadClotheItems = async() => {
    setLoading(true);
    await ServerCommunication.getClotheItemInStock()
    .then(resp => {
      if (resp.status === 200 && resp.content.data.length){
        setClotheItemList(resp.content.data);
        setLoading(false);
        let sum = resp.content.data.reduce((acc, curr) => acc + curr.amount, 0);
        setStockValue(sum);
        setItemCount(resp.content.data.length);
      }else{
        setLoading(false);
        alert('No products found in stock');
      }
    })
  }

  const selectCategory = (val) => {
    LoggerUtil.logInformation("Category ", val);
    setCategoryId(val);
  }

  const selectClothe = (val) => {
    LoggerUtil.logInformation("Clothe", val);
    setClotheId(val.id);
  }

  const selectFilter = () => {
    setShowFilter(true);
  }

  const sell = (id) => {
    LoggerUtil.logInformation("Product id: ", id);
    navigation.navigate('SaleConfirm', {prodId: id});
  }
  
  if (loading){
    return( <Loading/> );
  }

  const renderClothes = (data) => {
    return(
      <TouchableOpacity style = {styles.clotheView} onPress = {() => sell(data.id)}>
        <Image 
          source = {require('../resources/images/clothes.jpg')} 
          style = {styles.image}
        />
        <View style = {styles.colorView}>
          <Text style = {styles.nameText}>{data.clotheName}</Text>
          <Text style = {styles.nameDescText}> {data.description}</Text>
        </View>
        <View style = {styles.colorView}>
          <Text style = {styles.descText}>{data.color}</Text>
          <Text style = {styles.darkText}>   {data.size}</Text>
          <Text style = {styles.descText}>   {data.category}</Text>
        </View>
        <View style = {styles.colorView}>
          <Text style = {styles.descText}>{data.amount} -</Text>
          <Text style = {styles.darkText}> {data.expectedSellingPrice}</Text>
        </View>
      </TouchableOpacity>
    );
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
          <Text style = {styles.filterCloseText}>Clear filter</Text>
        </TouchableOpacity>
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
        <ScrollView>
          <View style = {styles.tableScroll}>
          {
            clotheItemList.map(cl => renderClothes(cl))
          }
          </View>
        </ScrollView>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  clotheDetailView: {
    marginLeft: 10
  },
  clotheView: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    elevation: 5,
    height: 200,
    marginTop: 10,
    padding: 10,
    width: width / 2.3
  },
  colorView: {
    flexDirection: 'row',
    height: 20
  },
  darkText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: 'bold'
  },
  descText: {
    fontSize: 12
  },
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
  image: {
    height: width / 3.2,
    width: width / 3.2
  },
  saleButton: {
    alignSelf: 'flex-end'
  },
  saleButtonText: {
    color: colors.red
  },
  saleView: {
    flexDirection: 'row',
    height: 20,
    justifyContent: 'space-between',
    width: width / 1.8
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
  nameDescText: {
    alignSelf: 'center',
    fontSize: 10
  },
  nameText: {
    alignSelf: 'center',
    fontSize: 12
  },
  tableScroll:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    width: width
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
    flexDirection: 'row',
    marginLeft: 10
  },
  summaryView: {
    flexDirection: 'row',
    margin: 10
  }
})