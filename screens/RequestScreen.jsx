import { View, Text , SafeAreaView , FlatList , Image , StyleSheet , Button} from 'react-native';
import React from 'react';
import { FireStore } from '../firebase';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import SecondaryButton from '../components/common/buttons/SecondaryButton';
import MainButton from '../components/common/buttons/MainButton';
// import { auth } from 'firebase/auth';
// const deleteIcon = '../assets/images/delete.png';
const tempimage = require('../assets/delete.png');

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    location: 'qwe',
    image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    location: 'qwe',
    image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    location: 'qwe',
    image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29op2',
    title: 'Fourth Item',
    location: 'qwe',
    image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e2456',
    title: 'Fifth Item',
    location: 'qwe',
    image : 'https://cdn-icons-png.flaticon.com/128/739/739249.png',
  },
];

const RequestScreen = () => {
  // const currentUser = auth.currentUser.uid;
  // console.log(currentUser);

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
  });

  return (
    <View>
      <SafeAreaView>
      <FlatList 
        data={DATA} 
        renderItem={({item})=>(
          <TouchableOpacity >
            <View key={item.id} style={styles.card}>
              <View style={styles.itemDetails}>
                <Image source={{uri:item.image}} style={styles.itemImage}/>
                  <View style={styles.postDetails}>
                    <Text style={styles.itemText}>Item : {item.title}</Text>
                    <Text style={styles.itemText}>Location : {item.location}</Text>
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

  