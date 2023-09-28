import { View, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MainButton from '../components/common/buttons/MainButton';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>HomeScreen</Text>
      <MainButton
        text={'Profile'}
        onPress={() => navigation.navigate('profile')}
      />
    </View>
  );
};

export default HomeScreen;
