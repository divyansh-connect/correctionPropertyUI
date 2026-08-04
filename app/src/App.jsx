import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './store/useStore';

import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { NavigationDrawer } from './components/NavigationDrawer';

import { AdminDashboard } from './screens/AdminDashboard';
import { ManagerDashboard } from './screens/ManagerDashboard';
import { CollectionDashboard } from './screens/CollectionDashboard';
import { StaffDashboard } from './screens/StaffDashboard';
import { OwnerDashboard } from './screens/OwnerDashboard';
import { TenantDashboard } from './screens/TenantDashboard';

import { PropertiesScreen } from './screens/PropertiesScreen';
import { LeadsScreen } from './screens/LeadsScreen';
import { TenantsScreen } from './screens/TenantsScreen';
import { RentScreen } from './screens/RentScreen';
import { MaintenanceScreen } from './screens/MaintenanceScreen';
import { CompaniesScreen } from './screens/CompaniesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TenantLeaseScreen } from './screens/TenantLeaseScreen';
import { SubscriptionsScreen } from './screens/SubscriptionsScreen';
import { PlatformUsersScreen } from './screens/PlatformUsersScreen';

export default function App() {
  const { user, isAuthenticated, isLoaded, initializeAuth } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  // Reset active tab to 'dashboard' whenever user logs in or switches user
  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('dashboard');
    }
  }, [user?.email, isAuthenticated]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>Initializing Portal...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen />
      </>
    );
  }

  const role = user?.role || 'Property Manager';

  // Role-Specific Navigation Menu Tabs matching Web App strictly
  let moduleTabs = [];

  switch (role) {
    case 'Super Admin':
      moduleTabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'companies', label: '🏢 Companies', icon: '🏢' },
        { id: 'subscriptions', label: '📅 Subscriptions', icon: '📅' },
        { id: 'platform-users', label: '👥 Users', icon: '👥' },
        { id: 'more', label: '☰ All Menu', icon: '☰' },
      ];
      break;

    case 'Collection Manager':
      moduleTabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'rent', label: '💳 Rent', icon: '💳' },
        { id: 'tenants', label: '👥 Tenants', icon: '👥' },
        { id: 'profile', label: '⚙️ Settings', icon: '⚙️' },
      ];
      break;

    case 'Maintenance Staff':
      moduleTabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'maintenance', label: '🛠️ Orders', icon: '🛠️' },
        { id: 'properties', label: '🏢 Properties', icon: '🏢' },
        { id: 'profile', label: '⚙️ Settings', icon: '⚙️' },
      ];
      break;

    case 'Owner':
      moduleTabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'properties', label: '🏢 Properties', icon: '🏢' },
        { id: 'tenants', label: '👥 Tenants', icon: '👥' },
        { id: 'rent', label: '💰 Income', icon: '💰' },
        { id: 'profile', label: '⚙️ Settings', icon: '⚙️' },
      ];
      break;

    case 'Tenant':
      moduleTabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'lease', label: '📖 Lease', icon: '📖' },
        { id: 'rent', label: '💳 Payments', icon: '💳' },
        { id: 'maintenance', label: '🛠️ Repairs', icon: '🛠️' },
        { id: 'profile', label: '⚙️ Settings', icon: '⚙️' },
      ];
      break;

    case 'Property Manager':
    default:
      moduleTabs = [
        { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
        { id: 'properties', label: '🏢 Properties', icon: '🏢' },
        { id: 'leads', label: '🔑 Leasing', icon: '🔑' },
        { id: 'tenants', label: '👥 Tenants', icon: '👥' },
        { id: 'rent', label: '💳 Rent', icon: '💳' },
        { id: 'more', label: '☰ All 13', icon: '☰' },
      ];
      break;
  }

  // 1-to-1 Dashboard & Screen Router for ALL 13 Web Menus
  const renderDashboardByRole = () => {
    switch (role) {
      case 'Super Admin':
        return <AdminDashboard />;
      case 'Property Manager':
        return <ManagerDashboard onNavigate={(screenId) => setActiveTab(screenId)} />;
      case 'Collection Manager':
        return <CollectionDashboard onNavigate={(screenId) => setActiveTab(screenId)} />;
      case 'Maintenance Staff':
        return <StaffDashboard />;
      case 'Owner':
        return <OwnerDashboard />;
      case 'Tenant':
        return <TenantDashboard />;
      default:
        return <ManagerDashboard onNavigate={(screenId) => setActiveTab(screenId)} />;
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardByRole();
      case 'subscriptions':
        return <SubscriptionsScreen />;
      case 'platform-users':
        return <PlatformUsersScreen />;
      case 'lease':
        return role === 'Tenant' ? <TenantLeaseScreen /> : <LeadsScreen />;
      case 'properties':
        return <PropertiesScreen />;
      case 'leads':
      case 'applications':
        return <LeadsScreen />;
      case 'tenants':
      case 'owners':
      case 'documents':
        return <TenantsScreen />;
      case 'rent':
      case 'accounting':
        return <RentScreen />;
      case 'maintenance':
        return <MaintenanceScreen />;
      case 'companies':
        return <CompaniesScreen />;
      case 'reports':
      case 'communication':
      case 'ai':
        return renderDashboardByRole();
      case 'profile':
        return <ProfileScreen />;
      default:
        return renderDashboardByRole();
    }
  };

  const handleTabPress = (tabId) => {
    if (tabId === 'more') {
      setDrawerVisible(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Header Bar with Hamburger Drawer Trigger */}
      <View style={styles.topHeader}>
        <View style={styles.brandContainer}>
          <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setDrawerVisible(true)}>
            <Text style={styles.hamburgerIcon} allowFontScaling={false}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.brandIcon} allowFontScaling={false}>🏢</Text>
          <Text style={styles.headerTitle} allowFontScaling={false}>Zentrol Property</Text>
        </View>

        <TouchableOpacity style={styles.profileBadge} onPress={() => setActiveTab('profile')}>
          <Text style={styles.profileBadgeText} allowFontScaling={false}>
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Drawer Component */}
      <NavigationDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        activeScreen={activeTab}
        onSelectScreen={(screenId) => setActiveTab(screenId)}
      />

      {/* Main Screen Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.fixedBottomBar}>
          {moduleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={`bottom-${tab.id}`}
                style={[styles.bottomTabItem, isActive && styles.bottomTabItemActive]}
                onPress={() => handleTabPress(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.bottomTabIcon} allowFontScaling={false}>{tab.icon}</Text>
                <Text style={[styles.bottomTabText, isActive && styles.bottomTabTextActive]} allowFontScaling={false}>
                  {tab.label.split(' ')[1] || tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'ios' ? 44 : Platform.OS === 'android' ? 32 : 0,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 13,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hamburgerBtn: {
    paddingRight: 4,
    paddingVertical: 4,
  },
  hamburgerIcon: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: '800',
  },
  brandIcon: {
    fontSize: 16,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  profileBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBadgeText: {
    color: '#0f172a',
    fontWeight: '800',
    fontSize: 13,
  },
  content: {
    flex: 1,
  },
  bottomBarContainer: {
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 6,
  },
  fixedBottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  bottomTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  bottomTabItemActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  bottomTabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  bottomTabText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  bottomTabTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
});
