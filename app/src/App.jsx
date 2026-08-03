import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './store/useStore';
import { LoginScreen } from './screens/LoginScreen';
import { AdminDashboard } from './screens/AdminDashboard';
import { OwnerDashboard } from './screens/OwnerDashboard';
import { TenantDashboard } from './screens/TenantDashboard';
import { ProfileScreen } from './screens/ProfileScreen';

export default function App() {
  const { user, isAuthenticated, isLoaded, initializeAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
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

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Super Admin':
      case 'Property Manager':
        return <AdminDashboard />;
      case 'Owner':
        return <OwnerDashboard />;
      case 'Tenant':
        return <TenantDashboard />;
      default:
        return <TenantDashboard />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {activeTab === 'dashboard' ? renderDashboard() : <ProfileScreen />}
      </View>

      {/* Custom Navigation Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.tabItemActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 48 : 24, // Responsive top padding to avoid notch
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 84 : 60, // Extra height on iOS to avoid home indicator overlap
    paddingBottom: Platform.OS === 'ios' ? 24 : 0, // Padding for iOS bottom safe area
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#38bdf8',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
});
