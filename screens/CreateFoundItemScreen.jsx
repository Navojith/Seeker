import { View, ScrollView, Text, Image, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import AddImage from "../assets/images/PostCreation/AddImage.png";
import { Picker } from "@react-native-picker/picker";
import data from "../assets/data/SLIITLocations/index.json";
import MainButton from "../components/common/buttons/MainButton";
import { FireStore, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import DismissibleAlert from "../components/common/alerts/DismissibleAlert";
import { useNavigation } from "@react-navigation/native";
import { LostItems } from "../constants/RouteConstants";
import axios from "axios";

const CreateFoundItemScreen = () => {
  const navigation = useNavigation();

  const [selectedLocation, setSelectedLocation] = useState(data.locations[0]);
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
  //const [searchDocuments, setSearchDocuments] = useState([]);

  useEffect(() => {
    if (selectedLocation === "Other") {
      setOtherVisibility(true);
    } else {
      setOtherVisibility(false);
    }
  }, [selectedLocation]);

  const handleSubmit = async () => {
    if (itemName === "" || description === "") {
      setError((prev) => ({
        ...prev,
        visibility: true,
        title: "Error !",
        message: "Please enter item name and description !",
      }));
    } else {
      try {
        setLoading(true);
        await addDoc(
          collection(FireStore, "foundItems"),
          {
            userId: auth.currentUser.uid,
            itemName: itemName,
            serialNumber: serialNumber ?? null,
            color: color ?? null,
            location: selectedLocation,
            other: other ?? null,
            description: description,
            timestamp: new Date(),
          }
        );

        //fetchSearch();

        setError({
          visibility: true,
          viewStyles: "border border-4 border-green-600",
          titleStyles: "text-green-600",
          messageStyles: "text-green-600 font-bold",
          title: "Success !",
          message: "Your post has been created successfully !",
        });
        setLoading(false);
        setItemName("");
        setColor("");
        setDescription("");
        setOther("");
        setSerialNumber("");
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

//   const fetchSearch = async () => {
//     try {
//       // Get a reference to the /search collection
//       const searchCollectionRef = collection(FireStore, "search"); // Replace 'FireStore' with your Firestore instance

//       // Use the getDocs function to fetch all documents
//       const querySnapshot = await getDocs(searchCollectionRef);

//       const searchDocuments = [];

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         searchDocuments.push({ id: doc.id, ...data });
//       });

//       setSearchDocuments(searchDocuments);

//       matchSearch();

//       // Now, the searchDocuments array contains all the documents in the /search collection
//       console.log("Fetched search documents:", searchDocuments);
//     } catch (error) {
//       console.error("Error fetching search documents:", error);
//       // Handle the error here
//     }
//   };

//   const matchSearch = () => {
//     // Loop through the searchDocuments array and check for matches
//     searchDocuments.forEach((doc) => {
//       if (doc.query.toLowerCase().includes(itemName.toLowerCase())) {
//         // Fire your function here when there's a match
//         console.log("Match found:", doc); // Replace with your desired action

//         axios.post(`https://app.nativenotify.com/api/indie/notification`, {
//           subID: doc.userId,
//           appId: 13582,
//           appToken: "4bB2Wq6pPQwKoSbjJdg1Ef",
//           title: "put your push notification title here as a string",
//           message: "put your push notification message here as a string",
//         });
//       }
//     });
//   };

  return (
    <ScrollView className="p-4 flex-1  ">
      <DismissibleAlert data={error} setData={setError} />
      <Image
        className="mx-auto mb-4"
        source={AddImage}
        width={100}
        height={100}
      />
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

export default CreateFoundItemScreen;