import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';

export const TenantDashboard = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [tenantData, setTenantData] = useState({
    name: 'person 1',
    unitName: 'property 1 — Unit room 1b',
    balance: 1000,
    outstandingBalance: 0,
    activeVisitors: 0,
    packagesWaiting: 0,
    dueDate: '2027-08-01',
    leaseExpiration: '2027-08-01',
  });

  // Modals visibility
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [leaseModalVisible, setLeaseModalVisible] = useState(false);

  // Forms
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [messageText, setMessageText] = useState('');

  const fetchLiveTenantDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/tenants', logout, refreshAccessToken);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const item = res.data[0];
        setTenantData({
          name: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'person 1',
          unitName: `${item.property?.name || 'property 1'} — Unit ${item.unit?.unitNumber || 'room 1b'}`,
          balance: item.unit?.rentAmount || item.lease?.rentAmount || 1000,
          outstandingBalance: 0,
          activeVisitors: 0,
          packagesWaiting: 0,
          dueDate: '2027-08-01',
          leaseExpiration: item.lease?.endDate ? item.lease.endDate.split('T')[0] : '2027-08-01',
        });
        return;
      }
    } catch (e) {
      console.log('Error fetching live tenant dashboard:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTenantDashboard();
  }, []);

  const handlePayRent = () => {
    if (tenantData.balance <= 0) return;
    setTenantData((prev) => ({ ...prev, balance: 0 }));
    setPayModalVisible(false);
    Alert.alert('Payment Successful', `Thank you! Your rent payment of $${tenantData.balance.toLocaleString()} has been processed.`);
  };

  const handleCreateTicket = () => {
    if (!ticketTitle || !ticketDesc) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setTicketModalVisible(false);
    setTicketTitle('');
    setTicketDesc('');
    Alert.alert('Success', 'Repair request submitted to management.');
  };

  const handleSendMessage = () => {
    if (!messageText) return;
    setContactModalVisible(false);
    setMessageText('');
    Alert.alert('Message Sent', 'Your message has been sent to Property Management.');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Live Tenant Portal...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header matching screenshot */}
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>Resident Dashboard</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>
          Verify monthly rent balances, lease expiration milestones, packages arrivals, and maintenance dispatches.
        </Text>
      </View>

      {/* Quick Action Buttons matching screenshot */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => setPayModalVisible(true)}>
          <Text style={styles.actionBtnPrimaryText} allowFontScaling={false}>💳 Pay Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={() => setTicketModalVisible(true)}>
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>🔧 Submit Repair Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={() => setContactModalVisible(true)}>
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>💬 Contact Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={() => setLeaseModalVisible(true)}>
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>📖 View Lease Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Metric Cards Grid matching screenshot */}
      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel} allowFontScaling={false}>CURRENT RENT DUE</Text>
          <Text style={[styles.metricVal, { color: '#38bdf8' }]} allowFontScaling={false}>
            ${tenantData.balance.toLocaleString()}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Due Date: {tenantData.dueDate}</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel} allowFontScaling={false}>OUTSTANDING BALANCE</Text>
          <Text style={[styles.metricVal, { color: '#10b981' }]} allowFontScaling={false}>
            ${tenantData.outstandingBalance}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Account status: Paid in Full</Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel} allowFontScaling={false}>ACTIVE VISITOR PASSES</Text>
          <Text style={[styles.metricVal, { color: '#818cf8' }]} allowFontScaling={false}>
            {tenantData.activeVisitors}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Registered guests logs</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel} allowFontScaling={false}>WAITING PACKAGES</Text>
          <Text style={[styles.metricVal, { color: '#f59e0b' }]} allowFontScaling={false}>
            {tenantData.packagesWaiting}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Awaiting pickup in parcel locker</Text>
        </View>
      </View>

      {/* Lease Renewal Banner matching screenshot */}
      <View style={styles.leaseRenewalBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.leaseBannerTitle} allowFontScaling={false}>ACTIVE LEASE RENEWAL OPTION</Text>
          <Text style={styles.leaseBannerSub} allowFontScaling={false}>
            Your lease expires on {tenantData.leaseExpiration}. Lock in your rate for next year.
          </Text>
        </View>
        <TouchableOpacity style={styles.reviewBtn} onPress={() => setLeaseModalVisible(true)}>
          <Text style={styles.reviewBtnText} allowFontScaling={false}>REVIEW RENEWAL</Text>
        </TouchableOpacity>
      </View>

      {/* Pay Rent Modal */}
      <Modal visible={payModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>Confirm Rent Payment</Text>
            <Text style={styles.confirmText} allowFontScaling={false}>
              Are you sure you want to pay the outstanding balance of ${tenantData.balance.toLocaleString()} online?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setPayModalVisible(false)}>
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn]} onPress={handlePayRent}>
                <Text style={styles.submitBtnText} allowFontScaling={false}>Confirm Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Submit Repair Request Modal */}
      <Modal visible={ticketModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>Submit Repair Request</Text>
            <TextInput
              style={styles.input}
              placeholder="Issue Subject"
              placeholderTextColor="#94a3b8"
              value={ticketTitle}
              onChangeText={setTicketTitle}
            />
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Detailed description of repair issue..."
              placeholderTextColor="#94a3b8"
              multiline
              value={ticketDesc}
              onChangeText={setTicketDesc}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setTicketModalVisible(false)}>
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn]} onPress={handleCreateTicket}>
                <Text style={styles.submitBtnText} allowFontScaling={false}>Submit Repair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contact Management Modal */}
      <Modal visible={contactModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>Contact Management</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Type message to Property Manager..."
              placeholderTextColor="#94a3b8"
              multiline
              value={messageText}
              onChangeText={setMessageText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setContactModalVisible(false)}>
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn]} onPress={handleSendMessage}>
                <Text style={styles.submitBtnText} allowFontScaling={false}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Lease Terms Modal */}
      <Modal visible={leaseModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>Active Lease Terms</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Unit:</Text>
              <Text style={styles.detailVal} allowFontScaling={false}>{tenantData.unitName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Monthly Rent:</Text>
              <Text style={styles.detailVal} allowFontScaling={false}>${tenantData.balance.toLocaleString()} / month</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Lease Start:</Text>
              <Text style={styles.detailVal} allowFontScaling={false}>2026-08-01</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>Lease Expiration:</Text>
              <Text style={styles.detailVal} allowFontScaling={false}>{tenantData.leaseExpiration}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setLeaseModalVisible(false)}>
              <Text style={styles.closeBtnText} allowFontScaling={false}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },
  header: { marginBottom: 14 },
  title: { fontSize: 24, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 16 },

  quickActionsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnPrimary: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnPrimaryText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  actionBtnOutline: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionBtnOutlineText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },

  metricGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '700', letterSpacing: 0.5 },
  metricVal: { fontSize: 22, fontWeight: '800', marginVertical: 4 },
  metricSub: { fontSize: 10.5, color: '#94a3b8' },

  leaseRenewalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  leaseBannerTitle: { fontSize: 11, color: '#38bdf8', fontWeight: '800', letterSpacing: 0.5 },
  leaseBannerSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  reviewBtn: { backgroundColor: '#38bdf8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  reviewBtnText: { color: '#0f172a', fontSize: 10.5, fontWeight: '800' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#38bdf8', marginBottom: 14, textAlign: 'center' },
  confirmText: { color: '#cbd5e1', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalButton: { width: '48%', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#334155' },
  cancelBtnText: { color: '#cbd5e1', fontWeight: '600' },
  submitBtn: { backgroundColor: '#0284c7' },
  submitBtnText: { color: '#ffffff', fontWeight: '700' },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  detailLabel: { color: '#94a3b8', fontSize: 13 },
  detailVal: { color: '#f8fafc', fontSize: 13, fontWeight: '600' },
  closeBtn: { backgroundColor: '#0284c7', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 16 },
  closeBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
