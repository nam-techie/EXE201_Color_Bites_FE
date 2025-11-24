import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Text, TouchableOpacity, View } from 'react-native'

interface LocationListItemProps {
   location: {
      id: string
      name: string
      address: string
      posts: number
      rating: number
      image: string
      description: string
   }
   distance?: string
   onPress: () => void
}

export default function LocationListItem({
   location,
   distance = '2.3 km away',
   onPress,
}: LocationListItemProps) {
   return (
      <TouchableOpacity
         className="mb-4 rounded-lg bg-white p-4 shadow-sm active:bg-gray-50"
         onPress={onPress}
      >
         <View className="flex-row items-center">
            <Image
               source={{ uri: location.image }}
               className="mr-3 h-16 w-16 rounded-lg"
               contentFit="cover"
            />

            <View className="flex-1">
               <Text className="mb-1 font-semibold">{location.name}</Text>
               <Text className="mb-1 text-sm text-gray-600">{location.address}</Text>

               <View className="mb-1 flex-row items-center space-x-2">
                  <View className="rounded bg-gray-100 px-2 py-1">
                     <Text className="text-xs">{location.posts} posts</Text>
                  </View>
                  <View className="flex-row items-center">
                     <Ionicons name="star" size={16} color="#FCD34D" />
                     <Text className="ml-1 text-sm">{location.rating}</Text>
                  </View>
               </View>

               <Text className="mb-1 text-sm text-gray-700" numberOfLines={2}>
                  {location.description}
               </Text>

               {/* Distance */}
               <Text className="text-xs font-medium text-orange-500">📍 {distance}</Text>
            </View>

            <TouchableOpacity className="p-2">
               <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </TouchableOpacity>
         </View>
      </TouchableOpacity>
   )
}
