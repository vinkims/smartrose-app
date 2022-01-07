export default {
  logDebug(info, ...extra){
    console.log('DEBUG -> ', info, ...extra);
  },
  logError(err, ...extra){
    console.log('ERROR -> ', err, ...extra);
  },
  logInformation(info, ...extra){
    console.log('INFO -> ', info, ...extra);
  }
}