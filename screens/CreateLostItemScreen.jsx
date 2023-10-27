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
import { FireStore, auth, storage } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  getDoc,
  doc,
} from 'firebase/firestore';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import TwoButtonModal from '../components/common/modals/TwoButtonModal';
import { PostBoosting } from '../constants/RouteConstants';
import axios from 'axios';

const CreateLostItemScreen = ({ navigation, route }) => {
  const [selectedLocation, setSelectedLocation] = useState(data.locations[0]);
  const [createdItemId, setCreatedItemId] = useState(null);
  const [otherVisibility, setOtherVisibility] = useState(false);
  const [itemName, setItemName] = useState('');
  const [persistedItemName, setPersistedItemName] = useState('');
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
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [searchDocuments, setSearchDocuments] = useState([]);
  const [postId, setPostId] = useState('');
  const [foundItemNotifications, setFoundItemNotifications] = useState(false);
  const [lostItemNotifications, setLostItemNotifications] = useState(false);

  useEffect(() => {
    console.log(route);
    if (route?.params) {
      console.log('tags', route?.params?.tags);
      console.log('desc', route?.params?.desc);
      const tags = route?.params?.tags.join(' ');
      setItemName(tags);
      setDescription(route?.params?.desc);
    }
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

  useEffect(() => {
    const getLeaderboardUsers = async () => {
      try {
        const leadeboardQuery = query(
          collection(FireStore, 'userDetails'),
          orderBy('points', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(leadeboardQuery);
        if (querySnapshot.empty) {
          console.log('No matching documents.');
        } else {
          const users = querySnapshot.docs.map((doc) => doc.data().userId);
          setLeaderboardUsers(users);
          // console.log(users);
          // console.log(leaderboardUsers);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getLeaderboardUsers();
  }, []);

  const handleNotification = async (postId) => {
    const pushData = {
      type: 'specialPost',
      item: postId,
    };
    console.log(itemName);
    await axios
      .post(`https://app.nativenotify.com/api/indie/group/notification`, {
        subIDs: leaderboardUsers,
        appId: 13599,
        appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
        title: 'Seeker',
        message:
          'Lost item reported near you\n\nItem: ' +
          persistedItemName +
          '\nLocation: ' +
          selectedLocation +
          '\nPoints: 10',
        pushData: JSON.stringify(pushData),
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async () => {
    if (itemName === '' || description === '') {
      setError((prev) => ({
        ...prev,
        visibility: true,
        viewStyles: 'border border-4 border-red-600',
        titleStyles: 'text-red-600',
        messageStyles: 'text-red-600 font-bold',
        title: 'Error !',
        message: 'Please enter item name and description !',
      }));
    } else {
      try {
        setLoading(true);
        const res = await addDoc(collection(FireStore, 'lostItems'), {
          userId: auth.currentUser.uid,
          foundUserId: '',
          itemName: itemName,
          serialNumber: serialNumber ?? null,
          color: color ?? null,
          location: selectedLocation,
          other: other ?? null,
          description: description,
          tier: 'free',
          timestamp: new Date(),
          postId: '',
          imageUrl: imageUrl ?? null,
        });

        console.log('id', res.id);

        const pId = res.id;

        setCreatedItemId(pId);
        setPostId(pId);
        // handleNotification(pId);

        // Update the document with the postId
        await updateDoc(res, { postId: pId });

        // Match search-------------------------------------------
        matchSearch(pId);

        setLoading(false);
        setPersistedItemName(itemName);
        setItemName('');
        setColor('');
        setDescription('');
        setOther('');
        setSerialNumber('');
        setIsModalVisible(true);
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

  const handleBoosting = () => {
    setIsModalVisible(false);
    navigation.navigate(PostBoosting, {
      itemId: createdItemId,
      itemName: persistedItemName,
      location: selectedLocation,
    });
  };

  const openImagePicker = async () => {
    const screen = 'lost';
    navigation.navigate('Upload Image', { screen });
  };

  const matchSearch = async (pId) => {
    console.log("Matching search documents...");
    const searchDocuments = [];

    try {
      const searchCollectionRef = collection(FireStore, "searchLostItems");
      const querySnapshot = await getDocs(searchCollectionRef);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        searchDocuments.push({ id: doc.id, ...data });
      });

      console.log("Fetched search documents:", searchDocuments);
    } catch (error) {
      console.error("Error fetching search documents:", error);
      // Handle the error here
    }

    console.log("passed postId", pId);

    for (const document of searchDocuments) {
      const queryWords = document.query.toLowerCase().split(" ");
      const itemNameLower = itemName.toLowerCase();
      const descriptionWords = description.toLowerCase().split(" ");

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
        console.log("Match found" + document.userId);

        try {
          const userId = document.userId;
          const notificationsDocRef = doc(FireStore, "notifications", userId);
          const docSnap = await getDoc(notificationsDocRef);

          if (docSnap.exists()) {
            const notificationData = docSnap.data();
            console.log("Notification settings:", notificationData);

            if (notificationData) {
              const permissions = notificationData;
              if (permissions.lostItemNotifications) {
                const pushData = {
                  type: "searchLostItem",
                  postId: pId,
                };

                axios.post(
                  `https://app.nativenotify.com/api/indie/notification`,
                  {
                    subID: userId,
                    appId: 13599,
                    appToken: "gTBeP5h5evCxHcHdDs0yVQ",
                    title: "Lost item matched your search",
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
                console.log("User has disabled found item notifications");
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
      <TwoButtonModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        heading={'Do you want to Boost the Post?'}
        infoMessage={
          'Posts that you create can be boosted so that more people can see the post and more people will be motivated to find the item.'
        }
        onPressConfirm={handleBoosting}
        onPressCancel={() => {
          handleNotification(createdItemId);
          setError({
            visibility: true,
            viewStyles: 'border border-4 border-green-600',
            titleStyles: 'text-green-600',
            messageStyles: 'text-green-600 font-bold',
            title: 'Success !',
            message: 'Post created successfully !',
          });
          setIsModalVisible(false);
        }}
      />
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
        Where did you lose it?
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

export default CreateLostItemScreen;
