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

const FoundScreen = () => {

  return (
    <View>
      <Text>FoundScreen</Text>
    </View>
  );
};

export default FoundScreen;

  