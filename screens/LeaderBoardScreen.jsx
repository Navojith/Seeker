import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FireStore, auth } from '../firebase';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import UserIcon from '../assets/icons/UserIcon';
import { getPushDataObject } from 'native-notify';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  FoundItem,
  LeaderboardPost,
  LostItems,
  LostItem,
} from '../constants/RouteConstants';

const LeaderBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  let pushDataObject = getPushDataObject();

  useEffect(() => {
    console.log(pushDataObject);
    if (pushDataObject && pushDataObject.type === 'searchFoundItem') {
      navigation.navigate(FoundItem, { pushDataObject });
    }
    if (pushDataObject && pushDataObject.type === 'searchLostItem') {
      navigation.navigate(LostItem, { pushDataObject });
    }
    if (pushDataObject && pushDataObject.type === 'specialPost') {
      navigation.navigate(LostItems, {
        screen: LeaderboardPost,
        params: { pushDataObject },
      });
    }
    if (pushDataObject && pushDataObject.type === 'confirm return item') {
      navigation.navigate('Posted Found Items', { pushDataObject });
    }
    if (pushDataObject && pushDataObject.type === 'congrats') {
      navigation.navigate('Posted Found Items', { pushDataObject });
    }
  }, [pushDataObject]);

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
    footerStyle: {
      flexDirection: 'row',
      width: '85%',
      borderWidth: 4,
      backgroundColor: '#0284C7',
      borderColor: '#0284C7',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingVertical: 5,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
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

  const tableFooter = () => {
    return <View style={styles.footerStyle}></View>;
  };

  useEffect(() => {
    const getLeaderboardUsers = async () => {
      try {
        setLoading(true);
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
          // console.log('Retrieved users:', users);
          setUsers(users);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        // Handle error here
      }
    };
    getLeaderboardUsers();
    // }, [pushDataObject, isFocused]);
  }, [pushDataObject]);

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
          ListFooterComponent={tableFooter}
          renderItem={({ item }) => (
            <View style={styles.itemStyle}>
              <View>
                <View style={styles.picItem}>
                  {item.avatarUrl ? (
                    <Image
                      style={{ height: 50, width: 50, borderRadius: 100 }}
                      source={{ uri: item.avatarUrl }}
                    />
                  ) : (
                    <UserIcon />
                  )}
                </View>
              </View>

              <Text style={styles.nameItem}> {item.displayedName}</Text>
              <Text style={styles.pointsItem}> {item.points} </Text>
            </View>
          )}
          keyExtractor={(item) => {
            return item.userId;
          }}
        />
      </View>
      {loading && (
        <Text className="text-light-blue text-lg font-bold mt-5 ml-12">
          Loading... Please wait....
        </Text>
      )}
    </View>
  );
};

export default LeaderBoard;
