import { KeyboardAvoidingView, TextInput, View, Text } from 'react-native';
import React, { useState } from 'react';
import MainButton from '../components/common/buttons/MainButton';
import SecondaryButton from '../components/common/buttons/SecondaryButton';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      behavior="height"
      className="flex-1 mt-4 justify-center items-center"
    >
      <Text className="text-3xl text-dark-blue font-bold mb-4 text-center">
        Welcome !
      </Text>
      <View className="w-4/5">
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          type="email"
        />
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
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
