'use client'

import { getCuisineIcon } from '@/services/GoongMapService'
import type { Restaurant } from '@/type/location'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MapLibreGL from '@maplibre/maplibre-react-native'
import { useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

interface Props {
   restaurant: Restaurant
   onPress: (restaurant: Restaurant) => void
   isSelected?: boolean
   isInRoute?: boolean
   routeOrder?: number
   showDistance?: boolean
   distance?: string
}

export default function CustomMarker({
   restaurant,
   onPress,
   isSelected = false,
   isInRoute = false,
   routeOrder,
   showDistance = false,
   distance,
}: Props) {
   const scaleAnim = useRef(new Animated.Value(1)).current

   const markerSize = isSelected ? 44 : 38
   const { name: iconName, color: iconColor } = getCuisineIcon(restaurant.tags.cuisine || '')

   const handlePress = () => {
      Animated.sequence([
         Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
         }),
         Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
         }),
      ]).start(() => {
         onPress(restaurant)
      })
   }

   return (
      <View style={styles.container}>
         {showDistance && distance && (
            <View style={styles.distanceContainer}>
               <Text style={styles.distanceText}>{distance}</Text>
            </View>
         )}

         <Animated.View
            style={[
               styles.markerBase,
               {
                  width: markerSize,
                  height: markerSize,
                  borderRadius: markerSize / 2,
                  transform: [{ scale: scaleAnim }],
                  borderColor: isSelected ? '#2563EB' : '#D1D5DB',
                  borderWidth: isSelected ? 2 : 1,
               },
            ]}
         >
            <MaterialCommunityIcons
               name={iconName}
               size={isSelected ? 24 : 20}
               color={isSelected ? '#2563EB' : iconColor}
            />

            {isInRoute && routeOrder !== undefined && (
               <View style={styles.routeNumber}>
                  <Text style={styles.routeNumberText}>{routeOrder}</Text>
               </View>
            )}
         </Animated.View>

         <View style={styles.pointer} />

         {isSelected && (
            <View style={styles.labelContainer}>
               <Text style={styles.labelText} numberOfLines={1}>
                  {restaurant.name}
               </Text>
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   markerBase: {
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
   },
   pointer: {
      width: 0,
      height: 0,
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 8,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#ffffff',
   },
   labelContainer: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 6,
      maxWidth: 140,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 4,
   },
   labelText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#111827',
      textAlign: 'center',
   },
   distanceContainer: {
      backgroundColor: 'rgba(0,0,0,0.75)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      marginBottom: 4,
   },
   distanceText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: '600',
   },
   routeNumber: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: '#2563EB',
      borderRadius: 10,
      width: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#fff',
   },
   routeNumberText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '700',
   },
})
