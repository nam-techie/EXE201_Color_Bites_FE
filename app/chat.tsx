import { OPENAI_API_KEY } from '@/constants'
import { aiChatService, type ChatMessage } from '@/services/AIChatService'
import { Ionicons } from '@expo/vector-icons'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

type UiMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào 👋 Mình là trợ lí AI của Mumi. Bạn muốn ăn gì hôm nay?',
    },
  ])
  const listRef = useRef<FlatList<UiMessage>>(null)

  const canSend = useMemo(() => inputText.trim().length > 0 && !isSending && !!OPENAI_API_KEY, [inputText, isSending])

  const scrollToEnd = () => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }))
  }

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || isSending) return
    if (!OPENAI_API_KEY) {
      Toast.show({ type: 'error', text1: 'Thiếu API Key', text2: 'Hãy cấu hình OPENAI_API_KEY trước khi chat.' })
      return
    }

    const userMsg: UiMessage = { id: `${Date.now()}-user`, role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsSending(true)
    scrollToEnd()

    try {
      const history: ChatMessage[] = [
        { role: 'system', content: 'Bạn là trợ lí gợi ý món ăn và địa điểm cho ứng dụng Mumi.' },
        ...messages.map((m) => ({ role: m.role, content: m.content } as ChatMessage)),
        { role: 'user', content: text },
      ]

      const reply = await aiChatService.sendChat(history)
      const aiMsg: UiMessage = { id: `${Date.now()}-ai`, role: 'assistant', content: reply || 'Mình chưa nghe rõ, bạn nói lại được không?' }
      setMessages((prev) => [...prev, aiMsg])
      scrollToEnd()
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Lỗi chat', text2: err?.message || 'Vui lòng thử lại.' })
    } finally {
      setIsSending(false)
    }
  }

  const renderItem = ({ item }: { item: UiMessage }) => {
    const isUser = item.role === 'user'
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}>
        {isUser ? (
          <LinearGradient colors={['#FF6B35', '#FF1493']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.userBubble}>
            <Text style={styles.userText}>{item.content}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.aiBubble}>
            <Text style={styles.aiText}>{item.content}</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaskedView
            style={styles.maskedIcon}
            maskElement={<Ionicons name="chatbubble-ellipses" size={22} color="#ffffff" />}
          >
            <LinearGradient colors={['#FF6B35', '#FF1493']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
          </MaskedView>
          <Text style={styles.headerTitle}>Trợ lí Mumi</Text>
          {!OPENAI_API_KEY && (
            <View style={styles.keyBadgePlain}>
              <Text style={styles.keyBadgePlainText}>Hãy cấu hình API Key</Text>
            </View>
          )}
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <FlatList
          ref={listRef}
          contentContainerStyle={styles.listContent}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          onContentSizeChange={scrollToEnd}
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={OPENAI_API_KEY ? 'Nhập tin nhắn...' : 'Vui lòng cấu hình OPENAI_API_KEY trước'}
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!!OPENAI_API_KEY && !isSending}
          />
          <TouchableOpacity style={[styles.sendButton, (!canSend) && styles.sendButtonDisabled]} onPress={handleSend} disabled={!canSend}>
            <LinearGradient colors={['#FF6B35', '#FF1493']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sendButtonGradient}>
              {isSending ? (
                <Ionicons name="hourglass" size={20} color="#ffffff" />
              ) : (
                <Ionicons name="send" size={20} color="#ffffff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  header: { backgroundColor: '#FFFFFF', paddingTop: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: '#111827', fontSize: 18, fontWeight: '700' },
  maskedIcon: { width: 22, height: 22 },
  keyBadgePlain: { marginLeft: 10, backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  keyBadgePlainText: { color: '#6B7280', fontSize: 12 },

  listContent: { padding: 16, paddingBottom: 12 },
  messageRow: { marginBottom: 10, flexDirection: 'row' },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowAssistant: { justifyContent: 'flex-start' },
  userBubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomRightRadius: 4 },
  userText: { color: '#fff', fontSize: 15 },
  aiBubble: { maxWidth: '85%', backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' },
  aiText: { color: '#111827', fontSize: 15 },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 8, backgroundColor: '#FFFFFF' },
  input: { flex: 1, maxHeight: 120, minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, fontSize: 15, color: '#111827', backgroundColor: '#FFFFFF' },
  sendButton: { borderRadius: 22 },
  sendButtonGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
})


