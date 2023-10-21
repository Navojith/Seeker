import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';

const LoadingComponent = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <View style={styles.container}>
        <Animatable.View
          animation="rotate"
          easing="ease-in-out"
          iterationCount="infinite"
          style={styles.spinnerContainer}
        >
          <ActivityIndicator size="large" color="#007BFF" />
        </Animatable.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingComponent;
