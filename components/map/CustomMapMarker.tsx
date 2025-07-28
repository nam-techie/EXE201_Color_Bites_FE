"use client"

import { getCuisineIcon } from "@/services/MapService"
import type { Restaurant } from "@/type/location"
import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, Text, View } from "react-native"
import { Marker } from "react-native-maps"

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
  const [isPressed, setIsPressed] = useState(false)

  const isVegetarian = restaurant.tags["diet:vegetarian"] === "yes" || restaurant.tags["diet:vegetarian"] === "only"
  const isVegan = restaurant.tags["diet:vegan"] === "yes" || restaurant.tags["diet:vegan"] === "only"
  const hasDelivery = restaurant.tags.delivery === "yes"
  const hasTakeaway = restaurant.tags.takeaway === "yes"

  // Determine marker color based on dietary preferences and status
  const getMarkerColor = () => {
    if (isSelected) return "#3B82F6" // Blue for selected
    if (isInRoute) return "#8B5CF6" // Purple for route items
    if (isVegan) return "#059669" // Emerald for vegan
    if (isVegetarian) return "#10B981" // Green for vegetarian
    return "#EF4444" // Red for regular
  }

  // Pulse animation for selected markers
  useEffect(() => {
    if (isSelected) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
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
    setIsPressed(true)

    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsPressed(false)
      onPress(restaurant)
    })
  }

  const markerSize = isSelected ? 48 : isInRoute ? 44 : 40
  const cuisineIcon = getCuisineIcon(restaurant.tags.cuisine || "")

  return (
    <Marker
      coordinate={{ latitude: restaurant.lat, longitude: restaurant.lon }}
      onPress={handlePress}
      anchor={{ x: 0.5, y: 1 }}
      centerOffset={{ x: 0, y: -markerSize / 2 }}
    >
      <View style={styles.markerWrapper}>
        {/* Distance label */}
        {showDistance && distance && (
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        )}

        {/* Main marker container */}
        <Animated.View
          style={[
            styles.markerContainer,
            {
              backgroundColor: getMarkerColor(),
              width: markerSize,
              height: markerSize,
              borderRadius: markerSize / 2,
              transform: [{ scale: scaleAnim }, ...(isSelected ? [{ scale: pulseAnim }] : [])],
            },
          ]}
        >
          {/* Route order number */}
          {isInRoute && routeOrder !== undefined && (
            <View style={styles.routeNumberContainer}>
              <Text style={styles.routeNumberText}>{routeOrder}</Text>
            </View>
          )}

          {/* Cuisine icon */}
          <Text style={[styles.markerText, { fontSize: markerSize * 0.4 }]}>{cuisineIcon}</Text>

          {/* Status indicators */}
          <View style={styles.statusIndicators}>
            {isVegan && <View style={[styles.statusDot, styles.veganDot]} />}
            {isVegetarian && !isVegan && <View style={[styles.statusDot, styles.vegetarianDot]} />}
            {hasDelivery && <View style={[styles.statusDot, styles.deliveryDot]} />}
            {hasTakeaway && <View style={[styles.statusDot, styles.takeawayDot]} />}
          </View>
        </Animated.View>

        {/* Selection ring */}
        {isSelected && (
          <Animated.View
            style={[
              styles.selectionRing,
              {
                width: markerSize + 12,
                height: markerSize + 12,
                borderRadius: (markerSize + 12) / 2,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}

        {/* Restaurant name label */}
        {isSelected && (
          <View style={styles.nameContainer}>
            <Text style={styles.nameText} numberOfLines={1}>
              {restaurant.name}
            </Text>
            {restaurant.tags.cuisine && (
              <Text style={styles.cuisineText} numberOfLines={1}>
                {restaurant.tags.cuisine}
              </Text>
            )}
          </View>
        )}

        {/* Marker shadow */}
        <View
          style={[
            styles.markerShadow,
            {
              width: markerSize * 0.6,
              height: markerSize * 0.2,
              borderRadius: markerSize * 0.3,
            },
          ]}
        />
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  markerText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  routeNumberContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  routeNumberText: {
    color: "#3B82F6",
    fontSize: 10,
    fontWeight: "700",
  },
  statusIndicators: {
    position: "absolute",
    bottom: -2,
    right: -2,
    flexDirection: "row",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 1,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  veganDot: {
    backgroundColor: "#059669",
  },
  vegetarianDot: {
    backgroundColor: "#10B981",
  },
  deliveryDot: {
    backgroundColor: "#F59E0B",
  },
  takeawayDot: {
    backgroundColor: "#8B5CF6",
  },
  selectionRing: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#3B82F6",
    backgroundColor: "transparent",
    opacity: 0.6,
  },
  distanceContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  distanceText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  nameContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    maxWidth: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nameText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cuisineText: {
    color: "#6B7280",
    fontSize: 10,
    textAlign: "center",
    marginTop: 1,
  },
  markerShadow: {
    position: "absolute",
    bottom: -4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: -1,
  },
})
