import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {Card, CardItem} from 'native-base';

import globalStyles from '../config/globalStyles';
import DatabaseUtil from '../utils/DatabaseUtil';
import TableColumn from '../components/TableColumn';

const {width, height} = Dimensions.get('window');

export default function ViewStockScreen(){

    const [clothes, setClothes] = useState([])

    useEffect(() =>{
        DatabaseUtil.viewAllProducts()
        .then(resp =>{
            console.log('Products: ', resp)
            setClothes(resp)
        })
    }, [])

    return(
        <ScrollView>
            <View style = {globalStyles.container}>
                <Text>Stock</Text>
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
                {/*
                    clothes.map((item, index) =>
                        <View key = {index}>
                            <Text>Name: {item.clothe}</Text>
                            <Text>Price: {item.price}</Text>
                        </View>
                        
                    )
                */}
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
    }
})