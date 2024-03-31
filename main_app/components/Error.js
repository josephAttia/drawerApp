import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';

const Error = ({ errorMessage, duration }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  return (
    <View>
      {visible && (
        <View style={{ backgroundColor: 'red', padding: 10, marginBottom: 10 }}>
          <Text style={{ color: 'white' }}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default Error;
