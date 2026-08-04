import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '../store/useStore';

export const StaffDashboard = () => {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const workOrders = [
    { id: 'WO-101', title: 'AC Cooling Leakage', location: 'Sunset Heights #204', priority: 'High', status: 'In Progress' },
    { id: 'WO-102', title: 'Kitchen Sink Clogged', location: 'Grand Horizon #102', priority: 'Medium', status: 'Pending' },
    { id: 'WO-103', title: 'Main Gate Lock Repair', location: 'Building A Lobby', priority: 'Low', status: 'Completed' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} tintColor="#38bdf8" />}
    >
      <View style={styles.header}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText} allowFontScaling={false}>🛠️ Maintenance Staff</Text>
        </View>
        <Text style={styles.title} allowFontScaling={false}>Work Orders Dashboard</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>Manage repair tasks, assigned units & work orders</Text>
      </View>

      {/* KPI Stats */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>ASSIGNED ORDERS</Text>
          <Text style={[styles.kpiVal, { color: '#38bdf8' }]} allowFontScaling={false}>4</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Active Work Tickets</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>IN PROGRESS</Text>
          <Text style={[styles.kpiVal, { color: '#facc15' }]} allowFontScaling={false}>2</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Currently Repairing</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>COMPLETED (THIS MONTH)</Text>
          <Text style={[styles.kpiVal, { color: '#4ade80' }]} allowFontScaling={false}>14</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Resolved Tickets</Text>
        </View>
      </View>

      {/* Work Orders List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>📋 Assigned Work Orders</Text>
      </View>

      {workOrders.map((wo) => (
        <View key={wo.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.woId} allowFontScaling={false}>{wo.id}</Text>
            <View style={[styles.priorityBadge, wo.priority === 'High' ? styles.priorityHigh : styles.priorityMed]}>
              <Text style={styles.priorityText} allowFontScaling={false}>{wo.priority} Priority</Text>
            </View>
          </View>
          <Text style={styles.woTitle} allowFontScaling={false}>{wo.title}</Text>
          <Text style={styles.woLocation} allowFontScaling={false}>📍 {wo.location}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.statusText} allowFontScaling={false}>Status: {wo.status}</Text>
            <TouchableOpacity style={styles.updateBtn}>
              <Text style={styles.updateBtnText} allowFontScaling={false}>Update Status →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16 },
  header: { marginBottom: 16 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  roleBadgeText: { color: '#f87171', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  kpiGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiLabel: { fontSize: 9.5, color: '#94a3b8', fontWeight: '700', letterSpacing: 0.5 },
  kpiVal: { fontSize: 18, fontWeight: '800', marginVertical: 2 },
  kpiSub: { fontSize: 9.5, color: '#94a3b8', textAlign: 'center' },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  woId: { color: '#38bdf8', fontSize: 12, fontWeight: '700' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  priorityHigh: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  priorityMed: { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
  priorityText: { color: '#f87171', fontSize: 11, fontWeight: '700' },
  woTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc', marginVertical: 6 },
  woLocation: { color: '#94a3b8', fontSize: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#334155' },
  statusText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
  updateBtn: { padding: 4 },
  updateBtnText: { color: '#38bdf8', fontSize: 12, fontWeight: '700' },
});
