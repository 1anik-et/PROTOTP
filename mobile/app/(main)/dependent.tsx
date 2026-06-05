import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { Ionicons } from '@expo/vector-icons';

export default function DependentDashboard() {
  const { logout, identifier } = useAuthStore();
  const { colors, isDark, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleSOS = () => {
    Alert.alert('🚨 Emergency Alert', 'Your caregiver has been notified immediately.', [
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.badge, { color: colors.textMuted }]}>Patient Mode</Text>
            <Text style={[s.greeting, { color: colors.text }]}>Welcome back 👋</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={toggleTheme} style={[s.iconBtn, { backgroundColor: colors.logoutBg }]}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={20} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={[s.iconBtn, { backgroundColor: isDark ? '#7f1d1d' : '#fecaca' }]}>
              <Ionicons name="log-out" size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency CTA */}
        <TouchableOpacity style={s.sos} activeOpacity={0.8} onPress={handleSOS}>
          <View>
            <Text style={s.sosTitle}>SOS Emergency</Text>
            <Text style={s.sosSub}>Tap to alert your caregiver</Text>
          </View>
          <View style={s.sosIcon}>
            <Ionicons name="warning" size={28} color="white" />
          </View>
        </TouchableOpacity>

        {/* Status Cards */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>Your Status</Text>
        <View style={s.statusGrid}>
          <View style={[s.statusCard, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}>
            <View style={[s.statusIcon, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
              <Ionicons name="heart" size={22} color="#22c55e" />
            </View>
            <Text style={[s.statusLabel, { color: colors.textMuted }]}>Health</Text>
            <Text style={[s.statusValue, { color: colors.text }]}>Good</Text>
          </View>
          <View style={[s.statusCard, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}>
            <View style={[s.statusIcon, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
              <Ionicons name="shield-checkmark" size={22} color="#3b82f6" />
            </View>
            <Text style={[s.statusLabel, { color: colors.textMuted }]}>Caregiver</Text>
            <Text style={[s.statusValue, { color: colors.text }]}>Connected</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[s.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={{ gap: 12 }}>
          {[
            { icon: 'call', color: '#22c55e', bg: isDark ? '#14532d' : '#f0fdf4', label: 'Call Caregiver', desc: 'Reach out instantly' },
            { icon: 'location', color: '#3b82f6', bg: isDark ? '#1e3a5f' : '#eff6ff', label: 'Share Location', desc: 'Send your live location' },
            { icon: 'chatbubbles', color: '#a855f7', bg: isDark ? '#3b1f5e' : '#faf5ff', label: 'Messages', desc: 'View conversations' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[s.actionRow, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}
              activeOpacity={0.7}
            >
              <View style={[s.actionRowIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[s.actionRowLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 13 }}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account Card */}
        <View style={[s.infoCard, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}>
          <Ionicons name="person-circle" size={28} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>Signed in as</Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>+91 {identifier || 'Unknown'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={[s.signOutBtn, { borderColor: '#dc2626' }]}>
            <Text style={{ color: '#dc2626', fontWeight: '700', fontSize: 13 }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  badge: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  greeting: { fontSize: 28, fontWeight: '900' },
  iconBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sos: { backgroundColor: '#ef4444', borderRadius: 20, padding: 24, marginBottom: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sosTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  sosSub: { color: '#fecaca', fontWeight: '500', fontSize: 14 },
  sosIcon: { width: 52, height: 52, backgroundColor: '#f87171', borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fca5a5' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  statusGrid: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statusCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, alignItems: 'center' },
  statusIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statusLabel: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  statusValue: { fontSize: 16, fontWeight: '800' },
  actionRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1 },
  actionRowIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  actionRowLabel: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  infoCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1, marginTop: 24 },
  signOutBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
});