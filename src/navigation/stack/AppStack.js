import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { BottomTabNavigator } from '../bottomtab/BottomTabNavigator';
import CreatePost from '../../screens/app/CreatePost/CreatePost';

const Stack = createNativeStackNavigator();
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'BottomTabNavigator'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'BottomTabNavigator'} component={BottomTabNavigator}/>
      <Stack.Screen name={'CreatePost'} component={CreatePost}/>
    </Stack.Navigator>
  );
};

export {AppStack};
