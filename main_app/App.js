import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SignUpPage from './components/pages/sign_up'; // Make sure to provide the correct path

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <SignUpPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
