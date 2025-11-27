'use client'

import { getCuisineIcon } from '@/services/MapService'
import type { Restaurant } from '@/type/location'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useEffect, useRef } from 'react'
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
   const pulseAnim = useRef(new Animated.Value(1)).current

   // Increased marker sizes: 48px (normal), 56px (selected)
   const markerSize = isSelected ? 56 : 48
   const iconSize = isSelected ? 28 : 24
   const borderWidth = isSelected ? 3 : 2
   const { name: iconName, color: iconColor } = getCuisineIcon(restaurant.tags.cuisine || '')

   // Pulse animation when selected
   useEffect(() => {
      if (isSelected) {
         const pulse = Animated.loop(
            Animated.sequence([
               Animated.timing(pulseAnim, {
                  toValue: 1.1,
                  duration: 1000,
                  useNativeDriver: true,
               }),
               Animated.timing(pulseAnim, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
               }),
            ]),
         )
         pulse.start()
         return () => pulse.stop()
      } else {
         pulseAnim.setValue(1)
      }
   }, [isSelected, pulseAnim])

   const handlePress = () => {
      Animated.sequence([
         Animated.timing(scaleAnim, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
         }),
         Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
         }),
      ]).start(() => {
         onPress(restaurant)
      })
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
                     transform: [
                        { scale: scaleAnim },
                        { scale: isSelected ? pulseAnim : new Animated.Value(1) },
                     ],
                     borderColor: isSelected ? '#3B82F6' : '#D1D5DB',
                     borderWidth: borderWidth,
                     backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                  },
               ]}
            >
               <MaterialCommunityIcons
                  name={iconName}
                  size={iconSize}
                  color={isSelected ? '#3B82F6' : iconColor}
               />

               {isInRoute && routeOrder !== undefined && (
                  <View style={[styles.routeNumber, { width: 20, height: 20, borderRadius: 10 }]}>
                     <Text style={styles.routeNumberText}>{routeOrder}</Text>
                  </View>
               )}
            </Animated.View>

            <View
               style={[
                  styles.pointer,
                  {
                     borderTopColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                     borderLeftWidth: markerSize * 0.12,
                     borderRightWidth: markerSize * 0.12,
                     borderTopWidth: markerSize * 0.15,
                  },
               ]}
            />

            {isSelected && (
               <BlurView intensity={80} style={styles.labelContainer}>
                  <Text style={styles.labelText} numberOfLines={1}>
                     {restaurant.name}
                  </Text>
               </BlurView>
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
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      marginTop: -1,
   },
   labelContainer: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginTop: 8,
      maxWidth: 160,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 6,
   },
   labelText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#111827',
      textAlign: 'center',
      letterSpacing: 0.2,
   },
   distanceContainer: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
   },
   distanceText: {
      color: '#ffffff',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.3,
   },
   routeNumber: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#fff',
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 6,
   },
   routeNumberText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '800',
   },
})
