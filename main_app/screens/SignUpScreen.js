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

  // handle the form submission
  const handleSignUp = () => {
    const data = {
      email,
      password,
      name
    };

    // send the data to the server
    axios.post('https://drawerapp.pythonanywhere.com/api/register_user', data)
      .then((response) => {
        // check if uid is in async storage and delete it before adding the new one
        AsyncStorage.getItem('uid').then((uid) => {
          if (uid) {
            AsyncStorage.removeItem('uid');
          }
        });
  
        AsyncStorage.setItem('uid', response.data.uid);
        navigation.navigate('Home');
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
          />
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
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
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
