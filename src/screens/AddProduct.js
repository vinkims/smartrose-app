import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet, ScrollView} from 'react-native';
import DropDown from '../components/DropDown';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import {values} from '../config/values';

export default function AddProductScreen({}){
    
    const [category, setCategory] = useState('')
    const [clothe, setClothe] = useState('')
    const [type, setType] = useState([])
    const [showTypeDropdown, setShowTypeDropdown] = useState(true)
    const [subType, setSubType] = useState('')
    const [size, setSize] = useState('') 
    const [color, setColor] = useState('')
    const [price, setPrice] = useState('')


    const selectCategory = (cat) =>{
        console.log("Category: ",cat)
        setCategory(cat)
    }


    const selectClothe = (val) =>{
        console.log("Clothe: ", val)
        setClothe(val)
        displayClotheType(val)
    }


    const displayClotheType = (val) =>{
        console.log("Type: ", val)
        if (val === "Trousers"){
            setType(values.trousers)
            setShowTypeDropdown(true)
        }else if (val === "Shorts"){
            setType(values.shorts)
            setShowTypeDropdown(true)
        }else if (val === "Shirt"){
            setType(values.shirt)
            setShowTypeDropdown(true)
        }else if (val === "Tshirt"){
            setType(values.tshirt)
            setShowTypeDropdown(true)
        }else if (val === "Innerwear"){
            setType(values.innerwear)
            setShowTypeDropdown(true)
        }else if (val === "Sweater"){
            setType(values.sweater)
            setShowTypeDropdown(true)
        }else if (val === "Tops"){
            setType(values.tops)
            setShowTypeDropdown(true)
        }else if (val === "Shoes"){
            setType(values.shoes)
            setShowTypeDropdown(true)
        }else if (val === "Caps"){
            setType(values.caps)
            setShowTypeDropdown(true)
        }else{
            setType([])
            setShowTypeDropdown(false)
        }
    }


    const selectType = (val) =>{
        console.log("Value: ", val)
        setSubType(val)
    }


    const addProduct = () =>{
        if (!category || !type || !color || !price){
            alert("Please fill in all details")
            return
        }

        let payload = {
            category: category,
            clothe: clothe,
            subType: subType,
            size: size,
            color: color,
            price: price,
            status: "IN_STOCK"
        }
        console.log("Payload: ", payload)
    }


    return(
        <ScrollView>
        <View style = {styles.container}>
            <DropDown
                placeholder = "Select category..."
                dropDownItems = {values.category}
                onChangeItem = {item =>{
                    console.log("Category chosen: ", item)
                    selectCategory(item.value)
                }}
            />
            <DropDown
                placeholder = "Select clothe..."
                dropDownItems = {values.clothe}
                onChangeItem = {item =>{
                    console.log("Category chosen: ", item)
                    selectClothe(item.value)
                }}
            />
            {
                showTypeDropdown && (
                    <DropDown
                        placeholder = "Select clothe sub category..."
                        dropDownItems = {type}
                        onChangeItem = {item =>{
                            console.log("Type chosen: ", item)
                            selectType(item.value)
                        }}
                    />
                )
            }
            <FormInput
                labelName = "Size"
                value = {size}
                onChangeText = {(text) => setSize(text)}
            />
            <FormInput
                labelName = "Color"
                value = {color}
                onChangeText = {(text) => setColor(text)}
            />
            <FormInput
                labelName = "Price"
                value = {price}
                onChangeText = {(text) => setPrice(text)}
            />
            <SubmitButton
                buttonTitle = "Submit"
                onPress = {addProduct}
            />
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        padding: 10
    }
})