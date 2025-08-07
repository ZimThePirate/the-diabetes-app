import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
            <TouchableOpacity style={styles.button} onPress={handleUpload}>
                <Text style={styles.buttonText}>Upload Report</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 32,
    },
    button: {
        backgroundColor: '#111827',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    buttonText: {
        color: '#F9FAFB',
        fontWeight: '600',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default Upload;