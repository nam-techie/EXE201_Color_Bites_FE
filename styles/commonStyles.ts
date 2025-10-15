import { StyleSheet } from 'react-native'
import { theme } from './theme'

export const commonStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  section: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  
  // Headers
  header: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  
  // Buttons
  primaryButton: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryButtonText: {
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.white,
    fontSize: theme.fontSize.md,
  },
  
  primaryButtonDisabled: {
    backgroundColor: theme.colors.secondaryLight,
    opacity: 0.7,
  },
  
  secondaryButton: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButtonText: {
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    fontSize: theme.fontSize.md,
  },
  
  // Inputs
  textInput: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
  },
  
  textInputMultiline: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    minHeight: 100,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.surface,
  },
  
  // Labels
  label: {
    marginBottom: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  
  // Loading states
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Empty states
  emptyContainer: {
    padding: theme.spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptyText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  
  emptySubtext: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Utilities
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  // Shadows
  shadowSm: {
    ...theme.shadows.sm,
  },
  
  shadowMd: {
    ...theme.shadows.md,
  },
  
  shadowLg: {
    ...theme.shadows.lg,
  },
})
