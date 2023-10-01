import { ScrollView, Text, Image, TextInput } from 'react-native';
import React from 'react';
import AddImage from '../assets/images/PostCreation/AddImage.png';

const CreateLostItemScreen = () => {
  return (
    <ScrollView className="p-4">
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
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
    </ScrollView>
  );
};

export default CreateLostItemScreen;
