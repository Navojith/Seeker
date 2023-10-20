import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { auth } from '../firebase';
import { getFirestore, addDoc, collection , query,where } from "firebase/firestore";
const tempimage = require("../assets/images/PostCreation/AddImage.png");


const FoundItem = ({ route }) => {
const { item, pushDataObject } = route.params;

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
      width: "100%",
     // height: 100,
      resizeMode: "cover",
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
          <Image source={tempimage} style={styles.itemImage} />
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Text style={styles.itemDescription}>Color: {item.color}</Text>
          <Text style={styles.itemDescription}>Description: {item.description}</Text>
          <Text style={styles.itemDescription}>Location: {item.location}</Text>
          <Text style={styles.itemDescription}>Serial No: {item.serialNumber}</Text>
          <Text style={styles.itemDescription}>Date: {}</Text>
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
