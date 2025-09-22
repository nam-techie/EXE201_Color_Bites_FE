import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { commonStyles } from '@/styles/commonStyles'
import { theme } from '@/styles/theme'

interface ImageUploaderProps {
  selectedImage: string | null
  onImageSelected: (imageUri: string) => void
  onImageRemoved: () => void
}

export function ImageUploader({ selectedImage, onImageSelected, onImageRemoved }: ImageUploaderProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      onImageSelected(result.assets[0].uri)
    }
  }

  if (selectedImage) {
    return (
      <View style={commonStyles.section}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.selectedImage}
            contentFit="cover"
          />
          <TouchableOpacity
            onPress={onImageRemoved}
            style={styles.removeImageButton}
          >
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={commonStyles.section}>
      <TouchableOpacity onPress={pickImage} style={styles.imageUploadArea}>
        <Ionicons name="camera" size={48} color={theme.colors.text.placeholder} />
        <Text style={styles.imageUploadText}>Thêm ảnh hoặc video</Text>
        <View style={styles.chooseMediaButton}>
          <Ionicons name="add" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.chooseMediaText}>Chọn Media</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  selectedImage: {
    height: 192,
    width: '100%',
    borderRadius: theme.borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.sm,
  },
  imageUploadArea: {
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderStyle: 'dashed',
    padding: theme.spacing.xxxl,
  },
  imageUploadText: {
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.md,
  },
  chooseMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  chooseMediaText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.sm,
  },
})
