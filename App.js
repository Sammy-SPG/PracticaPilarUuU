import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/home';
import Camera from './components/camera';


export default function App() {

const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer initialRouteName="Home">
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Camera" component={Camera} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
