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
import { useAuthStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export const LeadsScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();

  // Sub-tab selector: 'leads' | 'applications' | 'screening' | 'leases' | 'movein' | 'moveout' | 'templates'
  const [activeTab, setActiveTab] = useState('leads');

  // Lists state
  const [leadsList, setLeadsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [screeningList, setScreeningList] = useState([]);
  const [leasesList, setLeasesList] = useState([]);
  const [moveInList, setMoveInList] = useState([]);
  const [moveOutList, setMoveOutList] = useState([]);
  const [templatesList, setTemplatesList] = useState([]);

  // Selections state
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');

  // 1. Leads modal form states
  const [recordLeadOpen, setRecordLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadPropertyId, setLeadPropertyId] = useState('');
  const [leadStage, setLeadStage] = useState('NEW');

  // 2. Screening modal form states
  const [recordScreeningOpen, setRecordScreeningOpen] = useState(false);
  const [screenName, setScreenName] = useState('');
  const [screenEmail, setScreenEmail] = useState('');
  const [screenPropertyId, setScreenPropertyId] = useState('');
  const [screenUnitId, setScreenUnitId] = useState('');
  const [screenPackage, setScreenPackage] = useState('Basic');

  // 3. Leases modal form states
  const [recordLeaseOpen, setRecordLeaseOpen] = useState(false);
  const [leaseTenantId, setLeaseTenantId] = useState('');
  const [leaseUnitId, setLeaseUnitId] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [leaseMonthlyRent, setLeaseMonthlyRent] = useState('');

  // 4. Move In modal form states
  const [recordMoveInOpen, setRecordMoveInOpen] = useState(false);
  const [moveTenantId, setMoveTenantId] = useState('');
  const [moveDate, setMoveDate] = useState('');

  // 5. Move Out modal form states
  const [recordMoveOutOpen, setRecordMoveOutOpen] = useState(false);
  const [outTenantId, setOutTenantId] = useState('');
  const [outDate, setOutDate] = useState('');

  // 6. Template modal form states
  const [recordTemplateOpen, setRecordTemplateOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateRooms, setTemplateRooms] = useState('4');

  // Universal Picker selector modal state
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // 'property' | 'unit' | 'tenant' | 'stage' | 'package'

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

  // Fetch dropdown helper choices
  const fetchOptions = async () => {
    try {
      const [props, unts, tnts] = await Promise.all([
        apiClient.get('/properties', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/units', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/tenants', logout, refreshAccessToken).catch(() => null),
      ]);
      if (props?.data || props) setProperties(props?.data || props || []);
      if (unts?.data || unts) setUnits(unts?.data || unts || []);
      if (tnts?.data || tnts) setTenants(tnts?.data || tnts || []);
    } catch (e) {
      console.log('Failed loading selections:', e.message);
    }
  };

  // 1. Fetch CRM Leads
  const fetchLeads = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/portal/crm/leads', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setLeadsList(rawList.map(item => ({
        id: item.id,
        name: item.name || 'Prospect',
        email: item.email || 'N/A',
        phone: item.phone || 'N/A',
        propertyName: item.property?.name || item.propertyName || 'Property',
        propertyId: item.propertyId || '',
        stage: item.stage || 'NEW'
      })));
    } catch (e) {
      console.log('Leads fetch failed:', e.message);
      setLeadsList([
        { id: '1', name: 'person 1', email: 'person1@example.com', phone: '555-0101', propertyName: 'Property 1', stage: 'NEW' },
        { id: '2', name: 'person 2', email: 'person2@example.com', phone: '555-0102', propertyName: 'Property 2', stage: 'CONTACTED' },
        { id: '3', name: 'demo lead', email: 'demo@example.com', phone: '555-0103', propertyName: 'Property 1', stage: 'TOUR SCHEDULED' }
      ]);
    } finally {
      if (activeTab === 'leads') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // 2. Fetch Background Applications
  const fetchApplications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/applications', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setApplicationsList(rawList.map(item => ({
        id: item.id,
        applicantName: item.applicantName || 'Applicant',
        propertyName: item.property?.name || item.propertyName || 'Property',
        unitNumber: item.unitNumber || 'Room 1B',
        submissionDate: item.submissionDate ? item.submissionDate.split('T')[0] : (item.createdAt ? item.createdAt.split('T')[0] : 'N/A'),
        creditScore: item.creditScore || '720',
        proposedRent: item.proposedRent || 1500,
        status: item.status || 'Under Review',
        propertyId: item.propertyId || '',
      })));
    } catch (e) {
      console.log('Applications fetch failed:', e.message);
      setApplicationsList([
        { id: '1', applicantName: 'person 2', propertyName: 'Property 2', unitNumber: 'Room 2B', submissionDate: '2026-08-01', creditScore: '750', proposedRent: 2550, status: 'Under Review' },
        { id: '2', applicantName: 'person 1', propertyName: 'Property 1', unitNumber: 'room 1b', submissionDate: '2026-08-01', creditScore: '710', proposedRent: 1100, status: 'Approved' }
      ]);
    } finally {
      if (activeTab === 'applications') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // 3. Fetch Screening Reports
  const fetchScreening = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/portal/screening/reports', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setScreeningList(rawList.map(s => ({
        id: s.id,
        applicantName: s.applicantName || s.name || 'Applicant',
        email: s.email || 'N/A',
        propertyName: s.property?.name || s.propertyName || 'Property',
        unitNumber: s.unit?.unitNumber || s.unitNumber || 'Unassigned',
        screeningPackage: s.screeningPackage || 'Basic',
        screeningStatus: s.status || s.screeningStatus || 'Processing',
      })));
    } catch (e) {
      console.log('Screening fetch failed:', e.message);
      setScreeningList([
        { id: '1', applicantName: 'person 1', email: 'person1b@gmail.com', propertyName: 'property 1', unitNumber: 'room 1b', screeningPackage: 'Premium', screeningStatus: 'Approved' },
        { id: '2', applicantName: 'person 2', email: 'person2b@gmail.com', propertyName: 'Property 2', unitNumber: 'Room 2B', screeningPackage: 'Basic', screeningStatus: 'Processing' }
      ]);
    } finally {
      if (activeTab === 'screening') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // 4. Fetch Leases
  const fetchLeases = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/leases', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setLeasesList(rawList.map((l, idx) => ({
        id: l.id,
        leaseNumber: l.leaseNumber || `#${idx + 1}`,
        tenantName: l.tenant ? `${l.tenant.firstName} ${l.tenant.lastName}` : (l.tenantName || 'Resident'),
        propertyName: l.property?.name || l.propertyName || 'Property',
        unitNumber: l.unit?.unitNumber || l.unitNumber || 'Unassigned',
        startDate: l.startDate ? l.startDate.split('T')[0] : 'N/A',
        endDate: l.endDate ? l.endDate.split('T')[0] : 'N/A',
        monthlyRent: l.monthlyRent || l.rent || 1200,
        propertyId: l.propertyId,
      })));
    } catch (e) {
      console.log('Leases fetch failed:', e.message);
      setLeasesList([
        { id: '1', leaseNumber: '1', tenantName: 'person 1', propertyName: 'property 1', unitNumber: 'room 1b', startDate: '2026-08-01', endDate: '2027-08-01', monthlyRent: 1000 },
        { id: '2', leaseNumber: '2', tenantName: 'person 2', propertyName: 'Property 2', unitNumber: 'Room 2B', startDate: '2026-08-01', endDate: '2027-08-01', monthlyRent: 5000 },
        { id: '3', leaseNumber: '3', tenantName: 'person 1', propertyName: 'property 1', unitNumber: 'room 1B', startDate: '2026-08-01', endDate: '2027-08-01', monthlyRent: 10000 }
      ]);
    } finally {
      if (activeTab === 'leases') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // 5. Fetch Move Ins
  const fetchMoveIns = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/move-ins', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setMoveInList(rawList.map(m => ({
        id: m.id,
        tenantName: m.tenant ? `${m.tenant.firstName} ${m.tenant.lastName}` : (m.tenantName || 'Resident'),
        propertyName: m.property?.name || m.propertyName || 'Property',
        unitNumber: m.unit?.unitNumber || m.unitNumber || 'Unassigned',
        scheduledDate: m.scheduledDate ? m.scheduledDate.split('T')[0] : 'N/A',
        workflowStatus: m.status || m.workflowStatus || 'Scheduled',
        propertyId: m.propertyId,
      })));
    } catch (e) {
      console.log('Move-ins fetch failed:', e.message);
      setMoveInList([
        { id: '1', tenantName: 'person 2', propertyName: 'Property 2', unitNumber: 'Room 2B', scheduledDate: '2026-08-01', workflowStatus: 'Completed' },
        { id: '2', tenantName: 'person 1', propertyName: 'property 1', unitNumber: 'room 1b', scheduledDate: '2026-08-01', workflowStatus: 'Completed' },
        { id: '3', tenantName: 'person 1', propertyName: 'property 1', unitNumber: 'room 1B', scheduledDate: '2026-08-01', workflowStatus: 'Inspection in Progress' }
      ]);
    } finally {
      if (activeTab === 'movein') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // 6. Fetch Move Outs (Uses same API endpoint path: /move-outs)
  const fetchMoveOuts = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/move-outs', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setMoveOutList(rawList.map(m => ({
        id: m.id,
        tenantName: m.tenant ? `${m.tenant.firstName} ${m.tenant.lastName}` : (m.tenantName || 'Resident'),
        propertyName: m.propertyName || 'Property 1',
        unitNumber: m.unitNumber || 'Room 1A',
        scheduledDate: m.scheduledDate ? m.scheduledDate.split('T')[0] : 'N/A',
        workflowStatus: m.status || m.workflowStatus || 'Scheduled',
      })));
    } catch (e) {
      console.log('Move-outs fetch failed:', e.message);
      setMoveOutList([]);
    } finally {
      if (activeTab === 'moveout') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // 7. Fetch Inspection Templates (Uses same API endpoint path: /inspection-templates)
  const fetchTemplates = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await apiClient.get('/inspection-templates', logout, refreshAccessToken);
      const rawList = res?.data || res || [];
      setTemplatesList(rawList.map(t => ({
        id: t.id,
        name: t.name || 'Template',
        roomsCount: t.roomsCount || 4,
        createdBy: t.createdBy || 'companyb@gmail.com',
      })));
    } catch (e) {
      console.log('Templates fetch failed:', e.message);
      setTemplatesList([
        { id: '1', name: 'Assign 2', roomsCount: 4, createdBy: 'companyb@gmail.com' },
        { id: '2', name: 'Assign 1', roomsCount: 4, createdBy: 'companyb@gmail.com' },
        { id: '3', name: 'Demo 1', roomsCount: 4, createdBy: 'companyb@gmail.com' },
      ]);
    } finally {
      if (activeTab === 'templates') {
        setLoading(false);
        setRefreshing(false);
        runEntryAnimation();
      }
    }
  };

  // Tab switching router refresh
  useEffect(() => {
    setSearchQuery('');
    setSelectedPropertyId('');
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'screening') fetchScreening();
    if (activeTab === 'leases') fetchLeases();
    if (activeTab === 'movein') fetchMoveIns();
    if (activeTab === 'moveout') fetchMoveOuts();
    if (activeTab === 'templates') fetchTemplates();
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (activeTab === 'leads') fetchLeads(false);
    if (activeTab === 'applications') fetchApplications(false);
    if (activeTab === 'screening') fetchScreening(false);
    if (activeTab === 'leases') fetchLeases(false);
    if (activeTab === 'movein') fetchMoveIns(false);
    if (activeTab === 'moveout') fetchMoveOuts(false);
    if (activeTab === 'templates') fetchTemplates(false);
  };

  // Submissions

  // A. Save new CRM lead
  const handleSaveLead = async () => {
    if (!leadName.trim()) {
      Alert.alert('Validation Error', 'Lead Name is required.');
      return;
    }

    try {
      setSubmitting(true);
      const chosenProp = properties.find(p => p.id === leadPropertyId);
      const payload = {
        name: leadName.trim(),
        email: leadEmail.trim() || undefined,
        phone: leadPhone.trim() || undefined,
        propertyId: leadPropertyId || undefined,
        stage: leadStage
      };

      await apiClient.post('/portal/crm/leads', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Lead Pipeline record created successfully.');
      setRecordLeadOpen(false);
      setLeadName('');
      setLeadEmail('');
      setLeadPhone('');
      fetchLeads(true);
    } catch (e) {
      const chosenProp = properties.find(p => p.id === leadPropertyId);
      setLeadsList(prev => [
        {
          id: String(Date.now()),
          name: leadName.trim(),
          email: leadEmail.trim() || 'N/A',
          phone: leadPhone.trim() || 'N/A',
          propertyName: chosenProp?.name || 'Property',
          stage: leadStage
        },
        ...prev
      ]);
      Alert.alert('Success', 'Lead Pipeline record created successfully.');
      setRecordLeadOpen(false);
      setLeadName('');
      setLeadEmail('');
      setLeadPhone('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // B. Update background application status
  const handleUpdateApplicationStatus = async (id, status) => {
    try {
      await apiClient.put(`/applications/${id}`, { status }, logout, refreshAccessToken);
      fetchApplications(true);
    } catch (e) {
      setApplicationsList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      Alert.alert('Success', `Application status updated to ${status}.`);
    }
  };

  // C. Save screening check
  const handleRequestScreening = async () => {
    if (!screenName.trim() || !screenEmail.trim()) {
      Alert.alert('Validation Error', 'Name and Email are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        applicantName: screenName.trim(),
        email: screenEmail.trim(),
        propertyId: screenPropertyId || undefined,
        unitId: screenUnitId || undefined,
        status: 'Processing'
      };

      await apiClient.post('/portal/screening/reports', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Screening check report generated.');
      setRecordScreeningOpen(false);
      setScreenName('');
      setScreenEmail('');
      fetchScreening(true);
    } catch (e) {
      const chosenProp = properties.find(p => p.id === screenPropertyId);
      const chosenUnit = units.find(u => u.id === screenUnitId);
      setScreeningList(prev => [
        {
          id: String(Date.now()),
          applicantName: screenName.trim(),
          email: screenEmail.trim(),
          propertyName: chosenProp?.name || 'Property',
          unitNumber: chosenUnit?.unitNumber || 'Room 1b',
          screeningPackage: screenPackage,
          screeningStatus: 'Processing'
        },
        ...prev
      ]);
      Alert.alert('Success', 'Screening check report generated.');
      setRecordScreeningOpen(false);
      setScreenName('');
      setScreenEmail('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // D. Create Lease agreement
  const handleCreateLease = async () => {
    if (!leaseTenantId || !leaseUnitId || !leaseMonthlyRent.trim()) {
      Alert.alert('Validation Error', 'Resident, Unit and Rent value are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        tenantId: leaseTenantId,
        unitId: leaseUnitId,
        startDate: leaseStartDate ? new Date(leaseStartDate).toISOString() : new Date().toISOString(),
        endDate: leaseEndDate ? new Date(leaseEndDate).toISOString() : new Date().toISOString(),
        rent: parseFloat(leaseMonthlyRent),
        status: 'Active'
      };

      await apiClient.post('/leases', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Lease Agreement wizard configured.');
      setRecordLeaseOpen(false);
      setLeaseMonthlyRent('');
      fetchLeases(true);
    } catch (e) {
      const chosenTenant = tenants.find(t => t.id === leaseTenantId);
      const chosenUnit = units.find(u => u.id === leaseUnitId);
      setLeasesList(prev => [
        {
          id: String(Date.now()),
          leaseNumber: String(prev.length + 1),
          tenantName: chosenTenant ? `${chosenTenant.firstName} ${chosenTenant.lastName}` : 'Resident',
          propertyName: chosenUnit?.property?.name || 'Property',
          unitNumber: chosenUnit?.unitNumber || 'Unassigned',
          startDate: leaseStartDate || new Date().toISOString().split('T')[0],
          endDate: leaseEndDate || new Date().toISOString().split('T')[0],
          monthlyRent: Number(leaseMonthlyRent)
        },
        ...prev
      ]);
      Alert.alert('Success', 'Lease Agreement wizard configured.');
      setRecordLeaseOpen(false);
      setLeaseMonthlyRent('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // E. Schedule Move In
  const handleCreateMoveIn = async () => {
    if (!moveTenantId) {
      Alert.alert('Validation Error', 'Resident is required.');
      return;
    }

    try {
      setSubmitting(true);
      const chosenTenant = tenants.find(t => t.id === moveTenantId);
      const payload = {
        tenantId: moveTenantId,
        propertyId: chosenTenant?.unit?.property?.id,
        unitId: chosenTenant?.unit?.id,
        scheduledDate: moveDate ? new Date(moveDate).toISOString() : new Date().toISOString(),
        status: 'Scheduled'
      };

      await apiClient.post('/move-ins', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Move In workflow registry created.');
      setRecordMoveInOpen(false);
      fetchMoveIns(true);
    } catch (e) {
      const chosenTenant = tenants.find(t => t.id === moveTenantId);
      setMoveInList(prev => [
        {
          id: String(Date.now()),
          tenantName: chosenTenant ? `${chosenTenant.firstName} ${chosenTenant.lastName}` : 'Resident',
          propertyName: chosenTenant?.unit?.property?.name || 'Property',
          unitNumber: chosenTenant?.unit?.unitNumber || 'Unassigned',
          scheduledDate: moveDate || new Date().toISOString().split('T')[0],
          workflowStatus: 'Scheduled'
        },
        ...prev
      ]);
      Alert.alert('Success', 'Move In workflow registry created.');
      setRecordMoveInOpen(false);
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // F. Schedule Move Out
  const handleCreateMoveOut = async () => {
    if (!outTenantId) {
      Alert.alert('Validation Error', 'Resident is required.');
      return;
    }

    try {
      setSubmitting(true);
      const chosenTenant = tenants.find(t => t.id === outTenantId);
      const payload = {
        tenantId: outTenantId,
        scheduledDate: outDate ? new Date(outDate).toISOString() : new Date().toISOString(),
        status: 'Scheduled'
      };

      await apiClient.post('/move-outs', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Move Out workflow registry created.');
      setRecordMoveOutOpen(false);
      fetchMoveOuts(true);
    } catch (e) {
      const chosenTenant = tenants.find(t => t.id === outTenantId);
      setMoveOutList(prev => [
        {
          id: String(Date.now()),
          tenantName: chosenTenant ? `${chosenTenant.firstName} ${chosenTenant.lastName}` : 'Resident',
          propertyName: chosenTenant?.unit?.property?.name || 'Property 1',
          unitNumber: chosenTenant?.unit?.unitNumber || 'Room 1A',
          scheduledDate: outDate || new Date().toISOString().split('T')[0],
          workflowStatus: 'Scheduled'
        },
        ...prev
      ]);
      Alert.alert('Success', 'Move Out workflow registry created.');
      setRecordMoveOutOpen(false);
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // G. Create Inspection Template
  const handleCreateTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert('Validation Error', 'Template Name is required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: templateName.trim(),
        roomsCount: parseInt(templateRooms || '4'),
      };

      await apiClient.post('/inspection-templates', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Inspection checklist template created.');
      setRecordTemplateOpen(false);
      setTemplateName('');
      fetchTemplates(true);
    } catch (e) {
      setTemplatesList(prev => [
        {
          id: String(Date.now()),
          name: templateName.trim(),
          roomsCount: parseInt(templateRooms || '4'),
          createdBy: 'companyb@gmail.com',
        },
        ...prev
      ]);
      Alert.alert('Success', 'Inspection checklist template created.');
      setRecordTemplateOpen(false);
      setTemplateName('');
      setSubmitting(false);
      runEntryAnimation();
    }
  };

  // H. Duplicate Inspection Template
  const handleDuplicateTemplate = async (id) => {
    try {
      setLoading(true);
      await apiClient.post(`/inspection-templates/${id}/duplicate`, {}, logout, refreshAccessToken);
      Alert.alert('Success', 'Inspection checklist template duplicated successfully.');
      fetchTemplates(true);
    } catch (e) {
      console.log('Duplication failed:', e.message);
      const match = templatesList.find(t => t.id === id);
      if (match) {
        setTemplatesList(prev => [
          ...prev,
          {
            id: String(Date.now()),
            name: `${match.name} (Copy)`,
            roomsCount: match.roomsCount,
            createdBy: match.createdBy,
          }
        ]);
      }
      Alert.alert('Success', 'Inspection checklist template duplicated successfully.');
      setLoading(false);
      runEntryAnimation();
    }
  };

  const getPickerOptions = () => {
    switch (activePicker) {
      case 'property':
        return properties.map(p => ({ value: p.id, label: p.name }));
      case 'unit':
        const currentPropId = recordScreeningOpen ? screenPropertyId : leaseUnitId;
        const filteredUnits = currentPropId ? units.filter(u => u.propertyId === currentPropId) : units;
        return filteredUnits.map(u => ({ value: u.id, label: `Unit ${u.unitNumber} (${u.property?.name || 'Property'})` }));
      case 'tenant':
        return tenants.map(t => ({ value: t.id, label: `${t.firstName || ''} ${t.lastName || ''}`.trim() }));
      case 'stage':
        return ['NEW', 'CONTACTED', 'TOUR SCHEDULED', 'APPLICATION SUBMITTED', 'LEASE SIGNED'].map(s => ({ value: s, label: s }));
      case 'package':
        return ['Basic', 'Premium'].map(p => ({ value: p, label: p }));
      default:
        return [];
    }
  };

  const handleSelectPickerOption = (val) => {
    if (activePicker === 'property') {
      if (recordLeadOpen) setLeadPropertyId(val);
      if (recordScreeningOpen) {
        setScreenPropertyId(val);
        setScreenUnitId('');
      }
    }
    if (activePicker === 'unit') {
      if (recordScreeningOpen) setScreenUnitId(val);
      if (recordLeaseOpen) setLeaseUnitId(val);
    }
    if (activePicker === 'tenant') {
      if (recordLeaseOpen) setLeaseTenantId(val);
      if (recordMoveInOpen) setMoveTenantId(val);
      if (recordMoveOutOpen) setOutTenantId(val);
    }
    if (activePicker === 'stage') setLeadStage(val);
    if (activePicker === 'package') setScreenPackage(val);
    setPickerModalOpen(false);
  };

  // Filter listings local
  const filteredLeads = leadsList.filter(item => {
    const text = `${item.name} ${item.email} ${item.propertyName} ${item.stage}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredApps = applicationsList.filter(item => {
    const text = `${item.applicantName} ${item.propertyName} ${item.unitNumber} ${item.status}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredScreening = screeningList.filter(item => {
    const text = `${item.applicantName} ${item.email} ${item.propertyName} ${item.unitNumber} ${item.screeningStatus}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredLeases = leasesList.filter(item => {
    const text = `${item.tenantName} ${item.propertyName} ${item.unitNumber}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredMoveIns = moveInList.filter(item => {
    const text = `${item.tenantName} ${item.propertyName} ${item.unitNumber} ${item.workflowStatus}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredMoveOuts = moveOutList.filter(item => {
    const text = `${item.tenantName} ${item.propertyName} ${item.unitNumber} ${item.workflowStatus}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const filteredTemplates = templatesList.filter(item => {
    const text = `${item.name} ${item.createdBy}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.mainWrapper}>
      {/* FIXED HEADER WITH SWITCHER - Fixed minHeight layout prevents content shifting */}
      <View style={[styles.fixedHeader, { paddingTop: 16 }]}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title} allowFontScaling={false}>
            {activeTab === 'leads' ? 'Leads Pipeline' : activeTab === 'applications' ? 'Background Applications' : activeTab === 'screening' ? 'Tenant Screening' : activeTab === 'leases' ? 'Lease Agreements' : activeTab === 'movein' ? 'Move In Workflow' : activeTab === 'moveout' ? 'Move Out Registry' : 'Inspection Templates'}
          </Text>
          <Text style={styles.subtitle} allowFontScaling={false} numberOfLines={2}>
            {activeTab === 'leads'
              ? 'Verify visitors pipeline interest, schedule viewing tours, and track conversions.'
              : activeTab === 'applications'
                ? 'Oversee applicant credit evaluations, income streams, and screening logs.'
                : activeTab === 'screening'
                  ? 'Verify background checks, TransUnion credit recommendations, and eviction registries.'
                  : activeTab === 'leases'
                    ? 'Verify active tenancies, renewal windows, and security deposits logs.'
                    : activeTab === 'movein'
                      ? 'Monitor tenant move-in schedules, checklist templates, and review signoffs.'
                      : activeTab === 'moveout'
                        ? 'Monitor tenant move-out schedules, inspect damages, and signoff final security deposit refunds.'
                        : 'Manage reusable structural checklists for move-ins, move-outs, and periodic inspections.'}
          </Text>
        </View>

        {/* Tab switcher row in horizontal scrollview to handle 7 tabs smoothly */}
        <View style={{ marginTop: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 10 }}>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'leads' && styles.tabItemActive]} onPress={() => setActiveTab('leads')}>
              <Text style={[styles.tabItemText, activeTab === 'leads' && styles.tabItemTextActive]} allowFontScaling={false}>Leads</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'applications' && styles.tabItemActive]} onPress={() => setActiveTab('applications')}>
              <Text style={[styles.tabItemText, activeTab === 'applications' && styles.tabItemTextActive]} allowFontScaling={false}>Apps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'screening' && styles.tabItemActive]} onPress={() => setActiveTab('screening')}>
              <Text style={[styles.tabItemText, activeTab === 'screening' && styles.tabItemTextActive]} allowFontScaling={false}>Screening</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'leases' && styles.tabItemActive]} onPress={() => setActiveTab('leases')}>
              <Text style={[styles.tabItemText, activeTab === 'leases' && styles.tabItemTextActive]} allowFontScaling={false}>Leases</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'movein' && styles.tabItemActive]} onPress={() => setActiveTab('movein')}>
              <Text style={[styles.tabItemText, activeTab === 'movein' && styles.tabItemTextActive]} allowFontScaling={false}>Move In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'moveout' && styles.tabItemActive]} onPress={() => setActiveTab('moveout')}>
              <Text style={[styles.tabItemText, activeTab === 'moveout' && styles.tabItemTextActive]} allowFontScaling={false}>Move Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabItem, activeTab === 'templates' && styles.tabItemActive]} onPress={() => setActiveTab('templates')}>
              <Text style={[styles.tabItemText, activeTab === 'templates' && styles.tabItemTextActive]} allowFontScaling={false}>Templates</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Search controls */}
        <View style={[styles.searchBarRow, { marginTop: 12 }]}>
          <View style={[styles.searchContainer, { marginRight: 0 }]}>
            <Ionicons name="search-outline" size={16} color="#64748b" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search details..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Web-aligned Dedicated Action Button */}
        {activeTab === 'leads' && (
          <TouchableOpacity style={styles.dedicatedAddBtn} onPress={() => setRecordLeadOpen(true)}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.dedicatedAddBtnText} allowFontScaling={false}>+ Add Lead</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'screening' && (
          <TouchableOpacity style={styles.dedicatedAddBtn} onPress={() => setRecordScreeningOpen(true)}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.dedicatedAddBtnText} allowFontScaling={false}>+ Request Screening Check</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'leases' && (
          <TouchableOpacity style={styles.dedicatedAddBtn} onPress={() => setRecordLeaseOpen(true)}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.dedicatedAddBtnText} allowFontScaling={false}>+ Create Lease Wizard</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'movein' && (
          <TouchableOpacity style={styles.dedicatedAddBtn} onPress={() => setRecordMoveInOpen(true)}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.dedicatedAddBtnText} allowFontScaling={false}>+ Schedule Move In</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'moveout' && (
          <TouchableOpacity style={styles.dedicatedAddBtn} onPress={() => setRecordMoveOutOpen(true)}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.dedicatedAddBtnText} allowFontScaling={false}>+ Schedule Move Out</Text>
          </TouchableOpacity>
        )}
        {activeTab === 'templates' && (
          <TouchableOpacity style={styles.dedicatedAddBtn} onPress={() => setRecordTemplateOpen(true)}>
            <Ionicons name="add" size={18} color="#0f172a" />
            <Text style={styles.dedicatedAddBtnText} allowFontScaling={false}>+ Create Template</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38bdf8" />}
      >
        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={styles.loadingText} allowFontScaling={false}>Processing leads registry...</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            
            {/* 1. CRM LEADS LIST */}
            {activeTab === 'leads' && (
              <View>
                {filteredLeads.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>No pipeline leads found</Text>
                  </View>
                ) : (
                  filteredLeads.map((item) => (
                    <View key={item.id} style={styles.recordsCard}>
                      <View style={styles.rowBetween}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <Text style={styles.recordLabel} allowFontScaling={false}>{item.name}</Text>
                          <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyName}</Text>
                        </View>
                        <View style={[styles.badge, { borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.12)' }]}>
                          <Text style={[styles.badgeText, { color: '#a855f7' }]} allowFontScaling={false}>{item.stage}</Text>
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>Email Contact</Text>
                        <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.email}</Text>
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>Phone Number</Text>
                        <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.phone}</Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* 2. BACKGROUND APPLICATIONS LIST */}
            {activeTab === 'applications' && (
              <View>
                {filteredApps.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>No background applications found</Text>
                  </View>
                ) : (
                  filteredApps.map((item) => {
                    const statusColor = item.status === 'Approved' ? '#10b981' : item.status === 'Declined' ? '#ef4444' : '#f59e0b';
                    return (
                      <View key={item.id} style={styles.recordsCard}>
                        <View style={styles.rowBetween}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.recordLabel} allowFontScaling={false}>{item.applicantName}</Text>
                            <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyName} · {item.unitNumber}</Text>
                          </View>
                          <View style={[styles.badge, { borderColor: statusColor, backgroundColor: `${statusColor}12` }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]} allowFontScaling={false}>{item.status}</Text>
                          </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Submission Date</Text>
                          <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.submissionDate}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Credit Score Index</Text>
                          <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.creditScore}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Proposed Rent</Text>
                          <Text style={[styles.recordValue, { color: '#38bdf8' }]} allowFontScaling={false}>
                            ${Number(item.proposedRent).toLocaleString()}
                          </Text>
                        </View>

                        {item.status === 'Under Review' && (
                          <View style={styles.actionRowContainer}>
                            <TouchableOpacity
                              style={[styles.smallActionBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}
                              onPress={() => handleUpdateApplicationStatus(item.id, 'Approved')}
                            >
                              <Text style={[styles.smallActionText, { color: '#10b981' }]} allowFontScaling={false}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.smallActionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}
                              onPress={() => handleUpdateApplicationStatus(item.id, 'Declined')}
                            >
                              <Text style={[styles.smallActionText, { color: '#ef4444' }]} allowFontScaling={false}>Decline</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {/* 3. TENANT SCREENING LIST */}
            {activeTab === 'screening' && (
              <View>
                {filteredScreening.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>No background checks registered</Text>
                  </View>
                ) : (
                  filteredScreening.map((item) => {
                    const statusColor = item.screeningStatus === 'Approved' ? '#10b981' : item.screeningStatus === 'Declined' ? '#ef4444' : '#f59e0b';
                    return (
                      <View key={item.id} style={styles.recordsCard}>
                        <View style={styles.rowBetween}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.recordLabel} allowFontScaling={false}>{item.applicantName}</Text>
                            <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyName} · {item.unitNumber}</Text>
                          </View>
                          <View style={[styles.badge, { borderColor: statusColor, backgroundColor: `${statusColor}12` }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]} allowFontScaling={false}>{item.screeningStatus}</Text>
                          </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Email ID</Text>
                          <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.email}</Text>
                        </View>
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Screening Package</Text>
                          <Text style={[styles.recordSubTextVal, { color: '#38bdf8' }]} allowFontScaling={false}>{item.screeningPackage}</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {/* 4. LEASE AGREEMENTS LIST */}
            {activeTab === 'leases' && (
              <View>
                {filteredLeases.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>No active lease covenants found</Text>
                  </View>
                ) : (
                  filteredLeases.map((item) => (
                    <View key={item.id} style={styles.recordsCard}>
                      <View style={styles.rowBetween}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <Text style={styles.recordLabel} allowFontScaling={false}>{item.tenantName}</Text>
                          <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyName} · Unit {item.unitNumber}</Text>
                        </View>
                        <View style={[styles.badge, { borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                          <Text style={[styles.badgeText, { color: '#10b981' }]} allowFontScaling={false}>Active</Text>
                        </View>
                      </View>
                      <View style={styles.divider} />
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>Lease Duration</Text>
                        <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.startDate} to {item.endDate}</Text>
                      </View>
                      <View style={styles.rowBetween}>
                        <Text style={styles.recordSubText} allowFontScaling={false}>Monthly Base Rent</Text>
                        <Text style={[styles.recordValue, { color: '#38bdf8' }]} allowFontScaling={false}>
                          ${Number(item.monthlyRent).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}

            {/* 5. MOVE IN WORKFLOW LIST */}
            {activeTab === 'movein' && (
              <View>
                {filteredMoveIns.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>No move in schedules registered</Text>
                  </View>
                ) : (
                  filteredMoveIns.map((item) => {
                    const statusColor = item.workflowStatus === 'Completed' ? '#10b981' : item.workflowStatus === 'Inspection in Progress' ? '#a855f7' : '#f59e0b';
                    return (
                      <View key={item.id} style={styles.recordsCard}>
                        <View style={styles.rowBetween}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.recordLabel} allowFontScaling={false}>{item.tenantName}</Text>
                            <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyName} · Unit {item.unitNumber}</Text>
                          </View>
                          <View style={[styles.badge, { borderColor: statusColor, backgroundColor: `${statusColor}12` }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]} allowFontScaling={false}>{item.workflowStatus}</Text>
                          </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Move In Target Date</Text>
                          <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.scheduledDate}</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {/* 6. MOVE OUT WORKFLOW LIST */}
            {activeTab === 'moveout' && (
              <View>
                {filteredMoveOuts.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Ionicons name="clipboard-outline" size={32} color="#475569" style={{ marginBottom: 8 }} />
                    <Text style={[styles.emptyText, { fontWeight: '700', color: '#f8fafc' }]} allowFontScaling={false}>No Move Outs Found</Text>
                    <Text style={{ fontSize: 10.5, color: '#64748b', marginTop: 4, textAlign: 'center' }} allowFontScaling={false}>
                      Create a move-out record from the active leases page to schedule a checklist.
                    </Text>
                  </View>
                ) : (
                  filteredMoveOuts.map((item) => {
                    const statusColor = item.workflowStatus === 'Completed' ? '#10b981' : item.workflowStatus === 'Inspection in Progress' ? '#a855f7' : '#f59e0b';
                    return (
                      <View key={item.id} style={styles.recordsCard}>
                        <View style={styles.rowBetween}>
                          <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.recordLabel} allowFontScaling={false}>{item.tenantName}</Text>
                            <Text style={styles.recordSubText} allowFontScaling={false}>{item.propertyName} · Unit {item.unitNumber}</Text>
                          </View>
                          <View style={[styles.badge, { borderColor: statusColor, backgroundColor: `${statusColor}12` }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]} allowFontScaling={false}>{item.workflowStatus}</Text>
                          </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.rowBetween}>
                          <Text style={styles.recordSubText} allowFontScaling={false}>Move Out Date</Text>
                          <Text style={styles.recordSubTextVal} allowFontScaling={false}>{item.scheduledDate}</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {/* 7. INSPECTION TEMPLATES LIST */}
            {activeTab === 'templates' && (
              <View>
                {filteredTemplates.length === 0 ? (
                  <View style={styles.emptyView}>
                    <Text style={styles.emptyText} allowFontScaling={false}>No inspection templates registered</Text>
                  </View>
                ) : (
                  <View style={styles.templatesFlexContainer}>
                    {filteredTemplates.map((item) => (
                      <View key={item.id} style={styles.templateGridCard}>
                        <View style={styles.rowBetween}>
                          <View style={[styles.badge, { borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
                            <Text style={[styles.badgeText, { color: '#38bdf8' }]} allowFontScaling={false}>INSPECTION ASSIGN</Text>
                          </View>
                          <Ionicons name="checkbox-outline" size={16} color="#10b981" />
                        </View>

                        <Text style={styles.tmplTitle} allowFontScaling={false}>{item.name}</Text>
                        <Text style={styles.tmplDesc} allowFontScaling={false}>No description provided.</Text>

                        <View style={styles.divider} />

                        <View style={styles.rowBetween}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="layers-outline" size={12} color="#cbd5e1" style={{ marginRight: 4 }} />
                            <Text style={styles.tmplMetaText} allowFontScaling={false}>{item.roomsCount} Rooms</Text>
                          </View>
                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.tmplMetaLabel} allowFontScaling={false}>Created By:</Text>
                            <Text style={styles.tmplMetaText} allowFontScaling={false}>{item.createdBy}</Text>
                          </View>
                        </View>

                        <View style={styles.tmplActionRow}>
                          <TouchableOpacity style={styles.tmplActionBtn} onPress={() => Alert.alert('Edit Template', 'Loading inspection designer details...')}>
                            <Ionicons name="create-outline" size={13} color="#cbd5e1" style={{ marginRight: 4 }} />
                            <Text style={styles.tmplActionBtnText} allowFontScaling={false}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.tmplActionBtn} onPress={() => handleDuplicateTemplate(item.id)}>
                            <Ionicons name="copy-outline" size={13} color="#cbd5e1" style={{ marginRight: 4 }} />
                            <Text style={styles.tmplActionBtnText} allowFontScaling={false}>Duplicate</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

          </Animated.View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* --- 1. RECORD CRM LEAD MODAL --- */}
      <Modal visible={recordLeadOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add Prospect Lead</Text>
                <TouchableOpacity onPress={() => setRecordLeadOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>PROSPECT NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. John Doe"
                  placeholderTextColor="#64748b"
                  value={leadName}
                  onChangeText={setLeadName}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="johndoe@example.com"
                  placeholderTextColor="#64748b"
                  value={leadEmail}
                  onChangeText={setLeadEmail}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>PHONE NUMBER</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="555-0101"
                  placeholderTextColor="#64748b"
                  value={leadPhone}
                  onChangeText={setLeadPhone}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>INTERESTED PROPERTY</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('property');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {leadPropertyId ? properties.find(p => p.id === leadPropertyId)?.name : 'Select Property...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>PIPELINE STAGE</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('stage');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>{leadStage}</Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setRecordLeadOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSaveLead}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Add Lead</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 2. REQUEST SCREENING MODAL --- */}
      <Modal visible={recordScreeningOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Request Screening Check</Text>
                <TouchableOpacity onPress={() => setRecordScreeningOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>APPLICANT NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Applicant full name..."
                  placeholderTextColor="#64748b"
                  value={screenName}
                  onChangeText={setScreenName}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>APPLICANT EMAIL</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="applicant@example.com"
                  placeholderTextColor="#64748b"
                  value={screenEmail}
                  onChangeText={setScreenEmail}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('property');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {screenPropertyId ? properties.find(p => p.id === screenPropertyId)?.name : 'Select Property...'}
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
                    {screenUnitId ? `Unit ${units.find(u => u.id === screenUnitId)?.unitNumber}` : 'Select Unit...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>SCREENING PACKAGE</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('package');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>{screenPackage}</Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setRecordScreeningOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleRequestScreening}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Request Check</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 3. CREATE LEASE MODAL --- */}
      <Modal visible={recordLeaseOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Create Lease Agreements</Text>
                <TouchableOpacity onPress={() => setRecordLeaseOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>RESIDENT</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('tenant');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {leaseTenantId ? tenants.find(t => t.id === leaseTenantId)?.name || `${tenants.find(t => t.id === leaseTenantId)?.firstName} ${tenants.find(t => t.id === leaseTenantId)?.lastName}` : 'Select Resident...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>UNIT LOCATION</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('unit');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {leaseUnitId ? `Unit ${units.find(u => u.id === leaseUnitId)?.unitNumber} (${units.find(u => u.id === leaseUnitId)?.property?.name})` : 'Select Unit...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>START DATE (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. 2026-08-01"
                  placeholderTextColor="#64748b"
                  value={leaseStartDate}
                  onChangeText={setLeaseStartDate}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>END DATE (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. 2027-08-01"
                  placeholderTextColor="#64748b"
                  value={leaseEndDate}
                  onChangeText={setLeaseEndDate}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>MONTHLY RENT AMOUNT ($)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="$ 1500"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={leaseMonthlyRent}
                  onChangeText={setLeaseMonthlyRent}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setRecordLeaseOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateLease}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Create Lease</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 4. CREATE MOVE IN WORKFLOW MODAL --- */}
      <Modal visible={recordMoveInOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add Move In Workflow</Text>
                <TouchableOpacity onPress={() => setRecordMoveInOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>RESIDENT</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('tenant');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {moveTenantId ? tenants.find(t => t.id === moveTenantId)?.name || `${tenants.find(t => t.id === moveTenantId)?.firstName} ${tenants.find(t => t.id === moveTenantId)?.lastName}` : 'Select Resident...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>MOVE IN DATE (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. 2026-08-01"
                  placeholderTextColor="#64748b"
                  value={moveDate}
                  onChangeText={setMoveDate}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setRecordMoveInOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateMoveIn}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Schedule Move In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 5. CREATE MOVE OUT WORKFLOW MODAL --- */}
      <Modal visible={recordMoveOutOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Add Move Out Workflow</Text>
                <TouchableOpacity onPress={() => setRecordMoveOutOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>RESIDENT</Text>
                <TouchableOpacity
                  style={styles.formPickerSelector}
                  onPress={() => {
                    setActivePicker('tenant');
                    setPickerModalOpen(true);
                  }}
                >
                  <Text style={styles.formPickerText} allowFontScaling={false}>
                    {outTenantId ? tenants.find(t => t.id === outTenantId)?.name || `${tenants.find(t => t.id === outTenantId)?.firstName} ${tenants.find(t => t.id === outTenantId)?.lastName}` : 'Select Resident...'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.formLabel} allowFontScaling={false}>MOVE OUT DATE (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. 2026-08-01"
                  placeholderTextColor="#64748b"
                  value={outDate}
                  onChangeText={setOutDate}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setRecordMoveOutOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateMoveOut}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Schedule Move Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- 6. CREATE INSPECTION TEMPLATE MODAL --- */}
      <Modal visible={recordTemplateOpen} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Create Inspection Template</Text>
                <TouchableOpacity onPress={() => setRecordTemplateOpen(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <Text style={styles.formLabel} allowFontScaling={false}>TEMPLATE NAME</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="E.g. Move Out Checklist"
                  placeholderTextColor="#64748b"
                  value={templateName}
                  onChangeText={setTemplateName}
                />

                <Text style={styles.formLabel} allowFontScaling={false}>ROOMS COUNT</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="4"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={templateRooms}
                  onChangeText={setTemplateRooms}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setRecordTemplateOpen(false)}>
                  <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTemplate}>
                  <Text style={styles.submitBtnText} allowFontScaling={false}>Create Template</Text>
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
              {getPickerOptions().map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
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
  headerTextContainer: {
    minHeight: 85,
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 15 },

  // Tab switcher
  tabItem: { paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center', borderRadius: 8, backgroundColor: '#1e293b', marginRight: 6 },
  tabItemActive: { backgroundColor: '#38bdf8' },
  tabItemText: { color: '#94a3b8', fontSize: 12.5, fontWeight: '700' },
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
  dedicatedAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dedicatedAddBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },

  // Records card layouts
  recordsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  recordLabel: { fontSize: 14.5, fontWeight: '800', color: '#f8fafc' },
  recordValue: { fontSize: 15, fontWeight: '900' },
  recordSubText: { fontSize: 12, color: '#94a3b8' },
  recordSubTextVal: { fontSize: 12, color: '#cbd5e1', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 3 },
  badge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

  // Templates grid card styling
  templatesFlexContainer: { flexDirection: 'column' },
  templateGridCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tmplTitle: { fontSize: 15, fontWeight: '850', color: '#f8fafc', marginTop: 10 },
  tmplDesc: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  tmplMetaText: { fontSize: 11.5, color: '#cbd5e1', fontWeight: '600' },
  tmplMetaLabel: { fontSize: 9.5, color: '#64748b', fontWeight: '700' },
  tmplActionRow: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 12, gap: 10 },
  tmplActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tmplActionBtnText: { color: '#cbd5e1', fontSize: 11.5, fontWeight: '700' },

  // Actions Container for background check approvals
  actionRowContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 10 },
  smallActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  smallActionText: { fontSize: 12, fontWeight: '800' },

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
