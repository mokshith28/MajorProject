import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Camera, useCameraDevices, useCameraPermission} from 'react-native-vision-camera';

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
      />
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setIsActive(!isActive)}
        >
          <Text>{isActive ? 'Stop Camera' : 'Start Camera'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default App;