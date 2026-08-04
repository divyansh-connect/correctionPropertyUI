import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; // Standard built-in Expo vector icons
import { useAuthStore } from './store/useStore';
import { LoginScreen } from './screens/LoginScreen';
import { AdminDashboard } from './screens/AdminDashboard';
import { OwnerDashboard } from './screens/OwnerDashboard';
import { TenantDashboard } from './screens/TenantDashboard';
import { MaintenanceStaffDashboard } from './screens/MaintenanceStaffDashboard';
import { ProfileScreen } from './screens/ProfileScreen';

export default function App() {
  const { user, isAuthenticated, isLoaded, initializeAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    initializeAuth();
  }, []);

  // Reset active tab on login/logout
  useEffect(() => {
    setActiveTab('dashboard');
  }, [isAuthenticated, user?.role]);

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

  const isMaintenanceStaff = user?.role === 'Maintenance Staff';

  const renderContent = () => {
    if (isMaintenanceStaff) {
      switch (activeTab) {
        case 'dashboard':
          return <MaintenanceStaffDashboard activeSubTab="dashboard" />;
        case 'mytasks':
          return <MaintenanceStaffDashboard activeSubTab="mytasks" />;
        case 'history':
          return <MaintenanceStaffDashboard activeSubTab="history" />;
        case 'profile':
          return <ProfileScreen />;
        default:
          return <MaintenanceStaffDashboard activeSubTab="dashboard" />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
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
        case 'profile':
          return <ProfileScreen />;
        default:
          return <ProfileScreen />;
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Custom Navigation Tab bar with Icons */}
      <View style={styles.tabBar}>
        {isMaintenanceStaff ? (
          <>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'dashboard' && styles.tabItemActive]}
              onPress={() => setActiveTab('dashboard')}
            >
              <Ionicons 
                name={activeTab === 'dashboard' ? "grid" : "grid-outline"} 
                size={20} 
                color={activeTab === 'dashboard' ? '#38bdf8' : '#94a3b8'} 
              />
              <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'mytasks' && styles.tabItemActive]}
              onPress={() => setActiveTab('mytasks')}
            >
              <Ionicons 
                name={activeTab === 'mytasks' ? "clipboard" : "clipboard-outline"} 
                size={20} 
                color={activeTab === 'mytasks' ? '#38bdf8' : '#94a3b8'} 
              />
              <Text style={[styles.tabText, activeTab === 'mytasks' && styles.tabTextActive]}>
                My Tasks
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'history' && styles.tabItemActive]}
              onPress={() => setActiveTab('history')}
            >
              <Ionicons 
                name={activeTab === 'history' ? "time" : "time-outline"} 
                size={20} 
                color={activeTab === 'history' ? '#38bdf8' : '#94a3b8'} 
              />
              <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                History
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
              onPress={() => setActiveTab('profile')}
            >
              <Ionicons 
                name={activeTab === 'profile' ? "person" : "person-outline"} 
                size={20} 
                color={activeTab === 'profile' ? '#38bdf8' : '#94a3b8'} 
              />
              <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
                Profile
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'dashboard' && styles.tabItemActive]}
              onPress={() => setActiveTab('dashboard')}
            >
              <Ionicons 
                name={activeTab === 'dashboard' ? "home" : "home-outline"} 
                size={20} 
                color={activeTab === 'dashboard' ? '#38bdf8' : '#94a3b8'} 
              />
              <Text style={[styles.tabText, activeTab === 'dashboard' && styles.tabTextActive]}>
                Dashboard
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'profile' && styles.tabItemActive]}
              onPress={() => setActiveTab('profile')}
            >
              <Ionicons 
                name={activeTab === 'profile' ? "person" : "person-outline"} 
                size={20} 
                color={activeTab === 'profile' ? '#38bdf8' : '#94a3b8'} 
              />
              <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
                Profile
              </Text>
            </TouchableOpacity>
          </>
        )}
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
    height: Platform.OS === 'ios' ? 90 : 66, // Extra height on iOS to avoid home indicator overlap
    paddingBottom: Platform.OS === 'ios' ? 24 : 6, // Padding for bottom safe areas
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
    paddingTop: 6,
  },
  tabItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#38bdf8',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#38bdf8',
    fontWeight: '700',
  },
});
