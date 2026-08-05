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
  Platform,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore, useThemeStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export const TenantDashboard = ({ onNavigate }) => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const { theme } = useThemeStore();
  const isDarkMode = theme === 'dark';

  const colors = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    cardBg: isDarkMode ? '#1e293b' : '#ffffff',
    cardBorder: isDarkMode ? '#334155' : '#e2e8f0',
    textPrimary: isDarkMode ? '#f8fafc' : '#0f172a',
    textSecondary: isDarkMode ? '#94a3b8' : '#475569',
    textMuted: isDarkMode ? '#64748b' : '#94a3b8',
    inputBg: isDarkMode ? '#0f172a' : '#f1f5f9',
    inputBorder: isDarkMode ? '#334155' : '#cbd5e1',
  };

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
          unitName: `${item.property?.name || 'property 1'} · Unit ${item.unit?.unitNumber || 'room 1b'}`,
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
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]} allowFontScaling={false}>Loading Live Tenant Portal...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.scrollContent}>
      {/* Header welcome banner */}
      <View style={styles.header}>
        <View style={styles.welcomeRow}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]} allowFontScaling={false}>Hello,</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]} allowFontScaling={false}>{tenantData.name}</Text>
          </View>
          <View style={styles.headerRightActions}>
            {/* Notification Bell Icon */}
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => onNavigate && onNavigate('notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText} allowFontScaling={false}>3</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.avatarContainer, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: colors.cardBorder }]}>
              <Text style={styles.avatarText} allowFontScaling={false}>
                {tenantData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]} allowFontScaling={false}>
          📍 {tenantData.unitName}
        </Text>
      </View>

      {/* Quick Action Tiles */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>QUICK ACTIONS</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} onPress={() => setPayModalVisible(true)}>
          <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <Ionicons name="card" size={22} color="#38bdf8" />
          </View>
          <Text style={[styles.actionCardText, { color: colors.textPrimary }]} allowFontScaling={false}>Pay Rent</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} onPress={() => setTicketModalVisible(true)}>
          <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Ionicons name="hammer" size={22} color="#ef4444" />
          </View>
          <Text style={[styles.actionCardText, { color: colors.textPrimary }]} allowFontScaling={false}>Submit Repair</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} onPress={() => setContactModalVisible(true)}>
          <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="chatbubbles" size={22} color="#10b981" />
          </View>
          <Text style={[styles.actionCardText, { color: colors.textPrimary }]} allowFontScaling={false}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]} onPress={() => setLeaseModalVisible(true)}>
          <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="document-text" size={22} color="#f59e0b" />
          </View>
          <Text style={[styles.actionCardText, { color: colors.textPrimary }]} allowFontScaling={false}>Lease Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Metric Cards Grid */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>OVERVIEW & STATS</Text>
      
      <View style={styles.metricGrid}>
        <View style={[styles.metricCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.metricHeaderRow}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]} allowFontScaling={false}>CURRENT RENT DUE</Text>
            <Ionicons name="wallet-outline" size={16} color={colors.textSecondary} />
          </View>
          <Text style={[styles.metricVal, { color: '#38bdf8' }]} allowFontScaling={false}>
            ${tenantData.balance.toLocaleString()}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]} allowFontScaling={false}>Due Date: {tenantData.dueDate}</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.metricHeaderRow}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]} allowFontScaling={false}>OUTSTANDING</Text>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
          </View>
          <Text style={[styles.metricVal, { color: '#10b981' }]} allowFontScaling={false}>
            ${tenantData.outstandingBalance}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]} allowFontScaling={false}>Status: Paid in Full</Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <View style={[styles.metricCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.metricHeaderRow}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]} allowFontScaling={false}>ACTIVE VISITORS</Text>
            <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
          </View>
          <Text style={[styles.metricVal, { color: '#818cf8' }]} allowFontScaling={false}>
            {tenantData.activeVisitors}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]} allowFontScaling={false}>Registered guest logs</Text>
        </View>

        <View style={[styles.metricCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.metricHeaderRow}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]} allowFontScaling={false}>WAITING PACKAGES</Text>
            <Ionicons name="cube-outline" size={16} color={colors.textSecondary} />
          </View>
          <Text style={[styles.metricVal, { color: '#f59e0b' }]} allowFontScaling={false}>
            {tenantData.packagesWaiting}
          </Text>
          <Text style={[styles.metricSub, { color: colors.textMuted }]} allowFontScaling={false}>Awaiting pickup</Text>
        </View>
      </View>

      {/* Lease Renewal Banner */}
      <View style={[styles.leaseRenewalBanner, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={[styles.actionIconWrapper, { backgroundColor: 'rgba(56, 189, 248, 0.15)', marginRight: 12 }]}>
          <Ionicons name="time" size={24} color="#38bdf8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.leaseBannerTitle} allowFontScaling={false}>LEASE RENEWAL OPTION</Text>
          <Text style={[styles.leaseBannerSub, { color: colors.textSecondary }]} allowFontScaling={false}>
            Expires: {tenantData.leaseExpiration}. Lock your rate now.
          </Text>
        </View>
        <TouchableOpacity style={styles.reviewBtn} onPress={() => setLeaseModalVisible(true)}>
          <Text style={styles.reviewBtnText} allowFontScaling={false}>Review</Text>
        </TouchableOpacity>
      </View>

      {/* Pay Rent Modal */}
      <Modal visible={payModalVisible} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.modalIconCenter}>
              <Ionicons name="card-outline" size={42} color="#38bdf8" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]} allowFontScaling={false}>Confirm Rent Payment</Text>
            <Text style={[styles.confirmText, { color: colors.textSecondary }]} allowFontScaling={false}>
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
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]} allowFontScaling={false}>Submit Repair Request</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary }]}
              placeholder="Issue Subject (e.g. AC leaking)"
              placeholderTextColor="#64748b"
              value={ticketTitle}
              onChangeText={setTicketTitle}
            />
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary, height: 100, textAlignVertical: 'top' }]}
              placeholder="Detailed description of repair issue..."
              placeholderTextColor="#64748b"
              multiline
              value={ticketDesc}
              onChangeText={setTicketDesc}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setTicketModalVisible(false)}>
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn, { backgroundColor: '#ef4444' }]} onPress={handleCreateTicket}>
                <Text style={styles.submitBtnText} allowFontScaling={false}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contact Management Modal */}
      <Modal visible={contactModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]} allowFontScaling={false}>Contact Management</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.textPrimary, height: 120, textAlignVertical: 'top' }]}
              placeholder="Type your message to Property Manager..."
              placeholderTextColor="#64748b"
              multiline
              value={messageText}
              onChangeText={setMessageText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setContactModalVisible(false)}>
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn, { backgroundColor: '#10b981' }]} onPress={handleSendMessage}>
                <Text style={styles.submitBtnText} allowFontScaling={false}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Lease Terms Modal */}
      <Modal visible={leaseModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <View style={styles.modalIconCenter}>
              <Ionicons name="document-text-outline" size={42} color="#f59e0b" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]} allowFontScaling={false}>Active Lease Terms</Text>
            
            <View style={[styles.detailCard, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
              <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]} allowFontScaling={false}>Unit Number</Text>
                <Text style={[styles.detailVal, { color: colors.textPrimary }]} allowFontScaling={false}>{tenantData.unitName.split('·')[1]?.trim() || tenantData.unitName}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]} allowFontScaling={false}>Monthly Rent</Text>
                <Text style={[styles.detailVal, { color: '#38bdf8' }]} allowFontScaling={false}>${tenantData.balance.toLocaleString()} / month</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]} allowFontScaling={false}>Lease Start</Text>
                <Text style={[styles.detailVal, { color: colors.textPrimary }]} allowFontScaling={false}>2026-08-01</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]} allowFontScaling={false}>Lease Expiration</Text>
                <Text style={[styles.detailVal, { color: '#f59e0b' }]} allowFontScaling={false}>{tenantData.leaseExpiration}</Text>
              </View>
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
  header: { marginBottom: 20 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', color: '#f8fafc' },
  avatarContainer: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(56, 189, 248, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  subtitle: { fontSize: 13, color: '#cbd5e1', marginTop: 6, fontWeight: '500' },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 1,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '23%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionCardText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  metricGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '800', letterSpacing: 0.5 },
  metricVal: { fontSize: 24, fontWeight: '800', marginVertical: 4 },
  metricSub: { fontSize: 11, color: '#94a3b8' },

  leaseRenewalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  leaseBannerTitle: { fontSize: 11, color: '#38bdf8', fontWeight: '800', letterSpacing: 0.5 },
  leaseBannerSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  reviewBtn: { backgroundColor: '#38bdf8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  reviewBtnText: { color: '#0f172a', fontSize: 11, fontWeight: '800' },

  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 22, borderWidth: 1, borderColor: '#334155' },
  modalIconCenter: { alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc', marginBottom: 12, textAlign: 'center' },
  confirmText: { color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 18 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalButton: { width: '48%', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#334155' },
  cancelBtnText: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  submitBtn: { backgroundColor: '#0284c7' },
  submitBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: '#f8fafc', marginBottom: 14, fontSize: 13 },
  detailCard: { backgroundColor: '#0f172a', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#334155' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  detailLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
  detailVal: { color: '#f8fafc', fontSize: 13, fontWeight: '700' },
  closeBtn: { backgroundColor: '#334155', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  closeBtnText: { color: '#cbd5e1', fontSize: 13, fontWeight: '700' },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    position: 'relative',
    padding: 4,
    marginRight: 6,
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 7,
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  avatarText: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 14,
  },
});

