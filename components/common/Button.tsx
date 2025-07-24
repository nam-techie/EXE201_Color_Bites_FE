import {
   ActivityIndicator,
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
   const getButtonStyle = (): string => {
      let baseStyle = 'rounded-lg items-center justify-center flex-row'

      // Size styles
      switch (size) {
         case 'small':
            baseStyle += ' px-3 py-2'
            break
         case 'large':
            baseStyle += ' px-6 py-4'
            break
         default:
            baseStyle += ' px-4 py-3'
      }

      // Variant styles
      switch (variant) {
         case 'secondary':
            baseStyle += ' bg-secondary-500'
            break
         case 'outline':
            baseStyle += ' border border-primary-500 bg-transparent'
            break
         case 'ghost':
            baseStyle += ' bg-transparent'
            break
         default:
            baseStyle += ' bg-primary-500'
      }

      if (disabled) {
         baseStyle += ' opacity-50'
      }

      return baseStyle
   }

   const getTextStyle = (): string => {
      let baseStyle = 'font-medium'

      // Size styles
      switch (size) {
         case 'small':
            baseStyle += ' text-sm'
            break
         case 'large':
            baseStyle += ' text-lg'
            break
         default:
            baseStyle += ' text-base'
      }

      // Variant styles
      switch (variant) {
         case 'outline':
            baseStyle += ' text-primary-500'
            break
         case 'ghost':
            baseStyle += ' text-primary-500'
            break
         default:
            baseStyle += ' text-white'
      }

      return baseStyle
   }

   return (
      <TouchableOpacity
         className={getButtonStyle()}
         onPress={onPress}
         disabled={disabled || loading}
         style={style}
      >
         {loading && (
            <ActivityIndicator
               size="small"
               color={variant === 'outline' || variant === 'ghost' ? '#f97316' : 'white'}
               style={{ marginRight: 8 }}
            />
         )}
         <Text className={getTextStyle()} style={textStyle}>
            {title}
         </Text>
      </TouchableOpacity>
   )
}
