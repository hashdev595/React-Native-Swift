import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Header = ({lable, leftIcon, rightIcon, rightIcon2, leftOnPress}) => {
  return (
    <View style={styles.mainHeaderContainer}>
      <View style={styles.leftView}>
        <TouchableOpacity onPress={leftOnPress}>
        <Image
          resizeMode="contain"
          style={{height: 25, width: 25}}
          source={leftIcon}
        /></TouchableOpacity>
      </View>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>{lable}</Text>
      </View>
      <View style={styles.rightView}>
        <Image
          resizeMode="contain"
          style={{height: 25, width: 25}}
          source={rightIcon}
        />
        <Image
          resizeMode="contain"
          style={{height: 25, width: 25}}
          source={rightIcon2}
        />
      </View>
    </View>
  );
};

export {Header};

const styles = StyleSheet.create({
  mainHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('10%'),
    alignSelf:'center',
    top:20,
    // position:'relative'
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F41BB',
  },
  leftView: {
    width: wp('20%'),
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'flex-start',
  },
  rightView: {
    flexDirection: 'row',
    width: wp('20%'),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerView: {
    width: wp('50%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
