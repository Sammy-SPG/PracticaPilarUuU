import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/home';
import Camera from './components/camera';
import barra from './components/barra';


export default function App() {

const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer initialRouteName="home">
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="barra" component={barra} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
