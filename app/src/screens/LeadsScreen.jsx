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

export const LeadsScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const res = await apiClient.get('/leasing/leads', logout, refreshAccessToken);
    if (res && (Array.isArray(res) || res.data)) {
      setLeads(Array.isArray(res) ? res : res.data);
    } else {
      setLeads([
        { id: '1', name: 'John Doe', property: 'Sunset Heights #204', status: 'New', phone: '+1 555-0192', moveIn: 'Aug 15' },
        { id: '2', name: 'Sarah Smith', property: 'Oakwood #101', status: 'Tour Scheduled', phone: '+1 555-0188', moveIn: 'Sep 01' },
        { id: '3', name: 'Michael Brown', property: 'Grand Horizon #5', status: 'Application Sent', phone: '+1 555-0144', moveIn: 'Aug 20' },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const safeString = (val, fallback = 'N/A') => {
    if (!val) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') return val.name || val.title || val.propertyName || fallback;
    return fallback;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Leads Pipeline...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>🔑 Leasing & Leads</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>Track prospective tenants & applications</Text>
      </View>

      {leads.map((item, idx) => (
        <View key={item.id || `lead-${idx}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.name} allowFontScaling={false}>{safeString(item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim(), 'Lead')}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText} allowFontScaling={false}>{safeString(item.status, 'New')}</Text>
            </View>
          </View>
          <Text style={styles.detail} allowFontScaling={false}>🏢 {safeString(item.property || item.propertyName, 'Property TBD')}</Text>
          <Text style={styles.detail} allowFontScaling={false}>📞 {safeString(item.phone, 'Phone Not Provided')}</Text>
          <Text style={styles.detail} allowFontScaling={false}>📅 Move-In Target: {safeString(item.moveIn || item.moveInDate, 'TBD')}</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  badge: { backgroundColor: 'rgba(168, 85, 247, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#c084fc', fontSize: 11, fontWeight: '700' },
  detail: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
});
