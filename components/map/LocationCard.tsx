import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { Text, TouchableOpacity, View } from 'react-native'

interface LocationCardProps {
   location: {
      id: string
      name: string
      address: string
      posts: number
      rating: number
      image: string
      description: string
   }
   onClose: () => void
   onDirections: () => void
   onCall: () => void
   onSave: () => void
}

export default function LocationCard({
   location,
   onClose,
   onDirections,
   onCall,
   onSave,
}: LocationCardProps) {
   return (
      <View className="absolute bottom-4 left-4 right-4">
         <View className="relative rounded-xl bg-white p-4 shadow-lg">
            <TouchableOpacity
               className="absolute right-3 top-3 z-10 rounded-full bg-gray-100 p-1 active:bg-gray-200"
               onPress={onClose}
            >
               <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            <View className="flex-row items-start">
               <View className="flex-1 pr-3">
                  <Text className="mb-1 text-lg font-semibold">{location.name}</Text>
                  <Text className="mb-2 text-sm text-gray-600">{location.address}</Text>

                  <View className="mb-2 flex-row items-center space-x-2">
                     <View className="rounded bg-gray-100 px-2 py-1">
                        <Text className="text-xs">{location.posts} posts</Text>
                     </View>
                     <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color="#FCD34D" />
                        <Text className="ml-1 text-sm">{location.rating}</Text>
                     </View>
                  </View>

                  <Text className="mb-3 text-sm text-gray-700">{location.description}</Text>

                  {/* Action Buttons */}
                  <View className="flex-row justify-around">
                     <TouchableOpacity
                        className="flex-row items-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 active:bg-orange-100"
                        onPress={onDirections}
                     >
                        <Ionicons name="navigate" size={16} color="#f97316" />
                        <Text className="ml-1 text-xs font-medium text-orange-600">Directions</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        className="flex-row items-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 active:bg-orange-100"
                        onPress={onCall}
                     >
                        <Ionicons name="call" size={16} color="#f97316" />
                        <Text className="ml-1 text-xs font-medium text-orange-600">Call</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        className="flex-row items-center rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 active:bg-orange-100"
                        onPress={onSave}
                     >
                        <Ionicons name="bookmark-outline" size={16} color="#f97316" />
                        <Text className="ml-1 text-xs font-medium text-orange-600">Save</Text>
                     </TouchableOpacity>
                  </View>
               </View>

               <Image
                  source={{ uri: location.image }}
                  className="h-20 w-20 rounded-lg"
                  contentFit="cover"
               />
            </View>
         </View>
      </View>
   )
}
