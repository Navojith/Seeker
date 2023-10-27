import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { PersonalBelongingsTypes } from '../constants/PersonalBelongingsTypes';
import { StyleSheet } from 'react-native';
import MainButton from '../components/common/buttons/MainButton';
import { FireStore } from '../firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-native';
import { auth } from '../firebase';
import { Profile } from '../constants/RouteConstants';

const AddPBModal = ({ isVisible, setIsVisible, navigation }) => {
  const [type, setType] = useState(PersonalBelongingsTypes.Laptop);
  const [name, setName] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (name.length) {
      const data = {
        name,
        type,
        serialNo,
      };
      try {
        setLoading(true);
        await updateDoc(doc(FireStore, 'userDetails', auth.currentUser.uid), {
          devices: arrayUnion(data),
        });
        setLoading(false);
        Alert.alert('Success', 'Device Added Successfully');
        setIsVisible(false);
        navigation.navigate(Profile);
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please Enter the Device Name');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingHorizontal: 30,
          paddingVertical: 20,
          borderRadius: 42,
          borderWidth: 6,
          borderColor: '#0369A1',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#0369A1',
            marginBottom: 30,
          }}
        >
          Add Personal Belongings
        </Text>
        <Image
          source={
            type === PersonalBelongingsTypes.Laptop
              ? require('../assets/images/PersonalBelongingsTypes/Laptop.png')
              : type === PersonalBelongingsTypes.Phone
              ? require('../assets/images/PersonalBelongingsTypes/Phone.png')
              : type === PersonalBelongingsTypes.Charger
              ? require('../assets/images/PersonalBelongingsTypes/Charger.png')
              : require('../assets/images/PersonalBelongingsTypes/Other.png')
          }
          style={{ width: 80, height: 80, marginBottom: 10 }}
        />
        <View style={styles.flexRow}>
          <Text style={styles.text}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(val) => setName(val)}
          />
        </View>
        <View style={styles.flexRow}>
          <Text style={styles.text}>Type</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={type}
              dropdownIconColor={'#0369A1'}
              dropdownIconRippleColor={'#0284C7'}
              selectionColor={'#0284C7'}
              onValueChange={(itemValue) => setType(itemValue)}
              style={styles.pickerContent}
            >
              <Picker.Item
                label={PersonalBelongingsTypes.Laptop}
                value={PersonalBelongingsTypes.Laptop}
                style={styles.pickerItems}
              />
              <Picker.Item
                label={PersonalBelongingsTypes.Phone}
                value={PersonalBelongingsTypes.Phone}
                style={styles.pickerItems}
              />
              <Picker.Item
                label={PersonalBelongingsTypes.Charger}
                value={PersonalBelongingsTypes.Charger}
                style={styles.pickerItems}
              />
              <Picker.Item
                label={PersonalBelongingsTypes.Other}
                value={PersonalBelongingsTypes.Other}
                style={styles.pickerItems}
              />
            </Picker>
          </View>
        </View>
        <View style={styles.flexRow}>
          <Text style={styles.text}>Serial No</Text>
          <TextInput
            placeholder="Optional"
            style={styles.input}
            value={serialNo}
            onChangeText={(val) => setSerialNo(val)}
          />
        </View>
        {loading && <Text style={{ color: '#0369A1' }}>Sending Data...</Text>}
        <MainButton
          text="Add New Device"
          containerStyles={'mt-8 rounded-full w-[150px] '}
          textStyles={'text-sm'}
          onPress={handleSubmit}
        />
      </View>
    </Modal>
  );
};

export default AddPBModal;

const styles = StyleSheet.create({
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    paddingHorizontal: 0,
    gap: 10,
    marginTop: 15,
  },
  input: {
    borderWidth: 3,
    width: '70%',
    borderColor: '#0369A1',
    borderRadius: 7,
    paddingHorizontal: 10,
    color: '#0369A1',
    fontSize: 16,
    paddingVertical: 3,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0369A1',
    width: '30%',
  },
  picker: {
    borderWidth: 3,
    borderColor: '#0369A1',
    borderRadius: 7,
    width: '70%',
  },
  pickerContent: {
    color: '#0369A1',
    margin: -10,
    paddingVertical: -50,
  },
  pickerItems: {
    color: '#0369A1',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
