import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';


export default function DrawerDetails({ route }) {
        const { uid, drawerID } = route.params;
        const [image_data, setImageData] = useState(null); 
        const [decodedImage, setDecodedImage] = useState(null);
        const [loading, setLoading] = useState(true);

        const decodeBase64Image = (base64String) => {
            const byteArray = base64String ? base64String.split(',').pop() : '';
            const decodedImage = 'data:image/jpeg;base64,' + byteArray;
            setDecodedImage(decodedImage);
          };

        async function getDrawerImage(uid, drawerID) {
            // get the drawer details
            axios.get('https://drawerapp.pythonanywhere.com/api/get_drawer_image', {
                params: { drawer_id: drawerID , uid: uid }
            })
            .then((response) => {
                var image_data_lol = response.data.image;
                setImageData(image_data_lol);
                if (image_data === null) {
                    console.log('No image data found');
                }

                decodeBase64Image(image_data);
            })
            .catch((error) => {
                console.log('Error message:', error.message);
            });
        }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <TouchableOpacity onPress={() => getDrawerImage(uid, drawerID)}>
            <Text>Get Drawer Image</Text>
        </TouchableOpacity>

        {decodedImage && (
        <View>
          <Image
            source={{ uri: decodedImage }}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
            onLoadEnd={() => setLoading(false)}
          />
        </View>
      )}
      <Text>Drawer Details</Text>
      <Text>Drawer ID: {drawerID}</Text>
      {/* Add more details or functionality as needed */}
      {loading && <Text>Loading Image...</Text>}
    </View>
  );
}
