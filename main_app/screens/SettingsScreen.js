import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icon set
import Layout from './Layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';



const SetupInstructions = () => {
    const setupSteps = [
        "Step 1: Click the 'Add Drawer' button indicated by the middle button on the nav bar on the home screen. Be sure to put the MAC Addres found on the sticker of your device!",
        "Step 2: Once your device has been connected, there will be an update on your Drawers page on the home screen, and you should be able to see the drawer, along with all of the other information you inputted.",
        "Step 3: To test your device, open your drawer and see if the app has updated. If so, you are all set!"
    ];

    return (
        <ScrollView horizontal style={styles.setupContainer}>
            {setupSteps.map((step, index) => (
                <View key={index} style={styles.setupStep}>
                    <Text style={styles.setupText}>{step}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default function SettingsScreen() {
    const navigation = useNavigation();

    const [notificationEnabled, setNotificationEnabled] = useState(true);

    const toggleNotification = () => {
        setNotificationEnabled((prev) => !prev);
    };

    const logout_user = async () => {
        await AsyncStorage.removeItem('uid');
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            {/* Notification Settings Section */}
            <View style={styles.settingOption}>
                <Feather name="bell" size={24} color="black" style={styles.icon} />
                <Text style={styles.settingText}>Notifications</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#767577" }}
                    thumbColor={notificationEnabled ? "#77DD77" : "#FF6961"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleNotification}
                    value={notificationEnabled}
                />
            </View>
            {/* Setup Instructions Section */}
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsHeader}>Setup Instructions</Text>
                <SetupInstructions />
            </View>
            <Text style={styles.spacer}> </Text>
            <TouchableOpacity style={styles.logoutButton} onPress={() => logout_user()}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={() => logout_user()}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
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
        backgroundColor: '#B6BCAE',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
    },
    instructionsContainer: {
        marginTop: 30,
    },
    instructionsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    setupContainer: {
        flexDirection: 'row',
    },
    setupStep: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 15,
        marginRight: 10,
        width: 200,
    },
    setupText: {
        fontSize: 16,
    },
    spacer: {
        paddingTop: 20,
    }
});
