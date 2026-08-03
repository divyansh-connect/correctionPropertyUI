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
} from 'react-native';
import { useAuthStore } from '../store/useStore';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError('Invalid credentials or network issue. Please check backend connection.');
    }
  };

  const mockUsers = [
    { label: 'Super Admin', email: 'admin@apexpm.com' },
    { label: 'Property Manager', email: 'manager@apexpm.com' },
    { label: 'Owner', email: 'owner@apexpm.com' },
    { label: 'Tenant', email: 'tenant@apexpm.com' },
  ];

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Zentrol Property</Text>
            <Text style={styles.subtitle}>Enter details to log in to your portal</Text>
          </View>

          <View style={styles.card}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
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
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.mockSection}>
            <Text style={styles.mockSectionTitle}>Quick Demo Logins</Text>
            <View style={styles.grid}>
              {mockUsers.map((user) => (
                <TouchableOpacity
                  key={user.email}
                  style={styles.mockButton}
                  onPress={() => {
                    setEmail(user.email);
                    handleLogin(user.email);
                  }}
                >
                  <Text style={styles.mockLabel}>{user.label}</Text>
                  <Text style={styles.mockEmail}>{user.email}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'ios' ? 48 : 24, // Clear notch on all screens
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#38bdf8',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  errorText: {
    color: '#f43f5e',
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  mockSection: {
    marginTop: 36,
  },
  mockSectionTitle: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mockButton: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  mockLabel: {
    color: '#38bdf8',
    fontWeight: '700',
    fontSize: 13,
  },
  mockEmail: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
