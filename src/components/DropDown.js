import React from 'react';
import {Dimensions} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('screen')

export default function DropDown({dropDownItems, placeholder, wdth, ...rest}){
    return(
        <DropDownPicker
            items = {dropDownItems}
            placeholder = {placeholder}
            customArrowDown = {() => <Icon name = "arrow-down" size = {18} />}
            customArrowUp = {() => <Icon name = "arrow-up" size = {18} />}
            containerStyle = {{height: 60, width: wdth, paddingTop: 10}}
            itemStyle = {{justifyContent: 'flex-start'}}
            labelStyle = {{fontSize: 15}}
            {...rest}
        />
    );
}