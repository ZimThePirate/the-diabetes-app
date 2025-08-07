import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import ChatButton from '../components/chatButton';
import ClickReport from '../components/clickReport';
import Upload from '../components/upload';
import Title from '../components/title';

export default function Home() {
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <Title />
            <View style={styles.componentsContainer}>
                <Upload />
                <View style={styles.horizontalContainer}>
                    <ClickReport />
                    <ChatButton />
                </View>
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
    componentsContainer: {
        alignItems: 'center',
    },
    horizontalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});