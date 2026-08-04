import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

export const TenantNotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Package Arrived at Front Desk',
      description: 'A parcel from Amazon Logistics is waiting at reception.',
      time: '06:41 AM',
      tag: 'warning',
      read: false,
    },
    {
      id: '2',
      title: 'Maintenance Request Scheduled',
      description: 'Work order #WO-1042 for HVAC repair is assigned for Thursday at 10 AM',
      time: '06:41 AM',
      tag: 'success',
      read: false,
    },
    {
      id: '3',
      title: 'Monthly Rent Statement Ready',
      description: 'Your monthly rent invoice for August 2026 is available for download.',
      time: '06:41 AM',
      tag: 'info',
      read: false,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    Alert.alert('Success', 'All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.breadcrumb} allowFontScaling={false}>Home › Tenant Notifications Center</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title} allowFontScaling={false}>Tenant Notifications Center</Text>
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markAllBtnText} allowFontScaling={false}>✓ Mark All as Read</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle} allowFontScaling={false}>
          Verify recent updates regarding your lease, payments, maintenance orders, and announcements.
        </Text>
      </View>

      {/* Section Subheader */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          RECENT ACTIVITY ({notifications.length})
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearAllText} allowFontScaling={false}>🗑️ Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText} allowFontScaling={false}>No recent notifications found.</Text>
        </View>
      ) : (
        notifications.map((item) => {
          let tagBg = 'rgba(234, 179, 8, 0.2)';
          let tagColor = '#facc15';

          if (item.tag === 'success') {
            tagBg = 'rgba(34, 197, 94, 0.2)';
            tagColor = '#4ade80';
          } else if (item.tag === 'info') {
            tagBg = 'rgba(56, 189, 248, 0.2)';
            tagColor = '#38bdf8';
          }

          return (
            <View key={item.id} style={[styles.card, item.read && styles.cardRead]}>
              <View style={styles.cardMain}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle} allowFontScaling={false}>
                    {item.title} {!item.read && <Text style={styles.dot}>•</Text>}
                  </Text>
                </View>
                <Text style={styles.cardDesc} allowFontScaling={false}>{item.description}</Text>
                <Text style={styles.cardTime} allowFontScaling={false}>{item.time}</Text>
              </View>

              <View style={styles.cardRight}>
                <View style={[styles.tagBadge, { backgroundColor: tagBg }]}>
                  <Text style={[styles.tagText, { color: tagColor }]} allowFontScaling={false}>
                    {item.tag}
                  </Text>
                </View>

                <TouchableOpacity style={styles.readActionBtn} onPress={() => toggleRead(item.id)}>
                  <Text style={styles.readActionText} allowFontScaling={false}>
                    {item.read ? 'Unread' : 'Mark read'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  contentContainer: { padding: 16, paddingBottom: 60 },

  header: { marginBottom: 16 },
  breadcrumb: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '800', color: '#f8fafc', flex: 1 },
  subtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 4, lineHeight: 16 },

  markAllBtn: { backgroundColor: '#0284c7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  markAllBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#f8fafc', letterSpacing: 0.5 },
  clearAllText: { color: '#f87171', fontSize: 12, fontWeight: '700' },

  emptyCard: { backgroundColor: '#1e293b', padding: 24, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  emptyText: { color: '#94a3b8', fontSize: 13 },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRead: { opacity: 0.65 },
  cardMain: { flex: 1, paddingRight: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#f8fafc' },
  dot: { color: '#38bdf8', fontSize: 16 },
  cardDesc: { fontSize: 12, color: '#cbd5e1', marginTop: 4, lineHeight: 17 },
  cardTime: { fontSize: 10.5, color: '#94a3b8', marginTop: 6 },

  cardRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 10.5, fontWeight: '700', textTransform: 'lowercase' },

  readActionBtn: { marginTop: 10 },
  readActionText: { color: '#38bdf8', fontSize: 11, fontWeight: '700' },
});
