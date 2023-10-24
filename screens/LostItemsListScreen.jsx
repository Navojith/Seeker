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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { LostItem } from "../constants/RouteConstants";

const locationOptions = data.locations;

const LostItemsListScreen = () => {
  const [lostItems, setLostItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = auth.currentUser.uid;
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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
      width: "48%",
      margin: 4,
    },
    cardContent: {
      padding: 16,
      backgroundColor: "#fff",
      borderRadius: 25,
    },
    itemImage: {
      width: "100%",
      height: 100,
      resizeMode: "contain",
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
    const getLostItems = async () => {
      console.log("get lost items");
      try {
        const collectionRef = collection(FireStore, "lostItems"); // Get a reference to the collection
        const querySnapshot = await getDocs(collectionRef);
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
  }, [isFocused]); //can add isFocused here to reload the screen once an item is added. for now removed since its making api calls often

  // Filter the items based on the search query
  const filteredItems = lostItems.filter((item) => {
    const searchWords = searchQuery.toLowerCase().split(" ");
    return (
      searchWords.some(
        (word) =>
          item.itemName.toLowerCase().includes(word) ||
          (item.serialNumber &&
            item.serialNumber.toLowerCase().includes(word)) ||
          item.description.toLowerCase().includes(word) ||
          (item.color && item.color.toLowerCase().includes(word))
      ) &&
      (!selectedLocation || item.location === selectedLocation)
    );
  });

  // Function to save the search query to Firestore
  const saveSearchQueryToFirestore = async () => {
    if (searchQuery && searchQuery.trim() !== "") {
      try {
        const searchCollectionRef = collection(FireStore, "searchLostItems");
        await addDoc(searchCollectionRef, {
          userId: userId,
          query: searchQuery,
          timestamp: new Date(),
        });
        console.log("Search query saved to Firestore.");
      } catch (error) {
        console.error("Error saving search query:", error);
      }
    }
  };

  const getBorderColor = (tier) => {
    switch (tier) {
      case "minor":
        return ["#CECCCC", "#161616"];
      case "moderate":
        return ["#780202", "#7479F3"];
      case "superior":
        return ["#0066FE", "#6AA4FB"];
      case "ultra":
        return ["#8146FF", "#7928B9", "#902AE0"];
      default:
        return ["#0369A1", "#0369A1"];
    }
  };

  const getTierValue = (tier) => {
    switch (tier) {
      case "ultra":
        return 1;
      case "superior":
        return 2;
      case "moderate":
        return 3;
      case "minor":
        return 4;
      default:
        return 5;
    }
  };

  const sortedItems = filteredItems.sort((item1, item2) => {
    const tierValue1 = getTierValue(item1.tier);
    const tierValue2 = getTierValue(item2.tier);

    // Compare the tier values and return the comparison result
    return tierValue1 - tierValue2;
  });

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
          data={sortedItems}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate(LostItem, { item });
              }}
            >
              <LinearGradient
                style={{ padding: 5, borderRadius: 25 }}
                colors={getBorderColor(item.tier)}
              >
                <View style={styles.cardContent}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <Image source={tempimage} style={styles.itemImage} />
                  )}
                  <Text style={styles.itemText}>{item.itemName}</Text>
                  {/* Other item details */}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.id + index.toString()}
        />
      </View>
    </View>
  );
};

export default LostItemsListScreen;
