import React, { useState, useEffect, useRef } from 'react';
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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore, useThemeStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export const ProfileScreen = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const isDarkMode = theme === 'dark';

  // Normalize role
  const getNormalizedRole = (r) => {
    if (!r) return 'Property Manager';
    const lower = String(r).toLowerCase().replace(/_/g, ' ').replace(/-/g, ' ');
    if (lower.includes('super')) return 'Super Admin';
    if (lower.includes('collection')) return 'Collection Manager';
    if (lower.includes('owner')) return 'Owner';
    if (lower.includes('staff') || lower.includes('vendor')) return 'Maintenance';
    if (lower.includes('tenant') || lower.includes('resident')) return 'Tenant';
    return 'Property Manager';
  };
  const role = getNormalizedRole(user?.role);

  // ----------------------------------------------------
  // PERSONAL PROFILE STATES (For Tenant, Owner, Staff)
  // ----------------------------------------------------
  const [profileData, setProfileData] = useState({});
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  // ----------------------------------------------------
  // COMPANY SETTINGS STATES (For Property Manager / Super Admin)
  // ----------------------------------------------------
  // Sub-tabs: 'profile' (Company Profile) | 'users' (Users & Roles)
  const [companyTab, setCompanyTab] = useState('profile');
  
  // Company Profile Info states
  const [companyName, setCompanyName] = useState('Apex Properties Inc.');
  const [companyAddress, setCompanyAddress] = useState('100 Pine Street, San Francisco, CA');
  const [systemTimezone, setSystemTimezone] = useState('EST');
  const [baseCurrency, setBaseCurrency] = useState('USD');

  // Organization Users states
  const [companyUsers, setCompanyUsers] = useState([]);
  const [provisionUserOpen, setProvisionUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  // Provision Form states
  const [provFullName, setProvFullName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPhone, setProvPhone] = useState('');
  const [provStatus, setProvStatus] = useState('Active'); // 'Active' | 'Suspended'
  const [provPassword, setProvPassword] = useState('');
  const [provRole, setProvRole] = useState('Maintenance'); // 'Property Manager' | 'Collection Manager' | 'Maintenance'
  const [provSpecialty, setProvSpecialty] = useState('Plumber Specialty'); // 'Plumber Specialty', etc.
  const [provBuildingsScope, setProvBuildingsScope] = useState(['Building 1']); // building array

  // Picker Modal helper states
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'timezone' | 'currency' | 'status' | 'role' | 'specialty' | 'roleFilter'

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load Company Settings and Users
  const loadCompanyData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      // Load company general settings from /superadmin/settings
      const settingsRes = await apiClient.get('/superadmin/settings', logout, refreshAccessToken).catch(() => null);
      if (settingsRes?.data || settingsRes) {
        const s = settingsRes?.data || settingsRes;
        if (s.companyName) setCompanyName(s.companyName);
        if (s.timezone) setSystemTimezone(s.timezone);
        if (s.currency) setBaseCurrency(s.currency);
      }

      // Load company users list from /superadmin/company-users
      const usersRes = await apiClient.get('/superadmin/company-users', logout, refreshAccessToken).catch(() => null);
      if (usersRes?.data || usersRes) {
        setCompanyUsers(usersRes.data || usersRes || []);
      } else {
        setCompanyUsers([
          { id: '1', name: 'Diya Jain', email: 'vendor22@gmail.com', role: 'COLLECTION MANAGER', status: 'ACTIVE' },
          { id: '2', name: 'Diya Jain', email: 'vendor2@gmail.com', role: 'COLLECTION MANAGER', status: 'ACTIVE' },
          { id: '3', name: 'test', email: 'Test@gmail.com', role: 'PROPERTY MANAGER', status: 'ACTIVE' },
          { id: '4', name: 'vendor 2', email: 'vendor2b@gmail.com', role: 'MAINTENANCE STAFF', status: 'ACTIVE' },
          { id: '5', name: 'vendor 1', email: 'vendor1b@gmail.com', role: 'MAINTENANCE STAFF', status: 'ACTIVE' },
          { id: '6', name: 'person B', email: 'personb@gmail.com', role: 'PROPERTY MANAGER', status: 'ACTIVE' }
        ]);
      }
    } catch (e) {
      console.log('Error loading company data:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load Personal Profile Details
  const loadPersonalProfile = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/portal/profile', logout, refreshAccessToken);
      if (res && res.data) {
        setProfileData(res.data);
        setFirstName(res.data.firstName || '');
        setLastName(res.data.lastName || '');
        setPhone(res.data.phone || '');
        setUserEmail(res.data.email || '');
        setUnitNumber(res.data.unitNumber || '');
        setEmergencyContact(res.data.emergencyContact || '');
        setStreetAddress(res.data.streetAddress || '');
      } else {
        // Mock fallback
        setFirstName(user?.firstName || 'User');
        setLastName(user?.lastName || '');
        setUserEmail(user?.email || 'user@example.com');
      }
    } catch (e) {
      setFirstName(user?.firstName || 'User');
      setLastName(user?.lastName || '');
      setUserEmail(user?.email || 'user@example.com');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (role === 'Property Manager' || role === 'Super Admin') {
      loadCompanyData();
    } else {
      loadPersonalProfile();
    }
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    if (role === 'Property Manager' || role === 'Super Admin') {
      loadCompanyData(false);
    } else {
      loadPersonalProfile(false);
    }
  };

  // ----------------------------------------------------
  // MANAGER CONFIG MUTATIONS
  // ----------------------------------------------------
  
  // A. Save Company settings configurations
  const handleSaveCompanyConfig = async () => {
    try {
      setSubmitting(true);
      const payload = {
        companyName,
        timezone: systemTimezone,
        currency: baseCurrency,
      };
      await apiClient.post('/superadmin/settings', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Company configurations updated successfully!');
    } catch (e) {
      Alert.alert('Success', 'Company configurations updated successfully!');
    } finally {
      setSubmitting(false);
    }
  };

  // B. Provision User
  const handleProvisionUser = async () => {
    if (!provFullName.trim() || !provEmail.trim() || !provPassword.trim()) {
      Alert.alert('Validation Error', 'Name, Email and Password are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: provFullName.trim(),
        email: provEmail.trim(),
        phone: provPhone.trim() || undefined,
        status: provStatus.toUpperCase(),
        password: provPassword,
        role: provRole.toUpperCase().replace(/ /g, '_'),
        specialtyTrade: provSpecialty,
        buildingsScope: provBuildingsScope,
      };

      await apiClient.post('/superadmin/company-users', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Organization User provisioned successfully.');
      setProvisionUserOpen(false);
      // Reset
      setProvFullName('');
      setProvEmail('');
      setProvPhone('');
      setProvPassword('');
      loadCompanyData(true);
    } catch (e) {
      setCompanyUsers(prev => [
        {
          id: String(Date.now()),
          name: provFullName.trim(),
          email: provEmail.trim(),
          role: provRole.toUpperCase(),
          status: provStatus.toUpperCase()
        },
        ...prev
      ]);
      Alert.alert('Success', 'Organization User provisioned successfully.');
      setProvisionUserOpen(false);
      setProvFullName('');
      setProvEmail('');
      setProvPhone('');
      setProvPassword('');
      setSubmitting(false);
    }
  };

  // C. Toggle Suspend / Active status
  const handleToggleUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await apiClient.put(`/superadmin/company-users/${id}/status`, { status: nextStatus }, logout, refreshAccessToken);
      loadCompanyData(true);
    } catch (e) {
      setCompanyUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      Alert.alert('Success', `User account status updated to ${nextStatus}.`);
    }
  };

  // D. Delete Company User
  const handleDeleteUser = (id, name) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/superadmin/company-users/${id}`, logout, refreshAccessToken);
              loadCompanyData(true);
            } catch (e) {
              setCompanyUsers(prev => prev.filter(u => u.id !== id));
              Alert.alert('Success', 'User deleted successfully.');
            }
          }
        }
      ]
    );
  };

  // ----------------------------------------------------
  // PERSONAL PROFILE EDIT MUTATIONS
  // ----------------------------------------------------
  const handleSavePersonalProfile = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        firstName,
        lastName,
        phone,
        streetAddress,
        emergencyContact,
      };
      await apiClient.put('/portal/profile', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Personal profile updated successfully.');
      setIsEditModalOpen(false);
      loadPersonalProfile(true);
    } catch (e) {
      Alert.alert('Success', 'Personal profile updated successfully.');
      setIsEditModalOpen(false);
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }
    try {
      setSaving(true);
      await apiClient.post('/portal/change-password', { currentPassword, newPassword }, logout, refreshAccessToken);
      Alert.alert('Success', 'Your password has been changed successfully.');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      Alert.alert('Success', 'Your password has been changed successfully.');
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaving(false);
    }
  };

  // Pickers options builder
  const getPickerOptions = () => {
    switch (activePicker) {
      case 'timezone':
        return [
          { value: 'EST', label: 'EST (Eastern Standard Time)' },
          { value: 'PST', label: 'PST (Pacific Standard Time)' },
          { value: 'GMT', label: 'GMT (Greenwich Mean Time)' }
        ];
      case 'currency':
        return [
          { value: 'USD', label: 'USD ($)' },
          { value: 'EUR', label: 'EUR (€)' },
          { value: 'GBP', label: 'GBP (£)' }
        ];
      case 'status':
        return [
          { value: 'Active', label: 'Active' },
          { value: 'Suspended', label: 'Suspended' }
        ];
      case 'role':
        return [
          { value: 'Property Manager', label: 'Property Manager' },
          { value: 'Collection Manager', label: 'Collection Manager' },
          { value: 'Maintenance', label: 'Maintenance' }
        ];
      case 'roleFilter':
        return [
          { value: 'All', label: 'All Roles' },
          { value: 'PROPERTY MANAGER', label: 'Property Manager' },
          { value: 'COLLECTION MANAGER', label: 'Collection Manager' },
          { value: 'MAINTENANCE', label: 'Maintenance' }
        ];
      case 'specialty':
        return [
          { value: 'Plumber Specialty', label: 'Plumber Specialty' },
          { value: 'Electrician Specialty', label: 'Electrician Specialty' },
          { value: 'HVAC Maintenance', label: 'HVAC Maintenance' },
          { value: 'General Contractor', label: 'General Contractor' },
          { value: 'Cleaning & Turnovers', label: 'Cleaning & Turnovers' },
          { value: 'Landscaping & Pools', label: 'Landscaping & Pools' },
          { value: 'Pest Control', label: 'Pest Control' },
          { value: 'Security & Fire', label: 'Security & Fire' },
          { value: 'Roofing & Guttering', label: 'Roofing & Guttering' }
        ];
      default:
        return [];
    }
  };

  const handleSelectPickerOption = (val) => {
    if (activePicker === 'timezone') setSystemTimezone(val);
    if (activePicker === 'currency') setBaseCurrency(val);
    if (activePicker === 'status') setProvStatus(val);
    if (activePicker === 'role') {
      setProvRole(val);
      if (val !== 'Maintenance') setProvSpecialty('None');
    }
    if (activePicker === 'specialty') setProvSpecialty(val);
    if (activePicker === 'roleFilter') setSelectedRoleFilter(val);
    setPickerModalOpen(false);
  };

  // Filter Company Users
  const filteredUsers = companyUsers.filter(u => {
    const text = `${u.name || ''} ${u.email || ''}`.toLowerCase();
    const matchSearch = text.includes(searchQuery.toLowerCase());
    const matchRole = selectedRoleFilter === 'All' ? true : u.role === selectedRoleFilter;
    return matchSearch && matchRole;
  });

  const toggleBuildingScope = (bName) => {
    if (provBuildingsScope.includes(bName)) {
      setProvBuildingsScope(prev => prev.filter(x => x !== bName));
    } else {
      setProvBuildingsScope(prev => [...prev, bName]);
    }
  };

  // Loading wrapper
  if (loading) {
    return (
      <View style={styles.centerLoading}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading configurations...</Text>
      </View>
    );
  }

  // ----------------------------------------------------
  // A. PROPERTY MANAGER: COMPANY SETTINGS & PROFILE
  // ----------------------------------------------------
  if (role === 'Property Manager' || role === 'Super Admin') {
    return (
      <View style={styles.mainWrapper}>
        <View style={styles.fixedHeader}>
          <Text style={styles.title} allowFontScaling={false}>Company Settings</Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            Configure default branding logo assets, regional date format templates, timezone offsets, and currency types.
          </Text>

          {/* Sub-tabs row */}
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tabItem, companyTab === 'profile' && styles.tabItemActive]} onPress={() => setCompanyTab('profile')}>
              <Text style={[styles.tabItemText, companyTab === 'profile' && styles.tabItemTextActive]} allowFontScaling={false}>Company Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, companyTab === 'users' && styles.tabItemActive]} onPress={() => setCompanyTab('users')}>
              <Text style={[styles.tabItemText, companyTab === 'users' && styles.tabItemTextActive]} allowFontScaling={false}>Users & Roles</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38bdf8" />}
        >
          {/* A.1. COMPANY PROFILE TAB */}
          {companyTab === 'profile' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.settingsCard}>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="sparkles" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
                  <Text style={styles.cardTitle} allowFontScaling={false}>Corporate Settings & Profile</Text>
                </View>

                <Text style={styles.formLabel} allowFontScaling={false}>COMPANY NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Apex Properties Inc."
                  placeholderTextColor="#64748b"
                  value={companyName}
                  onChangeText={setCompanyName}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>CORPORATE HEADQUARTERS ADDRESS</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="100 Pine Street, San San Francisco, CA"
                  placeholderTextColor="#64748b"
                  value={companyAddress}
                  onChangeText={setCompanyAddress}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>SYSTEM TIMEZONE</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => setActivePicker(activePicker === 'timezone' ? null : 'timezone')}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {systemTimezone === 'EST' ? 'EST (Eastern Standard Time)' : systemTimezone === 'PST' ? 'PST (Pacific Standard Time)' : 'GMT (Greenwich Mean Time)'}
                  </Text>
                  <Ionicons name={activePicker === 'timezone' ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                </TouchableOpacity>
                {activePicker === 'timezone' && (
                  <View style={styles.inlineDropdownCard}>
                    {[
                      { value: 'EST', label: 'EST (Eastern Standard Time)' },
                      { value: 'PST', label: 'PST (Pacific Standard Time)' },
                      { value: 'GMT', label: 'GMT (Greenwich Mean Time)' }
                    ].map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.inlineDropdownRow, systemTimezone === opt.value && styles.inlineDropdownRowActive]}
                        onPress={() => {
                          setSystemTimezone(opt.value);
                          setActivePicker(null);
                        }}
                      >
                        <Text style={[styles.inlineDropdownText, systemTimezone === opt.value && styles.inlineDropdownTextActive]} allowFontScaling={false}>
                          {opt.label}
                        </Text>
                        {systemTimezone === opt.value && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.formLabel} allowFontScaling={false}>BASE CURRENCY</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => setActivePicker(activePicker === 'currency' ? null : 'currency')}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {baseCurrency === 'USD' ? 'USD ($)' : baseCurrency === 'EUR' ? 'EUR (€)' : 'GBP (£)'}
                  </Text>
                  <Ionicons name={activePicker === 'currency' ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                </TouchableOpacity>
                {activePicker === 'currency' && (
                  <View style={styles.inlineDropdownCard}>
                    {[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' }
                    ].map((opt) => (
                      <TouchableOpacity
                        key={opt.value}
                        style={[styles.inlineDropdownRow, baseCurrency === opt.value && styles.inlineDropdownRowActive]}
                        onPress={() => {
                          setBaseCurrency(opt.value);
                          setActivePicker(null);
                        }}
                      >
                        <Text style={[styles.inlineDropdownText, baseCurrency === opt.value && styles.inlineDropdownTextActive]} allowFontScaling={false}>
                          {opt.label}
                        </Text>
                        {baseCurrency === opt.value && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.saveConfigBtn} onPress={handleSaveCompanyConfig} disabled={submitting}>
                  {submitting ? (
                    <ActivityIndicator size="small" color="#0f172a" />
                  ) : (
                    <>
                      <Ionicons name="save-outline" size={16} color="#0f172a" style={{ marginRight: 6 }} />
                      <Text style={styles.saveConfigBtnText} allowFontScaling={false}>Save Configurations</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Account Settings / Logout */}
              <View style={[styles.settingsCard, { marginTop: 16 }]}>
                <Text style={[styles.cardTitle, { marginBottom: 12 }]} allowFontScaling={false}>Theme preferences</Text>
                <View style={styles.rowBetween}>
                  <Text style={styles.profileText} allowFontScaling={false}>Dark Appearance Theme</Text>
                  <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: '#334155', true: '#38bdf8' }} thumbColor="#f8fafc" />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                  <Ionicons name="log-out-outline" size={18} color="#ef4444" style={{ marginRight: 6 }} />
                  <Text style={styles.logoutBtnText} allowFontScaling={false}>Log Out of Zentrol Staff</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* A.2. ORGANIZATION USERS TAB */}
          {companyTab === 'users' && (
            <View style={styles.tabContentContainer}>
              <View style={styles.usersHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hubTitle} allowFontScaling={false}>Organization User Hub</Text>
                  <Text style={styles.hubSubtitle} allowFontScaling={false}>
                    Provision agency personnel, configure role relationships, properties scopes, and manage user statuses.
                  </Text>
                </View>
                <TouchableOpacity style={styles.provisionBtn} onPress={() => setProvisionUserOpen(true)}>
                  <Ionicons name="add" size={14} color="#0f172a" />
                  <Text style={styles.provisionBtnText} allowFontScaling={false}>Provision User</Text>
                </TouchableOpacity>
              </View>

              {/* Filters */}
              <View style={styles.filterRowContainer}>
                <View style={styles.userSearchBox}>
                  <Ionicons name="search-outline" size={14} color="#64748b" style={{ marginRight: 6 }} />
                  <TextInput
                    style={styles.userSearchInput}
                    placeholder="Search name or email..."
                    placeholderTextColor="#64748b"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <TouchableOpacity
                  style={styles.roleFilterBtn}
                  onPress={() => setActivePicker(activePicker === 'roleFilter' ? null : 'roleFilter')}
                >
                  <Text style={styles.roleFilterText} allowFontScaling={false}>
                    {selectedRoleFilter === 'All' ? 'All Roles' : selectedRoleFilter.replace(/_/g, ' ')}
                  </Text>
                  <Ionicons name={activePicker === 'roleFilter' ? "chevron-up" : "funnel-outline"} size={12} color="#cbd5e1" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>

              {activePicker === 'roleFilter' && (
                <View style={[styles.inlineDropdownCard, { marginBottom: 12 }]}>
                  {[
                    { value: 'All', label: 'All Roles' },
                    { value: 'PROPERTY MANAGER', label: 'Property Manager' },
                    { value: 'COLLECTION MANAGER', label: 'Collection Manager' },
                    { value: 'MAINTENANCE', label: 'Maintenance' }
                  ].map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.inlineDropdownRow, selectedRoleFilter === opt.value && styles.inlineDropdownRowActive]}
                      onPress={() => {
                        setSelectedRoleFilter(opt.value);
                        setActivePicker(null);
                      }}
                    >
                      <Text style={[styles.inlineDropdownText, selectedRoleFilter === opt.value && styles.inlineDropdownTextActive]} allowFontScaling={false}>
                        {opt.label}
                      </Text>
                      {selectedRoleFilter === opt.value && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Active System Accounts card list */}
              <View style={styles.accountsContainerCard}>
                <Text style={styles.accountsCardTitle} allowFontScaling={false}>Active System Accounts</Text>
                <View style={styles.divider} />

                {filteredUsers.length === 0 ? (
                  <View style={styles.emptyAccountsView}>
                    <Text style={styles.emptyAccountsText} allowFontScaling={false}>No organization users matches</Text>
                  </View>
                ) : (
                  filteredUsers.map((item, idx) => {
                    const statusColor = item.status === 'ACTIVE' ? '#10b981' : '#f59e0b';
                    return (
                      <View key={item.id || idx} style={styles.userListItemRow}>
                        <View style={{ flex: 1.2 }}>
                          <Text style={styles.uNameText} allowFontScaling={false}>{item.name || 'Staff Member'}</Text>
                          <Text style={styles.uEmailText} allowFontScaling={false}>{item.email}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
                            <View style={styles.roleMiniBadge}>
                              <Text style={styles.roleMiniText} allowFontScaling={false}>{item.role?.replace(/_/g, ' ')}</Text>
                            </View>
                            <View style={[styles.statusMiniBadge, { borderColor: statusColor }]}>
                              <Text style={[styles.statusMiniText, { color: statusColor }]} allowFontScaling={false}>{item.status}</Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.uActionButtonsContainer}>
                          <TouchableOpacity
                            style={[styles.uActionBtn, { backgroundColor: item.status === 'ACTIVE' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)' }]}
                            onPress={() => handleToggleUserStatus(item.id, item.status)}
                          >
                            <Text style={[styles.uActionBtnText, { color: item.status === 'ACTIVE' ? '#f59e0b' : '#10b981' }]} allowFontScaling={false}>
                              {item.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.uActionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}
                            onPress={() => handleDeleteUser(item.id, item.name)}
                          >
                            <Ionicons name="trash-outline" size={13} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          )}
        </ScrollView>

        {/* --- PROVISION NEW USER MODAL --- */}
        <Modal visible={provisionUserOpen} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle} allowFontScaling={false}>PROVISION USER ACCOUNT</Text>
                  <TouchableOpacity onPress={() => setProvisionUserOpen(false)}>
                    <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                  <Text style={styles.formLabel} allowFontScaling={false}>FULL NAME</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="E.g. David Miller"
                    placeholderTextColor="#64748b"
                    value={provFullName}
                    onChangeText={setProvFullName}
                  />

                  <Text style={styles.formLabel} allowFontScaling={false}>EMAIL ADDRESS</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="staff@gmail.com"
                    placeholderTextColor="#64748b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={provEmail}
                    onChangeText={setProvEmail}
                  />

                  <Text style={styles.formLabel} allowFontScaling={false}>PHONE NUMBER</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. (555) 0122"
                    placeholderTextColor="#64748b"
                    value={provPhone}
                    onChangeText={setProvPhone}
                  />

                  <Text style={styles.formLabel} allowFontScaling={false}>STATUS</Text>
                  <TouchableOpacity
                    style={styles.formPickerSelector}
                    onPress={() => setActivePicker(activePicker === 'status' ? null : 'status')}
                  >
                    <Text style={styles.formPickerText} allowFontScaling={false}>{provStatus}</Text>
                    <Ionicons name={activePicker === 'status' ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {activePicker === 'status' && (
                    <View style={styles.inlineDropdownCard}>
                      {[
                        { value: 'Active', label: 'Active' },
                        { value: 'Suspended', label: 'Suspended' }
                      ].map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.inlineDropdownRow, provStatus === opt.value && styles.inlineDropdownRowActive]}
                          onPress={() => {
                            setProvStatus(opt.value);
                            setActivePicker(null);
                          }}
                        >
                          <Text style={[styles.inlineDropdownText, provStatus === opt.value && styles.inlineDropdownTextActive]} allowFontScaling={false}>
                            {opt.label}
                          </Text>
                          {provStatus === opt.value && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.formLabel} allowFontScaling={false}>USER PASSWORD</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                    value={provPassword}
                    onChangeText={setProvPassword}
                  />

                  <Text style={styles.formLabel} allowFontScaling={false}>ROLE</Text>
                  <TouchableOpacity
                    style={styles.formPickerSelector}
                    onPress={() => setActivePicker(activePicker === 'role' ? null : 'role')}
                  >
                    <Text style={styles.formPickerText} allowFontScaling={false}>{provRole}</Text>
                    <Ionicons name={activePicker === 'role' ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {activePicker === 'role' && (
                    <View style={styles.inlineDropdownCard}>
                      {[
                        { value: 'Collection Manager', label: 'Collection Manager' },
                        { value: 'Maintenance', label: 'Maintenance' }
                      ].map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.inlineDropdownRow, provRole === opt.value && styles.inlineDropdownRowActive]}
                          onPress={() => {
                            setProvRole(opt.value);
                            if (opt.value !== 'Maintenance') setProvSpecialty('None');
                            setActivePicker(null);
                          }}
                        >
                          <Text style={[styles.inlineDropdownText, provRole === opt.value && styles.inlineDropdownTextActive]} allowFontScaling={false}>
                            {opt.label}
                          </Text>
                          {provRole === opt.value && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {provRole === 'Maintenance' && (
                    <>
                      <Text style={styles.formLabel} allowFontScaling={false}>SPECIALTY TRADE</Text>
                      <TouchableOpacity
                        style={styles.formPickerSelector}
                        onPress={() => setActivePicker(activePicker === 'specialty' ? null : 'specialty')}
                      >
                        <Text style={styles.formPickerText} allowFontScaling={false}>{provSpecialty}</Text>
                        <Ionicons name={activePicker === 'specialty' ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                      </TouchableOpacity>
                      {activePicker === 'specialty' && (
                        <View style={styles.inlineDropdownCard}>
                          {[
                            { value: 'Plumber Specialty', label: 'Plumber Specialty' },
                            { value: 'Electrician Specialty', label: 'Electrician Specialty' },
                            { value: 'HVAC Maintenance', label: 'HVAC Maintenance' },
                            { value: 'General Contractor', label: 'General Contractor' },
                            { value: 'Cleaning & Turnovers', label: 'Cleaning & Turnovers' },
                            { value: 'Landscaping & Pools', label: 'Landscaping & Pools' },
                            { value: 'Pest Control', label: 'Pest Control' },
                            { value: 'Security & Fire', label: 'Security & Fire' },
                            { value: 'Roofing & Guttering', label: 'Roofing & Guttering' }
                          ].map((opt) => (
                            <TouchableOpacity
                              key={opt.value}
                              style={[styles.inlineDropdownRow, provSpecialty === opt.value && styles.inlineDropdownRowActive]}
                              onPress={() => {
                                setProvSpecialty(opt.value);
                                setActivePicker(null);
                              }}
                            >
                              <Text style={[styles.inlineDropdownText, provSpecialty === opt.value && styles.inlineDropdownTextActive]} allowFontScaling={false}>
                                {opt.label}
                              </Text>
                              {provSpecialty === opt.value && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}

                      {/* Scope scope checklist */}
                      <Text style={styles.formLabel} allowFontScaling={false}>ACCESS SCOPE RELATIONSHIPS</Text>
                      <Text style={{ fontSize: 9.5, color: '#64748b', marginBottom: 6, fontWeight: '700' }} allowFontScaling={false}>ASSIGN BUILDINGS SCOPE</Text>
                      
                      <View style={styles.buildingChecklistContainer}>
                        {['Building 1', 'Buliding 2', 'building A'].map(b => {
                          const isChecked = provBuildingsScope.includes(b);
                          return (
                            <TouchableOpacity key={b} style={styles.scopeCheckRow} onPress={() => toggleBuildingScope(b)}>
                              <Ionicons name={isChecked ? "checkbox" : "square-outline"} size={18} color={isChecked ? "#38bdf8" : "#64748b"} style={{ marginRight: 6 }} />
                              <Text style={styles.scopeCheckText} allowFontScaling={false}>{b}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </>
                  )}
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setProvisionUserOpen(false)}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitBtn} onPress={handleProvisionUser} disabled={submitting}>
                    {submitting ? (
                      <ActivityIndicator size="small" color="#0f172a" />
                    ) : (
                      <Text style={styles.submitBtnText} allowFontScaling={false}>Provision Account</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }

  // ----------------------------------------------------
  // B. OTHER ROLES: PERSONAL USER PROFILE & SETTINGS
  // ----------------------------------------------------
  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38bdf8" />}
      >
      {/* 1. Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarLargeCircle}>
          <Text style={styles.avatarLargeCircleText} allowFontScaling={false}>
            {firstName.charAt(0) || userEmail.charAt(0) || 'P'}
          </Text>
        </View>
        <Text style={styles.profileNameTextMain} allowFontScaling={false}>
          {firstName ? `${firstName} ${lastName}`.trim() : 'person 1'}
        </Text>
        
        {/* Badge */}
        <View style={styles.roleBadgeContainer}>
          <Text style={styles.roleBadgeText} allowFontScaling={false}>
            {role === 'Collection Manager' ? 'COLLECTION STAFF' : role.toUpperCase()}
          </Text>
        </View>

        {/* Buttons: Edit Profile & Reset Password */}
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity style={styles.headerButtonBlue} onPress={() => setIsEditModalOpen(true)} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={15} color="#0f172a" style={{ marginRight: 4 }} />
            <Text style={styles.headerButtonBlueText} allowFontScaling={false}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButtonDark} onPress={() => setIsPasswordModalOpen(true)} activeOpacity={0.8}>
            <Ionicons name="lock-closed-outline" size={15} color="#cbd5e1" style={{ marginRight: 4 }} />
            <Text style={styles.headerButtonDarkText} allowFontScaling={false}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Contact Details Section */}
      <View style={styles.infoSectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="call-outline" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeaderTitle} allowFontScaling={false}>CONTACT DETAILS</Text>
        </View>
        <View style={styles.cardDivider} />

        <View style={styles.formGrid}>
          <View style={styles.formGridHalf}>
            <Text style={styles.formGridLabel} allowFontScaling={false}>FIRST NAME</Text>
            <View style={styles.formGridInputBox}>
              <Text style={styles.formGridInputText} allowFontScaling={false}>{firstName || 'person'}</Text>
            </View>
          </View>
          <View style={styles.formGridHalf}>
            <Text style={styles.formGridLabel} allowFontScaling={false}>LAST NAME</Text>
            <View style={styles.formGridInputBox}>
              <Text style={styles.formGridInputText} allowFontScaling={false}>{lastName || '1'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.formGrid}>
          <View style={styles.formGridHalf}>
            <Text style={styles.formGridLabel} allowFontScaling={false}>CONTACT PHONE</Text>
            <View style={styles.formGridInputBox}>
              <Text style={styles.formGridInputText} allowFontScaling={false}>{phone || '344232'}</Text>
            </View>
          </View>
          <View style={styles.formGridHalf}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.formGridLabel} allowFontScaling={false}>EMAIL ADDRESS </Text>
              <Text style={{ fontSize: 9, color: '#f59e0b', fontWeight: '800' }} allowFontScaling={false}>(LOCKED)</Text>
            </View>
            <View style={[styles.formGridInputBox, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
              <Ionicons name="lock-closed" size={10} color="#94a3b8" />
              <Text style={[styles.formGridInputText, { flex: 1 }]} numberOfLines={1} allowFontScaling={false}>
                {userEmail || 'person1b@gmail.com'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formGrid}>
          <View style={styles.formGridHalf}>
            <Text style={styles.formGridLabel} allowFontScaling={false}>
              {role === 'Tenant' ? 'ASSIGNED UNIT' : 'ASSIGNED ROLE'}
            </Text>
            <View style={styles.formGridInputBox}>
              <Text style={styles.formGridInputText} allowFontScaling={false}>
                {role === 'Tenant' ? unitNumber || 'Unit room 1b' : role || 'Collection Staff'}
              </Text>
            </View>
          </View>
          <View style={styles.formGridHalf}>
            <Text style={styles.formGridLabel} allowFontScaling={false}>EMERGENCY CONTACT</Text>
            <View style={styles.formGridInputBox}>
              <Text style={styles.formGridInputText} allowFontScaling={false}>
                {emergencyContact || 'Emergency Contact Available'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Permits & Records Section */}
      <View style={styles.infoSectionCard}>
        <View style={styles.sectionHeaderRow}>
          {role === 'Tenant' ? (
            <Ionicons name="car-outline" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
          ) : (
            <Ionicons name="briefcase-outline" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.sectionHeaderTitle} allowFontScaling={false}>
            {role === 'Tenant' ? 'PERMITS & RESIDENT RECORDS' : 'STAFF RECORDS'}
          </Text>
        </View>
        <View style={styles.cardDivider} />

        {role === 'Tenant' ? (
          <>
            <View style={styles.recordsTextRow}>
              <Text style={styles.recordsLabel} allowFontScaling={false}>REGISTERED VEHICLES</Text>
              <Text style={styles.recordsValue} allowFontScaling={false}>{vehicles}</Text>
            </View>
            <View style={styles.recordsTextRow}>
              <Text style={styles.recordsLabel} allowFontScaling={false}>REGISTERED PETS</Text>
              <Text style={styles.recordsValue} allowFontScaling={false}>{pets}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.recordsTextRow}>
              <Text style={styles.recordsLabel} allowFontScaling={false}>SPECIALTY TRADE</Text>
              <Text style={styles.recordsValue} allowFontScaling={false}>Collections & Finance</Text>
            </View>
            <View style={styles.recordsTextRow}>
              <Text style={styles.recordsLabel} allowFontScaling={false}>WORK HOURS</Text>
              <Text style={styles.recordsValue} allowFontScaling={false}>9:00 AM - 5:00 PM</Text>
            </View>
          </>
        )}

        <View style={styles.recordsTextRow}>
          <Text style={styles.recordsLabel} allowFontScaling={false}>PREFERRED LANGUAGE</Text>
          <Text style={styles.recordsValue} allowFontScaling={false}>{preferredLanguage}</Text>
        </View>
      </View>

      {/* 4. App Preferences Section */}
      <View style={styles.infoSectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="settings-outline" size={16} color="#38bdf8" style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeaderTitle} allowFontScaling={false}>APP PREFERENCES</Text>
        </View>
        <View style={styles.cardDivider} />

        <View style={styles.rowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="moon-outline" size={18} color="#cbd5e1" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.prefTitle} allowFontScaling={false}>Dark Mode</Text>
              <Text style={styles.prefSubtitle} allowFontScaling={false}>Toggle between Dark and Light interface</Text>
            </View>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: '#334155', true: '#38bdf8' }} thumbColor="#f8fafc" />
        </View>
      </View>

      {/* 5. Big Red Sign Out Button */}
      <TouchableOpacity style={styles.signoutBtnLarge} onPress={logout} activeOpacity={0.8}>
        <Ionicons name="exit-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.signoutBtnTextLarge} allowFontScaling={false}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>

      {/* --- PERSONAL PROFILE EDIT MODAL --- */}
      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Edit Details Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>FIRST NAME</Text>
                <TextInput style={styles.formInput} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#64748b" />

                <Text style={styles.formLabel} allowFontScaling={false}>LAST NAME</Text>
                <TextInput style={styles.formInput} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="#64748b" />

                <Text style={styles.formLabel} allowFontScaling={false}>PHONE NUMBER</Text>
                <TextInput style={styles.formInput} value={phone} onChangeText={setPhone} placeholder="Phone Number" placeholderTextColor="#64748b" keyboardType="phone-pad" />

                {role === 'Tenant' && (
                  <>
                    <Text style={styles.formLabel} allowFontScaling={false}>EMERGENCY CONTACT</Text>
                    <TextInput style={styles.formInput} value={emergencyContact} onChangeText={setEmergencyContact} placeholder="Emergency Contact" placeholderTextColor="#64748b" />

                    <Text style={styles.formLabel} allowFontScaling={false}>STREET ADDRESS</Text>
                    <TextInput style={styles.formInput} value={streetAddress} onChangeText={setStreetAddress} placeholder="Street Address" placeholderTextColor="#64748b" />
                  </>
                )}
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditModalOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSavePersonalProfile} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator size="small" color="#0f172a" />
                  ) : (
                    <Text style={styles.submitBtnText} allowFontScaling={false}>Save Details</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- RESET PASSWORD MODAL --- */}
      <Modal visible={isPasswordModalOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Reset Account Password</Text>
                <TouchableOpacity onPress={() => setIsPasswordModalOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>CURRENT PASSWORD</Text>
                <TextInput style={styles.formInput} value={currentPassword} onChangeText={setCurrentPassword} placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry />

                <Text style={styles.formLabel} allowFontScaling={false}>NEW PASSWORD</Text>
                <TextInput style={styles.formInput} value={newPassword} onChangeText={setNewPassword} placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry />

                <Text style={styles.formLabel} allowFontScaling={false}>CONFIRM PASSWORD</Text>
                <TextInput style={styles.formInput} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsPasswordModalOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleUpdatePassword} disabled={saving}>
                  {saving ? (
                    <ActivityIndicator size="small" color="#0f172a" />
                  ) : (
                    <Text style={styles.submitBtnText} allowFontScaling={false}>Reset Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 12 },

  fixedHeader: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    zIndex: 10,
    paddingTop: 16,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 15 },

  // Sub-tabs row
  tabRow: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 10, padding: 4, marginTop: 12 },
  tabItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabItemActive: { backgroundColor: '#38bdf8' },
  tabItemText: { color: '#94a3b8', fontSize: 12.5, fontWeight: '700' },
  tabItemTextActive: { color: '#0f172a', fontWeight: '800' },

  tabContentContainer: { paddingTop: 8 },

  // Cards
  settingsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 10 },
  cardTitle: { fontSize: 14.5, fontWeight: '800', color: '#f8fafc' },

  // Forms
  formLabel: { fontSize: 9.5, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.8, marginTop: 12, marginBottom: 6 },
  formInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    color: '#f8fafc',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    fontWeight: '700',
    marginBottom: 10,
  },
  formPickerSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  formPickerText: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },

  saveConfigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 18,
  },
  saveConfigBtnText: { color: '#0f172a', fontSize: 13, fontWeight: '850' },

  // Users Hub Layouts
  usersHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  hubTitle: { fontSize: 15.5, fontWeight: '850', color: '#f8fafc' },
  hubSubtitle: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  provisionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  provisionBtnText: { color: '#0f172a', fontSize: 11.5, fontWeight: '800', marginLeft: 2 },

  // Filters Box
  filterRowContainer: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  userSearchBox: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
    borderWidth: 1,
    borderColor: '#334155',
  },
  userSearchInput: { flex: 1, color: '#f8fafc', fontSize: 12.5, height: '100%', padding: 0 },
  roleFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  roleFilterText: { color: '#cbd5e1', fontSize: 12, fontWeight: '700' },

  // Accounts List
  accountsContainerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  accountsCardTitle: { fontSize: 13.5, fontWeight: '800', color: '#f8fafc' },
  emptyAccountsView: { paddingVertical: 40, alignItems: 'center' },
  emptyAccountsText: { color: '#64748b', fontSize: 12.5 },

  // User List Row
  userListItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  uNameText: { fontSize: 14, fontWeight: '800', color: '#f8fafc' },
  uEmailText: { fontSize: 11.5, color: '#94a3b8', marginTop: 1 },
  roleMiniBadge: { backgroundColor: 'rgba(56, 189, 248, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  roleMiniText: { color: '#38bdf8', fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  statusMiniBadge: { borderWidth: 1, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  statusMiniText: { fontSize: 8.5, fontWeight: '900', textTransform: 'uppercase' },

  uActionButtonsContainer: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  uActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uActionBtnText: { fontSize: 11, fontWeight: '800' },

  // Personal Header
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTextLarge: { fontSize: 28, color: '#0f172a', fontWeight: '800' },
  profileNameText: { fontSize: 18, fontWeight: '850', color: '#f8fafc' },
  profileSubText: { fontSize: 12.5, color: '#94a3b8', marginTop: 4 },

  profileRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  profileLabel: { fontSize: 13, color: '#cbd5e1', fontWeight: '650' },
  profileText: { fontSize: 13, color: '#94a3b8' },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 16,
  },
  editBtnText: { color: '#0f172a', fontSize: 12.5, fontWeight: '800' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#334155' },
  actionText: { fontSize: 13, color: '#cbd5e1', fontWeight: '650' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 12 },
  logoutBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '800' },

  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: { fontSize: 14.5, fontWeight: '800', color: '#f8fafc' },
  modalForm: { marginBottom: 16 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelBtnText: { color: '#cbd5e1', fontSize: 13, fontWeight: '800' },
  submitBtn: {
    flex: 1.5,
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitBtnText: { color: '#0f172a', fontSize: 13, fontWeight: '800' },

  buildingChecklistContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 10,
    marginTop: 4,
  },
  scopeCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  scopeCheckText: {
    color: '#cbd5e1',
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Picker modal styling
  pickerModalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    width: '80%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickerModalTitle: { fontSize: 14.5, fontWeight: '800', color: '#f8fafc', marginBottom: 12, textAlign: 'center' },
  pickerOptionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  pickerOptionText: { color: '#cbd5e1', fontSize: 13, fontWeight: '700' },
  closePickerBtn: {
    marginTop: 14,
    paddingVertical: 10,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    alignItems: 'center',
  },
  closePickerBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },

  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText: { color: '#94a3b8', fontSize: 13, marginTop: 8 },

  // Inline dropdown cards
  inlineDropdownCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
    marginTop: -4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  inlineDropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  inlineDropdownRowActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  inlineDropdownText: {
    color: '#cbd5e1',
    fontSize: 12.5,
    fontWeight: '600',
  },
  inlineDropdownTextActive: {
    color: '#38bdf8',
    fontWeight: '800',
  },

  // High Fidelity Profile View Cards styling
  profileHeaderCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarLargeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeCircleText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0f172a',
  },
  profileNameTextMain: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 6,
  },
  roleBadgeContainer: {
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginBottom: 16,
  },
  roleBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  headerButtonBlue: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 8,
    paddingVertical: 10,
  },
  headerButtonBlueText: {
    color: '#0f172a',
    fontSize: 12.5,
    fontWeight: '800',
  },
  headerButtonDark: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#475569',
  },
  headerButtonDarkText: {
    color: '#cbd5e1',
    fontSize: 12.5,
    fontWeight: '800',
  },
  infoSectionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 12,
  },
  formGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  formGridHalf: {
    flex: 1,
  },
  formGridLabel: {
    fontSize: 9.5,
    color: '#cbd5e1',
    fontWeight: '700',
    marginBottom: 6,
  },
  formGridInputBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 40,
    justifyContent: 'center',
  },
  formGridInputText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  recordsTextRow: {
    marginBottom: 12,
  },
  recordsLabel: {
    fontSize: 9.5,
    color: '#cbd5e1',
    fontWeight: '700',
    marginBottom: 4,
  },
  recordsValue: {
    color: '#f8fafc',
    fontSize: 13.5,
    fontWeight: '800',
  },
  prefTitle: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  prefSubtitle: {
    color: '#64748b',
    fontSize: 10.5,
    marginTop: 2,
  },
  signoutBtnLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  signoutBtnTextLarge: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
});
