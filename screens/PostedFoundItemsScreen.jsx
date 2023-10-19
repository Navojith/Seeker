import { View, Text , SafeAreaView , FlatList , Image , StyleSheet , Button} from 'react-native';
import React, { useState , useEffect } from 'react';
import { FireStore } from '../firebase';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import MainButton from '../components/common/buttons/MainButton';
import { auth } from '../firebase';
// const deleteIcon = '../assets/images/delete.png';
const imageIcon = require('../assets/imageIcon.png');

// const DATA = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//     title: 'First Item',
//     location: 'qwe',
//     image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     title: 'Second Item',
//     location: 'qwe',
//     image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29d72',
//     title: 'Third Item',
//     location: 'qwe',
//     image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e29op2',
//     title: 'Fourth Item',
//     location: 'qwe',
//     image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
//   },
//   {
//     id: '58694a0f-3da1-471f-bd96-145571e2456',
//     title: 'Fifth Item',
//     location: 'qwe',
//     image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
//   },
// ];

const PostedFoundItemsScreen = () => {
  const [user , setUser] = useState(null);
  const [posts , setPosts] = useState([]);

  // useEffect(() => {
  //   const currentUser = auth.currentUser.uid;

  //   if (currentUser) {
  //     setUser(currentUser);
  //     console.log(currentUser);
  //   }
  //   console.log(currentUser);
  
  // },[])

  useEffect(() =>{
    const currentUser = auth.currentUser.uid;

    // if (currentUser) {
    //   setUser(currentUser);
    //   console.log(currentUser);
    // }
    // console.log(currentUser);
  
    // console.log("user" , user);

    const getPostedFoundItems = async () =>{
      console.log("get posted found items");
      try{
        const postedItemquery = await getDocs(collectionGroup(FireStore, 'foundItems'));
        
        if(postedItemquery.empty){
          console.log("No documents");
        }else{
          const posts = postedItemquery.docs
            .filter((doc) => doc.data().userId === currentUser)
            .map((doc) => doc.data());
          console.log(posts);
          setPosts(posts);
          console.log(posts);
        }

      }catch (error) {
          console.error(error);
      }
    }
    getPostedFoundItems();
  },[])

  const styles = StyleSheet.create({
    container:{
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
    },
    itemText: {
      fontSize: 16,
      margin: 2,
    },
    postDetails:{
      height:40,
    },
    card: {
        marginTop: 8 ,
        marginLeft:10,
        marginRight:10,
        width: '95%', // Adjust as needed to fit two cards per row
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
        height:140,
      },
      itemDetails:{
        flexDirection:'row',
      },
      itemImage: {
        width: 60, 
        height: 60, 
        // resizeMode: 'cover',
        marginTop: 1, 
        marginLeft:8,
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
  });

  return (
    <View>
      <SafeAreaView>
      <FlatList 
        data={posts} 
        renderItem={({item})=>(
          <TouchableOpacity >
            <View key={item.id} style={styles.card}>
              <View style={styles.itemDetails}>
                <Image source={imageIcon} style={styles.itemImage}/>
                  <View style={styles.postDetails}>
                    <Text style={styles.itemText}>Item : {item.itemName}</Text>
                    <Text style={styles.itemText}>Location : {item.location}</Text>
                  </View>
              </View>    
              <View style={styles.buttonflex}>
                <Button
                  // onPress={onPressLearnMore}
                  title="return to Owner"
                  style={styles.itemButton}
                />
                <Button
                  // onPress={onPressLearnMore}
                  title="Handover to Security"
                  style={styles.itemButton}
                />
              </View>
            </View>
          </TouchableOpacity >
        )}
      />
      </SafeAreaView>
    </View>
  );
};

export default PostedFoundItemsScreen;

  