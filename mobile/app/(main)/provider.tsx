import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProviderDashboard() {
  const { logout, identifier } = useAuthStore();
  const { colors, isDark, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const actions = [
    { icon: 'medical', color: '#3b82f6', bg: isDark ? '#1e3a5f' : '#eff6ff', label: 'Medicines' },
    { icon: 'calendar', color: '#a855f7', bg: isDark ? '#3b1f5e' : '#faf5ff', label: 'Appointments' },
    { icon: 'analytics', color: '#22c55e', bg: isDark ? '#14532d' : '#f0fdf4', label: 'Health Stats' },
    { icon: 'notifications', color: '#f97316', bg: isDark ? '#431407' : '#fff7ed', label: 'Alerts' },
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.bg }]}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={[s.badge, { color: colors.textMuted }]}>Provider Mode</Text>
            <Text style={[s.greeting, { color: colors.text }]}>Hello, Caregiver 👋</Text>
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

        {/* Patient Card */}
        <View style={[s.card, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}>
          <View style={s.cardHead}>
            <Text style={[s.cardTitle, { color: colors.text }]}>Your Patient</Text>
            <View style={[s.statusBadge, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
              <Text style={[s.statusTxt, { color: isDark ? '#86efac' : '#15803d' }]}>Active</Text>
            </View>
          </View>
          <View style={s.cardRow}>
            <View style={[s.avatar, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
              <MaterialCommunityIcons name="heart-pulse" size={28} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.name, { color: colors.text }]}>Connected Patient</Text>
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>Status: Good • Updated now</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[s.section, { color: colors.text }]}>Quick Actions</Text>
        <View style={s.grid}>
          {actions.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[s.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.surfaceBorder }]}
              activeOpacity={0.7}
            >
              <View style={[s.actionIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={[s.actionLabel, { color: colors.text }]}>{item.label}</Text>
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
  card: { borderRadius: 20, padding: 20, marginBottom: 28, borderWidth: 1 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  statusTxt: { fontSize: 12, fontWeight: '700' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  name: { fontSize: 18, fontWeight: '700' },
  section: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  actionCard: { width: '48%', borderRadius: 16, padding: 20, marginBottom: 14, borderWidth: 1, alignItems: 'center' },
  actionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontWeight: '600', fontSize: 14 },
  infoCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderWidth: 1 },
  signOutBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
});