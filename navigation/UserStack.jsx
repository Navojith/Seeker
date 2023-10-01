import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileIcon from 'react-native-vector-icons/EvilIcons';
import LeaderBoardIcon from 'react-native-vector-icons/SimpleLineIcons';
import LeaderBoard from '../screens/LeaderBoardScreen';
import FoundScreen from '../screens/FoundScreen';
import LostScreen from '../screens/LostScreen';
import Header from '../components/header'

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
          name="Leader Board"
          component={LeaderBoard}
          options={{
            tabBarIcon: () => <LeaderBoardIcon name="chart" size={30} />,
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
          name="Found"
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
          name="Missing"
          component={LostScreen}
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
          name="Profile"
          component={ProfileScreen}
          options={{
            header: () => <Header title="Profile" />,
            tabBarIcon: () => <ProfileIcon name="user" size={48} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
