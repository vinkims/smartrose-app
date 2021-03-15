import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {Card, CardItem} from 'native-base';

import globalStyles from '../config/globalStyles';
import {values} from '../config/values';
import DropDown from '../components/DropDown';
import SubmitButton from '../components/SubmitButton';
import DatabaseUtil from '../utils/DatabaseUtil';
import TableColumn from '../components/TableColumn';

const {width, height} = Dimensions.get('window')


export default function SellProductScreen({}){

    /*useEffect(() =>{
        getClothes()
    }, [])*/

    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [price, setPrice] = useState('')
    const [clothe, setClothe] = useState('')
    const [clotheType, setClotheType] = useState('')
    const [clotheResult, setClotheResult] = useState([])
    const [showTable, setShowTable] = useState(false)

    const getClothes = async() =>{
        
        DatabaseUtil.viewAllProducts()
        .then(resp =>{
            console.log("Clothes: ", resp)
        })

    }

    const selectClothe = async(val) =>{
        console.log(val)
        setClothe(val)

        DatabaseUtil.getProductByName(val)
        .then(resp =>{
            console.log(resp)
            setClotheResult(resp)
            //setShowCategory(true)
        })
        
    }

    const selectCategory = (val) =>{
        console.log(val)

        DatabaseUtil.getProducts(clothe, val)
        .then(resp =>{
            setClotheResult(resp)
            setShowTable(true)
        })
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
                                
                            </CardItem>
                        )
                    }
            
                </Card>)
                }
            </View>
            {
                showTable && (
                    <SubmitButton
                        buttonTitle = "Clear"
                        onPress = {() => setShowTable(false)}
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