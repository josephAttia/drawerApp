import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../components/Error';

export default function Home({ navigation }) {
    const [uid, setUid] = React.useState('');
    const [profile, setProfile] = React.useState({});
    const [drawers, setDrawers] = React.useState([]);
    const [drawerGetStatus, setDrawerGetStatus] = React.useState('');
    const [error, setError] = React.useState(null);

    async function getProfile(uid) {
        axios.get('https://drawerapp.pythonanywhere.com/api/get_profile', {
            params: { uid: uid }
        })
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.log('Error message:', error.message);
            });
    }

    async function getDrawers(uid) {
        setDrawerGetStatus('Getting drawers...');
        axios.get('https://drawerapp.pythonanywhere.com/api/get_drawers', {
            params: { uid: uid }
        })
            .then((response) => {
                setDrawerGetStatus('Drawers retrieved');
                setDrawers(response.data);
            })
            .catch((error) => {
                setDrawerGetStatus('Error getting drawers');
                setError(error.message);
            });
    }

    async function addDummyDrawerData(uid) {
        axios.post('https://drawerapp.pythonanywhere.com/api/add_drawer', {
            params: { uid: uid }
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log('Error message:', error.message);
            });
    }

    React.useEffect(() => {
        const getUid = async () => {
            const storedUid = await AsyncStorage.getItem('uid');
            if (!storedUid) {
                navigation.navigate('Login');
            }
            setUid(storedUid);
            getProfile(storedUid);
        }
        getUid();
    }, []);

    const renderDrawerInfo = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('DrawerDetails', { uid: uid, drawerID: item.id })}
        >
            <View style={styles.drawerItem}>
                <Text>Drawer ID: {item.id}</Text>
                <Text>Armed Status: {item.armed_status}</Text>
                <Text>Battery Level: {item.battery_level}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Time Opened: {item.time_opened}</Text>
                <Text>Unauthorized Access: {item.unauthorized_access}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Error errorMessage={error} duration={100000} />
            <Text>Drawer API Status: {drawerGetStatus}</Text>
            <Text>Home</Text>
            <Text>{uid}</Text>
            <Text>{profile.name}</Text>
            <TouchableOpacity onPress={() => getDrawers(uid)}>
                <Text>Get Drawers</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => addDummyDrawerData(uid)}>
                <Text>Add Dummy Drawer Data</Text>
            </TouchableOpacity>

            {drawers.length === 0 && <Text>No drawers</Text>}

            <Text style={styles.drawerHeader}>Drawers</Text>
            <FlatList
                data={Object.keys(drawers)
                    .filter((key) => key !== 'drawer1')
                    .map((key) => ({ id: key, ...drawers[key] }))}
                renderItem={renderDrawerInfo}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 20,
    },
    drawerHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        marginBottom: 5,
    },
    drawerItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
