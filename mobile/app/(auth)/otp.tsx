import React, { useState, useEffect, useRef } from 'react';
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
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { getConfirmation, setConfirmation } from '../../src/utils/firebaseHelper';

const API_URL = 'https://prototp-backend.onrender.com/api';

export default function OTPScreen() {
  const router = useRouter();
  const { identifier, setToken, authProvider } = useAuthStore();
  const { colors, isDark } = useThemeStore();
  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [countdown, setCountdown] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);

  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (countdown > 0) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown((v) => v - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [countdown]);

  const triggerResendOtp = async () => {
    if (!identifier) return;
    setIsProcessing(true);
    setErrorMessage('');
 
    if(authProvider === 'firebase'){
      try{
        const confirmation = await auth().signInWithPhoneNumber(`+91${identifier}`);
        setConfirmation(confirmation);

        setCountdown(60);
        setIsResendActive(false);
      } catch(error: any){
        setErrorMessage(error.response?.data?.message || 'Firebase quota is completed for the day! Trying other servers...');
      } finally{
        setIsProcessing(false);
      }
    } else{
      // for authProvider == 'backend'
      try{
        await axios.post(`${API_URL}/auth/send-otp`, { phone: identifier });
        setCountdown(60);
        setIsResendActive(false);
      } catch(error: any){
        setErrorMessage(error.response?.data?.message || 'Failed to resend code');
      } finally{
        setIsProcessing(false);
      }
    }
  };

  const executeCodeVerification = async () => {
    if (verificationCode.length !== 6) {
      setErrorMessage('Verification code must be 6 digits');
      return;
    }
    setIsProcessing(true);
    setErrorMessage('');

    if(authProvider === 'firebase'){
      try{
        const confirmation = getConfirmation();
        await confirmation.confirm(verificationCode);
        const idToken = await auth().currentUser?.getIdToken();

        const response = await axios.post(`${API_URL}/auth/firebase-login`, { idToken });
        if(response.data.token) setToken(response.data.token);
      } catch(error: any){
        setErrorMessage(error.response?.data?.message || 'Invalid or expired code');
      } finally{
        setIsProcessing(false);
      }
    } else {
      // for authProvider == 'backend' 
      try{
        const response = await axios.post(`${API_URL}/auth/verify-otp`, {
          phone: identifier,
          otp: verificationCode,
        });
        if(response.data.token) setToken(response.data.token);
      } catch(error: any){
        setErrorMessage(error.response?.data?.message || 'Invalid or expired code');
      } finally{
        setIsProcessing(false);
      }
    }
  };

  const verifyDisabled = isProcessing || verificationCode.length !== 6;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.content}>
            {/* Header */}
            <View style={s.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                <Ionicons name="chevron-back" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={{ marginBottom: 32 }}>
              <Text style={[s.title, { color: colors.text }]}>Verify your number</Text>
              <Text style={{ fontSize: 16, color: colors.textSecondary }}>We've sent a 6-digit code to</Text>
              <View style={s.phoneRow}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>+91 {identifier || 'number'}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.accent, fontWeight: '600' }}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {errorMessage ? <Text style={{ color: colors.error, fontSize: 14, marginBottom: 16, fontWeight: '500' }}>{errorMessage}</Text> : null}

            {/* OTP Input */}
            <View style={{ marginBottom: 32 }}>
              <View style={[s.otpBox, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                <TextInput
                  style={[s.otpInput, { color: colors.text }]}
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChangeText={(text) => {
                    setErrorMessage('');
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setVerificationCode(numericValue);
                    if (numericValue.length === 6) Keyboard.dismiss();
                  }}
                  editable={!isProcessing}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                onPress={executeCodeVerification}
                disabled={verifyDisabled}
                style={[s.btn, verifyDisabled && { backgroundColor: colors.btnDisabled }]}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={s.btnText}>Verify Code</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Resend */}
            <View style={s.resendWrap}>
              <TouchableOpacity
                onPress={triggerResendOtp}
                disabled={!isResendActive || isProcessing}
                style={{ paddingVertical: 8, paddingHorizontal: 16 }}
              >
                <Text style={[s.resendText, { color: colors.textMuted }, isResendActive && !isProcessing && { color: colors.accent }]}>
                  {isResendActive
                    ? 'Resend Code'
                    : `Resend code in 00:${countdown < 10 ? `0${countdown}` : countdown}`}
                </Text>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  backBtn: { padding: 8, marginLeft: -8 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5, lineHeight: 36, marginBottom: 8 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  otpBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, height: 64, paddingHorizontal: 16, marginBottom: 24 },
  otpInput: { flex: 1, textAlign: 'center', fontSize: 30, letterSpacing: 16, fontWeight: '700', height: '100%' },
  btn: { height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c2410c' },
  btnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  resendWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  resendText: { textAlign: 'center', fontSize: 14, fontWeight: '700' },
});
