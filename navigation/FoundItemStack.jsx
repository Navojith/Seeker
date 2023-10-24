import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateFoundItemScreen from "../screens/CreateFoundItemScreen";
import FoundScreen from "../screens/FoundScreen";

import { FoundItem } from "../constants/RouteConstants";
import FoundItemScreen from "../screens/FoundItem";
const Stack = createStackNavigator();

const FoundItemStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        cardStyle: { backgroundColor: "#F0F9FF" },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Found"
        component={FoundScreen}
        options={{
          headerStyle: {
            backgroundColor: "#0369A1",
          },
          headerTintColor: "#fff", // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 28,
          },
          headerTitle: "Found Items",
        }}
      />
      <Stack.Screen
        name="Add Found Item"
        component={CreateFoundItemScreen}
        options={{
          headerStyle: {
            backgroundColor: "#0369A1",
          },
          headerTintColor: "#fff", // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 28,
          },
        }}
      />
      <Stack.Screen
        name={FoundItem}
        component={FoundItemScreen}
        options={{
          headerStyle: {
            backgroundColor: "#0369A1",
          },
          headerTintColor: "#fff", // Change this color for the text/icon color
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 28,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default FoundItemStack;
