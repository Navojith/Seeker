import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileIcon from 'react-native-vector-icons/EvilIcons';
import LeaderBoardIcon from '../assets/icons/LeaderboadIcon';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import FoundScreen from '../screens/FoundScreen';
import LostItemStack from './LostItemStack';
import {
  Profile,
  LeaderBoard,
  FoundItems,
  LostItems,
} from '../constants/RouteConstants';
import { ScreenContainer } from 'react-native-screens';
import PostedLostItemStack from './PostedLostItemStack';

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
          tabBarHideOnKeyboard: true,
          headerShown: route.name !== LostItems ? true : false,
        })}
        sceneContainerStyle={{ backgroundColor: '#F0F9FF' }}
      >
        <Tab.Screen
          name={LeaderBoard}
          component={LeaderBoardScreen}
          options={{
            header: () => <Header title="Leaderboard" />,
            tabBarIcon: () => <LeaderBoardIcon name="chart" size={30} />,
          }}
        />
        <Tab.Screen
          name={FoundItems}
          component={FoundScreen}
          options={{
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
            headerStyle: {
              backgroundColor: '#0369A1',
            },
            headerTintColor: '#fff', // Change this color for the text/icon color
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 28,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Tab.Screen
          name={LostItems}
          component={LostItemStack}
          options={{
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
            // headerStyle: {
            //   backgroundColor: '#0369A1',
            // },
            // headerTintColor: '#fff', // Change this color for the text/icon color
            // headerTitleStyle: {
            //   fontWeight: 'bold',
            //   fontSize: 28,
            // },
            // headerTitleAlign: 'center',
          }}
        />
        <Tab.Screen
          name={Profile}
          component={PostedLostItemStack}
          options={{
            // header: () => <Header title="Profile" />,
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
