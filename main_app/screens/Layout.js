import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout({ children}) {
    const navigation = useNavigation();

    const [uid, setUid] = React.useState('');

    React.useEffect(() => {
        const fetchUid = async () => {
            const uid = await AsyncStorage.getItem('uid');
            setUid(uid);
        };
        fetchUid();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => navigation.navigate('CameraRoll')} style={styles.navItem}>
                    <Feather name="home" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("AddDrawer", { uid: uid })} style={styles.middleButton}>
                    <Feather name="box" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={styles.navItem}>
                    <Feather name="settings" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
      
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 70,
        backgroundColor: '#2C3E50',
    },
    navItem: {
        alignItems: 'center',
    },
    middleButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#87CEEB',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
