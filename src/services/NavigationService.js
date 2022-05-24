import { CommonActions } from '@react-navigation/native';

let navigation;

function navigate(routeName){
  navigation.navigate(routeName);
}

function reset(routeName){
  navigation.reset({
    index: 0,
    routes: [{ name: routeName }]
  })
}

function resetToRoute(routeName){
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: routeName}]
    })
  )
}

function setRootNavigator(rootNavigatorRef){
  navigation = rootNavigatorRef
}

export default{
  navigate,
  reset,
  resetToRoute,
  setRootNavigator
}