import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileIcon from 'react-native-vector-icons/EvilIcons';
import LeaderBoardIcon from 'react-native-vector-icons/SimpleLineIcons';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import FoundScreen from '../screens/FoundScreen';
import LostItemStack from './LostItemStack';
import {
  Profile,
  LeaderBoard,
  FoundItems,
  LostItems,
} from '../constants/RouteConstants';

const Tab = createBottomTabNavigator();

const UserStack = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
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
          tabBarLabelStyle: {
            fontWeight: 'bold',
            color: '#000',
            fontSize: 14,
          },
        })}
      >
        <Tab.Screen
          name={LeaderBoard}
          component={LeaderBoardScreen}
          options={{
            tabBarIcon: () => <LeaderBoardIcon name="chart" size={30} />,
          }}
        />
        <Tab.Screen
          name={FoundItems}
          component={FoundScreen}
          options={{
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
          }}
        />
        <Tab.Screen
          name={LostItems}
          component={LostItemStack}
          options={{
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
          }}
        />
        <Tab.Screen
          name={Profile}
          component={ProfileScreen}
          options={{
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
