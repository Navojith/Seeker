import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { getFirestore, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FireStore, auth } from "../firebase";
const tempimage = require("../assets/images/PostCreation/AddImage.png");


const FoundItem = ({ route }) => {
const { item, pushDataObject } = route.params;
const [fetchedItem, setFetchedItem] = useState(null);

useEffect(() => {
  console.log("fetching item details");
  console.log(pushDataObject);
  if (pushDataObject && pushDataObject.postId) {
    const fetchItemDetails = async () => {
      try {
        // Construct a query to find a document where 'postId' matches 'pushDataObject.postId'
        const q = query(collection(FireStore, 'foundItems'), where('postId', '==', pushDataObject.postId));
        
        // Retrieve the documents that match the query
        const querySnapshot = await getDocs(q);

        // Check if any documents were found
        if (!querySnapshot.empty) {
          // Assuming there's only one matching document, retrieve its data
          const itemData = querySnapshot.docs[0].data();
          setFetchedItem(itemData);
          console.log(itemData);
        } else {
          console.log('Item not found');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
        // Handle the error here
      }
    };
    fetchItemDetails();
    
  }
  
}, [pushDataObject]);

  const handleClaim = async(post) =>{
    try{
      console.log(post);
      const currentUser = auth.currentUser.uid;
      console.log(post , currentUser);

      const db = getFirestore();
      console.log(db);

      const res = await addDoc(collection(db , 'requests'),{
       user : currentUser,
       itemDetails : post,
      });
      console.log(res.id);
    } catch(error){
      console.log(error);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: "70%",
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
      width: 200,
      height: 200,
      resizeMode: "contain",
      marginBottom: 8,
    },
    itemName: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    itemDescription: {
      textAlign: "left",
      marginBottom: 4, // Add spacing between field names and values
    },
    claimButtonContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    claimButton: {
      backgroundColor: "#0369A1",
      padding: 10,
      borderRadius: 25,
      width: "60%",
      alignItems: "center",
    },
    claimButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      {fetchedItem && (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            {fetchedItem.imageUrl ? (
              <Image source={{ uri: fetchedItem.imageUrl }} style={styles.itemImage} />
            ) : (
              <Image source={tempimage} style={styles.itemImage} />
            )}
          </View>
          <Text style={styles.itemName}>{fetchedItem.itemName}</Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Color:</Text> {fetchedItem.color}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Description:</Text>{" "}
            {fetchedItem.description}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Location:</Text>{" "}
            {fetchedItem.location}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Serial No:</Text>{" "}
            {fetchedItem.serialNumber}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Date:</Text>{" "}
            {new Date(fetchedItem.timestamp.toDate()).toLocaleString()}
          </Text>

          <View style={styles.claimButtonContainer}>
            <TouchableOpacity style={styles.claimButton}
             onPress={()=>handleClaim(item.postId)}
            >
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {item && (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            ) : (
              <Image source={tempimage} style={styles.itemImage} />
            )}
          </View>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Color:</Text> {item.color}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Description:</Text>{" "}
            {item.description}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Location:</Text>{" "}
            {item.location}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Serial No:</Text>{" "}
            {item.serialNumber}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: "bold" }}>Date:</Text>{" "}
            {new Date(item.timestamp.toDate()).toLocaleString()}
          </Text>

          <View style={styles.claimButtonContainer}>
            <TouchableOpacity style={styles.claimButton}
             onPress={()=>handleClaim(item.postId)}
            >
              <Text style={styles.claimButtonText}>Claim</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default FoundItem;
