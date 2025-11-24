import type React from 'react'
import { Platform, View, type ViewStyle } from 'react-native'

// Try to import LinearGradient, but provide fallback
let LinearGradient: any = null
try {
   if (Platform.OS !== 'web') {
      LinearGradient = require('expo-linear-gradient').LinearGradient
   }
} catch (error) {
   // LinearGradient not available
}

interface CrossPlatformGradientProps {
   colors: string[]
   start?: { x: number; y: number }
   end?: { x: number; y: number }
   children: React.ReactNode
   style?: ViewStyle
   className?: string
}

function CrossPlatformGradient({
   colors,
   start = { x: 0, y: 0 },
   end = { x: 1, y: 0 },
   children,
   style,
   className,
}: CrossPlatformGradientProps) {
   // If LinearGradient is available (native platforms)
   if (LinearGradient) {
      return (
         <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={style}
            className={className}
         >
            {children}
         </LinearGradient>
      )
   }

   // Fallback for web and other platforms
   const gradientDirection = `${start.x * 100}% ${start.y * 100}%, ${end.x * 100}% ${end.y * 100}%`
   const gradientColors = colors.join(', ')

   return (
      <View
         style={[
            {
               background: `linear-gradient(to right, ${gradientColors})`,
            } as any,
            style,
         ]}
         className={className}
      >
         {children}
      </View>
   )
}

// Set displayName for debugging
CrossPlatformGradient.displayName = 'CrossPlatformGradient'

// Export both named and default for compatibility
export { CrossPlatformGradient }
export default CrossPlatformGradient
