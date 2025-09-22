import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { commonStyles } from '@/styles/commonStyles'
import { theme } from '@/styles/theme'

interface HashtagSelectorProps {
  selectedHashtags: string[]
  suggestedHashtags: string[]
  onAddHashtag: (hashtag: string) => void
  onRemoveHashtag: (hashtag: string) => void
}

export function HashtagSelector({ 
  selectedHashtags, 
  suggestedHashtags, 
  onAddHashtag, 
  onRemoveHashtag 
}: HashtagSelectorProps) {
  return (
    <View style={commonStyles.section}>
      <Text style={commonStyles.label}>Hashtags</Text>

      {/* Selected Hashtags */}
      {selectedHashtags.length > 0 && (
        <View style={styles.selectedHashtagsContainer}>
          {selectedHashtags.map((tag) => (
            <View key={tag} style={styles.selectedHashtag}>
              <Text style={styles.selectedHashtagText}>{tag}</Text>
              <TouchableOpacity
                onPress={() => onRemoveHashtag(tag)}
                style={styles.removeHashtagButton}
              >
                <Ionicons name="close" size={12} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Suggested Hashtags */}
      <Text style={styles.suggestedLabel}>Gợi ý:</Text>
      <View style={styles.suggestedHashtagsContainer}>
        {suggestedHashtags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => onAddHashtag(tag)}
            disabled={selectedHashtags.includes(tag)}
            style={[
              styles.suggestedHashtag,
              selectedHashtags.includes(tag) && styles.disabledHashtag,
            ]}
          >
            <Text style={styles.suggestedHashtagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  selectedHashtagsContainer: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedHashtag: {
    marginBottom: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  selectedHashtagText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
  },
  removeHashtagButton: {
    marginLeft: theme.spacing.xs,
  },
  suggestedLabel: {
    marginBottom: theme.spacing.sm,
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  suggestedHashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestedHashtag: {
    marginBottom: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  disabledHashtag: {
    backgroundColor: theme.colors.surfaceLight,
    opacity: 0.5,
  },
  suggestedHashtagText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.primary,
  },
})
