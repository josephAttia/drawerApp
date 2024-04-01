import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from './Layout';

export default function HomeScreen() {
    return (
        <Layout>
            <View style={styles.content}>
                <Text style={styles.alerts}>Settings Screen</Text>
            </View>
        </Layout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        position: 'relative', 
    },
    backgroundImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    screenBasic: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alerts:{
        fontSize: 26,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});