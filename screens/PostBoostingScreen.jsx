import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import InformationIcon from '../assets/icons/InformationIcon';
import MainButton from '../components/common/buttons/MainButton';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import { FireStore, auth } from '../firebase';
import { getDocs, collectionGroup, getDoc } from 'firebase/firestore';
import TwoButtonModal from '../components/common/modals/TwoButtonModal';
import { BuyBoost } from '../constants/RouteConstants';

const PostBoostingScreen = ({ route, navigation }) => {
  const [level, setLevel] = useState(1);
  const [needed, setNeeded] = useState(10);
  const [available, setAvailable] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showInfoLevelModal, setShowInfoLevelModal] = useState({
    visibility: false,
    viewStyles: ` pt-8 flex justify-center border rounded-[42px] border-[6px] border-dark-blue`,
    message:
      'There are 4 levels of boosting available within the app. You can choose one depending on your budget and urgency to find the item.',
    buttonText: 'Close',
    buttonContainerStyles: ` w-[100px] mx-auto rounded-full bg-dark-blue`,
    buttonTextStyles: ` font-bold`,
    messageStyles: ` text-2xl font-bold`,
  });
  const [showInfoPointsModal, setShowInfoPointsModal] = useState({
    visibility: false,
    viewStyles: ` pt-8 flex justify-center border rounded-[42px] border-[6px] border-dark-blue`,
    message:
      'Posts can be boosted using in app points. If you have the points needed, you can boost the post absolutely free.',
    buttonText: 'Close',
    buttonContainerStyles: ` w-[100px] mx-auto rounded-full bg-dark-blue`,
    buttonTextStyles: ` font-bold`,
    messageStyles: ` text-2xl font-bold`,
  });

  useEffect(() => {
    setNeeded(
      level === 1
        ? 10
        : level === 2
        ? 15
        : level === 3
        ? 30
        : level === 4
        ? 50
        : 0
    );
  }, [level]);

  useEffect(() => {
    async function getPoints() {
      try {
        const querySnapshot = await getDocs(
          collectionGroup(FireStore, 'userDetails')
        );

        if (!querySnapshot.empty) {
          result = querySnapshot.docs.map((doc) => doc.data());

          result = result.filter(
            (user) => user.userId === auth.currentUser.uid
          );

          setAvailable(result[0].points);
        } else {
          console.log('No matching documents.');
          setAvailable(0);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getPoints();
  }, []);

  const handleConfirm = () => {
    if (available >= needed) {
      // Do something here
      console.log('boosting');
    } else {
      setIsModalVisible(true);
    }
  };

  return (
    <View className=" w-10/12 mx-auto mt-48 bg-white">
      <DismissibleAlert
        data={showInfoLevelModal}
        setData={setShowInfoLevelModal}
      />
      <DismissibleAlert
        data={showInfoPointsModal}
        setData={setShowInfoPointsModal}
      />
      <View className="border-4 border-light-blue rounded-2xl text-black py-2">
        <View className="flex-row">
          <Text className="text-black text-lg font-bold mb-2 ml-10 mr-3">
            Boost Level
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowInfoLevelModal({
                ...showInfoLevelModal,
                visibility: true,
              });
            }}
          >
            <InformationIcon />
          </TouchableOpacity>
        </View>
        <View
          className="border-4 border-light-blue rounded-xl text-black mb-4 
        w-10/12 mx-auto"
        >
          <Picker
            className="border-4 px-4 py-2 border-light-blue "
            placeholder="Select level"
            selectedValue={level}
            dropdownIconColor={'black'}
            dropdownIconRippleColor={'#0284C7'}
            selectionColor={'#0284C7'}
            onValueChange={(itemValue) => setLevel(itemValue)}
          >
            <Picker.Item value={1} label={'Minor Boost'} />
            <Picker.Item value={2} label={'Moderate Boost'} />
            <Picker.Item value={3} label={'Superior Boost'} />
            <Picker.Item value={4} label={'Ultra Boost'} />
          </Picker>
        </View>
        <Text className="text-black text-lg font-bold mb-2 ml-10 mr-3">
          Points needed
        </Text>
        <TextInput
          value={needed.toString()}
          className="border-4 px-4 py-2 border-light-blue rounded-xl text-black mb-4
          w-10/12 mx-auto font-bold"
          readOnly
        />
        <View className="flex-row">
          <Text className="text-black text-lg font-bold mb-2 ml-10 mr-3">
            Points available
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowInfoPointsModal({
                ...showInfoPointsModal,
                visibility: true,
              });
            }}
          >
            <InformationIcon />
          </TouchableOpacity>
        </View>
        <TextInput
          value={available.toString()}
          className="border-4 px-4 py-2 border-light-blue rounded-xl text-black  mb-4
          w-10/12 mx-auto font-bold"
          readOnly
        />
        <MainButton
          text="Confirm"
          containerStyles="w-6/12 mx-auto mt-2 mb-1 "
          onPress={() => {
            handleConfirm();
          }}
        />
        <TwoButtonModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          showInfoIcon={false}
          heading={"Sorry you don't have enough points. Buy boost level?"}
          //navigate to your page
          onPressConfirm={() =>
            navigation.navigate(BuyBoost, { itemId: route.params.itemId })
          }
        />
      </View>
    </View>
  );
};

export default PostBoostingScreen;
