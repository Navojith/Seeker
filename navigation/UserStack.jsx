import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const UserStack = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#0284C7',
            height: 70,
            paddingBottom: 10,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            borderTopWidth: 3,
            borderLeftWidth: 3,
            borderRightWidth: 3,
            borderBottomWidth: 0,
            borderColor: '#000',
          },
        }}
        sceneContainerStyle={{}}
      >
        <Tab.Screen name="Home" component={HomeScreen} 
        />
        <Tab.Screen name="Profile" component={ProfileScreen} 
        options={{
            tabBarIcon: ({focused} => (
                
            ))
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
