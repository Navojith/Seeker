import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CreateLostItemScreen from '../screens/CreateLostItemScreen';
import LostScreen from '../screens/LostScreen';
import PostBoostingScreen from '../screens/PostBoostingScreen';
import {
  AddLostItem,
  BuyBoost,
  LeaderboardPost,
  PostBoosting,
} from '../constants/RouteConstants';
import Header from '../components/header';
import BuyBoostScreen from '../screens/purchase/BuyBoost';
import LostItem from '../screens/LostItem';
import LeaderboardItemScreen from '../screens/LeaderboardItemScreen';
const Stack = createStackNavigator();

const LostItemStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        cardStyle: { backgroundColor: '#F0F9FF' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Lost"
        component={LostScreen}
        options={{
          headerStyle: {
            backgroundColor: '#0369A1',
          },
          headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
          headerTitle: 'Lost Items',
        }}
      />
      <Stack.Screen
        name={AddLostItem}
        component={CreateLostItemScreen}
        options={{
          headerStyle: {
            backgroundColor: '#0369A1',
          },
          headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name={PostBoosting}
        component={PostBoostingScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Post Boosting" />,
        }}
      />
      <Stack.Screen
        name={BuyBoost}
        component={BuyBoostScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Purchase Boost" />,
        }}
      />
      <Stack.Screen
        name="Item"
        component={LostItem}
        options={{
          headerStyle: {
            backgroundColor: '#0369A1',
          },
          headerTintColor: '#fff', // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name={LeaderboardPost}
        component={LeaderboardItemScreen}
        options={{
          headerShown: true,
          header: () => <Header title="Search item" />,
        }}
      />
    </Stack.Navigator>
  );
};

export default LostItemStack;
