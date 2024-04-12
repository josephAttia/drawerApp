import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icon set
import Layout from './Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function SettingsScreen() {
    const navigation = useNavigation();

    const logout_user = async () => {
        await AsyncStorage.removeItem('uid');
        navigation.navigate('Login');
    };
    
    return (
        <Layout>
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <View style={styles.settingOption}>
                <Feather name="wifi" size={24} color="black" />
                <Text style={styles.settingText}>Wi-Fi</Text>
            </View>
            <View style={styles.settingOption}>
                <Feather name="bluetooth" size={24} color="black" />
                <Text style={styles.settingText}>Bluetooth</Text>
            </View>
            <View style={styles.settingOption}>
                <Feather name="settings" size={24} color="black" />
                <Text style={styles.settingText}>General</Text>
            </View>
            <View style={styles.settingOption}>
                <Feather name="bell" size={24} color="black" />
                <Text style={styles.settingText}>Notifications</Text>
            </View>
            <View style={styles.settingOption}>
                <Feather name="info" size={24} color="black" />
                <Text style={styles.settingText}>About</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={() => logout_user()}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingText: {
        marginLeft: 10,
        fontSize: 18,
    },
    logoutButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
    },
});
