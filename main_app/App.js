import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import Home from './screens/Home';
import DrawerDetails from './screens/DrawerDetails';
import Layout from './screens/Layout';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Layout>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="DrawerDetails" component={DrawerDetails} />
      </Stack.Navigator>
      </Layout>
    </NavigationContainer>
  );
}

export default App;