import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Error from '../components/Error';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {

  

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  const handleLogin = () => {
    const data = {
      email,
      password,
    };

    // send the data to the server
    axios.post('https://drawerapp.pythonanywhere.com/api/login', data)
      .then(async (response) => {
        const uid = response.data.uid;
        await AsyncStorage.setItem('uid', uid);

        navigation.navigate('Home');
      })
      .catch((error) => {
        console.log('Error message:', error.response.data);
        setError(error.response.data.error);
        setTimeout(() => {
          setError(null);
        }, 5000); // Error message disappears after 10 seconds
      });
  };

  const loginAsJoe = () => {
    setEmail('bobby@gmail.com');
    setPassword('Bobby');
  }

  React.useEffect(() => {
    const fetchUid = async () => {
      const uid = await AsyncStorage.getItem('uid');
      if (uid) {
        navigation.navigate('Home');
      }
    };

    fetchUid();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Login</Text>
        {error && <Error errorMessage={error} duration={10000} />}
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpButtonText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.signUpButton} onPress={() => loginAsJoe()}>
            <Text style={styles.signUpButtonText}>Login as Borbby</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleText: {
    color: '#D3D3D3',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#141E36',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'white',
  },
  loginButton: {
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUpButton: {
    marginTop: 20,
  },
  signUpButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
});
