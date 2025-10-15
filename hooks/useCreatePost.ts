import { postService } from '@/services/PostService'
import type { CreatePostRequest } from '@/type'
import { useState } from 'react'
import Toast from 'react-native-toast-message'

export interface CreatePostForm {
  content: string         // required, max 5000
  selectedMoodId: string  // required
  selectedImage: string | null  // optional -> files
}

const initialForm: CreatePostForm = {
  content: '',
  selectedMoodId: '',
  selectedImage: null,
}

export function useCreatePost() {
  const [form, setForm] = useState<CreatePostForm>(initialForm)
  const [isLoading, setIsLoading] = useState(false)

  const updateForm = (updates: Partial<CreatePostForm>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setForm(initialForm)
  }

  const validateForm = (): string | null => {
    if (!form.content.trim()) {
      return 'Vui lòng nhập nội dung bài viết'
    }

    if (form.content.length > 5000) {
      return 'Nội dung không được vượt quá 5000 ký tự'
    }

    if (!form.selectedMoodId) {
      return 'Vui lòng chọn mood cho bài viết'
    }

    return null
  }

  const createPost = async (): Promise<boolean> => {
    const validationError = validateForm()
    if (validationError) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: validationError,
      })
      return false
    }

    setIsLoading(true)

    try {
      // Tạo request data đơn giản
      const postData: CreatePostRequest = {
        content: form.content.trim(),
        moodId: form.selectedMoodId,
      }

      console.log('Submitting post data:', postData)
      console.log('Selected image:', form.selectedImage)

      // Gọi API với image URI riêng biệt
      const createdPost = await postService.createPost(postData, form.selectedImage || undefined)
      
      console.log('Post created successfully:', createdPost)

      Toast.show({
        type: 'success',
        text1: 'Thành công!',
        text2: 'Bài viết đã được đăng thành công',
      })

      resetForm()
      return true
    } catch (error) {
      console.error('Error creating post:', error)
      
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error instanceof Error ? error.message : 'Không thể đăng bài viết',
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    form,
    updateForm,
    resetForm,
    isLoading,
    createPost,
  }
}
