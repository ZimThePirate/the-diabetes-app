import React, { useState, useRef } from 'react';
import { View, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const ClickReport = () => {
    const [cameraVisible, setCameraVisible] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const handleOpenCamera = async () => {
        if (!permission) {
            const result = await requestPermission();
            if (!result.granted) {
                alert('Camera permission is required!');
                return;
            }
        }
        if (!permission?.granted) {
            alert('Camera permission is required!');
            return;
        }
        setCameraVisible(true);
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: false,
            });
            if (photo) {
                console.log('Captured image:', photo);
                setCameraVisible(false);
            }
        }
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.squareButton,
                    pressed && styles.buttonPressed,
                ]}
                onPress={handleOpenCamera}
            >
                <Ionicons name="camera" size={32} color="#fff" />
            </Pressable>

            <Modal
                visible={cameraVisible}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <View style={styles.cameraContainer}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                    >
                        <View style={styles.cameraControls}>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setCameraVisible(false)}
                            >
                                <Ionicons name="close" size={32} color="#fff" />
                            </Pressable>

                            <Pressable
                                style={styles.flipButton}
                                onPress={toggleCameraFacing}
                            >
                                <Ionicons name="camera-reverse" size={32} color="#fff" />
                            </Pressable>
                        </View>

                        <View style={styles.captureContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.captureButton,
                                    pressed && styles.captureButtonPressed,
                                ]}
                                onPress={takePicture}
                            >
                                <View style={styles.captureButtonInner} />
                            </Pressable>
                        </View>
                    </CameraView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 32,
    },
    squareButton: {
        width: 64,
        height: 64,
        backgroundColor: '#111',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    cameraControls: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    closeButton: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flipButton: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    captureButton: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButtonPressed: {
        opacity: 0.7,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 30,
    },
});

export default ClickReport;