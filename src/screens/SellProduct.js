import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView, Modal} from 'react-native';
import {Card, CardItem} from 'native-base';

import globalStyles from '../config/globalStyles';
import {values} from '../config/values';
import DropDown from '../components/DropDown';
import SubmitButton from '../components/SubmitButton';
import DatabaseUtil from '../utils/DatabaseUtil';
import TableColumn from '../components/TableColumn';
import TableButton from '../components/TableButton';
import FormInput from '../components/FormInput';

const {width, height} = Dimensions.get('window')


export default function SellProductScreen({}){

    /*useEffect(() =>{
        getClothes()
    }, [])*/

    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [price, setPrice] = useState(0)
    const [clothe, setClothe] = useState('')
    const [clotheType, setClotheType] = useState('')
    const [clotheResult, setClotheResult] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [showPrice, setShowPrice] = useState(false)
    const [prodId, setProdId] = useState('')

    const getClothes = async() =>{
        
        DatabaseUtil.viewAllProducts()
        .then(resp =>{
            console.log("Clothes: ", resp)
        })

    }

    const selectClothe = async(val) =>{
        console.log(val)
        setClothe(val)
    }

    const selectCategory = (val) =>{
        console.log(val)
        if (!clothe){
            alert('Please select clothe above...')
            return
        }

        DatabaseUtil.getProductsToSell(clothe, val)
        .then(resp =>{
            setClotheResult(resp)
            setShowTable(true)
        })
    }

    const sell = (id) =>{
        setShowPrice(true)
        console.log("Data: ", id)
        setProdId(id)
    }

    const clearDetails = () =>{
        setShowPrice(false)
        setShowTable(false)
    }

    const submit = () =>{
        let payload = {
            price: price,
            status: "SOLD",
            timestamp: new Date().toISOString(),
            prod_id: prodId
        }
        console.log("Payload: ", payload)

        DatabaseUtil.sellProduct(payload)
    }

    return(
        <View style = {globalStyles.container}>
            <Text>Sell Product</Text>
            <DropDown
                placeholder = "Select clothe"
                dropDownItems = {values.clothe}
                onChangeItem = {item =>{
                    selectClothe(item.value)
                }}
            />
            
            <DropDown
                placeholder = "Select category..."
                dropDownItems = {values.category}
                onChangeItem = {item =>{
                    selectCategory(item.value)
                }}
            />
             

            <View style = {globalStyles.tableView}>
                {
                    showTable && (
                
                <Card>
                    <CardItem cardBody>
                        <TableColumn
                            cText = "Type"
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
                            cText = "Buying Price"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = ""
                            columnStyle = {globalStyles.tableColumnSeparator}
                        />
                    </CardItem>
                    {
                        clotheResult.map((item, index) =>
                            <CardItem style = {styles.tableRow} key = {index} cardBody>
                                <TableColumn
                                    cText = {item.clotheType}
                                    columnStyle = {globalStyles.tableValueColumn}
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
                                    cText = {item.price}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                                <TableButton
                                    title = "Sell"
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                    onPress = {() => sell(item.prod_id)}
                                />
                                
                            </CardItem>
                        )
                    }
            
                </Card>)
                }
            </View>
            {
                showPrice && (
                    <View style = {{alignItems: 'center'}}>
                        <FormInput
                            labelName = "Price"
                            value = {price}
                            onChangeText = {(number) => setPrice(number)}
                        />
                        <SubmitButton
                            buttonTitle = "Submit"
                            onPress = {submit}
                        />
                    </View>
                )
            }

            {
                showTable && (
                    <SubmitButton
                        buttonTitle = "Clear"
                        onPress = {clearDetails}
                    />
                )
            }

            
            
        </View>
    );
}

const styles = StyleSheet.create({
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
    }
})

// TODO: Show popup with clothe details for confirmation / cancelling