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

function StackWithTheme() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(user)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        {/* Demo screens – bypass auth */}
        <Stack.Screen name="splash-screen" options={{ headerShown: false }} />
        <Stack.Screen name="instances" options={{ headerShown: false }} />
        <Stack.Screen name="collections" options={{ headerShown: false }} />
        <Stack.Screen name="documents" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
