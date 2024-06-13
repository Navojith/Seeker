import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { FireStore, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import axios from 'axios';
import getPoints from '../util/pointCalculation/getPoints';
import { getPushDataObject } from 'native-notify';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import TwoButtonModal from '../components/common/modals/TwoButtonModal';
import LoadingComponent from './LoadingScreen';
const tempimage = require('../assets/images/PostCreation/AddImage.png');

const PostedFoundItemsScreen = ({ route }) => {
  const [foundItems, setFoundItems] = useState([]);
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = route.params;
  const pushDataObject = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [info , setInfo] = useState({ 
    visibility: false,
    viewStyles: ` pt-8 flex justify-center border rounded-[42px] border-[6px] border-dark-blue`,
    message:
      'Click on the item post to review requests and choose the item owner to return. Click handover to security if you handover the item to security',
    buttonText: 'Okay',
    buttonContainerStyles: ` w-[100px] mx-auto rounded-full bg-dark-blue`,
    buttonTextStyles: ` font-bold`,
    messageStyles: ` text-2xl font-bold`,
  });
  const [status, setStatus] = useState({
    visibility: false,
    viewStyles: ` pt-8 flex justify-center border rounded-[42px] border-[6px] border-dark-blue`,
    message:
      'Posts can be boosted using in app points. If you have the points needed, you can boost the post absolutely free.',
    buttonText: 'Okay',
    buttonContainerStyles: ` w-[100px] mx-auto rounded-full bg-dark-blue`,
    buttonTextStyles: ` font-bold`,
    messageStyles: ` text-2xl font-bold`,
  });

  useEffect(() => {
    const getFoundItems = async () => {
      try {
        setLoading(true);
        const collectionRef = collection(FireStore, 'foundItems');
        const q = query(
          collectionRef,
          where('userId', '==', auth.currentUser.uid)
        );
        const returnCollectionRef = collection(FireStore, 'lostItems');
        const returnQuery = query(
          returnCollectionRef,
          where('foundUserId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const returnQuerySnapshot = await getDocs(returnQuery);
        // console.log('query', returnQuerySnapshot);

        if (querySnapshot.empty && returnQuerySnapshot.empty) {
          console.log('No matching documents.');
        } else {
          const lostItems = querySnapshot.docs.map((doc) => doc.data());
          const foundItems = returnQuerySnapshot.docs.map((doc) => doc.data());
          const items = lostItems.concat(foundItems);
          console.log(items);
          setFoundItems(items);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching found items:', error);
      }
    };
    getFoundItems();
  }, []);

  const fetchUser = async () => {
    setInfo({
      ...info,
      visibility: true,
  });
    try {
      const uuid = auth.currentUser.uid;
      const res = await getDoc(doc(FireStore, 'userDetails', uuid));
      if (res.exists) {
        setCurrentUser(res.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleReturnItem = async (item) => {
    // setLoading(true);
    console.log('user', user);
    console.log('userId', user.selectedUser.userId);
    console.log('current', currentUser);
    // console.log('item:',item);

    const pushData = {
      type: 'confirm return item',
      item: item.postId,
      itemName: item.itemName,
      user: user.selectedUser.userId,
      username: user.selectedUser.displayedName,
      postedUser: currentUser.userId,
      tier: item?.tier ?? 'free',
    };

    await axios
      .post(`https://app.nativenotify.com/api/indie/notification`, {
        subID: user.selectedUser.userId,
        appId: 13599,
        appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
        title: 'Seeker',
        message:
          'Did you receive your item from ' + currentUser.displayedName + '?',
        pushData: JSON.stringify(pushData),
      })
      .catch((err) => console.log(err));
    // setLoading(false);
  };

  const getRequestedUsers = async (item) => {
    // return item.postId;
    const requestCollectionRef = collection(FireStore, 'requests');
    const q = query(
      requestCollectionRef,
      where('itemDetails', '==', item.postId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No matching documents.');
    } else {
      const requestDetails = querySnapshot.docs.map((doc) => doc.data().user);
      // console.log(requestDetails);
      setRequests(requestDetails);
      console.log('getuser', requests);
      return requests;
    }
  };

  useEffect(() => {
    if (pushDataObject && pushDataObject.pushDataObject) {
      const { type } = pushDataObject.pushDataObject;

      // console.log('Item:', item);
      // console.log('Posted User:', postedUser);
      // console.log('Type:', type);
      // console.log('User:', user);

      if (type == 'confirm return item') {
        console.log('correct');
        setIsModalVisible(true);
      }
      if (type == 'congrats') {
        const { tier, name, item } = pushDataObject.pushDataObject;
        const pointsGained = getPoints(tier);
        setStatus({
          ...status,
          visibility: true,
          message:
            'You gained ' +
            pointsGained +
            ' points for returning ' +
            `${name ? name + "'s " : ''}` +
            item,
          buttonText: 'Okay',
        });
      }
    }
  }, [pushDataObject]);

  const deletePost = async (pushDataObject) => {
    setLoading(true);
    if (pushDataObject && pushDataObject.pushDataObject) {
      const { item, itemName, postedUser, type, user, tier, username } =
        pushDataObject.pushDataObject;
      console.log(item);
      if (type == 'confirm return item') {
        updatePoints(getPoints(tier), item, postedUser, type);

        const pushData = {
          tier: tier,
          name: username,
          item: itemName,
          type: 'congrats',
        };

        await axios.post(
          `https://app.nativenotify.com/api/indie/notification`,
          {
            subID: postedUser,
            appId: 13599,
            appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
            title: 'Seeker',
            message:
              'Congratulations!!!\nPoints awarded for the item you returned',
            pushData: JSON.stringify(pushData),
          }
        );

        const qf = query(
          collection(FireStore, 'foundItems'),
          where('postId', '==', item)
        );
        const ql = query(
          collection(FireStore, 'lostItems'),
          where('postId', '==', item)
        );
        const foundQuerySnapshot = await getDocs(qf);
        const lostQuerySnapshot = await getDocs(ql);

        if (!foundQuerySnapshot.empty) {
          const fdocToDelete = foundQuerySnapshot.docs[0];
          await deleteDoc(fdocToDelete.ref);
          setFoundItems(
            foundItems.filter((foundItem) => foundItem.postId !== item)
          );
        } else {
          if (!lostQuerySnapshot.empty) {
            const ldocToDelete = lostQuerySnapshot.docs[0];
            await deleteDoc(ldocToDelete.ref);
            setFoundItems(
              foundItems.filter((foundItem) => foundItem.postId !== item)
            );
          }
        }
        setLoading(false);
        setIsModalVisible(false);
        console.log('Document deleted with postID:', item);
        navigation.navigate('profile');
      }
    }
  };

  const handleSecurity = async (item) => {
    setLoading(true);
    console.log('handover to security');
    console.log(item);
    const requestedUsers = await getRequestedUsers(item);
    console.log('req', requestedUsers);

    requestedUsers?.length &&
      (await axios.post(
        `https://app.nativenotify.com/api/indie/group/notification`,
        {
          subIDs: requestedUsers,
          appId: 13599,
          appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
          title: 'Seeker',
          message:
            'Item : ' +
            item.itemName +
            '\n\nYour lost item has been handed over to the security. Go to the security office to confirm and reclaim your stuff.',
        }
      ));

    updatePoints(getPoints(item?.tier ?? 'free') / 2, item);
  };

  const updatePoints = async (
    pointsGained,
    item,
    user = auth.currentUser.uid,
    type = 'security'
  ) => {
    try {
      const docRef = doc(FireStore, 'userDetails', user);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const doc = docSnap.data();
        const newPoints = doc.points + pointsGained;
        await updateDoc(docRef, { points: newPoints });
        console.log('Document successfully updated!');
        if (type == 'security') {
          setStatus({
            ...status,
            visibility: true,
            message:
              'You gained ' +
              pointsGained +
              ' points for returning ' +
              `${
                user?.selectedUser
                  ? user?.selectedUser?.displayedName + "'s "
                  : ''
              }` +
              item.itemName +
              ' to the security office.',
            buttonText: 'Okay',
          });
        }
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

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
      borderRadius: 8,
      resizeMode: 'contain',
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
      paddingHorizontal: 15,
    },
  });

  return (
    <View>
      <DismissibleAlert data={info} setData={setInfo} />
      <SafeAreaView>
        <FlatList
          data={foundItems}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Requests', { item })}
            >
              <View key={item.id} style={styles.card}>
                <View style={styles.itemDetails}>
                  {item.imageUrl ? (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <Image source={tempimage} style={styles.itemImage} />
                  )}
                  {/* <Image source={{uri:item.imageUrl}} style={styles.itemImage} /> */}
                  <View style={styles.postDetails}>
                    <Text style={styles.itemText}>Item: {item.itemName}</Text>
                    {/* <Text style={styles.itemText}>Item: {item.postId}</Text> */}
                    <Text style={styles.itemText}>
                      Location: {item.location}
                    </Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      handleReturnItem(item);
                    }}
                    style={styles.button}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Return to Owner
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSecurity(item)}
                    style={styles.button}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      Handover to Security
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => item.id + index.toString()}
        />
      </SafeAreaView>
      <TwoButtonModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        showInfoIcon={false}
        heading={'Did you receive your item ?'}
        //navigate to your page
        onPressConfirm={() =>
          // navigation.navigate(BuyBoost, { itemId: route.params.itemId })
          {
            deletePost(pushDataObject);
          }
        }
        onPressCancel={() => navigation.navigate('profile')}
      />
      <DismissibleAlert
        data={status}
        setData={setStatus}
        onPress={() => navigation.navigate('profile')}
      />
      <LoadingComponent visible={loading} />
    </View>
  );
};

export default PostedFoundItemsScreen;
