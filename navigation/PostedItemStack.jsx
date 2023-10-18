import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PostedLostItemsScreen from '../screens/PostedLostItemsScreen'
import PostedFoundItemsScreen from '../screens/PostedFoundItemsScreen'
import ResponseScreen from '../screens/responseScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const PostedLostItemStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#F0F9FF' },
        headerTitleAlign:'center',
      }}
    >
        <Stack.Screen 
        name="profile" 
        component={ProfileScreen} 
        options={{
          headerShown: false,
        headerStyle:{
            backgroundColor:'#0369A1',
        },
        headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },

        }} 
    />
    <Stack.Screen 
        name="Posted Lost Items" 
        component={PostedLostItemsScreen} 
        options={{
          headerShown: true,
        headerStyle:{
            backgroundColor:'#0369A1',
        },
        headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
        }} 
    />
    <Stack.Screen 
        name="Posted Found Items" 
        component={PostedFoundItemsScreen} 
        options={{
        headerStyle:{
            backgroundColor:'#0369A1',
        },
        headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
        }} 
    />
    <Stack.Screen 
        name="Requests" 
        component={ResponseScreen} 
        options={{
        headerStyle:{
            backgroundColor:'#0369A1',
        },
        headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
        }} 
    />
</Stack.Navigator>
  );
};

export default PostedLostItemStack;
