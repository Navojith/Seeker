import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
const tempimage = require('../assets/images/PostCreation/AddImage.png');
import {
  getFirestore,
  addDoc,
  doc,
  updateDoc,
  collectionGroup,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { FireStore, auth } from '../firebase';

const LostItem = ({ route }) => {
  const { item, pushDataObject } = route.params;
  const [fetchedItem, setFetchedItem] = useState(null);
  const [postedUserId, setPostedUserId] = useState(null);

  useEffect(() => {
    console.log('fetching item details');
    console.log(pushDataObject);
    if (pushDataObject && pushDataObject.postId) {
      const fetchItemDetails = async () => {
        try {
          const q = query(
            collection(FireStore, 'lostItems'),
            where('postId', '==', pushDataObject.postId)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const itemData = querySnapshot.docs[0].data();
            setFetchedItem(itemData);
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

  const addFoundUser = async (postId) => {
    const user = auth.currentUser.uid;
    console.log('user', user);
    console.log('post', postId);

    const postDocRef = doc(FireStore, 'lostItems', postId);
    const postSnap = await getDoc(postDocRef);
    const postedUser = postSnap.data().userId;
    console.log('postSnap', postedUser);

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '70%',
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 25,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      borderWidth: 3,
      borderColor: '#0369A1',
    },
    itemImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      marginBottom: 8,
    },
    itemName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center',
    },
    itemDescription: {
      textAlign: 'left',
      marginBottom: 4, // Add spacing between field names and values
    },
    claimButtonContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
    claimButton: {
      backgroundColor: '#0369A1',
      padding: 10,
      borderRadius: 25,
      width: '60%',
      alignItems: 'center',
    },
    claimButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {fetchedItem && (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            {fetchedItem.imageUrl ? (
              <Image
                source={{ uri: fetchedItem.imageUrl }}
                style={styles.itemImage}
              />
            ) : (
              <Image source={tempimage} style={styles.itemImage} />
            )}
          </View>
          <Text style={styles.itemName}>{fetchedItem.itemName}</Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Color:</Text>{' '}
            {fetchedItem.color}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Description:</Text>{' '}
            {fetchedItem.description}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Location:</Text>{' '}
            {fetchedItem.location}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Serial No:</Text>{' '}
            {fetchedItem.serialNumber}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Date:</Text>{' '}
            {new Date(fetchedItem.timestamp.toDate()).toLocaleString()}
          </Text>

          <View style={styles.claimButtonContainer}>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => handleClaim(fetchedItem.postId)}
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
            <Text style={{ fontWeight: 'bold' }}>Color:</Text> {item.color}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Description:</Text>{' '}
            {item.description}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Location:</Text>{' '}
            {item.location}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Serial No:</Text>{' '}
            {item.serialNumber}
          </Text>
          <Text style={styles.itemDescription}>
            <Text style={{ fontWeight: 'bold' }}>Date:</Text>{' '}
            {new Date(item.timestamp.toDate()).toLocaleString()}
          </Text>

          <View style={styles.claimButtonContainer}>
            <TouchableOpacity
              style={styles.claimButton}
              onPress={() => {
                addFoundUser(item.postId);
              }}
            >
              <Text style={styles.claimButtonText}>Return</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default LostItem;
