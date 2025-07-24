import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

interface CustomMapMarkerProps {
   posts: number
   category: 'restaurant' | 'cafe' | 'healthy' | 'fastfood'
   isSelected?: boolean
}

export default function CustomMapMarker({
   posts,
   category,
   isSelected = false,
}: CustomMapMarkerProps) {
   const getMarkerIcon = () => {
      switch (category) {
         case 'restaurant':
            return 'restaurant'
         case 'cafe':
            return 'cafe'
         case 'healthy':
            return 'leaf'
         case 'fastfood':
            return 'fast-food'
         default:
            return 'restaurant'
      }
   }

   const getMarkerColor = () => {
      switch (category) {
         case 'restaurant':
            return 'bg-orange-500'
         case 'cafe':
            return 'bg-purple-500'
         case 'healthy':
            return 'bg-green-500'
         case 'fastfood':
            return 'bg-red-500'
         default:
            return 'bg-orange-500'
      }
   }

   const getArrowColor = () => {
      switch (category) {
         case 'restaurant':
            return '#f97316'
         case 'cafe':
            return '#8b5cf6'
         case 'healthy':
            return '#10b981'
         case 'fastfood':
            return '#ef4444'
         default:
            return '#f97316'
      }
   }

   return (
      <View className="items-center">
         <View
            className={`${getMarkerColor()} relative rounded-full border-2 border-white p-2 shadow-lg ${isSelected ? 'scale-110' : ''}`}
         >
            <Ionicons name={getMarkerIcon() as any} size={isSelected ? 24 : 20} color="white" />
            {posts > 0 && (
               <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500">
                  <Text className="text-xs font-bold text-white">{posts > 99 ? '99+' : posts}</Text>
               </View>
            )}
         </View>
         {/* Arrow pointing down */}
         <View
            className="-mt-0.5 h-0 w-0"
            style={{
               borderLeftWidth: 6,
               borderRightWidth: 6,
               borderTopWidth: 8,
               borderLeftColor: 'transparent',
               borderRightColor: 'transparent',
               borderTopColor: getArrowColor(),
            }}
         />
      </View>
   )
}
