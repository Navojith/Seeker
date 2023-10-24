import React, { useState, useEffect } from "react";
import { Text, View, Switch, TouchableOpacity, StyleSheet } from "react-native"; // Import TouchableOpacity
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { auth, FireStore } from "../firebase";
import TwoButtonModal from "../components/common/modals/TwoButtonModal";

const SettingsScreen = () => {
  const [foundItemNotifications, setFoundItemNotifications] = useState(false);
  const [lostItemNotifications, setLostItemNotifications] = useState(false);
  const [clearSearchHistoryModalVisible, setClearSearchHistoryModalVisible] =
    useState(false);

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
      const docRef = doc(FireStore, "notifications", auth.currentUser.uid);
      await setDoc(docRef, newSettings, { merge: true });
      console.log("Notification settings updated");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getNotificationSettings = async () => {
      try {
        const docRef = doc(FireStore, "notifications", auth.currentUser.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            setFoundItemNotifications(data.foundItemNotifications);
            setLostItemNotifications(data.lostItemNotifications);
          }
        }

        console.log("Notification settings retrieved");
      } catch (error) {
        console.log(error);
      }
    };

    getNotificationSettings();
  }, []);

  // Function to close the modal without taking any action
  const handleCancelClearSearchHistory = () => {
    setClearSearchHistoryModalVisible(false);
  };

  const handleClearSearchHistory = async () => {
    try {
      // Clear search history for 'searchLostItems'
      const searchLostItemsRef = collection(FireStore, "searchLostItems");
      const lostItemsQueryRef = query(
        searchLostItemsRef,
        where("userId", "==", auth.currentUser.uid)
      );
      const lostItemsQuerySnapshot = await getDocs(lostItemsQueryRef);
        
      lostItemsQuerySnapshot.forEach(async (docu) => {
        try {
          await deleteDoc(doc(FireStore, "searchLostItems", docu.id));
          console.log(
            `Document in 'searchLostItems' with ID ${docu.id} deleted`
          );
        } catch (error) {
          console.error(
            `Error deleting document in 'searchLostItems' with ID ${docu.id}:`,
            error
          );
        }
      });

      // Clear search history for 'searchFoundItems'
      const searchFoundItemsRef = collection(FireStore, "searchFoundItems");
      const foundItemsQueryRef = query(
        searchFoundItemsRef,
        where("userId", "==", auth.currentUser.uid)
      );
      const foundItemsQuerySnapshot = await getDocs(foundItemsQueryRef);

      foundItemsQuerySnapshot.forEach(async (docu) => {
        try {
          await deleteDoc(doc(FireStore, "searchFoundItems", docu.id));
          console.log(
            `Document in 'searchFoundItems' with ID ${docu.id} deleted`
          );
        } catch (error) {
          console.error(
            `Error deleting document in 'searchFoundItems' with ID ${docu.id}:`,
            error
          );
        }
      });
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
    setClearSearchHistoryModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>
        Note: It will take some time to apply changes
      </Text>
      <View style={styles.notificationRow}>
        <Text>Found Item Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={foundItemNotifications ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleFoundItemNotifications}
          value={foundItemNotifications}
        />
      </View>
      <View style={styles.notificationRow}>
        <Text>Lost Item Notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={lostItemNotifications ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleLostItemNotifications}
          value={lostItemNotifications}
        />
      </View>
      <View>
        <Text style={styles.title}>Search History</Text>
        <TouchableOpacity
          onPress={() => setClearSearchHistoryModalVisible(true)}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Clear search history</Text>
        </TouchableOpacity>
      </View>
      {/* Render the TwoButtonModal for confirmation */}
      <TwoButtonModal
        isVisible={clearSearchHistoryModalVisible}
        setIsVisible={setClearSearchHistoryModalVisible}
        heading="Clear search history?"
        onPressConfirm={handleClearSearchHistory}
        onPressCancel={handleCancelClearSearchHistory}
        confirmText="Yes"
        cancelText="No"
        showInfoIcon={false}
      />
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
    fontWeight: "bold",
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SettingsScreen;
