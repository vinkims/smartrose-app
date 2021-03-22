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
                    'CREATE TABLE IF NOT EXISTS table_product(prod_id INTEGER PRIMARY KEY AUTOINCREMENT, clothe VARCHAR(30), category VARCHAR(30), clotheType VARCHAR(30), color VARCHAR(30), price INTEGER(10), size VARCHAR(30), status VARCHAR(30), timestamp VARCHAR(40), soldDate VARCHAR(40), sellingPrice VARCHAR(10) )', 
                    []
                );
            }
        }
        );
    });
}

/*function initializeDB(){
    db.transaction(function (txn){
        txn.executeSql("SELECT name from sqlite_master WHERE type='table' AND name='table_product'",
        [],
        function(tx, res){
            console.log('Product: ', res.rows.length)
            if (res.rows.length == 0){
                tx.executeSql('DROP TABLE IF EXISTS table_product', []);
                tx.executeSql('CREATE TABLE IF NOT EXISTS table_product(id INTEGER PRIMARY KEY AUTOINCREMENT, clothe VARCHAR(30), clotheType VARCHAR(30), category_id INTEGER, size VARCHAR(30), status_id INTEGER, color VARCHAR(20) )',
                []);
            }
        }
        );
    });

    db.transaction(function (txn){
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='category'",
        [],
        function(tx, res){
            console.log('Category: ', res.rows.length)
            if (res.rows.length == 0){
                tx.executeSql('DROP TABLE IF EXISTS category', []);
                tx.executeSql('CREATE TABLE IF NOT EXISTS category(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20) ) ', []);
            }
        }
        );
    });

    db.transaction(function (txn){
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='status'",
        [],
        function(tx, res){
            console.log('Status: ', res.rows.length)
            if (res.rows.length == 0){
                tx.executeSql('DROP TABLE IF EXISTS status', []);
                tx.executeSql('CREATE TABLE IF NOT EXISTS status(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), description VARCHAR(255) ) ', []);
            }
        }
        );
    });

    db.transaction(function (txn){
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='buying'",
        [],
        function(tx, res){
            console.log('Buying: ', res.rows.length)
            if (res.rows.length == 0){
                tx.executeSql('DROP TABLE IF EXISTS buying', []);
                tx.executeSql('CREATE TABLE IF NOT EXISTS buying(id INTEGER PRIMARY KEY AUTOINCREMENT, buying_price INTEGER, buying_date VARCHAR(30), clothe_id INTEGER AUTOINCREMENT) ', []);
            }
        }
        );
    });

    db.transaction(function (txn){
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='selling'",
        [],
        function (tx, res){
            console.log('Selling: ', res.rows.length)
            if (res.rows.length == 0){
                tx.executeSql('DROP TABLE IF EXISTS selling', []);
                tx.executeSql('CREATE TABLE IF NOT EXISTS selling(id INTEGER PRIMARY KEY AUTOINCREMENT, selling_price INTEGER, selling_date VARCHAR(30), clothe_id INTEGER )', []);
            }
        }
        );
    });

    // TODO: Insert values for category and status tables
}*/

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

    return new Promise((resolve, reject) =>{
        db.transaction(function (tx){
            tx.executeSql('INSERT INTO table_product (clothe, category, clotheType, color, price, size, status, timestamp) VALUES (?,?,?,?,?,?,?,?)',
            [clothe, category, clotheType, color, price, size, status, timestamp],
            (tx, results) =>{
                console.log('Results', results.rowsAffected)
                if (results.rowsAffected > 0){
                    console.log('Products updated successfully')
                    resolve(200)
                }else{
                    console.log("Products update failed")
                    reject(400)
                }
            }
            );
        });
    })
}

/*function saveClothe(payload){
    console.log(payload)

    let clothe = payload.clothe
    let categoryId = payload.category
    let clotheType = payload.type
    let color = payload.color
    let buyingPrice = payload.price
    let size = payload.size
    let statusId = payload.status_id
    let buyingDate = payload.timestamp

    return new Promise((resolve, reject) =>{
        db.transaction(function (tx){
            tx.executeSql('INSERT INTO table_product (clothe, clotheType, category_id, size, status_id, color)',
            [clothe, clotheType, categoryId, size, statusId, color],
            (tx, results) =>{
                console.log('Save results: ', results.rowsAffected)
                if (results.rowsAffected > 0){
                    console.log('Clothes updated')
                    resolve(200)
                }else{
                    console.log('Updates failed')
                    reject(400)
                }
            }
            );

            tx.executeSql('INSERT INTO buying (buying_price, buying_date, clothe_id)', 
            [buyingPrice, buyingDate],
            (tx, results) =>{
                console.log('Transaction: ', results.rowsAffected)
                if (results.rowsAffected > 0){
                    console.log('Buying updated')
                }else{
                    console.log('Buying update failed')
                }
            }
            );
        });

        db.transaction(function (tx){
            tx.executeSql('INSERT INTO buying (buying_price, buying_date, clothe_id)', 
            [buyingPrice, buyingDate],
            (tx, results) =>{
                console.log('Transaction: ', results.rowsAffected)
                if (results.rowsAffected > 0){
                    console.log('Buying updated')
                }else{
                    console.log('Buying update failed')
                }
            }
            );
        });
    })
}*/

function saveDefault(){
    db.transaction(function (tx){
        tx.executeSql('INSERT INTO table_product (clothe, category, clotheType, color, price, size, status) VALUES (?,?,?,?,?,?,?,?) ',
        ['Trousers', 'Gents', 'Jeans', 'Black', 1000, '36', 'IN_STOCK'],
        (tx, results) =>{
            console.log('Results: ', results.rowsAffected)
            if (results.rowsAffected > 0){
                console.log('Products updated successfully')
            }else{
                console.log("Products saving failed")
            }
        }
        )
    })
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

function getProducts(name, category){
    return new Promise((resolve) =>{
        db.transaction((tx) =>{
            tx.executeSql('SELECT * FROM table_product WHERE clothe = ? AND category = ? ORDER BY clotheType', 
            [name, category],
            (tx, results) =>{
                console.log('Length: ', results.rows.length)
                var temp = []
                if (results.rows.length == 0){
                    alert('Clothe not found')
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

function sellProduct(payload){
    console.log(payload)
    
    let price = payload.price
    let id = payload.prod_id
    let status = payload.status
    let timestamp = payload.timestamp
    
    return new Promise((resolve, reject) => {
        db.transaction((tx ) =>{
            tx.executeSql('UPDATE table_product set sellingPrice=?, soldDate=?, status=? WHERE prod_id=?', 
            [price, timestamp, status, id],
            (tx, results) =>{
                console.log('Results', results.rowsAffected);
                if (results.rowsAffected > 0){
                    console.log('Results updated successfully')
                    resolve(200)
                }else{
                    console.log('Update failed')
                    reject(400)
                }
            }
            );
        });
    })
}


function getSoldProducts(){
    return new Promise((resolve) =>{
        db.transaction((tx) =>{
            tx.executeSql('SELECT * FROM table_product WHERE status=?', 
            ['SOLD'],
            (tx, results) =>{
                console.log('Length: ', results.rows.length)
                var temp = []
                if (results.rows.length == 0){
                    alert('No products in stock')
                    return
                }
                for (let i = 0; i < results.rows.length; i++){
                    temp.push(results.rows.item(i))
                }
                resolve(temp)
            }
            );
        })
    })

}

function getProductsInStock(){
    return new Promise((resolve) =>{
        db.transaction((tx) =>{
            tx.executeSql('SELECT * FROM table_product WHERE status=?', 
            ['IN_STOCK'],
            (tx, results) =>{
                console.log('Length: ', results.rows.length)
                var temp = []
                if (results.rows.length == 0){
                    alert('No products in stock')
                    return
                }
                for (let i = 0; i < results.rows.length; i++){
                    temp.push(results.rows.item(i))
                }
                resolve(temp)
            }
            );
        })
    })

}


function getProductsToSell(name, category){
    return new Promise((resolve) =>{
        db.transaction((tx) =>{
            tx.executeSql('SELECT * FROM table_product WHERE status=? AND (clothe = ? AND category = ?)', 
            ['IN_STOCK', name, category],
            (tx, results) =>{
                console.log('Length: ', results.rows.length)
                var temp = []
                if (results.rows.length == 0){
                    alert('No products in stock')
                    return
                }
                for (let i = 0; i < results.rows.length; i++){
                    temp.push(results.rows.item(i))
                }
                resolve(temp)
            }
            );
        })
    })

}

export default{
    initDB,
    saveProduct,
    viewAllProducts,
    getProductByName,
    saveDefault,
    getProducts,
    sellProduct,
    getSoldProducts,
    getProductsInStock,
    getProductsToSell,
    //initializeDB,
    //saveClothe
}