import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const UserNotFoundRoutes = ({ Stack }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
        component={RegisterScreen}
      />
    </Stack.Navigator>
  );
};

export default UserNotFoundRoutes;
