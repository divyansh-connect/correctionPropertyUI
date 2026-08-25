import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useAuthStore } from '../store/useStore';
import { useThemeColors } from '../theme';

export const LoginScreen = () => {
  const { colors, isDarkMode } = useThemeColors();
  const styles = getStyles(colors, isDarkMode);
  
  const [email, setEmail] = useState('manager@apexpm.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleLogin = async (selectedEmail) => {
    const targetEmail = selectedEmail || email;
    if (!targetEmail) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    const success = await login(targetEmail, password || 'admin123');
    setLoading(false);
    if (!success) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const mockUsers = [
    { label: 'Super Admin', email: 'admin@apexpm.com', icon: '👑' },
    { label: 'Manager', email: 'manager@apexpm.com', icon: '🏢' },
    { label: 'Tenant', email: 'tenant@apexpm.com', icon: '🔑' },
    { label: 'Owner', email: 'owner@apexpm.com', icon: '💼' },
    { label: 'Staff', email: 'staff@apexpm.com', icon: '🛠️' },
    { label: 'Collection', email: 'collection@apexpm.com', icon: '📊' },
  ];

  return (
    <ImageBackground
      source={require('../../assets/luxury_apartment_login_bg.png')}
      style={styles.bgImage}
      resizeMode="cover"
    >
      {/* Translucent Dark Overlay */}
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centerContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            {/* Centered App Header */}
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Image
                  source={require('../../assets/luxury_apartment_login_bg.png')}
                  style={styles.logoBadgeImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.brandTitle} allowFontScaling={false}>WhatsLandlord</Text>
              <Text style={styles.subtitle} allowFontScaling={false}>Management & Leasing Portal</Text>
            </View>

            {/* Centered Glassmorphism Login Card */}
            <View style={styles.card}>
              {error ? <Text style={styles.errorText} allowFontScaling={false}>{error}</Text> : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label} allowFontScaling={false}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="admin@apexpm.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label} allowFontScaling={false}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123456"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLogin()}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText} allowFontScaling={false}>Log In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Compact Side-by-Side Quick Demo Login Chips */}
            <View style={styles.mockSection}>
              <Text style={styles.mockSectionTitle} allowFontScaling={false}>⚡ QUICK DEMO LOGINS</Text>
              <View style={styles.sideBySideGrid}>
                {mockUsers.map((u) => (
                  <TouchableOpacity
                    key={u.email}
                    style={styles.compactChip}
                    onPress={() => {
                      setEmail(u.email);
                      setPassword('admin123');
                      handleLogin(u.email);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipIcon}>{u.icon}</Text>
                    <Text style={styles.chipLabel} allowFontScaling={false}>{u.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.45)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#38bdf8',
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  logoBadgeImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#38bdf8',
    marginTop: 2,
    fontWeight: '600',
  },
  card: {
    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.82)' : 'rgba(255, 255, 255, 0.92)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDarkMode ? 0.35 : 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  errorText: {
    color: '#f43f5e',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: isDarkMode ? '#cbd5e1' : '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
    borderWidth: 1,
    borderColor: isDarkMode ? '#334155' : '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: isDarkMode ? '#f8fafc' : '#0f172a',
    fontSize: 13.5,
  },
  button: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  mockSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  mockSectionTitle: {
    color: isDarkMode ? '#94a3b8' : '#64748b',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sideBySideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  compactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.85)' : '#ffffff',
    borderWidth: 1,
    borderColor: isDarkMode ? '#334155' : '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  chipIcon: {
    fontSize: 13,
  },
  chipLabel: {
    color: '#38bdf8',
    fontSize: 11.5,
    fontWeight: '700',
  },
});
