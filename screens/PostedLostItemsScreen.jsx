import { View, Text , SafeAreaView , FlatList , Image , StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FireStore } from '../firebase';
import { collectionGroup, getDocs , doc, deleteDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import MainButton  from '../components/common/buttons/MainButton';
import { useNavigation } from '@react-navigation/native';
// const deleteIcon = '../assets/images/delete.png';
const tempimage = require('../assets/delete.png');
const imageIcon = require('../assets/imageIcon.png');

const PostedLostItemsScreen = () => {
  // const [user , setUser] = useState(null);
  const [posts , setPosts] = useState([]);
  const [selectedItem , setSelectedItem] = useState(null);
  const navigation = useNavigation();


  useEffect(() =>{
    const currentUser = auth.currentUser.uid;

    // if (currentUser) {
    //   setUser(currentUser);
    //   console.log(currentUser);
    // }
    console.log(currentUser);
  
    const getPostedLostItems = async () =>{
      console.log("get posted lost items");
      try{
        const postedItemquery = await getDocs(collectionGroup(FireStore, 'lostItems'));
        
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
    getPostedLostItems();
  },[])

  const handleDeleteItem = async()=>{
    if(selectedItem){
      console.log(selectedItem);
      try{
        const result = await deleteDoc(doc(FireStore, "lostItems", selectedItem.itemName));
        console.log(result);
        // setPosts(posts.filter(item => item.id !== selectedItem.id));
        // setSelectedItem(null);
      }catch(error){
        console.log(error);
      }
    }
  }

  const styles = StyleSheet.create({
    container:{
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
        backgroundColor:'#ff0000',
    },
    itemText: {
      fontSize: 20,
      margin: 4,
      fontWeight: 'bold',
    },
    postDetails:{
      height:55,
    },
    card: {
        marginTop: 8 ,
        marginLeft:20,
        marginRight:20,
        width: '90%', // Adjust as needed to fit two cards per row
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
        flexDirection:'row',
        // justifyContent: 'space-between',
      },
      itemImage: {
        width: 70, 
        height: 70, 
        resizeMode: 'cover',
        marginTop: 2,
        marginBottom:2,
        marginLeft:8,
        marginRight:16,
      },
      removeimage:{
        width:30,
        height:30,
        position:'relative',
        justifyContent:'flex-end',
      },
  });

  return (
    <View>
      <SafeAreaView>
      <FlatList 
        data={posts} 
        renderItem={({item})=>(
          <TouchableOpacity onPress={() => setSelectedItem(item)}>
          <View key={item.id} style={styles.card}>
            <Image source={imageIcon} style={styles.itemImage}/>
            <View style={styles.postDetails}>
              <Text style={styles.itemText}>Item : {item.itemName}</Text>
              <Text style={styles.itemText}>Location : {item.location}</Text>
            </View>
            {/*  onPress={() => removeGoal(itemData.item.key)} */}
              {/* <Text  style={styles.itemText}>Delete</Text> */}
            {/* <View styles={{height:100, width:100 , justifyContent:'center',border:'1px solid #000' , margin: 10, padding: 10}}> */}
            <TouchableOpacity onPress={handleDeleteItem}> 
              <Image source={tempimage} 
                style={styles.removeimage}
              />
            {/* </View> */}
            </TouchableOpacity>
          </View>
         </TouchableOpacity >
        )}
      />
      </SafeAreaView>
    </View>
  );
};

export default PostedLostItemsScreen;
