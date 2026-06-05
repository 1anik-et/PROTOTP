import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';

export default function OnboardingIndex() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);
  const { colors } = useThemeStore();

  useEffect(() => {
    setTimeout(() => {
      if (userRole === 'Provider') {
        router.replace('/(onboarding)/provider');
      } else if (userRole === 'Dependent') {
        router.replace('/(onboarding)/dependent');
      } else {
        router.replace('/(auth)');
      }
    }, 100);
  }, [userRole]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}