import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../components/Error';

export default function SignUpScreen({ navigation }) {


  // get the input values
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState(null);

  const SignupAsJoe = () => {
    setEmail('josephattia159@gmail.com');
    setPassword('Joseph');
    setName('Jospeh Attia');
  };

  // handle the form submission
  const handleSignUp = () => {
    const data = {
      email,
      password,
      name
    };

    // send the data to the server
    axios.post('https://0b54-199-111-224-24.ngrok-free.app/api/register_user', data)
      .then((response) => {
        console.log('Response:', response.data); 
        // if there is a uid in AsyncStorage, remove it
        AsyncStorage.removeItem('uid');
        AsyncStorage.setItem('uid', response.data.uid);
        navigation.navigate('Login', { signuped: true});
      })
      .catch((error) => {
        console.log('Error message:', error.response.data);
        setError(error.response.data.error);
        setTimeout(() => {
          setError(null);
        }, 10000); 
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Signup</Text>
        {error && <Error errorMessage={error} duration={10000} />}
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="gray"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
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
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.thingy}>Already have an account? Login now</Text>
          </TouchableOpacity>

          {/* add a signup with joe */}
          {/* <TouchableOpacity onPress={SignupAsJoe}>
            <Text style={styles.thingy}>Sign up with Joe</Text>
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
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
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
  signUpButton: {
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  thingy: {
    color: '#87CEEB',
    fontSize: 16,
  },
});
