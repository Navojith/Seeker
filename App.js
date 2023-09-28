import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreenWithoutAuth from './screens/HomeScreen';
import ProfileScreenWithoutAuth from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AuthCheck from './util/manageUser/AuthCheck';

const Stack = createNativeStackNavigator();
const ProfileScreen = AuthCheck(ProfileScreenWithoutAuth);
const HomeScreen = AuthCheck(HomeScreenWithoutAuth);

export default function App() {
  return (
    <NavigationContainer>
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
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
