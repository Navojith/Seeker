import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';

const CustomHeader = ({ title }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.headerContainer}>
      {/* Image 1 */}
      <Image
        source={require('../assets/header2c.png')} // Replace with your first image path
        style={[styles.image, { width: screenWidth}]}
      />

      {/* Image 2 */}
      <Image
        source={require('../assets/header1c.png')} // Replace with your second image path
        style={[styles.image, { width: screenWidth}]}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
      position: 'relative',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 200 
     
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 100, 
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
      },
  });

export default CustomHeader;
