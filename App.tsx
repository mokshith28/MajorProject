import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {Camera, useCameraDevices, useCameraPermission} from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

function App() {
  const [isActive, setIsActive] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back');
  const camera = useRef<Camera>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const takePhotoAndRecognize = async () => {
    if (!camera.current || !device) return;
    
    setIsScanning(true);
    try {
      const photo = await camera.current.takePhoto();
      console.log('Photo path:', photo.path); // Debug log
    
      // Add file:// prefix for Android
      const filePath = `file://${photo.path}`;
      const result = await TextRecognition.recognize(filePath);
      setRecognizedText(result.text);
    } catch (error) {
      console.error('Error recognizing text:', error);
      setRecognizedText('Error recognizing text');
    } finally {
      setIsScanning(false);
    }
  };

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

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
      
      {/* Text Recognition Results */}
      {recognizedText ? (
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Recognized Text:</Text>
          <ScrollView style={styles.textScroll}>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </ScrollView>
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => setRecognizedText('')}
          >
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.cameraButton]} 
          onPress={() => setIsActive(!isActive)}
        >
          <Text style={styles.buttonText}>
            {isActive ? 'Stop Camera' : 'Start Camera'}
          </Text>
        </TouchableOpacity>
        
        {isActive && (
          <TouchableOpacity 
            style={[styles.button, styles.scanButton, isScanning && styles.buttonDisabled]} 
            onPress={takePhotoAndRecognize}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? 'Scanning...' : 'Scan Text'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  scanButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  textContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    maxHeight: 200,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 15,
    zIndex: 1,
  },
  textTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textScroll: {
    maxHeight: 120,
  },
  recognizedText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
});

export default App;
