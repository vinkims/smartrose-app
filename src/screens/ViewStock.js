import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {Card, CardItem} from 'native-base';

import globalStyles from '../config/globalStyles';
import DatabaseUtil from '../utils/DatabaseUtil';
import TableColumn from '../components/TableColumn';
import SubmitButton from '../components/SubmitButton';
import FormattingUtil from '../utils/FormattingUtil';

const {width, height} = Dimensions.get('window');

export default function ViewStockScreen(){

    const [clothes, setClothes] = useState([])
    const [soldStock, setSoldStock] = useState([])
    const [showSold, setShowSold] = useState(false)

    useEffect(() =>{
        DatabaseUtil.getProductsInStock()
        .then(resp =>{
            console.log('Products: ', resp)
            setClothes(resp)
        })
    }, [])


    const viewSold = () =>{
        setShowSold(true)
        DatabaseUtil.getSoldProducts()
        .then(resp => {
            console.log("Sold: ", resp)
            setSoldStock(resp)
        })
    }

    const renderTable = () =>{
        return(
            <View style = {globalStyles.tableView}>
                <Card>
                    <CardItem cardBody>
                        <TableColumn
                            cText = "Name"
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = "Type"
                            columnStyle = {globalStyles.tableColumnSeparator}
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
                            cText = "Buying Price"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                    </CardItem>
                    {
                        clothes.map((item, index) =>
                            <CardItem style = {styles.tableRow} key = {index} cardBody>
                                <TableColumn
                                    cText = {item.clothe}
                                    columnStyle = {globalStyles.tableValueColumn}
                                />
                                <TableColumn
                                    cText = {item.clotheType}
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
                                    cText = {item.price}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                            </CardItem>
                        )
                    }
                </Card>
            </View>
        );
    }

    const renderSoldTable = () =>{
        return(
            <View style = {globalStyles.tableView}>
                <Card>
                    <CardItem cardBody>
                        <TableColumn
                            cText = "Name"
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = "Type"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = "Size"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = "Selling Price"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = "Profit"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                        <TableColumn
                            cText = "Date Sold"
                            columnStyle = {globalStyles.tableColumnSeparator}
                            textStyle = {styles.headingText}
                        />
                    </CardItem>
                    {
                        soldStock.map((item, index) =>
                            <CardItem style = {styles.tableRow} key = {index} cardBody>
                                <TableColumn
                                    cText = {item.clothe}
                                    columnStyle = {globalStyles.tableValueColumn}
                                />
                                <TableColumn
                                    cText = {item.clotheType}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                                <TableColumn
                                    cText = {item.size}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                                <TableColumn
                                    cText = {item.sellingPrice}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                                <TableColumn
                                    cText = {item.profit}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                                <TableColumn
                                    cText = {FormattingUtil.formatDate(item.soldDate)}
                                    columnStyle = {globalStyles.tableColumnSeparator}
                                />
                            </CardItem>
                        )
                    }
                </Card>
            </View>
        );
    }

    return(
        <ScrollView>
            <View style = {globalStyles.container}>
                <Text>Stock</Text>
                <ScrollView style = {styles.tableScroll}>
                    {renderTable()}
                </ScrollView>

                <SubmitButton
                    buttonTitle = "View Sold"
                    onPress = {viewSold}
                />
                <ScrollView style = {styles.tableScroll}>
                    { showSold && renderSoldTable() }
                </ScrollView>
            
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        height: height / 3.5
    }
})