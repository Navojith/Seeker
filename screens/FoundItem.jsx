import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { auth } from '../firebase';
import { Firestore, addDoc, collection } from "firebase/firestore";
const tempimage = require("../assets/images/PostCreation/AddImage.png");


const FoundItem = ({ route }) => {
const { item, pushDataObject } = route.params;

  // const handleClaim = (item) =>{
  //     console.log(item);
  //     const currentUser = auth.currentUser.uid;
  //     console.log(item , currentUser);

  //     const res = addDoc(collection(Firestore , 'requests'),{
  //      user : currentUser,
  //      itemDetails : item
  //     });
  //     console.log(res);
  // }

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
      {pushDataObject && (
        <Text>Push Data: {JSON.stringify(pushDataObject)}</Text>
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
            <TouchableOpacity style={styles.claimButton}>
              <Text style={styles.claimButtonText}>Return</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default FoundItem;
