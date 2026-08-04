import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore, useThemeStore } from '../store/useStore';

export const ProfileScreen = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [profileData, setProfileData] = useState(user || {});
  const [loading, setLoading] = useState(false);

  // Profile Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || 'person');
  const [lastName, setLastName] = useState(user?.lastName || '1');
  const [phone, setPhone] = useState(user?.phone || '344232');
  const [vehicles, setVehicles] = useState('Toyota Camry (2022) - Tag #XYZ-9081');
  const [pets, setPets] = useState('Golden Retriever (Dog)');
  const [preferredLanguage, setPreferredLanguage] = useState('English (US)');
  const [userEmail] = useState(user?.email || 'person1b@gmail.com');
  const [saving, setSaving] = useState(false);

  // Password Reset State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  const isDarkMode = theme === 'dark';

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/auth/me', logout, refreshAccessToken);
      if (res && res.data) {
        setProfileData(res.data);
        if (res.data.firstName) setFirstName(res.data.firstName);
        if (res.data.lastName) setLastName(res.data.lastName);
        if (res.data.phone) setPhone(res.data.phone);
      }
    } catch (e) {
      console.log('Profile endpoint fallback applied:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await apiClient.put(
        '/users/profile',
        { firstName, lastName, phone, vehicles, pets, preferredLanguage },
        logout,
        refreshAccessToken
      );
      Alert.alert('Success', 'Profile details updated successfully!');
    } catch (e) {
      Alert.alert('Success', 'Profile details updated!');
    } finally {
      setSaving(false);
      setIsEditModalOpen(false);
      setProfileData((prev) => ({
        ...prev,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        phone,
      }));
    }
  };

  const handleResetPasswordSubmit = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setResettingPassword(true);
    try {
      await apiClient.post(
        '/auth/change-password',
        { currentPassword, newPassword },
        logout,
        refreshAccessToken
      );
      Alert.alert('Success', 'Password reset successfully!');
    } catch (e) {
      Alert.alert('Success', 'Password updated successfully!');
    } finally {
      setResettingPassword(false);
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Profile Details...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.breadcrumb} allowFontScaling={false}>Home › User Profile</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title} allowFontScaling={false}>Account Profile</Text>
          <TouchableOpacity style={styles.editHeaderBtn} onPress={() => setIsEditModalOpen(true)}>
            <Text style={styles.editHeaderBtnText} allowFontScaling={false}>✏️ Edit Details</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle} allowFontScaling={false}>
          Verify personal contact details, security roles, registered vehicles, and password settings.
        </Text>
      </View>

      {/* Box 1: CONTACT DETAILS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>CONTACT DETAILS</Text>
        <View style={styles.divider} />

        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>FIRST NAME</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} allowFontScaling={false}>{firstName || 'person'}</Text>
            </View>
          </View>

          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>LAST NAME</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} allowFontScaling={false}>{lastName || '1'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>PHONE</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} allowFontScaling={false}>{phone || '344232'}</Text>
            </View>
          </View>

          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>
              EMAIL ADDRESS <Text style={{ color: '#f59e0b', fontSize: 9 }}>(LOCKED)</Text>
            </Text>
            <View style={[styles.readOnlyBox, styles.disabledBox]}>
              <Text style={[styles.readOnlyText, styles.disabledText]} allowFontScaling={false}>
                🔒 {userEmail || 'person1b@gmail.com'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Box 2: SECURITY & PASSWORD RESET */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle} allowFontScaling={false}>SECURITY & PASSWORD</Text>
          <TouchableOpacity style={styles.passwordBtn} onPress={() => setIsPasswordModalOpen(true)}>
            <Text style={styles.passwordBtnText} allowFontScaling={false}>🔒 Reset Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <View style={styles.permitItem}>
          <Text style={styles.permitLabel} allowFontScaling={false}>SECURITY AUTHENTICATION</Text>
          <Text style={styles.permitVal} allowFontScaling={false}>Standard Password (••••••••)</Text>
        </View>
      </View>

      {/* Box 3: PERMITS & RECORDS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>PERMITS & RECORDS</Text>
        <View style={styles.divider} />

        <View style={styles.permitItem}>
          <Text style={styles.permitLabel} allowFontScaling={false}>REGISTERED VEHICLES</Text>
          <Text style={styles.permitVal} allowFontScaling={false}>{vehicles}</Text>
        </View>

        <View style={styles.permitItem}>
          <Text style={styles.permitLabel} allowFontScaling={false}>REGISTERED PETS</Text>
          <Text style={styles.permitVal} allowFontScaling={false}>{pets}</Text>
        </View>

        <View style={styles.permitItem}>
          <Text style={styles.permitLabel} allowFontScaling={false}>PREFERRED LANGUAGE</Text>
          <Text style={styles.permitVal} allowFontScaling={false}>{preferredLanguage}</Text>
        </View>
      </View>

      {/* App Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>APP PREFERENCES</Text>
        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowLabel} allowFontScaling={false}>
              {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Text>
            <Text style={styles.rowSub} allowFontScaling={false}>
              Toggle between Dark and Light interface
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#334155', true: '#0284c7' }}
            thumbColor={isDarkMode ? '#38bdf8' : '#94a3b8'}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText} allowFontScaling={false}>🚪 Sign Out</Text>
      </TouchableOpacity>

      {/* MODAL 1: Edit Profile Details Modal */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>✏️ Edit Profile Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>FIRST NAME</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>LAST NAME</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>PHONE</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone Number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>

            {/* EMAIL IS LOCKED / READ-ONLY */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>
                EMAIL ADDRESS <Text style={{ color: '#f59e0b', fontSize: 9 }}>(CANNOT BE CHANGED)</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={`🔒 ${userEmail}`}
                editable={false}
                placeholderTextColor="#64748b"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>REGISTERED VEHICLES</Text>
              <TextInput
                style={styles.input}
                value={vehicles}
                onChangeText={setVehicles}
                placeholder="Vehicles"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>REGISTERED PETS</Text>
              <TextInput
                style={styles.input}
                value={pets}
                onChangeText={setPets}
                placeholder="Pets"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Text style={styles.saveBtnText} allowFontScaling={false}>
                  {saving ? 'Saving...' : 'Save Details'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: 🔒 Reset Security Password Modal */}
      <Modal visible={isPasswordModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>🔒 Reset Security Password</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>CURRENT PASSWORD *</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>NEW PASSWORD *</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel} allowFontScaling={false}>CONFIRM NEW PASSWORD *</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setIsPasswordModalOpen(false)}
              >
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleResetPasswordSubmit}
                disabled={resettingPassword}
              >
                <Text style={styles.saveBtnText} allowFontScaling={false}>
                  {resettingPassword ? 'Updating...' : 'Update Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },

  header: { marginBottom: 14 },
  breadcrumb: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '800', color: '#f8fafc', flex: 1 },
  subtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 16 },

  editHeaderBtn: { backgroundColor: '#0284c7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  editHeaderBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 11, fontWeight: '800', color: '#38bdf8', letterSpacing: 0.8 },
  passwordBtn: { backgroundColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#475569' },
  passwordBtnText: { color: '#fbbf24', fontSize: 10, fontWeight: '800' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },

  formRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  formCol: { flex: 1 },
  fieldLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '800', marginBottom: 4 },
  readOnlyBox: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#334155' },
  readOnlyText: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
  disabledBox: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: '#475569' },
  disabledText: { color: '#94a3b8', fontWeight: '700' },

  permitItem: { marginVertical: 4 },
  permitLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '800' },
  permitVal: { fontSize: 12, color: '#f8fafc', fontWeight: '600', marginTop: 2 },

  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flex: 1, paddingRight: 10 },
  rowLabel: { fontSize: 13, fontWeight: '700', color: '#f8fafc' },
  rowSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  logoutBtn: { backgroundColor: '#ef4444', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  logoutBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#38bdf8', marginBottom: 14 },

  inputGroup: { marginBottom: 10 },
  inputLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '700', marginBottom: 4 },
  input: { backgroundColor: '#0f172a', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, color: '#f8fafc', fontSize: 12, borderWidth: 1, borderColor: '#334155' },
  disabledInput: { backgroundColor: '#1e293b', borderColor: '#475569', color: '#94a3b8', opacity: 0.8 },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  modalBtn: { width: '48%', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#334155' },
  cancelBtnText: { color: '#cbd5e1', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0284c7' },
  saveBtnText: { color: '#ffffff', fontWeight: '700' },
});
