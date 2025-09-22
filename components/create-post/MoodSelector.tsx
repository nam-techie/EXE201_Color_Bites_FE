import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { commonStyles } from '@/styles/commonStyles'
import { theme } from '@/styles/theme'
import type { Mood } from '@/type'

interface MoodSelectorProps {
  moods: Mood[]
  selectedMoodId: string
  onMoodSelected: (moodId: string) => void
  isLoading: boolean
}

export function MoodSelector({ moods, selectedMoodId, onMoodSelected, isLoading }: MoodSelectorProps) {
  if (isLoading) {
    return (
      <View style={commonStyles.section}>
        <Text style={commonStyles.label}>Cảm xúc về món ăn?</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Đang tải moods...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.label}>Cảm xúc về món ăn?</Text>
      <View style={styles.moodContainer}>
        {moods.map((mood) => (
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
      </View>
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
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.md,
  },
  moodButton: {
    marginBottom: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 70,
  },
  selectedMoodButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  moodEmoji: {
    fontSize: theme.fontSize.lg,
  },
  moodName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  selectedMoodName: {
    color: theme.colors.text.white,
  },
})
