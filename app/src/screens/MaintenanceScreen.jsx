import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
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
import { useThemeColors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

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

export const MaintenanceScreen = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const { colors, isDarkMode } = useThemeColors();
  const styles = getStyles(colors, isDarkMode);

  const isOwner = user?.role === 'Owner';
  const isTenant = user?.role === 'Tenant';
  const isManager = !isOwner && !isTenant;

  // General lists
  const [requests, setRequests] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [staff, setStaff] = useState([]);
  
  const [properties, setProperties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [units, setUnits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Manager Switcher Tab: 'requests', 'work_orders', 'staff'
  const [activeTab, setActiveTab] = useState('requests');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Create Ticket Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states for Create Ticket
  const [cTitle, setCTitle] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cPropId, setCPropId] = useState('');
  const [cBuildingId, setCBuildingId] = useState('');
  const [cUnitId, setCUnitId] = useState('');
  const [cResidentPayee, setCResidentPayee] = useState('');
  const [cCategory, setCCategory] = useState('General Repairs');
  const [cPriority, setCPriority] = useState('Medium');
  const [cPreferredTime, setCPreferredTime] = useState('Morning 8 AM - 12 PM');
  const [cPermissionToEnter, setCPermissionToEnter] = useState(true);
  const [cNotes, setCNotes] = useState('');

  // Dropdown visibility triggers for Create modal
  const [showCPropDropdown, setShowCPropDropdown] = useState(false);
  const [showCBuildingDropdown, setShowCBuildingDropdown] = useState(false);
  const [showCUnitDropdown, setShowCUnitDropdown] = useState(false);
  const [showCCatDropdown, setShowCCatDropdown] = useState(false);
  const [showCPriorityDropdown, setShowCPriorityDropdown] = useState(false);

  // --- View & Update Details Modal State ---
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Editable/Update states in details view
  const [dStatus, setDStatus] = useState('New');
  const [dPriority, setDPriority] = useState('Medium');
  const [dAssignedVendorId, setDAssignedVendorId] = useState('');
  const [dTechnician, setDTechnician] = useState('');
  const [dEstCost, setDEstCost] = useState('');
  const [dCost, setDCost] = useState('');
  const [dSchedDate, setDSchedDate] = useState('');
  const [dNotes, setDNotes] = useState('');

  // Message thread text input
  const [chatMessage, setChatMessage] = useState('');

  // Detail dropdowns triggers
  const [showDStatusDropdown, setShowDStatusDropdown] = useState(false);
  const [showDPriorityDropdown, setShowDPriorityDropdown] = useState(false);
  const [showDVendorDropdown, setShowDVendorDropdown] = useState(false);

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

  // Fetch all maintenance items dynamically
  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      
      const [reqsRes, woRes, staffRes, propsRes, buildingsRes, unitsRes] = await Promise.all([
        apiClient.get('/service-requests', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/work-orders', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/vendors', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/properties', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/buildings', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/units', logout, refreshAccessToken).catch(() => null),
      ]);

      setRequests(reqsRes?.data || []);
      setWorkOrders(woRes?.data || []);
      setStaff(staffRes?.data || []);
      
      setProperties(propsRes?.data || []);
      setBuildings(buildingsRes?.data || []);
      setUnits(unitsRes?.data || []);
    } catch (e) {
      console.log('Error fetching maintenance details:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, [user?.role]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMaintenanceData();
  };

  // Submit new ticket creation
  const handleCreateRequest = async () => {
    if (!cTitle.trim() || !cDesc.trim()) {
      Alert.alert('Validation Error', 'Please enter a ticket title and issue description.');
      return;
    }

    try {
      setSubmitting(true);
      
      const selectedProp = properties.find(p => p.id === cPropId);
      const selectedUnit = units.find(u => u.id === cUnitId);

      const payload = {
        title: cTitle.trim(),
        description: cDesc.trim(),
        propertyId: cPropId || undefined,
        propertyName: selectedProp ? selectedProp.name : 'Unknown Property',
        unitNumber: selectedUnit ? selectedUnit.unitNumber : '',
        tenantName: cResidentPayee.trim() || 'Unknown Resident',
        priority: cPriority,
        category: cCategory,
        status: 'New',
        preferredTime: cPreferredTime.trim() || undefined,
        permissionToEnter: cPermissionToEnter ? 'Yes' : 'No',
        notes: cNotes.trim() || undefined,
      };

      await apiClient.post('/service-requests', payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Maintenance ticket submitted successfully.');
      setIsCreateOpen(false);

      // Reset fields
      setCTitle('');
      setCDesc('');
      setCPropId('');
      setCBuildingId('');
      setCUnitId('');
      setCResidentPayee('');
      setCNotes('');

      fetchMaintenanceData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Service Ticket detailed specs view
  const handleViewTicket = async (ticket) => {
    try {
      setDetailLoading(true);
      setSelectedTicket(ticket);
      
      // Load latest database details
      const details = await apiClient.get(`/service-requests/${ticket.id}`, logout, refreshAccessToken);
      const data = details?.data || ticket;
      
      // Sync form edit fields
      setDStatus(data.status || 'New');
      setDPriority(data.priority || 'Medium');
      setDAssignedVendorId(data.assignedVendorId || '');
      setDTechnician(data.assignedTechnician || '');
      setDEstCost(data.estimatedCost ? String(data.estimatedCost) : '');
      setDCost(data.cost ? String(data.cost) : '');
      setDSchedDate(data.scheduledDate || '');
      setDNotes(data.notes || '');

      setSelectedTicket(data);
    } catch (err) {
      console.log('Error loading ticket details:', err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Save/Update Service Ticket details
  const handleSaveTicketDetails = async () => {
    if (!selectedTicket) return;

    try {
      setSubmitting(true);
      const selectedVendor = staff.find(v => v.id === dAssignedVendorId);

      const payload = {
        status: dStatus,
        priority: dPriority,
        assignedVendorId: dAssignedVendorId || null,
        assignedVendorName: selectedVendor ? selectedVendor.companyName : null,
        assignedTechnician: dTechnician.trim() || null,
        estimatedCost: dEstCost ? parseFloat(dEstCost) : null,
        cost: dCost ? parseFloat(dCost) : null,
        scheduledDate: dSchedDate || null,
        notes: dNotes.trim() || null,
      };

      await apiClient.put(`/service-requests/${selectedTicket.id}`, payload, logout, refreshAccessToken);
      Alert.alert('Success', 'Service ticket updated successfully.');
      setSelectedTicket(null);
      fetchMaintenanceData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save ticket changes');
    } finally {
      setSubmitting(false);
    }
  };

  // Send new in-app tenant message thread chat
  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !selectedTicket) return;

    try {
      const payload = {
        newMessage: {
          senderName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Property Manager',
          role: 'Manager',
          text: chatMessage.trim(),
        }
      };

      const updated = await apiClient.put(`/service-requests/${selectedTicket.id}`, payload, logout, refreshAccessToken);
      
      // Update local array in modal
      setSelectedTicket(prev => ({
        ...prev,
        messages: updated?.data?.messages || [...(prev.messages || []), {
          id: `msg-${Date.now()}`,
          senderName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Property Manager',
          role: 'Manager',
          text: chatMessage.trim(),
          timestamp: new Date().toLocaleTimeString(),
        }]
      }));

      setChatMessage('');
    } catch (err) {
      Alert.alert('Error', 'Failed to send chat update.');
    }
  };

  // Delete Service Ticket Request
  const handleDeleteRequest = (id, titleStr) => {
    Alert.alert(
      'Delete Service Ticket',
      `Are you sure you want to delete service ticket "${titleStr}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.delete(`/service-requests/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'Service request deleted successfully');
              fetchMaintenanceData();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete service request');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Filter list results
  const filteredRequests = requests.filter((r) => {
    const term = searchQuery.toLowerCase();
    return (r.title || '').toLowerCase().includes(term) ||
           (r.propertyName || '').toLowerCase().includes(term) ||
           (r.tenantName || '').toLowerCase().includes(term) ||
           (r.status || '').toLowerCase().includes(term);
  });

  const filteredWorkOrders = workOrders.filter((w) => {
    const term = searchQuery.toLowerCase();
    return (w.title || w.description || '').toLowerCase().includes(term) ||
           (w.propertyName || '').toLowerCase().includes(term) ||
           (w.assignedVendorName || '').toLowerCase().includes(term) ||
           (w.status || '').toLowerCase().includes(term);
  });

  const filteredStaff = staff.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (s.companyName || s.name || '').toLowerCase().includes(term) ||
           (s.specialty || '').toLowerCase().includes(term) ||
           (s.status || '').toLowerCase().includes(term);
  });

  // Dropdown select options constants
  const categoriesList = ['General Repairs', 'Plumbing', 'Electrical', 'HVAC', 'Appliance Failures'];
  const priorityBrackets = ['Low', 'Medium', 'High', 'Emergency'];
  const statusOptions = ['New', 'Assigned', 'In Progress', 'Completed', 'Closed'];

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading maintenance hub...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
      {/* Header, Search bar & Tabs (Fixed) */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title} allowFontScaling={false}>
            {activeTab === 'requests' ? 'Service Tickets & Requests' : activeTab === 'work_orders' ? 'Work Orders & Dispatches' : 'Maintenance Staff'}
          </Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            {activeTab === 'requests' 
              ? 'Verify property issues, emergency service dispatches, and appliance failures.'
              : activeTab === 'work_orders' 
                ? 'Verify service diagnostics dispatches, material expenses, and contractor logs.'
                : 'Verify active maintenance staff profiles, trade specialties, and workloads.'}
          </Text>
        </View>

        {/* Search Controls */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={activeTab === 'requests' ? "Search tickets by resident or issue..." : activeTab === 'work_orders' ? "Search work orders..." : "Search staff directory..."}
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {activeTab === 'requests' && (
            <TouchableOpacity style={styles.addBtn} onPress={() => setIsCreateOpen(true)} activeOpacity={0.8}>
              <Ionicons name="add" size={18} color="#0f172a" />
              <Text style={styles.addBtnText} allowFontScaling={false}>Submit Ticket</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Switcher tabs */}
        {isManager && (
          <View style={[styles.tabContainer, { margin: 0, marginTop: 4, marginBottom: 4 }]}>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'requests' && styles.tabBtnActive]} onPress={() => setActiveTab('requests')}>
              <Text style={[styles.tabBtnText, activeTab === 'requests' && styles.tabBtnTextActive]} allowFontScaling={false}>Requests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'work_orders' && styles.tabBtnActive]} onPress={() => setActiveTab('work_orders')}>
              <Text style={[styles.tabBtnText, activeTab === 'work_orders' && styles.tabBtnTextActive]} allowFontScaling={false}>Work Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'staff' && styles.tabBtnActive]} onPress={() => setActiveTab('staff')}>
              <Text style={[styles.tabBtnText, activeTab === 'staff' && styles.tabBtnTextActive]} allowFontScaling={false}>Staff Directory</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 12 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#38bdf8" />}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Listing according to active tab */}
          {activeTab === 'requests' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  ACTIVE SERVICE TICKETS ({filteredRequests.length})
                </Text>
              </View>

              {filteredRequests.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="hammer-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText} allowFontScaling={false}>No service requests found</Text>
                </View>
              ) : (
                filteredRequests.map((item, idx) => {
                  const reqNo = item.requestNumber || `#${1001 + idx}`;
                  const priorityColor = item.priority === 'Emergency' ? '#ef4444' : item.priority === 'High' ? '#f59e0b' : '#38bdf8';
                  const priorityBg = item.priority === 'Emergency' ? 'rgba(239, 68, 68, 0.12)' : item.priority === 'High' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(56, 189, 248, 0.12)';
                  
                  const statusColor = item.status === 'Completed' || item.status === 'Closed' ? '#10b981' : '#f59e0b';
                  const statusBg = item.status === 'Completed' || item.status === 'Closed' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)';

                  return (
                    <View key={item.id || `req-${idx}`} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.ticketNoText} allowFontScaling={false}>Ticket {reqNo}</Text>
                          <Text style={styles.ticketTitle} allowFontScaling={false}>{item.title}</Text>
                        </View>
                        <View style={styles.badgesRow}>
                          <TouchableOpacity style={styles.eyeBtn} onPress={() => handleViewTicket(item)} activeOpacity={0.7}>
                            <Ionicons name="eye-outline" size={16} color="#38bdf8" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteRequest(item.id, item.title)} activeOpacity={0.7}>
                            <Ionicons name="trash-outline" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.metaRow}>
                        <View style={styles.metaCol}>
                          <Ionicons name="business-outline" size={13} color="#94a3b8" style={{ marginRight: 6 }} />
                          <Text style={styles.metaText} allowFontScaling={false} numberOfLines={1}>
                            {item.propertyName || 'Property'} · Unit {item.unitNumber || '2A'}
                          </Text>
                        </View>
                        <View style={styles.metaColRight}>
                          <Ionicons name="person-outline" size={13} color="#94a3b8" style={{ marginRight: 6 }} />
                          <Text style={styles.metaText} allowFontScaling={false} numberOfLines={1}>
                            {item.tenantName || 'Resident'}
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.metaRow, { marginTop: 8 }]}>
                        <View style={[styles.priorityBadge, { backgroundColor: priorityBg, borderColor: priorityColor }]}>
                          <Text style={[styles.priorityBadgeText, { color: priorityColor }]} allowFontScaling={false}>
                            {item.priority || 'Medium'}
                          </Text>
                        </View>
                        <View style={[styles.activeBadge, { backgroundColor: statusBg, borderColor: statusColor, paddingVertical: 2 }]}>
                          <Text style={[styles.activeBadgeText, { color: statusColor }]} allowFontScaling={false}>
                            {item.status || 'New'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {activeTab === 'work_orders' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  DISPATCHED WORK ORDERS ({filteredWorkOrders.length})
                </Text>
              </View>

              {filteredWorkOrders.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="construct-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText} allowFontScaling={false}>No work orders found</Text>
                </View>
              ) : (
                filteredWorkOrders.map((item, idx) => {
                  const reqNo = item.workOrderNumber || `#WO-${1001 + idx}`;
                  const actCost = Number(item.cost || item.actualCost || 0);

                  return (
                    <View key={item.id || `wo-${idx}`} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.ticketNoText} allowFontScaling={false}>{reqNo}</Text>
                          <Text style={styles.ticketTitle} allowFontScaling={false}>{item.title || 'Work Dispatch Order'}</Text>
                        </View>
                        <View style={[styles.activeBadge, { paddingVertical: 2 }]}>
                          <Text style={styles.activeBadgeText} allowFontScaling={false}>{item.status || 'Dispatched'}</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.metaRow}>
                        <View style={styles.metaCol}>
                          <Ionicons name="business-outline" size={13} color="#94a3b8" style={{ marginRight: 6 }} />
                          <Text style={styles.metaText} allowFontScaling={false} numberOfLines={1}>
                            {item.propertyName || 'Property'} · Unit {item.unitNumber || 'Common'}
                          </Text>
                        </View>
                        <View style={styles.metaColRight}>
                          <Ionicons name="construct-outline" size={13} color="#94a3b8" style={{ marginRight: 6 }} />
                          <Text style={styles.metaText} allowFontScaling={false} numberOfLines={1}>
                            {item.assignedVendorName || 'ProFix Solutions'}
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.metaRow, { marginTop: 10 }]}>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>EST COST</Text>
                          <Text style={styles.metaValText} allowFontScaling={false}>${(Number(item.estimatedCost) || 0).toLocaleString()}</Text>
                        </View>
                        <View style={styles.metaColRight}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>ACTUAL COST</Text>
                          <Text style={[styles.metaValText, { color: '#10b981' }]} allowFontScaling={false}>${actCost.toLocaleString()}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {activeTab === 'staff' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  MAINTENANCE STAFF DIRECTORY ({filteredStaff.length})
                </Text>
              </View>

              {filteredStaff.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="people-outline" size={48} color="#475569" style={{ marginBottom: 10 }} />
                  <Text style={styles.emptyText} allowFontScaling={false}>No maintenance technicians found</Text>
                </View>
              ) : (
                filteredStaff.map((item, idx) => {
                  const rating = Number(item.rating || 5.0).toFixed(1);
                  return (
                    <View key={item.id || `staff-${idx}`} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={styles.avatar}>
                          <Ionicons name="hammer" size={18} color="#0f172a" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.tenantName} allowFontScaling={false}>{item.companyName || item.name || 'Technician Lead'}</Text>
                          <Text style={styles.tenantSubText} allowFontScaling={false}>{item.specialty || 'General Trade'}</Text>
                        </View>
                        <View style={styles.ratingBox}>
                          <Ionicons name="star" size={13} color="#f59e0b" style={{ marginRight: 4 }} />
                          <Text style={styles.ratingText} allowFontScaling={false}>{rating}</Text>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.metaRow}>
                        <View style={{ flex: 1.2 }}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>PHONE NUMBER</Text>
                          <Text style={styles.metaValText} allowFontScaling={false}>{item.phone || '(512) 555-4321'}</Text>
                        </View>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>ACTIVE JOBS</Text>
                          <Text style={styles.metaValText} allowFontScaling={false}>{item.activeJobs || 0}</Text>
                        </View>
                        <View style={{ flex: 0.8, alignItems: 'flex-end' }}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>STATUS</Text>
                          <View style={[styles.activeBadge, { marginTop: 2, paddingVertical: 2, paddingHorizontal: 6 }]}>
                            <Text style={styles.activeBadgeText} allowFontScaling={false}>{item.status || 'Active'}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* --- CREATE SERVICE TICKET MODAL --- */}
      <Modal visible={isCreateOpen} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle} allowFontScaling={false}>Submit Maintenance Ticket</Text>
                <TouchableOpacity onPress={() => setIsCreateOpen(false)}>
                  <Ionicons name="close" size={24} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalSubHeader} allowFontScaling={false}>Record resident reported issues, HVAC failures, or common area diagnostics.</Text>

                {/* Property Portfolio Dropdown */}
                <View style={[styles.formGroup, showCPropDropdown && { zIndex: 9999, position: 'relative' }]}>
                  <Text style={styles.formLabel} allowFontScaling={false}>PROPERTY PORTFOLIO</Text>
                  <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowCPropDropdown(!showCPropDropdown)} activeOpacity={0.7}>
                    <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                      {properties.find(p => p.id === cPropId)?.name || 'Select Property...'}
                    </Text>
                    <Ionicons name={showCPropDropdown ? "chevron-up" : "chevron-down"} size={16} color="#cbd5e1" />
                  </TouchableOpacity>
                  {showCPropDropdown && (
                    <View style={styles.dropdownContainer}>
                      {properties.map((opt) => (
                        <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setCPropId(opt.id); setCBuildingId(''); setCUnitId(''); setShowCPropDropdown(false); }}>
                          <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.name}</Text>
                          {cPropId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.formRow}>
                  {/* Building Dropdown filtered */}
                  <View style={[styles.formGroup, { flex: 1 }, showCBuildingDropdown && { zIndex: 9998, position: 'relative' }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>BUILDING</Text>
                    <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowCBuildingDropdown(!showCBuildingDropdown)} activeOpacity={0.7}>
                      <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                        {buildings.find(b => b.id === cBuildingId)?.name || 'Select...'}
                      </Text>
                      <Ionicons name={showCBuildingDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                    </TouchableOpacity>
                    {showCBuildingDropdown && (
                      <View style={styles.dropdownContainer}>
                        {buildings.filter(b => !cPropId || b.propertyId === cPropId).map((opt) => (
                          <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setCBuildingId(opt.id); setShowCBuildingDropdown(false); }}>
                            <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.name}</Text>
                            {cBuildingId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Unit Dropdown filtered */}
                  <View style={[styles.formGroup, { flex: 1 }, showCUnitDropdown && { zIndex: 9998, position: 'relative' }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>UNIT</Text>
                    <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowCUnitDropdown(!showCUnitDropdown)} activeOpacity={0.7}>
                      <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                        {units.find(u => u.id === cUnitId)?.unitNumber || 'Select...'}
                      </Text>
                      <Ionicons name={showCUnitDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                    </TouchableOpacity>
                    {showCUnitDropdown && (
                      <View style={styles.dropdownContainer}>
                        {units.filter(u => (!cPropId || u.propertyId === cPropId) && (!cBuildingId || u.buildingId === cBuildingId)).map((opt) => (
                          <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setCUnitId(opt.id); setShowCUnitDropdown(false); }}>
                            <Text style={styles.dropdownItemText} allowFontScaling={false}>Unit {opt.unitNumber}</Text>
                            {cUnitId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>RESIDENT PAYEE NAME</Text>
                  <TextInput style={styles.formInput} placeholder="Resident contact name..." placeholderTextColor="#64748b" value={cResidentPayee} onChangeText={setCResidentPayee} />
                </View>

                <View style={styles.formRow}>
                  {/* Issue Category dropdown */}
                  <View style={[styles.formGroup, { flex: 1 }, showCCatDropdown && { zIndex: 9997, position: 'relative' }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>ISSUE CATEGORY</Text>
                    <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowCCatDropdown(!showCCatDropdown)} activeOpacity={0.7}>
                      <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{cCategory}</Text>
                      <Ionicons name={showCCatDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                    </TouchableOpacity>
                    {showCCatDropdown && (
                      <View style={styles.dropdownContainer}>
                        {categoriesList.map((opt) => (
                          <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setCCatDropdown(false); setCCategory(opt); }}>
                            <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                            {cCategory === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Priority dropdown */}
                  <View style={[styles.formGroup, { flex: 1 }, showCPriorityDropdown && { zIndex: 9997, position: 'relative' }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>PRIORITY BRACKET</Text>
                    <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowCPriorityDropdown(!showCPriorityDropdown)} activeOpacity={0.7}>
                      <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{cPriority}</Text>
                      <Ionicons name={showCPriorityDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                    </TouchableOpacity>
                    {showCPriorityDropdown && (
                      <View style={styles.dropdownContainer}>
                        {priorityBrackets.map((opt) => (
                          <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setCPriorityDropdown(false); setCPriority(opt); }}>
                            <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                            {cPriority === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>SUBJECT / TITLE</Text>
                  <TextInput style={styles.formInput} placeholder="E.g., HVAC Fan Failure" placeholderTextColor="#64748b" value={cTitle} onChangeText={setCTitle} />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>DESCRIPTION OF ISSUE</Text>
                  <TextInput 
                    style={[styles.formInput, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]} 
                    placeholder="Describe the issue, leak rates, or equipment behaviors..." 
                    placeholderTextColor="#64748b" 
                    multiline 
                    value={cDesc} 
                    onChangeText={setCDesc} 
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel} allowFontScaling={false}>PREFERRED VISIT TIME</Text>
                    <TextInput style={styles.formInput} placeholder="E.g., Morning 8 AM - 12 PM" placeholderTextColor="#64748b" value={cPreferredTime} onChangeText={setCPreferredTime} />
                  </View>
                  <TouchableOpacity 
                    style={[styles.checkboxContainer, { flex: 1 }]} 
                    onPress={() => setCPermissionToEnter(!cPermissionToEnter)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, cPermissionToEnter && styles.checkboxChecked]}>
                      {cPermissionToEnter && <Ionicons name="checkmark" size={12} color="#0f172a" />}
                    </View>
                    <Text style={styles.checkboxLabel} allowFontScaling={false}>PERMISSION TO ENTER UNIT</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel} allowFontScaling={false}>DIAGNOSTIC NOTES (INTERNAL ONLY)</Text>
                  <TextInput 
                    style={[styles.formInput, { height: 60, textAlignVertical: 'top', paddingTop: 8 }]} 
                    placeholder="Internal contractor notes..." 
                    placeholderTextColor="#64748b" 
                    multiline 
                    value={cNotes} 
                    onChangeText={setCNotes} 
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsCreateOpen(false)} disabled={submitting}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleCreateRequest} disabled={submitting}>
                    {submitting ? <ActivityIndicator size="small" color="#0f172a" /> : <Text style={styles.submitBtnText} allowFontScaling={false}>Submit Request</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- SERVICE TICKET DETAILS SPECS MODAL --- */}
      <Modal visible={!!selectedTicket} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalBg}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalCard, { maxHeight: '90%' }]}>
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalTitleRow}>
                  <Ionicons name="construct-outline" size={20} color="#38bdf8" style={{ marginRight: 8 }} />
                  <Text style={styles.modalTitle} allowFontScaling={false} numberOfLines={1}>
                    Service Ticket Details - {selectedTicket?.requestNumber || '#1'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                  <Ionicons name="close" size={22} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {detailLoading ? (
                <View style={[styles.center, { backgroundColor: 'transparent' }]}>
                  <ActivityIndicator size="large" color="#38bdf8" />
                </View>
              ) : (
                selectedTicket && (
                  <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={[styles.detailContainer, { marginTop: 0 }]}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={styles.ticketDetailTitle} allowFontScaling={false}>{selectedTicket.title}</Text>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                          <View style={styles.priorityBadge}>
                            <Text style={styles.priorityBadgeText} allowFontScaling={false}>{selectedTicket.priority}</Text>
                          </View>
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText} allowFontScaling={false}>{selectedTicket.status}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.ticketDescText} allowFontScaling={false}>{selectedTicket.description}</Text>

                      <View style={styles.divider} />

                      <View style={styles.metaRow}>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>PROPERTY LOCATION</Text>
                          <Text style={styles.metaValText} allowFontScaling={false}>{selectedTicket.propertyName}</Text>
                          <Text style={[styles.metaValText, { fontSize: 11, color: '#94a3b8', fontWeight: '500' }]} allowFontScaling={false}>Unit: {selectedTicket.unitNumber || '2A'}</Text>
                        </View>
                        <View style={styles.metaColRight}>
                          <Text style={styles.metaLabel} allowFontScaling={false}>RESIDENT PAYEE</Text>
                          <Text style={[styles.metaValText, { textAlign: 'right' }]} allowFontScaling={false}>{selectedTicket.tenantName}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Chat messaging logs thread */}
                    <View style={styles.detailContainer}>
                      <Text style={styles.modalSectionTitle} allowFontScaling={false}>IN-APP TENANT MESSAGE THREAD</Text>
                      
                      <View style={styles.chatThreadWrapper}>
                        {(selectedTicket.messages || []).length === 0 ? (
                          <Text style={styles.noChatText} allowFontScaling={false}>No messages on this request yet.</Text>
                        ) : (
                          (selectedTicket.messages || []).map((msg, i) => {
                            const isMe = msg.role === 'Manager';
                            return (
                              <View key={msg.id || i} style={[styles.chatBubble, isMe ? styles.chatBubbleMe : styles.chatBubbleOther]}>
                                <Text style={styles.chatSender} allowFontScaling={false}>{msg.senderName} ({msg.role})</Text>
                                <Text style={styles.chatText} allowFontScaling={false}>{msg.text}</Text>
                                <Text style={styles.chatTime} allowFontScaling={false}>{msg.timestamp}</Text>
                              </View>
                            );
                          })
                        )}
                      </View>

                      <View style={styles.chatInputRow}>
                        <TextInput 
                          style={styles.chatInput} 
                          placeholder="Type message update to resident..." 
                          placeholderTextColor="#64748b" 
                          value={chatMessage} 
                          onChangeText={setChatMessage} 
                        />
                        <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendMessage}>
                          <Ionicons name="send" size={14} color="#0f172a" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Access & Scheduling details */}
                    <View style={styles.detailContainer}>
                      <Text style={styles.modalSectionTitle} allowFontScaling={false}>ACCESS & SCHEDULING</Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel} allowFontScaling={false}>Preferred Visit Time</Text>
                        <Text style={styles.detailVal} allowFontScaling={false}>{selectedTicket.preferredTime || 'Anytime'}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel} allowFontScaling={false}>Permission to Enter</Text>
                        <Text style={[styles.detailVal, { color: '#10b981' }]} allowFontScaling={false}>
                          {selectedTicket.permissionToEnter || 'Granted'}
                        </Text>
                      </View>

                      <View style={styles.divider} />

                      {/* ASSIGN TECH VENDOR SELECTOR */}
                      <View style={[styles.formGroup, showDVendorDropdown && { zIndex: 9999, position: 'relative' }]}>
                        <Text style={styles.formLabel} allowFontScaling={false}>ASSIGNED MAINTENANCE STAFF</Text>
                        <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowDVendorDropdown(!showDVendorDropdown)} activeOpacity={0.7}>
                          <Text style={styles.dropdownTriggerText} allowFontScaling={false}>
                            {staff.find(s => s.id === dAssignedVendorId)?.companyName || 'Unassigned / Select Vendor...'}
                          </Text>
                          <Ionicons name={showDVendorDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                        </TouchableOpacity>
                        {showDVendorDropdown && (
                          <View style={styles.dropdownContainer}>
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => { setDAssignedVendorId(''); setShowDVendorDropdown(false); }}>
                              <Text style={styles.dropdownItemText} allowFontScaling={false}>Unassigned</Text>
                            </TouchableOpacity>
                            {staff.map((opt) => (
                              <TouchableOpacity key={opt.id} style={styles.dropdownItem} onPress={() => { setDAssignedVendorId(opt.id); setShowDVendorDropdown(false); }}>
                                <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt.companyName} ({opt.specialty})</Text>
                                {dAssignedVendorId === opt.id && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel} allowFontScaling={false}>ASSIGNED TECHNICIAN</Text>
                        <TextInput style={styles.formInput} placeholder="Lead Technician Name" placeholderTextColor="#64748b" value={dTechnician} onChangeText={setDTechnician} />
                      </View>

                      <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                          <Text style={styles.formLabel} allowFontScaling={false}>ESTIMATED COST ($)</Text>
                          <TextInput style={styles.formInput} placeholder="Estimated Cost" keyboardType="numeric" placeholderTextColor="#64748b" value={dEstCost} onChangeText={setDEstCost} />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                          <Text style={styles.formLabel} allowFontScaling={false}>FINAL ACTUAL COST ($)</Text>
                          <TextInput style={styles.formInput} placeholder="Actual Cost" keyboardType="numeric" placeholderTextColor="#64748b" value={dCost} onChangeText={setDCost} />
                        </View>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel} allowFontScaling={false}>SCHEDULED DATE (YYYY-MM-DD)</Text>
                        <TextInput style={styles.formInput} placeholder="YYYY-MM-DD" placeholderTextColor="#64748b" value={dSchedDate} onChangeText={setDSchedDate} />
                      </View>

                      <View style={styles.formRow}>
                        {/* Status dropdown */}
                        <View style={[styles.formGroup, { flex: 1 }, showDStatusDropdown && { zIndex: 9998, position: 'relative' }]}>
                          <Text style={styles.formLabel} allowFontScaling={false}>STATUS</Text>
                          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowDStatusDropdown(!showDStatusDropdown)} activeOpacity={0.7}>
                            <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{dStatus}</Text>
                            <Ionicons name={showDStatusDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                          </TouchableOpacity>
                          {showDStatusDropdown && (
                            <View style={styles.dropdownContainer}>
                              {statusOptions.map((opt) => (
                                <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setDStatus(opt); setShowDStatusDropdown(false); }}>
                                  <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                                  {dStatus === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>

                        {/* Priority dropdown */}
                        <View style={[styles.formGroup, { flex: 1 }, showDPriorityDropdown && { zIndex: 9998, position: 'relative' }]}>
                          <Text style={styles.formLabel} allowFontScaling={false}>PRIORITY</Text>
                          <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowDPriorityDropdown(!showDPriorityDropdown)} activeOpacity={0.7}>
                            <Text style={styles.dropdownTriggerText} allowFontScaling={false}>{dPriority}</Text>
                            <Ionicons name={showDPriorityDropdown ? "chevron-up" : "chevron-down"} size={14} color="#cbd5e1" />
                          </TouchableOpacity>
                          {showDPriorityDropdown && (
                            <View style={styles.dropdownContainer}>
                              {priorityBrackets.map((opt) => (
                                <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setDPriority(opt); setShowDPriorityDropdown(false); }}>
                                  <Text style={styles.dropdownItemText} allowFontScaling={false}>{opt}</Text>
                                  {dPriority === opt && <Ionicons name="checkmark" size={16} color="#38bdf8" />}
                                </TouchableOpacity>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.formGroup}>
                        <Text style={styles.formLabel} allowFontScaling={false}>INTERNAL DIAGNOSTIC NOTES</Text>
                        <TextInput 
                          style={[styles.formInput, { height: 60, textAlignVertical: 'top', paddingTop: 8 }]} 
                          placeholder="Diagnostic contractor notes..." 
                          placeholderTextColor="#64748b" 
                          multiline 
                          value={dNotes} 
                          onChangeText={setDNotes} 
                        />
                      </View>
                    </View>

                    <View style={styles.modalActions}>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedTicket(null)} disabled={submitting}>
                        <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSaveTicketDetails} disabled={submitting}>
                        {submitting ? <ActivityIndicator size="small" color="#0f172a" /> : <Text style={styles.submitBtnText} allowFontScaling={false}>Save Details</Text>}
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

  // Tabs
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
  tabBtnText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  tabBtnTextActive: { color: '#38bdf8' },

  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 4, lineHeight: 16 },

  // Search Controls
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
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
  },
  addBtnText: { color: '#0f172a', fontSize: 11, fontWeight: '800' },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.8 },

  emptyCard: { backgroundColor: colors.surface, padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  emptyText: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },

  // Card layouts
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  ticketNoText: { fontSize: 11.5, color: colors.textSecondary, fontWeight: '700' },
  ticketTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(239, 68, 68, 0.12)', alignItems: 'center', justifyContent: 'center' },
  eyeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(56, 189, 248, 0.12)', alignItems: 'center', justifyContent: 'center' },

  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 12 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaCol: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  metaColRight: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  metaText: { fontSize: 12, color: colors.textSecondary },
  metaLabel: { fontSize: 8.5, color: colors.textMuted, fontWeight: '850', letterSpacing: 0.5, marginBottom: 4 },
  metaValText: { fontSize: 13, color: colors.textPrimary, fontWeight: '700' },

  priorityBadge: { backgroundColor: 'rgba(56, 189, 248, 0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: '#38bdf8' },
  priorityBadgeText: { color: '#38bdf8', fontSize: 9.5, fontWeight: '800' },
  activeBadge: { backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#10b981' },
  activeBadgeText: { color: '#10b981', fontSize: 9.5, fontWeight: '800' },

  // Staff card extra items
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tenantName: { fontSize: 14.5, fontWeight: '800', color: colors.textPrimary },
  tenantSubText: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { color: '#f59e0b', fontSize: 11.5, fontWeight: '800' },

  // Modal styling
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.cardBorder, maxHeight: '85%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center' },
  modalTitle: { fontSize: 15.5, fontWeight: '800', color: colors.textPrimary },
  modalSubHeader: { fontSize: 11, color: colors.textSecondary, lineHeight: 16, marginTop: 4, marginBottom: 14 },
  modalScroll: { marginBottom: 16 },

  formGroup: { marginBottom: 14 },
  formRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
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

  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: colors.inputBorder, alignItems: 'center', justifyContent: 'center', marginRight: 8, backgroundColor: colors.inputBackground },
  checkboxChecked: { backgroundColor: '#38bdf8', borderColor: '#38bdf8' },
  checkboxLabel: { color: colors.textSecondary, fontSize: 8.5, fontWeight: '800' },

  modalActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 14, marginTop: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: colors.inputBorder },
  cancelBtnText: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '700' },
  submitBtn: { backgroundColor: '#38bdf8', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, minWidth: 110, alignItems: 'center', justifyContent: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#0f172a', fontSize: 12.5, fontWeight: '800' },

  // Details specifications elements
  detailContainer: { backgroundColor: colors.inputBackground, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder },
  ticketDetailTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '800', flex: 1, marginRight: 8 },
  ticketDescText: { color: colors.textMuted, fontSize: 12.5, lineHeight: 18, marginTop: 4 },
  modalSectionTitle: { fontSize: 9.5, fontWeight: '850', color: '#38bdf8', letterSpacing: 0.8, marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.surface },
  detailLabel: { color: colors.textMuted, fontSize: 12.5, fontWeight: '600' },
  detailVal: { color: colors.textSecondary, fontSize: 12.5, fontWeight: '700' },

  // Chat/Messaging Thread
  chatThreadWrapper: { maxHeight: 150, paddingBottom: 10 },
  noChatText: { color: '#64748b', fontSize: 12.5, fontStyle: 'italic', marginTop: 4 },
  chatBubble: { borderRadius: 10, padding: 8, marginBottom: 8, maxWidth: '85%' },
  chatBubbleMe: { backgroundColor: colors.surface, alignSelf: 'flex-end', borderWidth: 1, borderColor: colors.cardBorder },
  chatBubbleOther: { backgroundColor: colors.inputBackground, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.surface },
  chatSender: { fontSize: 9.5, color: '#38bdf8', fontWeight: '800', marginBottom: 2 },
  chatText: { color: colors.textPrimary, fontSize: 12 },
  chatTime: { fontSize: 8, color: '#64748b', textAlign: 'right', marginTop: 4 },
  chatInputRow: { flexDirection: 'row', gap: 6, marginTop: 10, alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, height: 36, paddingHorizontal: 10, color: colors.textPrimary, fontSize: 12 },
  chatSendBtn: { backgroundColor: '#38bdf8', width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
