import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../store/useStore';

export const NavigationDrawer = ({ visible, onClose, activeScreen, onSelectScreen }) => {
  const { user, logout } = useAuthStore();

  const isSuperAdmin = user?.role === 'Super Admin';
  const isManager = user?.role === 'Property Manager' || isSuperAdmin;
  const isOwner = user?.role === 'Owner';

  let menuItems = [];

  if (isSuperAdmin) {
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'companies', label: '🏢 Companies' },
      { id: 'subscriptions', label: '📅 Subscriptions' },
      { id: 'platform-users', label: '👥 Platform Users' },
      { id: 'properties', label: '🏠 Properties' },
      { id: 'maintenance', label: '🛠️ Maintenance' },
    ];
  } else if (isManager) {
    // 13 Web Property Manager Menus A-Z
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'properties', label: '🏢 Properties' },
      { id: 'leads', label: '🔑 Leasing' },
      { id: 'tenants', label: '👥 Tenants' },
      { id: 'documents', label: '📂 Documents' },
      { id: 'owners', label: '👔 Owners' },
      { id: 'rent', label: '💳 Rent & Payments' },
      { id: 'accounting', label: '📚 Accounting' },
      { id: 'maintenance', label: '🛠️ Maintenance' },
      { id: 'reports', label: '📊 Reports' },
      { id: 'communication', label: '💬 Communication' },
      { id: 'ai', label: '🤖 AI Assistant' },
      { id: 'profile', label: '⚙️ Company Settings' },
    ];
  } else if (isOwner) {
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'properties', label: '🏢 My Properties' },
      { id: 'tenants', label: '👥 Tenants' },
      { id: 'rent', label: '💰 Financials' },
      { id: 'profile', label: '⚙️ Settings' },
    ];
  } else {
    // Tenant
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'lease', label: '📖 Lease' },
      { id: 'rent', label: '💳 Payments' },
      { id: 'maintenance', label: '🛠️ Maintenance' },
      { id: 'profile', label: '⚙️ Settings' },
    ];
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.drawerContainer}>
          <SafeAreaView style={styles.safeArea}>
            {/* User Profile Header */}
            <View style={styles.userHeader}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText} allowFontScaling={false}>
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1} allowFontScaling={false}>
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email || 'User'}
                </Text>
                <Text style={styles.userRole} allowFontScaling={false}>
                  {user?.role || 'Member'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Scrollable Navigation Menu (With smooth bottom padding clearance) */}
            <ScrollView
              style={styles.menuList}
              contentContainerStyle={styles.menuContentContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.sectionHeader} allowFontScaling={false}>NAVIGATION MENU (13 ITEMS)</Text>

              {menuItems.map((item) => {
                const isActive = activeScreen === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                    onPress={() => {
                      onSelectScreen(item.id);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]} allowFontScaling={false}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={{ height: 20 }} />

              <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText} allowFontScaling={false}>🚪 Log Out</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 310,
    backgroundColor: '#1e293b',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  userRole: {
    color: '#38bdf8',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 4,
  },
  menuList: {
    flex: 1,
  },
  menuContentContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 60,
  },
  sectionHeader: {
    color: '#64748b',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 8,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
  },
  menuItemText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemTextActive: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '700',
  },
});
