import { Challenge } from '@/data/challengeData'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

interface CreateChallengePostProps {
   challenge: Challenge
   visible: boolean
   onClose: () => void
   onSubmit: (caption: string, imageUri: string, location?: { name: string; lat: number; lon: number; address: string }) => void
}

export function CreateChallengePost({ 
   challenge, 
   visible, 
   onClose, 
   onSubmit 
}: CreateChallengePostProps) {
   const [caption, setCaption] = useState('')
   const [selectedImage, setSelectedImage] = useState<string | null>(null)
   const [location, setLocation] = useState<{ name: string; lat: number; lon: number; address: string } | null>(null)

   const handleImagePicker = () => {
      // TODO: Implement image picker
      // For now, use a mock image
      setSelectedImage('https://picsum.photos/id/1025/600/400')
   }

   const handleSubmit = () => {
      if (!selectedImage) {
         Alert.alert('Lỗi', 'Vui lòng chọn ảnh cho bài đăng')
         return
      }

      if (!caption.trim()) {
         Alert.alert('Lỗi', 'Vui lòng nhập mô tả cho bài đăng')
         return
      }

      onSubmit(caption, selectedImage, location || undefined)
      handleClose()
   }

   const handleClose = () => {
      setCaption('')
      setSelectedImage(null)
      setLocation(null)
      onClose()
   }

   return (
      <Modal
         visible={visible}
         animationType="slide"
         presentationStyle="pageSheet"
         onRequestClose={handleClose}
      >
         <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
               <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Tạo bài đăng</Text>
               <TouchableOpacity 
                  onPress={handleSubmit}
                  style={[styles.submitButton, (!selectedImage || !caption.trim()) && styles.submitButtonDisabled]}
                  disabled={!selectedImage || !caption.trim()}
               >
                  <Text style={[styles.submitButtonText, (!selectedImage || !caption.trim()) && styles.submitButtonTextDisabled]}>
                     Đăng
                  </Text>
               </TouchableOpacity>
            </View>

            {/* Challenge Info */}
            <View style={styles.challengeInfo}>
               <Text style={styles.challengeTitle}>{challenge.title}</Text>
               <Text style={styles.challengeHashtag}>{challenge.hashtag}</Text>
            </View>

            {/* Image Picker */}
            <View style={styles.imageSection}>
               {selectedImage ? (
                  <View style={styles.selectedImageContainer}>
                     <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                        contentFit="cover"
                     />
                     <TouchableOpacity 
                        style={styles.changeImageButton}
                        onPress={handleImagePicker}
                     >
                        <Ionicons name="camera" size={20} color="#FFFFFF" />
                        <Text style={styles.changeImageText}>Thay đổi ảnh</Text>
                     </TouchableOpacity>
                  </View>
               ) : (
                  <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
                     <Ionicons name="camera-outline" size={48} color="#D1D5DB" />
                     <Text style={styles.imagePickerText}>Chụp ảnh hoặc chọn từ thư viện</Text>
                     <Text style={styles.imagePickerSubtext}>
                        Chia sẻ món ăn của bạn cho thử thách này
                     </Text>
                  </TouchableOpacity>
               )}
            </View>

            {/* Caption Input */}
            <View style={styles.captionSection}>
               <Text style={styles.captionLabel}>Mô tả</Text>
               <TextInput
                  style={styles.captionInput}
                  placeholder="Chia sẻ cảm nhận về món ăn của bạn..."
                  value={caption}
                  onChangeText={setCaption}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
               />
               <Text style={styles.characterCount}>
                  {caption.length}/500
               </Text>
            </View>

                         {/* Location Picker */}
             <View style={styles.locationSection}>
                <Text style={styles.locationLabel}>📍 Địa điểm</Text>
                <TouchableOpacity 
                   style={styles.locationPicker}
                   onPress={() => {
                      // TODO: Implement location picker
                      setLocation({
                         name: 'Nhà hàng mẫu',
                         lat: 10.762622,
                         lon: 106.660172,
                         address: '123 Đường ABC, Quận 1, TP.HCM'
                      })
                   }}
                >
                   {location ? (
                      <View>
                         <Text style={styles.locationName}>{location.name}</Text>
                         <Text style={styles.locationAddress}>{location.address}</Text>
                      </View>
                   ) : (
                      <Text style={styles.locationPlaceholder}>Chọn địa điểm ăn uống</Text>
                   )}
                   <Ionicons name="location-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
             </View>

             {/* Auto hashtag */}
             <View style={styles.hashtagSection}>
                <Text style={styles.hashtagLabel}>Hashtag tự động:</Text>
                <Text style={styles.autoHashtag}>{challenge.hashtag}</Text>
             </View>
         </View>
      </Modal>
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
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   closeButton: {
      padding: 8,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   submitButton: {
      backgroundColor: '#F97316',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
   },
   submitButtonDisabled: {
      backgroundColor: '#E5E7EB',
   },
   submitButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
   },
   submitButtonTextDisabled: {
      color: '#9CA3AF',
   },
   challengeInfo: {
      padding: 16,
      backgroundColor: '#FEF3C7',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   challengeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 4,
   },
   challengeHashtag: {
      fontSize: 14,
      color: '#2563EB',
      fontWeight: '500',
   },
   imageSection: {
      padding: 16,
   },
   imagePickerButton: {
      borderWidth: 2,
      borderColor: '#E5E7EB',
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
   },
   imagePickerText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#6B7280',
      marginTop: 12,
      textAlign: 'center',
   },
   imagePickerSubtext: {
      fontSize: 14,
      color: '#9CA3AF',
      marginTop: 4,
      textAlign: 'center',
   },
   selectedImageContainer: {
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
   },
   selectedImage: {
      width: '100%',
      height: 300,
   },
   changeImageButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
   },
   changeImageText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
   },
   captionSection: {
      padding: 16,
   },
   captionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 8,
   },
   captionInput: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: '#111827',
      textAlignVertical: 'top',
      minHeight: 100,
   },
   characterCount: {
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'right',
      marginTop: 4,
   },
   hashtagSection: {
      padding: 16,
      backgroundColor: '#F9FAFB',
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
   },
   hashtagLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 4,
   },
   autoHashtag: {
      fontSize: 16,
      color: '#2563EB',
      fontWeight: '500',
   },
   locationSection: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
   },
   locationLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 8,
   },
   locationPicker: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#F9FAFB',
   },
   locationName: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 2,
   },
   locationAddress: {
      fontSize: 12,
      color: '#6B7280',
   },
   locationPlaceholder: {
      fontSize: 14,
      color: '#9CA3AF',
   },
}) 