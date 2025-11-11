'use client'

import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { moodService } from '@/services/MoodService'
import { postService } from '@/services/PostService'
import type { Mood } from '@/type'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import Toast from 'react-native-toast-message'

type PrivacyType = 'public' | 'private' | 'friends'

export default function CreatePostScreen() {
  const { user, refreshUserInfo } = useAuth()
  const [content, setContent] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [privacy, setPrivacy] = useState<PrivacyType>('public')
  const [isLoading, setIsLoading] = useState(false)
  const [moods, setMoods] = useState<Mood[]>([])
  const [showMoodModal, setShowMoodModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Debug logging
  console.log('🔍 CreatePostScreen Debug:')
  console.log('- user object:', user)
  console.log('- user?.avatar:', user?.avatar)
  console.log('- user?.name:', user?.name)

  // Load moods on component mount
  useEffect(() => {
    loadMoods()
  }, [])

  const loadMoods = async () => {
    try {
      const allMoods = await moodService.getAllMoods()
      setMoods(allMoods)
    } catch (error) {
      console.error('Error loading moods:', error)
    }
  }

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 10, // Giới hạn 10 ảnh
      })

      if (!result.canceled && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri)
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 10)) // Giới hạn tổng cộng 10 ảnh
      }
    } catch (error) {
      console.error('Error picking images:', error)
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể chọn hình ảnh',
      })
    }
  }

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập nội dung bài viết',
      })
      return
    }

    setIsLoading(true)
    try {
      // Tạo post với tất cả ảnh đã chọn
      await postService.createPost(
        {
          content: content.trim(),
          moodId: selectedMood?.id || '',
          visibility: privacy.toUpperCase() as 'PUBLIC' | 'FRIENDS' | 'PRIVATE',
        },
        selectedImages.length > 0 ? selectedImages : undefined
      )

      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Bài viết đã được tạo',
      })

      // Quay về trang Community
      router.back()
    } catch (error) {
      console.error('Error creating post:', error)
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tạo bài viết',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const getPrivacyText = (privacy: PrivacyType) => {
    switch (privacy) {
      case 'public': return 'Công khai'
      case 'private': return 'Chỉ mình tôi'
      case 'friends': return 'Bạn bè'
      default: return 'Công khai'
    }
  }

  const getPrivacyIcon = (privacy: PrivacyType) => {
    switch (privacy) {
      case 'public': return 'globe-outline'
      case 'private': return 'lock-closed-outline'
      case 'friends': return 'people-outline'
      default: return 'globe-outline'
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Tạo bài viết</Text>
        
        <TouchableOpacity
          style={[styles.headerButton, styles.postButton]}
          onPress={handleCreatePost}
          disabled={isLoading || !content.trim()}
        >
          <Text style={[
            styles.postButtonText,
            (!content.trim() || isLoading) && styles.postButtonTextDisabled
          ]}>
            {isLoading ? 'Đang tạo...' : 'Đăng'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.avatar || getDefaultAvatar(user?.name || 'User') }}
              style={styles.avatar}
              contentFit="cover"
              onError={() => {
                console.log('❌ Avatar load error in CreatePost, using default')
              }}
              onLoad={() => {
                console.log('✅ Avatar loaded successfully in CreatePost:', user?.avatar)
              }}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Bạn'}</Text>
              <TouchableOpacity 
                style={styles.privacyButton}
                onPress={() => setShowPrivacyModal(true)}
              >
                <Ionicons 
                  name={getPrivacyIcon(privacy) as any} 
                  size={14} 
                  color="#6B7280" 
                />
                <Text style={styles.privacyText}>{getPrivacyText(privacy)}</Text>
                <Ionicons name="chevron-down" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Bạn đang nghĩ gì?"
            placeholderTextColor="#9CA3AF"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />

          {/* Selected Images */}
          {selectedImages.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.imagesTitle}>Hình ảnh đã chọn ({selectedImages.length})</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((imageUri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: imageUri }}
                      style={styles.selectedImage}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                    <View style={styles.imageNumberBadge}>
                      <Text style={styles.imageNumberText}>{index + 1}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Selected Mood */}
          {selectedMood && (
            <View style={styles.moodContainer}>
              <Text style={styles.moodLabel}>Tâm trạng:</Text>
              <View style={styles.moodChip}>
                <Text style={styles.moodEmoji}>{selectedMood.emoji}</Text>
                <Text style={styles.moodName}>{selectedMood.name}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedMood(null)}
                  style={styles.removeMoodButton}
                >
                  <Ionicons name="close" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Character Count */}
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {content.length}/2000
            </Text>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleImagePicker}
          >
            <Ionicons name="image-outline" size={24} color="#F97316" />
            <Text style={styles.actionText}>Hình ảnh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowMoodModal(true)}
          >
            <Ionicons name="happy-outline" size={24} color="#F97316" />
            <Text style={styles.actionText}>Tâm trạng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // TODO: Implement location picker
              Toast.show({
                type: 'info',
                text1: 'Tính năng sắp có',
                text2: 'Chọn vị trí sẽ được thêm sau',
              })
            }}
          >
            <Ionicons name="location-outline" size={24} color="#F97316" />
            <Text style={styles.actionText}>Vị trí</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Mood Selection Modal */}
      <Modal
        visible={showMoodModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowMoodModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chọn tâm trạng</Text>
            <View style={styles.modalCloseButton} />
          </View>
          
          <FlatList
            data={moods}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.moodItem}
                onPress={() => {
                  setSelectedMood(item)
                  setShowMoodModal(false)
                }}
              >
                <Text style={styles.moodItemEmoji}>{item.emoji}</Text>
                <View style={styles.moodItemInfo}>
                  <Text style={styles.moodItemName}>{item.name}</Text>
                  <Text style={styles.moodItemDescription}>{item.description}</Text>
                </View>
                {selectedMood?.id === item.id && (
                  <Ionicons name="checkmark" size={20} color="#F97316" />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.modalContent}
          />
        </SafeAreaView>
      </Modal>

      {/* Privacy Selection Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowPrivacyModal(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Quyền riêng tư</Text>
            <View style={styles.modalCloseButton} />
          </View>
          
          <View style={styles.modalContent}>
            {(['public', 'friends', 'private'] as PrivacyType[]).map((privacyType) => (
              <TouchableOpacity
                key={privacyType}
                style={styles.privacyItem}
                onPress={() => {
                  setPrivacy(privacyType)
                  setShowPrivacyModal(false)
                }}
              >
                <Ionicons 
                  name={getPrivacyIcon(privacyType) as any} 
                  size={24} 
                  color="#6B7280" 
                />
                <View style={styles.privacyItemInfo}>
                  <Text style={styles.privacyItemName}>{getPrivacyText(privacyType)}</Text>
                  <Text style={styles.privacyItemDescription}>
                    {privacyType === 'public' && 'Bất kỳ ai cũng có thể xem bài viết này'}
                    {privacyType === 'friends' && 'Chỉ bạn bè của bạn có thể xem bài viết này'}
                    {privacyType === 'private' && 'Chỉ bạn có thể xem bài viết này'}
                  </Text>
                </View>
                {privacy === privacyType && (
                  <Ionicons name="checkmark" size={20} color="#F97316" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  postButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  postButtonTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  privacyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  contentInput: {
    fontSize: 16,
    color: '#111827',
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  selectedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  characterCount: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  characterCountText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  imagesContainer: {
    margin: 16,
  },
  imagesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  imageNumberBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageNumberText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moodContainer: {
    margin: 16,
    marginTop: 0,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  moodName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 8,
  },
  removeMoodButton: {
    padding: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalCloseButton: {
    padding: 8,
    width: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    padding: 16,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  moodItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  moodItemInfo: {
    flex: 1,
  },
  moodItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  moodItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  privacyItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  privacyItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  privacyItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
})
