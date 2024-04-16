import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function DrawerDetails({ route }) {
  const { uid, drawerID } = route.params;
  const [logs, setLogs] = useState([]);
  const [decodedImage, setDecodedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeBase64Image = (base64String) => {
    const byteArray = base64String ? base64String.split(',').pop() : '';
    const decodedImage = 'data:image/jpeg;base64,' + byteArray;
    setDecodedImage(decodedImage);
  };

  async function get_drawer_logs(uid, drawerID) {
    // get the drawer details
    axios.get('https://drawerApp.pythonanywhere.com/api/get_drawer_logs', {
      params: { drawer_id: drawerID, uid: uid }
    })
      .then((response) => {
        const logs = response.data;
        console.log('Logs:', logs);

        const logsArray = Object.keys(logs).map(key => ({
          id: key,
          ...logs[key]
        }));

        console.log('Logs Array:', logsArray);

        setLogs(logsArray);

      })
      .catch((error) => {
        console.log('Error message:', error.message);
      });
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <TouchableOpacity onPress={() => get_drawer_logs(uid, drawerID)}>
        <Text>Get Drawer Image</Text>
      </TouchableOpacity>

      <Text>Drawer Details</Text>
      <Text>Drawer ID: {drawerID}</Text>
      {/* Add more details or functionality as needed */}
      {loading && <Text>Loading Image...</Text>}

      {/* just display the logs */}
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Logs</Text>

      {logs && logs.map((log, index) => {
        return (
          <View key={index}>
            <Text>{log.time}</Text>
            <Image
              source={{ uri: `data:image/png;base64,${log.image}` }}
              style={{ width: 100, height: 100 }}
            />
          </View>
        );
      })}
    </View>
  );
}
