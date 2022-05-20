import React, {useEffect, useState} from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import jwt_decode from 'jwt-decode';
import { LineChart, StackedBarChart } from 'react-native-chart-kit';

import { colors } from '../config/values';
import ActionButton from '../components/ActionButton';
import FormattingUtil from '../utils/FormattingUtil';
import globalStyles from '../config/globalStyles';
import HomeButton from '../components/HomeButton';
import Loading from '../components/Loading';
import LoggerUtil from '../utils/LoggerUtil';
import NavigationService from '../services/NavigationService';
import ServerCommunication from '../utils/ServerCommunication';
import StorageUtil from '../utils/StorageUtil';

const { width, height} = Dimensions.get("screen");

export default function HomeScreen({navigation}){

  const [admin, setAdmin] = useState(false);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [currentWeekSaleData, setCurrentWeekSaleData] = useState([]);
  const [currentLabelDays, setCurrentLabelDays] = useState(["M", "T", "W", "T", "F", "S", "S"]);
  const [currentWeekSale, setCurrentWeekSale] = useState([0,0,0,0,0,0,0]);
  const [gentsWeeklyTotal, setGentsWeeklyTotal] = useState([0,0,0,0]);
  const [kidsWeeklyTotal, setKidsWeeklyTotal] = useState([0,0,0,0]);
  const [ladiesWeeklyTotal, setLadiessWeeklyTotal] = useState([0,0,0,0]);
  const [loading, setLoading] = useState(false);
  const [previousLabelDays, setPreviousLabelDays] = useState(["M", "T", "W", "T", "F", "S", "S"]);
  const [previousWeekSale, setPreviousWeekSale] = useState([0,0,0,0,0,0,0]);
  const [user, setUser] = useState('');
  const [weeklyData, setWeeklyData] = useState([]);
  const [weeklyLabels, setWeeklyLabels] = useState(["Week1", "Week2", "Week3", "Week4"]);

  useEffect(() =>{
    checkTokenValidity();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getReport();
    })
    return unsubscribe;
  }, [navigation]);

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  }

  const currentWeekData = {
    labels: currentLabelDays,
    datasets: [
      {
        data: currentWeekSale
      }
    ]
  }

  const lineChartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,
    fillShadowGradientOpacity: 0,
    color: (opacity = 1) => '#023047',
    labelColor: (opacity = 1) => '#333',
    strokeWidth: 2,
    useShadowColorFromDataset: false,
    decimalPlaces: 0
  }

  const lineChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        data: gentsWeeklyTotal,
        color: (opacity = 1) => '#003049',
        strokeWidth: 2,
      },
      {
        data: kidsWeeklyTotal,
        color: (opacity = 1) => '#d62828',
			  strokeWidth: 2,
      },
      {
        data: ladiesWeeklyTotal,
        color: (opacity = 1) => '#f77f00',
			  strokeWidth: 2,
      }
    ]
  }

  const lineChartLegends = [
    {
      name: 'Gents',
      color: '#003049'
    },
    {
      name: 'Kids',
      color: '#d62828'
    },
    {
      name: 'Ladies',
      color: '#f77f00'
    }
  ]

  const previousWeekData = {
    labels: previousLabelDays,
    datasets: [
      {
        data: previousWeekSale
      }
    ]
  }

  const signup = () =>{
    navigation.navigate('Signup');
  }

  const checkTokenValidity = async() =>{
    let token = await StorageUtil.getToken();
    var dateNow = new Date();
    let decoded = jwt_decode(token);
    
    if (decoded.role === "system-admin"){
      setAdmin(true);
    }

    StorageUtil.storeUserId(decoded.userId);
    setUser(decoded.firstName);

    if (decoded.exp * 1000 < dateNow.getTime()){
      LoggerUtil.logInformation("TOKEN EXPIRED!");
      removeToken();
    }else{
      LoggerUtil.logInformation("Valid token");
    }
  }

  const getReport = async () => {
    const start = FormattingUtil.formatServerDate(currentDay.toISOString()) + "_00:00";
    const end = FormattingUtil.formatServerDate(currentDay.toISOString()) + "_23:59";
    let param = `?startDate=${start}&endDate=${end}`;
    setLoading(true);
    await ServerCommunication.getSaleSummary(param)
      .then(resp => {
        setLoading(false);
        if (resp.status === 200) {
          resp.content.previousWeekSale.map((item, index) => {
            previousLabelDays.splice(index, 7);
            previousLabelDays.push(FormattingUtil.formatDaysOfWeek(new Date(item.createdOn).getDay()));
            previousWeekSale.splice(index, 7);
            previousWeekSale.push(item.totalSalePrice);
          });
          setCurrentWeekSaleData(resp.content.currentWeekSale);
          resp.content.gentsTotal.map((item, index) => {
            gentsWeeklyTotal.splice(index, 4);
            gentsWeeklyTotal.push(item.totalSales === null ? 0 : item.totalSales);
          });
          resp.content.kidsTotal.map((item, index) => {
            kidsWeeklyTotal.splice(index, 4);
            kidsWeeklyTotal.push(item.totalSales === null ? 0 : item.totalSales);
          });
          resp.content.ladiesTotal.map((item, index) => {
            ladiesWeeklyTotal.splice(index, 4);
            ladiesWeeklyTotal.push(item.totalSales === null ? 0 : item.totalSales);
          });
        }
      })
      .catch(error => {
        setLoading(false);
        LoggerUtil.logError("Home.getReport", error);
        ToastAndroid.show("Error getting report", ToastAndroid.LONG);
      })
  }

  const logout = async() =>{
    setLoading(true);

    let token = await StorageUtil.getToken();
    let decoded = jwt_decode(token);
    let userId = decoded.userId;

    let payload = {
      token: token,
      userId: userId
    }

    await ServerCommunication.logout(payload)
    .then(result =>{
      if(result.status === 200){
        LoggerUtil.logInformation('Signout success');
        removeToken();
      } else if (result.validationError.errors){
        LoggerUtil.logError(result.validationError.errors);
        removeToken();
      }
    })
    .catch(error =>{
      LoggerUtil.logError('Failed to signout', error);
      removeToken();
    })
  }

  const navigateToScreen = (screen) => {
    NavigationService.navigate(screen);
  }

  const removeToken = () =>{
    StorageUtil.removeKeys();
    NavigationService.reset("Login");
  }

  const renderWeeklyData = () => {
    currentWeekSaleData.map((item, index) => {
      currentLabelDays.splice(index, 7);
      currentLabelDays.push(FormattingUtil.formatDaysOfWeek(new Date(item.createdOn).getDay()));
      currentWeekSale.splice(index, 7);
      currentWeekSale.push(item.totalSalePrice);
    })

    return(
      <ScrollView
        contentContainerStyle = {{ height: 280}}
        decelerationRate = {0}
        horizontal = {true}
        pagingEnabled = {true}
        persistentScrollbar = {true}
        showsHorizontalScrollIndicator = {true}
        snapToAlignment = "center"
        snapToInterval = {width}
      >
        <View style = {styles.chartView}>
          <Text style = {styles.heading}>Current week sale</Text>
          <LineChart
            data = {currentWeekData}
            width = {width / 1.05}
            height = {270}
            chartConfig = {chartConfig}
          />
        </View>
        <View style = {styles.chartView}>
          <Text style = {styles.heading}>Previous week sale</Text>
          <LineChart
            data = {previousWeekData}
            width = {width / 1.05}
            height = {270}
            chartConfig = {chartConfig}
          />
        </View>
      </ScrollView>
    )
  }

  if (loading){
    return(<Loading/>);
  }

  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        <View style = {styles.saleView}>
            { renderWeeklyData() }
        </View>
        <View style = {styles.lineChartView}>
          <Text style = {styles.heading}>Weekly total by category</Text>
          <View style={{marginTop: 10}}/>
          <LineChart
            data = {lineChartData}
            fillShadowGradient = "#ccc"
            width = {width / 1.05}
            height = {270}
            legend = {lineChartLegends}
            chartConfig = {lineChartConfig}
          />
          <View style = {styles.legendContainer}>
            {
              lineChartLegends.map(({name, color}) => {
                return <View style = {styles.legendView}>
                  <View style = {[styles.legendColorContainer, {backgroundColor: color}]}></View>
                  <View style = {styles.legendTextContainer}>
                    <Text style = {styles.legendText}>{name}</Text>
                  </View>
                </View>
              })
            }
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonView:{
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  chartView: {
    alignSelf: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    width: width / 1.05
  },
  container:{
    alignItems: 'center',
    padding: 10
  },
  lineChartView: {
    marginTop: 10
  },
  heading: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 15
  },
  legendColorContainer: {
    height: 10,
    width: 10,
  },
  legendContainer: {
    alignItems: 'center',
    flex: 1
  },
  legendText: {
    fontSize: 12
  },
  legendTextContainer: {
    paddingLeft: 8
  },
  legendView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  saleView:{
    height: 300,
    marginBottom: 10
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold'
  }
})
