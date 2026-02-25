import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/instances');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={styles.imageWrapper}>
                <Image
                    source={require('../assets/app-images/intern image.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    logo: {
        width: 280,
        height: 280,
    },
});
