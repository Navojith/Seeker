import { View, Text , SafeAreaView ,FlatList , Image , StyleSheet , Button, TouchableOpacity} from 'react-native';
import React , {useState , useEffect} from 'react';
import { FireStore } from '../firebase';
import { collection, getDocs , query , where} from 'firebase/firestore';
// import { TouchableOpacity } from 'react-native';
// import SecondaryButton from '../components/common/buttons/SecondaryButton';
// import MainButton from '../components/common/buttons/MainButton';
// import { CheckBox } from 'react-native-web';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/core';
import UserIcon from '../assets/icons/UserIcon';

const RequestScreen = ({route}) => {
  const {item} = route.params;
  console.log(item);
  const [isSelected, setIsSelected] = useState(false);
  const navigation = useNavigation();
  const[requests , setRequests] = useState([]);
  const [user , setUser] = useState(null);
  const [userDetails , setUserDetails] = useState([]);
  const [loading , setLoading] = useState(false);
  
  // const handleOwner = () =>{
  //   setIsSelected() --- user Id
  // }

  useEffect(() => {
    setLoading(true);
    const getRequests = async()=>{
      try
      {
        console.log("get requests");
        const requestCollectionRef = collection(FireStore, "requests");
        const q = query(requestCollectionRef, where("itemDetails", "==", item.postId));
        const querySnapshot = await getDocs(q);
        console.log('querySnapshot',querySnapshot);

        const requestDetails = querySnapshot.docs.map((doc) => doc.data());
        console.log('user',requestDetails);
        setRequests(requestDetails);
        console.log('request',requestDetails.length);

        if(requestDetails.length === 1)
        {
          console.log('user return the item');

          const itemDetailsPromises = requestDetails.map(async(request)=>{
            const itemCollectionRef = collection(FireStore , "lostItems");
            const l = query(itemCollectionRef, where("foundUserId" , "==" , request.user), where("postId" , "==" , item.postId ));
            const foundUserSnapshot = await getDocs(l);
            console.log(foundUserSnapshot);

            if(foundUserSnapshot.empty)
            {
              console.log('not a returned item');
            }else
            {
              const postDetails = foundUserSnapshot.docs.map((doc)=> doc.data().userId);
              console.log(postDetails);
              console.log('returned');    
              
              const userDetailsPromises = postDetails.map(async (userId) => {
                const userCollectionRef = collection(FireStore, "userDetails");
                const userQuery = query(userCollectionRef, where("userId", "==", userId));
                const userSnapshot = await getDocs(userQuery);
              
                if (!userSnapshot.empty)
                {
                  const userData = userSnapshot.docs[0].data();
                  return userData;
                }
              })
              const userDetails = await Promise.all(userDetailsPromises);
              setUserDetails(userDetails);
              console.log(userDetails);
              setLoading(false);
            }

            const foundUserDetails =  await Promise.all(itemDetailsPromises);
            console.log('userDetails',foundUserDetails);
          })
        } else
        {
          const userDetailsPromises = requests.map(async (request)=>{
            const userCollectionRef = collection(FireStore,"userDetails");
            const x = query(userCollectionRef,where("userId","==",request.user));
            const userSnapshot = await getDocs(x);

            if (userSnapshot.empty) {
              console.log('User details not found');
            } else {
              console.log('user found')
              const newUser = userSnapshot.docs.map((doc)=> doc.data());
              console.log(newUser);
              // return newUser[0];
              setUserDetails([...userDetails , newUser]);
              // console.log(userDetails);
            }
            console.log('userDetails',userDetails);  
          });

          const userDetails = await Promise.all(userDetailsPromises);
          const filteredUserDetails = userDetails.filter((user) => user !== null);
          setUserDetails(filteredUserDetails);
          // console.log('filtered user',userDetails);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching found items:", error);
      }
    };
    getRequests();
  } ,[]);

  const selectUser = async(item) =>{
    // setUser(item);
    console.log('selectedUser',item);
    navigation.navigate("Posted Found Items",{ selectedUser: item });
  }

  const styles = StyleSheet.create({
    container:{
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
    },
    itemText: {
      fontSize: 18,
      margin: 4,
      marginBottom:2,
      fontWeight:'heavy',
    },
    postDetails:{
      height:40,
    },
    card: {
        marginTop: 8 ,
        marginLeft:30,
        marginRight:30,
        width: '80%', // Adjust as needed to fit two cards per row
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 35,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderWidth: 4,
        borderColor: '#0369A1',
        height:100,
      },
      itemDetails:{
        flexDirection:'row',
      },
      itemImage: {
        width: 60, 
        height: 60, 
        // resizeMode: 'cover',
        marginTop: 1, 
        marginLeft:40,
        marginRight:16,
        marginBottom:8,
        resizeMode: 'contain'
      },
      removeimage:{
        width:30,
        height:30,
      },
      itemButton:{
        backgroundColor: '#0369a1',
      },
      buttonflex:{
        flexDirection:'row',
        justifyContent:'space-between',
      },
      checkbox: {
        alignSelf: 'center',
      },
  });

  return (
    <View>
      {loading &&(
      <Text>loading..</Text>)}
      <SafeAreaView>
        <Text style={styles.itemDetails}>To select the owner , Click on the request</Text>
    <FlatList 
        data={userDetails} 
        renderItem={({item})=>(
          <TouchableOpacity onPress={()=>{selectUser(item)}}> 
            <View 
            key={item.id} 
            style={styles.card}>
              <View style={styles.itemDetails}>
                <UserIcon style={styles.itemImage}/>
                  <View style={styles.postDetails}>
                    <Text style={styles.itemText}>Name : {item.displayedName}
                      </Text>
                    <Text style={styles.itemText}>Telno : {item.phoneNo}
                      </Text>
                  </View>
                  </View>
              </View>
         </TouchableOpacity >
        )}
      />
      </SafeAreaView>
    </View>
  );
};

export default RequestScreen;

  