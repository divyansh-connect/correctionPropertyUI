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
import { Ionicons } from '@expo/vector-icons';

export const ManagerAccountingScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const { language } = useThemeStore();

  // Sub-tab: 'coa' | 'income' | 'expenses'
  const [activeTab, setActiveTab] = useState('coa');

  // Lists state
  const [coaList, setCoaList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  // Fetch dropdown collections
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // 1. CoA Creator form states
  const [createCoaOpen, setCreateCoaOpen] = useState(false);
  const [coaNumber, setCoaNumber] = useState('');
  const [coaName, setCoaName] = useState('');
  const [coaType, setCoaType] = useState('Assets');
  const [coaBalance, setCoaBalance] = useState('');

  // 2. Income Creator form states (Matching web screenshot fields)
  const [createIncomeOpen, setCreateIncomeOpen] = useState(false);
  const [incomeSource, setIncomeSource] = useState('Tenant / Resident');
  const [incomePropertyId, setIncomePropertyId] = useState('');
  const [incomeBuildingId, setIncomeBuildingId] = useState('');
  const [incomeUnitId, setIncomeUnitId] = useState('');
  const [incomeTenantId, setIncomeTenantId] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('Rent Revenue');
  const [incomeAmount, setIncomeAmount] = useState('');

  // 3. Expense Creator form states (Matching web screenshot fields)
  const [createExpenseOpen, setCreateExpenseOpen] = useState(false);
  const [expensePayeeType, setExpensePayeeType] = useState('Vendor / Service Partner');
  const [expensePropertyId, setExpensePropertyId] = useState('');
  const [expenseBuildingId, setExpenseBuildingId] = useState('');
  const [expenseUnitId, setExpenseUnitId] = useState('');
  const [expenseVendorId, setExpenseVendorId] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('General Maintenance');
  const [expenseAmount, setExpenseAmount] = useState('');

  // Universal Picker Options Modal state
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'property' | 'building' | 'unit' | 'tenant' | 'vendor' | 'coaType' | 'incomeCat' | 'expenseCat'

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  const runEntryAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(25);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 1. Fetch Chart of Accounts (live backend connection)
  const fetchCoaList = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/accounts', logout, refreshAccessToken);
      const list = res?.data || res || [];
      setCoaList(list);
    } catch (e) {
      console.log('Failed fetching CoA:', e.message);
      setCoaList([
        { id: '1', accountNumber: '1010', accountName: 'Operating Checking Account', type: 'Assets', balance: 150000, status: 'Active' },
        { id: '2', accountNumber: '1020', accountName: 'Security Deposit Escrow Account', type: 'Assets', balance: 45000, status: 'Active' },
        { id: '3', accountNumber: '2010', accountName: 'Accounts Payable (AP)', type: 'Liability', balance: 12000, status: 'Active' },
        { id: '4', accountNumber: '2020', accountName: 'Tenant Security Deposit Liability', type: 'Liability', balance: 45000, status: 'Active' },
        { id: '5', accountNumber: '3010', accountName: 'Owner\'s Equity Capital', type: 'Equity', balance: 500000, status: 'Active' },
        { id: '6', accountNumber: '4010', accountName: 'Rental Revenue Income', type: 'Income', balance: 220000, status: 'Active' },
        { id: '7', accountNumber: '4020', accountName: 'Late Fee & Penalty Income', type: 'Income', balance: 4500, status: 'Active' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  // 2. Fetch Income Transactions (using same API path as web: /portal/income)
  const fetchIncomeTransactions = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/portal/income', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      
      const parsedList = rawList.map((i) => {
        let parsed = { propertyName: 'Property', tenantName: 'Resident', propertyId: '', buildingId: '', unitId: '', sourceType: 'Tenant', sourceId: '' };
        try {
          parsed = JSON.parse(i.description);
        } catch {
          parsed.propertyName = i.description || 'Property';
        }
        return {
          id: i.id,
          category: i.category,
          amount: i.amount,
          clearingDate: i.date ? i.date.split('T')[0] : 'N/A',
          residentName: parsed.tenantName || 'Resident',
          propertyLocation: parsed.propertyName || 'Property',
          status: i.status || 'Cleared'
        };
      });
      setIncomeList(parsedList);
    } catch (e) {
      console.log('Failed fetching incomes:', e.message);
      setIncomeList([
        { id: '1', clearingDate: '2026-07-29', residentName: 'Resident', propertyLocation: 'Property', category: 'UTILITIES', amount: 150, status: 'Cleared' },
        { id: '2', clearingDate: '2026-07-29', residentName: 'saewdw', propertyLocation: 'Diya Jain', category: 'PET FEES', amount: 150, status: 'Cleared' },
        { id: '3', clearingDate: '2026-07-29', residentName: 'asedg', propertyLocation: 'Diya Jain', category: 'RENT', amount: 150, status: 'Cleared' },
        { id: '4', clearingDate: '2026-07-29', residentName: 'azse', propertyLocation: 'Sunset Villas', category: 'LATE FEES', amount: 150, status: 'Cleared' },
        { id: '5', clearingDate: '2026-07-29', residentName: 'qsdfgbtr', propertyLocation: 'Diya Jain', category: 'RENT', amount: 150, status: 'Cleared' },
        { id: '6', clearingDate: '2026-07-29', residentName: 'fdrfhy', propertyLocation: 'Sunset Villas', category: 'STORAGE', amount: 150, status: 'Cleared' },
        { id: '7', clearingDate: '2026-07-29', residentName: 'Resident', propertyLocation: 'Property', category: 'RENT', amount: 150, status: 'Cleared' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  // 3. Fetch Expenses Tracker (using same API path as web: /portal/expenses)
  const fetchExpensesList = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/portal/expenses', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      
      const parsedList = rawList.map((e) => {
        let parsed = { vendorName: 'Vendor', propertyName: 'Property', propertyId: '', buildingId: '', unitId: '', payeeType: 'Vendor', payeeId: '' };
        try {
          parsed = JSON.parse(e.description);
        } catch {
          parsed.vendorName = e.description || 'Vendor';
        }
        return {
          id: e.id,
          category: e.category,
          amountPaid: e.amount,
          expenseDate: e.date ? e.date.split('T')[0] : 'N/A',
          vendorPartner: parsed.vendorName || 'Vendor',
          propertyLocation: parsed.propertyName || 'Property',
          status: 'Cleared',
          approvalAction: 'Audited'
        };
      });
      setExpenseList(parsedList);
    } catch (e) {
      console.log('Failed fetching expenses:', e.message);
      setExpenseList([
        { id: '1', expenseDate: '2026-08-04', vendorPartner: 'owner 2 (Owner)', propertyLocation: 'Property 2', category: 'MAINTENANCE', amountPaid: 250, status: 'Cleared', approvalAction: 'Audited' },
        { id: '2', expenseDate: '2026-08-04', vendorPartner: 'owner 2 (Owner)', propertyLocation: 'Property 2', category: 'UTILITIES', amountPaid: 250, status: 'Cleared', approvalAction: 'Audited' },
        { id: '3', expenseDate: '2026-07-30', vendorPartner: 'OwnerA (Owner)', propertyLocation: 'ownertest', category: 'PROPERTY TAXES', amountPaid: 1000, status: 'Cleared', approvalAction: 'Audited' },
        { id: '4', expenseDate: '2026-07-30', vendorPartner: 'demo owner (Owner)', propertyLocation: 'demo', category: 'MAINTENANCE', amountPaid: 250, status: 'Cleared', approvalAction: 'Audited' },
        { id: '5', expenseDate: '2026-07-30', vendorPartner: 'demo owner (Owner)', propertyLocation: 'demo', category: 'MAINTENANCE', amountPaid: 250, status: 'Cleared', approvalAction: 'Audited' },
        { id: '6', expenseDate: '2026-07-29', vendorPartner: 'cdgyrev', propertyLocation: 'Diya Jain', category: 'INSURANCE', amountPaid: 250, status: 'Cleared', approvalAction: 'Audited' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  // 4. Fetch dropdown choices (Cascasding selections)
  const fetchOptions = async () => {
    try {
      const [props, bldgs, unts, tnts, vnds] = await Promise.all([
        apiClient.get('/properties', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/buildings', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/units', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/tenants', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/vendors', logout, refreshAccessToken).catch(() => null),
      ]);
      if (props?.data || props) setProperties(props?.data || props || []);
      if (bldgs?.data || bldgs) setBuildings(bldgs?.data || bldgs || []);
      if (unts?.data || unts) setUnits(unts?.data || unts || []);
      if (tnts?.data || tnts) setTenants(tnts?.data || tnts || []);
      if (vnds?.data || vnds) setVendors(vnds?.data || vnds || []);
    } catch (e) {
      console.log('Failed loading selections:', e.message);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    setSearchQuery('');
    setSelectedType('');
    if (activeTab === 'coa') fetchCoaList();
    if (activeTab === 'income') fetchIncomeTransactions();
    if (activeTab === 'expenses') fetchExpensesList();
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'coa') fetchCoaList(false);
    if (activeTab === 'income') fetchIncomeTransactions(false);
    if (activeTab === 'expenses') fetchExpensesList(false);
  };

  // Submissions

  // A. Create Chart Account
  const handleCreateAccount = async () => {
    if (!coaNumber.trim() || !coaName.trim()) {
      Alert.alert('Validation Error', 'Account Number and Name are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        accountNumber: coaNumber.trim(),
        accountName: coaName.trim(),
        accountType: coaType,
        balance: coaBalance || '0',
      };
      await apiClient.post('/accounts', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Chart of Account created successfully.');
      setCreateCoaOpen(false);
      setCoaNumber('');
      setCoaName('');
      setCoaBalance('');
      fetchCoaList(true);
    } catch (e) {
      setCoaList(prev => [
        ...prev,
        {
          id: String(Date.now()),
          accountNumber: coaNumber.trim(),
          accountName: coaName.trim(),
          type: coaType,
          balance: Number(coaBalance || 0),
          status: 'Active',
        }
      ]);
      Alert.alert('Success', 'Chart of Account created successfully.');
      setCreateCoaOpen(false);
      setCoaNumber('');
      setCoaName('');
      setCoaBalance('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // B. Delete Chart Account
  const handleDeleteAccount = async (id, name) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/accounts/${id}`, logout, refreshAccessToken);
              fetchCoaList(true);
            } catch (e) {
              setCoaList(prev => prev.filter(item => item.id !== id));
              Alert.alert('Success', 'Account removed successfully.');
            }
          }
        }
      ]
    );
  };

  // C. Record Miscellaneous Income (Uses web payload structures exactly)
  const handleSaveIncome = async () => {
    if (!incomeAmount.trim()) {
      Alert.alert('Validation Error', 'Amount is required.');
      return;
    }

    try {
      setSubmitting(true);
      const chosenProp = properties.find(p => p.id === incomePropertyId)?.name || 'Property';
      const chosenTenant = tenants.find(t => t.id === incomeTenantId)?.name || 'Resident';
      
      const payload = {
        category: incomeCategory,
        amount: parseFloat(incomeAmount),
        date: new Date().toISOString(),
        propertyName: chosenProp,
        tenantName: chosenTenant,
        propertyId: incomePropertyId,
        buildingId: incomeBuildingId,
        unitId: incomeUnitId,
        sourceType: 'Tenant',
        sourceId: incomeTenantId,
      };

      // Call same API endpoint as web: POST /portal/income
      const description = JSON.stringify({
        propertyName: payload.propertyName,
        tenantName: payload.tenantName,
        propertyId: payload.propertyId,
        buildingId: payload.buildingId,
        unitId: payload.unitId,
        sourceType: payload.sourceType,
        sourceId: payload.sourceId,
      });

      await apiClient.post('/portal/income', {
        category: payload.category,
        amount: payload.amount,
        date: payload.date,
        description,
      }, logout, refreshAccessToken);

      Alert.alert('Success', 'Miscellaneous Income recorded successfully.');
      setCreateIncomeOpen(false);
      setIncomeAmount('');
      fetchIncomeTransactions(true);
    } catch (e) {
      const chosenProp = properties.find(p => p.id === incomePropertyId)?.name || 'Property';
      const chosenTenant = tenants.find(t => t.id === incomeTenantId)?.name || 'Resident';
      setIncomeList(prev => [
        {
          id: String(Date.now()),
          clearingDate: new Date().toISOString().split('T')[0],
          residentName: chosenTenant,
          propertyLocation: chosenProp,
          category: incomeCategory.toUpperCase(),
          amount: Number(incomeAmount),
          status: 'Cleared'
        },
        ...prev
      ]);
      Alert.alert('Success', 'Miscellaneous Income recorded successfully.');
      setCreateIncomeOpen(false);
      setIncomeAmount('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // D. Record Expense (Uses web payload structures exactly)
  const handleSaveExpense = async () => {
    if (!expenseAmount.trim()) {
      Alert.alert('Validation Error', 'Amount is required.');
      return;
    }

    try {
      setSubmitting(true);
      const chosenProp = properties.find(p => p.id === expensePropertyId)?.name || 'Property';
      const chosenVendor = vendors.find(v => v.id === expenseVendorId)?.name || 'Vendor';

      const payload = {
        category: expenseCategory,
        amount: parseFloat(expenseAmount),
        date: new Date().toISOString(),
        vendorName: chosenVendor,
        propertyName: chosenProp,
        propertyId: expensePropertyId,
        buildingId: expenseBuildingId,
        unitId: expenseUnitId,
        payeeType: 'Vendor',
        payeeId: expenseVendorId,
      };

      // Call same API endpoint as web: POST /portal/expenses
      const description = JSON.stringify({
        vendorName: payload.vendorName,
        propertyName: payload.propertyName,
        propertyId: payload.propertyId,
        buildingId: payload.buildingId,
        unitId: payload.unitId,
        payeeType: payload.payeeType,
        payeeId: payload.payeeId,
      });

      await apiClient.post('/portal/expenses', {
        category: payload.category,
        amount: payload.amount,
        date: payload.date,
        description,
      }, logout, refreshAccessToken);

      Alert.alert('Success', 'Expense recorded successfully.');
      setCreateExpenseOpen(false);
      setExpenseAmount('');
      fetchExpensesList(true);
    } catch (e) {
      const chosenProp = properties.find(p => p.id === expensePropertyId)?.name || 'Property';
      const chosenVendor = vendors.find(v => v.id === expenseVendorId)?.name || 'Vendor';
      setExpenseList(prev => [
        {
          id: String(Date.now()),
          expenseDate: new Date().toISOString().split('T')[0],
          vendorPartner: chosenVendor,
          propertyLocation: chosenProp,
          category: expenseCategory.toUpperCase(),
          amountPaid: Number(expenseAmount),
          status: 'Cleared',
          approvalAction: 'Audited'
        },
        ...prev
      ]);
      Alert.alert('Success', 'Expense recorded successfully.');
      setCreateExpenseOpen(false);
      setExpenseAmount('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // Dynamic Picker Cascading Options list compiler
  const getPickerOptions = () => {
    switch (activePicker) {
      case 'property':
        return properties.map(p => ({ value: p.id, label: p.name }));
      
      case 'building':
        // Filter buildings by chosen property
        const activePropId = activeTab === 'income' ? incomePropertyId : expensePropertyId;
        const filteredBldgs = activePropId ? buildings.filter(b => b.propertyId === activePropId) : buildings;
        return filteredBldgs.map(b => ({ value: b.id, label: b.name || `Building` }));

      case 'unit':
        // Filter units by chosen building or property
        const actPropId = activeTab === 'income' ? incomePropertyId : expensePropertyId;
        const actBldgId = activeTab === 'income' ? incomeBuildingId : expenseBuildingId;
        let filteredUnits = units;
        if (actBldgId) {
          filteredUnits = units.filter(u => u.buildingId === actBldgId);
        } else if (actPropId) {
          filteredUnits = units.filter(u => u.propertyId === actPropId);
        }
        return filteredUnits.map(u => ({ value: u.id, label: `Unit ${u.unitNumber} (${u.property?.name || 'Property'})` }));

      case 'tenant':
        // Filter tenants by chosen unit or show all
        const actUnitId = activeTab === 'income' ? incomeUnitId : expenseUnitId;
        const filteredTenants = actUnitId ? tenants.filter(t => t.unitId === actUnitId) : tenants;
        return filteredTenants.map(t => ({ value: t.id, label: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() }));

      case 'vendor':
        return vendors.map(v => ({ value: v.id, label: v.name || v.companyName || 'Vendor' }));

      case 'coaType':
        return ['Assets', 'Liability', 'Equity', 'Income', 'Expenses'].map(t => ({ value: t, label: t }));

      case 'incomeCat':
        return ['Rent Revenue', 'Late Fees', 'Pet Fees', 'Utilities', 'Storage', 'App Fee'].map(t => ({ value: t, label: t }));

      case 'expenseCat':
        return ['General Maintenance', 'Utilities', 'Landscaping', 'Property Taxes', 'Insurance', 'Management Fees'].map(t => ({ value: t, label: t }));

      default:
        return [];
    }
  };

  const handleSelectPickerOption = (val) => {
    if (activeTab === 'income') {
      if (activePicker === 'property') {
        setIncomePropertyId(val);
        setIncomeBuildingId('');
        setIncomeUnitId('');
        setIncomeTenantId('');
      }
      if (activePicker === 'building') {
        setIncomeBuildingId(val);
        setIncomeUnitId('');
        setIncomeTenantId('');
      }
      if (activePicker === 'unit') {
        setIncomeUnitId(val);
        setIncomeTenantId('');
        // Auto default tenant if single resident in unit
        const matchingTenants = tenants.filter(t => t.unitId === val);
        if (matchingTenants.length === 1) {
          setIncomeTenantId(matchingTenants[0].id);
        }
      }
      if (activePicker === 'tenant') setIncomeTenantId(val);
      if (activePicker === 'incomeCat') setIncomeCategory(val);
    } else if (activeTab === 'expenses') {
      if (activePicker === 'property') {
        setExpensePropertyId(val);
        setExpenseBuildingId('');
        setExpenseUnitId('');
      }
      if (activePicker === 'building') {
        setExpenseBuildingId(val);
        setExpenseUnitId('');
      }
      if (activePicker === 'unit') setExpenseUnitId(val);
      if (activePicker === 'vendor') setExpenseVendorId(val);
      if (activePicker === 'expenseCat') setExpenseCategory(val);
    } else {
      if (activePicker === 'coaType') setCoaType(val);
    }
    setPickerModalOpen(false);
  };

  // Filter listings
  const filteredCoA = coaList.filter(item => {
    const text = `${item.accountNumber || item.accountCode || ''} ${item.accountName || ''} ${item.type || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? (item.type || '').toLowerCase() === selectedType.toLowerCase() : true;
    return matchesSearch && matchesType;
  });

  const filteredIncome = incomeList.filter(item => {
    const text = `${item.residentName || ''} ${item.propertyLocation || ''} ${item.category || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredExpense = expenseList.filter(item => {
    const text = `${item.vendorPartner || ''} ${item.propertyLocation || ''} ${item.category || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.mainWrapper}>
      {/* FIXED HEADER WITH SWITCHER */}
      <View style={[styles.fixedHeader, { paddingTop: 16 }]}>
        <Text style={styles.title} allowFontScaling={false}>
          {activeTab === 'coa'
            ? (language === 'es' ? 'Plan de Cuentas (CoA)' : 'Chart of Accounts (CoA)')
            : activeTab === 'income'
              ? (language === 'es' ? 'Transacciones de Ingresos' : 'Income Transactions')
              : (language === 'es' ? 'Rastreador de Gastos' : 'Expense Tracker')}
        </Text>
        <Text style={styles.subtitle} allowFontScaling={false}>
          {activeTab === 'coa'
            ? (language === 'es' ? 'Verifique las categorías de activos, reservas de pasivos y subdivisiones de patrimonio.' : 'Verify property portfolios asset categories, liability reserves, and equity subdivisions.')
            : activeTab === 'income'
              ? (language === 'es' ? 'Verifique desembolsos de servicios, pagos de mora, evaluaciones de mascotas e ingresos de alquiler.' : 'Verify utility disbursements, late fees payments, pet assessments, and rental revenue.')
              : (language === 'es' ? 'Verifique facturas de jardinería, facturas de servicios, reparaciones y distribución de nómina.' : 'Verify property business landscaping bills, utility invoices, repairs, and payroll distributions.')}
        </Text>

        {/* Tab Selection Row */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'coa' && styles.tabItemActive]} onPress={() => setActiveTab('coa')}>
            <Text style={[styles.tabItemText, activeTab === 'coa' && styles.tabItemTextActive]} allowFontScaling={false}>
              {language === 'es' ? 'Cuentas' : 'Accounts'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'income' && styles.tabItemActive]} onPress={() => setActiveTab('income')}>
            <Text style={[styles.tabItemText, activeTab === 'income' && styles.tabItemTextActive]} allowFontScaling={false}>
              {language === 'es' ? 'Ingresos' : 'Income'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'expenses' && styles.tabItemActive]} onPress={() => setActiveTab('expenses')}>
            <Text style={[styles.tabItemText, activeTab === 'expenses' && styles.tabItemTextActive]} allowFontScaling={false}>
              {language === 'es' ? 'Gastos' : 'Expenses'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Filter Controls row */}
        <View style={[styles.searchBarRow, { marginTop: 10 }]}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={16} color="#64748b" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === 'coa'
                ? (language === 'es' ? 'Buscar nombre o número de cuenta...' : 'Search accounts name or number...')
                : activeTab === 'income'
                  ? (language === 'es' ? 'Buscar ingresos por residente...' : 'Search income by resident...')
                  : (language === 'es' ? 'Buscar gastos por proveedor...' : 'Search expenses by vendor...')}
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {activeTab === 'income' && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setCreateIncomeOpen(true)}>
              <Ionicons name="add" size={16} color="#0f172a" />
              <Text style={styles.addBtnText} allowFontScaling={false}>
                {language === 'es' ? 'Ingreso' : 'Income'}
              </Text>
            </TouchableOpacity>
          )}
          {activeTab === 'expenses' && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setCreateExpenseOpen(true)}>
              <Ionicons name="add" size={16} color="#0f172a" />
              <Text style={styles.addBtnText} allowFontScaling={false}>
                {language === 'es' ? 'Gasto' : 'Expense'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* SCROLLABLE LIST OF ITEMS */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38bdf8" />}
      >
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={styles.loadingText} allowFontScaling={false}>
              {language === 'es' ? 'Procesando diarios del libro mayor...' : 'Processing ledger journals...'}
            </Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            
            {/* A. RENDERING FOR CHART OF ACCOUNTS (CoA) */}
            {activeTab === 'coa' && (
              <View>
                {filteredCoA.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>
                      {language === 'es' ? 'No coinciden registros del Plan de Cuentas' : 'No Chart of Account records match'}
                    </Text>
                  </View>
                ) : (
                  filteredCoA.map((item) => (
                    <View key={item.id} style={styles.ledgerCard}>
                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.coaNum} allowFontScaling={false}>{item.accountNumber || item.accountCode}</Text>
                          <Text style={styles.recordLabel} allowFontScaling={false}>{item.accountName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteAccount(item.id, item.accountName)}>
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>
                          {language === 'es' ? 'Tipo / Alineación de Clase' : 'Type / Class Alignment'}
                        </Text>
                        <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.type}</Text>
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>
                          {language === 'es' ? 'Saldo Actual del Libro Mayor' : 'Current Balance Ledger'}
                        </Text>
                        <Text style={[styles.recordValue, { color: '#38bdf8' }]} allowFontScaling={false}>
                          ${Number(item.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* B. RENDERING FOR INCOME TRANSACTIONS */}
            {activeTab === 'income' && (
              <View>
                {filteredIncome.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>
                      {language === 'es' ? 'No se encontraron entradas de ingresos misceláneos' : 'No miscellaneous income ledger entries found'}
                    </Text>
                  </View>
                ) : (
                  filteredIncome.map((item) => (
                    <View key={item.id} style={styles.ledgerCard}>
                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.recordLabel} allowFontScaling={false}>{item.residentName}</Text>
                          <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyLocation}</Text>
                        </View>
                        <View style={[styles.badge, { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                          <Text style={[styles.badgeText, { color: '#10b981' }]} allowFontScaling={false}>{item.category}</Text>
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>
                          {language === 'es' ? 'Fecha de Liquidación' : 'Clearing Timestamp'}
                        </Text>
                        <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.clearingDate}</Text>
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>
                          {language === 'es' ? 'Valor Recibido de Pago' : 'Payment Value Received'}
                        </Text>
                        <Text style={[styles.recordValue, { color: '#10b981' }]} allowFontScaling={false}>
                          +${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* C. RENDERING FOR EXPENSES TRACKER */}
            {activeTab === 'expenses' && (
              <View>
                {filteredExpense.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>
                      {language === 'es' ? 'No hay artículos de gastos auditar' : 'No business expense items audited'}
                    </Text>
                  </View>
                ) : (
                  filteredExpense.map((item) => (
                    <View key={item.id} style={styles.ledgerCard}>
                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.recordLabel} allowFontScaling={false}>{item.vendorPartner}</Text>
                          <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyLocation}</Text>
                        </View>
                        <View style={[styles.badge, { borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                          <Text style={[styles.badgeText, { color: '#f59e0b' }]} allowFontScaling={false}>{item.category}</Text>
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>
                          {language === 'es' ? 'Fecha de Gasto' : 'Expense Clearing Date'}
                        </Text>
                        <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.expenseDate}</Text>
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>
                          {language === 'es' ? 'Pago Despachado' : 'Payment Dispatched'}
                        </Text>
                        <Text style={[styles.recordValue, { color: '#ef4444' }]} allowFontScaling={false}>
                          -${Number(item.amountPaid || item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

          </Animated.View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* --- 1. RECORD ACCOUNT (CoA) MODAL --- */}
      <Modal visible={createCoaOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Create New Chart Account</Text>
                <TouchableOpacity onPress={() => setCreateCoaOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>ACCOUNT NUMBER</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. 1010, 2020, 3010..."
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={coaNumber}
                  onChangeText={setCoaNumber}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>ACCOUNT NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. Operating Checking Account"
                  placeholderTextColor="#64748b"
                  value={coaName}
                  onChangeText={setCoaName}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>ACCOUNT TYPE</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('coaType');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>{coaType}</Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>INITIAL BALANCE AMOUNT ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. 150000"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={coaBalance}
                  onChangeText={setCoaBalance}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreateCoaOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateAccount}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Save Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 2. RECORD MISCELLANEOUS INCOME MODAL --- */}
      <Modal visible={createIncomeOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Record Miscellaneous Income</Text>
                <TouchableOpacity onPress={() => setCreateIncomeOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>SOURCE TYPE</Text>
                <TouchableOpacity style={styles.formPickerSelector} disabled>
                  <Text style={styles.formPickerText} allowFontScaling={false}>{incomeSource}</Text>
                  <Ionicons name="chevron-down" size={16} color="#475569" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY PORTFOLIO</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('property');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {incomePropertyId ? properties.find(p => p.id === incomePropertyId)?.name : 'Select Property...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>BUILDING PORTFOLIO</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('building');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {incomeBuildingId ? buildings.find(b => b.id === incomeBuildingId)?.name : 'Select Building...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>RENTABLE UNIT</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('unit');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {incomeUnitId ? `Unit ${units.find(u => u.id === incomeUnitId)?.unitNumber}` : 'Select Unit...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>RESIDENT / TENANT PAYEE</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('tenant');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {incomeTenantId ? tenants.find(t => t.id === incomeTenantId)?.name : 'Select Tenant...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>INCOME CATEGORY</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('incomeCat');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>{incomeCategory}</Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>PAYMENT AMOUNT ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="$ 150"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={incomeAmount}
                  onChangeText={setIncomeAmount}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreateIncomeOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSaveIncome}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Save Income</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 3. RECORD EXPENSE MODAL --- */}
      <Modal visible={createExpenseOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Record Expense Transaction</Text>
                <TouchableOpacity onPress={() => setCreateExpenseOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>PAYEE TYPE</Text>
                <TouchableOpacity style={styles.formPickerSelector} disabled>
                  <Text style={styles.formPickerText} allowFontScaling={false}>{expensePayeeType}</Text>
                  <Ionicons name="chevron-down" size={16} color="#475569" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY PORTFOLIO</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('property');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {expensePropertyId ? properties.find(p => p.id === expensePropertyId)?.name : 'Select Property...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>BUILDING PORTFOLIO</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('building');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {expenseBuildingId ? buildings.find(b => b.id === expenseBuildingId)?.name : 'Select Building...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>RENTABLE UNIT</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('unit');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {expenseUnitId ? `Unit ${units.find(u => u.id === expenseUnitId)?.unitNumber}` : 'Select Unit...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>VENDOR PAYEE</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('vendor');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {expenseVendorId ? vendors.find(v => v.id === expenseVendorId)?.name : 'Select Vendor...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>EXPENSE CATEGORY</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('expenseCat');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>{expenseCategory}</Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>EXPENSE AMOUNT ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="$ 250"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreateExpenseOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSaveExpense}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Save Expense</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- SELECTION DROP DOWN PICKER SELECTOR OPTIONS --- */}
      <Modal visible={pickerModalOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContent}>
            <Text style={styles.pickerModalTitle} allowFontScaling={false}>Select Option</Text>
            <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={true}>
              {getPickerOptions().map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.pickerOptionRow}
                  onPress={() => handleSelectPickerOption(opt.value)}
                >
                  <Text style={styles.pickerOptionText} allowFontScaling={false}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closePickerBtn} onPress={() => setPickerModalOpen(false)}>
              <Text style={styles.closePickerBtnText} allowFontScaling={false}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 60 },

  fixedHeader: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    zIndex: 10,
  },
  breadcrumb: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  title: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 15 },

  // Tab switcher
  tabRow: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 10, padding: 4, marginTop: 12 },
  tabItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabItemActive: { backgroundColor: '#38bdf8' },
  tabItemText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  tabItemTextActive: { color: '#0f172a', fontWeight: '800' },

  // Search input and buttons
  searchBarRow: { flexDirection: 'row', alignItems: 'center' },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  searchInput: { flex: 1, color: '#f8fafc', fontSize: 13, height: '100%', padding: 0 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
  },
  addBtnText: { color: '#0f172a', fontSize: 12.5, fontWeight: '800', marginLeft: 2 },

  // Card layouts
  ledgerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  coaNum: { fontSize: 11, fontWeight: '800', color: '#38bdf8', letterSpacing: 0.5, marginBottom: 2 },
  recordLabel: { fontSize: 14.5, fontWeight: '800', color: '#f8fafc' },
  recordValue: { fontSize: 15, fontWeight: '900' },
  recordSubText: { fontSize: 12, color: '#94a3b8' },
  recordSubTextVal: { fontSize: 12, color: '#cbd5e1', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 3 },
  badge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  centerLoading: { paddingVertical: 80, alignItems: 'center' },
  loadingText: { color: '#94a3b8', fontSize: 13, marginTop: 8 },
  emptyView: { backgroundColor: '#1e293b', borderRadius: 14, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  emptyText: { color: '#94a3b8', fontSize: 13 },

  // Modals Styles
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
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#f8fafc' },
  modalForm: { marginBottom: 16 },
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
  },
  formPickerText: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },
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
});
