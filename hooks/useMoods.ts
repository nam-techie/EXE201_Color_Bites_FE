import { moodService } from '@/services/MoodService'
import type { Mood } from '@/type'
import { useEffect, useState } from 'react'

export function useMoods() {
  const [moods, setMoods] = useState<Mood[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMoods = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const moodList = await moodService.getAllMoods()
      setMoods(moodList)
      
      if (moodList.length === 0) {
        console.log('⚠️ No moods returned from API')
        setError('Không có dữ liệu cảm xúc')
      } else {
        console.log('Moods loaded successfully:', moodList.length)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách mood'
      setError(errorMessage)
      
      console.error('Error loading moods:', err)
      
      // Không show toast error vì đã có fallback moods
      // Toast.show({
      //   type: 'error',
      //   text1: 'Lỗi',
      //   text2: errorMessage,
      // })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshMoods = async () => {
    await loadMoods()
  }

  const getMoodById = (id: string): Mood | undefined => {
    return moods.find(mood => mood.id === id)
  }

  const getMoodByEmoji = (emoji: string): Mood | undefined => {
    return moods.find(mood => mood.emoji === emoji)
  }

  useEffect(() => {
    loadMoods()
  }, [])

  return {
    moods,
    isLoading,
    error,
    refreshMoods,
    getMoodById,
    getMoodByEmoji,
  }
}
