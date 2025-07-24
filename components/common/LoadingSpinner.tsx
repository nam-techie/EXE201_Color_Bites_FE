import { ActivityIndicator, View } from 'react-native'

interface LoadingSpinnerProps {
   size?: 'small' | 'large'
   color?: string
   fullScreen?: boolean
}

export default function LoadingSpinner({
   size = 'large',
   color = '#f97316',
   fullScreen = false,
}: LoadingSpinnerProps) {
   if (fullScreen) {
      return (
         <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size={size} color={color} />
         </View>
      )
   }

   return (
      <View className="items-center justify-center py-4">
         <ActivityIndicator size={size} color={color} />
      </View>
   )
}
