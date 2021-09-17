import React, {useState, useEffect} from 'react';
import {Alert, Dimensions, View, StyleSheet, ScrollView, Text, ToastAndroid, TouchableOpacity} from 'react-native';
import Config from 'react-native-config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RadioButton} from 'react-native-paper';

import DropDown from '../components/DropDown';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading';
import RadioView from '../components/RadioView';
import SubmitButton from '../components/SubmitButton';
import globalStyles from '../config/globalStyles';
import ServerCommunication from '../utils/ServerCommunication';

const {width, height} = Dimensions.get('screen');

export default function AddProductScreen({navigation}){
    
    const [category, setCategory] = useState('')
    const [clothe, setClothe] = useState('')
    const [clotheId, setClotheId] = useState(0);
    const [clotheList, setClotheList] = useState([]);
    const [clotheAdd, setClotheAdd] = useState('')
    const [color, setColor] = useState('')
    const [description, setDescription] = useState('')
    const [expectedSellingPrice, setExpectedSellingPrice] = useState(0)
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(0)
    const [showAddClothe, setShowAddClothe] = useState(false);
    const [size, setSize] = useState('') 


    useEffect(() => {
        loadClothe()
    }, [])


    const loadClothe = async() =>{
        setLoading(true)
        await ServerCommunication.get(`${Config.API_URL}/clothe`)
        .then(resp =>{
            console.log(resp)
            if (resp.status === 200){
                setLoading(false)
                console.log(resp.content.data)
                setClotheList(resp.content.data.map(i => ({
                    value: i,
                    label: i.name
                })))
            }
        })
        .catch(error => {
            setLoading(false)
            console.log(error);
            alert('error loading clothe')
        })
    }


    const selectClothe = (val) =>{
        console.log("Clothe: ", val)
        setClothe(val.name);
        setClotheId(val.id);
    }

    const addMore = () =>{
        setShowAddClothe(true)
    }

    const addProduct = async() =>{
        if (!category || !color || !price){
            alert("Please fill in all details")
            return
        }

        let payload = {
            amount: price,
            category: category,
            clotheId: clotheId,
            color: color,
            description: description,
            expectedSellingPrice: expectedSellingPrice,
            size: size,
        }
        console.log("Payload: ", payload)

        setLoading(true);
        await ServerCommunication.post(`${Config.API_URL}/clothe/item`, payload)
        .then(resp => {
            console.log(resp)
            if (resp.status === 201){
                setLoading(false);
                ToastAndroid.show("Product added successfully", ToastAndroid.SHORT);
                setCategory('')
                setColor('')
                setDescription('')
                setExpectedSellingPrice(0)
                setPrice(0)
                setSize('')
            } else if (resp.validationError.errors){
                setLoading(false);
                alert('Error saving product');
            }
            
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            alert('There was a problem saving product');
        })
    }

    const submitClothe = async() =>{
        if (!clotheAdd){
            alert("Please enter a name")
            return;
        }

        let payload = {
            name : clotheAdd
        }

        setLoading(true)
        await ServerCommunication.post(`${Config.API_URL}/clothe`, payload)
        .then(resp => {
            if (resp.status === 201){
                setLoading(false)
                ToastAndroid.show("Clothe added successfully", ToastAndroid.LONG);
                setClotheAdd('')
                setShowAddClothe(false)
            }else if (resp.validationError.errors){
                setLoading(false)
                Alert.alert("Error", JSON.stringify(resp.validationError.errors, null, 2))
            }
        }).catch(error => {
            setLoading(false)
            console.log(error)
            alert("Error saving clothe")
        })
    }


    if (loading){
        return(
            <Loading/>
        );
    }


    return(
        <ScrollView>
        <View style = {globalStyles.container}>
            <DropDown
                placeholder = "Select clothe"
                dropDownItems = {clotheList}
                onChangeItem = {item =>{
                    console.log("Category chosen: ", item)
                    selectClothe(item.value)
                }}
            />

            <View style = {styles.addMoreView}>
                <TouchableOpacity onPress = {addMore}>
                    <Text style = {styles.addText}>Click to add more clothes</Text>
                </TouchableOpacity>
            </View>
            {
                showAddClothe && 
                (
                    <View style = {styles.clotheView}>
                        <FormInput
                            labelName = "Clothe"
                            value = {clotheAdd}
                            onChangeText = {(text) => setClotheAdd(text)}
                            viewWidth = {width / 1.8}
                        />
                        <TouchableOpacity style = {styles.clotheAddView} onPress = {submitClothe}>
                            <MaterialCommunityIcons name = "plus" size = {30} color = "#EE6E55" />
                            <Text style = {styles.addText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
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

            <View style = {styles.formView}>
                <Text style = {styles.descriptionText}>DESCRIPTION e.g Jeans</Text>
                <FormInput
                    labelName = "Description"
                    value = {description}
                    onChangeText = {(text) => setDescription(text)}
                />
            </View>

            <View style = {styles.formView}>
                <Text style = {styles.descriptionText}>SIZE</Text>
                <FormInput
                    labelName = "Size"
                    value = {size}
                    onChangeText = {(text) => setSize(text)}
                />
            </View>

            <View style = {styles.formView}>
                <Text style = {styles.descriptionText}>COLOR</Text>
                <FormInput
                    labelName = "Color"
                    value = {color}
                    onChangeText = {(text) => setColor(text)}
                />
            </View>

            <View style = {styles.formView}>
                <Text style = {styles.descriptionText}>BUYING PRICE</Text>
                <FormInput
                    labelName = "Buying Price"
                    value = {price}
                    onChangeText = {(number) => setPrice(number)}
                    keyboardType = "numeric"
                />
            </View>

            <View style = {styles.formView}>
                <Text style = {styles.descriptionText}>EXPECTED SELLING PRICE</Text>
                <FormInput
                    labelName = "Expected Selling Price"
                    value = {expectedSellingPrice}
                    onChangeText = {(number) => setExpectedSellingPrice(number)}
                    keyboardType = "numeric"
                />
            </View>

            <SubmitButton
                buttonTitle = "Submit"
                onPress = {addProduct}
            />
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    addText:{
        color: '#EE6E55',
        fontSize: 15
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
    clotheView:{
        flexDirection: 'row',
        paddingVertical: 10
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
        marginBottom: 10
    },
    radioButtons:{
        flexDirection: 'row',
        paddingTop: 10
    },
    addMoreView:{
        paddingTop: 15
    },
    addText:{
        fontSize: 16,
        color: 'red'
    }
})
