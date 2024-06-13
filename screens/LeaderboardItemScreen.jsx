import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getDistanceFromLatLonInKm } from '../util/distance/getDistance';
import siteLocation from '../assets/data/SLIITLocations/location.json';
import UltraIcon from '../assets/images/Tiers/Ultra.jsx';
import SuperiorIcon from '../assets/images/Tiers/Superior.jsx';
import ModerateIcon from '../assets/images/Tiers/Moderate.jsx';
import MinorIcon from '../assets/images/Tiers/Minor.jsx';
import getPoints from '../util/pointCalculation/getPoints';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import { useNavigation } from '@react-navigation/native';
import { LeaderBoard, Profile } from '../constants/RouteConstants';
import { LostItem } from '../constants/RouteConstants';
import { FireStore, auth } from '../firebase';
import LoadingComponent from './LoadingScreen';

const LeaderboardItemScreen = ({ route }) => {
  const nav = useNavigation();
  const { pushDataObject } = route.params;
  const [distance, setDistance] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);
  const [showInfoLevelModal, setShowInfoLevelModal] = useState({
    visibility: false,
    viewStyles: ` pt-8 flex justify-center border rounded-[42px] border-[6px] border-dark-blue`,
    message:
      'Thanks for looking for the item... Don’t worry we’ll find the next one',
    buttonText: 'Okay',
    buttonContainerStyles: ` w-[100px] mx-auto rounded-full bg-dark-blue`,
    buttonTextStyles: ` font-bold`,
    messageStyles: ` text-2xl font-bold`,
  });
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });

  useEffect(() => {
    async function getItem() {
      console.log('Special Item Post', pushDataObject?.item);
      const docRef = doc(getFirestore(), 'lostItems', pushDataObject?.item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        if (!item) {
          setItem(docSnap.data());
        }
        item && getPermissions();
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    }
    getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        console.log('Permission to access location was granted');
        setLocationInterval(setInterval(trackLocation, 1000));
        setLoading(false);
      }
    };
    setLoading(true);
    getItem();

    return () => {
      clearInterval(locationInterval);
    };
  }, [item]);

  const addFoundUser = async (postId) => {
    const user = auth.currentUser.uid;
    console.log('user', user);
    console.log('post', postId);

    const postDocRef = doc(FireStore, 'lostItems', postId);
    const postSnap = await getDoc(postDocRef);
    const postedUser = postSnap.data().userId;

    try {
      await updateDoc(postDocRef, { foundUserId: user });

      const db = getFirestore();
      console.log(db);

      const res = await addDoc(collection(db, 'requests'), {
        user: postedUser,
        itemDetails: postId,
      });
      console.log('requestId', res.id);
      console.log('document updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const trackLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    item
      ? (console.log(siteLocation.locations[item.location]),
        console.log(
          Math.round(
            getDistanceFromLatLonInKm(
              currentLocation.coords.latitude,
              currentLocation.coords.longitude,
              siteLocation.locations[item.location].lat,
              siteLocation.locations[item.location].lng
            ) *
              1000 *
              100
          ) / 100
        ),
        setDistance(
          Math.round(
            getDistanceFromLatLonInKm(
              currentLocation.coords.latitude,
              currentLocation.coords.longitude,
              siteLocation.locations[item?.location].lat,
              siteLocation.locations[item?.location].lng
            ) *
              1000 *
              100
          ) / 100
        ))
      : console.log('No item');
  };

  const handleNotFound = () => {
    setShowInfoLevelModal((prev) => ({ ...prev, visibility: true }));
    clearInterval(locationInterval);
  };

  const handleFound = () => {
    clearInterval(locationInterval);
    addFoundUser(item.postId);
    setError({
      visibility: true,
      viewStyles: 'border border-4 border-green-600',
      titleStyles: 'text-green-600',
      messageStyles: 'text-green-600 font-bold',
      title: 'Item marked as found !',
      message: 'Check posted found items in your profile !',
      buttonText: 'Okay',
    });
  };

  const handleNavigation = () => {
    nav.goBack();
    nav.navigate(LeaderBoard);
  };

  const handleViewPost = () => {
    nav.navigate(LostItem, { item });
  };

  return (
    <View>
      {item && (
        <View className="mt-[28vh] w-10/12 mx-auto py-auto">
          <View
            className={`flex-row justify-center items-center bg-white rounded-3xl border-[3px] border-[#0284C7]
         px-1 ${item.tier.toLowerCase() === 'superior' ? 'p-2' : 'p-3'}`}
          >
            <View className="basis-4/10 mr-2">
              {item.tier.toLowerCase() === 'ultra' ? (
                <UltraIcon />
              ) : item.tier.toLowerCase() === 'superior' ? (
                <SuperiorIcon />
              ) : item.tier.toLowerCase() === 'moderate' ? (
                <ModerateIcon />
              ) : item.tier.toLowerCase() === 'minor' ? (
                <MinorIcon />
              ) : (
                <Text> </Text>
              )}
            </View>
            <View className="basis-6/10 ">
              <Text className="text-xl font-bold">
                {item.tier === 'ultra' ? (
                  <Text>Ultra Boosted Post</Text>
                ) : item.tier === 'superior' ? (
                  <Text>Superior Boosted Post</Text>
                ) : item.tier === 'moderate' ? (
                  <Text>Moderate Boosted Post</Text>
                ) : item.tier === 'minor' ? (
                  <Text>Minor Boosted Post</Text>
                ) : (
                  <Text>Not a boosted post</Text>
                )}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleViewPost}>
            <View
              className={`grid grid-cols-2 bg-white rounded-3xl border-[3px] border-[#0284C7]
       p-3  mt-[2vh] items-center`}
            >
              <View className="flex-row col-span-2 p-1 gap-x-2">
                <Text className="font-bold text-xl">Last Seen:</Text>
                <Text className="text-xl"> {item.location}</Text>
              </View>
              <View className="flex-row col-span-2 p-1 gap-x-2">
                <Text className="font-bold text-xl">Item:</Text>
                <Text className="text-xl"> {item.itemName}</Text>
              </View>
              <View className="flex-row p-1 gap-x-4">
                <View className="flex-row">
                  <Text className="font-bold text-xl">Color:</Text>
                  <Text className="text-xl">
                    {' '}
                    {item.color.length ? item.color : 'Not Given'}
                  </Text>
                </View>
                <View className="flex-row ">
                  <Text className="font-bold text-xl">Brand:</Text>
                  <Text className="text-xl"> {item.brand ?? 'Not Given'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View
            className="bg-white rounded-3xl border-[3px] border-[#0284C7]
       p-3  mt-[2vh] items-start"
          >
            <View className="flex-row ml-4 p-1">
              <Text className="font-bold text-xl">Distance:</Text>
              <Text className="text-xl ml-2">
                {distance ? distance + ' m' : 'Calculating..'}
              </Text>
            </View>
            <View className="flex-row ml-4 p-1">
              <Text className="font-bold text-xl">Points gained:</Text>
              <Text className="text-xl ml-2">
                {getPoints(item.tier)} points
              </Text>
            </View>
          </View>
          <View className="flex-row mt-[2vh] mx-auto">
            <TouchableOpacity
              className={` w-[38vw] rounded-3xl py-1 pb-3 px-4 bg-dark-blue mx-auto mr-[2vw]`}
              onPress={handleFound}
            >
              <Text className={`text-2xl text-center font-bold text-white`}>
                Found
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={` w-[38vw] rounded-3xl py-1 pb-3 px-4 bg-dark-blue mx-auto`}
              onPress={handleNotFound}
            >
              <Text className={`text-2xl text-center font-bold text-white`}>
                Not Found
              </Text>
            </TouchableOpacity>
            <DismissibleAlert
              data={showInfoLevelModal}
              setData={setShowInfoLevelModal}
              onPress={handleNavigation}
            />
          </View>
          <LoadingComponent visible={loading} />
          <DismissibleAlert
            data={error}
            setData={setError}
            onPress={() => {
              nav.goBack();
              nav.navigate(Profile);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default LeaderboardItemScreen;
