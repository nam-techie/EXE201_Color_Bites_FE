'use client'

import * as Location from 'expo-location'
import { useState } from 'react'
import { Alert } from 'react-native'

interface LocationData {
   latitude: number
   longitude: number
   address?: string
}

export function useLocation() {
   const [location, setLocation] = useState<LocationData | null>(null)
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
         setError('Permission to access location was denied')
         return false
      }
      return true
   }

   const getCurrentLocation = async () => {
      setIsLoading(true)
      setError(null)

      try {
         const hasPermission = await requestPermissions()
         if (!hasPermission) {
            setIsLoading(false)
            return null
         }

         const locationData = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
         })

         const { latitude, longitude } = locationData.coords

         // Reverse geocoding to get address
         const addressData = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
         })

         const address = addressData[0]
            ? `${addressData[0].name || ''} ${addressData[0].street || ''}, ${addressData[0].city || ''}`
            : undefined

         const result = { latitude, longitude, address }
         setLocation(result)
         return result
      } catch (error) {
         console.error('Error getting location:', error)
         setError('Failed to get current location')
         Alert.alert('Error', 'Failed to get current location')
         return null
      } finally {
         setIsLoading(false)
      }
   }

   return {
      location,
      getCurrentLocation,
      isLoading,
      error,
   }
}
