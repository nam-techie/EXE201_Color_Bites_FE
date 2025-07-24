'use client'

import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert } from 'react-native'

export function useImagePicker() {
   const [isLoading, setIsLoading] = useState(false)

   const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
         Alert.alert(
            'Permission needed',
            'Sorry, we need camera roll permissions to make this work!',
         )
         return false
      }
      return true
   }

   const pickImage = async (options?: ImagePicker.ImagePickerOptions) => {
      setIsLoading(true)

      try {
         const hasPermission = await requestPermissions()
         if (!hasPermission) {
            setIsLoading(false)
            return null
         }

         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            ...options,
         })

         if (!result.canceled) {
            return result.assets[0]
         }

         return null
      } catch (error) {
         console.error('Error picking image:', error)
         Alert.alert('Error', 'Failed to pick image')
         return null
      } finally {
         setIsLoading(false)
      }
   }

   const takePhoto = async (options?: ImagePicker.ImagePickerOptions) => {
      setIsLoading(true)

      try {
         const { status } = await ImagePicker.requestCameraPermissionsAsync()
         if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!')
            setIsLoading(false)
            return null
         }

         const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
            ...options,
         })

         if (!result.canceled) {
            return result.assets[0]
         }

         return null
      } catch (error) {
         console.error('Error taking photo:', error)
         Alert.alert('Error', 'Failed to take photo')
         return null
      } finally {
         setIsLoading(false)
      }
   }

   return {
      pickImage,
      takePhoto,
      isLoading,
   }
}
