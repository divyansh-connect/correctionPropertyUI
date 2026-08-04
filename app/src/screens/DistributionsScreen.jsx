import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';

// Animated Touchable Component
const AnimatedTouchable = ({ children, onPress, style, disabled }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const DistributionsScreen = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const runEntryAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Strictly call live Railway endpoint: GET /portal/owner/distributions
  const fetchLiveDistributions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/portal/owner/distributions', logout, refreshAccessToken);
      const rawList = Array.isArray(res) ? res : (res?.data || []);
      setDistributions(rawList);
    } catch (e) {
      console.log('Error fetching GET /portal/owner/distributions:', e.message);
      setDistributions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  useEffect(() => {
    fetchLiveDistributions();
  }, []);

  const filteredDistributions = distributions.filter((item) => {
    const text = `${item.distributionNo || ''} ${item.propertyManaged || ''} ${item.status || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Loading Payout Distributions Log...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.mainWrapper}
      contentContainerStyle={styles.outerContentContainer}
      showsVerticalScrollIndicator={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLiveDistributions} tintColor="#38bdf8" />}
    >
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* Header matching Web Screenshot 1-to-1 */}
        <View style={styles.header}>
          <Text style={styles.breadcrumb} allowFontScaling={false}>Home › Distributions</Text>
          <Text style={styles.title} allowFontScaling={false}>Payout Distributions Log</Text>
          <Text style={styles.subtitle} allowFontScaling={false}>
            Verify direct deposits ACH/Wires cleared to checking accounts.
          </Text>
        </View>

        {/* Search Bar matching Web Screenshot */}
        <View style={styles.searchBarRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search distributions by number or asset..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <AnimatedTouchable style={styles.resetBtn} onPress={() => setSearchQuery('')}>
              <Text style={styles.resetBtnText} allowFontScaling={false}>🔄 Reset</Text>
            </AnimatedTouchable>
          ) : null}
        </View>

        {/* List or Empty State matching Web Screenshot 1-to-1 */}
        {filteredDistributions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText} allowFontScaling={false}>No se encontraron resultados.</Text>
            <Text style={styles.emptySubText} allowFontScaling={false}>
              No payout distribution logs recorded in database.
            </Text>
          </View>
        ) : (
          filteredDistributions.map((item, idx) => (
            <AnimatedTouchable key={item.id || `dist-${idx}`} style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.distNoText} allowFontScaling={false}>
                    ⚙️ DIST-{item.distributionNo || item.id?.slice(0, 8)}
                  </Text>
                  <Text style={styles.propText} allowFontScaling={false}>
                    Property: {item.propertyManaged || 'property 1'} | Date: {item.paymentDate || '2026-08-01'}
                  </Text>
                </View>

                <View style={styles.rightGroup}>
                  <Text style={styles.amountText} allowFontScaling={false}>
                    ${(Number(item.amountPaid) || 0).toLocaleString()}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText} allowFontScaling={false}>
                      {item.status || 'Cleared'}
                    </Text>
                  </View>
                </View>
              </View>
            </AnimatedTouchable>
          ))
        )}
      </Animated.View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0f172a' },
  outerContentContainer: { padding: 16, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },

  header: { marginBottom: 14 },
  breadcrumb: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  subtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 16 },

  searchBarRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  searchInput: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f8fafc',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resetBtn: { backgroundColor: '#334155', paddingHorizontal: 10, justifyContent: 'center', borderRadius: 8 },
  resetBtnText: { color: '#cbd5e1', fontSize: 11, fontWeight: '700' },

  emptyCard: { backgroundColor: '#1e293b', padding: 28, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginTop: 10 },
  emptyText: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  emptySubText: { color: '#94a3b8', fontSize: 12, marginTop: 4, textAlign: 'center' },

  card: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  distNoText: { fontSize: 14.5, fontWeight: '800', color: '#f8fafc' },
  propText: { fontSize: 11, color: '#94a3b8', marginTop: 3 },
  rightGroup: { alignItems: 'flex-end', gap: 3 },
  amountText: { fontSize: 15, fontWeight: '800', color: '#10b981' },
  statusBadge: { backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusBadgeText: { color: '#38bdf8', fontSize: 10, fontWeight: '800' },
});
