import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import Welcome from '../components/newUser/welcome';
import UserDetail from '../components/newUser/userDetail';

export default function NewUser() {
    const [screen, setScreen] = useState(0);
    const router = useRouter();

    const handleFinishOnboarding = async () => {
        try {
            await SecureStore.setItemAsync('hasLaunchedBefore', 'true');
            router.replace('/');
        } catch (error) {
            console.error('Error saving first launch state:', error);
            router.replace('/');
        }
    };

    const handleNextScreen = () => {
        const nextScreen = screen + 1;
        if (nextScreen <= 1) {
            setScreen(nextScreen);
        } else {
            handleFinishOnboarding();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {screen === 0 && <Welcome onNext={handleNextScreen} />}
            {screen === 1 && <UserDetail onNext={handleNextScreen} onBack={() => setScreen(0)} />}
        </View>
    );
}