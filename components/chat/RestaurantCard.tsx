import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface RestaurantCardProps {
  restaurantName: string
  index: number
}

export default function RestaurantCard({ restaurantName, index }: RestaurantCardProps) {
  const router = useRouter()

  const handleFindLocation = () => {
    // Navigate sang map với search query
    router.push(`/(tabs)/map?search=${encodeURIComponent(restaurantName)}`)
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.index}>{index + 1}</Text>
        <Text style={styles.restaurantName} numberOfLines={2}>
          {restaurantName}
        </Text>
      </View>
      <TouchableOpacity onPress={handleFindLocation} style={styles.findButton}>
        <LinearGradient
          colors={['#FF6B35', '#FF1493']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.findButtonGradient}
        >
          <Ionicons name="location" size={14} color="#FFFFFF" />
          <Text style={styles.findButtonText}>Tìm địa điểm</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  index: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
    minWidth: 24,
    textAlign: 'center',
  },
  restaurantName: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  findButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  findButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
})

