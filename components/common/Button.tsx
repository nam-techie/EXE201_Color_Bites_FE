import {
   ActivityIndicator,
   StyleSheet,
   Text,
   TouchableOpacity,
   type TextStyle,
   type ViewStyle,
} from 'react-native'

interface ButtonProps {
   title: string
   onPress: () => void
   variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
   size?: 'small' | 'medium' | 'large'
   disabled?: boolean
   loading?: boolean
   style?: ViewStyle
   textStyle?: TextStyle
}

export default function Button({
   title,
   onPress,
   variant = 'primary',
   size = 'medium',
   disabled = false,
   loading = false,
   style,
   textStyle,
}: ButtonProps) {
   const getButtonStyle = (): ViewStyle[] => {
      const stylesArray: ViewStyle[] = [baseStyles.button]

      // Size styles
      if (size === 'small') stylesArray.push(baseStyles.small)
      else if (size === 'large') stylesArray.push(baseStyles.large)
      else stylesArray.push(baseStyles.medium)

      // Variant styles
      if (variant === 'secondary') stylesArray.push(baseStyles.secondary)
      else if (variant === 'outline') stylesArray.push(baseStyles.outline)
      else if (variant === 'ghost') stylesArray.push(baseStyles.ghost)
      else stylesArray.push(baseStyles.primary)

      if (disabled) stylesArray.push(baseStyles.disabled)

      return [...stylesArray, style || {}]
   }

   const getTextStyle = (): TextStyle[] => {
      const stylesArray: TextStyle[] = [baseStyles.text]

      // Size styles
      if (size === 'small') stylesArray.push(baseStyles.textSmall)
      else if (size === 'large') stylesArray.push(baseStyles.textLarge)
      else stylesArray.push(baseStyles.textMedium)

      // Variant styles
      if (variant === 'outline' || variant === 'ghost') {
         stylesArray.push(baseStyles.textPrimary)
      } else {
         stylesArray.push(baseStyles.textWhite)
      }

      return [...stylesArray, textStyle || {}]
   }

   return (
      <TouchableOpacity style={getButtonStyle()} onPress={onPress} disabled={disabled || loading}>
         {loading && (
            <ActivityIndicator
               size="small"
               color={variant === 'outline' || variant === 'ghost' ? '#f97316' : 'white'}
               style={{ marginRight: 8 }}
            />
         )}
         <Text style={getTextStyle()}>{title}</Text>
      </TouchableOpacity>
   )
}

const baseStyles = StyleSheet.create({
   button: {
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   small: {
      paddingVertical: 8,
      paddingHorizontal: 12,
   },
   medium: {
      paddingVertical: 12,
      paddingHorizontal: 16,
   },
   large: {
      paddingVertical: 16,
      paddingHorizontal: 24,
   },
   primary: {
      backgroundColor: '#f97316', // Replace with your primary color
   },
   secondary: {
      backgroundColor: '#6b7280', // Replace with your secondary color
   },
   outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#f97316',
   },
   ghost: {
      backgroundColor: 'transparent',
   },
   disabled: {
      opacity: 0.5,
   },
   text: {
      fontWeight: '500',
   },
   textSmall: {
      fontSize: 14,
   },
   textMedium: {
      fontSize: 16,
   },
   textLarge: {
      fontSize: 18,
   },
   textWhite: {
      color: 'white',
   },
   textPrimary: {
      color: '#3b82f6', // Same as primary color
   },
})
