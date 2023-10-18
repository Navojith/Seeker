import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  AddLostItem,
  BuyBoost,
  PostBoosting,
} from '../constants/RouteConstants';
import LostItemsListScreen from './LostItemsListScreen';

const LostScreen = () => {
  const navigation = useNavigation();

  const handleAddItem = () => {
    navigation.navigate(AddLostItem);
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <LostItemsListScreen />
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      {/* Temparary added for testing purposes */}
      <TouchableOpacity
        style={styles.Temp}
        onPress={() => navigation.navigate(BuyBoost)}
      >
        <Text style={styles.buttonTextTemp}>Temp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listContainer: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#0369A1',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
    // fontWeight: 'bold',
  },

  //Temparary added for testing purposes
  buttonTextTemp: {
    color: 'white',
    fontWeight: 'bold',
  },

  Temp: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    backgroundColor: '#0369A1',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default LostScreen;
