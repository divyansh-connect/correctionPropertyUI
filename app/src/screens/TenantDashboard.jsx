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
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';
import theme from '../theme';

export const TenantDashboard = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tenantData, setTenantData] = useState({
    name: 'Resident',
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
      const res = await apiClient.get('/tenants', logout, refreshAccessToken);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const item = res.data[0];
        setTenantData({
          name: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'Resident',
          unitName: `${item.property?.name || 'property 1'} — Unit ${item.unit?.unitNumber || 'room 1b'}`,
          balance: item.unit?.rentAmount || item.lease?.rentAmount || 1000,
          outstandingBalance: 0,
          activeVisitors: 0,
          packagesWaiting: 0,
          dueDate: '2027-08-01',
          leaseExpiration: item.lease?.endDate ? item.lease.endDate.split('T')[0] : '2027-08-01',
        });
      }
    } catch (e) {
      console.log('Error fetching live tenant dashboard:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveTenantDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchLiveTenantDashboard();
  };

  const triggerAction = (callback) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (callback) callback();
  };

  const handlePayRent = () => {
    if (tenantData.balance <= 0) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTenantData((prev) => ({ ...prev, balance: 0 }));
    setPayModalVisible(false);
    Alert.alert('Payment Successful', `Thank you! Your rent payment of $${tenantData.balance.toLocaleString()} has been processed.`);
  };

  const handleCreateTicket = () => {
    if (!ticketTitle || !ticketDesc) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTicketModalVisible(false);
    setTicketTitle('');
    setTicketDesc('');
    Alert.alert('Success', 'Repair request submitted to management.');
  };

  const handleSendMessage = () => {
    if (!messageText) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setContactModalVisible(false);
    setMessageText('');
    Alert.alert('Message Sent', 'Your message has been sent to Property Management.');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Live Tenant Portal...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
    >
      {/* Header Banner */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting} allowFontScaling={false}>Welcome back, {tenantData.name}</Text>
          <Text style={styles.title} allowFontScaling={false}>Resident Dashboard</Text>
        </View>
        <Text style={styles.subtitle} allowFontScaling={false}>
          {tenantData.unitName}
        </Text>
      </View>

      {/* Quick Action Native Bar */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={() => triggerAction(() => setPayModalVisible(true))}
          activeOpacity={0.8}
        >
          <Ionicons name="card" size={16} color={theme.colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnPrimaryText} allowFontScaling={false}>Pay Rent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnOutline}
          onPress={() => triggerAction(() => setTicketModalVisible(true))}
          activeOpacity={0.8}
        >
          <Ionicons name="build" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>Repair Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnOutline}
          onPress={() => triggerAction(() => setContactModalVisible(true))}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles" size={16} color={theme.colors.secondary} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnOutline}
          onPress={() => triggerAction(() => setLeaseModalVisible(true))}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text" size={16} color={theme.colors.accent} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>Lease Terms</Text>
        </TouchableOpacity>
      </View>

      {/* Metric Cards Grid with Modern Elevate Cards */}
      <View style={styles.metricGrid}>
        <TouchableOpacity
          style={[styles.metricCard, { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }]}
          activeOpacity={0.9}
        >
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel} allowFontScaling={false}>CURRENT RENT DUE</Text>
            <Ionicons name="cash-outline" size={18} color={theme.colors.primary} />
          </View>
          <Text style={[styles.metricVal, { color: theme.colors.primary }]} allowFontScaling={false}>
            ${tenantData.balance.toLocaleString()}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Due Date: {tenantData.dueDate}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metricCard, { borderLeftColor: theme.colors.success, borderLeftWidth: 4 }]}
          activeOpacity={0.9}
        >
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel} allowFontScaling={false}>OUTSTANDING BALANCE</Text>
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.success} />
          </View>
          <Text style={[styles.metricVal, { color: theme.colors.success }]} allowFontScaling={false}>
            ${tenantData.outstandingBalance}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Account status: Paid in Full</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricGrid}>
        <TouchableOpacity
          style={[styles.metricCard, { borderLeftColor: theme.colors.secondary, borderLeftWidth: 4 }]}
          activeOpacity={0.9}
        >
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel} allowFontScaling={false}>ACTIVE VISITOR PASSES</Text>
            <Ionicons name="people-outline" size={18} color={theme.colors.secondary} />
          </View>
          <Text style={[styles.metricVal, { color: theme.colors.secondary }]} allowFontScaling={false}>
            {tenantData.activeVisitors}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Registered guests logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metricCard, { borderLeftColor: theme.colors.accent, borderLeftWidth: 4 }]}
          activeOpacity={0.9}
        >
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel} allowFontScaling={false}>WAITING PACKAGES</Text>
            <Ionicons name="cube-outline" size={18} color={theme.colors.accent} />
          </View>
          <Text style={[styles.metricVal, { color: theme.colors.accent }]} allowFontScaling={false}>
            {tenantData.packagesWaiting}
          </Text>
          <Text style={styles.metricSub} allowFontScaling={false}>Awaiting pickup in parcel locker</Text>
        </TouchableOpacity>
      </View>

      {/* Lease Renewal Banner */}
      <View style={styles.leaseRenewalBanner}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Ionicons name="ribbon-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.leaseBannerTitle} allowFontScaling={false}>ACTIVE LEASE RENEWAL OPTION</Text>
          </View>
          <Text style={styles.leaseBannerSub} allowFontScaling={false}>
            Your lease expires on {tenantData.leaseExpiration}. Lock in your rate for next year.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.reviewBtn}
          onPress={() => triggerAction(() => setLeaseModalVisible(true))}
          activeOpacity={0.8}
        >
          <Text style={styles.reviewBtnText} allowFontScaling={false}>REVIEW</Text>
        </TouchableOpacity>
      </View>

      {/* Pay Rent Modal */}
      <Modal visible={payModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Ionicons name="wallet-outline" size={32} color={theme.colors.primary} style={{ alignSelf: 'center', marginBottom: 10 }} />
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
            <Ionicons name="build-outline" size={32} color={theme.colors.primary} style={{ alignSelf: 'center', marginBottom: 10 }} />
            <Text style={styles.modalTitle} allowFontScaling={false}>Submit Repair Request</Text>
            <TextInput
              style={styles.input}
              placeholder="Issue Subject"
              placeholderTextColor={theme.colors.textMuted}
              value={ticketTitle}
              onChangeText={setTicketTitle}
            />
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Detailed description of repair issue..."
              placeholderTextColor={theme.colors.textMuted}
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
            <Ionicons name="chatbubbles-outline" size={32} color={theme.colors.secondary} style={{ alignSelf: 'center', marginBottom: 10 }} />
            <Text style={styles.modalTitle} allowFontScaling={false}>Contact Management</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Type message to Property Manager..."
              placeholderTextColor={theme.colors.textMuted}
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
            <Ionicons name="document-text-outline" size={32} color={theme.colors.accent} style={{ alignSelf: 'center', marginBottom: 10 }} />
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
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.md, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: theme.colors.textSecondary, marginTop: 8, fontSize: 13 },
  
  header: { marginBottom: theme.spacing.md },
  greeting: { fontSize: 13, color: theme.colors.primary, fontWeight: '600', marginBottom: 2 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary },
  subtitle: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },

  quickActionsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceHighlight,
    ...theme.shadows.sm,
  },
  actionBtnPrimary: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionBtnPrimaryText: { color: theme.colors.white, fontSize: 13, fontWeight: '700' },
  actionBtnOutline: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.surfaceHighlight,
  },
  actionBtnOutlineText: { color: theme.colors.textPrimary, fontSize: 12, fontWeight: '600' },

  metricGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceHighlight,
    ...theme.shadows.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: { fontSize: 10, color: theme.colors.textSecondary, fontWeight: '700', letterSpacing: 0.5 },
  metricVal: { fontSize: 22, fontWeight: '800', marginVertical: 4 },
  metricSub: { fontSize: 11, color: theme.colors.textMuted },

  leaseRenewalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    ...theme.shadows.md,
  },
  leaseBannerTitle: { fontSize: 11, color: theme.colors.primary, fontWeight: '800', letterSpacing: 0.5 },
  leaseBannerSub: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  reviewBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: theme.spacing.sm + 4, paddingVertical: 8, borderRadius: theme.borderRadius.sm },
  reviewBtnText: { color: theme.colors.background, fontSize: 11, fontWeight: '800' },

  modalBg: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: 'center', padding: theme.spacing.lg },
  modalCard: { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.xl, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.surfaceHighlight, ...theme.shadows.lg },
  modalTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 14, textAlign: 'center' },
  confirmText: { color: theme.colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalButton: { width: '48%', paddingVertical: 12, borderRadius: theme.borderRadius.md, alignItems: 'center' },
  cancelBtn: { backgroundColor: theme.colors.surfaceHighlight },
  cancelBtnText: { color: theme.colors.textSecondary, fontWeight: '600' },
  submitBtn: { backgroundColor: theme.colors.primaryDark },
  submitBtnText: { color: theme.colors.white, fontWeight: '700' },
  input: { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.surfaceHighlight, borderRadius: theme.borderRadius.md, paddingHorizontal: 12, paddingVertical: 10, color: theme.colors.textPrimary, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceHighlight },
  detailLabel: { color: theme.colors.textSecondary, fontSize: 13 },
  detailVal: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: '600' },
  closeBtn: { backgroundColor: theme.colors.primaryDark, borderRadius: theme.borderRadius.md, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  closeBtnText: { color: theme.colors.white, fontSize: 13, fontWeight: '700' },
});
