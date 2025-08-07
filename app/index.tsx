import { Stack } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

import Upload from '../components/upload';
import ClickReport from '../components/clickReport';


export default function Home() {
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Text style={styles.title}>The Diabetes App</Text>

            <View style={styles.componentsContainer}>
                <Upload />
                <ClickReport />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#000000ff',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    componentsContainer: {
        alignItems: 'center',
    },
});