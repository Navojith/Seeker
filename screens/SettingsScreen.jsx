import React, { useState, useEffect } from 'react';
import { Text, View, Switch, StyleSheet } from 'react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, FireStore } from '../firebase';

const SettingsScreen = () => {
  const [foundItemNotifications, setFoundItemNotifications] = useState(false);
  const [lostItemNotifications, setLostItemNotifications] = useState(false);

  const toggleFoundItemNotifications = async () => {
    setFoundItemNotifications((previousState) => !previousState);
    await updateNotificationSettings({
      foundItemNotifications: !foundItemNotifications,
      lostItemNotifications,
    });
  };

  const toggleLostItemNotifications = async () => {
    setLostItemNotifications((previousState) => !previousState);
    await updateNotificationSettings({
      foundItemNotifications,
      lostItemNotifications: !lostItemNotifications,
    });
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      const docRef = doc(FireStore, 'notifications', auth.currentUser.uid);
      await setDoc(docRef, newSettings, { merge: true });
      console.log('Notification settings updated');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getNotificationSettings = async () => {
      try {
        const docRef = doc(FireStore, 'notifications', auth.currentUser.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            setFoundItemNotifications(data.foundItemNotifications);
            setLostItemNotifications(data.lostItemNotifications);
          }
        }

        console.log('Notification settings retrieved');
      } catch (error) {
        console.log(error);
      }
    };

    getNotificationSettings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Note: It will take some time to apply changes</Text>
      <View style={styles.notificationRow}>
        <Text>Found Item Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={foundItemNotifications ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleFoundItemNotifications}
          value={foundItemNotifications}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text>Lost Item Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={lostItemNotifications ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleLostItemNotifications}
          value={lostItemNotifications}
        />
      </View>
      <View>
      <Text style={styles.title}>Search History</Text>
      <Text>Clear search history</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
});

export default SettingsScreen;
