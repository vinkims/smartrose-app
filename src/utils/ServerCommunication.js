import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function firebaseErrors(err){
    if (err.code === "auth/email-already-in-use"){
        alert("Email address already in use. Try again")
    }else if(err.code === "auth/invalid-email"){
        alert("Invalid email. Check the email & try again")
    }else if(err.code === "auth/operation-not-allowed"){
        alert("Email/password accounts are not enabled.")
    }else if(err.code === "auth/user-disabled"){
        alert("User has been diabled")
    }else if(err.code === "auth/user-not-found"){
        alert("There is no user corresponding to this email")
    }else if(err.code === "auth/weak-password"){
        alert("Password is weak. Enter a strong one")
    }else if(err.code === "auth/wrong-password"){
        alert("Invalid password. Try again")
    }else if(err.code === "auth/network-request-failed"){
        alert("No connection to server. Check your internet connection.")
    }
}

function basicResponseHandler(url, resp){
    
    if (resp.ok){
        return resp.json();
    } else if (resp.status === 400){
        return resp.json()
        .then( jsonResp =>{
            return {validationError: jsonResp}
        });
    } else{
        if (resp.status === 401 || resp.status === 403){
            console.log(`Auth Failed for URL, ${url}`);
        }
        throw Error(`Failed to call URL: ${url}, \nStatus code: ${resp.status}`)
    }
}


function get(url){
    return new Promise((resolve, reject) =>{
        AsyncStorage.getItem("token")
        .then(token =>{
            fetch(url, {
                headers:{
                    Accept: 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then( resp => basicResponseHandler(url, resp))
            .then(respJson =>{
                console.log('Successfully retrieved from URL ', respJson);
                resolve(respJson)
            })
            .catch(error =>{
                console.log('Error retrieving from url ', error)
                reject(error)
            })
        })
    })
}


function post(url, payload){
    return new Promise(async(resolve, reject) =>{
        AsyncStorage.getItem("token")
        .then(token =>{
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            .then(resp => basicResponseHandler(url, resp))
            .then(respJson => {
                resolve(respJson)
            })
            .catch(error =>{
                console.log('Error posting to url ', error)
                reject(error)
            })
        })
    })
}


function postNoAuth(url, payload){
    return new Promise(async(resolve, reject) =>{
        try{
            let request = {
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(payload)
            }

            const resp = await fetch(url, request);
            const json = basicResponseHandler(url, resp)
            resolve(json)
        } catch(error){
            console.log(`Error posting to url: ${url} `, error);
            reject(error)
        }
    })
}


function patch(url, payload){
    return new Promise(async(resolve, reject) =>{
        AsyncStorage.getItem("token")
        .then(token =>{
            fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })
            .then(resp => basicResponseHandler(url, resp))
            .then(respJson =>{
                resolve(respJson)
            })
            .catch(error =>{
                console.log('Error posting to url ', error)
                reject(error)
            })
        })
    })
}

export default{
    firebaseErrors,
    post,
    postNoAuth,
    patch,
    get
}