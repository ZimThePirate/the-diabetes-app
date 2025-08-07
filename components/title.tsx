import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Title = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>The Diabetes App</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#111',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
});

export default Title;