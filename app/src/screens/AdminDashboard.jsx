import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';

export const AdminDashboard = () => {
  const { logout, refreshAccessToken } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  // Invite Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Property Manager');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const usersRes = await apiClient.get('/superadmin/company-users', logout, refreshAccessToken);
      setUsers(usersRes.data || usersRes);

      const statsRes = await apiClient.get('/superadmin/stats', logout, refreshAccessToken);
      setStats(statsRes.data || statsRes);
    } catch (e) {
      console.error('Error loading admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInviteUser = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(
        '/superadmin/company-users',
        {
          firstName,
          lastName,
          email,
          roleName: role,
        },
        logout,
        refreshAccessToken
      );
      Alert.alert('Success', 'User invited successfully');
      setInviteModalVisible(false);
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      loadData();
    } catch (e) {
      console.error('Failed to invite user:', e);
      Alert.alert('Error', e.message || 'Failed to invite user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await apiClient.put(`/superadmin/company-users/${id}/status`, { status: nextStatus }, logout, refreshAccessToken);
      Alert.alert('Success', `User status updated to ${nextStatus}`);
      loadData();
    } catch (e) {
      console.error('Failed to update status:', e);
      Alert.alert('Error', e.message || 'Failed to update user status');
    }
  };

  const handleRevokeUser = (id, name) => {
    Alert.alert(
      'Confirm Revocation',
      `Are you sure you want to revoke and delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/superadmin/company-users/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'User access revoked');
              loadData();
            } catch (e) {
              console.error('Failed to revoke user:', e);
              Alert.alert('Error', e.message || 'Failed to revoke user');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manager & Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage team members, activity, and platform configurations</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats?.totalCompanies || '12'}</Text>
          <Text style={styles.statLabel}>Companies</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{users.length}</Text>
          <Text style={styles.statLabel}>Active Members</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{stats?.totalActiveUsers || '28'}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
      </View>

      {/* User Directory */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User Directory</Text>
        <TouchableOpacity style={styles.inviteBtn} onPress={() => setInviteModalVisible(true)}>
          <Text style={styles.inviteBtnText}>Invite User</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#38bdf8" style={{ margin: 24 }} />
      ) : users.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No users registered yet.</Text>
        </View>
      ) : (
        users.map((item) => (
          <View key={item.id} style={styles.userCard}>
            <View style={styles.userInfoRow}>
              <View>
                <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Active' ? styles.badgeActive : styles.badgeSuspended]}>
                <Text style={styles.statusText}>{item.status || 'Active'}</Text>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Text style={styles.roleLabel}>{item.roleName || 'Property Manager'}</Text>
              <View style={styles.btnGroup}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.statusBtn]}
                  onPress={() => handleToggleStatus(item.id, item.status || 'Active')}
                >
                  <Text style={styles.statusBtnText}>
                    {item.status === 'Active' ? 'Suspend' : 'Activate'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.revokeBtn]}
                  onPress={() => handleRevokeUser(item.id, `${item.firstName} ${item.lastName}`)}
                >
                  <Text style={styles.revokeBtnText}>Revoke</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

      <View style={{ height: 40 }} />

      {/* Invite User Modal */}
      <Modal visible={inviteModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Invite Team Member</Text>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#94a3b8"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#94a3b8"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.selectLabel}>Select Role:</Text>
            <View style={styles.roleGrid}>
              {['Property Manager', 'Collection Manager', 'Maintenance Staff'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, role === r && styles.roleOptionActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleOptionText, role === r && styles.roleOptionTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setInviteModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitBtn]}
                onPress={handleInviteUser}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Invite</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#38bdf8',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    padding: 12,
    width: '31%',
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  inviteBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  inviteBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  userCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userName: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeActive: {
    backgroundColor: '#10b98120',
  },
  badgeSuspended: {
    backgroundColor: '#ef444420',
  },
  statusText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  roleLabel: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '600',
  },
  btnGroup: {
    flexDirection: 'row',
  },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusBtn: {
    backgroundColor: '#334155',
  },
  statusBtnText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  revokeBtn: {
    backgroundColor: '#ef444420',
    borderWidth: 1,
    borderColor: '#ef444440',
  },
  revokeBtnText: {
    color: '#f43f5e',
    fontSize: 11,
    fontWeight: '700',
  },
  modalBg: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#38bdf8',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    marginBottom: 12,
  },
  selectLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 8,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleOption: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  roleOptionActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#38bdf815',
  },
  roleOptionText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  roleOptionTextActive: {
    color: '#38bdf8',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    width: '47%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#334155',
  },
  cancelBtnText: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#0284c7',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
