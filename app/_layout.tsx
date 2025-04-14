import { useEffect } from 'react';
import { I18nManager, View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/auth-context';
import { ProfileProvider } from '../context/profile-context';
import { ThemeProvider } from '../context/theme-context';
import { colors } from '../constants/colors';

// Force RTL for Hebrew
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Heebo-Regular': require('../assets/fonts/Heebo-Regular.ttf'),
    'Heebo-Medium': require('../assets/fonts/Heebo-Medium.ttf'),
    'Heebo-Bold': require('../assets/fonts/Heebo-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}