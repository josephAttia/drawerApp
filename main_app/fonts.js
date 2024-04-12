import * as Font from 'expo-font';

export const loadFonts = async () => {
    await Font.loadAsync({
        Lato_Regular: require('./assets/Lato-Regular.ttf'),
      // Add more font styles if needed
    });
  };