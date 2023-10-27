import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import data from '../assets/data/SLIITLocations/index.json';
import MainButton from '../components/common/buttons/MainButton';
import { FireStore, auth } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  doc,
  query,
} from 'firebase/firestore';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FoundItem } from '../constants/RouteConstants';

const CreateFoundItemScreen = ({ route }) => {
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(data.locations[0]);
  const [otherVisibility, setOtherVisibility] = useState(false);
  const [itemName, setItemName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [other, setOther] = useState('');
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    console.log('auto filling tags');
    console.log(route);
    console.log(route.params);
    if (route.params) {
      console.log('tags', route?.params?.tags);
      console.log('desc', route?.params?.desc);
      const tags = route?.params?.tags.join(' ');
      setItemName(tags);
      setDescription(route?.params?.desc);
    }
    console.log(itemName);
    console.log(description);
    setImageUrl(route?.params?.img);
    console.log('img:', imageUrl);
  }, [route]);

  useEffect(() => {
    if (selectedLocation === 'Other') {
      setOtherVisibility(true);
    } else {
      setOtherVisibility(false);
    }
  }, [selectedLocation]);

  const handleSubmit = async () => {
    if (itemName === '' || description === '') {
      setError((prev) => ({
        ...prev,
        visibility: true,
        title: 'Error !',
        message: 'Please enter item name and description !',
      }));
    } else {
      try {
        setLoading(true);
        const docRef = await addDoc(collection(FireStore, 'foundItems'), {
          userId: auth.currentUser.uid,
          itemName: itemName,
          serialNumber: serialNumber ?? null,
          color: color ?? null,
          location: selectedLocation,
          other: other ?? null,
          description: description,
          timestamp: new Date(),
          postId: '',
          imageUrl: imageUrl ?? '',
        });

        console.log('id', docRef.id);

        const pId = docRef.id; // Set postId after the document is added

        // Update the document with the postId
        await updateDoc(docRef, { postId: pId });

        // Match search-------------------------------------------
        matchSearch(pId);

        // //Search serial no ------------------------------------
        if (serialNumber) {
          const q = query(collection(FireStore, 'userDetails'));
          const querySnapshot = await getDocs(q);
          for (const document of querySnapshot.docs) {
            const data = document.data();

            if (
              data.devices &&
              data.devices.some((device) => device.serialNo === serialNumber)
            ) {
              let permissions = {};
              try {
                const userId = data.userId;
                const notificationsDocRef = doc(
                  FireStore,
                  'notifications',
                  userId
                );
                const docSnap = await getDoc(notificationsDocRef);
                if (docSnap.exists()) {
                  const notificationData = docSnap.data();
                  console.log('Notification settings:', notificationData);
                  if (notificationData) {
                    permissions = notificationData;
                  }
                }
              } catch (error) {
                console.log(error);
              }

              if (permissions.foundItemNotifications) {
                console.log('post id', pId);
                const pushData = {
                  type: 'searchFoundItem',
                  postId: pId,
                };

                console.log('sdddddddddddd\n', JSON.stringify(pushData));

                axios.post(
                  `https://app.nativenotify.com/api/indie/notification`,
                  {
                    subID: data.userId,
                    appId: 13599,
                    appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
                    title: 'Found item',
                    message: 'Found item with serial number ' + serialNumber,
                    pushData: JSON.stringify(pushData),
                  }
                );
              }
            }
          }
        }

        setError({
          visibility: true,
          viewStyles: 'border border-4 border-green-600',
          titleStyles: 'text-green-600',
          messageStyles: 'text-green-600 font-bold',
          title: 'Success !',
          message: 'Your post has been created successfully !',
        });
        setLoading(false);
        setItemName('');
        setColor('');
        setDescription('');
        setOther('');
        setSerialNumber('');
        navigation.navigate(FoundItem, {
          // Generate a unique key to force remount of the component
          key: `orders-${Math.random()}`,
        });
      } catch (error) {
        console.log(error);
        setError((prev) => ({
          ...prev,
          visibility: true,
          title: 'Error !',
          message: error.message + ' - ' + error.code,
        }));
      }
    }
  };

  const openImagePicker = () => {
    const screen = 'found';
    navigation.navigate('Upload Image', { screen });
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: true,
    //   //aspect: [4, 3],
    //   quality: 1,
    // });

    // console.log(result);

    // if (!result.canceled) {
    //   const resizedPhoto = await ImageManipulator.manipulateAsync(
    //     result.assets[0].uri,
    //     [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
    //     { compress: 0.7, format: 'jpeg' }
    //   );

    //   setImageUri(resizedPhoto.uri);
    //   console.log(resizedPhoto.uri);
    // }
  };

  const matchSearch = async (pId) => {
    console.log('Matching search documents...');
    const searchDocuments = [];

    try {
      const searchCollectionRef = collection(FireStore, 'searchFoundItems');
      const querySnapshot = await getDocs(searchCollectionRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        searchDocuments.push({ id: doc.id, ...data });
      });

      console.log('Fetched search documents:', searchDocuments);
    } catch (error) {
      console.error('Error fetching search documents:', error);
      // Handle the error here
    }

    console.log('passed postId', pId);

    for (const document of searchDocuments) {
      const queryWords = document.query.toLowerCase().split(' ');
      const itemNameLower = itemName.toLowerCase();
      const descriptionWords = description.toLowerCase().split(' ');

      const isMatch = queryWords.some((word) => {
        return (
          itemNameLower.includes(word) ||
          descriptionWords.some((descWord) => descWord.includes(word)) ||
          (serialNumber && serialNumber.toLowerCase().includes(word)) ||
          (color && color.toLowerCase().includes(word)) ||
          (selectedLocation && selectedLocation.toLowerCase().includes(word))
        );
      });

      if (isMatch) {
        console.log('Match found' + document.userId);

        try {
          const userId = document.userId;
          const notificationsDocRef = doc(FireStore, 'notifications', userId);
          const docSnap = await getDoc(notificationsDocRef);

          if (docSnap.exists()) {
            const notificationData = docSnap.data();
            console.log('Notification settings:', notificationData);

            if (notificationData) {
              const permissions = notificationData;
              if (permissions.foundItemNotifications) {
                const pushData = {
                  type: 'searchFoundItem',
                  postId: pId,
                };

                axios.post(
                  `https://app.nativenotify.com/api/indie/notification`,
                  {
                    subID: userId,
                    appId: 13599,
                    appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
                    title: 'Found item matched your search',
                    message:
                      'Your search "' +
                      document.query +
                      '" matched with "' +
                      itemName +
                      '"',
                    pushData: JSON.stringify(pushData),
                  }
                );
              } else {
                console.log('User has disabled found item notifications');
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <ScrollView className="p-4 flex-1  ">
      <DismissibleAlert data={error} setData={setError} />
      <TouchableOpacity
        onPress={openImagePicker}
        style={{
          borderWidth: 4,
          borderColor: 'lightblue',
          borderRadius: 10,
          padding: 10,
          alignItems: 'center',
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: 200, height: 200, resizeMode: 'contain' }}
          />
        ) : (
          <Text>Select an Image</Text>
        )}
      </TouchableOpacity>
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        value={itemName}
        onChangeText={(value) => setItemName(value)}
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Serial Number</Text>
      <TextInput
        value={serialNumber}
        onChangeText={(value) => setSerialNumber(value)}
        placeholder="( Optional )"
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Color</Text>
      <TextInput
        value={color}
        onChangeText={(value) => setColor(value)}
        placeholder="( Optional )"
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black  mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">
        Where did you find it?
      </Text>
      <View className="border border-4 border-light-blue rounded-xl text-black mb-4">
        <Picker
          className="border border-4 px-4 py-2 border-light-blue"
          placeholder="Select Location"
          selectedValue={selectedLocation}
          dropdownIconColor={'black'}
          dropdownIconRippleColor={'#0284C7'}
          selectionColor={'#0284C7'}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
        >
          {data.locations.map((location, index) => (
            <Picker.Item key={index} label={location} value={location} />
          ))}
        </Picker>
      </View>
      {otherVisibility && (
        <View>
          <Text className="text-black text-lg font-bold mb-2">
            Please Specify
          </Text>
          <TextInput
            value={other}
            onChangeText={(value) => setOther(value)}
            placeholder=""
            className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
          />
        </View>
      )}
      <Text className="text-black text-lg font-bold mb-2">Description</Text>
      <TextInput
        value={description}
        onChangeText={(value) => setDescription(value)}
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
        placeholder=""
        className="border border-4 px-4 py-6 border-light-blue rounded-xl text-black mb-4"
      />
      {loading && (
        <Text className="text-light-blue text-lg font-bold mt-2">
          Sending... Please wait....
        </Text>
      )}
      <MainButton
        onPress={handleSubmit}
        text={'Create Post'}
        containerStyles={'mt-6 mb-12 rounded-full w-full drop-shadow-md'}
      />
    </ScrollView>
  );
};

export default CreateFoundItemScreen;
