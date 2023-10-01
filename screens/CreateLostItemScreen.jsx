import { View, ScrollView, Text, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AddImage from '../assets/images/PostCreation/AddImage.png';
import { Picker } from '@react-native-picker/picker';
import data from '../assets/data/SLIITLocations/index.json';
import MainButton from '../components/common/buttons/MainButton';

const CreateLostItemScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [otherVisibility, setOtherVisibility] = useState(false);

  useEffect(() => {
    if (selectedLocation === 'Other') {
      setOtherVisibility(true);
    } else {
      setOtherVisibility(false);
    }
  }, [selectedLocation]);

  return (
    <ScrollView className="p-4 flex-1  ">
      <Image
        className="mx-auto mb-4"
        source={AddImage}
        width={100}
        height={100}
      />
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Serial Number</Text>
      <TextInput
        placeholder="( Optional )"
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Color</Text>
      <TextInput
        placeholder="( Optional )"
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black  mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">
        Where did you lose it?
      </Text>
      <View className="border border-4 border-light-blue rounded-xl text-black mb-4">
        <Picker
          className="border border-4 px-4 py-2 border-light-blue"
          placeholder="Select Location"
          selectedValue={selectedLocation}
          dropdownIconColor={'black'}
          dropdownIconRippleColor={'#0284C7'}
          selectionColor={'#0284C7'}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
        >
          {data.locations.map((location, index) => (
            <Picker.Item key={index} label={location} value={location} />
          ))}
        </Picker>
      </View>
      {otherVisibility && (
        <View>
          <Text className="text-black text-lg font-bold mb-2">
            Please Specify
          </Text>
          <TextInput
            placeholder=""
            className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
          />
        </View>
      )}
      <Text className="text-black text-lg font-bold mb-2">Description</Text>
      <TextInput
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
        placeholder=""
        className="border border-4 px-4 py-6 border-light-blue rounded-xl text-black mb-4"
      />
      <MainButton
        onPress={''}
        text={'Create Post'}
        containerStyles={'mt-6 mb-12 rounded-full w-full drop-shadow-md'}
      />
    </ScrollView>
  );
};

export default CreateLostItemScreen;
