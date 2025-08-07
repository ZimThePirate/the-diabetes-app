import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


const Title = () => {
    return (
        <View>
            <Text style={styles.title}>The Diabetes App</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#000000ff',
        textAlign: 'center',
        letterSpacing: -0.5,
    }
});

export default Title