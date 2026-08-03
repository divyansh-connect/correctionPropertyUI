import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthStore } from '../store/useStore';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name?.slice(0, 2).toUpperCase()}</Text>
        </View>

        <Text style={styles.name}>{user?.name || 'User Name'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Role</Text>
          <Text style={styles.roleVal}>{user?.role || 'User'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#38bdf820',
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#38bdf8',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  email: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
    marginBottom: 32,
  },
  roleContainer: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  roleLabel: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roleVal: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#ef444420',
    borderWidth: 1,
    borderColor: '#ef444460',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#f43f5e',
    fontSize: 15,
    fontWeight: '700',
  },
});
