import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const Upload = () => {
    const handleUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
        if (!result.canceled) {
            console.log('Selected file:', result.assets[0]);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
                onPress={handleUpload}
            >
                <Text style={styles.buttonText}>Upload Report</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 32,
    },
    button: {
        backgroundColor: '#111',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonPressed: {
        opacity: 0.85,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default Upload;