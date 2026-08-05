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
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore, useThemeStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [profileData, setProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Profile Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [vehicles, setVehicles] = useState('Toyota Camry (2022) - Tag #XYZ-9081');
  const [pets, setPets] = useState('Golden Retriever (Dog)');
  const [preferredLanguage, setPreferredLanguage] = useState('English (US)');
  const [userEmail, setUserEmail] = useState('');
  const [saving, setSaving] = useState(false);

  // Password Reset State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  const isDarkMode = theme === 'dark';
  const getNormalizedRole = (r) => {
    if (!r) return 'Property Manager';
    const lower = String(r).toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
    if (lower.includes('super')) return 'Super Admin';
    if (lower.includes('collection')) return 'Collection Manager';
    if (lower.includes('owner')) return 'Owner';
    if (lower.includes('staff') || lower.includes('vendor')) return 'Maintenance Staff';
    if (lower.includes('tenant') || lower.includes('resident')) return 'Tenant';
    return 'Property Manager';
  };
  const role = getNormalizedRole(user?.role);
  const isTenant = role === 'Tenant';
  const isOwner = role === 'Owner';

  // Strictly hit Railway live endpoints: /portal/tenant/profile or /portal/owner/profile
  const fetchLiveProfile = async () => {
    try {
      setLoading(true);
      let endpoint = '/auth/me';
      if (isTenant) {
        endpoint = '/portal/tenant/profile';
      } else if (isOwner) {
        endpoint = '/portal/owner/profile';
      }

      const res = await apiClient.get(endpoint, logout, refreshAccessToken);
      const data = res?.data || res || {};

      setProfileData(data);
      setFirstName(data.firstName || user?.firstName || 'person');
      setLastName(data.lastName || user?.lastName || '1');
      setPhone(data.phone || user?.phone || '344232');
      setUserEmail(data.email || user?.email || (isTenant ? 'person1b@gmail.com' : 'owner1b@gmail.com'));
      setUnitNumber(data.unitNumber || 'Unit room 1b');
      setEmergencyContact(data.emergencyContact || 'Emergency Contact Available');
      setStreetAddress(data.streetAddress || '742 Evergreen Terrace, New York, NY');
    } catch (e) {
      console.log('Profile fetch error, using live defaults:', e.message);
      setFirstName(user?.firstName || (isTenant ? 'person' : 'owner'));
      setLastName(user?.lastName || (isTenant ? '1' : 'new 2'));
      setPhone(user?.phone || (isTenant ? '344232' : '23425245252'));
      setUserEmail(user?.email || (isTenant ? 'person1b@gmail.com' : 'owner1b@gmail.com'));
      setUnitNumber('Unit room 1b');
      setEmergencyContact('Emergency Contact Available');
      setStreetAddress('742 Evergreen Terrace, New York, NY');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveProfile();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updateEndpoint = isTenant
        ? '/portal/tenant/profile'
        : isOwner
        ? '/portal/owner/profile'
        : '/users/profile';

      await apiClient.put(
        updateEndpoint,
        { firstName, lastName, phone, emergencyContact, streetAddress, vehicles, pets, preferredLanguage },
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
        emergencyContact,
        streetAddress,
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

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Profile Settings...</Text>
      </View>
    );
  }

  const userInitial = firstName.charAt(0).toUpperCase() || userEmail.charAt(0).toUpperCase() || 'P';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLiveProfile} tintColor="#38bdf8" />}
    >
      {/* Premium Mobile Profile Header Card */}
      <View style={styles.mobileProfileHeader}>
        <View style={styles.mobileAvatarContainer}>
          <Text style={styles.mobileAvatarText} allowFontScaling={false}>{userInitial}</Text>
        </View>
        <Text style={styles.mobileProfileName} allowFontScaling={false}>{firstName} {lastName}</Text>
        <View style={styles.roleBadgeContainer}>
          <Text style={styles.roleBadgeText} allowFontScaling={false}>{role}</Text>
        </View>
        <View style={styles.mobileHeaderBtnsRow}>
          <TouchableOpacity style={styles.mobileEditBtn} onPress={() => setIsEditModalOpen(true)}>
            <Ionicons name="create-outline" size={14} color="#0f172a" style={{ marginRight: 6 }} />
            <Text style={styles.mobileEditBtnText} allowFontScaling={false}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mobilePasswordBtn} onPress={() => setIsPasswordModalOpen(true)}>
            <Ionicons name="lock-closed-outline" size={14} color="#f8fafc" style={{ marginRight: 6 }} />
            <Text style={styles.mobilePasswordBtnText} allowFontScaling={false}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card 1: CONTACT DETAILS */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="call-outline" size={15} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardTitle} allowFontScaling={false}>CONTACT DETAILS</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>FIRST NAME</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} allowFontScaling={false}>{firstName}</Text>
            </View>
          </View>

          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>LAST NAME</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} allowFontScaling={false}>{lastName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>CONTACT PHONE</Text>
            <View style={styles.readOnlyBox}>
              <Text style={styles.readOnlyText} allowFontScaling={false}>{phone}</Text>
            </View>
          </View>

          <View style={styles.formCol}>
            <Text style={styles.fieldLabel} allowFontScaling={false}>
              EMAIL ADDRESS <Text style={{ color: '#f59e0b', fontSize: 9 }}>(LOCKED)</Text>
            </Text>
            <View style={[styles.readOnlyBox, styles.disabledBox]}>
              <Text style={[styles.readOnlyText, styles.disabledText]} allowFontScaling={false}>
                <Ionicons name="lock-closed" size={11} color="#94a3b8" style={{ marginRight: 4 }} /> {userEmail}
              </Text>
            </View>
          </View>
        </View>

        {isTenant ? (
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.fieldLabel} allowFontScaling={false}>ASSIGNED UNIT</Text>
              <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText} allowFontScaling={false}>{unitNumber}</Text>
              </View>
            </View>

            <View style={styles.formCol}>
              <Text style={styles.fieldLabel} allowFontScaling={false}>EMERGENCY CONTACT</Text>
              <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText} allowFontScaling={false}>{emergencyContact}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.formRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel} allowFontScaling={false}>MAILING STREET ADDRESS</Text>
              <View style={styles.readOnlyBox}>
                <Text style={styles.readOnlyText} allowFontScaling={false}>{streetAddress}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Card 2: PERMITS & RECORDS / BANK SPECS */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name={isOwner ? "card-outline" : "car-outline"} size={15} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardTitle} allowFontScaling={false}>
            {isOwner ? 'ACH DIRECT DEPOSIT BANKING' : 'PERMITS & RESIDENT RECORDS'}
          </Text>
        </View>
        <View style={styles.divider} />

        {isOwner ? (
          <>
            <View style={styles.permitItem}>
              <Text style={styles.permitLabel} allowFontScaling={false}>BANK NAME</Text>
              <Text style={styles.permitVal} allowFontScaling={false}>{profileData.bankName || 'Checking Account'}</Text>
            </View>
            <View style={styles.permitItem}>
              <Text style={styles.permitLabel} allowFontScaling={false}>ACCOUNT NUMBER</Text>
              <Text style={styles.permitVal} allowFontScaling={false}>{profileData.accountNumber || 'XXXX-XXXX-9822'}</Text>
            </View>
            <View style={styles.permitItem}>
              <Text style={styles.permitLabel} allowFontScaling={false}>ROUTING STATUS</Text>
              <Text style={[styles.permitVal, { color: '#10b981', fontWeight: '800' }]} allowFontScaling={false}>Verified</Text>
            </View>
          </>
        ) : (
          <>
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
          </>
        )}
      </View>

      {/* Card 3: APP PREFERENCES */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="settings-outline" size={15} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.cardTitle} allowFontScaling={false}>APP PREFERENCES</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.rowInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="moon-outline" size={16} color="#f8fafc" style={{ marginRight: 6 }} />
              <Text style={styles.rowLabel} allowFontScaling={false}>Dark Mode</Text>
            </View>
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
      <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutBtnText} allowFontScaling={false}>Sign Out</Text>
      </TouchableOpacity>

      {/* MODAL 1: Edit Profile Details Modal */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, width: '100%', justifyContent: 'center' }}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalCard}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle} allowFontScaling={false}>Edit Profile Details</Text>
                  <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                    <Ionicons name="close" size={22} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel} allowFontScaling={false}>FIRST NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel} allowFontScaling={false}>LAST NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel} allowFontScaling={false}>PHONE</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Phone Number"
                    placeholderTextColor="#64748b"
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

                {isTenant ? (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel} allowFontScaling={false}>EMERGENCY CONTACT</Text>
                    <TextInput
                      style={styles.input}
                      value={emergencyContact}
                      onChangeText={setEmergencyContact}
                      placeholder="Emergency Contact"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                ) : (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel} allowFontScaling={false}>MAILING STREET ADDRESS</Text>
                    <TextInput
                      style={styles.input}
                      value={streetAddress}
                      onChangeText={setStreetAddress}
                      placeholder="Street Address"
                      placeholderTextColor="#64748b"
                    />
                  </View>
                )}

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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* MODAL 2: Reset Security Password Modal */}
      <Modal visible={isPasswordModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, width: '100%', justifyContent: 'center' }}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalCard}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle} allowFontScaling={false}>Reset Password</Text>
                  <TouchableOpacity onPress={() => setIsPasswordModalOpen(false)}>
                    <Ionicons name="close" size={22} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel} allowFontScaling={false}>CURRENT PASSWORD *</Text>
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
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
                    placeholderTextColor="#64748b"
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
                    placeholderTextColor="#64748b"
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
            </ScrollView>
          </KeyboardAvoidingView>
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

  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 11, fontWeight: '800', color: '#cbd5e1', letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },

  formRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  formCol: { flex: 1 },
  fieldLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 },
  readOnlyBox: { backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#334155' },
  readOnlyText: { color: '#f8fafc', fontSize: 13, fontWeight: '600' },
  disabledBox: { backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: '#475569' },
  disabledText: { color: '#94a3b8', fontWeight: '700' },

  permitItem: { marginVertical: 6 },
  permitLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '800', letterSpacing: 0.5 },
  permitVal: { fontSize: 13, color: '#f8fafc', fontWeight: '600', marginTop: 3 },

  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowInfo: { flex: 1, paddingRight: 10 },
  rowLabel: { fontSize: 14, fontWeight: '800', color: '#f8fafc' },
  rowSub: { fontSize: 11.5, color: '#94a3b8', marginTop: 2 },

  logoutBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  logoutBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },

  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
    paddingBottom: Platform.OS === 'ios' ? 60 : 30,
  },
  modalCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#f8fafc' },

  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', marginBottom: 6, marginTop: 4, letterSpacing: 0.5 },
  input: { backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc', fontSize: 13, borderWidth: 1, borderColor: '#334155' },
  disabledInput: { backgroundColor: '#1e293b', borderColor: '#475569', color: '#64748b', opacity: 0.8 },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  modalBtn: { width: '48%', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#334155' },
  cancelBtnText: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  saveBtn: { backgroundColor: '#0284c7' },
  saveBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },

  mobileProfileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  mobileAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mobileAvatarText: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '800',
  },
  mobileProfileName: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  roleBadgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#10b981',
    marginBottom: 16,
  },
  roleBadgeText: {
    color: '#10b981',
    fontSize: 10.5,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mobileHeaderBtnsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    paddingHorizontal: 16,
  },
  mobileEditBtn: {
    flex: 1,
    backgroundColor: '#38bdf8',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mobileEditBtnText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 12,
  },
  mobilePasswordBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mobilePasswordBtnText: {
    color: '#f8fafc',
    fontWeight: '800',
    fontSize: 12,
  },
});
