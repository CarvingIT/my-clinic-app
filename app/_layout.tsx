import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SessionProvider, useSession } from '../ctx';
import { SplashScreenController } from '../splash'

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <SessionProvider>
            <SplashScreenController />
            <StackWithTheme />
        </SessionProvider>
    );
}

function StackWithTheme(){
  const { session } = useSession();
  //const session = false;
  const colorScheme = useColorScheme();

    return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Protected guard={session}>
            <Stack.Screen name="(user)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
            <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    );
}
