import React from 'react';
import MainStack from './src/navigation';
import { StatusBar } from 'react-native';
const App = () => {
  return (
    <>
    <StatusBar backgroundColor={'transparent'} networkActivityIndicatorVisible={true} barStyle={'dark-content'} translucent={true} showHideTransition={'slide'}/>
      <MainStack/>
    </>
  );
};
export default App;
