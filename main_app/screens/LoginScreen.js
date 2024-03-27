import { View, Text, Image, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Image style={styles.backgroundImage} source={require('../assets/background.png')} />

            {/*lights */}
            <View style={styles.lightsContainer}>
                <Image style={[styles.lightImage, styles.leftLight]} source={require('../assets/light.png')} />
                <Image style={[styles.lightImage, styles.rightLight]} source={require('../assets/light.png')} />
            </View>

            {/*title and form*/}
            <View style={styles.contentContainer}>
                {/*title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        Login
                    </Text>
                </View>

                {/* form */}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Email' placeholderTextColor={'gray'} style={styles.input} />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder='Password' placeholderTextColor={'gray'} style={styles.input} />
                    </View>
                    <TouchableOpacity style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        height: '110%', // Increase height to take up more space
        width: '100%',
        top: 0, // Move the background image to the top
    },
    lightsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Change to space-between to make them asymmetric
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 20, // Add horizontal padding to evenly space the lights from the sides
    },
    lightImage: {
        height: 225,
        width: 90,
    },

    contentContainer: {
        flex: 1,
        justifyContent: 'space-around',
        paddingTop: 40,
        paddingBottom: 10,
    },
    titleContainer: {
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: 80,
    },
    formContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 40,
    },
    inputContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        height: 40,
        marginBottom: 20,
    },
    input: {
        color: 'black',
    },
    loginButton: {
        backgroundColor: '#87CEEB',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 10,
        marginTop: 20,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    signUpText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
    },
});
