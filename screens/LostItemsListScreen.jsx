import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FireStore, auth } from "../firebase";
import {
  collectionGroup,
  getDocs,
  addDoc,
  collection,
} from "firebase/firestore";
const tempimage = require("../assets/images/PostCreation/AddImage.png");
import data from "../assets/data/SLIITLocations/index.json";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const locationOptions = data.locations;

const LostItemsListScreen = () => {
  const [lostItems, setLostItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = auth.currentUser.uid;
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
      marginBottom: 260,
    },
    searchBar: {
      height: 50,
      padding: 16,
      backgroundColor: "#fff",
      borderRadius: 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      borderWidth: 3,
      borderColor: "#0369A1",
      marginHorizontal: 25,
      marginTop: 20,
    },
    itemText: {
      fontSize: 16,
    },
    card: {
      margin: 4,
      width: "48%", // Adjust as needed to fit two cards per row
      padding: 16,
      backgroundColor: "#fff",
      borderRadius: 25,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      borderWidth: 3,
      borderColor: "#0369A1",
    },
    itemImage: {
      width: "100%",
      height: 100,
      resizeMode: "cover",
      marginBottom: 8,
    },
    filterButton: {
      backgroundColor: "#0369A1",
      padding: 10,
      margin: 10,
      marginHorizontal: 20,
      borderRadius: 25,
      alignItems: "center",
      marginHorizontal: 40,
    },
    filterButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    filterModal: {
      backgroundColor: "white",
      padding: 20,
      marginTop: 200,
      marginHorizontal: 20,
      backgroundColor: "#fff",
      borderRadius: 25,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      borderWidth: 3,
      borderColor: "#0369A1",
    },
  });

  useEffect(() => {
    console.log("lost item use effect ran");

    const getLostItems = async () => {
      console.log("get lost items");
      try {
        const querySnapshot = await getDocs(
          collectionGroup(FireStore, "posted")
        );
        if (querySnapshot.empty) {
          console.log("No matching documents.");
        } else {
          const items = querySnapshot.docs.map((doc) => doc.data());
          //console.log('Retrieved items:', items);
          setLostItems(items);
        }
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };
    getLostItems();
  }, []);

  // Filter the items based on the search query
  const filteredItems = lostItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedLocation || item.location === selectedLocation)
  );

  // Function to save the search query to Firestore
  const saveSearchQueryToFirestore = async () => {
    try {
      const searchCollectionRef = collection(FireStore, "search");
      await addDoc(searchCollectionRef, {
        userId: userId,
        query: searchQuery,
        timestamp: new Date(),
      });
      console.log("Search query saved to Firestore.");
    } catch (error) {
      console.error("Error saving search query:", error);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        onEndEditing={saveSearchQueryToFirestore}
      />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.filterModal}>
          <Text>Filter by Location:</Text>

          <Picker
            className="border border-4 px-4 py-2 border-light-blue"
            placeholder="Select Location"
            selectedValue={selectedLocation}
            dropdownIconColor={"black"}
            dropdownIconRippleColor={"#0284C7"}
            selectionColor={"#0284C7"}
            onValueChange={(itemValue) => {
              setSelectedLocation(itemValue);
              setFilterModalVisible(false);
            }}
          >
            {locationOptions.map((location, index) => (
              <Picker.Item key={index} label={location} value={location} />
            ))}
          </Picker>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setSelectedLocation(null);
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterButtonText}>Clear Filter</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.container}>
        <FlatList
          data={filteredItems}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate("Item", { item });
              }}
            >
              <View>
                <Image source={tempimage} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.itemName}</Text>
                {/* Other item details */}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default LostItemsListScreen;
