import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';
import { useThemeStore } from '../src/store/themeStore';  
// import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { token, onboardingStatus } = useAuthStore();
  const { colors } = useThemeStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const [isMounted, setIsMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !navigationState?.key) return;
    
    // SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inMainGroup = segments[0] === '(main)';
    
    // Hide splash after a brief branding display
    // const splashTimer = setTimeout(() => setShowSplash(false), 1800);
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    
    // // Navigate after splash
    // const navTimer = setTimeout(() => {
      //   if (!token) { // security token
      //     if (!inAuthGroup) router.replace('/(auth)');
      //   } else if (onboardingStatus === 'incomplete') {
        //     if (!inOnboardingGroup) router.replace('/(onboarding)');
        //   } else if (onboardingStatus === 'complete') {
          //     if (!inMainGroup) router.replace('/(main)');
          //   }
          // }, 2000);
          
          // return () => {
            //   clearTimeout(splashTimer);
            //   clearTimeout(navTimer);
            // };

    // 2. Hide the static Native Splash Screen immediately to reveal your custom one
    
    // 3. Keep YOUR custom splash screen up for exactly 1.5 seconds, then remove it
    

    // 3. Now it is safe to route
    if (!token) {
      if (!inAuthGroup) router.replace('/(auth)');
    } else if (onboardingStatus === 'incomplete') {
      if (!inOnboardingGroup) router.replace('/(onboarding)');
    } else if (onboardingStatus === 'complete') {
      if (!inMainGroup) router.replace('/(main)');
    }
    

    return () => clearTimeout(splashTimer);

  }, [token, onboardingStatus, segments, navigationState?.key, isMounted]);

  // --- SPLASH SCREEN ---
  if (showSplash || !isMounted || !navigationState?.key) {
    return (
      <SafeAreaProvider>
        <View style={[splash.container, { backgroundColor: colors.bg }]}>
          <View style={splash.brandWrap}>
            <View style={splash.logoCircle}>
              <Text style={splash.logoIcon}>🔐</Text>
            </View>
            <Text style={[splash.brandName, { color: colors.text }]}>PROTOTP</Text>
            <Text style={[splash.tagline, { color: colors.textSecondary }]}>
              Secure Care. Instant Access.
            </Text>
          </View>
          <View style={splash.bottom}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={[splash.loadingText, { color: colors.textMuted }]}>
              {token ? 'Restoring session...' : 'Getting things ready...'}
            </Text>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </SafeAreaProvider>
  );
}

const splash = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandWrap: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#fed7aa',
  },
  logoIcon: {
    fontSize: 44,
  },
  brandName: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  bottom: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});