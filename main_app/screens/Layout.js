import * as React from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';

export default function Layout({ children }) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                    <Text style={styles.navItem}>Home Screen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CameraRoll')}>
                    <Text style={styles.navItem}>Camera Roll</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.navItem}>Settings</Text>
                </TouchableOpacity>
            </View>
            {children}
        </View>
    );
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#2C3E50',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    navItem: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});