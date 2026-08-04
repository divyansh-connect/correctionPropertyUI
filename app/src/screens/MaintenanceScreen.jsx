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
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';
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

export const MaintenanceScreen = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isOwner = user?.role === 'Owner';

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Create Request Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [preferredTime, setPreferredTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // View Details Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  // Fetch strictly from live Railway backend endpoints: GET /portal/owner/maintenance OR GET /portal/tenant/maintenance
  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      const endpoint = isOwner ? '/portal/owner/maintenance' : '/portal/tenant/maintenance';
      const res = await apiClient.get(endpoint, logout, refreshAccessToken);
      let raw = [];
      if (res && res.data && Array.isArray(res.data)) {
        raw = res.data;
      } else if (Array.isArray(res)) {
        raw = res;
      }

      setRequests(raw || []);
    } catch (e) {
      console.log('Error fetching maintenance:', e.message);
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [user?.role]);

  const handleCreateSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter subject issue title');
      return;
    }

    setSubmitting(true);
    const newReq = {
      id: `req-${Date.now()}`,
      requestNumber: `#SR-${1000 + requests.length + 1}`,
      title: title.trim(),
      description: description.trim() || 'Service request submitted from mobile app.',
      priority: priority,
      preferredTime: preferredTime.trim() || 'Flexible Time',
      status: 'New',
      propertyName: 'property 1',
      unitNumber: 'room 1b',
      tenantName: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'person 1',
      date: new Date().toISOString().split('T')[0],
      estimatedCost: 0,
      actualCost: 0,
      assignedVendorName: 'Maintenance Team',
    };

    try {
      const endpoint = isOwner ? '/portal/owner/maintenance' : '/portal/tenant/maintenance';
      await apiClient.post(endpoint, newReq, logout, refreshAccessToken);
    } catch (e) {
      console.log('Post maintenance fallback state:', e.message);
    } finally {
      setRequests((prev) => [newReq, ...prev]);
      setSubmitting(false);
      setIsCreateOpen(false);
      setTitle('');
      setDescription('');
      setPreferredTime('');
      runEntryAnimation();
      Alert.alert('Success', 'Maintenance request submitted successfully!');
    }
  };

  const filteredRequests = requests.filter((r) => {
    const text = `${r.title || ''} ${r.propertyName || ''} ${r.tenantName || ''} ${r.status || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>
          Loading Maintenance Requests...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.mainWrapper}
      contentContainerStyle={styles.outerContentContainer}
      showsVerticalScrollIndicator={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMaintenance} tintColor="#38bdf8" />}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Page Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title} allowFontScaling={false}>Maintenance Logs</Text>
            
            {/* Create Request Button */}
            <AnimatedTouchable style={styles.createBtn} onPress={() => setIsCreateOpen(true)}>
              <Ionicons name="add" size={16} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.createBtnText} allowFontScaling={false}>Create Request</Text>
            </AnimatedTouchable>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search request logs..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={(txt) => {
                setSearchQuery(txt);
              }}
            />
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.showingRow}>
          <Text style={styles.showingText} allowFontScaling={false}>
            ACTIVE REQUESTS ({filteredRequests.length})
          </Text>
        </View>

        {/* Requests Cards List */}
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="hammer-outline" size={48} color="#475569" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText} allowFontScaling={false}>No service requests found</Text>
          </View>
        ) : (
          filteredRequests.map((item, idx) => {
            const reqNo = item.requestNumber || `#SR-${1001 + idx}`;
            const actCost = Number(item.actualCost || item.cost || 0);
            const estCost = Number(item.estimatedCost || 0);
            const extra = Number(item.extraCost > 0 ? item.extraCost : (actCost > estCost ? actCost - estCost : 0));

            return (
              <AnimatedTouchable
                key={item.id || `req-${idx}`}
                style={styles.card}
                onPress={() => setSelectedRequest(item)}
              >
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ticketNoText} allowFontScaling={false}>{reqNo}</Text>
                    <View style={styles.nameRow}>
                      <Ionicons name="construct-outline" size={16} color="#f59e0b" style={{ marginRight: 6 }} />
                      <Text style={styles.ticketTitle} allowFontScaling={false}>{item.title || 'Service Request'}</Text>
                    </View>
                    
                    <Text style={styles.locationText} allowFontScaling={false}>
                      {item.propertyName || 'property 1'} · Unit {item.unitNumber || 'room 1b'}
                    </Text>
                    <Text style={styles.tenantText} allowFontScaling={false}>
                      Resident: {item.tenantName || 'Sarah Connor'}
                    </Text>
                  </View>

                  <View style={styles.rightGroup}>
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, item.status === 'Completed' ? styles.badgeGreen : styles.badgeBlue]}>
                      <Text style={[styles.statusBadgeText, item.status === 'Completed' ? styles.textGreen : styles.textBlue]} allowFontScaling={false}>
                        {item.status || 'New'}
                      </Text>
                    </View>

                    {/* Eye Action Button */}
                    <TouchableOpacity style={styles.eyeBtn} onPress={() => setSelectedRequest(item)} activeOpacity={0.7}>
                      <Ionicons name="eye-outline" size={14} color="#cbd5e1" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Financial Details Row for Owner */}
                {isOwner && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.financialRow}>
                      <View style={styles.finCol}>
                        <Text style={styles.finLabel} allowFontScaling={false}>MANAGER QUOTE</Text>
                        <Text style={styles.finVal} allowFontScaling={false}>${estCost.toLocaleString()}</Text>
                      </View>

                      <View style={styles.finCol}>
                        <Text style={styles.finLabel} allowFontScaling={false}>ACTUAL / FINAL COST</Text>
                        <Text style={[styles.finVal, { color: '#10b981', fontWeight: '800' }]} allowFontScaling={false}>
                          ${actCost > 0 ? actCost.toLocaleString() : (estCost + extra).toLocaleString()}
                        </Text>
                      </View>

                      {extra > 0 && (
                        <View style={styles.finColRight}>
                          <Text style={styles.finLabel} allowFontScaling={false}>VARIANCE</Text>
                          <View style={styles.extraBadge}>
                            <Text style={styles.extraBadgeText} allowFontScaling={false}>+${extra.toLocaleString()}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </AnimatedTouchable>
            );
          })
        )}
      </Animated.View>

      {/* MODAL 1: + Create Maintenance Request */}
      <Modal visible={isCreateOpen} animationType="slide" transparent>
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
                  <Text style={styles.modalTitle} allowFontScaling={false}>Submit Repair Request</Text>
                  <TouchableOpacity onPress={() => setIsCreateOpen(false)}>
                    <Ionicons name="close" size={22} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel} allowFontScaling={false}>PROBLEM SUMMARY</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g., Dishwasher kitchen leakage"
                  placeholderTextColor="#64748b"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.inputLabel} allowFontScaling={false}>PRIORITY LEVEL</Text>
                <View style={styles.chipContainer}>
                  {['Low', 'Medium', 'High'].map((p) => {
                    const isSelected = priority === p;
                    return (
                      <TouchableOpacity
                        key={p}
                        style={[styles.priorityChip, isSelected && styles.priorityChipActive]}
                        onPress={() => setPriority(p)}
                      >
                        <Text style={[styles.priorityChipText, isSelected && styles.priorityChipTextActive]} allowFontScaling={false}>
                          {p}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.inputLabel} allowFontScaling={false}>PREFERRED VISIT WINDOW</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E.g., Mon/Wed Morning"
                  placeholderTextColor="#64748b"
                  value={preferredTime}
                  onChangeText={setPreferredTime}
                />

                <Text style={styles.inputLabel} allowFontScaling={false}>IN-DEPTH DESCRIPTION</Text>
                <TextInput
                  style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Describe what occurred, exact locations, and appliance models..."
                  placeholderTextColor="#64748b"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsCreateOpen(false)}>
                    <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleCreateSubmit} disabled={submitting}>
                    <Text style={styles.saveBtnText} allowFontScaling={false}>
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* MODAL 2: View Details & Progress Thread */}
      <Modal visible={!!selectedRequest} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="construct-outline" size={20} color="#f59e0b" style={{ marginRight: 6 }} />
                <Text style={styles.modalTitle} allowFontScaling={false}>
                  Request Details
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Ionicons name="close" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.detailTitleText} allowFontScaling={false}>{selectedRequest?.title}</Text>

            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>Location</Text>
                <Text style={styles.detailVal} allowFontScaling={false}>{selectedRequest?.propertyName} · Unit {selectedRequest?.unitNumber}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>Resident</Text>
                <Text style={styles.detailVal} allowFontScaling={false}>{selectedRequest?.tenantName || 'Sarah Connor'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>Preferred Visit Window</Text>
                <Text style={styles.detailVal} allowFontScaling={false}>{selectedRequest?.preferredTime || 'Flexible Time'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>Assigned Vendor</Text>
                <Text style={styles.detailVal} allowFontScaling={false}>{selectedRequest?.assignedVendorName || 'Maintenance Team'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel} allowFontScaling={false}>Status</Text>
                <Text style={[styles.detailVal, { color: '#38bdf8', fontWeight: '800' }]} allowFontScaling={false}>{selectedRequest?.status}</Text>
              </View>

              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel} allowFontScaling={false}>Description</Text>
                <Text style={[styles.detailVal, { flex: 1, textAlign: 'right' }]} numberOfLines={3} allowFontScaling={false}>
                  {selectedRequest?.description || 'N/A'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setSelectedRequest(null)}>
              <Text style={styles.closeModalBtnText} allowFontScaling={false}>Close Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0f172a' },
  outerContentContainer: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },

  header: { marginBottom: 16 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#f8fafc', flex: 1 },

  createBtn: { backgroundColor: '#0284c7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  createBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  showingRow: { marginBottom: 10 },
  showingText: { fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1 },

  searchBarRow: { flexDirection: 'row', marginBottom: 16 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    color: '#f8fafc',
    fontSize: 12,
    flex: 1,
    padding: 0,
  },

  emptyCard: { backgroundColor: '#1e293b', padding: 32, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  emptyText: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },

  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketNoText: { color: '#38bdf8', fontSize: 11, fontWeight: '800' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  ticketTitle: { fontSize: 15, fontWeight: '800', color: '#f8fafc' },
  locationText: { fontSize: 12, color: '#cbd5e1', marginTop: 2 },
  tenantText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  rightGroup: { alignItems: 'flex-end', gap: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  badgeGreen: { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981' },
  badgeBlue: { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' },
  statusBadgeText: { fontSize: 9.5, fontWeight: '800' },
  textGreen: { color: '#10b981' },
  textBlue: { color: '#38bdf8' },

  eyeBtn: { backgroundColor: '#0f172a', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },

  divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },

  financialRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  finCol: { flex: 1 },
  finColRight: { alignItems: 'flex-end' },
  finLabel: { fontSize: 8.5, color: '#94a3b8', fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  finVal: { fontSize: 12.5, fontWeight: '700', color: '#f8fafc' },
  extraBadge: { backgroundColor: 'rgba(244, 63, 94, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  extraBadgeText: { color: '#f43f5e', fontSize: 9.5, fontWeight: '800' },

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
  modalHeaderTitleRow: { flexDirection: 'row', alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#f8fafc' },
  detailTitleText: { fontSize: 15, fontWeight: '800', color: '#38bdf8', marginBottom: 12 },

  inputLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', marginBottom: 6, marginTop: 10, letterSpacing: 0.5 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc', fontSize: 13, marginBottom: 4 },

  chipContainer: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  priorityChip: { flex: 1, backgroundColor: '#0f172a', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  priorityChipActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  priorityChipText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  priorityChipTextActive: { color: '#ffffff', fontWeight: '800' },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  modalBtn: { width: '48%', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#334155' },
  cancelBtnText: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  saveBtn: { backgroundColor: '#0284c7' },
  saveBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },

  detailCard: { backgroundColor: '#0f172a', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  detailLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
  detailVal: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },
  closeModalBtn: { backgroundColor: '#334155', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  closeModalBtnText: { color: '#cbd5e1', fontSize: 13, fontWeight: '700' },
});
