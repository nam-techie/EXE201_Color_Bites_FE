import { getDefaultAvatar } from '@/constants/defaultImages'
import { postService } from '@/services/PostService'
import type { PostResponse } from '@/type'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ProfilePostsScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [posts, setPosts] = useState<PostResponse[]>([])

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await postService.getUserPosts(1, 60)
      const content = response?.content || []
      const normalized: PostResponse[] = content.map((p: any) => ({
        id: String(p.id),
        accountId: p.author?.accountId ?? p.accountId ?? '',
        authorName: p.author?.authorName ?? p.authorName ?? 'Unknown',
        authorAvatar: p.author?.authorAvatar ?? p.authorAvatar ?? null,
        content: p.content ?? '',
        moodId: p.moodId ?? '',
        moodName: p.moodName ?? '',
        moodEmoji: p.moodEmoji ?? '',
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls.filter(Boolean) : [],
        videoUrl: p.videoUrl ?? null,
        reactionCount: Number(p.reactionCount ?? 0) || 0,
        commentCount: Number(p.commentCount ?? 0) || 0,
        tags: Array.isArray(p.tags) ? p.tags : [],
        isOwner: Boolean(p.isOwner),
        hasReacted: Boolean(p.hasReacted),
        userReactionType: p.userReactionType ?? null,
        createdAt: p.createdAt ?? new Date().toISOString(),
        updatedAt: p.updatedAt ?? ''
      }))
      setPosts(normalized.filter(p => !p.imageUrls || p.imageUrls.length === 0))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bài đăng</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); load() }} tintColor="#F97316" />}>
        <View style={{ gap: 16, marginHorizontal: 16, paddingVertical: 16 }}>
          {(!isLoading && posts.length === 0) && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
              <Text style={{ marginTop: 8, color: '#9CA3AF' }}>Chưa có bài đăng</Text>
            </View>
          )}

          {posts.map((post) => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.authorAvatar || getDefaultAvatar(post.authorName) }} style={styles.avatar} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.author}>{post.authorName}</Text>
                  <Text style={styles.time}>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</Text>
                </View>
                <View style={styles.mood}><Text>{post.moodEmoji}</Text></View>
              </View>
              <Text style={styles.content}>{post.content}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.action}><Ionicons name="heart-outline" size={20} color="#6B7280" /><Text style={styles.actionText}>{post.reactionCount}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.action}><Ionicons name="chatbubble-outline" size={20} color="#6B7280" /><Text style={styles.actionText}>{post.commentCount}</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  post: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  author: { fontSize: 16, fontWeight: '600', color: '#111827' },
  time: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  mood: { backgroundColor: '#FEF3C7', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4 },
  content: { fontSize: 15, lineHeight: 22, color: '#374151', marginBottom: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 14, color: '#6B7280' },
})
