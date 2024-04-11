import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Image} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../components/Error';
import { Feather } from '@expo/vector-icons';
import Layout from './Layout';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
    const [uid, setUid] = useState('');
    const [profile, setProfile] = useState({});
    const [drawers, setDrawers] = useState([]);
    const [drawerGetStatus, setDrawerGetStatus] = useState('');
    const [error, setError] = useState(null);

    async function getProfile(uid) {
        try {
            const response = await axios.get('https://drawerapp.pythonanywhere.com/api/get_profile', {
                params: { uid: uid }
            });
            setProfile(response.data);
        } catch (error) {
            console.log('Error message:', error.message);
        }
    }

    async function getDrawers(uid) {
        setDrawerGetStatus('Getting drawers...');
        try {
            const response = await axios.get('https://drawerapp.pythonanywhere.com/api/get_drawers', {
                params: { uid: uid }
            });
            setDrawerGetStatus('Drawers retrieved');
            setDrawers(response.data);
        } catch (error) {
            setDrawerGetStatus('Error getting drawers');
            setError(error.message);
        }
    }

    async function addNewDrawer(uid) {//added
        try {
            const drawer_name = prompt('Enter drawer name:');
            const drawer_type = prompt("Enter the drawer type. Indicate if you are using the device for a small/big drawer or a closet.")
            const response = await axios.post('https://drawerapp.pythonanywhere.com/api/add_drawer', {
                uid: uid,
                drawer_name: drawer_name,
                drawer_type: drawer_type,
            });
            setDrawers([...drawers, response.data]);
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        const getUid = async () => {
            const storedUid = await AsyncStorage.getItem('uid');
            if (!storedUid) {
                navigation.navigate('Login');
            }
            setUid(storedUid);
            getProfile(storedUid);
        };
        getUid();
    }, []);

    const getBatteryColor = (batteryLevel) => { //added this
        if (batteryLevel <= 20) {
            return 'red';
        } else if (batteryLevel <= 50) {
            return 'yellow';
        } else {
            return 'green';
        }
    };    


    const [currentIndex, setCurrentIndex] = useState(0); //added this

    const navigateToNextDrawer = () => { //added
        if (currentIndex < Object.keys(drawers).length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const navigateToPreviousDrawer = () => { //added
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const renderDrawerInfo = ({ item }) => ( //fixed
        <TouchableOpacity onPress={() => navigation.navigate('DrawerDetails', { uid: uid, drawerID: item.id })}>
            <View style={styles.drawerItem}>
                <View style={styles.statusContainer}>
                    <Feather name="box" size={20} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={styles.text2}>Drawer Name: {item.drawer_name}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Feather name="battery" size={20} color={getBatteryColor(item.battery_level)} style={{ marginRight: 5 }} />
                    <Text style={[styles.text2, { color: getBatteryColor(item.battery_level) }]}>Battery Level: {item.battery_level}</Text>
                </View>
                {/* replace w/ picture data <View style={styles.statusContainer}>
                    <Feather name="info" size={20} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={styles.text2}>Status: {item.status}</Text>
                </View> */}
                <View style={styles.statusContainer}>
                    <Feather name="clock" size={20} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={styles.text2}>Time Opened: {item.time_opened}</Text>
                </View>
                <View style={styles.statusContainer}>
                    <Feather name="alert-triangle" size={20} color={item.unauthorized_access === 1 ? 'red' : 'green'} style={{ marginRight: 5 }} />
                    <Text style={[styles.text2, { color: item.unauthorized_access === 1 ? 'red' : 'green' }]}>
                        {item.unauthorized_access === 1 ? 'Unauthorized Access' : 'Safe'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
    
    return (
            <ScrollView>
                    <View style={styles.container}>
                        <Error errorMessage={error} duration={100000} />
                        <Text style={styles.textHeader}>Welcome, </Text>
                        <Text style={styles.text}>{profile.name}!</Text>
                        <Text style={styles.textHeader3}>Latest Drawer Activity:</Text>
                        <View>
                            <Image source={require('./placeholder_image.jpg')} style={styles.drawerImage} />
                            <Text style={styles.text2}>Drawer Name: {drawers[currentIndex]?.drawer_name}</Text>
                            <Text style={styles.text2}>Last Time of Access: </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('CameraRoll')} style={styles.button}> 
                                <Text style={styles.buttonText}>View More </Text> 
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => getDrawers(uid)} style={styles.button}>
                            <Text style={styles.buttonText}>Get Drawers</Text>
                        </TouchableOpacity>

                        <Text style={styles.text}>Drawer Retrieval Status:</Text>
                        <Text style={styles.text}>{drawerGetStatus}</Text>

                        <TouchableOpacity onPress={() => addNewDrawer(uid)} style={styles.button}>
                            <Text style={styles.buttonText}>Add a New Drawer</Text>
                        </TouchableOpacity>

                        <Text style={styles.drawerHeader}>Drawers</Text>
                        <FlatList
                            data={Object.keys(drawers)
                                .filter((key) => key !== 'drawer1')
                                .map((key) => ({ id: key, ...drawers[key] }))}
                            renderItem={renderDrawerInfo}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />

                        <Text style={styles.textHeader3}>How to Get Set-Up:</Text>
                    </View>
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    textHeader: {
        color: '#FFFFFF',
        marginTop: 130,
        fontSize: 40,
    },
    textHeader2: {
        color: '#FFFFFF',
        fontSize: 40,
        paddingTop: 30,
    },
    textHeader3: {
        color: '#FFFFFF',
        fontSize: 30,
        paddingTop: 60,
        paddingBottom: 15,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    text2: {
        color: '#FFFFFF',
        fontSize: 20,
        justifyContent: 'center',
    },
    container: {
        backgroundColor: '#0F172A',
        flex: 1,
    },
    drawerHeader: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 10,
        marginBottom: 5,
        color: '#FFFFFF',
    },
    drawerItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    button: {
        backgroundColor: '#87CEEB',
        padding: 10,
        marginTop: 25,
        marginBottom: 20,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    drawerImage: {
        flex: 1, 
        width: null, 
        height: null, 
        resizeMode: 'contain',
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
})