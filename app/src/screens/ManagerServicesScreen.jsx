import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuthStore } from '../store/useStore';
import { Ionicons } from '@expo/vector-icons';

export const ManagerServicesScreen = ({ onNavigate }) => {
  const { user } = useAuthStore();

  const menuItems = [
    {
      id: 'documents',
      label: 'Documents & Files',
      subtitle: 'Manage lease agreements and portfolios files',
      icon: 'folder-open-outline',
      color: '#38bdf8',
    },
    {
      id: 'leads',
      label: 'Leasing',
      subtitle: 'Manage tenant applications, background checks & leads',
      icon: 'key-outline',
      color: '#f43f5e',
    },
    {
      id: 'accounting',
      label: 'Accounting & Ledgers',
      subtitle: 'General double-entry bookkeeping journal entries',
      icon: 'journal-outline',
      color: '#a855f7',
    },
    {
      id: 'maintenance',
      label: 'Repairs & Maintenance',
      subtitle: 'Verify service requests and dispatch work orders',
      icon: 'hammer-outline',
      color: '#f59e0b',
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      subtitle: 'Track property metrics and cash flow analytics',
      icon: 'analytics-outline',
      color: '#ec4899',
    },
    {
      id: 'communication',
      label: 'Communication',
      subtitle: 'Broadcasting messages, alerts & tenant chat logs',
      icon: 'chatbubbles-outline',
      color: '#06b6d4',
    },
    {
      id: 'profile',
      label: 'Company Settings',
      subtitle: 'Configure default branding logo assets, regional date format templates, timezone offsets, and currency types.',
      icon: 'settings-outline',
      color: '#64748b',
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText} allowFontScaling={false}>
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'P'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} allowFontScaling={false}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Property Manager'}
            </Text>
            <Text style={styles.profileRole} allowFontScaling={false}>
              Property Manager · Zentrol Staff
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
      </ScrollView>

      {/* Log Out Button docked at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => onNavigate('logout')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText} allowFontScaling={false}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0f172a' },
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 20 },

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

  bottomButtonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  logoutBtn: { 
    backgroundColor: '#ef4444', 
    borderRadius: 12, 
    paddingVertical: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  logoutBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
