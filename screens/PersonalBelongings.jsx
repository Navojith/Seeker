import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { PersonalBelongingsTypes } from '../constants/PersonalBelongingsTypes';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainButton from '../components/common/buttons/MainButton';

const PersonalBelongings = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState({
    visibility: false,
    viewStyles: 'border border-4 border-red-600',
    title: null,
    titleStyles: 'text-red-600',
    message: null,
    messageStyles: 'text-red-600 font-bold',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const uuid = auth.currentUser.uid;
        const res = await getDoc(doc(FireStore, 'userDetails', uuid));
        if (res.exists) {
          setUser(res.data());
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
          message: 'Data fetching failed',
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
  }, []);

  return (
    <>
      <View style={styles.mainContainer}>
        {data.length ? (
          <>
            <Text className="font-bold">Personal Belongings</Text>
            <FlatList
              data={data}
              numColumns={1}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.mainStack}>
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
                    />
                    <View>
                      <Text>Name : {item.name}</Text>
                      <Text>Serial Number : {item.serialNo}</Text>
                    </View>
                    <TouchableOpacity>
                      <Text>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <MainButton text={'Add New Device'} />
                </View>
              )}
              keyExtractor={({ index }) => index.toString()}
            />
          </>
        ) : (
          <View style={styles.flexCenteredContainer}>
            <Text className="text-lg font-bold">No Personal Belongings</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.Temp}>
        <Text style={styles.buttonTextTemp}>Temp</Text>
      </TouchableOpacity>
    </>
  );
};

export default PersonalBelongings;

const styles = StyleSheet.create({
  buttonTextTemp: {
    color: 'white',
    fontWeight: 'bold',
  },

  Temp: {
    position: 'absolute',
    top: 505,
    left: 25,
    backgroundColor: '#0369A1',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    zIndex: 1000000,
  },
  fab: {
    position: 'absolute',
    bottom: 250,
    right: 20,
    backgroundColor: '#0284C7',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'col',
  },
  mainStack: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
});
