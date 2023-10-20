import { getFirestore, doc, getDoc } from '@firebase/firestore';
import { async } from '@firebase/util';
import React, { useEffect } from 'react';
import { View, ScrollView, Text, Image, TextInput } from 'react-native';

const LeaderboardItemScreen = ({ route }) => {
  const { pushDataObject } = route.params;

  useEffect(() => {
    // query(
    //     collectionGroup('userDetails')
    // )
    const fetchData = async () => {
      const DB = getFirestore();
      const docRef = doc(DB, 'posted', pushDataObject.item);
      const docSnap = (await getDoc(docRef)).data();
      console.log(docSnap);
    };
    fetchData();
  }, []);
  return (
    <View>
      <Text>LeaderboardItemScreen{pushDataObject.type}</Text>
    </View>
  );
};

export default LeaderboardItemScreen;
