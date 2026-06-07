import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Provider } from 'react';

interface AuthState {
  token: string | null;
  userRole: 'Provider' | 'Dependent' | null;
  onboardingStatus: 'incomplete' | 'complete';
  identifier: string | null; // Keeps phone/email active across login/otp steps
  authProvider: 'firebase' | 'backend' | null;
  
  setIdentifier: (id: string | null) => void;
  setToken: (token: string) => void;
  setRole: (role: 'Provider' | 'Dependent') => void;
  setAuthProvider: (provider: 'firebase' | 'backend' | null) => void;
  completeOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userRole: null,
      onboardingStatus: 'incomplete',
      identifier: null,
      authProvider: null,
      
      setIdentifier: (identifier) => set({ identifier }),
      setToken: (token) => set({ token }),
      setRole: (userRole) => set({ userRole }),
      completeOnboarding: () => set({ onboardingStatus: 'complete' }),
      setAuthProvider: (authProvider) => set({authProvider}),
      logout: () => set({ 
        token: null, 
        userRole: null, 
        onboardingStatus: 'incomplete', 
        identifier: null,
        authProvider: null
      }),
    }),
    {
      name: 'prototp-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  ) 
);