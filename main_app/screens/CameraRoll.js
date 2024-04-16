
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Layout from './Layout';

const windowWidth = Dimensions.get('window').width;
const photoHeight = windowWidth * 0.28; // Smaller percentage for better fit
const photoWidth = photoHeight * 1.6; // Maintaining aspect ratio

export default function CameraRoll({ route }) {
    const { uid, drawerID } = route.params;
    const [current_logs, setLogs] = useState([]);

    useEffect(() => {
        fetchImages(uid, drawerID);
    }, [uid, drawerID]);

    function convert_time_to_readable(time) {
        const date = new Date(time);
        return date.toLocaleString();
    }

    async function fetchImages(uid, drawerID) {
        try {
            await axios.get('https://8a79-199-111-225-106.ngrok-free.app/api/get_drawer_logs', {
                params: { uid: uid, drawer_id: drawerID }
            }).then((response) => {
                const logs = response.data;

                let fetchedLogs = Object.keys(logs).map(key => ({
                    id: key,
                    ...logs[key]
                }));

                // Sort fetchedLogs by time in ascending order
                fetchedLogs.sort((a, b) => new Date(b.time) - new Date(a.time));

                setLogs(fetchedLogs);
            });
        }
        catch (error) {
            console.error('Failed to fetch images', error);
        }
    };
    return (
        <>
            <Layout>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>Camera Roll</Text>
                {/* write a refresh button */}
                <TouchableOpacity onPress={() => fetchImages(uid, drawerID)} style={{ alignSelf: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#007BFF', fontSize: 16 }}>Refresh</Text>
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {current_logs.length === 0 && <Text style={styles.placeholderText}>No images found</Text>}
                    {current_logs.map((log, index) => (
                        <View key={index} style={styles.logContainer}>
                            <Image
                                source={{ uri: `data:image/png;base64,${log.image}` }}
                                style={styles.image}
                            />
                            <Text style={styles.timestamp}>{convert_time_to_readable(log.time)}</Text>
                        </View>
                    ))}
                </ScrollView>
            </Layout>
        </>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        marginTop: 10,
        alignItems: 'flex-start',
        backgroundColor: '#fff', // Light grey background for a cleaner look
        paddingTop: 10,

    },
    logContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 15,
        width: windowWidth - 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF', // White to contrast with light grey background
        borderRadius: 8,
        shadowColor: '#000', // Adding shadow for elevation effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4, // For Android
    },
    image: {
        width: photoWidth,
        height: photoHeight,
        marginRight: 10,
        borderRadius: 6,
    },
    timestamp: {
        color: '#333333',
        fontSize: 13,
        fontWeight: 'bold', // Making timestamp bold
    },
    placeholderText: {
        color: '#6C757D', // Using a dark grey for better readability
        fontSize: 18,
    },
});

