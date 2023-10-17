import { View, StyleSheet } from 'react-native';
import React from 'react';
import MainButton from '../components/common/buttons/MainButton';
import { auth } from '../firebase';

const ProfileScreen = () => {

  const styles = StyleSheet.create({
    signOut: {
        
        marginTop: 250,
        marginHorizontal: 40
    }
  });

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Signed out');
      })
      .catch((error) => {
        console.log(error.code, error.message);
        alert(error.message);
      });
  };
  return (
    <View style={styles.signOut}>
      <MainButton onPress={handleSignOut} text={'Sign Out'}   />
    </View>
  );
};

export default ProfileScreen;
