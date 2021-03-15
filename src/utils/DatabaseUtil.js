import React from 'react';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Smartrose.db'})

function initDB(){
    db.transaction(function (txn){
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='table_product'",
        [],
        function (tx, res){
            console.log('item: ', res.rows.length)
            if (res.rows.length == 0){
                tx.executeSql('DROP TABLE IF EXISTS table_product', []);
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS table_product(prod_id INTEGER PRIMARY KEY AUTOINCREMENT, clothe VARCHAR(30), category VARCHAR(30), clotheType VARCHAR(30), color VARCHAR(30), price VARCHAR(30), size VARCHAR(30), status VARCHAR(30), timestamp VARCHAR(40) )', []
                );
            }
        }
        );
    });
}

function saveProduct(payload){
    console.log(payload)

    let clothe = payload.clothe
    let category = payload.category
    let clotheType = payload.subType
    let color = payload.color
    let price = payload.price
    let size = payload.size
    let status = payload.status
    let timestamp = payload.timestamp

    db.transaction(function (tx){
        tx.executeSql('INSERT INTO table_product (clothe, category, clotheType, color, price, size, status, timestamp) VALUES (?,?,?,?,?,?,?,?)',
        [clothe, category, clotheType, color, price, size, status, timestamp],
        (tx, results) =>{
            console.log('Results', results.rowsAffected)
            if (results.rowsAffected > 0){
                console.log('Products updated successfully')
            }else{
                console.log("Products update failed")
            }
        }
        );
    });
}

function viewAllProducts(){
    return new Promise((resolve) =>{
        db.transaction((tx) =>{
            tx.executeSql('SELECT * FROM table_product', [],
            (tx, results) =>{
                var temp = []
                for (let i = 0; i < results.rows.length; i++){
                    temp.push(results.rows.item(i))
                }
                console.log(temp)
                resolve(temp)
            }
            )
        })
    })
}

function getProductByName(clothe){
    return new Promise((resolve) =>{
        db.transaction((tx) =>{
            tx.executeSql('SELECT * FROM table_product WHERE clothe = ?', 
            [clothe],
            (tx, results) =>{
                console.log('Length: ', results.rows.length)
                var temp = []
                if (results.rows.length == 0){
                    alert('Product not found')
                    return
                }
                for (let i = 0; i < results.rows.length; i++){
                    temp.push(results.rows.item(i))
                }
                console.log(temp)
                resolve(temp)
            }
            )
        })
    })
}

export default{
    initDB,
    saveProduct,
    viewAllProducts,
    getProductByName
}