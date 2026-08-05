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
import { useThemeColors } from '../theme';

export const NavigationDrawer = ({ visible, onClose, activeScreen, onSelectScreen }) => {
  const { user, logout } = useAuthStore();
  const { colors, isDarkMode } = useThemeColors();
  const styles = getStyles(colors, isDarkMode);

  const roleLower = String(user?.role || '').toLowerCase();
  const isSuperAdmin = roleLower.includes('super');
  const isCollectionManager = roleLower.includes('collection');
  const isOwner = roleLower.includes('owner');
  const isManager = roleLower.includes('manager') || isSuperAdmin;

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
  } else if (isCollectionManager) {
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'invoices', label: '📄 Tenant Invoices' },
      { id: 'rent', label: '💳 Payment History' },
      { id: 'financials', label: '📖 Tenant Ledger' },
    ];
  } else if (isManager) {
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
    ];
  } else if (isOwner) {
    // ALL 9 Web Owner Portal Menus strictly matching Web Screenshot
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'properties', label: '🏢 Properties' },
      { id: 'financials', label: '💳 Financials' },
      { id: 'statements', label: '📖 Statements' },
      { id: 'distributions', label: '⚙️ Distributions' },
      { id: 'maintenance', label: '🛠️ Maintenance' },
      { id: 'documents', label: '📄 Documents' },
      { id: 'reports', label: '📊 Reports' },
      { id: 'communication', label: '💬 Messages' },
    ];
  } else {
    // Tenant Portal Menus (Notifications & Profile accessed via Header Icons)
    menuItems = [
      { id: 'dashboard', label: '📊 Dashboard' },
      { id: 'lease', label: '📖 Lease' },
      { id: 'rent', label: '💳 Payments' },
      { id: 'maintenance', label: '🛠️ Maintenance' },
      { id: 'documents', label: '📄 Documents' },
      { id: 'communication', label: '👤 Messages' },
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

            {/* Scrollable Navigation Menu */}
            <ScrollView
              style={styles.menuList}
              contentContainerStyle={styles.menuContentContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.sectionHeader} allowFontScaling={false}>
                {user?.role === 'Owner' ? 'OWNER PORTAL MENU' : user?.role === 'Tenant' ? 'TENANT PORTAL MENU' : 'NAVIGATION MENU'}
              </Text>

              {menuItems.map((item, index) => {
                const isActive = activeScreen === item.id;
                return (
                  <TouchableOpacity
                    key={`${item.id}-${index}`}
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

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 310,
    backgroundColor: colors.surface,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: isDarkMode ? 0.5 : 0.08,
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
    color: colors.textPrimary,
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
    backgroundColor: colors.divider,
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
    color: colors.textMuted,
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
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  menuItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38bdf8',
  },
  menuItemText: {
    color: colors.textSecondary,
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
