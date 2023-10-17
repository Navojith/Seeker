import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { FireStore, auth } from '../firebase';
import podium from '../assets/podium.png';
import {
  collectionGroup,
  getDocs,
  addDoc,
  collection,
} from 'firebase/firestore';
// import Header from '../components/header';

const LeaderBoard = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    const getLeaderboardUsers = async () => {
      try {
        const querySnapshot = await getDocs(
          collectionGroup(FireStore, 'userDetails')
        );
        if (querySnapshot.empty) {
          console.log('No matching documents.');
        } else {
          const users = querySnapshot.docs.map((doc) => doc.data());
          console.log('Retrieved users:', users);
          setUsers(users);
        }
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };
    getLeaderboardUsers();
  }, []);
  return (
    <View>
      <Text>
        <FlatList
          data={users}
          numColumns={3}
          renderItem={({ user }) => (
            <View>
              {/* <Image
                source={podium}
                style={{
                  width: 10,
                  height: 10,
                }}
              /> */}
              {/* <Text>{user.displayedName}</Text>*/}
              {/* <Text> {user}</Text> */}
              <Text>Works</Text>
            </View>
          )}
          keyExtractor={(user) => user.id}
        />
      </Text>
    </View>
  );
};

export default LeaderBoard;
