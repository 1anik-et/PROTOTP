import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';

export default function MainIndex() {
  const router = useRouter();
  const userRole = useAuthStore((state) => state.userRole);
  const { colors } = useThemeStore();

  useEffect(() => {
    setTimeout(() => {
      if (userRole === 'Provider') {
        router.replace('/(main)/provider');
      } else {
        router.replace('/(main)/dependent');
      }
    }, 100);
  }, [userRole]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.accent} />
    </View>
  );
}