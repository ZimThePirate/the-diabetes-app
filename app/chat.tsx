import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

import Title from '../components/title';

export default function Chat() {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            console.log('Sending message:', message);
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Title />
            <View style={styles.centerContent}>
                <Text style={styles.centerMessage}>
                    Chat with the Diabetes Expert
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.sendButton,
                        pressed && styles.sendButtonPressed,
                    ]}
                    onPress={handleSendMessage}
                >
                    <Ionicons name="send" size={24} color="#fff" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    centerMessage: {
        fontSize: 24,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111',
        backgroundColor: '#F9FAFB',
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
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
    sendButtonPressed: {
        opacity: 0.85,
    },
});