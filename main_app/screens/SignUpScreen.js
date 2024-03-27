import React from 'react';
import { View, Text, Image, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.contentContainer}>
                <Text style={styles.titleText}>Login</Text>
                <View style={styles.formContainer}>
                    <TextInput placeholder='Name' placeholderTextColor='gray' style={styles.input}/>
                    <TextInput placeholder='Email' placeholderTextColor='gray' style={styles.input} />
                    <TextInput placeholder='Password' placeholderTextColor='gray' style={styles.input} />
                    <TouchableOpacity style={styles.signUpButton}>
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
