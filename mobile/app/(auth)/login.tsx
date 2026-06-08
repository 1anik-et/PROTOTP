import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard,
  TouchableWithoutFeedback, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useThemeStore } from '../../src/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import { setConfirmation } from '../../src/utils/firebaseHelper';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const API_URL = 'https://prototp-backend.onrender.com/api';

export default function LoginScreen() {
  const router = useRouter();
  const { setIdentifier, setAuthProvider } = useAuthStore();
  const { colors, isDark } = useThemeStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendCode = async () => {
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 1. Attempt Firebase Phone Auth
      const confirmation = await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
      setConfirmation(confirmation);

      setAuthProvider('firebase');
      setIdentifier(phoneNumber);
      setSuccessMessage('OTP Sent Successfully!');
      setTimeout(() => router.push('/(auth)/otp'), 800);
    } catch (error: any) {
      const firebaseErr = error.code || error.message || 'Unknown Firebase Error';
      console.log('Firebase failed:', firebaseErr);

      // Clear UI temporarily while trying backend
      setErrorMessage('');

      try {
        await axios.post(`${API_URL}/auth/send-otp`, { phone: phoneNumber });
        setAuthProvider('backend');
        setIdentifier(phoneNumber);
        setSuccessMessage('OTP Sent Successfully!');
        setTimeout(() => router.push('/(auth)/otp'), 800);
      } catch (backendError: any) {
        const serverMessage = backendError.response?.data?.message || backendError.response?.data?.error;
        // Show BOTH errors for debugging purposes
        setErrorMessage(`Firebase: ${firebaseErr}\nBackend: ${serverMessage || 'Failed'}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const sendDisabled = isProcessing || phoneNumber.length < 10;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.content}>
            {/* Header */}
            <View style={s.header}>
              <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                <Ionicons name="chevron-back" size={28} color={colors.text} />
              </TouchableOpacity>
              <View style={[s.mascot, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                <Ionicons name="happy" size={32} color={colors.accent} />
              </View>
            </View>

            {/* Title */}
            <View style={{ marginBottom: 32 }}>
              <Text style={[s.title, { color: colors.text }]}>Let's get you{'\n'}signed in</Text>
              <View style={s.accentLine} />
              <Text style={{ fontSize: 16, color: colors.textSecondary }}>Sign in or create an account in seconds.</Text>
            </View>

            {/* Messages */}
            {errorMessage ? <Text style={[s.msg, { color: colors.error }]}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={[s.msg, { color: '#22c55e' }]}>{successMessage}</Text> : null}

            {/* Form */}
            <View style={{ gap: 16 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 }}>Phone number</Text>

              <View style={[s.phoneRow, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                <TouchableOpacity style={[s.countryBtn, { borderRightColor: colors.divider }]}>
                  <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '500', marginRight: 4 }}>IND</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
                </TouchableOpacity>
                <TextInput
                  style={[s.phoneInput, { color: colors.text }]}
                  placeholder="9876543210"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setPhoneNumber(text.replace(/[^0-9]/g, ''));
                  }}
                  editable={!isProcessing}
                />
              </View>

              <TouchableOpacity
                onPress={handleSendCode}
                disabled={sendDisabled}
                style={[s.btn, sendDisabled && { backgroundColor: colors.btnDisabled }]}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={s.btnText}>Send Code</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={s.dividerRow}>
              <View style={[s.dividerLine, { backgroundColor: colors.divider }]} />
              <Text style={{ marginHorizontal: 16, color: colors.textMuted, fontWeight: '500', fontSize: 14 }}>OR</Text>
              <View style={[s.dividerLine, { backgroundColor: colors.divider }]} />
            </View>

            {/* Google */}
            <TouchableOpacity style={[s.googleBtn, { borderColor: colors.inputBorder, backgroundColor: colors.surface }]}>
              <Ionicons name="logo-google" size={20} color="#ea4335" />
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', marginLeft: 8 }}>Sign up with Google</Text>
            </TouchableOpacity>

            {/* Help */}
            <View style={s.helpWrap}>
              <TouchableOpacity style={s.helpRow}>
                <View style={s.helpDot}><Ionicons name="mic" size={14} color="white" /></View>
                <Text style={{ color: colors.accent, fontWeight: '600', fontSize: 16, marginRight: 4 }}>Need help? tap to talk</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.accent} />
              </TouchableOpacity>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  backBtn: { padding: 8, marginLeft: -8 },
  mascot: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 34, fontWeight: '900', letterSpacing: -0.5, lineHeight: 40 },
  accentLine: { height: 4, width: 64, backgroundColor: '#f97316', borderRadius: 999, marginTop: 8, marginBottom: 12 },
  msg: { fontSize: 14, marginBottom: 16, fontWeight: '500' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, height: 56, marginBottom: 8 },
  countryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRightWidth: 1, height: '100%' },
  phoneInput: { flex: 1, paddingHorizontal: 16, fontSize: 16, fontWeight: '500', height: '100%' },
  btn: { height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c2410c' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1 },
  googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 12, borderWidth: 1, marginBottom: 32 },
  helpWrap: { alignItems: 'center', marginTop: 'auto', paddingBottom: 32 },
  helpRow: { flexDirection: 'row', alignItems: 'center' },
  helpDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
});
