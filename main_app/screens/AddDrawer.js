import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const AddDrawer = ({ route }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [isValidMacAddress, setIsValidMacAddress] = useState(true);

    const navigation = useNavigation();
    const { uid } = route.params;

    const handleTitleChange = (text) => {
        setTitle(text);
    };

    const handleDescriptionChange = (text) => {
        setDescription(text);
    };

    const handleLocationChange = (text) => {
        setLocation(text);
    };

    const handleMacAddressChange = (text) => {
        const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        setMacAddress(text);
        setIsValidMacAddress(macAddressRegex.test(text));
    };

    const handleSubmit = () => {
        // send the data to the server and navigate to the Home screen
        const data = {
            uid: uid,
            title: title,
            description: description,
            location: location,
            mac_address: macAddress,
        };

        axios.post('https://0b54-199-111-224-24.ngrok-free.app/api/add_drawer', data)
            .then((response) => {
                console.log('Response:', response.data);
                navigation.navigate('Home');
            })
            .catch((error) => {
                console.log('Error message:', error.response?.data || error.message);
                navigation.navigate('Home');
            })
            .finally(() => {
            
                console.log('Request completed');
            });
    };
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust this as needed
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.title}>Add Drawer</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Title:</Text>
                        <TextInput
                            style={[styles.input, styles.inputText]}
                            value={title}
                            onChangeText={handleTitleChange}
                            placeholder="Enter title"
                            placeholderTextColor="#FFFFFF"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description:</Text>
                        <TextInput
                            style={[styles.input, styles.inputText]}
                            value={description}
                            onChangeText={handleDescriptionChange}
                            placeholder="Enter description"
                            placeholderTextColor="#FFFFFF"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location:</Text>
                        <TextInput
                            style={[styles.input, styles.inputText]}
                            value={location}
                            onChangeText={handleLocationChange}
                            placeholder="Enter location"
                            placeholderTextColor="#FFFFFF"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>MAC Address:</Text>
                        <TextInput
                            style={[styles.input, styles.inputText, !isValidMacAddress && styles.inputError]}
                            value={macAddress}
                            onChangeText={handleMacAddressChange}
                            placeholder="Enter MAC address"
                            placeholderTextColor="#FFFFFF"
                        />
                        {!isValidMacAddress && <Text style={styles.errorText}>Invalid MAC Address</Text>}
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Add Drawer</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: '#141E36',
        },
        scrollView: {
            flexGrow: 1,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#FFFFFF',
            textAlign: 'center',
            marginTop: 50,
        },
        inputContainer: {
            marginBottom: 20,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
            color: '#FFFFFF',
        },
        input: {
            borderBottomWidth: 1,
            borderBottomColor: '#FFFFFF',
            padding: 10,
            color: '#FFFFFF',
        },
        inputText: {
            backgroundColor: '#141E36',
        },
        inputError: {
            borderBottomColor: 'red',
        },
        errorText: {
            color: 'red',
            fontSize: 12,
            marginTop: 5,
        },
        button: {
            backgroundColor: '#06E4A0',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    export default AddDrawer;
