import React, { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RealixColors } from '@/src/constants/screens/realix';
import { useSafeNavigation } from '@/src/hooks/useSafeNavigation';
import { useAuth } from '@/src/context/AuthContext';
import { io, Socket } from 'socket.io-client';
import apiClient from '@/src/services/apiClient';
import { API_ENDPOINTS_CHAT } from '@/src/constants/api';

interface Message {
  _id: string;
  room: string;
  sender: string;
  senderName: string;
  message: string;
  messageType?: string;
  createdAt: string;
}

export default function InboxChatScreen() {
  const router = useRouter();
  const { goBack } = useSafeNavigation();
  const { thread, hotelName } = useLocalSearchParams<{ thread?: string; hotelName?: string }>();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const roomName = thread || `chat_general`;
  const displayName = hotelName || 'Hotel Support';

  // Load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`${API_ENDPOINTS_CHAT.GET_HISTORY}/${roomName}`);
        if (res.data?.success) {
          setMessages(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [roomName]);

  // Connect to Socket.io
  useEffect(() => {
    if (!roomName) return;

    socketRef.current = io(API_ENDPOINTS_CHAT.SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected successfully');
      socketRef.current?.emit('join_room', roomName);
    });

    socketRef.current.on('receive_message', (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicate appending
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_room', roomName);
        socketRef.current.disconnect();
      }
    };
  }, [roomName]);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !socketRef.current) return;

    const messageData = {
      room: roomName,
      sender: user?._id || 'anonymous_user',
      senderName: user?.name || 'Traveller',
      message: inputMessage.trim(),
      messageType: 'text',
    };

    socketRef.current.emit('send_message', messageData);
    setInputMessage('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={goBack}>
            <Ionicons name="chevron-back" size={18} color={RealixColors.textSecondary} />
          </Pressable>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>🏨</Text>
          </View>
          <View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.meta}>Online</Text>
          </View>
        </View>
        <Pressable 
          style={styles.videoButton} 
          onPress={() => router.push({ pathname: '/(tabs)/notifications/video-call', params: { thread: roomName } })}
        >
          <Ionicons name="videocam-outline" size={18} color={RealixColors.textSecondary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={RealixColors.accent} />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.content} 
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg, index) => {
              const isOutgoing = msg.sender === user?._id;
              return (
                <View key={msg._id || index} style={[styles.messageRow, isOutgoing ? styles.rowEnd : styles.rowStart]}>
                  <View style={[styles.messageBubble, isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming]}>
                    <Text style={[styles.messageText, isOutgoing ? styles.textOutgoing : styles.textIncoming]}>
                      {msg.message}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.composer}>
          <TextInput 
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={RealixColors.textMuted}
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={sendMessage}
          />
          <Pressable style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={16} color="#000000" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: RealixColors.screenBackground },
  header: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: RealixColors.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#232323', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20 },
  name: { fontSize: 14, fontWeight: '700', color: RealixColors.textPrimary },
  meta: { fontSize: 11, color: RealixColors.accent },
  videoButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border },
  content: { paddingHorizontal: 20, paddingVertical: 15, gap: 12 },
  messageRow: { flexDirection: 'row', width: '100%', marginVertical: 2 },
  rowStart: { justifyContent: 'flex-start' },
  rowEnd: { justifyContent: 'flex-end' },
  messageBubble: { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleIncoming: { backgroundColor: RealixColors.cardBackground, borderWidth: 1, borderColor: RealixColors.border },
  bubbleOutgoing: { backgroundColor: RealixColors.accent },
  messageText: { fontSize: 13, lineHeight: 19 },
  textIncoming: { color: RealixColors.textPrimary },
  textOutgoing: { color: '#000000', fontWeight: '600' },
  composer: { paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderColor: RealixColors.border },
  input: { flex: 1, height: 42, borderRadius: 21, backgroundColor: RealixColors.inputBackground, borderWidth: 1, borderColor: RealixColors.inputBorder, paddingHorizontal: 14, color: RealixColors.textPrimary, fontSize: 13 },
  sendButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: RealixColors.accent, alignItems: 'center', justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: RealixColors.textSecondary, fontSize: 13, marginTop: 10 },
});