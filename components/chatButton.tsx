import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ChatButton = () => {
    const router = useRouter();

    const handleChatPress = () => {
        router.push('/chat');
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.chatButton,
                    pressed && styles.buttonPressed,
                ]}
                onPress={handleChatPress}
            >
                <Ionicons name="chatbubble" size={32} color="#fff" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 32,
    },
    chatButton: {
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

export default ChatButton;