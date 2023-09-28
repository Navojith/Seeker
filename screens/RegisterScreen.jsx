import { View, Text, KeyboardAvoidingView, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import MainButton from '../components/common/buttons/MainButton';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import { useNavigation } from '@react-navigation/core';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rePassword, setRePassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (password !== rePassword) {
      alert('Passwords do not match');
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Registered user: ' + user.email);
        })
        .catch((error) => {
          console.log(error.errorCode, error.errorMessage);
          alert(error.errorMessage);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="height"
      className="flex-1 justify-center items-center"
    >
      <Text className="text-3xl text-dark-blue font-bold mb-4 text-center">
        Welcome !
      </Text>
      <View className="w-4/5">
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Full Name"
          value={fullName}
          onChangeText={(text) => setFullName(text)}
          type="text"
        />
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
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Re-enter Password"
          value={rePassword}
          onChangeText={(text) => setRePassword(text)}
          secureTextEntry
        />
      </View>
      <View>
        <MainButton
          containerStyles={'mt-4'}
          onPress={handleSignUp}
          text="Register"
        />
        <SecondaryButton
          containerStyles={'mt-2'}
          onPress={() => navigation.replace('Login')}
          text="Login"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
