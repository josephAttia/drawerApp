import React from 'react';
import { View, Text, Image, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export default function SignUpScreen({navigation}) {

    async function save(key, value) {
        await SecureStore.setItemAsync(key, value);
    }

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        return result;
    }
    

     // get the input values
     const [email, setEmail] = React.useState('');
     const [password, setPassword] = React.useState('');
     const [name, setName] = React.useState('');
 
     // handle the form submission
     const handleSignUp = () => {
         const data = {
             email,
             password,
             name
         }
 
 
         // send the data to the server
         axios.post('https://3268-199-111-212-104.ngrok-free.app/api/register_user', data).then((response) => {
             uid = response.data;         
             console.log(uid);
             console.log(typeof uid);
             save('uid', uid);
             navigation.navigate('Home');
 
         }).catch((error) => {
             console.log('Error message:', error.message);
         });
     }
 

     
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.contentContainer}>
                <Text style={styles.titleText}>Login</Text>
                <View style={styles.formContainer}>
                    <TextInput placeholder='Name' placeholderTextColor='gray' style={styles.input} value={name} onChangeText={setName}/>
                    <TextInput placeholder='Email' placeholderTextColor='gray' style={styles.input} value={email} onChangeText={setEmail} />
                    <TextInput placeholder='Password' placeholderTextColor='gray' style={styles.input} value={password} onChangeText={setPassword} />
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
