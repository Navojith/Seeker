import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import data from "../assets/data/SLIITLocations/index.json";
import MainButton from "../components/common/buttons/MainButton";
import { FireStore, auth, storage } from "../firebase";
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
} from "firebase/firestore";
import DismissibleAlert from "../components/common/alerts/DismissibleAlert";
import TwoButtonModal from "../components/common/modals/TwoButtonModal";
import { PostBoosting } from "../constants/RouteConstants";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";

const CreateLostItemScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(data.locations[0]);
  const [createdItemId, setCreatedItemId] = useState(null);
  const [otherVisibility, setOtherVisibility] = useState(false);
  const [itemName, setItemName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [other, setOther] = useState("");
  const [error, setError] = useState({
    visibility: false,
    viewStyles: "border border-4 border-red-600",
    title: null,
    titleStyles: "text-red-600",
    message: null,
    messageStyles: "text-red-600 font-bold",
  });
  const [loading, setLoading] = useState(false);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [searchDocuments, setSearchDocuments] = useState([]);
  const [postId, setPostId] = useState("");
  const [foundItemNotifications, setFoundItemNotifications] = useState(false);
  const [lostItemNotifications, setLostItemNotifications] = useState(false);

  useEffect(() => {
    if (selectedLocation === "Other") {
      setOtherVisibility(true);
    } else {
      setOtherVisibility(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const searchCollectionRef = collection(FireStore, "searchLostItems");

        const querySnapshot = await getDocs(searchCollectionRef);

        const searchDocuments = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          searchDocuments.push({ id: doc.id, ...data });
        });

        setSearchDocuments(searchDocuments);

        console.log("Fetched search documents:", searchDocuments);
      } catch (error) {
        console.error("Error fetching search documents:", error);
        // Handle the error here
      }
    };

    fetchSearch();
  }, []);

  useEffect(() => {
    matchSearch();
  }, [postId]);

  useEffect(() => {
    const getLeaderboardUsers = async () => {
      try {
        const leadeboardQuery = query(
          collection(FireStore, "userDetails"),
          orderBy("points", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(leadeboardQuery);
        if (querySnapshot.empty) {
          console.log("No matching documents.");
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

  const handleNotification = async () => {
    const res = await axios.post(
      `https://app.nativenotify.com/api/indie/group/notification`,
      {
        subIDs: leaderboardUsers,
        appId: 13599,
        appToken: "gTBeP5h5evCxHcHdDs0yVQ",
        title: "Seeker",
        message: "Lost item reported near you",
        pushData: '{ "item": "51n8M5dAKwr5skBiBI0E","type": "specialPost" }',
      }
    );
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
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image to Firebase Storage: ", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    handleNotification();
    if (itemName === "" || description === "") {
      setError((prev) => ({
        ...prev,
        visibility: true,
        viewStyles: "border border-4 border-red-600",
        titleStyles: "text-red-600",
        messageStyles: "text-red-600 font-bold",
        title: "Error !",
        message: "Please enter item name and description !",
      }));
    } else {
      try {
        setLoading(true);
        let imageUrl = null;
        if (imageUri) {
          imageUrl = await uploadImageToFirebaseStorage(imageUri);
        }
        const res = await addDoc(collection(FireStore, "lostItems"), {
          userId: auth.currentUser.uid,
          itemName: itemName,
          serialNumber: serialNumber ?? null,
          color: color ?? null,
          location: selectedLocation,
          other: other ?? null,
          description: description,
          tier: "free",
          timestamp: new Date(),
          postId: "",
          imageUrl: imageUrl,
        });

        console.log("id", res.id);

        const pId = res.id;

        setCreatedItemId(pId);
        setPostId(pId);

        // Update the document with the postId
        await updateDoc(res, { postId: pId });

        setError({
          visibility: true,
          viewStyles: "border border-4 border-green-600",
          titleStyles: "text-green-600",
          messageStyles: "text-green-600 font-bold",
          title: "Success !",
          message: "Post created successfully !",
        });
        setLoading(false);
        setItemName("");
        setColor("");
        setDescription("");
        setOther("");
        setSerialNumber("");
        setIsModalVisible(true);
      } catch (error) {
        console.log(error);
        setError((prev) => ({
          ...prev,
          visibility: true,
          title: "Error !",
          message: error.message + " - " + error.code,
        }));
      }
    }
  };

  const handleBoosting = () => {
    setIsModalVisible(false);
    navigation.navigate(PostBoosting, { itemId: createdItemId });
  };

  const openImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.7, format: "jpeg" }
      );

      setImageUri(resizedPhoto.uri);
      console.log(resizedPhoto.uri);
    }
  };

  const matchSearch = async () => {
    console.log("Matching search documents...");

    if (!postId) {
      console.log("postId is empty");
      return;
    }

    console.log("postId", postId);

    for (const doc of searchDocuments) {
      const queryWords = doc.query.toLowerCase().split(" ");
      const itemNameLower = itemName.toLowerCase();
      const descriptionWords = description.toLowerCase().split(" ");

      // Check if any word from the query is present in any of the fields
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
        console.log("Match found");
        const res = await getNotificationSettings(doc.userId);
        console.log("lost", lostItemNotifications);
        console.log("res", res);
        if (lostItemNotifications) {
          const pushData = {
            type: "searchFoundItem",
            postId,
          };

          // Add a 10-second delay because firestore is slow
          setTimeout(() => {
            axios.post(`https://app.nativenotify.com/api/indie/notification`, {
              subID: doc.userId,
              appId: 13599,
              appToken: "gTBeP5h5evCxHcHdDs0yVQ",
              title: "Lost item matched your search",
              message:
                'Your search "' +
                doc.query +
                '" matched with "' +
                itemName +
                '"',
              pushData: JSON.stringify(pushData),
            });
          }, 10000);
        } else {
          console.log("User has disabled lost item notifications");
        }
      }
    }
  };

  const getNotificationSettings = async (uId) => {
    console.log("Retrieving notification settings...");
    console.log("uId", uId);
    try {
      const docRef = doc(FireStore, "notifications", uId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Notification settings:", data);
        if (data) {
          console.log(data);
          setFoundItemNotifications(data.foundItemNotifications);
          setLostItemNotifications(data.lostItemNotifications);
        }
      } else {
        console.log("No notification settings found");
      }

      console.log("Notification settings retrieved");

      return true;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView className="p-4 flex-1  ">
      <TwoButtonModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        heading={"Do you want to Boost the Post?"}
        infoMessage={
          "Posts that you create can be boosted so that more people can see the post and more people will be motivated to find the item."
        }
        onPressConfirm={handleBoosting}
      />
      <DismissibleAlert data={error} setData={setError} />
      <TouchableOpacity
        onPress={openImagePicker}
        style={{
          borderWidth: 4,
          borderColor: "lightblue",
          borderRadius: 10,
          padding: 10,
          alignItems: "center",
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, resizeMode: "contain" }}
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
          dropdownIconColor={"black"}
          dropdownIconRippleColor={"#0284C7"}
          selectionColor={"#0284C7"}
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
        text={"Create Post"}
        containerStyles={"mt-6 mb-12 rounded-full w-full drop-shadow-md"}
      />
    </ScrollView>
  );
};

export default CreateLostItemScreen;
