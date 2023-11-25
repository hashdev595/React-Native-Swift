import {ImageBackground} from 'react-native';
import React from 'react';
import {appImages} from '../../assets';

const Background = ({children}) => {
  return (
    <ImageBackground
      source={appImages.bg}
      resizeMode={'stretch'}
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
      //   blurRadius={90}
      tintColor={'#F1F4FF'}>
      {children}
    </ImageBackground>
  );
};

export {Background};
