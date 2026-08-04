import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useAuthStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export const TenantServicesScreen = ({ onNavigate }) => {
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: 'maintenance',
      label: 'Repairs & Maintenance',
      subtitle: 'Track and file maintenance tickets',
      icon: 'hammer-outline',
      color: '#f59e0b',
    },
    {
      id: 'documents',
      label: 'Documents',
      subtitle: 'Leases, receipts, and community files',
      icon: 'document-text-outline',
      color: '#38bdf8',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      subtitle: 'View recent updates and announcements',
      icon: 'notifications-outline',
      color: '#10b981',
    },
    {
      id: 'profile',
      label: 'Profile Settings',
      subtitle: 'Manage your contact details and account',
      icon: 'person-outline',
      color: '#ec4899',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* User profile header card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText} allowFontScaling={false}>
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'P'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} allowFontScaling={false}>
            {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'person 1'}
          </Text>
          <Text style={styles.profileRole} allowFontScaling={false}>
            Tenant · Active Resident
          </Text>
        </View>
      </View>

      <Text style={styles.sectionHeader} allowFontScaling={false}>SERVICES MENU</Text>

      {/* Menu Options */}
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={() => onNavigate(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
            <Ionicons name={item.icon} size={20} color={item.color} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuLabel} allowFontScaling={false}>{item.label}</Text>
            <Text style={styles.menuSubtitle} allowFontScaling={false}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color="#475569" />
        </TouchableOpacity>
      ))}

      {/* Log Out Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => onNavigate('logout')}
        activeOpacity={0.7}
      >
        <View style={styles.logoutIconContainer}>
          <Ionicons name="log-out-outline" size={20} color="#f87171" />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.logoutLabel} allowFontScaling={false}>Log Out</Text>
          <Text style={styles.menuSubtitle} allowFontScaling={false}>Sign out of your account</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={16} color="#475569" />
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { padding: 16, paddingBottom: 60 },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  profileRole: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  sectionHeader: { fontSize: 10, fontWeight: '800', color: '#64748b', marginBottom: 10, letterSpacing: 1 },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '800', color: '#f8fafc' },
  menuSubtitle: { fontSize: 11.5, color: '#94a3b8', marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutLabel: { fontSize: 14, fontWeight: '800', color: '#f87171' },
});
