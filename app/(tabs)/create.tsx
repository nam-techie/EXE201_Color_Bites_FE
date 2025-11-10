'use client'

import {
    FormField,
    ImageUploader,
    MoodSelector
} from '@/components/create-post'
import { useAuth } from '@/context/AuthProvider'
import { useCreatePost, useMoods } from '@/hooks'
import { commonStyles } from '@/styles'
import { router } from 'expo-router'
import React from 'react'
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'


export default function CreatePostScreen() {
  const { form, updateForm, isLoading, createPost } = useCreatePost()
  const { moods, isLoading: loadingMoods } = useMoods()
  const { user } = useAuth()

  const handleCreatePost = async () => {
    // Kiểm tra user đã đăng nhập chưa
    if (!user) {
      console.error(' User not logged in')
      return
    }
    
    console.log('🚀 Starting create post process for user:', user.name)
    
    const success = await createPost()
    if (success) {
      console.log(' Post created successfully!')
    }
  }

  return (
    <SafeAreaView style={commonStyles.safeContainer}>
      {/* Simple Header */}
      <View style={commonStyles.header}>
        <View style={commonStyles.headerContent}>
          <Text style={commonStyles.headerTitle}>Tạo bài viết</Text>
          {user ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#10B981', marginRight: 8 }}>
                 {user.name}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#EF4444', marginRight: 8 }}>
                 Chưa đăng nhập
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Auth Warning if not logged in */}
        {!user && (
          <View style={{
            backgroundColor: '#FEF2F2',
            borderColor: '#FECACA',
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            alignItems: 'center',
          }}>
            <Text style={{ color: '#DC2626', fontWeight: '600', marginBottom: 8 }}>
              ⚠️ Bạn cần đăng nhập để tạo bài viết
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/auth/login')}
              style={{
                backgroundColor: '#DC2626',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>
                Đăng nhập ngay
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* 1. Image Upload (imageUrls) */}
        <ImageUploader
          selectedImage={form.selectedImage}
          onImageSelected={(imageUri) => updateForm({ selectedImage: imageUri })}
          onImageRemoved={() => updateForm({ selectedImage: null })}
        />

        {/* 2. Content Field (required, max 5000) */}
        <FormField
          label="Nội dung *"
          placeholder="Chia sẻ trải nghiệm ẩm thực của bạn... (tối đa 5000 ký tự)"
          value={form.content}
          onChangeText={(content) => updateForm({ content: content.slice(0, 5000) })}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          maxLength={5000}
        />

        {/* 3. Mood Selector (moodId) */}
        <MoodSelector
          moods={moods}
          selectedMoodId={form.selectedMoodId}
          onMoodSelected={(moodId) => updateForm({ selectedMoodId: moodId })}
          isLoading={loadingMoods}
        />

        {/* Submit Button - Moved to bottom */}
        <View style={{ marginTop: 32, marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={handleCreatePost}
            style={[
              commonStyles.primaryButton,
              { 
                paddingVertical: 16,
                borderRadius: 12,
              },
              isLoading && commonStyles.primaryButtonDisabled
            ]}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                <Text style={commonStyles.primaryButtonText}>Đang đăng...</Text>
              </View>
            ) : (
              <Text style={[commonStyles.primaryButtonText, { fontSize: 16, fontWeight: '600' }]}>
                Đăng bài viết
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

