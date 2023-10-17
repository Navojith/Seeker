import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateLostItemScreen from '../screens/CreateLostItemScreen';
import LostScreen from '../screens/LostScreen';
import { AddLostItem, BuyBoost } from '../constants/RouteConstants';
import BuyBoostScreen from '../screens/purchase/BuyBoost';

const Stack = createStackNavigator();

const LostItemStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F0F9FF' },
      }}
    >
      <Stack.Screen name="Lost" component={LostScreen} />
      <Stack.Screen
        name={AddLostItem}
        component={CreateLostItemScreen}
        navigation={navigation}
      />
      <Stack.Screen
        name={BuyBoost}
        component={BuyBoostScreen}
        navigation={navigation}
        options={{ title: 'Boost' }}
      />
    </Stack.Navigator>
  );
};

export default LostItemStack;
