import { View, Text } from 'react-native';
import React from 'react';
import MainButton from '../components/common/buttons/MainButton';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/core';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('login');
      })
      .catch((error) => {
        console.log(error.code, error.message);
        alert(error.message);
      });
  };
  return (
    <View>
      <MainButton onPress={handleSignOut} text={'Sign Out'} />
    </View>
  );
};

export default ProfileScreen;
