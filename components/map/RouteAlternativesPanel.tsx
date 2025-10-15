import {
   calculateEstimatedCost,
   type DirectionResult,
   formatDistance,
   formatDuration,
} from '@/utils/movementUtils'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface RouteAlternativesPanelProps {
   alternatives: DirectionResult[]
   selectedIndex: number
   onSelectAlternative: (index: number) => void
   visible: boolean
   profile: string
}

export default function RouteAlternativesPanel({
   alternatives,
   selectedIndex,
   onSelectAlternative,
   visible,
   profile,
}: RouteAlternativesPanelProps) {
   if (!visible || (alternatives || []).length === 0) return null

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.title}>Lựa chọn đường đi ({(alternatives || []).length} tuyến)</Text>
         </View>

         <ScrollView style={styles.alternativesContainer} showsVerticalScrollIndicator={false}>
            {(alternatives || []).map((alternative, index) => {
               const isSelected = index === selectedIndex
               const estimatedCost = calculateEstimatedCost(alternative.distance, profile)

               return (
                  <TouchableOpacity
                     key={index}
                     style={[styles.alternativeItem, isSelected && styles.selectedAlternative]}
                     onPress={() => onSelectAlternative(index)}
                  >
                     <View style={styles.alternativeHeader}>
                        <View style={styles.routeNumber}>
                           <Text
                              style={[
                                 styles.routeNumberText,
                                 isSelected && styles.selectedRouteNumberText,
                              ]}
                           >
                              {index + 1}
                           </Text>
                        </View>
                        <View style={styles.routeInfo}>
                           <Text
                              style={[styles.routeTitle, isSelected && styles.selectedRouteTitle]}
                           >
                              Tuyến đường {index + 1}
                           </Text>
                           <View style={styles.routeStats}>
                              <View style={styles.statItem}>
                                 <Ionicons
                                    name="location"
                                    size={12}
                                    color={isSelected ? '#3B82F6' : '#6B7280'}
                                 />
                                 <Text
                                    style={[styles.statText, isSelected && styles.selectedStatText]}
                                 >
                                    {formatDistance(alternative.distance)}
                                 </Text>
                              </View>
                              <View style={styles.statItem}>
                                 <Ionicons
                                    name="time"
                                    size={12}
                                    color={isSelected ? '#3B82F6' : '#6B7280'}
                                 />
                                 <Text
                                    style={[styles.statText, isSelected && styles.selectedStatText]}
                                 >
                                    {formatDuration(alternative.duration)}
                                 </Text>
                              </View>
                              {estimatedCost > 0 && (
                                 <View style={styles.statItem}>
                                    <Ionicons
                                       name="card"
                                       size={12}
                                       color={isSelected ? '#3B82F6' : '#6B7280'}
                                    />
                                    <Text
                                       style={[
                                          styles.statText,
                                          isSelected && styles.selectedStatText,
                                       ]}
                                    >
                                       ~{estimatedCost.toLocaleString()}đ
                                    </Text>
                                 </View>
                              )}
                           </View>
                        </View>
                        {isSelected && (
                           <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                        )}
                     </View>
                  </TouchableOpacity>
               )
            })}
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      top: 200,
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
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      textAlign: 'center',
   },
   alternativesContainer: {
      maxHeight: 200,
   },
   alternativeItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   selectedAlternative: {
      backgroundColor: '#EBF4FF',
   },
   alternativeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   routeNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
   },
   routeNumberText: {
      color: '#6B7280',
      fontSize: 12,
      fontWeight: '600',
   },
   selectedRouteNumberText: {
      color: '#3B82F6',
   },
   routeInfo: {
      flex: 1,
   },
   routeTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#374151',
      marginBottom: 4,
   },
   selectedRouteTitle: {
      color: '#3B82F6',
   },
   routeStats: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
   },
   statText: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
   },
   selectedStatText: {
      color: '#3B82F6',
   },
})
