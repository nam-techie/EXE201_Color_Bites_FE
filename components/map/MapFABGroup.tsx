/**
 * MapFABGroup - Floating Action Button Group
 * 
 * Component hiển thị nhóm các button map (My Location, Layers) dạng FAB group
 * với khả năng expand/collapse để giảm clutter trên UI
 * 
 * @example
 * <MapFABGroup
 *   onMyLocationPress={() => {}}
 *   onLayersPress={() => {}}
 *   expanded={false}
 *   onToggle={() => {}}
 * />
 */

import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'

interface MapFABGroupProps {
   onMyLocationPress: () => void
   onLayersPress: () => void
   expanded: boolean
   onToggle: () => void
}

export default function MapFABGroup({
   onMyLocationPress,
   onLayersPress,
   expanded,
   onToggle,
}: MapFABGroupProps) {
   // Animation values
   const expandAnimation = useRef(new Animated.Value(0)).current
   const layersOpacity = useRef(new Animated.Value(0)).current
   const layersScale = useRef(new Animated.Value(0.8)).current

   // Animate expand/collapse
   useEffect(() => {
      Animated.parallel([
         Animated.spring(expandAnimation, {
            toValue: expanded ? 1 : 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
         }),
         Animated.timing(layersOpacity, {
            toValue: expanded ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
         }),
         Animated.spring(layersScale, {
            toValue: expanded ? 1 : 0.8,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
         }),
      ]).start()
   }, [expanded, expandAnimation, layersOpacity, layersScale])

   // Calculate layers button position (animated)
   const layersButtonTranslateY = expandAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -64], // 48 (button height) + 16 (spacing)
   })

   return (
      <View style={styles.container}>
         {/* Layers Button (expandable) */}
         {expanded && (
            <Animated.View
               style={[
                  styles.layersButtonContainer,
                  {
                     opacity: layersOpacity,
                     transform: [
                        { translateY: layersButtonTranslateY },
                        { scale: layersScale },
                     ],
                  },
               ]}
            >
               <TouchableOpacity
                  style={styles.fabButton}
                  onPress={onLayersPress}
                  activeOpacity={0.8}
               >
                  <Ionicons name="layers" size={24} color="#5F6368" />
               </TouchableOpacity>
            </Animated.View>
         )}

         {/* Main Button (My Location) */}
         <TouchableOpacity
            style={styles.mainButton}
            onPress={expanded ? onToggle : onMyLocationPress}
            activeOpacity={0.8}
         >
            <Animated.View
               style={{
                  transform: [
                     {
                        rotate: expandAnimation.interpolate({
                           inputRange: [0, 1],
                           outputRange: ['0deg', '45deg'],
                        }),
                     },
                  ],
               }}
            >
               <Ionicons
                  name={expanded ? 'close' : 'locate'}
                  size={24}
                  color={expanded ? '#EF4444' : '#5F6368'}
               />
            </Animated.View>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      bottom: 200,
      right: 16,
      alignItems: 'center',
      justifyContent: 'flex-end',
      zIndex: 10,
   },
   mainButton: {
      width: 48,
      height: 48,
      backgroundColor: '#ffffff',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
   },
   layersButtonContainer: {
      marginBottom: 16,
   },
   fabButton: {
      width: 48,
      height: 48,
      backgroundColor: '#ffffff',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 5,
   },
})

