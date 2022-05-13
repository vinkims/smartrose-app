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

    formatDaysOfWeek(dateString) {
        let dayOfWeek = "Mon";
        switch(dateString) {
            case 1:
                dayOfWeek = "Mon";
                break;
            case 2:
                dayOfWeek = "Tue";
                break;
            case 3:
                dayOfWeek = "Wed";
                break;
            case 4:
                dayOfWeek = "Thu";
                break;
            case 5:
                dayOfWeek = "Fri";
                break;
            case 6:
                dayOfWeek = "Sat";
                break;
            case 0:
                dayOfWeek = "Sun";
                break;
        }
        return dayOfWeek;
    },

    formatPhoneNumber(phoneNo){
        if (phoneNo.startsWith("0")){
            return phoneNo.replace("0", "254")
        }else if (phoneNo.startsWith("+254")){
            return phoneNo.replace("+254", "254")
        }else{
            return number
        }
    },

    formatServerDate(dateString){
        if (!dateString || dateString.length === 0){
            return ''
        }
        
        const year = dateString.slice(0, 4)
        const month = dateString.slice(5, 7)
        const day = dateString.slice(8, 10)

        const dateObj = `${year}-${month}-${day}`

        return dateObj
    }
}