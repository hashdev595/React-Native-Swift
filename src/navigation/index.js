import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './stack/AuthStack';
import {AppStack} from './stack/AppStack';

const Stack = createNativeStackNavigator();
const MainStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Auth'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Auth'} component={AuthStack} />
        <Stack.Screen name={'App'} component={AppStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;
