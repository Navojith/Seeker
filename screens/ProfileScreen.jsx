import { View , StyleSheet , TouchableOpacity , Button , Image, Text} from 'react-native';
import React , {useEffect, useState} from 'react';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header'
const img = require('../assets/profilepic.png');

const ProfileScreen = () => {
  const [user , setUser] = useState(null)
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    container:{
      marginTop : 130,
      justifyContent:'center',
      alignItems: 'center',
    },
    profilepic:{
      margin:8,
      width:90,
      height:90,
    },
    profileDetails:{
      fontSize:20,
      fontWeight:'bold',
      margin:2,
    },
    itemButton:{
      borderRadius:25,
      width:'50%',
    }
  })

  const handlePostedLostItems = () => {
    navigation.navigate('postedLostItems');
  };

  const handlePostedFoundItems = () => {
    navigation.navigate('postedFoundItems');
  }


  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
      console.log(currentUser);
    }
    console.log(currentUser);

  },[])

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('Signed out');
      })
      .catch((error) => {
        console.log(error.code, error.message);
        alert(error.message);
      });
  };

  return (
    <View style={styles.signOut}>
      <MainButton onPress={handleSignOut} text={'Sign Out'}   />
    </View>
  );
};

export default ProfileScreen;

