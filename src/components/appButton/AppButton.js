import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const AppButton = ({lable, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style.buttonStyle}>
      <Text style={{color:'#ffff', fontSize:20, textAlign:'center', padding:10}}>{lable}</Text>
    </TouchableOpacity>
  )
}

export {AppButton}

const style = StyleSheet.create({
    buttonStyle:{
        backgroundColor:'#1F41BB',
        borderRadius:8
    }
})