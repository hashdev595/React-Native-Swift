import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//Screens
import Login from '../../screens/auth/login/Login';
import SignUp from '../../screens/auth/signUp/SignUp';
import {NavigationContainer} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'Login'} component={Login} />
        <Stack.Screen name={'SignUp'} component={SignUp} />
      </Stack.Navigator>
  );
};

export {AuthStack};
