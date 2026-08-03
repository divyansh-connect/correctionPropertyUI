import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useAuthStore } from '../store/useStore';

export const TenantDashboard = () => {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState(1850.00);
  const [tickets, setTickets] = useState([
    { id: 'wo-1', title: 'AC Filter Replacement', status: 'In Progress', date: 'Jul 28, 2026' }
  ]);
  const [docs, setDocs] = useState([
    { name: 'Lease_Agreement_Signed.pdf', category: 'Rental Agreement', size: '3.2 MB' }
  ]);

  // Modals visibility
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  // Ticket Form
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  // Upload Form
  const [fileName, setFileName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Rental Agreement');
  const [customCategory, setCustomCategory] = useState('');

  const handlePayRent = () => {
    if (balance <= 0) return;
    setBalance(0);
    setPayModalVisible(false);
    Alert.alert('Payment Successful', 'Thank you! Your rent payment has been processed.');
  };

  const handleCreateTicket = () => {
    if (!ticketTitle || !ticketDesc) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const newTicket = {
      id: `wo-${Date.now()}`,
      title: ticketTitle,
      status: 'Open',
      date: 'Just now'
    };
    setTickets([newTicket, ...tickets]);
    setTicketModalVisible(false);
    setTicketTitle('');
    setTicketDesc('');
    Alert.alert('Success', 'Maintenance ticket submitted successfully.');
  };

  const handleSimulatedUpload = () => {
    const fileSizes = [1.5, 2.7, 4.9, 5.8, 0.9];
    const chosenSize = fileSizes[Math.floor(Math.random() * fileSizes.length)];

    if (chosenSize > 5) {
      Alert.alert('Upload Failed', `File size is ${chosenSize}MB. Maximum limit is 5MB.`);
      return;
    }

    const categoryText = selectedCategory === 'Other' ? customCategory : selectedCategory;
    if (!categoryText) {
      Alert.alert('Error', 'Please specify custom category name');
      return;
    }

    const newDoc = {
      name: fileName || `Tenant_Doc_${Date.now().toString().slice(-4)}.pdf`,
      category: categoryText,
      size: `${chosenSize} MB`
    };

    setDocs([newDoc, ...docs]);
    setUploadModalVisible(false);
    setFileName('');
    setCustomCategory('');
    Alert.alert('Success', `Uploaded document under category "${categoryText}"`);
  };

  const categories = [
    'Rental Agreement',
    'Identity Proof (Govt ID)',
    'Proof of Income',
    'Utility Bills',
    'Renter\'s Insurance',
    'Other'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tenant Portal</Text>
        <Text style={styles.welcome}>Welcome home, {user?.name}</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Outstanding Rent</Text>
        {balance === 0 ? (
          <View style={styles.zeroBalanceRow}>
            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>✓ No Balance Due</Text>
            </View>
            <Text style={styles.balanceVal}>$0.00</Text>
          </View>
        ) : (
          <View style={styles.dueBalanceRow}>
            <Text style={styles.balanceVal}>${balance.toFixed(2)}</Text>
            <Text style={styles.dueLabel}>Due: August 1, 2026</Text>
          </View>
        )}

        {balance === 0 ? (
          <TouchableOpacity style={[styles.payButton, styles.payButtonDisabled]} disabled>
            <Text style={styles.payButtonDisabledText}>No Balance Due</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.payButton} onPress={() => setPayModalVisible(true)}>
            <Text style={styles.payButtonText}>Pay Rent Online</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Maintenance Tickets */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Maintenance Tickets</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setTicketModalVisible(true)}>
          <Text style={styles.addButtonText}>+ New Request</Text>
        </TouchableOpacity>
      </View>

      {tickets.map((t) => (
        <View key={t.id} style={styles.ticketCard}>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketTitleText}>{t.title}</Text>
            <Text style={styles.ticketDate}>{t.date}</Text>
          </View>
          <View style={[styles.statusBadge, t.status === 'Open' ? styles.badgeOpen : styles.badgeProgress]}>
            <Text style={styles.statusText}>{t.status}</Text>
          </View>
        </View>
      ))}

      {/* Tenant Documents */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Documents</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setUploadModalVisible(true)}>
          <Text style={styles.addButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {docs.map((d, index) => (
        <View key={index} style={styles.docCard}>
          <View>
            <Text style={styles.docName}>{d.name}</Text>
            <Text style={styles.docCategory}>{d.category}</Text>
          </View>
          <Text style={styles.docSize}>{d.size}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />

      {/* Pay Rent Modal */}
      <Modal visible={payModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Rent Payment</Text>
            <Text style={styles.confirmText}>
              Are you sure you want to pay the outstanding balance of ${balance.toFixed(2)} using your saved payment method?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setPayModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn]} onPress={handlePayRent}>
                <Text style={styles.submitBtnText}>Confirm Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Maintenance Request Modal */}
      <Modal visible={ticketModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Maintenance Ticket</Text>

            <TextInput
              style={styles.input}
              placeholder="Issue Subject (e.g. AC leaky)"
              placeholderTextColor="#94a3b8"
              value={ticketTitle}
              onChangeText={setTicketTitle}
            />
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Detailed description of the issue..."
              placeholderTextColor="#94a3b8"
              multiline
              value={ticketDesc}
              onChangeText={setTicketDesc}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setTicketModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn]} onPress={handleCreateTicket}>
                <Text style={styles.submitBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Upload Document Modal */}
      <Modal visible={uploadModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upload Tenant Document</Text>

            <TextInput
              style={styles.input}
              placeholder="Filename"
              placeholderTextColor="#94a3b8"
              value={fileName}
              onChangeText={setFileName}
            />

            <Text style={styles.selectLabel}>Select Category:</Text>
            <View style={styles.catGrid}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catOption, selectedCategory === c && styles.catOptionActive]}
                  onPress={() => setSelectedCategory(c)}
                >
                  <Text style={[styles.catLabel, selectedCategory === c && styles.catLabelActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedCategory === 'Other' && (
              <TextInput
                style={styles.input}
                placeholder="Enter custom category name"
                placeholderTextColor="#94a3b8"
                value={customCategory}
                onChangeText={setCustomCategory}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelBtn]} onPress={() => setUploadModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.submitBtn]} onPress={handleSimulatedUpload}>
                <Text style={styles.submitBtnText}>Upload</Text>
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
    fontSize: 26,
    fontWeight: '800',
    color: '#10b981',
  },
  welcome: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  zeroBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  dueBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  successBadge: {
    backgroundColor: '#10b98120',
    borderColor: '#10b98140',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  successBadgeText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 12,
  },
  balanceVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
  },
  dueLabel: {
    color: '#f43f5e',
    fontSize: 12,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  payButtonDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#334155',
  },
  payButtonDisabledText: {
    color: '#475569',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  addButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  ticketCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitleText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  ticketDate: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeOpen: {
    backgroundColor: '#3b82f620',
  },
  badgeProgress: {
    backgroundColor: '#f59e0b20',
  },
  statusText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  docCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  docName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
  },
  docCategory: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  docSize: {
    color: '#64748b',
    fontSize: 11,
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
    color: '#10b981',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmText: {
    color: '#cbd5e1',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
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
    backgroundColor: '#10b981',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
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
    marginBottom: 10,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  catOption: {
    width: '48%',
    backgroundColor: '#0f172a',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  catOptionActive: {
    borderColor: '#10b981',
    backgroundColor: '#10b98115',
  },
  catLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  catLabelActive: {
    color: '#10b981',
    fontWeight: '600',
  },
});
