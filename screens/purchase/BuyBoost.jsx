import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import InformationIcon from '../../assets/icons/InformationIcon';
import MainButton from '../../components/common/buttons/MainButton';
import { LinearGradient } from 'expo-linear-gradient';
import UltraIcon from '../../assets/images/Tiers/Ultra.jsx';
import UltraText from '../../assets/images/Tiers/UltraText.jsx';
import SuperiorIcon from '../../assets/images/Tiers/Superior.jsx';
import SuperiorText from '../../assets/images/Tiers/SuperiorText.jsx';
import ModerateIcon from '../../assets/images/Tiers/Moderate.jsx';
import ModerateText from '../../assets/images/Tiers/ModerateText.jsx';
import MinorIcon from '../../assets/images/Tiers/Minor.jsx';
import MinorText from '../../assets/images/Tiers/MinorText.jsx';
import { TouchableOpacity } from 'react-native';
import DismissibleAlert from '../../components/common/alerts/DismissibleAlert';
import { updateDoc, doc, collection, addDoc } from 'firebase/firestore';
import { FireStore, auth } from '../../firebase';
import TwoButtonModal from '../../components/common/modals/TwoButtonModal';

const BuyBoost = ({ route, navigation }) => {
  const [itemId, setItemId] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });
  const [selected, setSelected] = useState('');
  const [infoButton, setInfoButton] = useState({
    visibility: false,
    message:
      'Ultra boost : Maximum level of post visibility, Awards 40 points to the finders \n\nSuperior boost : High level of post visibility, Awards 30 points to the finders\n\nModerate boost: Moderate level of post visibility, Awards  20 points to the finders \n\nMinor boost: Some level of post visibility, Awards 10 points to the finders',
    buttonText: 'Close',
    messageStyles: 'font-bold text-left',
    buttonContainerStyles: 'w-[150px] rounded rounded-full mx-auto',
    viewStyles:
      'py-8 px-6 border border-[6px] rounded rounded-[42px] border-dark-blue',
  });
  const [loading, setLoading] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const tiers = [
    {
      name: 'Ultra',
      icon: <UltraIcon />,
      text: <UltraText style={{ marginTop: 10 }} />,
      colors: ['#8146FF', '#7928B9', '#902AE0'],
      price: 500.0,
    },
    {
      name: 'Superior',
      icon: <SuperiorIcon />,
      text: <SuperiorText style={{ marginTop: 0, marginBottom: 8 }} />,
      colors: ['#0066FE', '#6AA4FB'],
      price: 300.0,
    },
    {
      name: 'Moderate',
      icon: <ModerateIcon />,
      text: <ModerateText style={{ marginTop: 10, marginBottom: 8 }} />,
      colors: ['#780202', '#7479F3'],
      price: 150.0,
    },
    {
      name: 'Minor',
      icon: <MinorIcon />,
      text: <MinorText style={{ marginTop: 5, marginBottom: 12 }} />,
      colors: ['#CECCCC', '#161616'],
      price: 100.0,
    },
  ];

  const handleTierSelect = (item) => {
    setSelected(item);
  };

  useEffect(() => {
    if (route.params?.itemId) {
      setItemId(route.params.itemId);
    }
  }, [route]);

  const handlePurchase = async () => {
    console.log(itemId);
    if (cardNo !== '' && expiryDate !== '' && cvv !== '' && selected !== '') {
      try {
        setLoading(true);
        const docRef = doc(collection(FireStore, 'lostItems'), itemId);

        await updateDoc(docRef, {
          tier: selected.name.toLowerCase(),
        });

        //set Payment
        try {
          const res = addDoc(collection(FireStore, 'payments'), {
            userId: auth.currentUser.uid,
            itemId: itemId,
            tier: selected.name.toLowerCase(),
            total: selected.price,
            timestamp: new Date(),
          });

          setCardNo('');
          setExpiryDate('');
          setCvv('');
          setError({
            visibility: true,
            viewStyles: 'border border-4 border-green-600',
            titleStyles: 'text-green-600',
            messageStyles: 'text-green-600 font-bold',
            title: 'Success !',
            message: 'Booster Purchased successfully !',
          });
          navigation.navigate('Lost');
        } catch (error) {
          setError((prev) => ({
            viewStyles: 'border border-4 border-red-600',
            titleStyles: 'text-red-600',
            messageStyles: 'text-red-600 font-bold',
            visibility: true,
            title: 'Error !',
            message: error.message + ' - ' + error.code,
          }));
        }

        setLoading(false);
      } catch (error) {
        if (error.code === 'not-found') {
          setError((prev) => ({
            viewStyles: 'border border-4 border-red-600',
            titleStyles: 'text-red-600',
            messageStyles: 'text-red-600 font-bold',
            visibility: true,
            title: 'Error !',
            message:
              "Post not found !\nThe post that you're trying to upgrade is not found.",
          }));
        } else {
          setError((prev) => ({
            viewStyles: 'border border-4 border-red-600',
            titleStyles: 'text-red-600',
            messageStyles: 'text-red-600 font-bold',
            visibility: true,
            title: 'Error !',
            message: error.message + ' - ' + error.code,
          }));
        }
      }
    } else {
      setError((prev) => ({
        viewStyles: 'border border-4 border-red-600',
        titleStyles: 'text-red-600',
        messageStyles: 'text-red-600 font-bold',
        visibility: true,
        title: 'Please Enter Valid Details !',
        message: 'Please fill in all the fields',
      }));
    }
  };

  const handleCancel = () => {
    setIsConfirmVisible(false);
    setLoading(false);
  };

  const handleClickPurchase = () => {
    if (cardNo !== '' && expiryDate !== '' && cvv !== '' && selected !== '') {
      setIsConfirmVisible(true);
    } else {
      setError((prev) => ({
        viewStyles: 'border border-4 border-red-600',
        titleStyles: 'text-red-600',
        messageStyles: 'text-red-600 font-bold',
        visibility: true,
        title: 'Please Enter Valid Details !',
        message: 'Please fill in all the fields',
      }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DismissibleAlert data={error} setData={setError} />
      <ScrollView
        style={{
          paddingTop: 30,
          paddingHorizontal: 30,

          display: 'flex',
          flex: 1,
          marginTop: 200,
        }}
      >
        <View>
          <Text style={styles.textLabel}>Credit / Debit Card Number</Text>
          <TextInput
            value={cardNo}
            onChangeText={(value) => setCardNo(value)}
            placeholder="Eg: XXXX-XXXXX-XXXX-XXXX"
            style={styles.input}
          />
          <Text style={styles.textLabel}>Expiry Date</Text>
          <TextInput
            value={expiryDate}
            onChangeText={(value) => setExpiryDate(value)}
            placeholder="Eg: mm/yyyy"
            style={styles.input}
          />
          <Text style={styles.textLabel}>CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={(value) => setCvv(value)}
            placeholder=""
            style={styles.input}
          />
        </View>
        <DismissibleAlert data={infoButton} setData={setInfoButton} />
        <View className="flex flex-row flex-wrap mt-8">
          <Text style={styles.textLabel}>Select a Tier</Text>
          <InformationIcon
            className="ml-auto"
            onPress={() =>
              setInfoButton((prev) => ({ ...prev, visibility: true }))
            }
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          {tiers.map((tier) => (
            <TouchableOpacity
              key={tier.name}
              onPress={() => handleTierSelect(tier)}
            >
              <LinearGradient
                colors={tier.colors}
                style={
                  selected.name === tier.name
                    ? { marginTop: 15, padding: 5, borderRadius: 10 }
                    : { marginTop: 15, padding: 5, borderRadius: 10 }
                }
              >
                <View
                  style={
                    selected.name === tier.name
                      ? {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 150,
                          height: 130,
                          backgroundColor: 'white',
                          borderRadius: 8,
                          borderStyle: 'dotted',
                          borderWidth: 10,
                          borderColor: 'white',
                        }
                      : {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 150,
                          height: 130,
                          backgroundColor: 'white',
                          borderRadius: 10,
                        }
                  }
                >
                  {tier.icon}
                  {tier.text}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Total fee:{' '}
          {selected.price ? parseFloat(selected.price).toFixed(2) : '0.00'} lkr
        </Text>
        {loading && (
          <Text className="text-light-blue text-lg font-bold mt-2">
            Sending... Please wait....
          </Text>
        )}
        <MainButton
          text="Confirm Payment"
          containerStyles={'mb-20 py-4 w-full rounded rounded-full'}
          textStyles={'text-2xl'}
          onPress={handleClickPurchase}
        />
        <TwoButtonModal
          isVisible={isConfirmVisible}
          setIsVisible={setIsConfirmVisible}
          heading="Confirm Purchase"
          onPressConfirm={handlePurchase}
          onPressCancel={handleCancel}
          showInfoIcon={false}
          loading={loading}
          loadingText={'Sending... Please wait....'}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  textLabel: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 4,
    borderColor: '#0284C7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    color: 'black',
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  gradientTextContainer: {
    borderRadius: 5, // Adjust this value as needed
  },
  gradientText: {
    fontSize: 24, // Adjust this value as needed
    color: 'white', // Text color
  },
});

export default BuyBoost;
