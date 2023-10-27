import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { PersonalBelongingsTypes } from '../constants/PersonalBelongingsTypes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AddPBModal from './AddPersonalBelongings';
import DismissibleAlert from '../components/common/alerts/DismissibleAlert';
import { auth } from '../firebase';
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FireStore } from '../firebase';
import TwoButtonModal from '../components/common/modals/TwoButtonModal';
import { useIsFocused } from '@react-navigation/native';
import { Profile } from '../constants/RouteConstants';

const PersonalBelongings = ({ navigation, route }) => {
  const [componentKey, setComponentKey] = useState(
    route.params?.key || 'initial-key'
  );
  const [loading, setLoading] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [randomVal, setRandomVal] = useState(Math.random());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const uuid = auth.currentUser.uid;
        const res = await getDoc(doc(FireStore, 'userDetails', uuid));
        setComponentKey(route.params?.key || 'initial-key');
        if (res.exists) {
          setData(res.data().devices);
        } else {
          setError({
            visibility: true,
            title: 'Error',
            message: 'User Information not found',
            buttonText: 'Close',
            titleStyles: 'text-red-500',
            messageStyles: 'text-red-500',
            viewStyles: 'border border-4 border-red-500',
          });
        }
      } catch (error) {
        setError({
          visibility: true,
          title: 'Error',
          message: error.message,
          buttonText: 'Close',
          titleStyles: 'text-red-500',
          messageStyles: 'text-red-500',
          viewStyles: 'border border-4 border-red-500',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    return () => {
      // Clear the orders data when the component is unmounted
      setData(null);
      setLoading(true);
    };
  }, [isFocused, componentKey, route.params?.key, randomVal]);

  const handleDelete = async () => {
    if (toBeDeleted !== null) {
      const item = toBeDeleted;
      try {
        const obj = {
          name: item.name,
          serialNo: item.serialNo,
          type: item.type,
        };
        await updateDoc(doc(FireStore, 'userDetails', auth.currentUser.uid), {
          devices: arrayRemove(obj),
        });
        setError({
          visibility: true,
          title: 'Success',
          message: 'Device Removed Successfully',
          buttonText: 'Close',
          titleStyles: 'text-green-500',
          messageStyles: 'text-green-500',
          viewStyles: 'border border-4 border-green-500',
        });
      } catch (error) {
        setError({
          visibility: true,
          title: 'Error',
          message: error.message,
          buttonText: 'Close',
          titleStyles: 'text-red-500',
          messageStyles: 'text-red-500',
          viewStyles: 'border border-4 border-red-500',
        });
      } finally {
        setDeleteModalVisible(false);
        setToBeDeleted(null);
        setRandomVal(Math.random());
      }
    } else {
      setError({
        visibility: true,
        title: 'Error',
        message: 'Cannot Delete Null Item',
        buttonText: 'Close',
        titleStyles: 'text-red-500',
        messageStyles: 'text-red-500',
        viewStyles: 'border border-4 border-red-500',
      });
    }
  };

  const handleClickDelete = (item) => {
    setDeleteModalVisible(true);
    setToBeDeleted(item);
  };

  return !loading ? (
    <View style={styles.mainContainer}>
      <AddPBModal
        isVisible={modalIsVisible}
        setIsVisible={setModalIsVisible}
        navigation={navigation}
        setRandomVal={setRandomVal}
      />
      <TouchableOpacity
        style={styles.Temp}
        onPress={() => setModalIsVisible(true)}
      >
        <Text style={styles.buttonTextTemp}>Add New Device</Text>
      </TouchableOpacity>
      <TwoButtonModal
        isVisible={deleteModalVisible}
        setIsVisible={setDeleteModalVisible}
        heading="Do you want to delete this device?"
        showInfoIcon={false}
        onPressConfirm={handleDelete}
      />
      <DismissibleAlert data={error} setData={setError} />
      {data ? (
        <View>
          <FlatList
            data={data}
            numColumns={1}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Image
                  source={
                    item.type === PersonalBelongingsTypes.Laptop
                      ? require('../assets/images/PersonalBelongingsTypes/Laptop.png')
                      : item.type === PersonalBelongingsTypes.Phone
                      ? require('../assets/images/PersonalBelongingsTypes/Phone.png')
                      : item.type === PersonalBelongingsTypes.Charger
                      ? require('../assets/images/PersonalBelongingsTypes/Charger.png')
                      : require('../assets/images/PersonalBelongingsTypes/Other.png')
                  }
                  style={{ width: 80, height: 80 }}
                />
                <View>
                  <Text style={styles.text}>Name : {item.name}</Text>
                  <Text style={styles.text}>
                    Serial Number : {item.serialNo}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleClickDelete(item)}>
                  <Image
                    source={require('../assets/images/PersonalBelongingsTypes/TrashBin.png')}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => item.id + index.toString()}
          />
        </View>
      ) : (
        <View style={styles.flexCenteredContainer}>
          <Text className="text-lg font-bold">No Personal Belongings</Text>
        </View>
      )}
    </View>
  ) : (
    <View style={styles.flexCenteredContainer}>
      <ActivityIndicator size="large" color="#0369A1" />
    </View>
  );
};

export default PersonalBelongings;

const styles = StyleSheet.create({
  buttonTextTemp: {
    color: 'white',
    fontWeight: 'bold',
  },

  Temp: {
    backgroundColor: '#0369A1',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    elevation: 5,
    zIndex: 1000000,
  },

  flexCenteredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#0284C7',
    alignItems: 'center',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 12,
    marginTop: 20,
    padding: 10,
    justifyContent: 'space-between',
  },

  mainContainer: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontWeight: 'bold',
    color: '#0369A1',
  },
});
