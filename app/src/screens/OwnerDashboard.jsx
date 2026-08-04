import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/useStore';

export const OwnerDashboard = () => {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const ownerName = user?.name || user?.firstName || 'Owner';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} tintColor="#38bdf8" />}
    >
      <View style={styles.header}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText} allowFontScaling={false}>💼 Property Owner</Text>
        </View>
        <Text style={styles.title} allowFontScaling={false}>Owner Portal</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>Welcome back, {ownerName}</Text>
      </View>

      {/* Web-Matching Quick Actions Bar */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => Alert.alert('Downloading', 'Generating monthly statement PDF...')}>
          <Text style={styles.actionBtnPrimaryText} allowFontScaling={false}>📥 Statement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnOutline} onPress={() => Alert.alert('Tax Documents', 'Tax documents ready for download.')}>
          <Text style={styles.actionBtnOutlineText} allowFontScaling={false}>📑 Tax Docs</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Owner Metric Cards matching Web App */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>MANAGED PROPERTIES</Text>
          <Text style={[styles.kpiVal, { color: '#38bdf8' }]} allowFontScaling={false}>3</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Active Assets</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>OCCUPANCY RATE</Text>
          <Text style={[styles.kpiVal, { color: '#4ade80' }]} allowFontScaling={false}>94.5%</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>12 Total Units</Text>
        </View>
      </View>

      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>MONTHLY NET INCOME</Text>
          <Text style={[styles.kpiVal, { color: '#4ade80' }]} allowFontScaling={false}>$21,300</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Operating Cash Flow</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>PENDING MAINTENANCE</Text>
          <Text style={[styles.kpiVal, { color: '#facc15' }]} allowFontScaling={false}>2</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Active Requests</Text>
        </View>
      </View>

      {/* Properties Summary */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>🏢 Owned Properties Overview</Text>
      </View>

      <View style={styles.propCard}>
        <Text style={styles.propName} allowFontScaling={false}>Sunset Heights Apartments</Text>
        <Text style={styles.propSub} allowFontScaling={false}>📍 123 Palm Drive, LA • 12 Units (92% Occupied)</Text>
        <Text style={styles.propRev} allowFontScaling={false}>Net Distribution: $14,200/mo</Text>
      </View>

      <View style={styles.propCard}>
        <Text style={styles.propName} allowFontScaling={false}>Oakwood Residences</Text>
        <Text style={styles.propSub} allowFontScaling={false}>📍 789 Oak Lane, Austin • 20 Units (85% Occupied)</Text>
        <Text style={styles.propRev} allowFontScaling={false}>Net Distribution: $7,100/mo</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16 },
  header: { marginBottom: 14 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  roleBadgeText: { color: '#38bdf8', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },

  quickActionsBar: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  actionBtnPrimary: { flex: 1, backgroundColor: '#0284c7', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  actionBtnPrimaryText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  actionBtnOutline: { flex: 1, backgroundColor: '#1e293b', paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  actionBtnOutlineText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },

  kpiGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  kpiCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#334155' },
  kpiLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', letterSpacing: 0.5 },
  kpiVal: { fontSize: 20, fontWeight: '800', color: '#f8fafc', marginVertical: 4 },
  kpiSub: { fontSize: 10.5, color: '#94a3b8' },

  sectionHeader: { marginTop: 14, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  propCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  propName: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  propSub: { color: '#94a3b8', fontSize: 12, marginVertical: 4 },
  propRev: { color: '#4ade80', fontSize: 13, fontWeight: '700' },
});
