import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateLostItemScreen from '../screens/CreateLostItemScreen';
import LostScreen from '../screens/LostScreen';
import { AddLostItem } from '../constants/RouteConstants';

const Stack = createStackNavigator();

const LostItemStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F0F9FF' },
      }}
    >
      <Stack.Screen name="Lost" component={LostScreen} />
      <Stack.Screen name={AddLostItem} component={CreateLostItemScreen} />
    </Stack.Navigator>
  );
};

export default LostItemStack;
