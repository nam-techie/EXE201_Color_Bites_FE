import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'

interface MapControlsProps {
   onLocationPress: () => void
   onLayersPress: () => void
   onFilterPress: () => void
}

export default function MapControls({
   onLocationPress,
   onLayersPress,
   onFilterPress,
}: MapControlsProps) {
   return (
      <View className="absolute right-4 top-4 space-y-2">
         {/* Location Control */}
         <TouchableOpacity
            className="rounded-lg bg-white p-3 shadow-md active:bg-gray-50"
            onPress={onLocationPress}
         >
            <Ionicons name="locate" size={20} color="#f97316" />
         </TouchableOpacity>

         {/* Layers Control */}
         <TouchableOpacity
            className="rounded-lg bg-white p-3 shadow-md active:bg-gray-50"
            onPress={onLayersPress}
         >
            <Ionicons name="layers" size={20} color="#f97316" />
         </TouchableOpacity>

         {/* Filter Control */}
         <TouchableOpacity
            className="rounded-lg bg-white p-3 shadow-md active:bg-gray-50"
            onPress={onFilterPress}
         >
            <Ionicons name="options" size={20} color="#f97316" />
         </TouchableOpacity>
      </View>
   )
}
