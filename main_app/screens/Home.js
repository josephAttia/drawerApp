import { View, Text, Image, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {

    const [uid, setUid] = React.useState('');
    const [profile, setProfile] = React.useState({});

    async function getProfile(uid) {
        console.log(uid);
        axios.get('https://26de-199-111-212-3.ngrok-free.app/api/get_profile', {
            params: {
                uid: uid
            }
        }).then((response) => {
            console.log(response.data);
            setProfile(response.data);
            
        }).catch((error) => {
            console.log('Error message:', error.message);
        });
    }

    React.useEffect(() => {
        const getUid = async () => {
            const uid = await AsyncStorage.getItem('uid');
            if (!uid) {
                navigation.navigate('Login');
            }
            setUid(uid);
            getProfile(uid);
        }
        getUid();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Text>{uid}</Text>
            <Text>{profile.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
