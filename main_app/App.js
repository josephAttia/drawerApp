import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import Home from './screens/Home';
import DrawerDetails from './screens/DrawerDetails';
import Layout from './screens/Layout';
import AddDrawer from './screens/AddDrawer';
import * as Font from 'expo-font';
import { loadFonts } from './fonts';
import { useState } from 'react';
import SettingsScreen from './screens/SettingsScreen';
const Stack = createNativeStackNavigator();

function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  React.useEffect(() => {
    const loadAppFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };

    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }


  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DrawerDetails" component={DrawerDetails} />
        <Stack.Screen name="AddDrawer" component={AddDrawer} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;