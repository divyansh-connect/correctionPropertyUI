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

export const OwnerDashboard = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  // New Property Form States
  const [propName, setPropName] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propType, setPropType] = useState('Residential');
  const [propRent, setPropRent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Document Upload States
  const [selectedCategory, setSelectedCategory] = useState('Statements');
  const [customCategory, setCustomCategory] = useState('');
  const [fileName, setFileName] = useState('');
  const [documents, setDocuments] = useState([
    { name: 'Q1_Financials.pdf', category: 'Statements', size: '2.4 MB' },
    { name: 'Property_Insurance_2026.pdf', category: 'Insurance', size: '4.1 MB' },
  ]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/properties', logout, refreshAccessToken);
      setProperties(res.data || res);
    } catch (e) {
      console.error('Error loading properties:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleAddProperty = async () => {
    if (!propName || !propAddress || !propRent) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(
        '/properties',
        {
          name: propName,
          address: propAddress,
          type: propType,
          targetRent: parseFloat(propRent),
        },
        logout,
        refreshAccessToken
      );
      Alert.alert('Success', 'Property added successfully');
      setAddModalVisible(false);
      // Reset form
      setPropName('');
      setPropAddress('');
      setPropRent('');
      loadProperties();
    } catch (e) {
      console.error('Failed to add property:', e);
      Alert.alert('Error', e.message || 'Failed to add property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = (id, name) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.delete(`/properties/${id}`, logout, refreshAccessToken);
              Alert.alert('Success', 'Property deleted successfully');
              loadProperties();
            } catch (e) {
              console.error('Failed to delete property:', e);
              Alert.alert('Error', e.message || 'Failed to delete property');
            }
          },
        },
      ]
    );
  };

  const handleSimulatedUpload = () => {
    const sizes = [1.2, 3.4, 4.8, 5.5, 2.1];
    const sizeMb = sizes[Math.floor(Math.random() * sizes.length)];

    if (sizeMb > 5) {
      Alert.alert('Upload Failed', `File size is ${sizeMb}MB. Maximum limit is 5MB.`);
      return;
    }

    const finalCategory = selectedCategory === 'Other' ? customCategory : selectedCategory;
    if (!finalCategory) {
      Alert.alert('Error', 'Please specify custom category name');
      return;
    }

    const newDoc = {
      name: fileName || `Document_${Date.now().toString().slice(-4)}.pdf`,
      category: finalCategory,
      size: `${sizeMb} MB`,
    };

    setDocuments([newDoc, ...documents]);
    Alert.alert('Success', `File uploaded successfully under ${finalCategory}`);
    setUploadModalVisible(false);
    setFileName('');
    setCustomCategory('');
  };

  const categories = [
    'Statements',
    'Tax Documents',
    'Contracts',
    'Insurance',
    'Property Photos',
    'Maintenance Reports',
    'Inspection Reports',
    'Other',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Owner Dashboard</Text>
        <Text style={styles.welcome}>Welcome back, {user?.name}</Text>
      </View>

      {/* Overview stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>{properties.length}</Text>
          <Text style={styles.statLabel}>Properties</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statVal}>$4,500</Text>
          <Text style={styles.statLabel}>Total Payout</Text>
        </View>
      </View>

      {/* Properties Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Properties</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Property</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#38bdf8" style={{ margin: 24 }} />
      ) : properties.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No properties added yet.</Text>
        </View>
      ) : (
        properties.map((item) => (
          <View key={item.id} style={item.id ? styles.propertyCard : {}}>
            <View style={styles.propertyHeader}>
              <Text style={styles.propertyName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProperty(item.id, item.name)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.propertyAddress}>{item.address}</Text>
            <View style={styles.propertyMeta}>
              <Text style={styles.propertyBadge}>{item.type}</Text>
              <Text style={styles.propertyRent}>Target Rent: ${item.targetRent}</Text>
            </View>
          </View>
        ))
      )}

      {/* Documents Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setUploadModalVisible(true)}>
          <Text style={styles.addButtonText}>Upload Doc</Text>
        </TouchableOpacity>
      </View>

      {documents.map((doc, idx) => (
        <View key={idx} style={styles.docCard}>
          <View>
            <Text style={styles.docName}>{doc.name}</Text>
            <Text style={styles.docCategory}>{doc.category}</Text>
          </View>
          <Text style={styles.docSize}>{doc.size}</Text>
        </View>
      ))}

      {/* Space at the bottom */}
      <View style={{ height: 40 }} />

      {/* Add Property Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Property</Text>

            <TextInput
              style={styles.input}
              placeholder="Property Name"
              placeholderTextColor="#94a3b8"
              value={propName}
              onChangeText={setPropName}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#94a3b8"
              value={propAddress}
              onChangeText={setPropAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Target Rent ($)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={propRent}
              onChangeText={setPropRent}
            />

            <View style={styles.radioRow}>
              {['Residential', 'Commercial'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.radio, propType === type && styles.radioActive]}
                  onPress={() => setPropType(type)}
                >
                  <Text style={[styles.radioLabel, propType === type && styles.radioLabelActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitBtn]}
                onPress={handleAddProperty}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Upload Document Modal */}
      <Modal visible={uploadModalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upload Owner Document</Text>

            <TextInput
              style={styles.input}
              placeholder="Filename (optional)"
              placeholderTextColor="#94a3b8"
              value={fileName}
              onChangeText={setFileName}
            />

            <Text style={styles.selectLabel}>Select Category:</Text>
            <View style={styles.catGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catOption, selectedCategory === cat && styles.catOptionActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catLabel, selectedCategory === cat && styles.catLabelActive]}>
                    {cat}
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
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setUploadModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitBtn]}
                onPress={handleSimulatedUpload}
              >
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
    color: '#38bdf8',
  },
  welcome: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
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
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statVal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
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
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  propertyCard: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ef444440',
  },
  deleteText: {
    color: '#f43f5e',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyAddress: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  propertyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
  },
  propertyBadge: {
    backgroundColor: '#38bdf820',
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  propertyRent: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
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
    borderLeftColor: '#38bdf8',
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
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  radio: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  radioActive: {
    borderColor: '#38bdf8',
    backgroundColor: '#38bdf820',
  },
  radioLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  radioActiveLabel: {
    color: '#38bdf8',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
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
    borderColor: '#38bdf8',
    backgroundColor: '#38bdf815',
  },
  catLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  catLabelActive: {
    color: '#38bdf8',
    fontWeight: '600',
  },
});
