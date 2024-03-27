import { View, Text, Image, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';



async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    return result;
}



export default function Home({ navigation }) {

    const [uid, setUid] = React.useState('');
    const [profile, setProfile] = React.useState({});

    async function getProfile(uid) {
        console.log(uid);
        axios.get(' https://3268-199-111-212-104.ngrok-free.app/api/get_profile', {
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
        getValueFor('uid').
            then((uid) => {
                setUid(uid);
                getProfile(uid);
            });
      
        
    }, []);

    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Text>{uid}</Text>
            <Text>Yo goofy name is {profile._data.displayName}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
