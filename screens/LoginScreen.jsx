import { KeyboardAvoidingView, TextInput, View, Text } from 'react-native';
import React from 'react';
import MainButton from '../components/buttons/MainButton';
import SecondaryButton from '../components/buttons/SecondaryButton';

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 justify-center items-center"
    >
      <Text className="text-3xl text-dark-blue font-bold mb-4 text-center">
        Welcome !
      </Text>
      <View className="w-4/5">
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Email"
          value={''}
          type="email"
        />
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Password"
          value={''}
          secureTextEntry
        />
      </View>
      <View>
        <MainButton containerStyles={'mt-4'} onPress={''} text="Login" />
        <SecondaryButton
          containerStyles={'mt-2'}
          onPress={''}
          text="Register"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
