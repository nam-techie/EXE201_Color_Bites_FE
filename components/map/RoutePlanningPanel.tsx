import type { Restaurant } from '@/type/location'
import { formatDistance, formatDuration } from '@/utils/movementUtils'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface RouteStop {
   restaurant: Restaurant
   distance?: number
   duration?: number
   totalDistance?: number
   totalDuration?: number
}

interface RoutePlanningPanelProps {
   routeStops: RouteStop[]
   onRemoveStop: (index: number) => void
   onClearRoute: () => void
   onOptimizeRoute: () => void
   visible: boolean
   selectedProfile: string
}

export default function RoutePlanningPanel({
   routeStops,
   onRemoveStop,
   onClearRoute,
   onOptimizeRoute,
   visible,
   selectedProfile,
}: RoutePlanningPanelProps) {
   if (!visible) return null

   const totalDistance = routeStops.reduce((sum, stop) => sum + (stop.totalDistance || 0), 0)
   const totalDuration = routeStops.reduce((sum, stop) => sum + (stop.totalDuration || 0), 0)

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.title}>Lộ trình ({routeStops.length} điểm)</Text>
            <View style={styles.headerButtons}>
               <TouchableOpacity onPress={onOptimizeRoute} style={styles.optimizeButton}>
                  <Ionicons name="shuffle" size={16} color="#3B82F6" />
                  <Text style={styles.optimizeText}>Tối ưu</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={onClearRoute} style={styles.clearButton}>
                  <Ionicons name="trash" size={16} color="#EF4444" />
               </TouchableOpacity>
            </View>
         </View>

         {totalDistance > 0 && (
            <View style={styles.summaryContainer}>
               <Text style={styles.summaryText}>
                  Tổng: {formatDistance(totalDistance)} • {formatDuration(totalDuration)}
               </Text>
            </View>
         )}

         <ScrollView style={styles.stopsContainer} showsVerticalScrollIndicator={false}>
            {routeStops.map((stop, index) => (
               <View key={`${stop.restaurant.id}-${index}`} style={styles.stopItem}>
                  <View style={styles.stopNumber}>
                     <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>

                  <View style={styles.stopInfo}>
                     <Text style={styles.stopName} numberOfLines={1}>
                        {stop.restaurant.name}
                     </Text>
                     <Text style={styles.stopAddress} numberOfLines={1}>
                        {stop.restaurant.tags.cuisine || 'Nhà hàng'}
                     </Text>
                     {typeof stop.distance === 'number' && typeof stop.duration === 'number' && (
                        <Text style={styles.routeInfo}>
                           {formatDistance(stop.distance)} • {formatDuration(stop.duration)}
                        </Text>
                     )}
                  </View>

                  <TouchableOpacity onPress={() => onRemoveStop(index)} style={styles.removeButton}>
                     <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
               </View>
            ))}
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      backgroundColor: 'white',
      borderRadius: 12,
      maxHeight: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
   },
   headerButtons: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   optimizeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
   },
   optimizeText: {
      marginLeft: 4,
      fontSize: 12,
      color: '#3B82F6',
      fontWeight: '500',
   },
   clearButton: {
      padding: 4,
   },
   summaryContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#F9FAFB',
   },
   summaryText: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
   },
   stopsContainer: {
      maxHeight: 200,
   },
   stopItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   stopNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
   },
   stopNumberText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
   },
   stopInfo: {
      flex: 1,
   },
   stopName: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
   },
   stopAddress: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 2,
   },
   routeInfo: {
      fontSize: 11,
      color: '#3B82F6',
      marginTop: 2,
   },
   removeButton: {
      padding: 4,
   },
})
