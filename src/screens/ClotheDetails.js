import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, Dimensions, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Config from 'react-native-config';

import DropDown from '../components/DropDown';
import FormInput from '../components/FormInput';
import globalStyles from '../config/globalStyles';
import Loading from '../components/Loading';
import ServerCommunication from '../utils/ServerCommunication';
import SubmitButton from '../components/SubmitButton';

const {width, height} = Dimensions.get('screen');

export default function ClotheDetails({navigation}){

    const [clothe, setClothe] = useState('');
    const [clotheId, setClotheId] = useState(0);
    const [clotheList, setClotheList] = useState([]);
    const [clotheLoad, setClotheLoad] = useState(false);
    const [clotheType, setClotheType] = useState('');
    const [clotheTypeLoad, setClotheTypeLoad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState('');


    useEffect(() => {
      loadClothes()
    }, [])


    const submitClothe = async() => {

      if (!clothe){
        alert("Please enter a name")
        return;
      }

      let payload = {name : clothe}
      
      setClotheLoad(true);
      await ServerCommunication.post(`${Config.API_URL}/clothe`, payload)
      .then( resp =>{
        console.log(resp)
        if (resp.status === 201){
          setClotheLoad(false);
          ToastAndroid.show("Clothe added successfully", ToastAndroid.LONG);
          setClothe('');
        } else if (resp.validationError.errors){
          setClotheLoad(false);
          Alert.alert("Error", JSON.stringify(resp.validationError.errors, null,2));
        }
      })
      .then(loadClothes())
      .catch(error => {
        setClotheLoad(false);
        console.log(error);
        alert("error saving clothe");
      })
    }


    const loadClothes = async() => {
      await ServerCommunication.get(`${Config.API_URL}/clothe`)
      .then(resp => {
        if (resp.status === 200){
          setClotheList(resp.contentMap.data.map(i => ({
            value: i,
            label: i.name
          })))
        }
      })
      .catch(error =>{
        console.log(error);
        alert("error loading clothe");
      })
    }


    const selectClothe = (val) => {
      setClotheId(val.id);
      setSelected(val.name);
    }


    const submitClotheType = async() => {

      if (!clotheType){
        alert("Please enter clothe details");
        return;
      }

      if (!clotheId){
        alert('Please select clothe above');
        return;
      }

      let selectedClothe = selected.toLowerCase();

      let payload = {
        clotheId: clotheId,
        name: clotheType,
        description: `${clotheType} ${selectedClothe}`
      }

      console.log("Payload: ", payload)
      setClotheTypeLoad(true);
      await ServerCommunication.post(`${Config.API_URL}/clothe/type`, payload)
      .then(resp => {
        if (resp.status === 201){
          setClotheTypeLoad(false);
          ToastAndroid.show("Clothe details added successfully", ToastAndroid.LONG);
          setClotheType('');
        } else if (resp.validationError.errors){
          setClotheTypeLoad(false);
          Alert.alert("Error", JSON.stringify(resp.validationError.errors, null, 2));
        }
      })
      .catch(error => {
        setClotheTypeLoad(false);
        console.log(error);
        alert("Error saving clothe details");
      })
    }


    if (loading){
      return(
        <Loading/>
      );
    }

    return(
      <View style = {globalStyles.container}>
        <Text>Enter clothe to add</Text>
        <View style = {styles.clotheView}>
          <FormInput 
            labelName = "Clothe"
            value = {clothe}
            onChangeText = {(text) => setClothe(text)}
            viewWidth = {width / 1.8}
          />
          {
            !clotheLoad ? 
            (
              <TouchableOpacity style = {styles.clotheAddView} onPress = {submitClothe}>
                <MaterialCommunityIcons name = "plus" size = {30} color = "#EE6E55" />
                <Text style = {styles.addText}>Add</Text>
              </TouchableOpacity>
            ) : 
            (
              <View style = {styles.addClotheLoad}>
                <ActivityIndicator
                  size = "large"
                  color = "#EE6E55"
                />
              </View>
            )
          }
        </View>
        <Text>Select clothe to enter details</Text>
        <DropDown
          placeholder = "Select clothe"
          dropDownItems = {clotheList}
          onChangeItem = {item => {
            console.log("Clothe chosen: ", item);
            selectClothe(item.value);
          }}
        />
        <View style = {styles.clotheView}>
          <FormInput
            labelName = "Clothe details"
            value = {clotheType}
            onChangeText = {(text) => setClotheType(text)}
            viewWidth = {width / 1.8}
          />
          {
            clotheTypeLoad ?
            (
              <View style = {styles.addClotheLoad}>
                <ActivityIndicator
                  size = "large"
                  color = "#EE6E55"
                />
              </View>
            ) : 
            (
              <TouchableOpacity style = {styles.clotheAddView} onPress = {submitClotheType}>
                <MaterialCommunityIcons name = "plus" size = {30} color = "#EE6E55" />
                <Text style = {styles.addText}>Add</Text>
              </TouchableOpacity>
            )
          }
        </View>

      </View>
    );
}

const styles = StyleSheet.create({
  addClotheLoad:{
    marginTop: 10,
    marginLeft: 10
  },
  addText:{
    fontSize: 15,
    color: '#EE6E55'
  },
  clotheAddView:{
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 5,
    borderRadius: 5,
    borderWidth: 0.5,
    height: 40,
    marginTop: 10,
    marginLeft: 15
  },
  clotheView:{
    flexDirection: 'row',
    paddingBottom: 20
  },

})