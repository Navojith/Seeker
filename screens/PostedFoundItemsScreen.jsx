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
const tempimage = require('../assets/images/PostCreation/AddImage.png');

const PostedFoundItemsScreen = ({ route }) => {
  const [foundItems, setFoundItems] = useState([]);
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const [requestedUsers , setRequestedUsers] = useState([]);
  const [requests , setRequests] = useState([]);
  const user = route.params;
  const pushDataObject = route.params;
  const [isModalVisible , setIsModalVisible] = useState(false);
  const [status, setStatus] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
    buttonText: 'Okay',
  });

  useEffect(() => {
    const getFoundItems = async () => {
      try {
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
        console.log('query', returnQuerySnapshot);

        if (querySnapshot.empty && returnQuerySnapshot.empty) {
          console.log('No matching documents.');
        } else {
          const lostItems = querySnapshot.docs.map((doc) => doc.data());
          const foundItems = returnQuerySnapshot.docs.map((doc) => doc.data());
          const items = lostItems.concat(foundItems);
          console.log(items);
          setFoundItems(items);
        }
      } catch (error) {
        console.error('Error fetching found items:', error);
      }
    };
    getFoundItems();
  }, []);

  const fetchUser = async () => {
    try {
      // setLoading(true);
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
    console.log('user', user);
    console.log('userId', user.selectedUser.userId);
    console.log('current', currentUser);
    // console.log('item:',item);

    const pushData = {
      type : 'confirm return item',
      item : item.postId,
      user : user.selectedUser.userId,
      postedUser : currentUser.displayedName,
      tier : item.tier,
    };

    await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: user.selectedUser.userId,
      appId: 13599,
      appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
      title: 'Seeker',
      message:
        'Did you receive your item from ' + currentUser.displayedName + '?',
      pushData: JSON.stringify(pushData),
    });
  };

  const getRequestedUsers = async(item) => {
    // return item.postId;
    const requestCollectionRef = collection(FireStore, "requests");
    const q = query(requestCollectionRef, where("itemDetails", "==", item.postId) ,);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
    } else {
      const requestDetails = querySnapshot.docs.map((doc) => doc.data().user);
      // console.log(requestDetails);
      setRequests(requestDetails);
      console.log('getuser',requests);
      return requests;
    }
  }

  useEffect(()=>{
    if (pushDataObject && pushDataObject.pushDataObject) {
      const { item, postedUser, type, user} = pushDataObject.pushDataObject;
  
      console.log('Item:', item);
      console.log('Posted User:', postedUser);
      console.log('Type:', type);
      console.log('User:', user);
  
      if(type == 'confirm return item'){
        console.log("correct");
        setIsModalVisible(true);
      }
    }
   }, [pushDataObject])

   const deletePost = async(pushDataObject) => 
   {
    if (pushDataObject && pushDataObject.pushDataObject)
     {
      const { item, postedUser, type, user} = pushDataObject.pushDataObject;
      console.log(item);

      const qf = query(collection(FireStore, "foundItems"), where("postId", "==", item));
      const ql = query(collection(FireStore, "lostItems"), where("postId", "==", item));
      const foundQuerySnapshot = await getDocs(qf);
      const lostQuerySnapshot = await getDocs(ql);

      if (!foundQuerySnapshot.empty)
      {
        const fdocToDelete = foundQuerySnapshot.docs[0];
        await deleteDoc(fdocToDelete.ref);
        setFoundItems(posts.filter((post) => post.postId !== item));
      }else
      {
        if(!lostQuerySnapshot.empty)
        {
          const ldocToDelete = lostQuerySnapshot.docs[0];
          await deleteDoc(ldocToDelete.ref);
          setFoundItems(posts.filter((post) => post.postId !== item));
        }
      }
        setIsModalVisible(false);
        console.log("Document deleted with postID:", item);
        navigation.navigate("profile")
      }
      
   }

  const handleSecurity = async(item) => {
    console.log('handover to security');
    console.log(item);
    const requestedUsers = await getRequestedUsers(item);
    console.log('req',requestedUsers);
    await axios
    .post(`https://app.nativenotify.com/api/indie/group/notification`, {
      subIDs: requestedUsers,
      appId: 13599,
      appToken: 'gTBeP5h5evCxHcHdDs0yVQ',
      title: 'Seeker',
      message:
        'Item : ' +
        item.itemName +
        '\n\nYour lost item has been handed over to the security. Go to the security office to confirm and reclaim your stuff.' 
    });
    updatePoints(getPoints(item.tier) / 2);
  };

  const updatePoints = async (pointsGained) => {
    try {
      const docRef = doc(FireStore, 'userDetails', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const doc = docSnap.data();
        const newPoints = doc.points + pointsGained;
        await updateDoc(docRef, { points: newPoints });
        console.log('Document successfully updated!');
        setStatus({
          visibility: true,
          viewStyles: 'border border-4 border-green-600',
          titleStyles: 'text-green-600',
          messageStyles: 'text-green-600 font-bold',
          title: 'Success !',
          message: 'You gained ' + pointsGained + ' points !',
          buttonText: 'Okay',
        });
      } else {
        console.log('No such document!');
      }
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
                    onPress={()=>{handleReturnItem(item)}}
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
          heading={"Did you receive your item ?"}
          //navigate to your page
          onPressConfirm={() =>
            // navigation.navigate(BuyBoost, { itemId: route.params.itemId })
            {deletePost(pushDataObject)}
          }
          onPressCancel={() =>
            navigation.navigate("profile")
          }
        />
      <DismissibleAlert data={status} setData={setStatus} />
    </View>
  )
}

export default PostedFoundItemsScreen;