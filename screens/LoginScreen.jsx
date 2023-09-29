import { KeyboardAvoidingView, TextInput, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import MainButton from '../components/common/buttons/MainButton';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [isError, setIsError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home');
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      setIsError((prev) => ({
        ...prev,
        visibility: true,
        title: 'Error !',
        message: 'Please enter email and password !',
      }));
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Signed in with ', user.email);
      })
      .catch((error) => {
        console.log(error.code, error.message);
        //TwoButtonAlert('sds', error.message);
        setIsError((prev) => ({
          ...prev,
          visibility: true,
          title: 'Error !',
          message: error.message + ' - ' + error.code,
        }));
      });
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      className="flex-1 mt-4 justify-center items-center"
    >
      {isError.visibility && (
        <DismissibleAlert data={isError} setData={setIsError} />
      )}
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
          required
        />
        <TextInput
          className="bg-white mb-2 px-4 py-2 border-[3px] border-dark-blue text-dark-blue rounded-xl"
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          required
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
