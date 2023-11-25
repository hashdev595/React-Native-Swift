import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';

import {appIcons} from '../../assets';

const AppInput = ({
  placeholder,
  lable,
  secureTextEntry,
  value,
  onChangeText,
}) => {
  const [show, setShow] = useState(secureTextEntry);
  const [focus, setFocus] = useState(false);

  return (
    <View>
      <Text
        style={[
          styles.lable,
          {
            marginTop: lable ? 18 : 0,
            marginBottom: 5,
            fontWeight: '500',
          },
        ]}>
        {lable}
      </Text>
      <View style={[styles.secureInput, {borderWidth: focus ? 1 : 0}]}>
        <View style={{width: '90%'}}>
          <TextInput
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => {
              setFocus(false);
            }}
            placeholderTextColor={'grey'}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={show}
            style={styles.inputContainer}
            placeholder={placeholder}
          />
        </View>
        {secureTextEntry && (
          <View style={{width: '10%', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                setShow(!show);
              }}>
              {show ? (
                <Image
                  resizeMode="contain"
                  style={styles.imageStyle}
                  source={appIcons.eyeHide}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={[styles.imageStyle, {height: 30, width: 25}]}
                  source={appIcons.eye}
                />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export {AppInput};

const styles = StyleSheet.create({
  inputContainer: {
    paddingLeft: 10,
    width: '100%',
    alignSelf: 'center',
    color:'black'
  },
  lable: {
    color: 'black',
  },
  imageStyle: {
    marginRight: 30,
    height: 20,
    width: 20,
    resizeMode: 'center',
    alignSelf: 'center',
  },

  secureInput: {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#1F41BB',
    borderRadius: 8,
    backgroundColor: '#F1F4FF',
  },
});
