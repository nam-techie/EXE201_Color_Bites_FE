import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface CreatePostBarProps {
  onPress: () => void
  userAvatar?: string
  userName?: string
}

export default function CreatePostBar({ onPress, userAvatar, userName }: CreatePostBarProps) {
  const { user } = useAuth()
  
  const displayName = userName || user?.name || 'Bạn'
  const displayAvatar = userAvatar || user?.avatar || null
  
  // Debug logging
  console.log('🔍 CreatePostBar Debug:')
  console.log('- userAvatar prop:', userAvatar)
  console.log('- user?.avatar:', user?.avatar)
  console.log('- displayAvatar:', displayAvatar)
  console.log('- user object:', user)

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        {/* Avatar */}
        <Image
          source={{ uri: displayAvatar || getDefaultAvatar(displayName) }}
          style={styles.avatar}
          contentFit="cover"
          onError={() => {
            console.log('❌ Avatar load error, using default')
          }}
          onLoad={() => {
            console.log('✅ Avatar loaded successfully:', displayAvatar)
          }}
        />
        
        {/* Input placeholder */}
        <View style={styles.inputContainer}>
          <Text style={styles.placeholderText}>
            Bạn đang nghĩ gì?
          </Text>
        </View>
        
        {/* Photo icon */}
        <TouchableOpacity style={styles.photoButton} onPress={onPress}>
          <Ionicons name="image-outline" size={24} color="#F97316" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  photoButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FEF3F2',
  },
})
