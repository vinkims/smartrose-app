import React from 'react';

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

export default{
    firebaseErrors
}