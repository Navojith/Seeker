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
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
// import Header from '../components/header';
import UserIcon from '../assets/icons/UserIcon';

const LeaderBoard = () => {
  const [users, setUsers] = useState([
    {
      displayedName: 'Dinal',
      points: '120',
      key: '1',
    },
    {
      displayedName: 'Dinal1',
      points: '1200',
      key: '2',
    },
    {
      displayedName: 'Dinal2',
      points: '120',
      key: '3',
    },
    {
      displayedName: 'Dinal1',
      points: '1200',
      key: '4',
    },
    {
      displayedName: 'Dinal2',
      points: '120',
      key: '5',
    },
    {
      displayedName: 'Dinal1',
      points: '1200',
      key: '6',
    },
    {
      displayedName: 'Dinal2',
      points: '120',
      key: '7',
    },
    {
      displayedName: 'Dinal1',
      points: '1200',
      key: '8',
    },
    {
      displayedName: 'Dinal2',
      points: '120',
      key: '9',
    },
  ]);

  const styles = StyleSheet.create({
    pageStyle: {
      marginTop: 220,
      display: 'grid',
      justifyItems: 'center',
    },
    headerStyle: {
      flexDirection: 'row',
      width: '85%',
      borderWidth: 4,
      backgroundColor: '#0284C7',
      borderColor: '#0284C7',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingVertical: 5,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    itemStyle: {
      flexDirection: 'row',
      width: '85%',
      borderWidth: 4,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      backgroundColor: '#fff',
      borderColor: '#0284C7',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingVertical: 10,
    },
    nameItem: {
      marginVertical: 4,
      marginHorizontal: 16,
      flex: 4,
      fontSize: 20,
      textAlignVertical: 'center',
      paddingLeft: 5,
      fontWeight: 'bold',
    },
    nameHeader: {
      marginVertical: 4,
      flex: 4,
      fontSize: 23,
      textAlignVertical: 'center',
      paddingLeft: 30,
      textAlign: 'right',
      fontWeight: 'bold',
    },
    pointsItem: {
      marginVertical: 4,
      marginHorizontal: 16,
      flex: 3,
      fontSize: 20,
      paddingRight: 10,
      textAlign: 'right',
      textAlignVertical: 'center',
      fontWeight: 'bold',
    },
    pointsHeader: {
      marginVertical: 4,
      flex: 3,
      fontSize: 23,
      paddingRight: 10,
      textAlign: 'center',
      textAlignVertical: 'center',
      paddingLeft: 30,
      fontWeight: 'bold',
    },
    picItem: {
      marginVertical: 4,
      marginHorizontal: 16,
      flex: 2,
      paddingLeft: 15,
    },
  });

  const tableHeader = () => {
    return (
      <View style={styles.headerStyle}>
        <Text style={styles.nameHeader}>Name</Text>
        <Text style={styles.pointsHeader}>Points</Text>
      </View>
    );
  };

  useEffect(() => {
    const getLeaderboardUsers = async () => {
      try {
        const leadeboardQuery = query(
          collection(FireStore, 'userDetails'),
          orderBy('points', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(leadeboardQuery);
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
    <View style={styles.pageStyle}>
      <View
        style={{
          // flex: 1,
          // alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F0F9FF',
        }}
      >
        <FlatList
          data={users}
          numColumns={1}
          ListHeaderComponent={tableHeader}
          renderItem={({ item }) => (
            <View style={styles.itemStyle}>
              <View>
                <View style={styles.picItem}>
                  <UserIcon />
                  {/* <Image style={{ height: 40, width: 40 }} source={UserIcon} /> */}
                </View>
              </View>

              <Text style={styles.nameItem}> {item.displayedName}</Text>
              <Text style={styles.pointsItem}> {item.points} </Text>
            </View>
          )}
          keyExtractor={(item) => {
            return item.id;
          }}
        />
      </View>
    </View>
  );
};

export default LeaderBoard;
