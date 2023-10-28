import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileIcon from 'react-native-vector-icons/EvilIcons';
import LeaderBoardIcon from '../assets/icons/LeaderboadIcon';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import CustomHeader from '../components/header';
import FoundScreen from '../screens/FoundScreen';
import LostItemStack from './LostItemStack';
import {
  Profile,
  LeaderBoard,
  FoundItems,
  LostItems,
} from '../constants/RouteConstants';
import { ScreenContainer } from 'react-native-screens';
import PostedItemStack from './PostedItemStack';
import FoundItemStack from './FoundItemStack';
import FoundIcon from '../assets/icons/FoundIcon';
import LostIcon from '../assets/icons/LostIcon';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

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
          headerShown:
            route.name !== LostItems && route.name !== FoundItems
              ? true
              : false,
        })}
        sceneContainerStyle={{ backgroundColor: '#F0F9FF' }}
      >
        <Tab.Screen
          name={LeaderBoard}
          component={LeaderBoardScreen}
          options={{
            header: () => <CustomHeader title="Leaderboard" />,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MatIcon name="leaderboard" size={30} color={'white'} />
              ) : (
                <MatIcon name="leaderboard" size={30} color={'black'} />
              ),
          }}
        />
        <Tab.Screen
          name={FoundItems}
          component={FoundItemStack}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntIcon
                  name="checkcircle"
                  size={30}
                  style={{ marginTop: 5 }}
                  color="white"
                />
              ) : (
                <AntIcon
                  name="checkcircle"
                  size={30}
                  style={{ marginTop: 5 }}
                  color="black"
                />
              ),
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
          name={LostItems}
          component={LostItemStack}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntIcon
                  name="closecircle"
                  size={30}
                  style={{ marginTop: 5 }}
                  color="white"
                />
              ) : (
                <AntIcon
                  name="closecircle"
                  size={30}
                  style={{ marginTop: 5 }}
                  color="black"
                />
              ),
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
          component={PostedItemStack}
          options={{
            // header: () => <Header title="Profile" />,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <ProfileIcon
                  name="user"
                  size={48}
                  style={{ marginTop: -10 }}
                  color="white"
                />
              ) : (
                <ProfileIcon
                  name="user"
                  size={48}
                  style={{ marginTop: -10 }}
                  color="black"
                />
              ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
