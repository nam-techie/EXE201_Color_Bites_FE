import { commonStyles } from '@/styles/commonStyles'
import { theme } from '@/styles/theme'
import type { Mood } from '@/type'
import React, { useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface MoodSelectorProps {
  moods: Mood[]
  selectedMoodId: string
  onMoodSelected: (moodId: string) => void
  isLoading: boolean
}

export function MoodSelector({ moods, selectedMoodId, onMoodSelected, isLoading }: MoodSelectorProps) {
  const [showAll, setShowAll] = useState(false)
  
  if (isLoading) {
    return (
      <View style={commonStyles.section}>
        <Text style={commonStyles.label}>Cảm xúc về món ăn?</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Đang tải danh sách cảm xúc...</Text>
        </View>
      </View>
    )
  }

  if (!moods || moods.length === 0) {
    return (
      <View style={commonStyles.section}>
        <Text style={commonStyles.label}>Cảm xúc về món ăn?</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>❌ Không thể tải danh sách cảm xúc</Text>
          <Text style={styles.errorSubText}>Vui lòng kiểm tra kết nối mạng</Text>
        </View>
      </View>
    )
  }

  // Hiển thị tối đa 8 moods đầu tiên, có nút "Xem thêm"
  const displayMoods = showAll ? moods : moods.slice(0, 8)
  const hasMore = moods.length > 8

  return (
    <View style={commonStyles.section}>
      <View style={styles.headerContainer}>
        <Text style={commonStyles.label}>Cảm xúc về món ăn?</Text>
        <Text style={styles.countText}>({moods.length} cảm xúc)</Text>
      </View>
      
      {/* Horizontal scrollable mood list */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {(displayMoods || []).map((mood) => (
          <TouchableOpacity
            key={mood.id}
            onPress={() => onMoodSelected(mood.id)}
            style={[
              styles.moodButton,
              selectedMoodId === mood.id && styles.selectedMoodButton,
            ]}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[
              styles.moodName,
              selectedMoodId === mood.id && styles.selectedMoodName,
            ]}>
              {mood.name}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Nút xem thêm */}
        {hasMore && !showAll && (
          <TouchableOpacity
            onPress={() => setShowAll(true)}
            style={styles.moreButton}
          >
            <Text style={styles.moreText}>+{moods.length - 8}</Text>
            <Text style={styles.moreSubText}>Xem thêm</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      
      {/* Collapse button khi đã mở rộng */}
      {showAll && hasMore && (
        <TouchableOpacity
          onPress={() => setShowAll(false)}
          style={styles.collapseButton}
        >
          <Text style={styles.collapseText}>Thu gọn</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...commonStyles.flexRow,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    marginTop: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorSubText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  countText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  scrollContainer: {
    marginTop: theme.spacing.sm,
  },
  scrollContent: {
    paddingRight: theme.spacing.md,
  },
  moodButton: {
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    maxWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMoodButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
  },
  moodEmoji: {
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  moodName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedMoodName: {
    color: theme.colors.text.white,
    fontWeight: '600',
  },
  moreButton: {
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    borderStyle: 'dashed',
  },
  moreText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  moreSubText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  collapseButton: {
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  collapseText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
})
