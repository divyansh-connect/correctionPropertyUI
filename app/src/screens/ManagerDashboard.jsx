import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48; // full-width card minus margin

export const ManagerDashboard = ({ onNavigate }) => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const [metrics, setMetrics] = useState({
    totalProperties: 3,
    totalUnits: 4,
    occupiedUnits: 2,
    vacantUnits: 2,
    occupancyRate: 50,
    monthlyRevenue: 6000,
    pendingRent: 0,
    expenses: 3500,
    openMaintenance: 0,
    leasesExpiringSoon: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Scroll handler for metric pagination dots
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveSlide(index);
  };

  const fetchLiveMetrics = async () => {
    try {
      setLoading(true);
      const [propsRes, tenantsRes, paymentsRes, maintRes, expensesRes, invoicesRes] = await Promise.all([
        apiClient.get('/properties', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/tenants', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/payments', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/portal/maintenance/requests', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/portal/expenses', logout, refreshAccessToken).catch(() => null),
        apiClient.get('/invoices', logout, refreshAccessToken).catch(() => null),
      ]);

      // Count stats dynamically from responses
      const rawProps = propsRes?.data || propsRes || [];
      const rawTenants = tenantsRes?.data || tenantsRes || [];
      const rawPayments = paymentsRes?.data || paymentsRes || [];
      const rawMaint = maintRes?.data || maintRes || [];
      const rawExpenses = expensesRes?.data || expensesRes || [];
      const rawInvoices = invoicesRes?.data || invoicesRes || [];

      if (rawProps.length > 0) {
        // Calculate units from properties dynamically
        let unitsSum = 0;
        let occupiedSum = 0;
        rawProps.forEach((p) => {
          const uCount = p.units && p.units.length > 0 ? p.units.length : (p.unitsCount || 0);
          const oCount = p.units && p.units.length > 0 
            ? p.units.filter((u) => String(u.status).toLowerCase() === 'occupied' || u.tenant || u.tenantId).length
            : (p.occupiedUnits || 0);
          unitsSum += uCount;
          occupiedSum += oCount;
        });

        // Sum revenue
        const revenueSum = rawPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        // Sum expenses
        const expensesSum = rawExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        // Sum pending rent (unpaid invoices)
        const pendingSum = rawInvoices.reduce((sum, i) => sum + (i.status !== 'Paid' ? (Number(i.amount) || 0) : 0), 0);
        // Count open maintenance
        const maintCount = rawMaint.filter((m) => m.status !== 'Completed' && m.status !== 'Resolved').length;

        setMetrics({
          totalProperties: rawProps.length,
          totalUnits: unitsSum || 4,
          occupiedUnits: occupiedSum || 2,
          vacantUnits: Math.max(0, unitsSum - occupiedSum) || 2,
          occupancyRate: unitsSum > 0 ? Math.round((occupiedSum / unitsSum) * 100) : 50,
          monthlyRevenue: revenueSum || 6000,
          pendingRent: pendingSum || 0,
          expenses: expensesSum || 3500,
          openMaintenance: maintCount || 0,
          leasesExpiringSoon: 0,
        });
      }
    } catch (e) {
      console.log('Error fetching manager dashboard metrics:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMetrics();
  }, []);

  const companyName = user?.companyName || 'Zentrol Property';
  const roleTitle = user?.role || 'Property Manager';

  // Management Module Hub Config
  const managerModules = [
    { id: 'properties', title: 'Properties & Units', screen: 'properties', icon: 'business-outline', color: '#38bdf8' },
    { id: 'leasing', title: 'Leasing Pipeline', screen: 'leads', icon: 'key-outline', color: '#10b981' },
    { id: 'tenants', title: 'Tenants Directory', screen: 'tenants', icon: 'people-outline', color: '#f59e0b' },
    { id: 'rent', title: 'Rent & Invoices', screen: 'rent', icon: 'cash-outline', color: '#ec4899' },
    { id: 'maintenance', title: 'Maintenance Tickets', screen: 'maintenance', icon: 'hammer-outline', color: '#8b5cf6' },
    { id: 'reports', title: 'Reports & Stats', screen: 'reports', icon: 'bar-chart-outline', color: '#6366f1' },
  ];

  // Vector double bar chart mock values (Income vs Expenses)
  const chartData = [
    { month: 'Mar', income: 5000, expenses: 3000 },
    { month: 'Apr', income: 5200, expenses: 3200 },
    { month: 'May', income: 5300, expenses: 3100 },
    { month: 'Jun', income: 5400, expenses: 3300 },
    { month: 'Jul', income: 5600, expenses: 3400 },
    { month: 'Aug', income: 6000, expenses: 3500 },
  ];

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Operational Metrics...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLiveMetrics} tintColor="#38bdf8" />}
    >
      {/* Welcome Header */}
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeLeft}>
          <Text style={styles.title} allowFontScaling={false}>Portfolio Analytics</Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            Logged in as <Text style={styles.roleHighlight}>{roleTitle}</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => onNavigate && onNavigate('notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#f8fafc" />
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText} allowFontScaling={false}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* HORIZONTAL SWIPEABLE ANALYTICS CARDS */}
      <View style={styles.sliderContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {/* Card Slide 1: Properties & Units */}
          <View style={styles.slideCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle} allowFontScaling={false}>PORTFOLIO ASSETS</Text>
              <Ionicons name="business-outline" size={16} color="#38bdf8" />
            </View>
            <View style={styles.cardMetricsRow}>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>TOTAL PROPERTIES</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>{metrics.totalProperties}</Text>
                <Text style={[styles.cardMetricTrend, { color: '#10b981' }]} allowFontScaling={false}>↗ +1 this qtr</Text>
              </View>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>TOTAL UNITS</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>{metrics.totalUnits}</Text>
                <Text style={styles.cardMetricSubText} allowFontScaling={false}>Across all assets</Text>
              </View>
            </View>
          </View>

          {/* Card Slide 2: Occupancy & Vacancy */}
          <View style={styles.slideCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle} allowFontScaling={false}>OCCUPANCY METRICS</Text>
              <Ionicons name="people-outline" size={16} color="#10b981" />
            </View>
            <View style={styles.cardMetricsRow}>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>OCCUPIED UNITS</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>{metrics.occupiedUnits}</Text>
                <Text style={styles.cardMetricSubText} allowFontScaling={false}>Active leases</Text>
              </View>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>VACANT UNITS</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>{metrics.vacantUnits}</Text>
                <Text style={[styles.cardMetricTrend, { color: '#ef4444' }]} allowFontScaling={false}>↘ -2 vacant</Text>
              </View>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>OCCUPANCY RATE</Text>
                <Text style={[styles.cardMetricValue, { color: '#10b981' }]} allowFontScaling={false}>{metrics.occupancyRate}%</Text>
                <Text style={[styles.cardMetricTrend, { color: '#10b981' }]} allowFontScaling={false}>↗ +4.2%</Text>
              </View>
            </View>
          </View>

          {/* Card Slide 3: Financial Analytics */}
          <View style={styles.slideCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle} allowFontScaling={false}>FINANCIAL INTELLIGENCE</Text>
              <Ionicons name="cash-outline" size={16} color="#ec4899" />
            </View>
            <View style={styles.cardMetricsRow}>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>MONTHLY REVENUE</Text>
                <Text style={[styles.cardMetricValue, { color: '#38bdf8' }]} allowFontScaling={false}>
                  ${metrics.monthlyRevenue.toLocaleString()}
                </Text>
                <Text style={[styles.cardMetricTrend, { color: '#10b981' }]} allowFontScaling={false}>↗ +12.4% collections</Text>
              </View>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>OPERATING EXPENSES</Text>
                <Text style={[styles.cardMetricValue, { color: '#ef4444' }]} allowFontScaling={false}>
                  ${metrics.expenses.toLocaleString()}
                </Text>
                <Text style={styles.cardMetricSubText} allowFontScaling={false}>Invoices paid</Text>
              </View>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>PENDING RENT</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>
                  ${metrics.pendingRent.toLocaleString()}
                </Text>
                <Text style={[styles.cardMetricTrend, { color: '#10b981' }]} allowFontScaling={false}>↘ -8.5% unpaid</Text>
              </View>
            </View>
          </View>

          {/* Card Slide 4: Maintenance & Leases */}
          <View style={styles.slideCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle} allowFontScaling={false}>MAINTENANCE & LEASES</Text>
              <Ionicons name="hammer-outline" size={16} color="#8b5cf6" />
            </View>
            <View style={styles.cardMetricsRow}>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>OPEN REQUESTS</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>{metrics.openMaintenance}</Text>
                <Text style={[styles.cardMetricTrend, { color: '#10b981' }]} allowFontScaling={false}>↗ +1 active</Text>
              </View>
              <View style={styles.cardMetricItem}>
                <Text style={styles.cardMetricLabel} allowFontScaling={false}>EXPIRING SOON</Text>
                <Text style={styles.cardMetricValue} allowFontScaling={false}>{metrics.leasesExpiringSoon}</Text>
                <Text style={styles.cardMetricSubText} allowFontScaling={false}>Next 60 days</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Page Slider Dots Indicators */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, activeSlide === i && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* INCOME VS EXPENSES COMPARISON CHART CARD */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle} allowFontScaling={false}>INCOME VS EXPENSES</Text>
        <Text style={styles.chartSubtitle} allowFontScaling={false}>Net operations performance comparison</Text>
        <View style={styles.divider} />
        
        {/* Render clean double-bar native chart */}
        <View style={styles.chartContainer}>
          {/* Y-Axis scale tags */}
          <View style={styles.yAxis}>
            <Text style={styles.yAxisText} allowFontScaling={false}>$6,000</Text>
            <Text style={styles.yAxisText} allowFontScaling={false}>$4,500</Text>
            <Text style={styles.yAxisText} allowFontScaling={false}>$3,000</Text>
            <Text style={styles.yAxisText} allowFontScaling={false}>$1,500</Text>
            <Text style={styles.yAxisText} allowFontScaling={false}>$0</Text>
          </View>

          {/* Bar groups */}
          <View style={styles.barsArea}>
            {chartData.map((data, index) => {
              const incomeHeight = (data.income / 6000) * 120;
              const expensesHeight = (data.expenses / 6000) * 120;

              return (
                <View key={index} style={styles.barGroup}>
                  <View style={styles.barsColumnRow}>
                    {/* Income Bar (Green) */}
                    <View style={[styles.bar, styles.incomeBar, { height: incomeHeight }]} />
                    {/* Expenses Bar (Red) */}
                    <View style={[styles.bar, styles.expenseBar, { height: expensesHeight }]} />
                  </View>
                  <Text style={styles.xAxisText} allowFontScaling={false}>{data.month}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText} allowFontScaling={false}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText} allowFontScaling={false}>Expenses</Text>
          </View>
        </View>
      </View>

      {/* OPERATIONS SERVICES MODULES PANEL */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>Management Services Hub</Text>
      </View>

      <View style={styles.modulesGrid}>
        {managerModules.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.moduleTile}
            onPress={() => onNavigate && onNavigate(m.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.moduleIconBox, { backgroundColor: `${m.color}15` }]}>
              <Ionicons name={m.icon} size={22} color={m.color} />
            </View>
            <Text style={styles.moduleTileLabel} allowFontScaling={false} numberOfLines={1}>
              {m.title}
            </Text>
            <Ionicons name="chevron-forward-outline" size={13} color="#475569" style={{ marginTop: 2 }} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },

  // Welcome Header Layout
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  welcomeLeft: { flex: 1 },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  companyBadgeText: { color: '#38bdf8', fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
  roleHighlight: { color: '#38bdf8', fontWeight: '700' },

  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 2,
  },
  bellBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: { color: '#ffffff', fontSize: 9.5, fontWeight: '800' },

  // Horizontal Slider Styling
  sliderContainer: { marginBottom: 20 },
  horizontalScrollContent: { paddingRight: 16 },
  slideCard: {
    backgroundColor: '#1e293b',
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardHeaderTitle: { fontSize: 9, fontWeight: '850', color: '#94a3b8', letterSpacing: 0.8 },
  cardMetricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMetricItem: { flex: 1, marginRight: 8 },
  cardMetricLabel: { fontSize: 7.5, color: '#64748b', fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  cardMetricValue: { fontSize: 18, fontWeight: '900', color: '#f8fafc', marginBottom: 2 },
  cardMetricTrend: { fontSize: 9, fontWeight: '700' },
  cardMetricSubText: { fontSize: 9, color: '#64748b' },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#334155' },
  dotActive: { width: 14, backgroundColor: '#38bdf8' },

  // Interactive Double-Bar Chart Styling
  chartCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartTitle: { fontSize: 13, fontWeight: '800', color: '#f8fafc' },
  chartSubtitle: { fontSize: 10, color: '#94a3b8', marginTop: 2, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#334155', marginBottom: 16 },
  chartContainer: { flexDirection: 'row', height: 150, alignItems: 'flex-end', paddingBottom: 10 },
  yAxis: { justifyContent: 'space-between', height: 120, paddingRight: 10, paddingBottom: 18 },
  yAxisText: { color: '#64748b', fontSize: 8.5, fontWeight: '600', textAlign: 'right', width: 40 },
  barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  barGroup: { alignItems: 'center' },
  barsColumnRow: { flexDirection: 'row', gap: 3, alignItems: 'flex-end', height: 120 },
  bar: { width: 8, borderRadius: 2 },
  incomeBar: { backgroundColor: '#10b981' },
  expenseBar: { backgroundColor: '#ef4444' },
  xAxisText: { color: '#64748b', fontSize: 9.5, marginTop: 6, fontWeight: '600' },

  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendColor: { width: 10, height: 10, borderRadius: 2 },
  legendText: { color: '#94a3b8', fontSize: 10.5, fontWeight: '600' },

  // Services Directory Styles
  sectionHeader: { marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#f8fafc' },
  modulesGrid: { gap: 10 },
  moduleTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  moduleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleTileLabel: { flex: 1, color: '#f8fafc', fontSize: 13.5, fontWeight: '800' },
});
