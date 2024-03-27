import React from 'react';
import { View, Text, Image, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        const data = {
            email,
            password,
        }


        // send the data to the server
        axios.post('https://3268-199-111-212-104.ngrok-free.app/api/login', data).then((response) => {
            uid = response.data;
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
                    <TextInput placeholder='Email' placeholderTextColor='gray' style={styles.input} value={email} onChangeText={setEmail} />
                    <TextInput placeholder='Password' placeholderTextColor='gray' style={styles.input} value={password} onChangeText={setPassword} />
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

       

                    <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.loginButtonText}>Go Home</Text>
                    </TouchableOpacity>



              
                </View>
                <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signUpButtonText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
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
