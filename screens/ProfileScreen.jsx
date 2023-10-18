import { View , StyleSheet , TouchableOpacity , Button , Image, Text} from 'react-native';
import React , {useEffect, useState} from 'react';
import { auth } from '../firebase';
import CustomHeader from '../components/header';
import { useNavigation } from '@react-navigation/native';
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
    <View>
      <CustomHeader title="Profile"/>
      <View style={styles.container}>
        <Image source = {img} style={styles.profilepic}/>
        <Text style={styles.profileDetails}>UserName</Text>
        <Text style={styles.profileDetails}>TelNo</Text>
        <Text style={styles.profileDetails}>Points : </Text>
      </View>
      <TouchableOpacity>
      <Button onPress={handleSignOut} style={styles.itemButton} title="Sign Out" />
      <Button 
        onPress={handlePostedLostItems} 
        style={styles.itemButton}
        title="Posted Lost Items"/> 
      <Button 
        onPress={handlePostedFoundItems} 
        style={styles.itemButton}
        title="Posted Found Items"/> 
      </TouchableOpacity>  
    </View>
  );
};

export default ProfileScreen;

