import { GEMINI_API_KEY } from '@/constants'
import { useLocation } from '@/hooks/useLocation'
import { aiChatService, type ChatMessage } from '@/services/AIChatService'
import { GoongService } from '@/services/GoongService'
import { Ionicons } from '@expo/vector-icons'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useMemo, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

type UiMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isFindingNearby, setIsFindingNearby] = useState(false)
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Xin chào 👋 Mình là trợ lí AI của Mumi. Bạn muốn ăn gì hôm nay?',
    },
  ])
  const listRef = useRef<FlatList<UiMessage>>(null)
  const { getCurrentLocation, isLoading: isLocationLoading } = useLocation()

  const canSend = useMemo(() => inputText.trim().length > 0 && !isSending && !!GEMINI_API_KEY, [inputText, isSending])

  const scrollToEnd = () => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }))
  }

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || isSending) return
    if (!GEMINI_API_KEY) {
      Toast.show({ type: 'error', text1: 'Thiếu API Key', text2: 'Hãy cấu hình GEMINI_API_KEY trước khi chat.' })
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

  const handleQuickAction = async (messageText: string) => {
    if (isSending || isFindingNearby) return
    if (!GEMINI_API_KEY) {
      Toast.show({ type: 'error', text1: 'Thiếu API Key', text2: 'Hãy cấu hình GEMINI_API_KEY trước khi chat.' })
      return
    }

    const userMsg: UiMessage = { id: `${Date.now()}-user`, role: 'user', content: messageText }
    setMessages((prev) => [...prev, userMsg])
    setIsSending(true)
    scrollToEnd()

    try {
      const history: ChatMessage[] = [
        { role: 'system', content: 'Bạn là trợ lí gợi ý món ăn và địa điểm cho ứng dụng Mumi.' },
        ...messages.map((m) => ({ role: m.role, content: m.content } as ChatMessage)),
        { role: 'user', content: messageText },
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

  const handleFindNearbyRestaurants = async () => {
    if (isFindingNearby || isLocationLoading) return

    setIsFindingNearby(true)
    scrollToEnd()
    const loadingId = `loading-${Date.now()}` // Khai báo ở đây để có thể dùng trong catch

    try {
      // Lấy vị trí hiện tại
      const location = await getCurrentLocation()
      if (!location) {
        Toast.show({ type: 'error', text1: 'Không lấy được vị trí', text2: 'Vui lòng cho phép truy cập vị trí để tìm quán xung quanh.' })
        setIsFindingNearby(false)
        return
      }

      // Thêm user message
      const userMsg: UiMessage = { 
        id: `${Date.now()}-user`, 
        role: 'user', 
        content: '📍 Tìm quán xung quanh' 
      }
      setMessages((prev) => [...prev, userMsg])
      scrollToEnd()

      // Thêm loading message
      const loadingMsg: UiMessage = { 
        id: loadingId, 
        role: 'assistant', 
        content: 'Đang tìm quán xung quanh bạn...' 
      }
      setMessages((prev) => [...prev, loadingMsg])
      scrollToEnd()

      // Tìm quán xung quanh
      const searchQueries = ['nhà hàng', 'quán ăn', 'restaurant']
      const allResults: string[] = []

      for (const query of searchQueries) {
        const response = await GoongService.autocomplete(
          query,
          { lat: location.latitude, lng: location.longitude },
          5000 // 5km radius
        )

        if (response.predictions && response.predictions.length > 0) {
          response.predictions.forEach((prediction) => {
            if (!allResults.some(r => r.includes(prediction.description))) {
              allResults.push(prediction.description)
            }
          })
        }
      }

      // Format kết quả
      let resultText = '🍽️ **Các quán ăn xung quanh bạn:**\n\n'
      if (allResults.length > 0) {
        // Giới hạn 10 quán đầu tiên
        const topResults = allResults.slice(0, 10)
        topResults.forEach((result, index) => {
          resultText += `${index + 1}. ${result}\n`
        })
        if (allResults.length > 10) {
          resultText += `\n... và ${allResults.length - 10} quán khác nữa!`
        }
        resultText += `\n\n📍 Tìm thấy ${allResults.length} quán trong bán kính 5km từ vị trí của bạn.`
      } else {
        resultText = 'Không tìm thấy quán ăn nào trong bán kính 5km. Bạn thử mở rộng phạm vi tìm kiếm nhé!'
      }

      // Xóa loading message và thêm kết quả
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== loadingId)
        const aiMsg: UiMessage = { 
          id: `${Date.now()}-ai`, 
          role: 'assistant', 
          content: resultText 
        }
        return [...filtered, aiMsg]
      })
      scrollToEnd()

    } catch (error: any) {
      console.error('Error finding nearby restaurants:', error)
      
      // Xóa loading message nếu có
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== loadingId)
        const errorMsg: UiMessage = { 
          id: `${Date.now()}-ai`, 
          role: 'assistant', 
          content: 'Xin lỗi, mình không thể tìm quán xung quanh lúc này. Bạn thử lại sau nhé!' 
        }
        return [...filtered, errorMsg]
      })
      scrollToEnd()
      
      // Hiển thị toast error
      const errorMessage = error?.message || 'Vui lòng thử lại sau.'
      if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
        Toast.show({ 
          type: 'error', 
          text1: 'Cần quyền truy cập vị trí', 
          text2: 'Vui lòng cho phép ứng dụng truy cập vị trí để tìm quán xung quanh.' 
        })
      } else {
        Toast.show({ type: 'error', text1: 'Lỗi tìm quán', text2: errorMessage })
      }
    } finally {
      setIsFindingNearby(false)
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
          {!GEMINI_API_KEY && (
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContent}
          >
            <TouchableOpacity
              style={[styles.quickActionButton, (isFindingNearby || isLocationLoading) && styles.quickActionButtonDisabled]}
              onPress={handleFindNearbyRestaurants}
              disabled={isFindingNearby || isLocationLoading}
            >
              <LinearGradient 
                colors={['#FF6B35', '#FF1493']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }} 
                style={styles.quickActionGradient}
              >
                <Ionicons 
                  name={isFindingNearby ? 'hourglass' : 'location'} 
                  size={16} 
                  color="#ffffff" 
                  style={styles.quickActionIcon}
                />
                <Text style={styles.quickActionText}>
                  {isFindingNearby ? 'Đang tìm...' : 'Tìm quán xung quanh'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('Gợi ý món ăn hôm nay')}
              disabled={isSending || isFindingNearby}
            >
              <View style={styles.quickActionButtonPlain}>
                <Ionicons name="restaurant" size={16} color="#6B7280" style={styles.quickActionIcon} />
                <Text style={styles.quickActionTextPlain}>Gợi ý món ăn</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('Tìm quán theo loại món')}
              disabled={isSending || isFindingNearby}
            >
              <View style={styles.quickActionButtonPlain}>
                <Ionicons name="search" size={16} color="#6B7280" style={styles.quickActionIcon} />
                <Text style={styles.quickActionTextPlain}>Tìm theo loại</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={GEMINI_API_KEY ? 'Nhập tin nhắn...' : 'Vui lòng cấu hình GEMINI_API_KEY trước'}
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!!GEMINI_API_KEY && !isSending && !isFindingNearby}
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

  quickActionsContainer: { backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingVertical: 10 },
  quickActionsContent: { paddingHorizontal: 12, gap: 8, alignItems: 'center' },
  quickActionButton: { borderRadius: 20, overflow: 'hidden' },
  quickActionButtonPlain: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', gap: 6 },
  quickActionGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
  quickActionIcon: { marginRight: 0 },
  quickActionText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  quickActionTextPlain: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  quickActionButtonDisabled: { opacity: 0.6 },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 8, backgroundColor: '#FFFFFF' },
  input: { flex: 1, maxHeight: 120, minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, fontSize: 15, color: '#111827', backgroundColor: '#FFFFFF' },
  sendButton: { borderRadius: 22 },
  sendButtonGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { opacity: 0.5 },
})


