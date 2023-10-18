import { View, ScrollView, Text, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import AddImage from '../assets/images/PostCreation/AddImage.png';
import { Picker } from '@react-native-picker/picker';
import data from '../assets/data/SLIITLocations/index.json';
import MainButton from '../components/common/buttons/MainButton';
import { FireStore, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import TwoButtonModal from '../components/common/modals/TwoButtonModal';
import { PostBoosting } from '../constants/RouteConstants';

const CreateLostItemScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(data.locations[0]);
  const [createdItemId, setCreatedItemId] = useState(null);
  const [otherVisibility, setOtherVisibility] = useState(false);
  const [itemName, setItemName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [other, setOther] = useState('');
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (selectedLocation === 'Other') {
      setOtherVisibility(true);
    } else {
      setOtherVisibility(false);
    }
  }, [selectedLocation]);

  const handleSubmit = async () => {
    if (itemName === '' || description === '') {
      setError((prev) => ({
        ...prev,
        visibility: true,
        viewStyles: 'border border-4 border-red-600',
        titleStyles: 'text-red-600',
        messageStyles: 'text-red-600 font-bold',
        title: 'Error !',
        message: 'Please enter item name and description !',
      }));
    } else {
      try {
        setLoading(true);
        const res = await addDoc(
          collection(FireStore, 'lostItems', auth.currentUser.uid, 'drafted'),
          {
            userId: auth.currentUser.uid,
            itemName: itemName,
            serialNumber: serialNumber ?? null,
            color: color ?? null,
            location: selectedLocation,
            other: other ?? null,
            description: description,
            timestamp: new Date(),
          }
        );

        setCreatedItemId(res.id);

        setError({
          visibility: true,
          viewStyles: 'border border-4 border-green-600',
          titleStyles: 'text-green-600',
          messageStyles: 'text-green-600 font-bold',
          title: 'Success !',
          message: 'Post created successfully !',
        });
        setLoading(false);
        setItemName('');
        setColor('');
        setDescription('');
        setOther('');
        setSerialNumber('');
        setIsModalVisible(true);
      } catch (error) {
        console.log(error);
        setError((prev) => ({
          ...prev,
          visibility: true,
          title: 'Error !',
          message: error.message + ' - ' + error.code,
        }));
      }
    }
  };

  const handleBoosting = () => {
    setIsModalVisible(false);
    navigation.navigate(PostBoosting, { itemId: createdItemId });
  };

  return (
    <ScrollView className="p-4 flex-1  ">
      <TwoButtonModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        heading={'Do you want to Boost the Post?'}
        infoMessage={
          'Posts that you create can be boosted so that more people can see the post and more people will be motivated to find the item.'
        }
        onPressConfirm={handleBoosting}
      />
      <DismissibleAlert data={error} setData={setError} />
      <Image
        className="mx-auto mb-4"
        source={AddImage}
        width={100}
        height={100}
      />
      <Text className="text-black text-lg font-bold mb-2">Item Name</Text>
      <TextInput
        value={itemName}
        onChangeText={(value) => setItemName(value)}
        placeholder=""
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Serial Number</Text>
      <TextInput
        value={serialNumber}
        onChangeText={(value) => setSerialNumber(value)}
        placeholder="( Optional )"
        className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
      />
      <Text className="text-black text-lg font-bold mb-2">Color</Text>
      <TextInput
        value={color}
        onChangeText={(value) => setColor(value)}
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
            value={other}
            onChangeText={(value) => setOther(value)}
            placeholder=""
            className="border border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4"
          />
        </View>
      )}
      <Text className="text-black text-lg font-bold mb-2">Description</Text>
      <TextInput
        value={description}
        onChangeText={(value) => setDescription(value)}
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
        placeholder=""
        className="border border-4 px-4 py-6 border-light-blue rounded-xl text-black mb-4"
      />
      {loading && (
        <Text className="text-light-blue text-lg font-bold mt-2">
          Sending... Please wait....
        </Text>
      )}
      <MainButton
        onPress={handleSubmit}
        text={'Create Post'}
        containerStyles={'mt-6 mb-12 rounded-full w-full drop-shadow-md'}
      />
    </ScrollView>
  );
};

export default CreateLostItemScreen;
