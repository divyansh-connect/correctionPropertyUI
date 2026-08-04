import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';

export const MaintenanceScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await apiClient.get('/maintenance/work-orders', logout, refreshAccessToken);
    if (res && (Array.isArray(res) || res.data)) {
      setOrders(Array.isArray(res) ? res : res.data);
    } else {
      setOrders([
        { id: 'WO-101', title: 'AC Cooling Leakage', unit: 'Unit 204', priority: 'High', status: 'In Progress' },
        { id: 'WO-102', title: 'Kitchen Sink Clogged', unit: 'Unit 102', priority: 'Medium', status: 'Pending' },
        { id: 'WO-103', title: 'Main Gate Lock Repair', unit: 'Building A', priority: 'Low', status: 'Completed' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const safeString = (val, fallback = 'N/A') => {
    if (!val) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') return val.unitNumber || val.title || val.name || fallback;
    return fallback;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Maintenance Orders...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>🛠️ Maintenance & Work Orders</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>Track repair requests & work orders</Text>
      </View>

      {orders.map((item, idx) => (
        <View key={item.id || `wo-${idx}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.woId} allowFontScaling={false}>{safeString(item.id, `WO-${idx + 1}`)}</Text>
            <View style={styles.badgePriority}>
              <Text style={styles.priorityText} allowFontScaling={false}>{safeString(item.priority, 'Medium')} Priority</Text>
            </View>
          </View>
          <Text style={styles.woTitle} allowFontScaling={false}>{safeString(item.title || item.issue, 'Work Order Request')}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.unit} allowFontScaling={false}>📍 {safeString(item.unit || item.unitNumber, 'Location TBD')}</Text>
            <View style={styles.badgeStatus}>
              <Text style={styles.statusText} allowFontScaling={false}>{safeString(item.status, 'Pending')}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  contentContainer: { padding: 16 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },
  header: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  woId: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },
  badgePriority: { backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  priorityText: { color: '#f87171', fontSize: 11, fontWeight: '700' },
  woTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc', marginVertical: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#334155' },
  unit: { color: '#94a3b8', fontSize: 12 },
  badgeStatus: { backgroundColor: 'rgba(56, 189, 248, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },
});
