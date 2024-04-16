import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Error from '../components/Error';
import { Feather } from '@expo/vector-icons';
import Layout from './Layout';
import place_holder_image from '../assets/placeholder_image.jpg';

const { width } = Dimensions.get('window');

export default function Home({ navigation }) {
    const [uid, setUid] = useState('');
    const [profile, setProfile] = useState({});
    const [drawers, setDrawers] = useState([]);
    const [drawerGetStatus, setDrawerGetStatus] = useState('');
    const [error, setError] = useState(null);
    const [latestDrawerActivity, setLatestDrawerActivity] = useState({});
    const [latestDrawerActivityImage, setLatestDrawerActivityImage] = useState(null);
    const [thereIsDrawerActivity, setThereIsDrawerActivity] = useState(false);

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


    // async function addNewDrawer(uid) {//added
    //     try {
    //         const drawer_name = prompt('Enter drawer name:');
    //         const drawer_type = prompt("Enter the drawer type. Indicate if you are using the device for a small/big drawer or a closet.")
    //         const response = await axios.post('https://drawerapp.pythonanywhere.com/api/add_drawer', {
    //             uid: uid,
    //             drawer_name: drawer_name,
    //             drawer_type: drawer_type,
    //         });
    //         setDrawers([...drawers, response.data]);
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // }

    async function get_latest_drawer_activity(uid) {
        try {
            const response = await axios.get('https://febe-199-111-212-147.ngrok-free.app/api/get_latest_drawer_activity', {
                params: { uid: uid }
            });
            if (response.data) {
                data = await response.data;
                if (data.time) {
                    data.time = new Date(data.time).toLocaleString();
                }
                if (data.image) {
                    console.log("We set the image");
                    setLatestDrawerActivityImage(`data:image/png;base64,${data.image}`);

                }

                setLatestDrawerActivity(data);
                setThereIsDrawerActivity(true);

            }
            else {
                // try again
                get_latest_drawer_activity(uid);

            }
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
            getDrawers(storedUid);
            get_latest_drawer_activity(storedUid);
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

    const renderDrawerInfo = ({ item }) => ( //fixe
        <TouchableOpacity onPress={() => navigation.navigate('CameraRoll', { uid: uid, drawerID: item.id })}>
            <View style={styles.drawerItem}>
                <View style={styles.statusContainer}>
                    <Feather name="box" size={20} color="#000" style={{ marginRight: 5 }} />
                    <Text style={styles.text2}>Drawer Name: {item.title}</Text>
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
        <Layout>
            <ScrollView>

                <View style={styles.container}>
                    {/* <Error errorMessage={error} duration={100000} /> */}
                    <Text style={styles.welcome_text}>Welcome, </Text>
                    <Text style={styles.profile_name}>{profile.name}!</Text>
                    <Text style={styles.textHeader3}>Latest Drawer Activity:</Text>
                    <View style={styles.home_screen_button}>
                        {thereIsDrawerActivity ? (
                            <>

                                <Image source={latestDrawerActivityImage ? { uri: latestDrawerActivityImage } : place_holder_image} style={styles.drawerImage} />
                                <Text style={styles.text2}>Drawer Name:</Text>
                                <Text style={styles.text4}>{latestDrawerActivity?.title}</Text>

                                <Text style={styles.text2}>Last Time of Access:</Text>
                                <Text style={styles.text4}>{latestDrawerActivity?.time}</Text>

                                <TouchableOpacity onPress={() => navigation.navigate('CameraRoll')} style={styles.button}>
                                    <Text style={styles.buttonText}>View More </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.text2}>No drawer activity found</Text>
                        )}


                    </View>
                    {/* <TouchableOpacity onPress={() => getDrawers(uid)} style={styles.button}>
                        <Text style={styles.buttonText}>Get Drawers</Text>
                    </TouchableOpacity> */}

                    {/* <Text style={styles.text}>Drawer Retrieval Status:</Text>
                    <Text style={styles.text}>{drawerGetStatus}</Text> */}

                    {/* <TouchableOpacity onPress={() => navigation.navigate("AddDrawer", { uid: uid })} style={styles.button}>
                        <Text style={styles.buttonText}>Add a New Drawer</Text>
                    </TouchableOpacity> */}

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

                    <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')} style={styles.home_screen_button}>
                        <Text style={styles.buttonText}>Setup Instructions</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </Layout>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 200, // specify the width
        height: 200, // specify the height
        borderRadius: 15, // round the corners
        marginBottom: 20, // add some space below
        // center this horizontally
        marginLeft: 'auto',
        marginRight: 'auto',

    },
    welcome_text: {
        color: '#FFFFFF',
        marginTop: 70,
        fontSize: 40,
        fontFamily: 'Lato_Regular', /* Adding a common font family */
        textAlign: 'center', /* Centering the text */
    },

    profile_name: {
        color: '#FFDC2A',
        fontSize: 30,
        fontFamily: 'Lato_Regular',
        textAlign: 'center',
        marginBottom: 20, /* Adding some space below */
    },

    textHeader2: {
        color: '#FFFFFF',
        fontSize: 40,
        paddingTop: 30,
        fontFamily: 'Lato_Regular',
        textAlign: 'center',
    },

    textHeader3: {
        color: '#B4B6B0',
        fontSize: 20,
        paddingTop: 60,
        paddingBottom: 15,
        fontFamily: 'Lato_Regular',
        textAlign: 'left',
        marginLeft: 20,
    },

    text: {
        color: '#FFFFFF',
        fontSize: 22,
        fontFamily: 'Lato_Regular',
        textAlign: 'center',
    },

    text2: {
        color: '#FFFFFF',
        fontSize: 20,
        justifyContent: 'center',
        fontFamily: 'Lato_Regular',
        textAlign: 'left',
    },

    
    text4: {
        color: '#10F0E6',
        fontSize: 20,
        justifyContent: 'center',
        fontFamily: 'Lato_Regular',
        textAlign: 'left',
        marginBottom: 20,
    },

    container: {
        backgroundColor: '#1E1F3E',
        flex: 1,
        padding: 0,

        // alignItems: 'center', /* Centering the content vertically */
        // justifyContent: 'center', /* Centering the content horizontally */
    },

    drawerHeader: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 10,
        marginBottom: 5,
        color: '#FFFFFF',
        fontFamily: 'Lato_Regular',
        textAlign: 'center',
    },

    drawerItem: {
        backgroundColor: '#FFFFFF', // White card background
        borderRadius: 10, // Rounded corners for cards
        marginVertical: 10, // Space between cards
        padding: 15, // Inner spacing
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontFamily: 'Lato_Regular',
    },



    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Lato_Regular',
        backgroundColor: '#2A2A42',
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        marginTop: 20,

    },

    drawerImage: {
        width: 200, // specify the width
        height: 200, // specify the height
        borderRadius: 15, // round the corners
        marginBottom: 20, // add some space below
        // center this horizontally
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15, /* Slightly reducing the margin */
    },

    home_screen_button: {
        backgroundColor: '#13132D',
        width: '100%',
        maxWidth: 600, /* Limiting the maximum width */
        padding: 20, /* Increasing padding */
        borderRadius: 15, /* Making the section more rounded */
        marginTop: 30, /* Adjusting margin */
    },

})