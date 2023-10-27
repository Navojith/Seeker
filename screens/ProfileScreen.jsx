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
import { auth, FireStore, storage } from '../firebase';
import CustomHeader from '../components/header';
import { useNavigation } from '@react-navigation/native';
import { unregisterIndieDevice } from 'native-notify';
import { doc, getDoc, updateDoc, collection } from 'firebase/firestore';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import UserIcon from '../assets/images/UserImg';
import { Settings } from '../constants/RouteConstants';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { ActivityIndicator } from 'react-native';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const styles = StyleSheet.create({
    container: {
      marginTop: 130,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileDetails: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 2,
      color: '#333', // Adjust the color as needed
    },
    phoneDetails: {
      fontSize: 16, // You can adjust the font size
      color: '#666', // Adjust the color
    },
    pointsDetails: {
      fontSize: 18, // You can adjust the font size
      fontWeight: 'bold',
      color: '#FF5733', // Adjust the color
    },
    card: {
      backgroundColor: '#F0F9FF',
      borderRadius: 10,
      padding: 20,
      margin: 20,
      borderColor: '#0284C7',
      borderWidth: 3,
    },
    row: {
      flexDirection: 'row',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    buttonText: {
      color: '#000',
      fontWeight: 'bold',
    },
  });

  const handlePostedLostItems = () => {
    navigation.navigate('Posted Lost Items');
  };

  const handlePostedFoundItems = () => {
    navigation.navigate('Posted Found Items');
  };

  const handlePersonalBelongings = () => {
    navigation.navigate('Personal Belongings');
  };

  const handleSettings = () => {
    navigation.navigate(Settings);
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
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [imageUri]);

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
        // alert(error.message);
      });
  };

  const handleChangeAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300 } }],
        { compress: 0.7, format: 'jpeg' }
      );

      try {
        const downUrl = await uploadImageToFirebaseStorage(resizedPhoto.uri);
        const userRef = doc(FireStore, 'userDetails', auth.currentUser.uid);

        await updateDoc(userRef, {
          avatarUrl: downUrl,
        });

        setImageUri(downUrl);
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  const uploadImageToFirebaseStorage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(
        storage,
        `images/${auth.currentUser.uid}/${Date.now()}.jpg`
      );
      await uploadBytes(storageRef, blob);
      console.log('uploaded to firebase');
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image to Firebase Storage: ', error);
      return null;
    }
  };

  return user ? (
    <>
      <DismissibleAlert data={error} setData={setError} />
      <CustomHeader title="Profile" />
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity onPress={handleChangeAvatar}>
              {user.avatarUrl ? (
                <View className="mt-8 mb-4 rounded rounded-full border border-4 border-dark-blue">
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={{ width: 80, height: 80, borderRadius: 100 }}
                  />
                </View>
              ) : (
                <View className="mt-8 mb-4 rounded rounded-full border border-4 border-dark-blue">
                  <UserIcon />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.profileDetails}>{user.displayedName}</Text>
            <Text style={styles.phoneDetails}>
              {user.phoneNo ?? user.email ?? ''}
            </Text>
            <Text style={styles.pointsDetails}>Points: {user.points ?? 0}</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={handlePersonalBelongings}
            >
              <EvilIcons name="check" size={20} color="black" />
              <Text style={styles.buttonText}>Personal Belongings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={handlePostedLostItems}
            >
              <EvilIcons name="search" size={20} color="black" />
              <Text style={styles.buttonText}>Posted Lost Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={handlePostedFoundItems}
            >
              <EvilIcons name="location" size={20} color="black" />
              <Text style={styles.buttonText}>Posted Found Items</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.row} onPress={handleUploadedImage}>
              <EvilIcons name="image" size={20} color="black" />
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.row} onPress={handleSettings}>
              <EvilIcons name="gear" size={20} color="black" />
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={styles.row}>
              <EvilIcons name="arrow-right" size={20} color="black" />
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  ) : (
    <View>
      {loading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#0369A1" />
        </View>
      )}
      {/* <TouchableOpacity onPress={handleSignOut} style={styles.itemButton}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileScreen;
