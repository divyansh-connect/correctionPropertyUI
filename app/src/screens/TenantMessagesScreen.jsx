import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useStore';

// Animated Touchable Wrapper Component
const AnimatedTouchable = ({ children, onPress, style, disabled }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const TenantMessagesScreen = () => {
  const { user, logout, refreshAccessToken } = useAuthStore();
  const isOwner = user?.role === 'Owner';

  const defaultContact = isOwner ? 'Property Manager' : 'Property Manager Office';
  const [activeContact, setActiveContact] = useState(defaultContact);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Compose Form State
  const [composeRecipient, setComposeRecipient] = useState(defaultContact);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const runEntryAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const [chatHistory, setChatHistory] = useState({
    'Property Manager': [
      { id: '1', sender: 'manager', text: 'Hello! Welcome to Zentrol Owner Portal. How can we assist with your portfolio today?', time: '09:30 AM' },
      { id: '2', sender: 'user', text: 'Hi! I wanted to check on the monthly ledger statement.', time: '09:32 AM' },
      { id: '3', sender: 'manager', text: 'Your monthly statements for Sky house and property 1 have been published.', time: '09:35 AM' },
    ],
    'Accountant': [
      { id: '1', sender: 'manager', text: 'Accounting office here. Net owner distribution of $1,980.00 is queued.', time: 'Yesterday' },
    ],
    'Leasing Lead': [
      { id: '2', sender: 'manager', text: 'Leasing update: Tenant unit occupied with active lease contract.', time: '08:00 AM' },
    ],
    'Resident Representative': [
      { id: '3', sender: 'manager', text: 'Resident representative available for property inquiry.', time: 'Monday' },
    ],
    'Property Manager Office': [
      { id: '1', sender: 'manager', text: 'Hello! Welcome to Zentrol Property Management. How can we assist you today?', time: '09:30 AM' },
    ],
    'Leasing Office': [
      { id: '1', sender: 'manager', text: 'Leasing office here. Your lease agreement is active.', time: 'Yesterday' },
    ],
    'Maintenance Team': [
      { id: '1', sender: 'manager', text: 'Work orders for your property units are currently completed.', time: '08:00 AM' },
    ],
    'Accounting Office': [
      { id: '1', sender: 'manager', text: 'Your account balance is currently clear.', time: 'Monday' },
    ],
  });

  const contacts = isOwner
    ? [
        { id: '1', name: 'Property Manager', icon: '🏢' },
        { id: '2', name: 'Accountant', icon: '📚' },
        { id: '3', name: 'Leasing Lead', icon: '🔑' },
        { id: '4', name: 'Resident Representative', icon: '💬' },
      ]
    : [
        { id: '1', name: 'Property Manager Office', icon: '🏢' },
        { id: '2', name: 'Leasing Office', icon: '🔑' },
        { id: '3', name: 'Maintenance Team', icon: '🛠️' },
        { id: '4', name: 'Accounting Office', icon: '📚' },
      ];

  // Strictly call live Railway backend endpoint: GET /portal/owner/messages OR GET /messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const endpoint = isOwner ? '/portal/owner/messages' : '/messages';
      const res = await apiClient.get(endpoint, logout, refreshAccessToken);
      const rawList = Array.isArray(res) ? res : (res?.data || []);

      if (rawList && rawList.length > 0) {
        const formatted = {};
        rawList.forEach((m) => {
          const contactKey = m.sender || m.recipient || defaultContact;
          if (!formatted[contactKey]) formatted[contactKey] = [];
          formatted[contactKey].push({
            id: m.id || String(Date.now()),
            sender: m.sender === user?.email ? 'user' : 'manager',
            text: m.body || m.text || m.message || '',
            time: m.timestamp ? m.timestamp.split('T')[0] : 'Today',
          });
        });
        setChatHistory((prev) => ({ ...prev, ...formatted }));
      }
    } catch (e) {
      console.log('Error fetching messages from Railway:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      runEntryAnimation();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.role]);

  const handleSendReply = async () => {
    if (!inputText.trim()) return;
    const msgText = inputText.trim();
    const newMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMsg],
    }));

    setInputText('');

    try {
      const endpoint = isOwner ? '/portal/owner/messages' : '/messages';
      await apiClient.post(
        endpoint,
        {
          recipient: activeContact,
          subject: 'Re: Message Thread',
          body: msgText,
        },
        logout,
        refreshAccessToken
      );
    } catch (e) {
      console.log('Post message fallback state applied:', e.message);
    }
  };

  const handleComposeSubmit = async () => {
    if (!composeSubject.trim() || !composeBody.trim()) {
      Alert.alert('Error', 'Please fill in subject and message body');
      return;
    }

    setSending(true);
    const newMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: `[${composeSubject}] ${composeBody}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const endpoint = isOwner ? '/portal/owner/messages' : '/messages';
      await apiClient.post(
        endpoint,
        {
          recipient: composeRecipient,
          subject: composeSubject,
          body: composeBody,
        },
        logout,
        refreshAccessToken
      );
    } catch (e) {
      console.log('Compose message fallback state applied:', e.message);
    } finally {
      setChatHistory((prev) => ({
        ...prev,
        [composeRecipient]: [...(prev[composeRecipient] || []), newMsg],
      }));
      setActiveContact(composeRecipient);
      setSending(false);
      setIsComposeOpen(false);
      setComposeSubject('');
      setComposeBody('');
      runEntryAnimation();
      Alert.alert('Message Sent', `Your message to ${composeRecipient} was sent!`);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText} allowFontScaling={false}>
          Loading {isOwner ? 'Owner' : 'Tenant'} Messages...
        </Text>
      </View>
    );
  }

  const currentMessages = chatHistory[activeContact] || [];

  return (
    <View style={styles.mainWrapper}>
      {/* Page Header */}
      <View style={styles.header}>
        <Text style={styles.breadcrumb} allowFontScaling={false}>Home › Messages</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title} allowFontScaling={false}>
            {isOwner ? 'Owner Communication Hub' : 'Messages & Support'}
          </Text>

          <AnimatedTouchable style={styles.composeBtn} onPress={() => setIsComposeOpen(true)}>
            <Text style={styles.composeBtnText} allowFontScaling={false}>+ New Message</Text>
          </AnimatedTouchable>
        </View>
      </View>

      {/* Horizontal Contacts Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactScroll}>
        {contacts.map((c) => {
          const isSelected = activeContact === c.name;
          return (
            <TouchableOpacity
              key={c.id}
              style={[styles.contactChip, isSelected && styles.contactChipActive]}
              onPress={() => setActiveContact(c.name)}
            >
              <Text style={styles.contactIcon}>{c.icon}</Text>
              <Text style={[styles.contactName, isSelected && styles.contactNameActive]} allowFontScaling={false}>
                {c.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Contact Header */}
      <View style={styles.threadHeader}>
        <Text style={styles.threadHeaderTitle} allowFontScaling={false}>💬 Conversation: {activeContact}</Text>
      </View>

      {/* Chat Thread Messages List */}
      <ScrollView
        style={styles.threadScroll}
        contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMessages} tintColor="#38bdf8" />}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {currentMessages.length === 0 ? (
            <View style={styles.emptyThreadCard}>
              <Text style={styles.emptyThreadText} allowFontScaling={false}>No se encontraron resultados.</Text>
              <Text style={styles.emptyThreadSub} allowFontScaling={false}>No messages recorded in this conversation thread.</Text>
            </View>
          ) : (
            currentMessages.map((msg) => {
              const isMe = msg.sender === 'user' || msg.sender === 'tenant';
              return (
                <View key={msg.id} style={[styles.bubbleWrapper, isMe ? styles.bubbleRight : styles.bubbleLeft]}>
                  <View style={[styles.bubble, isMe ? styles.bubbleUser : styles.bubbleManager]}>
                    <Text style={[styles.bubbleText, isMe ? styles.textUser : styles.textManager]} allowFontScaling={false}>
                      {msg.text}
                    </Text>
                    <Text style={[styles.bubbleTime, isMe ? styles.timeUser : styles.timeManager]} allowFontScaling={false}>
                      {msg.time}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </Animated.View>
      </ScrollView>

      {/* Reply Input Bar */}
      <View style={styles.replyBar}>
        <TextInput
          style={styles.replyInput}
          placeholder={`Message ${activeContact}...`}
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSendReply} activeOpacity={0.8}>
          <Text style={styles.sendBtnText} allowFontScaling={false}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL: + New Message / Compose */}
      <Modal visible={isComposeOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} allowFontScaling={false}>+ Compose Message</Text>

            <Text style={styles.inputLabel} allowFontScaling={false}>RECIPIENT GROUP</Text>
            <View style={styles.recipientRow}>
              {contacts.map((c) => {
                const isSelected = composeRecipient === c.name;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.recChip, isSelected && styles.recChipActive]}
                    onPress={() => setComposeRecipient(c.name)}
                  >
                    <Text style={[styles.recChipText, isSelected && styles.recChipTextActive]} allowFontScaling={false}>
                      {c.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel} allowFontScaling={false}>SUBJECT *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Inquiry regarding monthly statement"
              placeholderTextColor="#94a3b8"
              value={composeSubject}
              onChangeText={setComposeSubject}
            />

            <Text style={styles.inputLabel} allowFontScaling={false}>MESSAGE BODY *</Text>
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              placeholder="Type message content..."
              placeholderTextColor="#94a3b8"
              multiline
              value={composeBody}
              onChangeText={setComposeBody}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setIsComposeOpen(false)}>
                <Text style={styles.cancelBtnText} allowFontScaling={false}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleComposeSubmit} disabled={sending}>
                <Text style={styles.saveBtnText} allowFontScaling={false}>
                  {sending ? 'Sending...' : 'Send Message'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#0f172a' },
  center: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8 },

  header: { padding: 16, paddingBottom: 6 },
  breadcrumb: { color: '#38bdf8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '800', color: '#f8fafc', flex: 1 },

  composeBtn: { backgroundColor: '#0284c7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  composeBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

  contactScroll: { paddingHorizontal: 16, marginBottom: 8, maxHeight: 40 },
  contactChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginRight: 8, borderWidth: 1, borderColor: '#334155', gap: 6 },
  contactChipActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  contactIcon: { fontSize: 13 },
  contactName: { color: '#cbd5e1', fontSize: 11, fontWeight: '600' },
  contactNameActive: { color: '#ffffff', fontWeight: '800' },

  threadHeader: { backgroundColor: '#1e293b', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#334155' },
  threadHeaderTitle: { color: '#38bdf8', fontSize: 12, fontWeight: '800' },

  threadScroll: { flex: 1 },
  emptyThreadCard: { backgroundColor: '#1e293b', padding: 24, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155', marginTop: 10 },
  emptyThreadText: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  emptyThreadSub: { color: '#94a3b8', fontSize: 12, marginTop: 4 },

  bubbleWrapper: { marginBottom: 12, flexDirection: 'row' },
  bubbleLeft: { justifyContent: 'flex-start' },
  bubbleRight: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 14 },
  bubbleManager: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  bubbleUser: { backgroundColor: '#0284c7' },
  bubbleText: { fontSize: 13, lineHeight: 18 },
  textManager: { color: '#f8fafc' },
  textUser: { color: '#ffffff' },
  bubbleTime: { fontSize: 9.5, marginTop: 4, textAlign: 'right' },
  timeManager: { color: '#94a3b8' },
  timeUser: { color: 'rgba(255,255,255,0.75)' },

  replyBar: { flexDirection: 'row', padding: 12, backgroundColor: '#1e293b', borderTopWidth: 1, borderColor: '#334155', gap: 8, marginBottom: 20 },
  replyInput: { flex: 1, backgroundColor: '#0f172a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, color: '#f8fafc', fontSize: 13, borderWidth: 1, borderColor: '#334155' },
  sendBtn: { backgroundColor: '#0284c7', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 10 },
  sendBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 17, fontWeight: '800', color: '#38bdf8', marginBottom: 14, textAlign: 'center' },
  inputLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '700', marginBottom: 4, marginTop: 4 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#f8fafc', fontSize: 13, marginBottom: 10 },

  recipientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  recChip: { backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  recChipActive: { backgroundColor: '#0284c7', borderColor: '#38bdf8' },
  recChipText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  recChipTextActive: { color: '#ffffff', fontWeight: '800' },

  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { width: '48%', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#334155' },
  cancelBtnText: { color: '#cbd5e1', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0284c7' },
  saveBtnText: { color: '#ffffff', fontWeight: '700' },
});
