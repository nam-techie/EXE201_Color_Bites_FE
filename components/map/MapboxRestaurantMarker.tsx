import { getCuisineIcon, getPriceRange, getRestaurantRating } from '@/services/GoongMapService'
import type { Restaurant } from '@/type/location'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef } from 'react'
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native'

interface MapboxRestaurantMarkerProps {
  restaurant: Restaurant
  isSelected?: boolean
  onPress: (restaurant: Restaurant) => void
  size?: 'small' | 'medium' | 'large'
}

export default function MapboxRestaurantMarker({
  restaurant,
  isSelected = false,
  onPress,
  size = 'medium'
}: MapboxRestaurantMarkerProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const bounceAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isSelected) {
      // Selection animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()

      // Pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      )
      pulse.start()

      // Bounce animation
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isSelected])

  const handlePress = () => {
    // Press animation
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
    ]).start()

    onPress(restaurant)
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: styles.smallContainer,
          icon: styles.smallIcon,
          text: styles.smallText,
        }
      case 'large':
        return {
          container: styles.largeContainer,
          icon: styles.largeIcon,
          text: styles.largeText,
        }
      default:
        return {
          container: styles.mediumContainer,
          icon: styles.mediumIcon,
          text: styles.mediumText,
        }
    }
  }

  const sizeStyles = getSizeStyles()
  const cuisineIcon = getCuisineIcon(restaurant.tags?.cuisine || 'default')
  const rating = getRestaurantRating(restaurant.tags)
  const priceRange = getPriceRange(restaurant.tags)

  return (
    <Animated.View
      style={[
        styles.markerContainer,
        {
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim },
            {
              translateY: bounceAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5],
              }),
            },
          ],
        },
      ]}
    >
      {/* Pulse ring for selected marker */}
      {isSelected && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}

      {/* Main marker */}
      <Pressable
        style={[
          sizeStyles.container,
          isSelected && styles.selectedMarker,
        ]}
        onPress={handlePress}
      >
        {/* Cuisine icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={cuisineIcon.name as any}
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color={cuisineIcon.color}
          />
        </View>

        {/* Restaurant info */}
        <View style={styles.infoContainer}>
          <Text style={[sizeStyles.text, styles.restaurantName]} numberOfLines={1}>
            {restaurant.name}
          </Text>
          
          {rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            </View>
          )}
          
          {priceRange && (
            <Text style={styles.priceText}>{priceRange}</Text>
          )}
        </View>

        {/* Selection indicator */}
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
      </Pressable>

      {/* Marker pin */}
      <View style={[
        styles.markerPin,
        isSelected && styles.selectedPin,
      ]} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  smallContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 60,
    alignItems: 'center',
  },
  mediumContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  largeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedMarker: {
    backgroundColor: '#EBF4FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  iconContainer: {
    marginBottom: 4,
  },
  smallIcon: {
    fontSize: 16,
  },
  mediumIcon: {
    fontSize: 20,
  },
  largeIcon: {
    fontSize: 24,
  },
  infoContainer: {
    alignItems: 'center',
  },
  smallText: {
    fontSize: 10,
    fontWeight: '500',
  },
  mediumText: {
    fontSize: 12,
    fontWeight: '500',
  },
  largeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  restaurantName: {
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#F59E0B',
    marginLeft: 2,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerPin: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
    marginTop: -1,
  },
  selectedPin: {
    borderTopColor: '#3B82F6',
  },
})
