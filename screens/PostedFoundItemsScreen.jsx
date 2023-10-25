import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FireStore, auth } from '../firebase';
import { useNavigation} from '@react-navigation/native';
import { getDocs, collection, query, where } from 'firebase/firestore';
const tempimage = require("../assets/images/PostCreation/AddImage.png");

const PostedFoundItemsScreen = () => {
  const [foundItems, setFoundItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getFoundItems = async () => {
      try {
        const collectionRef = collection(FireStore, "foundItems");
        const q = query(collectionRef, where("userId", "==", auth.currentUser.uid));
        const returnCollectionRef = collection(FireStore, "lostItems");
        const returnQuery = query(returnCollectionRef, where("foundUserId", "==" ,auth.currentUser.uid ));
        const querySnapshot = await getDocs(q);
        const returnQuerySnapshot = await getDocs(returnQuery);
        console.log('query',returnQuerySnapshot);

        if (querySnapshot.empty && returnQuerySnapshot.empty) {
          console.log("No matching documents.");
        } else {
          const lostItems = querySnapshot.docs.map((doc) => doc.data());
          const foundItems = returnQuerySnapshot.docs.map((doc)=>doc.data());
          const items = lostItems.concat(foundItems);
          console.log(items);
          setFoundItems(items);
        }
      } catch (error) {
        console.error("Error fetching found items:", error);
      }
    };
    getFoundItems();
  }, []);

  const styles = StyleSheet.create({
    container: {
      marginLeft: 20,
      marginRight: 20,
      marginTop: 20,
    },
    itemText: {
      fontSize: 16,
      margin: 2,
      
    },
    postDetails: {
      height: 40,
    },
    card: {
      marginTop: 8,
      marginLeft: 10,
      marginRight: 10,
      width: '95%',
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 25,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      borderWidth: 4,
      borderColor: '#0369A1',
      height: 140,
    },
    itemDetails: {
      flexDirection: 'row',
    },
    itemImage: {
      width: 60,
      height: 60,
      marginTop: 1,
      marginLeft: 8,
      marginRight: 16,
      marginBottom: 8,
      borderRadius: 8, // Add border radius to the image
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      
    },
    button: {
      backgroundColor: '#0369a1',
      color: '#fff',
      borderRadius: 20, // Increase border radius for curved buttons
      padding: 8,
      paddingHorizontal: 15
    },
  });

  return (
    <View>
      <SafeAreaView>
        <FlatList
          data={foundItems}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>navigation.navigate('Requests', {item})}>
              <View key={item.id} style={styles.card}>
                <View style={styles.itemDetails}>
                  <Image source={{uri:item.imageUrl}} style={styles.itemImage} />
                  <View style={styles.postDetails}>
                    <Text style={styles.itemText}>Item: {item.itemName}</Text>
                    {/* <Text style={styles.itemText}>Item: {item.postId}</Text> */}
                    <Text style={styles.itemText}>Location: {item.location}</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Return to owner");
                    }}
                    style={styles.button}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Return to Owner</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Handover to Security");
                    }}
                    style={styles.button}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Handover to Security</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.id + index.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

export default PostedFoundItemsScreen;
