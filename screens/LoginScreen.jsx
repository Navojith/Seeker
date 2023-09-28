import { KeyboardAvoidingView, TextInput, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import MainButton from '../components/common/buttons/MainButton';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Signed in with ', user.email);
      })
      .catch((error) => {
        console.log(error.code, error.message);
        alert(error.message);
      });
  };

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
        <MainButton
          containerStyles={'mt-4'}
          onPress={handleLogin}
          text="Login"
        />
        <SecondaryButton
          containerStyles={'mt-2'}
          onPress={() => navigation.replace('Register')}
          text="Register"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
