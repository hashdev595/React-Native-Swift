import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { BottomTabNavigator } from '../bottomtab/BottomTabNavigator';
import CreatePost from '../../screens/app/CreatePost/CreatePost';
import Messages from '../../screens/app/Chats/Messages'
import Contacts from '../../screens/app/Chats/Contacts';
import Chats from '../../screens/app/Chats/Chats';
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
      <Stack.Screen name={'Messages'} component={Messages}/>
      <Stack.Screen name={'Contacts'} component={Contacts}/>
      <Stack.Screen name={'Chats'} component={Chats}/>

    </Stack.Navigator>
  );
};

export {AppStack};
