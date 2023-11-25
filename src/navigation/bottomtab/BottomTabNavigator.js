import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Feeds from '../../screens/app/Feeds/Feeds';
import Store from '../../screens/app/Store/Store';
import Profile from '../../screens/app/Profile/Profile';
import Messages from '../../screens/app/Messages/Messages';
import { View } from 'react-native';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const inactiveColor = '#ffff'; // Default color for inactive tabs
  const activeColor = '#1F41BB';
  const getTabBarIcon = (iconName, focused) => (
    <Icon
      name={iconName}
      color={focused ? inactiveColor : activeColor}
      size={focused ? 35 : 25} // You can adjust the size based on focus
    />
  );

  return (
    <View style={{flex:1}}>
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          width: '70%',
          alignSelf: 'center',
          bottom: 10,
          borderTopLeftRadius: 20, // Adjust the border radius as needed
          borderTopRightRadius: 20, // Adjust the border radius as needed
          borderBottomLeftRadius: 20,
          borderBottomRightRadius:20,
          overflow:'hidden',
        },
        tabBarActiveBackgroundColor: '#1F41BB',
       
        tabBarIcon: ({focused}) => {
          let iconName;

          switch (route.name) {
            case 'Feeds':
              iconName = 'home-outline';
              break;
            case 'Store':
              iconName = 'storefront-outline';
              break;
            case 'Profile':
              iconName = 'person-circle-outline';
              break;
            case 'Messages':
              iconName = 'chatbubbles-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return getTabBarIcon(iconName, focused);
        },
        tabBarLabel: () => null,
      })}
      initialRouteName="Feeds">
      {/* Your Tab Screens Here */}
      <Tab.Screen
        options={{tabBarLabel: () => null}}
        name="Feeds"
        component={Feeds}
      />
      <Tab.Screen
        options={{tabBarLabel: () => null}}
        name="Store"
        component={Store}
      />
      <Tab.Screen
        options={{tabBarLabel: () => null}}
        name="Profile"
        component={Profile}
      />
      <Tab.Screen
        options={{tabBarLabel: () => null}}
        name="Messages"
        component={Messages}
      />
    </Tab.Navigator></View>
  );
};

export {BottomTabNavigator};
