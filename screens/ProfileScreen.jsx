import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { auth } from '../firebase';
import CustomHeader from '../components/header';
import { useNavigation } from '@react-navigation/native';
const img = require('../assets/profilepic.png');
import { unregisterIndieDevice } from 'native-notify';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      marginTop: 130,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilepic: {
      margin: 8,
      width: 90,
      height: 90,
    },
    profileDetails: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 2,
    },
    itemButtonContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    itemButton: {
      backgroundColor: '#0369a1',
      color: '#fff',
      borderRadius: 20,
      padding: 10,
      marginVertical: 10,
      width: '50%',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const handlePostedLostItems = () => {
    navigation.navigate('Posted Lost Items');
  };

  const handlePostedFoundItems = () => {
    navigation.navigate('Posted Found Items');
  };

  const handleUploadedImage = () => {
    navigation.navigate('Upload Image');
  };

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
      //console.log(currentUser);
    }
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Signed out');
        // unregister notify
        unregisterIndieDevice(
          auth.currentUser.uid,
          13599,
          'gTBeP5h5evCxHcHdDs0yVQ'
        );
      })
      .catch((error) => {
        console.log(error.code, error.message);
        // alert(error.message);
      });
  };

  return (
    <View>
      <CustomHeader title="Profile" />
      <View style={styles.container}>
        <Image source={img} style={styles.profilepic} />
        <Text style={styles.profileDetails}>UserName</Text>
        <Text style={styles.profileDetails}>TelNo</Text>
        <Text style={styles.profileDetails}>Points : </Text>
      </View>
      <View style={styles.itemButtonContainer}>
        <TouchableOpacity onPress={handleSignOut} style={styles.itemButton}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePostedLostItems}
          style={styles.itemButton}
        >
          <Text style={styles.buttonText}>Posted Lost Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePostedFoundItems}
          style={styles.itemButton}
        >
          <Text style={styles.buttonText}>Posted Found Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleUploadedImage}
          style={styles.itemButton}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
