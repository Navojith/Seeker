import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FireStore } from '../firebase';
import { collectionGroup, getDocs } from 'firebase/firestore';
const tempimage = require('../assets/images/PostCreation/AddImage.png');
const LostItemsListScreen = () => {
    const [lostItems, setLostItems] = useState([]);

    const styles = StyleSheet.create({
        container:{
            marginLeft: 20,
            marginRight: 20,
            marginTop:20,
        },
        itemText: {
          fontSize: 16,
        },
        card: {
            margin: 4 ,
            width: '48%', // Adjust as needed to fit two cards per row
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
            width: '100%', 
            height: 100, 
            resizeMode: 'cover',
            marginBottom: 8, 
          },
      });

    useEffect(() => {
        const getLostItems = async () => {
            try {
            
                const querySnapshot = await getDocs(collectionGroup(FireStore, 'posted'));
                if(querySnapshot.empty) {
                    console.log('No matching documents.');
                    
                }
                else{
                    const items = querySnapshot.docs.map((doc) => doc.data());
                    console.log('Retrieved items:', items);
                    setLostItems(items);
                }
                
                
            } catch (error) {
                console.error(error);
                // Handle error here
            }
        };
        getLostItems();
    }, []);

    return (
        <View>
            <View>
                <Text>Search.........</Text>
            </View>
        <View style={styles.container}>
            <FlatList
                data={lostItems}
                numColumns={2}
                key={2}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source= {tempimage} style={styles.itemImage} />
                        <Text style={styles.itemText}>{item.itemName}</Text>
                        {/* <Text style={styles.itemText}>Serial Number: {item.serialNumber || 'N/A'}</Text>
                        <Text style={styles.itemText}>Color: {item.color || 'N/A'}</Text>
                        <Text style={styles.itemText}>Location: {item.location}</Text>
                        <Text style={styles.itemText}>Other: {item.other || 'N/A'}</Text>
                        <Text style={styles.itemText}>Description: {item.description}</Text> */}
                    </View>
                )}
                keyExtractor={(item) => item.userId} // Use a unique key for each item
            />
        </View>
        </View>
    );
}

export default LostItemsListScreen;
