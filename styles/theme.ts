export const theme = {
  colors: {
    primary: '#F97316',
    primaryLight: '#FED7AA',
    primaryDark: '#EA580C',
    
    secondary: '#6B7280',
    secondaryLight: '#9CA3AF',
    secondaryDark: '#374151',
    
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceLight: '#F3F4F6',
    
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      placeholder: '#9CA3AF',
      white: '#FFFFFF',
    },
    
    border: {
      light: '#E5E7EB',
      medium: '#D1D5DB',
      dark: '#9CA3AF',
    },
    
    status: {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
    
    gradient: {
      primary: ['#fb923c', '#ec4899', '#8b5cf6'],
      secondary: ['#F97316', '#EA580C'],
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
} as const

export type Theme = typeof theme
