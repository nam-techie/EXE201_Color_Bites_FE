import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { commonStyles } from '@/styles/commonStyles'
import { theme } from '@/styles/theme'

interface PrivacyToggleProps {
  isPrivate: boolean
  onToggle: (isPrivate: boolean) => void
}

export function PrivacyToggle({ isPrivate, onToggle }: PrivacyToggleProps) {
  return (
    <View style={commonStyles.section}>
      <View style={commonStyles.flexRowBetween}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bài viết riêng tư</Text>
          <Text style={styles.subtitle}>Chỉ bạn bè có thể xem</Text>
        </View>
        <TouchableOpacity
          onPress={() => onToggle(!isPrivate)}
          style={styles.toggleContainer}
        >
          <View style={[styles.toggleTrack, isPrivate && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  toggleContainer: {
    marginLeft: theme.spacing.lg,
  },
  toggleTrack: {
    height: 24,
    width: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.border.medium,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: theme.colors.primary,
  },
  toggleThumb: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
})
