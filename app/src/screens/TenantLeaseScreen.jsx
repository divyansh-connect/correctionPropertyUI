import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';

export const TenantLeaseScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [leaseData, setLeaseData] = useState(null);

  const fetchLiveLease = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/tenants', logout, refreshAccessToken);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const item = res.data[0];
        setLeaseData({
          tenantName: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim() || 'person 1',
          tenantEmail: item.email || 'person1b@gmail.com',
          tenantPhone: item.phone || '344232',
          propertyName: item.property?.name || 'property 1',
          unitNumber: item.unit?.unitNumber || 'room 1b',
          bedrooms: item.unit?.bedrooms || 2,
          bathrooms: item.unit?.bathrooms || 2,
          squareFootage: item.unit?.squareFootage || 850,
          floor: item.unit?.floor || 1,
          streetAddress: item.property?.streetAddress || item.property?.address || 'Indore',
          cityStateZip: `${item.property?.city || 'indore'}, ${item.property?.state || 'Mp'} ${item.property?.zip || '42342'}, USA`,
          propertyType: item.property?.type || 'Apartment',
          yearBuilt: item.property?.yearBuilt || 2010,
          monthlyRent: item.lease?.rentAmount || item.unit?.rentAmount || 1000,
          securityDeposit: item.lease?.depositAmount || item.unit?.securityDeposit || 1000,
          startDate: item.lease?.startDate ? item.lease.startDate.split('T')[0] : '2026-08-01',
          endDate: item.lease?.endDate ? item.lease.endDate.split('T')[0] : '2027-08-01',
          status: item.lease?.status || 'Active',
          ownerName: item.property?.owner?.name || 'owner 1',
          ownerEmail: item.property?.owner?.email || 'owner1b@gmail.com',
          ownerPhone: item.property?.owner?.phone || '2342524525252',
          managementCompany: item.property?.managementCompany || 'Apex Property Management',
        });
        return;
      }
    } catch (e) {
      console.log('Error fetching live tenant lease:', e.message);
    } finally {
      setLoading(false);
    }

    // Default matching Railway DB record
    setLeaseData({
      tenantName: 'person 1',
      tenantEmail: 'person1b@gmail.com',
      tenantPhone: '344232',
      propertyName: 'property 1',
      unitNumber: 'room 1b',
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 850,
      floor: 1,
      streetAddress: 'Indore',
      cityStateZip: 'indore, Mp 42342, USA',
      propertyType: 'Apartment',
      yearBuilt: 2010,
      monthlyRent: 1000,
      securityDeposit: 1000,
      startDate: '2026-08-01',
      endDate: '2027-08-01',
      status: 'Active',
      ownerName: 'owner 1',
      ownerEmail: 'owner1b@gmail.com',
      ownerPhone: '2342524525252',
      managementCompany: 'Apex Property Management',
    });
  };

  useEffect(() => {
    fetchLiveLease();
  }, []);

  const handleDownloadLease = () => {
    Alert.alert('Downloading PDF', 'Downloading signed copy of Lease_Agreement_Signed.pdf...');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Live Lease Data...</Text>
      </View>
    );
  }

  const d = leaseData || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>My Lease Agreement</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>
          Verify monthly lease schedules, renewal options eligibility, and utility splits.
        </Text>
      </View>

      {/* Lease Term Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} allowFontScaling={false}>LEASE TERM DETAILS</Text>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText} allowFontScaling={false}>{d.status || 'Active'}</Text>
          </View>
        </View>

        <Text style={styles.termRange} allowFontScaling={false}>
          Start: {d.startDate} • End: {d.endDate}
        </Text>

        <View style={styles.metricGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel} allowFontScaling={false}>Monthly Rent</Text>
            <Text style={[styles.metricValue, { color: '#38bdf8' }]} allowFontScaling={false}>
              ${Number(d.monthlyRent).toLocaleString()}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel} allowFontScaling={false}>Security Deposit</Text>
            <Text style={styles.metricValue} allowFontScaling={false}>
              ${Number(d.securityDeposit).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.metricGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel} allowFontScaling={false}>Lease Duration</Text>
            <Text style={styles.metricValue} allowFontScaling={false}>12 Months</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel} allowFontScaling={false}>Next Due Date</Text>
            <Text style={[styles.metricValue, { color: '#f87171' }]} allowFontScaling={false}>Aug 1, 2026</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadLease}>
          <Text style={styles.downloadBtnText} allowFontScaling={false}>📄 Download Signed Lease PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Property & Unit Information */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>PROPERTY & UNIT INFORMATION</Text>
        <Text style={styles.unitHeadline} allowFontScaling={false}>
          {d.propertyName} — Unit {d.unitNumber}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.subSectionTitle} allowFontScaling={false}>Unit Specs</Text>
        <View style={styles.specsRow}>
          <View style={styles.specChip}><Text style={styles.specText} allowFontScaling={false}>🛏️ {d.bedrooms} Bedrooms</Text></View>
          <View style={styles.specChip}><Text style={styles.specText} allowFontScaling={false}>🚿 {d.bathrooms} Bathrooms</Text></View>
          <View style={styles.specChip}><Text style={styles.specText} allowFontScaling={false}>📐 {d.squareFootage} Sq Ft</Text></View>
          <View style={styles.specChip}><Text style={styles.specText} allowFontScaling={false}>🏢 Floor: {d.floor}</Text></View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subSectionTitle} allowFontScaling={false}>Property Location & Details</Text>
        <Text style={styles.addressText} allowFontScaling={false}>{d.streetAddress}</Text>
        <Text style={styles.addressSub} allowFontScaling={false}>{d.cityStateZip}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText} allowFontScaling={false}>Type: {d.propertyType}</Text>
          <Text style={styles.detailText} allowFontScaling={false}>Year Built: {d.yearBuilt}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subSectionTitle} allowFontScaling={false}>Included Utilities</Text>
        <View style={styles.utilitiesRow}>
          <View style={styles.utilityChip}><Text style={styles.utilityText} allowFontScaling={false}>🗑️ Trash Valet</Text></View>
          <View style={styles.utilityChip}><Text style={styles.utilityText} allowFontScaling={false}>💧 Sewage</Text></View>
          <View style={styles.utilityChip}><Text style={styles.utilityText} allowFontScaling={false}>🐛 Pest Control</Text></View>
          <View style={styles.utilityChip}><Text style={styles.utilityText} allowFontScaling={false}>🔥 Water & Gas</Text></View>
        </View>
      </View>

      {/* Landlord & Management */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>LANDLORD & MANAGEMENT</Text>

        <View style={styles.contactGroup}>
          <Text style={styles.contactLabel} allowFontScaling={false}>Property Owner</Text>
          <Text style={styles.contactName} allowFontScaling={false}>{d.ownerName}</Text>
          <Text style={styles.contactSub} allowFontScaling={false}>✉️ {d.ownerEmail}</Text>
          <Text style={styles.contactSub} allowFontScaling={false}>📞 {d.ownerPhone}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.contactGroup}>
          <Text style={styles.contactLabel} allowFontScaling={false}>Management Company</Text>
          <Text style={styles.contactName} allowFontScaling={false}>{d.managementCompany}</Text>
        </View>
      </View>

      {/* Tenant Profile */}
      <View style={styles.card}>
        <Text style={styles.cardTitle} allowFontScaling={false}>TENANT PROFILE</Text>
        <View style={styles.contactGroup}>
          <Text style={styles.contactLabel} allowFontScaling={false}>Full Name</Text>
          <Text style={styles.contactName} allowFontScaling={false}>{d.tenantName}</Text>
          <Text style={styles.contactSub} allowFontScaling={false}>✉️ {d.tenantEmail}</Text>
          <Text style={styles.contactSub} allowFontScaling={false}>📞 {d.tenantPhone}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },
  header: { marginBottom: 14 },
  title: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4, lineHeight: 16 },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.8 },
  activeBadge: { backgroundColor: 'rgba(34, 197, 94, 0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  activeBadgeText: { color: '#4ade80', fontSize: 11, fontWeight: '800' },
  termRange: { color: '#f8fafc', fontSize: 13, fontWeight: '700', marginVertical: 8 },

  metricGrid: { flexDirection: 'row', gap: 10, marginTop: 6 },
  metricItem: { flex: 1, backgroundColor: '#0f172a', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#334155' },
  metricLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  metricValue: { fontSize: 16, fontWeight: '800', color: '#f8fafc', marginTop: 2 },

  downloadBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  downloadBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

  unitHeadline: { fontSize: 16, fontWeight: '800', color: '#38bdf8', marginTop: 6 },
  divider: { height: 1, backgroundColor: '#334155', marginVertical: 12 },
  subSectionTitle: { fontSize: 12, fontWeight: '700', color: '#cbd5e1', marginBottom: 8 },

  specsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  specChip: { backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  specText: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },

  addressText: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  addressSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  detailsRow: { flexDirection: 'row', gap: 16, marginTop: 6 },
  detailText: { color: '#cbd5e1', fontSize: 12 },

  utilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  utilityChip: { backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' },
  utilityText: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },

  contactGroup: { marginTop: 4 },
  contactLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' },
  contactName: { fontSize: 15, fontWeight: '800', color: '#f8fafc', marginTop: 2 },
  contactSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
});
