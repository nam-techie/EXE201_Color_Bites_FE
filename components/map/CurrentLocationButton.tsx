import { getCurrentLocation, type LocationData } from '@/services/LocationService'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native'

interface CurrentLocationButtonProps {
  onLocationUpdate: (location: LocationData) => void
  visible?: boolean
  style?: 'fab' | 'compact'
}

export default function CurrentLocationButton({
  onLocationUpdate,
  visible = true,
  style = 'fab'
}: CurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasLocation, setHasLocation] = useState(false)
  
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  // Pulse animation when loading
  useEffect(() => {
    if (isLoading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      )
      pulse.start()

      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      )
      rotate.start()

      return () => {
        pulse.stop()
        rotate.stop()
      }
    } else {
      pulseAnim.setValue(1)
      rotateAnim.setValue(0)
    }
  }, [isLoading])

  const handlePress = async () => {
    if (isLoading) return

    setIsLoading(true)
    
    try {
      const location = await getCurrentLocation({
        accuracy: 6, // High accuracy
        timeInterval: 1000,
      })

      if (location) {
        setHasLocation(true)
        onLocationUpdate(location)
        
        // Success animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start()
      } else {
        // Error animation
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start()
      }
    } catch (error) {
      console.error('Error getting current location:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonStyle = () => {
    if (style === 'compact') {
      return styles.compactButton
    }
    return styles.fabButton
  }

  const getIconName = () => {
    if (isLoading) return 'refresh'
    if (hasLocation) return 'locate'
    return 'locate-outline'
  }

  const getIconColor = () => {
    if (isLoading) return '#3B82F6'
    if (hasLocation) return '#10B981'
    return '#6B7280'
  }

  if (!visible) return null

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          getButtonStyle(),
          {
            transform: [
              { scale: pulseAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePress}
          disabled={isLoading}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
            <Ionicons
              name={getIconName()}
              size={style === 'compact' ? 20 : 24}
              color={getIconColor()}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang lấy vị trí...</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 200, // Above navigation panel
    right: 16,
    zIndex: 1000,
  },
  fabButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  compactButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  buttonPressed: {
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    position: 'absolute',
    top: -40,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
})
