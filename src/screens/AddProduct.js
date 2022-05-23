import React, {useState, useEffect} from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {RadioButton} from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../config/values';
import DropDown from '../components/DropDown';
import globalStyles from '../config/globalStyles';
import InputText from '../components/InputText';
import Loading from '../components/Loading';
import LoggerUtil from '../utils/LoggerUtil';
import RadioView from '../components/RadioView';
import ServerCommunication from '../utils/ServerCommunication';
import SubmitButton from '../components/SubmitButton';

const {width, height} = Dimensions.get('screen');

export default function AddProductScreen({navigation}){
    
  const [ category, setCategory ] = useState('');
  const [ clothe, setClothe ] = useState('');
  const [ clotheError, setClotheError ] = useState('');
  const [ clotheId, setClotheId ] = useState(0);
  const [ clotheList, setClotheList ] = useState([]);
  const [ clotheAdd, setClotheAdd ] = useState('');
  const [ color, setColor ] = useState('');
  const [ colorError, setColorError ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ descriptionError, setDescriptionError ] = useState('');
  const [ expectedSellingPrice, setExpectedSellingPrice ] = useState('');
  const [ image, setImage ] = useState([]);
  const [ imageName, setImageName ] = useState('');
  const [ imageString, setImageString ] = useState('');
  const [ imageType, setImageType ] = useState('');
  const [ imageUri, setImageUri ] = useState('');
  const [ isClotheError, setIsClotheError ] = useState(false);
  const [ isColorError, setIsColorError ] = useState(false);
  const [ isPriceError, setIsPriceError ] = useState(false);
  const [ isDescError, setIsDescError ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ price, setPrice ] = useState('');
  const [ priceError, setPriceError ] = useState('');
  const [ showAddClothe, setShowAddClothe ] = useState(false);
  const [ size, setSize ] = useState('');
  const [ visible, setVisible ] = useState(false);

  const imgOptions = {
    includeBase64: true,
    maxHeight: 200,
    maxWidth: 200
  }

  useEffect(() => {
    loadClothe();
  }, [])

  const addMore = () =>{
    setShowAddClothe(true)
  }

  const addProduct = async() =>{
    if (clotheId === 0){
      ToastAndroid.showWithGravity("Please select clothe", ToastAndroid.LONG, ToastAndroid.TOP);
      return;
    }

    if (!description){
      setDescriptionError("Please enter description");
      setIsDescError(true);
      return;
    }

    if (!color){
      setColorError("Enter color");
      setIsColorError(true);
      return;
    }

    if (!price){
      setIsPriceError(true);
      setPriceError("Enter price");
      return;
    }

    let payload = {
      amount: parseInt(price),
      category: category,
      clotheId: clotheId,
      color: color,
      description: description,
      expectedSellingPrice: parseInt(expectedSellingPrice),
      size: size,
    }
    LoggerUtil.logDebug("Payload: ", payload);

    setLoading(true);
    await ServerCommunication.addClotheItem(payload)
    .then(resp => {
      LoggerUtil.logDebug(resp);
      if (resp.status === 201){
        if (image != null) {
          uploadImage(resp.content.id);
        }
        setLoading(false);
        ToastAndroid.show("Product added successfully", ToastAndroid.SHORT);
        setCategory('');
        setColor('');
        setDescription('');
        setImageString('');
        setImageType('');
        setExpectedSellingPrice('');
        setPrice('');
        setSize('');
      } else if (resp.validationError.errors){
        setLoading(false);
        Alert.alert("Error", JSON.stringify(resp.validationError.errors, null, 2));
      }
    })
    .then(setImage([]))
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError("Error saving product", error);
      alert('There was a problem saving product');
    })
  }
  
  const loadClothe = async() =>{
    setLoading(true)
    await ServerCommunication.getClothes()
    .then(resp =>{
      LoggerUtil.logDebug(resp);
      if (resp.status === 200){
        setLoading(false);
        setClotheList(resp.content.data.map(i => ({
          value: i,
          label: i.name
        })))
      }
    })
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError("AddProduct.loadClothe", error);
      alert('error loading clothe');
    })
  }

  const selectCamera = async () => {
    setVisible(false);
    const result = await launchCamera(imgOptions);
    if (result.didCancel !== true) {
      result.assets.map(i => {
        setImageName(i.fileName);
        setImageString(i.base64);
        setImageType(i.type);
        setImageUri(i.uri);
      })
      setImage(result.assets);
    }
    LoggerUtil.logInformation("Camera data", result);
  }

  const selectGallery = async () => {
    setVisible(false);
    const result = await launchImageLibrary(imgOptions);
    LoggerUtil.logInformation("Gallery data", result);
    if (result.didCancel !== true) {
      setImage(result.assets);
      result.assets.map(i => {
        setImageString(i.base64);
        setImageType(i.type);
      })
    }
  }

  const selectClothe = (val) =>{
    LoggerUtil.logInformation("Clothe: ", val);
    setClothe(val.name);
    setClotheId(val.id);
  }

  const submitClothe = async() =>{
    if (!clotheAdd){
      setClotheError("Enter name");
      setIsClotheError(true);
      return;
    }

    let payload = {
      name : clotheAdd
    }

    setLoading(true)
    await ServerCommunication.addClothe(payload)
    .then(resp => {
      if (resp.status === 201){
        setLoading(false)
        ToastAndroid.show("Clothe added successfully", ToastAndroid.LONG);
        setClotheAdd('');
        setShowAddClothe(false);
      }else if (resp.validationError.errors){
        setLoading(false);
        Alert.alert("Error", JSON.stringify(resp.validationError.errors, null, 2))
      }
    })
    .then(setTimeout(() => {
      updateClotheList();
    }, 300))
    .catch(error => {
      setLoading(false);
      LoggerUtil.logError("AddProduct.submitClothe", error);
      alert("Error saving clothe")
    })
  }

  const updateClotheList = async() => {
    await ServerCommunication.getClothes(clothe)
    .then(resp => {
      if (resp.status === 200){
        ToastAndroid.show("Clothe list updated", ToastAndroid.SHORT);
        setClotheList(resp.content.data.map(i => ({
          value: i,
          label: i.name
        })))
      }
    })
    .catch(error => {
      LoggerUtil.logError("AddProduct.updateClotheList", error);
      ToastAndroid.show("Error getting updated list", ToastAndroid.SHORT);
    })
  }

  const uploadImage = async (clotheItemId) => {
    const imageData = new FormData();
    imageData.append('title', clothe);
    imageData.append('description', description !== '' ? description : clothe);
    imageData.append('clotheItemId', JSON.stringify(clotheItemId));
    imageData.append('file', {
      uri: imageUri,
      name: imageName,
      type: imageType
    });

    await ServerCommunication.uploadImage(imageData)
    .then(resp => {
      if (resp.status === 200) {
        ToastAndroid.show("Image uploaded successfully", ToastAndroid.SHORT);
        setImage([]);
      } else if (resp.validationError.errors) {
        ToastAndroid.show("Error uploading image", ToastAndroid.SHORT);
      }
    })
    .catch(error => {
      LoggerUtil.logError("AddProduct.uploadImage", error);
      ToastAndroid.show("Problem uploading image", ToastAndroid.LONG);
    })
  }

  const renderImageSelection = () => {
    return(
      <View style = {styles.centeredView}>
        <Modal
          animationType = "fade"
          transparent = {true}
          visible = {visible}
          onRequestClose = {() => {
            setVisible(!visible)
          }}
        >
          <View style = {styles.centeredView}>
            <View style = {styles.modalView}>
              <Text style = {styles.profileImageText}>Select image</Text>
              <View style = {styles.selectionView}>
                <TouchableOpacity style = {styles.cameraView} onPress = {selectCamera}>
                  <View style = {styles.iconView}>
                    <Icon name = "camera" size = {38} color = {colors.iconGrey} />
                  </View>
                  <Text style = {styles.selectionText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.cameraView} onPress = {selectGallery}>
                  <View style = {styles.iconView}>
                    <Icon name = "image" size = {38} color = {colors.iconGrey} />
                  </View>
                  <Text style = {styles.selectionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style = {styles.cancelBtn} onPress = {() => setVisible(false)}>
                <Text style = {styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (loading){
    return(<Loading/>);
  }

  return(
    <ScrollView>
      <View style = {globalStyles.container}>
        <TouchableOpacity style = {styles.imageView} onPress = {() => setVisible(true)}>
          {
            !image.length &&
            <Icon name = "camera-outline" size = {200} color = {colors.iconGrey} />
          }
          {
            image &&
            <Image style = {styles.image} source = {{ uri: 'data:' + imageType + ';base64,' + imageString}} />
          }
        </TouchableOpacity>
        <DropDown
          placeholder = "Select clothe"
          wdth = {width / 1.3}
          dropDownItems = {clotheList}
          onChangeItem = {item =>{
            LoggerUtil.logInformation("Category chosen: ", item)
            selectClothe(item.value)
          }}
        />

        {
          !showAddClothe &&
            <View style = {styles.addMoreView}>
              <TouchableOpacity onPress = {() => setShowAddClothe(true)}>
                <Text style = {styles.addText}>Click to add more clothes</Text>
              </TouchableOpacity>
            </View>
        }
        {
          showAddClothe && 
          (
            <View style = {styles.clotheView}>
              <Text style = {styles.addClotheText}>Add clothe</Text>
              <InputText
                error = {isClotheError}
                errorText = {clotheError}
                label = "Clothe"
                onFocus = {() => setIsClotheError(false)}
                onChangeText = {(text) => setClotheAdd(text)}
                placeholder = "e.g Trousers"
                showHelper = {isClotheError}
                value = {clotheAdd}
                width = {width / 1.5}
              />
              <View style = {styles.btnView}>
                <TouchableOpacity 
                  style = {[styles.clotheBtn, styles.clotheBtnCancel]}
                  onPress = {() => setShowAddClothe(false)}
                >
                  <Text style = {styles.clotheAddBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style = {[styles.clotheBtn, styles.clotheBtnAdd]} 
                  onPress = {submitClothe}
                >
                  <Text style = {styles.clotheAddBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        <View style = {styles.categoryView}>
          <Text style = {styles.categoryText}>Select category</Text>
          <RadioButton.Group
            onValueChange = {newVal => setCategory(newVal)}
            value = {category}
          >
            <View style = {styles.radioButtons}>
              <RadioView val = "gents" text = "Gents"/>
              <RadioView val = "ladies" text = "Ladies"/>
              <RadioView val = "kids" text = "Kids"/>
            </View>
          </RadioButton.Group>
        </View>

        <View style = {styles.formView}>
          <InputText
            error = {isDescError}
            errorText = {descriptionError}
            label = "Description"
            onFocus = {() => setIsDescError(false)}
            onChangeText = {(text) => setDescription(text)}
            placeholder = "e.g Jeans"
            showHelper = {isDescError}
            value = {description}
            width = {width / 1.3}
          />
        </View>

        <View style = {[styles.formView, styles.sizeView]}>
          <InputText
            label = "Size"
            onChangeText = {(text) => setSize(text)}
            placeholder = "e.g XL, 36"
            value = {size}
            width = {width / 2.8}
          />
          <InputText
            error = {isColorError}
            errorText = {colorError}
            label = "Color"
            onFocus = {() => setIsColorError(false)}
            onChangeText = {(text) => setColor(text)}
            placeholder = "e.g black"
            showHelper = {isColorError}
            value = {color}
            width = {width / 2.8}
          />
        </View>

        <View style = {[styles.formView, styles.sizeView]}>
          <InputText
            error = {isPriceError}
            errorText = {priceError}
            keyboardType = "numeric"
            label = "Buying Price"
            onFocus = {() => setIsPriceError(false)}
            onChangeText = {(text) => setPrice(text)}
            placeholder = "e.g 650"
            showHelper = {isPriceError}
            value = {price}
            width = {width / 2.8}
          />
          <InputText
            keyboardType = "numeric"
            label = "Selling Price"
            onChangeText = {(text) => setExpectedSellingPrice(text)}
            placeholder = "e.g 1000"
            value = {expectedSellingPrice}
            width = {width / 2.8}
          />
        </View>

        {
          renderImageSelection()
        }

        <SubmitButton
          buttonTitle = "Add Product"
          onPress = {addProduct}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addClotheText: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 16
  },
  addMoreView:{
    paddingTop: 15
  },
  addText:{
    color: colors.red,
    fontSize: 15
  },
  btnView: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 25,
    width: width / 2.3
  },
  cameraView: {
    marginRight: 50,
    width: 50
  },
  cancelBtn: {
    backgroundColor: colors.red,
    borderColor: colors.borderGrey,
    borderRadius: 10,
    borderWidth: 0.5,
    height: 35,
    justifyContent: 'center',
    marginTop: 20,
    width: width / 6
  },
  cancelBtnText:{
    alignSelf: 'center',
    color: colors.white,
    fontSize: 13
  },
  categoryText: {
    alignSelf: 'flex-start',
    color: colors.black,
    fontSize: 15
  },
  categoryView: {
    marginTop: 10,
    width: width / 1.4
  },
  centeredView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start'
  },
  clotheAddBtnText: {
    alignSelf: 'center',
    color: colors.white
  },
  clotheAddView:{
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    flexDirection: 'row',
    height: 40,
    marginLeft: 15,
    marginTop: 10,
    paddingRight: 5
  },
  clotheBtn: {
    borderColor: colors.borderGrey,
    borderRadius: 10,
    borderWidth: 0.5,
    height: 35,
    justifyContent: 'center',
    width: width / 6
  },
  clotheBtnAdd: {
    backgroundColor: colors.greenBackground
  },
  clotheBtnCancel: {
    backgroundColor: colors.red
  },
  clotheView:{
    paddingVertical: 10,
    width: width / 1.3
  },
  container:{
    alignItems: 'center',
    padding: 10
  },
  descriptionText:{
    fontSize: 11,
    marginBottom: -5
  },
  formView:{
    marginBottom: 15,
    marginTop: 10
  },
  iconView:{
    borderColor: colors.borderGrey,
    borderRadius: 20,
    borderWidth: 0.2,
    height: 40,
    width: 40
  },
  image: {
    borderRadius: 5,
    height: 200,
    width: 200
  },
  imageView: {
    alignSelf: 'center',
    borderColor: colors.borderGrey,
    borderRadius: 5,
    borderWidth: 0.5,
    height: 200,
    width: 200
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 20,
    elevation: 5,
    marginTop: 70,
    padding: 10,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowOpacity: 0.5,
    shadowRadius: 4
  },
  profileImageText: {
    color: colors.black,
    fontSize: 14
  },
  radioButtons:{
    flexDirection: 'row'
  },
  selectionText: {
    color: colors.black,
    fontSize: 12,
    justifyContent: 'space-around'
  },
  selectionView: {
    flexDirection: 'row',
    marginTop: 10,
    width: width / 2.3
  },
  sizeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width / 1.3
  }
})
