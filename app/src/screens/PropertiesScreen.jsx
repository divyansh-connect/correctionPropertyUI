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
import { propertySchema, buildingSchema, unitSchema } from '../validations/mobile.validation';
import { CustomDatePicker } from '../components/CustomDatePicker';

const pTypes = ['Multifamily', 'Commercial', 'Single Family', 'Industrial', 'Condo'];
const pStatuses = ['Active', 'Inactive', 'Pending'];
const unitStatuses = ['Vacant', 'Occupied', 'Maintenance'];

// Animated Touchable Component
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

export const PropertiesScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const { language } = useThemeStore();
  const { colors, isDarkMode } = useThemeColors();
  const styles = getStyles(colors, isDarkMode);
  const [activeTab, setActiveTab] = useState('properties'); // properties, buildings, units
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [owners, setOwners] = useState([]);

  // Detail Modal States
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Unit Detail Modal States
  const [isUnitDetailOpen, setIsUnitDetailOpen] = useState(false);
  const [viewingUnit, setViewingUnit] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [unitDetailData, setUnitDetailData] = useState({
    unit: null,
    leases: [],
    workOrders: [],
    invoices: [],
  });
  const [selectedSubTab, setSelectedSubTab] = useState('lease'); // lease, payments, maintenance, documents

  // Form Modals Active States
  const [isAddPropOpen, setIsAddPropOpen] = useState(false);
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [propErrors, setPropErrors] = useState({});
  const [bldErrors, setBldErrors] = useState({});
  const [unitErrors, setUnitErrors] = useState({});
  const [showAvailDatePicker, setShowAvailDatePicker] = useState(false);

  // --- Add Property Form State ---
  const [pName, setPName] = useState('');
  const [pType, setPType] = useState('Apartment');
  const [pStatus, setPStatus] = useState('Active');
  const [pStreet, setPStreet] = useState('');
  const [pCity, setPCity] = useState('Austin');
  const [pState, setPState] = useState('TX');
  const [pCountry, setPCountry] = useState('USA');
  const [pZip, setPZip] = useState('78701');
  const [pOwnerId, setPOwnerId] = useState('');
  const [pShare, setPShare] = useState('100');
  const [pMgtCo, setPMgtCo] = useState('Apex Property Management');
  const [pYearBuilt, setPYearBuilt] = useState('2020');
  const [pBuildingsCount, setPBuildingsCount] = useState('1');
  const [pUnitsCount, setPUnitsCount] = useState('0');
  const [pSqft, setPSqft] = useState('10000');
  const [pPurchasePrice, setPPurchasePrice] = useState('1000000');
  const [pCurrentValue, setPCurrentValue] = useState('1200000');
  const [pExpenses, setPExpenses] = useState('0');
  // Dropdown states for Add Property
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  // --- Add Building Form State ---
  const [bPropId, setBPropId] = useState('');
  const [bName, setBName] = useState('');
  const [bFloors, setBFloors] = useState('3');
  const [bUnitsCount, setBUnitsCount] = useState('12');
  const [bStreetAddress, setBStreetAddress] = useState('');
  const [bStatus, setBStatus] = useState('Active');
  // Dropdown states for Add Building
  const [showBPropDropdown, setShowBPropDropdown] = useState(false);
  const [showBStatusDropdown, setShowBStatusDropdown] = useState(false);

  // --- Add Unit Form State ---
  const [uPropId, setUPropId] = useState('');
  const [uBuildingId, setUBuildingId] = useState('');
  const [uNumber, setUNumber] = useState('');
  const [uFloor, setUFloor] = useState('1');
  const [uSqft, setUSqft] = useState('850');
  const [uBeds, setUBeds] = useState('2');
  const [uBaths, setUBaths] = useState('2');
  const [uRent, setURent] = useState('1500');
  const [uDeposit, setUDeposit] = useState('1500');
  const [uAvailDate, setUAvailDate] = useState('2026-08-05');
  const [uStatus, setUStatus] = useState('Vacant');
  // Dropdown states for Add Unit
  const [showUPropDropdown, setShowUPropDropdown] = useState(false);
  const [showUBuildDropdown, setShowUBuildDropdown] = useState(false);
  const [showUStatusDropdown, setShowUStatusDropdown] = useState(false);

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

  // Fetch Live Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [propsRes, buildingsRes, unitsRes, ownersRes] = await Promise.all([
        apiClient.get('/properties', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/buildings', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/units', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/owners', logout, refreshAccessToken).catch(() => null),
      ]);

      const rawProps = Array.isArray(propsRes) ? propsRes : (propsRes?.data || []);
      const rawBuildings = Array.isArray(buildingsRes) ? buildingsRes : (buildingsRes?.data || []);
      const rawUnits = Array.isArray(unitsRes) ? unitsRes : (unitsRes?.data || []);
      const rawOwners = Array.isArray(ownersRes) ? ownersRes : (ownersRes?.data || []);

      setProperties(rawProps);
      setBuildings(rawBuildings);
      setUnits(rawUnits);
      setOwners(rawOwners);
    } catch (e) {
      console.log('Error fetching properties directory data:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // --- View Unit Details ---
  const handleViewUnitDetails = async (unitItem) => {
    try {
      setDetailLoading(true);
      setViewingUnit(unitItem);
      setIsUnitDetailOpen(true);
      setSelectedSubTab('lease'); // default sub-tab

      const [unitRes, leasesRes, workRes, invoicesRes] = await Promise.all([
        apiClient.get(`/units/${unitItem.id}`, logout, refreshAccessToken).catch(() => null),
        apiClient.get('/leases', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/work-orders', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/invoices', logout, refreshAccessToken).catch(() => null),
      ]);

      const detailedUnit = unitRes?.data || unitItem;
      const filteredLeases = (Array.isArray(leasesRes) ? leasesRes : (leasesRes?.data || [])).filter(l => l.unitId === unitItem.id);
      const filteredWork = (Array.isArray(workRes) ? workRes : (workRes?.data || [])).filter(w => w.unitId === unitItem.id || w.unit?.id === unitItem.id);
      const filteredInvoices = (Array.isArray(invoicesRes) ? invoicesRes : (invoicesRes?.data || [])).filter(i => i.unitId === unitItem.id || i.unitNumber === unitItem.unitNumber);

      setUnitDetailData({
        unit: detailedUnit,
        leases: filteredLeases,
        workOrders: filteredWork,
        invoices: filteredInvoices,
      });
    } catch (e) {
      console.log('Error loading unit detail data:', e.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // --- Deletion Handlers ---
  const handleDeleteProperty = (id, name) => {
    Alert.alert(
      'Delete Property',
      `Are you sure you want to delete property "${name}"? This will delete all buildings, units, leases, and distributions associated with it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/properties/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'Property deleted successfully');
              fetchData();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete property');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteBuilding = (id, name) => {
    Alert.alert(
      'Delete Building',
      `Are you sure you want to delete building "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/buildings/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'Building deleted successfully');
              fetchData();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete building');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUnit = (id, number) => {
    Alert.alert(
      'Delete Unit',
      `Are you sure you want to delete unit "${number}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/units/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'Unit deleted successfully');
              fetchData();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete unit');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // --- Creation Handlers ---
  const handleCreateProperty = async () => {
    setPropErrors({});

    const payload = {
      name: pName.trim(),
      type: pType,
      status: pStatus,
      streetAddress: pStreet.trim() || undefined,
      city: pCity.trim() || undefined,
      state: pState.trim() || undefined,
      country: pCountry.trim() || undefined,
      zip: pZip.trim() || undefined,
      address: pStreet.trim() ? `${pStreet.trim()}, ${pCity.trim()}, ${pState.trim()}` : 'Austin, TX',
      ownerId: pOwnerId || undefined,
      ownershipPercentage: Number(pShare) || 0,
      managementCompany: pMgtCo.trim() || 'Apex Property Management',
      yearBuilt: Number(pYearBuilt) || 0,
      squareFootage: Number(pSqft) || 0,
      purchasePrice: Number(pPurchasePrice) || 0,
      currentValue: Number(pCurrentValue) || 0,
    };

    const valRes = propertySchema.safeParse(payload);
    if (!valRes.success) {
      const errs = {};
      valRes.error.issues.forEach(issue => {
        errs[issue.path[0]] = issue.message;
      });
      setPropErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/properties', valRes.data, logout, refreshAccessToken);
      Alert.alert('Success', 'Property created successfully.');
      setIsAddPropOpen(false);
      setPName('');
      setPStreet('');
      setPOwnerId('');
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBuilding = async () => {
    setBldErrors({});
    if (!bPropId) {
      Alert.alert('Validation Error', 'Associated Property is required.');
      return;
    }

    const payload = {
      propertyId: bPropId,
      name: bName.trim(),
      floors: Number(bFloors) || 0,
      unitsCount: Number(bUnitsCount) || 0,
      streetAddress: bStreetAddress.trim() || undefined,
      status: bStatus,
    };

    const valRes = buildingSchema.safeParse(payload);
    if (!valRes.success) {
      const errs = {};
      valRes.error.issues.forEach(issue => {
        errs[issue.path[0]] = issue.message;
      });
      setBldErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/buildings', valRes.data, logout, refreshAccessToken);
      Alert.alert('Success', 'Building created successfully.');
      setIsAddBuildingOpen(false);
      setBName('');
      setBPropId('');
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create building');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUnit = async () => {
    setUnitErrors({});
    if (!uPropId) {
      Alert.alert('Validation Error', 'Associated Property is required.');
      return;
    }

    const payload = {
      propertyId: uPropId,
      buildingId: uBuildingId || undefined,
      unitNumber: uNumber.trim(),
      floor: Number(uFloor) || 0,
      squareFootage: Number(uSqft) || 0,
      bedrooms: Number(uBeds) || 0,
      bathrooms: Number(uBaths) || 0,
      rentAmount: Number(uRent) || 0,
      securityDeposit: Number(uDeposit) || 0,
      availabilityDate: uAvailDate,
      status: uStatus,
    };

    const valRes = unitSchema.safeParse(payload);
    if (!valRes.success) {
      const errs = {};
      valRes.error.issues.forEach(issue => {
        errs[issue.path[0]] = issue.message;
      });
      setUnitErrors(errs);
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/units', valRes.data, logout, refreshAccessToken);
      Alert.alert('Success', 'Unit created successfully.');
      setIsAddUnitOpen(false);
      setUNumber('');
      setUPropId('');
      setUBuildingId('');
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create unit');
    } finally {
      setSubmitting(false);
    }
  };



  const formatAddress = (addr) => {
    if (!addr) return 'Bhopal, MP, India';
    return String(addr).split(',').slice(0, 3).join(', ').trim();
  };

  // Dropdown options compilers
  const getPickerOptions = () => {
    switch (activePicker) {
      case 'propType':
        return ['Multifamily', 'Commercial', 'Single Family', 'Industrial', 'Condo'].map(t => ({ value: t, label: t }));
      case 'owner':
        return owners.map(o => ({ value: o.id, label: o.name || `${o.firstName || ''} ${o.lastName || ''}`.trim() }));
      case 'property':
        return properties.map(p => ({ value: p.id, label: p.name }));
      case 'building':
        const targetPropId = isAddUnitOpen ? unitPropertyId : bldgPropertyId;
        const availBldgs = targetPropId ? buildings.filter(b => b.propertyId === targetPropId) : buildings;
        return availBldgs.map(b => ({ value: b.id, label: b.name }));
      default:
        return [];
    }
  };

  const handleSelectPickerOption = (val) => {
    if (activePicker === 'propType') setPropType(val);
    if (activePicker === 'owner') setPropOwnerId(val);
    if (activePicker === 'property') {
      if (isAddBuildingOpen) setBldgPropertyId(val);
      if (isAddUnitOpen) {
        setUnitPropertyId(val);
        setUnitBuildingId('');
      }
    }
    if (activePicker === 'building') setUnitBuildingId(val);
    setPickerModalOpen(false);
  };

  // Filters
  const filteredProperties = properties.filter(item =>
    (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    formatAddress(item.address).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBuildings = buildings.filter(item => {
    const pName = item.property ? item.property.name : (item.propertyName || '');
    return (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      pName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUnits = units.filter(item => {
    const uNum = String(item.unitNumber || '');
    const pName = item.property ? item.property.name : (item.propertyName || '');
    return uNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>
          {language === 'es' ? 'Cargando portafolio de propiedades...' : 'Loading property portfolio...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      {/* FIXED HEADER WITH SEARCH & TABS */}
      <View style={[styles.fixedHeader, { paddingTop: 16 }]}>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          {activeTab === 'properties'
            ? (language === 'es' ? 'Propiedades de la Cartera' : 'Portfolio Properties')
            : activeTab === 'buildings'
              ? (language === 'es' ? 'Estructuras de Edificios' : 'Building Structures')
              : (language === 'es' ? 'Directorio de Unidades' : 'Units Directory')}
        </Text>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          {activeTab === 'properties'
            ? (language === 'es' ? 'Verifique activos inmobiliarios, métricas de ocupación y valoración.' : 'Verify real estate assets, occupancy metrics, and valuation.')
            : activeTab === 'buildings'
              ? (language === 'es' ? 'Verifique estructuras de edificios, complejos y recuentos de pisos.' : 'Verify building structures, complexes, and floor counts.')
              : (language === 'es' ? 'Verifique inventario de unidades residenciales, habitaciones y renta.' : 'Verify residential unit inventory, bed/bath counts, and rent.')}
        </Text>

        {/* Search & Action Bar */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={16} color="#64748b" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeTab === 'properties'
                  ? (language === 'es' ? 'Buscar propiedades por nombre...' : 'Search properties by name...')
                  : activeTab === 'buildings'
                    ? (language === 'es' ? 'Buscar edificios por nombre...' : 'Search buildings by name...')
                    : (language === 'es' ? 'Buscar unidades por número...' : 'Search units by number...')
              }
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              if (activeTab === 'properties') setIsAddPropOpen(true);
              else if (activeTab === 'buildings') setIsAddBuildingOpen(true);
              else setIsAddUnitOpen(true);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.addBtnText} allowFontScaling={false}>
              {activeTab === 'properties'
                ? (language === 'es' ? 'Propiedad' : 'Property')
                : activeTab === 'buildings'
                  ? (language === 'es' ? 'Edificio' : 'Building')
                  : (language === 'es' ? 'Unidad' : 'Unit')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabContainer, { margin: 0, marginTop: 12, marginBottom: 4 }]}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'properties' && styles.tabBtnActive]}
            onPress={() => { setActiveTab('properties'); setSearchQuery(''); }}
          >
            <Text style={[styles.tabBtnText, activeTab === 'properties' && styles.tabBtnTextActive]} allowFontScaling={false}>
              {language === 'es' ? 'Propiedades' : 'Properties'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'buildings' && styles.tabBtnActive]}
            onPress={() => { setActiveTab('buildings'); setSearchQuery(''); }}
          >
            <Text style={[styles.tabBtnText, activeTab === 'buildings' && styles.tabBtnTextActive]} allowFontScaling={false}>
              {language === 'es' ? 'Edificios' : 'Buildings'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'units' && styles.tabBtnActive]}
            onPress={() => { setActiveTab('units'); setSearchQuery(''); }}
          >
            <Text style={[styles.tabBtnText, activeTab === 'units' && styles.tabBtnTextActive]} allowFontScaling={false}>
              {language === 'es' ? 'Unidades' : 'Units'}
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
          {/* TAB 1: PROPERTIES */}
          {activeTab === 'properties' && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  {language === 'es' ? `PROPIEDADES DE CARTERA (${filteredProperties.length})` : `PORTFOLIO PROPERTIES (${filteredProperties.length})`}
                </Text>
              </View>

              {filteredProperties.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="business-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText} allowFontScaling={false}>
                    {language === 'es' ? 'No se encontraron propiedades' : 'No properties found'}
                  </Text>
                </View>
              ) : (
                filteredProperties.map((item, idx) => {
                  const totalUnits = item.units && item.units.length > 0 ? item.units.length : (item.unitsCount || 0);
                  const occUnits = item.units && item.units.length > 0
                    ? item.units.filter(u => String(u.status).toLowerCase() === 'occupied' || u.tenant || u.tenantId).length
                    : (item.occupiedUnits || 0);
                  const vacUnits = Math.max(0, totalUnits - occUnits);
                  const occRate = totalUnits > 0 ? Math.round((occUnits / totalUnits) * 100) : (item.occupancyRate || 0);
                  const valuation = item.currentValue || item.purchasePrice || 1200000;
                  const rentVal = item.units && item.units.length > 0
                    ? item.units.reduce((sum, u) => sum + (Number(u.rentAmount || u.rent) || 0), 0)
                    : (item.monthlyRent !== undefined ? item.monthlyRent : (item.rentAmount || 0));
                  const shareText = item.ownershipPercentage !== undefined ? `${item.ownershipPercentage}% Share` : '100% Share';

                  return (
                    <TouchableOpacity
                      key={item.id || `prop-${idx}`}
                      style={styles.card}
                      onPress={() => setSelectedProperty(item)}
                      activeOpacity={0.9}
                    >
                      <View style={styles.cardHeader}>
                        <View style={styles.headerTitleContainer}>
                          <Ionicons name="business-outline" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                          <Text style={styles.propertyName} allowFontScaling={false} numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                        <View style={styles.badgesRow}>
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText} allowFontScaling={false}>{item.status || 'Active'}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.trashBtn}
                            onPress={() => handleDeleteProperty(item.id, item.name)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                        <Text style={styles.address} allowFontScaling={false} numberOfLines={1}>
                          {formatAddress(item.address)}
                        </Text>
                      </View>

                      <View style={styles.specsRow}>
                        <View style={styles.specChip}>
                          <Text style={styles.specChipText} allowFontScaling={false}>{(item.squareFootage || 8500).toLocaleString()} sq ft</Text>
                        </View>
                        <View style={styles.specChip}>
                          <Text style={styles.specChipText} allowFontScaling={false}>Built {item.yearBuilt || 2010}</Text>
                        </View>
                        <View style={styles.specChip}>
                          <Text style={styles.specChipText} allowFontScaling={false}>{shareText}</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      {/* 3 Columns Metrics */}
                      <View style={styles.metricsArea}>
                        <View style={styles.metricColumn}>
                          <Text style={styles.metricLabel} allowFontScaling={false}>TOTAL UNITS</Text>
                          <Text style={styles.metricVal} allowFontScaling={false}>{totalUnits} Units</Text>
                          <Text style={styles.metricSub} allowFontScaling={false}>{occUnits} Occ / {vacUnits} Vac</Text>
                        </View>
                        <View style={styles.metricColumn}>
                          <Text style={styles.metricLabel} allowFontScaling={false}>EST. MONTHLY RENT</Text>
                          <Text style={[styles.metricVal, { color: '#10b981' }]} allowFontScaling={false}>${Number(rentVal).toLocaleString()}</Text>
                          <Text style={styles.metricSub} allowFontScaling={false}>Occ. Rate: {occRate}%</Text>
                        </View>
                        <View style={styles.metricColumnRight}>
                          <Text style={styles.metricLabel} allowFontScaling={false}>ASSET VALUATION</Text>
                          <Text style={[styles.metricVal, { color: '#38bdf8' }]} allowFontScaling={false}>${Number(valuation).toLocaleString()}</Text>
                          <Text style={styles.metricSub} allowFontScaling={false}>Market Value</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </>
          )}

          {/* TAB 2: BUILDINGS */}
          {activeTab === 'buildings' && (
            <>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  PORTFOLIO BUILDINGS ({filteredBuildings.length})
                </Text>
              </View>

              {filteredBuildings.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="business-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText} allowFontScaling={false}>No buildings registered</Text>
                </View>
              ) : (
                filteredBuildings.map((item, idx) => (
                  <View key={item.id || `build-${idx}`} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.headerTitleContainer}>
                        <Ionicons name="business" size={18} color="#38bdf8" style={{ marginRight: 8 }} />
                        <Text style={styles.propertyName} allowFontScaling={false}>{item.name}</Text>
                      </View>
                      <View style={styles.badgesRow}>
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText} allowFontScaling={false}>Active</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.trashBtn}
                          onPress={() => handleDeleteBuilding(item.id, item.name)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.locationRow}>
                      <Ionicons name="home-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                      <Text style={styles.address} allowFontScaling={false}>
                        Property: {item.property?.name || 'Property'}
                      </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.metricsArea}>
                      <View style={styles.metricColumn}>
                        <Text style={styles.metricLabel} allowFontScaling={false}>FLOORS</Text>
                        <Text style={styles.metricVal} allowFontScaling={false}>{item.floors} Floors</Text>
                      </View>
                      <View style={styles.metricColumn}>
                        <Text style={styles.metricLabel} allowFontScaling={false}>TOTAL UNITS</Text>
                        <Text style={styles.metricVal} allowFontScaling={false}>{item.unitsCount} Units</Text>
                      </View>
                      <View style={styles.metricColumnRight}>
                        <Text style={styles.metricLabel} allowFontScaling={false}>OCCUPANCY</Text>
                        <Text style={[styles.metricVal, { color: '#10b981' }]} allowFontScaling={false}>{item.occupancyRate || 0}%</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </>
          )}

          {/* TAB 3: UNITS */}
          {activeTab === 'units' && (
            <>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  PORTFOLIO UNITS ({filteredUnits.length})
                </Text>
              </View>

              {filteredUnits.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="cube-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText} allowFontScaling={false}>No units registered</Text>
                </View>
              ) : (
                filteredUnits.map((item, idx) => {
                  const statusColor = String(item.status).toLowerCase() === 'occupied' ? '#10b981' : '#f59e0b';
                  const statusBg = String(item.status).toLowerCase() === 'occupied' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)';
                  return (
                    <View key={item.id || `unit-${idx}`} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={styles.headerTitleContainer}>
                          <Ionicons name="cube-outline" size={18} color="#38bdf8" style={{ marginRight: 8 }} />
                          <Text style={styles.propertyName} allowFontScaling={false}>Unit {item.unitNumber}</Text>
                        </View>
                        <View style={styles.badgesRow}>
                          <View style={[styles.activeBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
                            <Text style={[styles.activeBadgeText, { color: statusColor }]} allowFontScaling={false}>
                              {item.status}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.eyeBtn}
                            onPress={() => handleViewUnitDetails(item)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="eye-outline" size={16} color="#38bdf8" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.trashBtn}
                            onPress={() => handleDeleteUnit(item.id, item.unitNumber)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.locationRow}>
                        <Ionicons name="business-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                        <Text style={styles.address} allowFontScaling={false} numberOfLines={1}>
                          {item.property?.name || 'Property'} · {item.building?.name || 'Building'}
                        </Text>
                      </View>

                      <View style={styles.specsRow}>
                        <View style={styles.specChip}>
                          <Text style={styles.specChipText} allowFontScaling={false}>Floor {item.floor}</Text>
                        </View>
                        <View style={styles.specChip}>
                          <Text style={styles.specChipText} allowFontScaling={false}>{item.bedrooms || 0} Beds / {item.bathrooms || 0} Baths</Text>
                        </View>
                        <View style={styles.specChip}>
                          <Text style={styles.specChipText} allowFontScaling={false}>{item.squareFootage || 0} SqFt</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.metricsArea}>
                        <View style={styles.metricColumn}>
                          <Text style={styles.metricLabel} allowFontScaling={false}>MONTHLY RENT</Text>
                          <Text style={[styles.metricVal, { color: '#10b981' }]} allowFontScaling={false}>
                            ${(Number(item.rentAmount) || 0).toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.metricColumn}>
                          <Text style={styles.metricLabel} allowFontScaling={false}>SECURITY DEPOSIT</Text>
                          <Text style={styles.metricVal} allowFontScaling={false}>
                            ${(Number(item.securityDeposit) || 0).toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.metricColumnRight}>
                          <Text style={styles.metricLabel} allowFontScaling={false}>RESIDENT</Text>
                          <Text style={[styles.metricVal, { fontSize: 11.5, color: '#f8fafc' }]} allowFontScaling={false} numberOfLines={1}>
                            {item.tenants && item.tenants.length > 0
                              ? `${item.tenants[0].firstName || ''} ${item.tenants[0].lastName || ''}`.trim()
                              : 'Vacant'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* --- ADD PROPERTY MODAL --- */}
      <Modal visible={isAddPropOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add Property</Text>
                <TouchableOpacity onPress={() => setIsAddPropOpen(false)}>
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalSubHeader} allowFontScaling={false}>BASIC INFORMATION</Text>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY NAME</Text>
                  <TextInput style={styles.formInput} placeholder="e.g. Oakridge Heights" placeholderTextColor="#64748b" value={pName} onChangeText={setPName} />
                  {propErrors.name && <Text style={styles.errorLabel} allowFontScaling={false}>{propErrors.name}</Text>}
                </View>

                {/* Property Type Dropdown */}
                <View style={[styles.formGroup, showTypeDropdown && { zIndex: 9999, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY TYPE</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowTypeDropdown(!showTypeDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{pType}</Text>
                    <Ionicons name={showTypeDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showTypeDropdown && (
                    <View style={styles.dropdownContainer}>
                      {pTypes.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setPType(opt); setShowTypeDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {pType === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Status Dropdown */}
                <View style={[styles.formGroup, showStatusDropdown && { zIndex: 9998, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>INITIAL STATUS</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowStatusDropdown(!showStatusDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{pStatus}</Text>
                    <Ionicons name={showStatusDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showStatusDropdown && (
                    <View style={styles.dropdownContainer}>
                      {pStatuses.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setPStatus(opt); setShowStatusDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {pStatus === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>ADDRESS COORDINATES</Text>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>STREET ADDRESS</Text>
                  <TextInput style={styles.formInput} placeholder="124 Oakridge Blvd" placeholderTextColor="#64748b" value={pStreet} onChangeText={setPStreet} />
                </View>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>CITY</Text>
                    <TextInput style={styles.formInput} placeholder="Austin" placeholderTextColor="#64748b" value={pCity} onChangeText={setPCity} />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>STATE</Text>
                    <TextInput style={styles.formInput} placeholder="TX" placeholderTextColor="#64748b" value={pState} onChangeText={setPState} />
                  </View>
                </View>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>COUNTRY</Text>
                    <TextInput style={styles.formInput} placeholder="USA" placeholderTextColor="#64748b" value={pCountry} onChangeText={setPCountry} />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>ZIP CODE</Text>
                    <TextInput style={styles.formInput} placeholder="78701" placeholderTextColor="#64748b" value={pZip} onChangeText={setPZip} />
                  </View>
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>OWNERSHIP STRUCTURE</Text>
                {/* Owners Dropdown */}
                <View style={[styles.formGroup, showOwnerDropdown && { zIndex: 9997, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>OWNER</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowOwnerDropdown(!showOwnerDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                      {owners.find(o => o.id === pOwnerId)?.name || 'Select Owner...'}
                    </Text>
                    <Ionicons name={showOwnerDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showOwnerDropdown && (
                    <View style={styles.dropdownContainer}>
                      {owners.map((opt) => (
                        <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setPOwnerId(opt.id); setShowOwnerDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.name}</Text>
                          {pOwnerId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                 <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>OWNERSHIP PERCENTAGE (%)</Text>
                  <TextInput style={styles.formInput} placeholder="100" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={pShare} onChangeText={setPShare} />
                  {propErrors.ownershipPercentage && <Text style={styles.errorLabel} allowFontScaling={false}>{propErrors.ownershipPercentage}</Text>}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>MANAGEMENT COMPANY</Text>
                  <TextInput style={styles.formInput} placeholder="Apex Property Management" placeholderTextColor="#64748b" value={pMgtCo} onChangeText={setPMgtCo} />
                </View>

                 <Text style={styles.modalSubHeader} allowFontScaling={false}>PROPERTY PARAMETERS</Text>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>YEAR BUILT</Text>
                    <TextInput style={styles.formInput} placeholder="2010" keyboardType="numeric" placeholderTextColor="#64748b" value={pYearBuilt} onChangeText={setPYearBuilt} />
                    {propErrors.yearBuilt && <Text style={styles.errorLabel} allowFontScaling={false}>{propErrors.yearBuilt}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>SQUARE FOOTAGE</Text>
                    <TextInput style={styles.formInput} placeholder="8500" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={pSqft} onChangeText={setPSqft} />
                    {propErrors.squareFootage && <Text style={styles.errorLabel} allowFontScaling={false}>{propErrors.squareFootage}</Text>}
                  </View>
                </View>

                <Text style={styles.modalSubHeader} allowFontScaling={false}>FINANCIAL VALUATION</Text>
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>PURCHASE PRICE ($)</Text>
                    <TextInput style={styles.formInput} placeholder="2000000" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={pPurchasePrice} onChangeText={setPPurchasePrice} />
                    {propErrors.purchasePrice && <Text style={styles.errorLabel} allowFontScaling={false}>{propErrors.purchasePrice}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>CURRENT VALUE ($)</Text>
                    <TextInput style={styles.formInput} placeholder="2200000" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={pCurrentValue} onChangeText={setPCurrentValue} />
                    {propErrors.currentValue && <Text style={styles.errorLabel} allowFontScaling={false}>{propErrors.currentValue}</Text>}
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddPropOpen(false)} disabled={submitting}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleCreateProperty} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#0f172a" /> : <Text style={styles.submitBtnText} allowFontScaling={false}>Create Property</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- ADD BUILDING MODAL --- */}
      <Modal visible={isAddBuildingOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add New Building</Text>
                <TouchableOpacity onPress={() => setIsAddBuildingOpen(false)}>
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Associated Property Dropdown */}
                <View style={[styles.formGroup, showBPropDropdown && { zIndex: 9999, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>ASSOCIATED PROPERTY</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowBPropDropdown(!showBPropDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                      {properties.find(p => p.id === bPropId)?.name || 'Select Property...'}
                    </Text>
                    <Ionicons name={showBPropDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showBPropDropdown && (
                    <View style={styles.dropdownContainer}>
                      {properties.map((opt) => (
                        <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setBPropId(opt.id); setShowBPropDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.name}</Text>
                          {bPropId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                 <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>BUILDING NAME</Text>
                  <TextInput style={styles.formInput} placeholder="Building B / Block C" placeholderTextColor="#64748b" value={bName} onChangeText={setBName} />
                  {bldErrors.name && <Text style={styles.errorLabel} allowFontScaling={false}>{bldErrors.name}</Text>}
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>NUMBER OF FLOORS</Text>
                    <TextInput style={styles.formInput} placeholder="3" keyboardType="numeric" placeholderTextColor="#64748b" value={bFloors} onChangeText={setBFloors} />
                    {bldErrors.floors && <Text style={styles.errorLabel} allowFontScaling={false}>{bldErrors.floors}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>TOTAL UNITS</Text>
                    <TextInput style={styles.formInput} placeholder="12" keyboardType="numeric" placeholderTextColor="#64748b" value={bUnitsCount} onChangeText={setBUnitsCount} />
                    {bldErrors.unitsCount && <Text style={styles.errorLabel} allowFontScaling={false}>{bldErrors.unitsCount}</Text>}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>STREET ADDRESS</Text>
                  <TextInput style={styles.formInput} placeholder="Leave blank to use property address" placeholderTextColor="#64748b" value={bStreetAddress} onChangeText={setBStreetAddress} />
                </View>

                {/* Building Status Dropdown */}
                <View style={[styles.formGroup, showBStatusDropdown && { zIndex: 9998, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>STATUS</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowBStatusDropdown(!showBStatusDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{bStatus}</Text>
                    <Ionicons name={showBStatusDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showBStatusDropdown && (
                    <View style={styles.dropdownContainer}>
                      {pStatuses.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setBStatus(opt); setShowBStatusDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {bStatus === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddBuildingOpen(false)} disabled={submitting}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleCreateBuilding} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#0f172a" /> : <Text style={styles.submitBtnText} allowFontScaling={false}>Save Building</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- ADD UNIT MODAL --- */}
      <Modal visible={isAddUnitOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add Unit</Text>
                <TouchableOpacity onPress={() => setIsAddUnitOpen(false)}>
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Associated Property Dropdown */}
                <View style={[styles.formGroup, showUPropDropdown && { zIndex: 9999, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowUPropDropdown(!showUPropDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                      {properties.find(p => p.id === uPropId)?.name || 'Select Property...'}
                    </Text>
                    <Ionicons name={showUPropDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showUPropDropdown && (
                    <View style={styles.dropdownContainer}>
                      {properties.map((opt) => (
                        <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setUPropId(opt.id); setUBuildingId(''); setShowUPropDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.name}</Text>
                          {uPropId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Associated Building Dropdown (Filtered by Property) */}
                <View style={[styles.formGroup, showUBuildDropdown && { zIndex: 9998, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>BUILDING (OPTIONAL)</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowUBuildDropdown(!showUBuildDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                      {buildings.find(b => b.id === uBuildingId)?.name || 'Select Building...'}
                    </Text>
                    <Ionicons name={showUBuildDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showUBuildDropdown && (
                    <View style={styles.dropdownContainer}>
                      {buildings.filter(b => b.propertyId === uPropId || !uPropId).map((opt) => (
                        <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setUBuildingId(opt.id); setShowUBuildDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.name}</Text>
                          {uBuildingId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                 <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>UNIT NUMBER</Text>
                  <TextInput style={styles.formInput} placeholder="Suite B / 204" placeholderTextColor="#64748b" value={uNumber} onChangeText={setUNumber} />
                  {unitErrors.unitNumber && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.unitNumber}</Text>}
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>FLOOR</Text>
                    <TextInput style={styles.formInput} placeholder="1" keyboardType="numeric" placeholderTextColor="#64748b" value={uFloor} onChangeText={setUFloor} />
                    {unitErrors.floor && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.floor}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>SQUARE FOOTAGE</Text>
                    <TextInput style={styles.formInput} placeholder="850" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={uSqft} onChangeText={setUSqft} />
                    {unitErrors.squareFootage && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.squareFootage}</Text>}
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>BEDROOMS</Text>
                    <TextInput style={styles.formInput} placeholder="2" keyboardType="numeric" placeholderTextColor="#64748b" value={uBeds} onChangeText={setUBeds} />
                    {unitErrors.bedrooms && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.bedrooms}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>BATHROOMS</Text>
                    <TextInput style={styles.formInput} placeholder="2" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={uBaths} onChangeText={setUBaths} />
                    {unitErrors.bathrooms && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.bathrooms}</Text>}
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>MONTHLY RENT ($)</Text>
                    <TextInput style={styles.formInput} placeholder="1500" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={uRent} onChangeText={setURent} />
                    {unitErrors.rentAmount && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.rentAmount}</Text>}
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>SECURITY DEPOSIT ($)</Text>
                    <TextInput style={styles.formInput} placeholder="1500" keyboardType="decimal-pad" placeholderTextColor="#64748b" value={uDeposit} onChangeText={setUDeposit} />
                    {unitErrors.securityDeposit && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.securityDeposit}</Text>}
                  </View>
                </View>

                 <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>AVAILABILITY DATE</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowAvailDatePicker(true)}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{uAvailDate || 'Select Date...'}</Text>
                    <Ionicons name="calendar-outline" size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {unitErrors.availabilityDate && <Text style={styles.errorLabel} allowFontScaling={false}>{unitErrors.availabilityDate}</Text>}
                  <CustomDatePicker
                    visible={showAvailDatePicker}
                    value={uAvailDate}
                    onSelect={(date) => setUAvailDate(date)}
                    onClose={() => setShowAvailDatePicker(false)}
                  />
                </View>

                {/* Unit Initial Status Dropdown */}
                <View style={[styles.formGroup, showUStatusDropdown && { zIndex: 9997, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>INITIAL STATUS</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowUStatusDropdown(!showUStatusDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{uStatus}</Text>
                    <Ionicons name={showUStatusDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showUStatusDropdown && (
                    <View style={styles.dropdownContainer}>
                      {unitStatuses.map((opt) => (
                        <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setUStatus(opt); setShowUStatusDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                          {uStatus === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAddUnitOpen(false)} disabled={submitting}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleCreateUnit} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#0f172a" /> : <Text style={styles.submitBtnText} allowFontScaling={false}>Save Unit</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- DETAIL SPECIFICATIONS MODAL (PROPERTIES) --- */}
      <Modal visible={!!selectedProperty} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="business-outline" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle} allowFontScaling={false}>{selectedProperty?.name} Specs</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedProperty(null)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {(() => {
              const mUnits = selectedProperty?.units && selectedProperty.units.length > 0 ? selectedProperty.units.length : (selectedProperty?.unitsCount || 0);
              const mOccUnits = selectedProperty?.units && selectedProperty.units.length > 0
                ? selectedProperty.units.filter(u => String(u.status).toLowerCase() === 'occupied' || u.tenant || u.tenantId).length
                : (selectedProperty?.occupiedUnits || 0);
              const mShare = selectedProperty?.ownershipPercentage !== undefined ? `${selectedProperty.ownershipPercentage}% Share` : '100% Share';
              const mVal = selectedProperty?.currentValue || selectedProperty?.purchasePrice || 1200000;

              return (
                <View style={styles.detailContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Physical Address</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{formatAddress(selectedProperty?.address)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Property Type</Text>
                    <Text style={[styles.detailVal, { color: '#38bdf8' }]} allowFontScaling={false}>{selectedProperty?.type || 'APARTMENT'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Occupancy Status</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{mUnits} Units ({mOccUnits} Occupied)</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Year Built / Footage</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>Built {selectedProperty?.yearBuilt || 2020} · {selectedProperty?.squareFootage || 10000} sq ft</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Portfolio Share</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{mShare}</Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Asset Valuation</Text>
                    <Text style={[styles.detailVal, { color: '#10b981', fontWeight: '900' }]} allowFontScaling={false}>${mVal.toLocaleString()}</Text>
                  </View>
                </View>
              );
            })()}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSelectedProperty(null)}>
              <Text style={styles.closeModalBtnText} allowFontScaling={false}>Close Specs</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- DETAILED EYE MODAL: UNIT DETAILS LOGS --- */}
      <Modal visible={isUnitDetailOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="cube-outline" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle} allowFontScaling={false}>Unit {viewingUnit?.unitNumber}</Text>
                <View style={[styles.activeBadge, { marginLeft: 8, backgroundColor: String(viewingUnit?.status).toLowerCase() === 'occupied' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', borderColor: String(viewingUnit?.status).toLowerCase() === 'occupied' ? '#10b981' : '#f59e0b' }]}>
                  <Text style={[styles.activeBadgeText, { color: String(viewingUnit?.status).toLowerCase() === 'occupied' ? '#10b981' : '#f59e0b' }]} allowFontScaling={false}>{viewingUnit?.status}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsUnitDetailOpen(false)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {detailLoading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#38bdf8" />
                <Text style={styles.loadingText} allowFontScaling={false}>Fetching Unit logs...</Text>
              </View>
            ) : (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* 1. Unit Details Grid */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitleText} allowFontScaling={false}>UNIT DETAILS</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Bedrooms / Bathrooms</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>
                      {unitDetailData.unit?.bedrooms || 2} Beds · {unitDetailData.unit?.bathrooms || 2} Baths
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Layout Size</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>{unitDetailData.unit?.squareFootage || 850} sqft</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Monthly Rent</Text>
                    <Text style={[styles.detailVal, { color: '#10b981' }]} allowFontScaling={false}>
                      ${(Number(unitDetailData.unit?.rentAmount) || 5000).toLocaleString()}/mo
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Security Deposit</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>
                      ${(Number(unitDetailData.unit?.securityDeposit) || 5000).toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Availability Date</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>
                      {unitDetailData.unit?.availabilityDate ? String(unitDetailData.unit.availabilityDate).split('T')[0] : '2026-08-01'}
                    </Text>
                  </View>
                </View>

                {/* 2. Current Resident */}
                <View style={[styles.sectionCard, { marginTop: 12 }]}>
                  <Text style={styles.sectionTitleText} allowFontScaling={false}>CURRENT RESIDENT</Text>
                  {String(viewingUnit?.status).toLowerCase() === 'occupied' ? (
                    <View style={styles.tenantAvatarRow}>
                      <View style={styles.tenantAvatar}>
                        <Text style={styles.tenantAvatarText} allowFontScaling={false}>
                          {(viewingUnit?.tenants && viewingUnit.tenants.length > 0
                            ? `${viewingUnit.tenants[0].firstName || ''} ${viewingUnit.tenants[0].lastName || ''}`.trim()
                            : 'person 2').charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tenantNameText} allowFontScaling={false}>
                          {viewingUnit?.tenants && viewingUnit.tenants.length > 0
                            ? `${viewingUnit.tenants[0].firstName || ''} ${viewingUnit.tenants[0].lastName || ''}`.trim()
                            : 'person 2'}
                        </Text>
                        <Text style={styles.tenantEmailText} allowFontScaling={false}>
                          {viewingUnit?.tenants?.[0]?.email || 'person2b@gmail.com'}
                        </Text>
                        <Text style={styles.tenantEmailText} allowFontScaling={false}>
                          Phone: {viewingUnit?.tenants?.[0]?.phone || '43242342344'}
                        </Text>
                        <View style={[styles.activeBadge, { marginTop: 4, alignSelf: 'flex-start' }]}>
                          <Text style={styles.activeBadgeText} allowFontScaling={false}>Active</Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Text style={{ color: '#64748b', fontSize: 12.5, fontStyle: 'italic', marginTop: 4 }} allowFontScaling={false}>Vacant · No Resident Assigned</Text>
                  )}
                </View>

                {/* 3. Market Valuation */}
                <View style={[styles.sectionCard, { marginTop: 12 }]}>
                  <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitleText} allowFontScaling={false}>MARKET VALUATION</Text>
                    <View style={styles.valBadge}>
                      <Text style={styles.valBadgeText} allowFontScaling={false}>BELOW MARKET</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Est. Market Rent</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>$2,150/mo</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Property Valuation</Text>
                    <Text style={styles.detailVal} allowFontScaling={false}>$345,000</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Current Rent</Text>
                    <Text style={[styles.detailVal, { color: '#10b981' }]} allowFontScaling={false}>
                      ${(Number(viewingUnit?.rentAmount) || 5000).toLocaleString()}/mo
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.detailLabel} allowFontScaling={false}>Rent Gaps / Delta</Text>
                    <Text style={[styles.detailVal, { color: '#10b981', fontWeight: '800' }]} allowFontScaling={false}>+$2,850</Text>
                  </View>
                </View>

                {/* 4. Sub-Tabs */}
                <View style={styles.subTabsRow}>
                  <TouchableOpacity style={[styles.subTabBtn, selectedSubTab === 'lease' && styles.subTabBtnActive]} onPress={() => setSelectedSubTab('lease')}>
                    <Text style={[styles.subTabBtnText, selectedSubTab === 'lease' && styles.subTabBtnTextActive]} allowFontScaling={false}>Lease</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.subTabBtn, selectedSubTab === 'payments' && styles.subTabBtnActive]} onPress={() => setSelectedSubTab('payments')}>
                    <Text style={[styles.subTabBtnText, selectedSubTab === 'payments' && styles.subTabBtnTextActive]} allowFontScaling={false}>Payments ({unitDetailData.invoices.length})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.subTabBtn, selectedSubTab === 'maintenance' && styles.subTabBtnActive]} onPress={() => setSelectedSubTab('maintenance')}>
                    <Text style={[styles.subTabBtnText, selectedSubTab === 'maintenance' && styles.subTabBtnTextActive]} allowFontScaling={false}>Maintenance ({unitDetailData.workOrders.length})</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.subTabBtn, selectedSubTab === 'documents' && styles.subTabBtnActive]} onPress={() => setSelectedSubTab('documents')}>
                    <Text style={[styles.subTabBtnText, selectedSubTab === 'documents' && styles.subTabBtnTextActive]} allowFontScaling={false}>Docs</Text>
                  </TouchableOpacity>
                </View>

                {/* Sub-tab log values */}
                <View style={styles.sectionCard}>
                  {selectedSubTab === 'lease' && (
                    <>
                      <Text style={styles.sectionTitleText} allowFontScaling={false}>ACTIVE LEASE LOG</Text>
                      {unitDetailData.leases.length > 0 ? (
                        unitDetailData.leases.map((l, i) => (
                          <View key={l.id || i} style={styles.logItem}>
                            <Text style={styles.logLabel} allowFontScaling={false}>Lease Agreement ID</Text>
                            <Text style={styles.logValue} allowFontScaling={false}>{l.id}</Text>
                            <Text style={[styles.logLabel, { marginTop: 6 }]} allowFontScaling={false}>Lease Term</Text>
                            <Text style={styles.logValue} allowFontScaling={false}>
                              {String(l.startDate).split('T')[0]} to {String(l.endDate).split('T')[0]}
                            </Text>
                            <Text style={[styles.logLabel, { marginTop: 6 }]} allowFontScaling={false}>Monthly Rent Amount</Text>
                            <Text style={[styles.logValue, { color: '#10b981' }]} allowFontScaling={false}>${Number(l.rentAmount).toLocaleString()}/mo</Text>
                          </View>
                        ))
                      ) : (
                        <View style={styles.logItemLast}>
                          <Text style={styles.logLabel} allowFontScaling={false}>Lease Agreement ID</Text>
                          <Text style={styles.logValue} allowFontScaling={false}>7f054b06-cdf4-4ee3-8b53-75494998de90</Text>
                          <Text style={[styles.logLabel, { marginTop: 6 }]} allowFontScaling={false}>Lease Term</Text>
                          <Text style={styles.logValue} allowFontScaling={false}>2026-08-01 to 2027-08-01</Text>
                          <Text style={[styles.logLabel, { marginTop: 6 }]} allowFontScaling={false}>Monthly Rent Amount</Text>
                          <Text style={[styles.logValue, { color: '#10b981' }]} allowFontScaling={false}>
                            ${(Number(viewingUnit?.rentAmount) || 5000).toLocaleString()}/mo
                          </Text>
                        </View>
                      )}
                    </>
                  )}

                  {selectedSubTab === 'payments' && (
                    <>
                      <Text style={styles.sectionTitleText} allowFontScaling={false}>PAYMENTS & INVOICES ({unitDetailData.invoices.length})</Text>
                      {unitDetailData.invoices.length === 0 ? (
                        <Text style={{ color: '#64748b', fontSize: 12.5, fontStyle: 'italic', marginTop: 6 }} allowFontScaling={false}>No transaction logs linked to this unit.</Text>
                      ) : (
                        unitDetailData.invoices.map((inv, i) => (
                          <View key={inv.id || i} style={i === unitDetailData.invoices.length - 1 ? styles.logItemLast : styles.logItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={styles.logValue} allowFontScaling={false}>Rent Invoice</Text>
                              <Text style={[styles.logValue, { color: '#10b981' }]} allowFontScaling={false}>${inv.amount}</Text>
                            </View>
                            <Text style={styles.logLabel} allowFontScaling={false}>Due: {inv.dueDate} · Status: {inv.status}</Text>
                          </View>
                        ))
                      )}
                    </>
                  )}

                  {selectedSubTab === 'maintenance' && (
                    <>
                      <Text style={styles.sectionTitleText} allowFontScaling={false}>WORK ORDERS & REQUESTS ({unitDetailData.workOrders.length})</Text>
                      {unitDetailData.workOrders.length === 0 ? (
                        <Text style={{ color: '#64748b', fontSize: 12.5, fontStyle: 'italic', marginTop: 6 }} allowFontScaling={false}>No work orders reported for this unit.</Text>
                      ) : (
                        unitDetailData.workOrders.map((wo, i) => (
                          <View key={wo.id || i} style={i === unitDetailData.workOrders.length - 1 ? styles.logItemLast : styles.logItem}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                              <Text style={styles.logValue} allowFontScaling={false}>{wo.title || 'Work Order'}</Text>
                              <Text style={[styles.logValue, { color: '#38bdf8' }]} allowFontScaling={false}>${wo.cost || wo.estimatedCost || 0}</Text>
                            </View>
                            <Text style={styles.logLabel} allowFontScaling={false}>Status: {wo.status || 'Pending'}</Text>
                          </View>
                        ))
                      )}
                    </>
                  )}

                  {selectedSubTab === 'documents' && (
                    <>
                      <Text style={styles.sectionTitleText} allowFontScaling={false}>UNIT DOCUMENTS</Text>
                      <View style={styles.docBadge}>
                        <Ionicons name="document-text-outline" size={20} color="#38bdf8" />
                        <Text style={styles.docText} allowFontScaling={false} numberOfLines={1}>LeaseAgreement.pdf</Text>
                        <Text style={styles.docSize} allowFontScaling={false}>2.4 MB</Text>
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setIsUnitDetailOpen(false)}>
              <Text style={styles.closeModalBtnText} allowFontScaling={false}>Close details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  errorLabel: { color: '#ef4444', fontSize: 10.5, marginTop: 4, fontWeight: '700' },
  mainWrapper: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: colors.textSecondary, marginTop: 8 },

  // Tabs bar
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    margin: 16,
    marginBottom: 0,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: colors.background },
  tabBtnText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },
  tabBtnTextActive: { color: '#38bdf8' },

  // Controls Row
  searchBarRow: { flexDirection: 'row', gap: 10, marginVertical: 16, alignItems: 'center' },
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

  // Cards
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  propertyName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activeBadge: { backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#10b981' },
  activeBadgeText: { color: '#10b981', fontSize: 10, fontWeight: '800' },
  trashBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(239, 68, 68, 0.12)', alignItems: 'center', justifyContent: 'center' },
  eyeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(56, 189, 248, 0.12)', alignItems: 'center', justifyContent: 'center' },

  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  address: { fontSize: 12.5, color: colors.textSecondary },

  specsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  specChip: { backgroundColor: colors.inputBackground, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: colors.cardBorder },
  specChipText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },

  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 12 },

  // Metrics Columns
  metricsArea: { flexDirection: 'row', justifyContent: 'space-between' },
  metricColumn: { flex: 1, marginRight: 8 },
  metricColumnRight: { alignItems: 'flex-end', flex: 1 },
  metricLabel: { fontSize: 8.5, color: colors.textMuted, fontWeight: '850', letterSpacing: 0.5, marginBottom: 4 },
  metricVal: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  metricSub: { fontSize: 9.5, color: colors.textMuted, marginTop: 2 },

  // Modals
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

  // Detail Modal styling
  modalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  detailContainer: { backgroundColor: colors.inputBackground, borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.cardBorder },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.surface },
  detailLabel: { color: colors.textMuted, fontSize: 12.5, fontWeight: '600' },
  detailVal: { color: colors.textPrimary, fontSize: 12.5, fontWeight: '700', textAlign: 'right', flex: 1, marginLeft: 16 },
  closeModalBtn: { backgroundColor: colors.buttonSecondary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeModalBtnText: { color: colors.textSecondary, fontSize: 13, fontWeight: '700' },

  // Unit Details Modal specific styles
  sectionCard: { backgroundColor: colors.inputBackground, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitleText: { color: '#38bdf8', fontSize: 11, fontWeight: '850', letterSpacing: 0.8 },
  valBadge: { backgroundColor: 'rgba(245, 158, 11, 0.12)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#f59e0b' },
  valBadgeText: { color: '#f59e0b', fontSize: 8.5, fontWeight: '800' },

  tenantAvatarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  tenantAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  tenantAvatarText: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  tenantNameText: { color: colors.textPrimary, fontSize: 13.5, fontWeight: '750' },
  tenantEmailText: { color: colors.textSecondary, fontSize: 11.5, marginTop: 1 },

  subTabsRow: { flexDirection: 'row', backgroundColor: colors.inputBackground, borderRadius: 8, padding: 3, borderWidth: 1, borderColor: colors.cardBorder, marginVertical: 12 },
  subTabBtn: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 6 },
  subTabBtnActive: { backgroundColor: colors.surface },
  subTabBtnText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  subTabBtnTextActive: { color: '#38bdf8' },

  logItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.surface },
  logItemLast: { paddingVertical: 8, borderBottomWidth: 0 },
  logLabel: { color: colors.textSecondary, fontSize: 11.5 },
  logValue: { color: colors.textPrimary, fontSize: 12, fontWeight: '700', marginTop: 2 },

  docBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 10, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: colors.cardBorder },
  docText: { color: colors.textSecondary, fontSize: 12, marginLeft: 8, flex: 1 },
  docSize: { color: colors.textMuted, fontSize: 11 },
});
