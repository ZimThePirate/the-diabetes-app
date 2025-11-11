import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        const checkFirstTimeInstall = async () => {
            try {
                const hasLaunchedBefore = await SecureStore.getItemAsync('hasLaunchedBefore');
                if (hasLaunchedBefore === null) {
                    setIsFirstTime(true);
                } else {
                    setIsFirstTime(false);
                }
            } catch (error) {
                console.error('Error checking first time install:', error);
                setIsFirstTime(false);
            }
        };
        
        if (loaded) {
            checkFirstTimeInstall();
        }
    }, [loaded, segments]);

    useEffect(() => {
        if (!loaded || isFirstTime === null) return;

        const inAuthGroup = segments[0] === 'new-user';

        if (isFirstTime && !inAuthGroup) {
            router.replace('/new-user');
        } else if (!isFirstTime && inAuthGroup) {
            router.replace('/');
        }
    }, [isFirstTime, segments, loaded]);

    if (!loaded || isFirstTime === null) {
        return null;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
