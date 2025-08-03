'use client'

import { getCuisineIcon } from '@/services/MapService'
import type { Restaurant } from '@/type/location'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { Marker } from 'react-native-maps'

interface Props {
   restaurant: Restaurant
   onPress: (restaurant: Restaurant) => void
   isSelected?: boolean
   isInRoute?: boolean
   routeOrder?: number
   showDistance?: boolean
   distance?: string
}

export default function CustomMapMarker({
   restaurant,
   onPress,
   isSelected = false,
   isInRoute = false,
   routeOrder,
   showDistance = false,
   distance,
}: Props) {
   const scaleAnim = useRef(new Animated.Value(1)).current

   const markerSize = isSelected ? 48 : 40
   const { name: iconName, color: iconColor, iconFamily } = getCuisineIcon(restaurant.tags.cuisine || '')

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

   const renderIcon = () => {
      const iconSize = isSelected ? 26 : 22
      const props = {
         name: iconName,
         size: iconSize,
         color: isSelected ? '#2563EB' : iconColor,
      }

      if (iconFamily === 'Ionicons') {
         return <Ionicons {...props} />
      }
      return <MaterialCommunityIcons {...props} />
   }

   return (
      <Marker
         coordinate={{ latitude: restaurant.lat, longitude: restaurant.lon }}
         onPress={handlePress}
         anchor={{ x: 0.5, y: 1 }}
         centerOffset={{ x: 0, y: -markerSize / 2 }}
      >
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
                     borderColor: isSelected ? '#2563EB' : '#E5E7EB',
                     borderWidth: isSelected ? 3 : 2,
                     backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                  },
               ]}
            >
               {renderIcon()}

               {isInRoute && routeOrder !== undefined && (
                  <View style={styles.routeNumber}>
                     <Text style={styles.routeNumberText}>{routeOrder}</Text>
                  </View>
               )}
            </Animated.View>

            <View style={[styles.pointer, { borderTopColor: isSelected ? '#EFF6FF' : '#FFFFFF' }]} />

            {isSelected && (
               <View style={styles.labelContainer}>
                  <Text style={styles.labelText} numberOfLines={1}>
                     {restaurant.name}
                  </Text>
               </View>
            )}
         </View>
      </Marker>
   )
}

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   markerBase: {
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 8,
   },
   pointer: {
      width: 0,
      height: 0,
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderTopWidth: 10,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 4,
   },
   labelContainer: {
      backgroundColor: 'rgba(255,255,255,0.98)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 8,
      maxWidth: 160,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 6,
      borderWidth: 1,
      borderColor: '#E5E7EB',
   },
   labelText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#111827',
      textAlign: 'center',
   },
   distanceContainer: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
   },
   distanceText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '700',
   },
   routeNumber: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: '#2563EB',
      borderRadius: 12,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
   },
   routeNumberText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '800',
   },
})
