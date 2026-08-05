import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore, useThemeStore } from '../store/useStore';
import { useThemeColors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

// Animated Touchable Wrapper Component
const AnimatedTouchable = ({ children, onPress, style, disabled }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const TenantsScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const { language } = useThemeStore();
  const { colors, isDarkMode } = useThemeColors();
  const styles = getStyles(colors, isDarkMode);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Add Tenant Modal Forms Active States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Add Tenant Form States ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('American');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [unitId, setUnitId] = useState('');
  const [idType, setIdType] = useState('Driver License');
  const [idNumber, setIdNumber] = useState('');
  const [empName, setEmpName] = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [empIncome, setEmpIncome] = useState('');
  const [empStatus, setEmpStatus] = useState('Full-Time');
  const [tStatus, setTStatus] = useState('Active');

  // Dropdowns active states
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showIdDropdown, setShowIdDropdown] = useState(false);
  const [showEmpDropdown, setShowEmpDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const runEntryAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fetch live tenants & units
  const fetchLiveTenantsData = async () => {
    try {
      setLoading(true);
      const [tenantsRes, unitsRes] = await Promise.all([
        apiClient.get('/tenants', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/units', logout, refreshAccessToken).catch(() => null),
      ]);

      const rawTenants = Array.isArray(tenantsRes) ? tenantsRes : (tenantsRes?.data || []);
      const rawUnits = Array.isArray(unitsRes) ? unitsRes : (unitsRes?.data || []);

      setTenants(rawTenants);
      setUnits(rawUnits);
    } catch (e) {
      console.log('Error fetching tenants list:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  useEffect(() => {
    fetchLiveTenantsData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLiveTenantsData();
  };

  const handleDeleteTenant = (id, name) => {
    Alert.alert(
      'Delete Tenant',
      `Are you sure you want to delete resident "${name}"? This will dissolve lease assignments and invoice ties in their account ledger.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/tenants/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'Tenant deleted successfully');
              fetchLiveTenantsData();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete tenant');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCreateTenant = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'First Name, Last Name and Email are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password: password.trim() || undefined,
        unitId: unitId || undefined,
        status: tStatus,
        // Web fields mapped:
        preferredName: preferredName.trim() || undefined,
        dob: dob.trim() || undefined,
        gender,
        nationality: nationality.trim() || undefined,
        idType,
        idNumber: idNumber.trim() || undefined,
        employerName: empName.trim() || undefined,
        position: empPosition.trim() || undefined,
        monthlyIncome: Number(empIncome) || undefined,
        employmentStatus: empStatus,
      };

      await apiClient.post('/tenants', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Tenant profile registered successfully.');
      setIsAddOpen(false);

      // Reset
      setFirstName('');
      setLastName('');
      setPreferredName('');
      setDob('');
      setEmail('');
      setPhone('');
      setPassword('');
      setUnitId('');
      setIdNumber('');
      setEmpName('');
      setEmpPosition('');
      setEmpIncome('');
      
      fetchLiveTenantsData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to register tenant');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTenants = tenants.filter((item) => {
    const fullName = `${item.firstName || ''} ${item.lastName || ''} ${item.name || ''}`.toLowerCase();
    const propName = (item.unit?.property?.name || item.propertyName || '').toLowerCase();
    const unitNum = (item.unit?.unitNumber || item.unitNumber || '').toLowerCase();
    const emailStr = (item.email || '').toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           propName.includes(searchQuery.toLowerCase()) ||
           unitNum.includes(searchQuery.toLowerCase()) ||
           emailStr.includes(searchQuery.toLowerCase());
  });

  // Dropdown lists constant options
  const genderOptions = ['Male', 'Female', 'Other'];
  const idOptions = ['Driver License', 'Passport', 'State ID'];
  const empStatuses = ['Full-Time', 'Part-Time', 'Self-Employed', 'Unemployed'];
  const statuses = ['Active', 'Pending', 'Inactive'];

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>
          {language === 'es' ? 'Cargando directorio de inquilinos...' : 'Loading Tenant Directory...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      {/* Header & Search controls (Fixed) */}
      <View style={{ paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 48 : 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} allowFontScaling={false}>
            {language === 'es' ? 'Directorio de Inquilinos' : 'Tenant Directory'}
          </Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            {language === 'es' ? 'Verifique canales de contacto de residentes, contratos activos y saldos.' : 'Verify occupant contact channels, active lease alignments, and rent balances.'}
          </Text>
        </View>

        {/* Search Controls */}
        <View style={[styles.searchBarRow, { marginBottom: 12 }]}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={language === 'es' ? 'Buscar por nombre, correo o unidad...' : 'Search by name, email, or unit...'}
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setIsAddOpen(true)} activeOpacity={0.8}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.addBtnText} allowFontScaling={false}>
              {language === 'es' ? 'Agregar Inquilino' : 'Add Tenant'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38bdf8" />}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Section title */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              {language === 'es' ? `RESIDENTES ACTIVOS (${filteredTenants.length})` : `ACTIVE RESIDENTS (${filteredTenants.length})`}
            </Text>
          </View>

          {/* Cards List */}
          {filteredTenants.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyText} allowFontScaling={false}>
                {language === 'es' ? 'No se encontraron residentes' : 'No residents found'}
              </Text>
            </View>
          ) : (
            filteredTenants.map((item, idx) => {
              const name = item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Tenant';
              const initial = name.charAt(0).toUpperCase();
              const propName = item.unit?.property?.name || item.propertyName || 'Property';
              const unitNum = item.unit?.unitNumber || item.unitNumber || 'room 1b';
              const rent = Number(item.unit?.rentAmount || item.rentAmount || 1000);
              
              const statusColor = String(item.status).toLowerCase() === 'active' ? '#10b981' : '#f59e0b';
              const statusBg = String(item.status).toLowerCase() === 'active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)';

              return (
                <View key={item.id || `tenant-${idx}`} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText} allowFontScaling={false}>{initial}</Text>
                    </View>
                    <View style={styles.tenantInfo}>
                      <Text style={styles.tenantName} allowFontScaling={false}>{name}</Text>
                      <Text style={styles.tenantSubText} allowFontScaling={false}>
                        {propName} · Unit {unitNum}
                      </Text>
                    </View>
                    <View style={styles.badgesRow}>
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setSelectedTenant(item)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="eye-outline" size={16} color="#38bdf8" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteTenant(item.id, name)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* Metadata Row */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaCol}>
                      <Ionicons name="mail-outline" size={13} color="#94a3b8" style={{ marginRight: 6 }} />
                      <Text style={styles.metaText} allowFontScaling={false} numberOfLines={1}>
                        {item.email}
                      </Text>
                    </View>
                    <View style={styles.metaCol}>
                      <Ionicons name="call-outline" size={13} color="#94a3b8" style={{ marginRight: 6 }} />
                      <Text style={styles.metaText} allowFontScaling={false} numberOfLines={1}>
                        {item.phone || '(512) 555-0199'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.metaRow, { marginTop: 8 }]}>
                    <View style={styles.metaCol}>
                      <Ionicons name="card-outline" size={13} color="#10b981" style={{ marginRight: 6 }} />
                      <Text style={[styles.metaText, { color: '#10b981', fontWeight: '800' }]} allowFontScaling={false}>
                        ${rent.toLocaleString()}/mo Rent
                      </Text>
                    </View>
                    <View style={[styles.activeBadge, { backgroundColor: statusBg, borderColor: statusColor, paddingVertical: 2 }]}>
                      <Text style={[styles.activeBadgeText, { color: statusColor }]} allowFontScaling={false}>
                        {item.status || 'Active'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </Animated.View>
      </ScrollView>

      {/* --- ADD TENANT MODAL (Keyboard Responsive) --- */}
      <Modal visible={isAddOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add Tenant</Text>
                <TouchableOpacity onPress={() => setIsAddOpen(false)}>
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalSubHeader} allowFontScaling={false}>PERSONAL INFORMATION</Text>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>FIRST NAME *</Text>
                    <TextInput style={styles.formInput} placeholder="John" placeholderTextColor="#64748b" value={firstName} onChangeText={setFirstName} />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>LAST NAME *</Text>
                    <TextInput style={styles.formInput} placeholder="Doe" placeholderTextColor="#64748b" value={lastName} onChangeText={setLastName} />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>PREFERRED NAME</Text>
                  <TextInput style={styles.formInput} placeholder="Johnny" placeholderTextColor="#64748b" value={preferredName} onChangeText={setPreferredName} />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>DATE OF BIRTH</Text>
                    <TextInput style={styles.formInput} placeholder="YYYY-MM-DD" placeholderTextColor="#64748b" value={dob} onChangeText={setDob} />
                  </View>

                  {/* Gender dropdown */}
                  <View style={[styles.formGroup, { flex: 1 }, showGenderDropdown && { zIndex: 9999, position: 'relative' }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>GENDER</Text>
                    <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowGenderDropdown(!showGenderDropdown)} activeOpacity={0.7}>
                      <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{gender}</Text>
                      <Ionicons name={showGenderDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                    </TouchableOpacity>
                    {showGenderDropdown && (
                      <View style={styles.dropdownContainer}>
                        {genderOptions.map((opt) => (
                          <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setGender(opt); setShowGenderDropdown(false); }}>
                            <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                            {gender === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>NATIONALITY</Text>
                  <TextInput style={styles.formInput} placeholder="American" placeholderTextColor="#64748b" value={nationality} onChangeText={setNationality} />
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>CONTACT DETAILS</Text>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>EMAIL ADDRESS *</Text>
                  <TextInput style={styles.formInput} placeholder="staff@gmail.com" placeholderTextColor="#64748b" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>MOBILE PHONE</Text>
                  <TextInput style={styles.formInput} placeholder="(512) 555-0199" placeholderTextColor="#64748b" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>PASSWORD</Text>
                  <TextInput style={styles.formInput} placeholder="••••••••" placeholderTextColor="#64748b" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} />
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>UNIT ASSIGNMENT</Text>
                {/* Unit ID Dropdown */}
                <View style={[styles.formGroup, showUnitDropdown && { zIndex: 9998, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>ASSIGNED UNIT</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowUnitDropdown(!showUnitDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                      {units.find(u => u.id === unitId) ? `Unit ${units.find(u => u.id === unitId).unitNumber} (${units.find(u => u.id === unitId).property?.name || 'Property'})` : 'Select Unit...'}
                    </Text>
                    <Ionicons name={showUnitDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showUnitDropdown && (
                    <View style={styles.dropdownContainer}>
                      {units.map((opt) => (
                        <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setUnitId(opt.id); setShowUnitDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>Unit {opt.unitNumber} - {opt.property?.name}</Text>
                          {unitId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>GOVERNMENT IDS</Text>
                {/* ID Type dropdown */}
                <View style={[styles.formGroup, showIdDropdown && { zIndex: 9997, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>ID TYPE</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowIdDropdown(!showIdDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{idType}</Text>
                    <Ionicons name={showIdDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showIdDropdown && (
                    <View style={styles.dropdownContainer}>
                      {idOptions.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setIdType(opt); setShowIdDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {idType === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>ID NUMBER</Text>
                  <TextInput style={styles.formInput} placeholder="A1234567" placeholderTextColor="#64748b" value={idNumber} onChangeText={setIdNumber} />
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>EMPLOYMENT PARAMETERS</Text>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>EMPLOYER NAME</Text>
                  <TextInput style={styles.formInput} placeholder="Google Inc." placeholderTextColor="#64748b" value={empName} onChangeText={setEmpName} />
                </View>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>POSITION</Text>
                    <TextInput style={styles.formInput} placeholder="Staff Engineer" placeholderTextColor="#64748b" value={empPosition} onChangeText={setEmpPosition} />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>MONTHLY INCOME ($)</Text>
                    <TextInput style={styles.formInput} placeholder="3500" keyboardType="numeric" placeholderTextColor="#64748b" value={empIncome} onChangeText={setEmpIncome} />
                  </View>
                </View>

                {/* Employment Status dropdown */}
                <View style={[styles.formGroup, showEmpDropdown && { zIndex: 9996, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>EMPLOYMENT STATUS</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowEmpDropdown(!showEmpDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{empStatus}</Text>
                    <Ionicons name={showEmpDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showEmpDropdown && (
                    <View style={styles.dropdownContainer}>
                      {empStatuses.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setEmpStatus(opt); setShowEmpDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {empStatus === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Tenant account status dropdown */}
                <View style={[styles.formGroup, showStatusDropdown && { zIndex: 9995, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>ACCOUNT STATUS</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowStatusDropdown(!showStatusDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{tStatus}</Text>
                    <Ionicons name={showStatusDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showStatusDropdown && (
                    <View style={styles.dropdownContainer}>
                      {statuses.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setTStatus(opt); setShowStatusDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {tStatus === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Save Buttons inside ScrollView */}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddOpen(false)} disabled={submitting}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleCreateTenant} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#0f172a" /> : <Text style={styles.submitBtnText} allowFontScaling={false}>Save Tenant</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- DETAIL SPECIFICATIONS MODAL (EYE RESIDENT DETAIL) --- */}
      <Modal visible={!!selectedTenant} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="person-circle-outline" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle} allowFontScaling={false} numberOfLines={1}>
                  {selectedTenant?.name || `${selectedTenant?.firstName || ''} ${selectedTenant?.lastName || ''}`.trim()} Details
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedTenant(null)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {selectedTenant && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* 1. Personal & Contact */}
                <View style={styles.detailContainer}>
                  <Text style={styles.modalSubHeader} allowFontScaling={false} style={{ marginTop: 0, marginBottom: 8, color: '#38bdf8', fontSize: 10, fontWeight: '850' }}>
                    PERSONAL & CONTACT SPECIFICATIONS
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Email Address</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Phone Contact</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.phone || '(512) 555-0199'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Preferred Name</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.preferredName || selectedTenant.firstName || 'Johnny'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Birth Date / Gender</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.dob || '1995-01-01'} · {selectedTenant.gender || 'Male'}</Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Nationality</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.nationality || 'American'}</Text>
                  </View>
                </View>

                {/* 2. Employment & Income */}
                <View style={styles.detailContainer}>
                  <Text style={styles.modalSubHeader} allowFontScaling={false} style={{ marginTop: 0, marginBottom: 8, color: '#38bdf8', fontSize: 10, fontWeight: '850' }}>
                    EMPLOYMENT PARAMETERS
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Employer / Position</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.employerName || 'Google Inc.'} · {selectedTenant.position || 'Staff Engineer'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Monthly Income</Text>
                    <Text style={[styles.detailVal, { color: '#10b981' }]} allowFontScaling={false}>
                      ${(Number(selectedTenant.monthlyIncome) || 3500).toLocaleString()}/mo
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Employment Status</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.employmentStatus || 'Full-Time'}</Text>
                  </View>
                </View>

                {/* 3. Assigned Lease unit */}
                <View style={styles.detailContainer}>
                  <Text style={styles.modalSubHeader} allowFontScaling={false} style={{ marginTop: 0, marginBottom: 8, color: '#38bdf8', fontSize: 10, fontWeight: '850' }}>
                    LEASE UNIT PATHS
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Property Name</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{selectedTenant.unit?.property?.name || selectedTenant.propertyName || 'Property'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Unit number</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>Unit {selectedTenant.unit?.unitNumber || selectedTenant.unitNumber || '101'}</Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Account Status</Text>
                    <Text style={[styles.detailVal, { color: '#10b981', fontWeight: '800' }]} allowFontScaling={false}>{selectedTenant.status || 'Active'}</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSelectedTenant(null)}>
              <Text style={styles.closeModalBtnText} allowFontScaling={false}>Close details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: colors.textSecondary, marginTop: 8 },

  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 11.5, color: colors.textSecondary, marginTop: 4, lineHeight: 16 },

  searchBarRow: { flexDirection: 'row', gap: 10, marginBottom: 16, alignItems: 'center' },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: { color: colors.textPrimary, fontSize: 12, flex: 1, padding: 0 },
  addBtn: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
  },
  addBtnText: { color: '#0f172a', fontSize: 12, fontWeight: '800' },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },

  emptyCard: { backgroundColor: colors.surface, padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  emptyText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },

  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  tenantInfo: { flex: 1 },
  tenantName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  tenantSubText: { fontSize: 11.5, color: colors.textSecondary, marginTop: 2 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(239, 68, 68, 0.12)', alignItems: 'center', justifyContent: 'center' },
  eyeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(56, 189, 248, 0.12)', alignItems: 'center', justifyContent: 'center' },

  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 12 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaCol: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  activeBadge: { backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#10b981' },
  activeBadgeText: { color: '#10b981', fontSize: 10, fontWeight: '800' },

  // Modal styling
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.cardBorder, maxHeight: '85%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  modalSubHeader: { fontSize: 9, fontWeight: '850', color: '#38bdf8', letterSpacing: 0.8, marginTop: 10, marginBottom: 10 },
  modalScroll: { marginBottom: 16 },

  formGroup: { marginBottom: 14 },
  formRow: { flexDirection: 'row', gap: 10 },
  formLabel: { fontSize: 9.5, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 6 },
  formInput: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
    fontSize: 13,
  },

  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  dropdownTriggerText: { color: colors.textSecondary, fontSize: 13 },
  dropdownContainer: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    zIndex: 9999,
    elevation: 5,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  dropdownItemText: { color: colors.textSecondary, fontSize: 12.5 },

  modalActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 14, marginTop: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: colors.inputBorder },
  cancelBtnText: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '700' },
  submitBtn: { backgroundColor: '#38bdf8', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, minWidth: 110, alignItems: 'center', justifyContent: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#0f172a', fontSize: 12.5, fontWeight: '800' },

  // Detail Specs Modal
  modalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  detailContainer: { backgroundColor: colors.inputBackground, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.surface },
  detailLabel: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '600' },
  detailVal: { color: colors.textPrimary, fontSize: 12.5, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 16 },
  closeModalBtn: { backgroundColor: colors.buttonSecondary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeModalBtnText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
});
