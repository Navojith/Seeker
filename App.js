import 'react-native-gesture-handler';
import RootNavigation from './navigation';
import registerNNPushToken from 'native-notify';

export default function App() {
  registerNNPushToken(13599, 'gTBeP5h5evCxHcHdDs0yVQ'); //register to notify

  return <RootNavigation />;
}
