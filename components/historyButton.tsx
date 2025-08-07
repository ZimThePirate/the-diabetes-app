import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const HistoryButton = () => {
    const router = useRouter();

    const handleHistoryPress = () => {
        router.push('/history');
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.historyButton,
                    pressed && styles.buttonPressed,
                ]}
                onPress={handleHistoryPress}
            >
                <Ionicons name="time-outline" size={32} color="#fff" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 32,
    },
    historyButton: {
        width: 48,
        height: 48,
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
});

export default HistoryButton;