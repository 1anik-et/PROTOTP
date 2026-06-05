import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRole } = useAuthStore();
  const { colors, isDark, toggleTheme } = useThemeStore();
  const [selectedRole, setSelectedRole] = useState<'Dependent' | 'Provider' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      router.push('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.bg }]}>
      <View style={s.content}>
        {/* Theme toggle */}
        <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
          <TouchableOpacity onPress={toggleTheme} style={[s.themeBtn, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={s.logoWrap}>
          <Text style={[s.logo, { color: colors.text }]}>PROTOTP.</Text>
        </View>

        <Text style={[s.subtitle, { color: colors.textSecondary }]}>
          Select a role to help us customize your experience.
        </Text>

        <View style={{ gap: 16 }}>
          {/* Dependent Role Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedRole('Dependent')}
            style={[
              s.roleCard,
              { borderColor: colors.surfaceBorder, backgroundColor: colors.surface },
              selectedRole === 'Dependent' && { borderColor: '#f97316', backgroundColor: isDark ? '#431407' : 'rgba(255,237,213,0.3)' },
            ]}
          >
            <View style={s.roleCardHeader}>
              <View style={s.iconBox}>
                <MaterialCommunityIcons name="heart-pulse" size={24} color="white" />
              </View>
              {selectedRole === 'Dependent' ? (
                <Ionicons name="checkmark-circle" size={24} color="#f97316" />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color={colors.textMuted} />
              )}
            </View>
            <Text style={[s.roleTitle, { color: colors.text }]}>I need care</Text>
            <Text style={[s.roleDesc, { color: colors.textSecondary }]}>
              Get support for myself - health, reminders, and help when I need it.
            </Text>
          </TouchableOpacity>

          {/* Provider Role Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedRole('Provider')}
            style={[
              s.roleCard,
              { borderColor: colors.surfaceBorder, backgroundColor: colors.surface },
              selectedRole === 'Provider' && { borderColor: '#f97316', backgroundColor: isDark ? '#431407' : 'rgba(255,237,213,0.3)' },
            ]}
          >
            <View style={s.roleCardHeader}>
              <View style={s.iconBox}>
                <MaterialCommunityIcons name="hand-heart" size={24} color="white" />
              </View>
              {selectedRole === 'Provider' ? (
                <Ionicons name="checkmark-circle" size={24} color="#f97316" />
              ) : (
                <Ionicons name="ellipse-outline" size={24} color={colors.textMuted} />
              )}
            </View>
            <Text style={[s.roleTitle, { color: colors.text }]}>I am a Caregiver</Text>
            <Text style={[s.roleDesc, { color: colors.textSecondary }]}>
              Care for a parent, child, or loved one from anywhere
            </Text>
          </TouchableOpacity>
        </View>

        <View style={s.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedRole}
            style={[s.btn, !selectedRole && { backgroundColor: colors.btnDisabled }]}
          >
            <Text style={s.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  themeBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  logoWrap: { alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, textAlign: 'center', paddingHorizontal: 16, marginBottom: 32 },
  roleCard: { padding: 20, borderRadius: 16, borderWidth: 2 },
  roleCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  roleTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  roleDesc: { fontSize: 14, lineHeight: 20 },
  footer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 32, marginTop: 16 },
  btn: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ea580c' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});