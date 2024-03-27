import * as React from 'react'; 
import {View, Text} from 'react-native'; 

export default function SettingsScreen({navigation}){
    return(
        <View style={styles.screenBasic}>
            <Text 
                onPress={() => navigation.navigate('Home')}
                style = {styles.alerts}>Camera Roll</Text>
        </View>
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