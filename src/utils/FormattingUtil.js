module.exports = {
    formatDate(dateString){
        if (!dateString || dateString.length === 0){
            return ''
        }

        // Get parameters to create date object
        const year = dateString.slice(0, 4)
        const month = dateString.slice(5, 7)
        const day = dateString.slice(8, 10)
        /*const hour = dateString.slice(11, 13)
        const minute = dateString.slice(14, 16)
        const second = dateString.slice(17, 19)*/

        // Make an object with the data
        //const dateObj = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`)
        const dateObject = `${day}-${month}-${year}`
        
        return dateObject       
    },

    formatPhoneNumber(phoneNo){
        if (phoneNo.startsWith("0")){
            return phoneNo.replace("0", "254")
        }else if (phoneNo.startsWith("+254")){
            return phoneNo.replace("+254", "254")
        }else{
            return number
        }
    }
}