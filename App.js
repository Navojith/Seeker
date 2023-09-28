import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase';
import UserFoundRoutes from './routes/UserFoundRoutes';
import UserNotFoundRoutes from './routes/UserNotFoundRoutes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {auth.currentUser ? (
        <UserFoundRoutes Stack={Stack} />
      ) : (
        <UserNotFoundRoutes Stack={Stack} />
      )}
    </NavigationContainer>
  );
}
