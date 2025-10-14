import { postService } from '@/services/PostService'
import type { PostResponse } from '@/type'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from 'react'
import { Dimensions, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const { width } = Dimensions.get('window')

export default function ProfileImagesScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [posts, setPosts] = useState<PostResponse[]>([])

  const load = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await postService.getUserPosts(1, 60)
      const content = response?.content || []
      const normalized: PostResponse[] = content.map((p: any) => {
        // Chuẩn hóa createdAt
        let createdAt: string = p.createdAt
        if (Array.isArray(p.createdAt)) {
          const [y, m, d, hh = 0, mm = 0, ss = 0] = p.createdAt
          createdAt = new Date(y, (m ?? 1) - 1, d, hh, mm, ss).toISOString()
        } else if (p.createdAt && typeof p.createdAt === 'object' && p.createdAt.year) {
          const { year, month, day, hour = 0, minute = 0, second = 0 } = p.createdAt
          createdAt = new Date(year, month - 1, day, hour, minute, second).toISOString()
        } else if (!p.createdAt) {
          createdAt = new Date().toISOString()
        }

        // Parse danh sách ảnh (trường hợp là JSON string {"url":...})
        let parsedImageUrls: string[] = []
        if (Array.isArray(p.imageUrls)) {
          parsedImageUrls = p.imageUrls
            .map((item: any) => {
              try {
                if (typeof item === 'string' && item.includes('{"url":')) {
                  const parsed = JSON.parse(item)
                  return parsed.url
                }
                return typeof item === 'string' ? item : null
              } catch {
                return null
              }
            })
            .filter((url: string | null) => url && url.trim()) as string[]
        }

        return {
          id: String(p.id),
          accountId: p.author?.accountId ?? p.accountId ?? '',
          authorName: p.author?.authorName ?? p.authorName ?? 'Unknown',
          authorAvatar: p.author?.authorAvatar ?? p.authorAvatar ?? null,
          content: p.content ?? '',
          moodId: p.moodId ?? '',
          moodName: p.moodName ?? '',
          moodEmoji: p.moodEmoji ?? '',
          imageUrls: parsedImageUrls,
          videoUrl: p.videoUrl ?? null,
          reactionCount: Number(p.reactionCount ?? 0) || 0,
          commentCount: Number(p.commentCount ?? 0) || 0,
          tags: Array.isArray(p.tags) ? p.tags : [],
          isOwner: Boolean(p.isOwner),
          hasReacted: Boolean(p.hasReacted),
          userReactionType: p.userReactionType ?? null,
          createdAt,
          updatedAt: p.updatedAt ?? ''
        } as PostResponse
      })
      setPosts(normalized.filter(p => p.imageUrls && p.imageUrls.length > 0))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const size = (width - 32 - 4) / 3

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hình ảnh</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ gap: 2 }}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        initialNumToRender={18}
        maxToRenderPerBatch={24}
        windowSize={6}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews
        getItemLayout={(_, index) => ({ length: size + 2, offset: (size + 2) * Math.ceil((index + 1) / 3), index })}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => { setIsRefreshing(true); load() }} tintColor="#F97316" />}
        renderItem={({ item, index }) => {
          const columnIndex = index % 3
          return (
            <TouchableOpacity activeOpacity={0.85} style={{ width: size, aspectRatio: 1, marginLeft: columnIndex === 0 ? 0 : 2 }}>
              <Image 
                source={{ uri: item.imageUrls[0] || `https://picsum.photos/seed/p-${item.id}/400/400` }} 
                style={{ width: '100%', height: '100%', borderRadius: 4 }} 
                contentFit="cover" 
                cachePolicy="memory-disk"
                priority="low"
                placeholder={require('../assets/images/splash-icon.png')}
              />
              {item.imageUrls.length > 1 && (
                <View style={styles.multipleImagesIndicator}>
                  <Ionicons name="copy-outline" size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={!isLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Ionicons name="images-outline" size={48} color="#9CA3AF" />
            <Text style={{ marginTop: 8, color: '#9CA3AF' }}>Chưa có hình ảnh</Text>
          </View>
        ) : null}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  multipleImagesIndicator: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 4 },
})
