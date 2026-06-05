import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { axiosClient } from '../../src/api/axiosClient';
import { Ionicons } from '@expo/vector-icons';

export default function ProviderOnboarding() {
  const { token, userRole, completeOnboarding } = useAuthStore();
  const { colors, isDark } = useThemeStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');
  const [pref, setPref] = useState('SMS Alerts');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      await axiosClient.post(
        '/api/user/profile',
        { role: userRole, onboardingData: { name, parentId, preferences: pref } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      completeOnboarding();
    } catch (err) {
      console.error(err);
      completeOnboarding();
    } finally {
      setIsProcessing(false);
    }
  };

  const stepTitles = ['Your Name', 'Connect Patient', 'Preferences'];

  const renderProgressBar = () => (
    <View style={s.progressRow}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={[s.progressTrack, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
          {step >= i && <View style={s.progressFill} />}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.content}>
            {/* Header */}
            <View style={s.headerRow}>
              {step > 1 ? (
                <TouchableOpacity onPress={() => setStep(step - 1)} style={s.backBtn}>
                  <Ionicons name="chevron-back" size={28} color={colors.text} />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 40, height: 40 }} />
              )}
              <Text style={[s.headerTitle, { color: colors.text }]}>Caregiver Setup</Text>
              <Text style={{ color: colors.textMuted, fontSize: 14, fontWeight: '600' }}>
                {step}/3
              </Text>
            </View>

            {renderProgressBar()}

            <View style={{ flex: 1 }}>
              {step === 1 && (
                <View style={{ flex: 1 }}>
                  <Text style={[s.stepTitle, { color: colors.text }]}>What is your full name?</Text>
                  <Text style={[s.stepDesc, { color: colors.textSecondary }]}>
                    This helps us personalize your experience.
                  </Text>

                  <Text style={[s.label, { color: colors.textSecondary }]}>Full Name</Text>
                  <View style={[s.inputBox, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                    <TextInput
                      style={[s.input, { color: colors.text }]}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your full name"
                      placeholderTextColor={colors.textMuted}
                      autoFocus
                    />
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={{ flex: 1 }}>
                  <Text style={[s.stepTitle, { color: colors.text }]}>Connect to Patient</Text>
                  <Text style={[s.stepDesc, { color: colors.textSecondary }]}>
                    Enter the unique code provided by the person you're caring for.
                  </Text>

                  <Text style={[s.label, { color: colors.textSecondary }]}>Patient Connection Code</Text>
                  <View style={[s.inputBox, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                    <TextInput
                      style={[s.input, { color: colors.text }]}
                      value={parentId}
                      onChangeText={setParentId}
                      placeholder="Enter code (e.g. 8X9F2A)"
                      placeholderTextColor={colors.textMuted}
                      autoCapitalize="characters"
                      autoFocus
                    />
                  </View>
                </View>
              )}

              {step === 3 && (
                <View style={{ flex: 1 }}>
                  <Text style={[s.stepTitle, { color: colors.text }]}>Notification Settings</Text>
                  <Text style={[s.stepDesc, { color: colors.textSecondary }]}>
                    How would you like to receive emergency alerts and reminders?
                  </Text>

                  <Text style={[s.label, { color: colors.textSecondary }]}>Select Preference</Text>
                  <TouchableOpacity
                    onPress={() => setPref('SMS Alerts')}
                    style={[
                      s.optionCard,
                      { borderColor: colors.surfaceBorder, backgroundColor: colors.surface },
                      pref === 'SMS Alerts' && { borderColor: '#f97316', backgroundColor: isDark ? '#431407' : '#fff7ed' },
                    ]}
                  >
                    <Ionicons name="chatbubble-ellipses" size={24} color={pref === 'SMS Alerts' ? '#ea580c' : colors.textMuted} />
                    <Text style={[s.optionText, { color: colors.text }, pref === 'SMS Alerts' && { color: colors.accent }]}>
                      SMS Alerts
                    </Text>
                    <View style={{ marginLeft: 'auto' }}>
                      <Ionicons name="checkmark-circle" size={24} color={pref === 'SMS Alerts' ? '#ea580c' : 'transparent'} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setPref('In-App Only')}
                    style={[
                      s.optionCard,
                      { borderColor: colors.surfaceBorder, backgroundColor: colors.surface },
                      pref === 'In-App Only' && { borderColor: '#f97316', backgroundColor: isDark ? '#431407' : '#fff7ed' },
                    ]}
                  >
                    <Ionicons name="notifications" size={24} color={pref === 'In-App Only' ? '#ea580c' : colors.textMuted} />
                    <Text style={[s.optionText, { color: colors.text }, pref === 'In-App Only' && { color: colors.accent }]}>
                      In-App Only
                    </Text>
                    <View style={{ marginLeft: 'auto' }}>
                      <Ionicons name="checkmark-circle" size={24} color={pref === 'In-App Only' ? '#ea580c' : 'transparent'} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Footer Buttons */}
            <View style={{ marginBottom: 24 }}>
              {step === 1 && (
                <TouchableOpacity
                  onPress={() => name.trim().length > 0 && setStep(2)}
                  disabled={name.trim().length === 0}
                  style={[s.btn, name.trim().length === 0 && { backgroundColor: colors.btnDisabled }]}
                >
                  <Text style={s.btnText}>Continue</Text>
                </TouchableOpacity>
              )}
              {step === 2 && (
                <TouchableOpacity
                  onPress={() => parentId.trim().length > 0 && setStep(3)}
                  disabled={parentId.trim().length === 0}
                  style={[s.btn, parentId.trim().length === 0 && { backgroundColor: colors.btnDisabled }]}
                >
                  <Text style={s.btnText}>Continue</Text>
                </TouchableOpacity>
              )}
              {step === 3 && (
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isProcessing}
                  style={[s.btn, isProcessing && { backgroundColor: colors.btnDisabled }]}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={s.btnText}>Complete Setup</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  progressTrack: { flex: 1, marginHorizontal: 4, height: 8, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#f97316', borderRadius: 999 },
  stepTitle: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
  stepDesc: { fontSize: 15, marginBottom: 24, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputBox: { borderWidth: 1, borderRadius: 12, height: 56, paddingHorizontal: 16, marginBottom: 24 },
  input: { flex: 1, fontSize: 16, fontWeight: '500', height: '100%' },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, marginBottom: 16 },
  optionText: { marginLeft: 12, fontSize: 18, fontWeight: '700' },
  btn: { height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c2410c' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});