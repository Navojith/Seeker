import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { auth, FireStore } from '../firebase';
import CustomHeader from '../components/header';
import { useNavigation } from '@react-navigation/native';
const img = require('../assets/profilepic.png');
import { unregisterIndieDevice } from 'native-notify';
import { doc, getDoc } from 'firebase/firestore';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handlePersonalBelongings = () => {
    navigation.navigate('Personal Belongings');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const uuid = auth.currentUser.uid;
        const res = await getDoc(doc(FireStore, 'userDetails', uuid));
        if (res.exists) {
          setUser(res.data());
        } else {
          setError({
            visibility: true,
            title: 'Error',
            message: 'User Information not found',
            buttonText: 'Close',
            titleStyles: 'text-red-500',
            messageStyles: 'text-red-500',
            viewStyles: 'border border-4 border-red-500',
          });
        }
      } catch (error) {
        setError({
          visibility: true,
          title: 'Error',
          message: 'Data fetching failed',
          buttonText: 'Close',
          titleStyles: 'text-red-500',
          messageStyles: 'text-red-500',
          viewStyles: 'border border-4 border-red-500',
        });
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = () => {
    // unregister notify
    unregisterIndieDevice(
      auth.currentUser.uid,
      13599,
      'gTBeP5h5evCxHcHdDs0yVQ'
    );
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
    user && (
      <>
        <DismissibleAlert data={error} setData={setError} />
        <CustomHeader title="Profile" />
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <Image source={img} style={styles.profilepic} />
              <Text style={styles.profileDetails}>{user.displayName}</Text>
              <Text style={styles.profileDetails}>
                {user.phoneNo ?? user.email ?? ''}
              </Text>
              <Text style={styles.profileDetails}>
                Points : {user.points ?? 0}
              </Text>
            </View>

            <View style={styles.itemButtonContainer}>
              <TouchableOpacity
                onPress={handlePersonalBelongings}
                style={styles.itemButton}
              >
                <Text style={styles.buttonText}>Personal Belongings</Text>
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
              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.itemButton}
              >
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    )
  );
};

export default ProfileScreen;
