import { postService } from '@/services/PostService'
import type { CreatePostRequest } from '@/type'
import { useState } from 'react'
import Toast from 'react-native-toast-message'

export interface CreatePostForm {
  title: string           // required, max 200
  content: string         // required, max 5000
  selectedMoodId: string  // required
  selectedImage: string | null  // optional -> imageUrls
  videoUrl: string        // optional
}

const initialForm: CreatePostForm = {
  title: '',
  content: '',
  selectedMoodId: '',
  selectedImage: null,
  videoUrl: '',
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
    if (!form.title.trim()) {
      return 'Vui lòng nhập tiêu đề bài viết'
    }

    if (form.title.length > 200) {
      return 'Tiêu đề không được vượt quá 200 ký tự'
    }

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
         const postData: CreatePostRequest = {
            title: form.title.trim(),
            content: form.content.trim(),
            moodId: form.selectedMoodId,
            imageUrls: form.selectedImage ? [form.selectedImage] : undefined,
            videoUrl: form.videoUrl.trim() || undefined,
         }

      console.log('Submitting post data:', postData)

      const createdPost = await postService.createPost(postData)
      
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
