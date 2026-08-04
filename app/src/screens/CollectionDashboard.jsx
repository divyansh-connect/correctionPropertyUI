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

export const CollectionDashboard = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const overdueTenants = [
    { id: '1', name: 'Robert Johnson', unit: 'Unit 205', balance: '$1,450', daysOverdue: '12 Days' },
    { id: '2', name: 'Emily Davis', unit: 'Unit 104', balance: '$850', daysOverdue: '8 Days' },
    { id: '3', name: 'Michael Chang', unit: 'Unit 310', balance: '$1,800', daysOverdue: '5 Days' },
  ];

  const recentTransactions = [
    { id: 't-1', date: 'Jul 23, 2026', type: 'Rent Payment', party: 'Robert Johnson', amount: '+$1,200', status: 'Completed' },
    { id: 't-2', date: 'Jul 23, 2026', type: 'Owner Payout', party: 'Lakeside Dev', amount: '-$4,500', status: 'Completed' },
    { id: 't-3', date: 'Jul 22, 2026', type: 'Vendor Bill', party: 'Rapid Plumbing', amount: '-$350', status: 'Completed' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} tintColor="#38bdf8" />}
    >
      <View style={styles.header}>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText} allowFontScaling={false}>📊 Collection Manager</Text>
        </View>
        <Text style={styles.title} allowFontScaling={false}>Rent & Collection Dashboard</Text>
        <Text style={styles.subtitle} allowFontScaling={false}>Overview of gross inflows, overdue rent & payouts</Text>
      </View>

      {/* 4 Financial Metric Cards */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>TENANT COLLECTIONS</Text>
          <Text style={[styles.kpiVal, { color: '#4ade80' }]} allowFontScaling={false}>$42,500</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>+12.4% Gross Inflow</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>TENANT OVERDUE</Text>
          <Text style={[styles.kpiVal, { color: '#f87171' }]} allowFontScaling={false}>$3,800</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Pending Balances</Text>
        </View>
      </View>

      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>OWNER PAYOUTS</Text>
          <Text style={[styles.kpiVal, { color: '#818cf8' }]} allowFontScaling={false}>$30,600</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Distributions Sent</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel} allowFontScaling={false}>MAINTENANCE EXPENSES</Text>
          <Text style={[styles.kpiVal, { color: '#facc15' }]} allowFontScaling={false}>$4,200</Text>
          <Text style={styles.kpiSub} allowFontScaling={false}>Vendor Invoices Paid</Text>
        </View>
      </View>

      {/* Overdue Accounts List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>⚠️ Overdue Tenant Accounts</Text>
      </View>

      {overdueTenants.map((t) => (
        <View key={t.id} style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName} allowFontScaling={false}>{t.name} ({t.unit})</Text>
            <Text style={styles.itemSub} allowFontScaling={false}>Overdue by {t.daysOverdue}</Text>
          </View>
          <Text style={styles.overdueBalance} allowFontScaling={false}>{t.balance}</Text>
        </View>
      ))}

      {/* Recent Transactions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>💳 Recent Ledger Transactions</Text>
      </View>

      {recentTransactions.map((t) => (
        <View key={t.id} style={styles.itemCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName} allowFontScaling={false}>{t.party}</Text>
            <Text style={styles.itemSub} allowFontScaling={false}>{t.type} • {t.date}</Text>
          </View>
          <Text style={[styles.amountText, t.amount.startsWith('+') ? styles.inflow : styles.outflow]} allowFontScaling={false}>
            {t.amount}
          </Text>
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
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  roleBadgeText: { color: '#facc15', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  kpiGrid: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  kpiLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', letterSpacing: 0.5 },
  kpiVal: { fontSize: 20, fontWeight: '800', color: '#f8fafc', marginVertical: 4 },
  kpiSub: { fontSize: 10.5, color: '#94a3b8' },
  sectionHeader: { marginTop: 14, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemName: { color: '#f8fafc', fontSize: 13, fontWeight: '600' },
  itemSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  overdueBalance: { color: '#f87171', fontSize: 14, fontWeight: '800' },
  amountText: { fontSize: 14, fontWeight: '800' },
  inflow: { color: '#4ade80' },
  outflow: { color: '#f87171' },
});
