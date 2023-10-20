import { View, Text , SafeAreaView ,FlatList , Image , StyleSheet , Button} from 'react-native';
import React , {useState , useEffect} from 'react';
import { FireStore } from '../firebase';
import { collection, getDocs , query , where} from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import MainButton from '../components/common/buttons/MainButton';
import { CheckBox } from 'react-native-web';
import { auth } from '../firebase';
import UserIcon from '../assets/icons/UserIcon';

const RequestScreen = ({route}) => {
  const {item} = route.params;
  console.log(item);
  const [isSelected, setIsSelected] = useState(false);
  const[requests , setRequests] = useState([]);
  const [user , setUser] = useState(null);
  const [userDetails , setUserDetails] = useState([]);
  
  // const handleOwner = () =>{
  //   setIsSelected() --- user Id
  // }

  useEffect(() => {
    const getRequests = async()=>{
      try{
      console.log("get requests");
      const requestCollectionRef = collection(FireStore, "requests");
      const q = query(requestCollectionRef, where("itemDetails", "==", item.postId) ,);
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log("No matching documents.");
      } else {
        const requestDetails = querySnapshot.docs.map((doc) => doc.data().user);
        console.log(requestDetails);
        setRequests(requestDetails);
        console.log(requests);

        const userDetailsPromises = requestDetails.map(async (user)=>{
          const userCollectionRef = collection(FireStore,"userDetails");
          const x = query(userCollectionRef,where("userId","==",user));
          const userSnapshot = await getDocs(x);

          if (userSnapshot.empty) {
            console.log(`User details not found`);
          } else {
            const newUser = userSnapshot.docs.map((doc)=> doc.data());
            console.log(newUser);
            return newUser[0];
            // setUserDetails([...userDetails , newUser]);
          }
          console.log(userDetails);
        });

        const userDetails = await Promise.all(userDetailsPromises);
        const filteredUserDetails = userDetails.filter((user) => user !== null);
        setUserDetails(filteredUserDetails);
        console.log(userDetails);
      }
    } catch (error) {
      console.error("Error fetching found items:", error);
    }
    };
    getRequests();
  } ,[]);

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
      <SafeAreaView>
        <Text style={styles.itemDetails}>To select the owner , Click on the request</Text>
      <FlatList 
        data={userDetails} 
        renderItem={({item})=>(
          <TouchableOpacity >
            <View key={item.id} style={styles.card}>
              <View style={styles.itemDetails}>
                <UserIcon style={styles.itemImage}/>
                  <View style={styles.postDetails}>
                    <Text style={styles.itemText}>{item.displayedName}</Text>
                    <Text style={styles.itemText}>Location : {item.phoneNo}</Text>
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

  