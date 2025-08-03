'use client'

import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

// 10 tabs, mỗi tab 2 màu với màu sắc đặc sắc hơn
const MOOD_TABS = [
   {
      id: 1,
      title: 'Năng Lượng',
      colors: [
         { id: 'red', color: '#FF1744', name: 'Đỏ', emotion: 'Năng động, Đam mê' },
         { id: 'orange', color: '#FF6F00', name: 'Cam', emotion: 'Sáng tạo, Lạc quan' },
      ]
   },
   {
      id: 2,
      title: 'Bình Yên',
      colors: [
         { id: 'blue', color: '#1976D2', name: 'Xanh dương', emotion: 'Tĩnh lặng, Tin cậy' },
         { id: 'green', color: '#388E3C', name: 'Xanh lá', emotion: 'Bình yên, Tươi mới' },
      ]
   },
   {
      id: 3,
      title: 'Vui Vẻ',
      colors: [
         { id: 'yellow', color: '#FBC02D', name: 'Vàng', emotion: 'Vui vẻ, Năng lượng' },
         { id: 'pink', color: '#E91E63', name: 'Hồng', emotion: 'Dịu dàng, Lãng mạn' },
      ]
   },
   {
      id: 4,
      title: 'Sáng Tạo',
      colors: [
         { id: 'purple', color: '#7B1FA2', name: 'Tím', emotion: 'Mysterious, Sáng tạo' },
         { id: 'indigo', color: '#3F51B5', name: 'Chàm', emotion: 'Sâu sắc, Trí tuệ' },
      ]
   },
   {
      id: 5,
      title: 'Cân Bằng',
      colors: [
         { id: 'gray', color: '#607D8B', name: 'Xám', emotion: 'Cân bằng, Thực tế' },
         { id: 'teal', color: '#009688', name: 'Xanh ngọc', emotion: 'Tươi mát, Cân bằng' },
      ]
   },
   {
      id: 6,
      title: 'Ấm Áp',
      colors: [
         { id: 'brown', color: '#8D6E63', name: 'Nâu', emotion: 'Ấm áp, An toàn' },
         { id: 'rose', color: '#C2185B', name: 'Hồng đậm', emotion: 'Mạnh mẽ, Quyết đoán' },
      ]
   },
   {
      id: 7,
      title: 'Tươi Mới',
      colors: [
         { id: 'lime', color: '#8BC34A', name: 'Lime', emotion: 'Tươi mới, Sức sống' },
         { id: 'cyan', color: '#00BCD4', name: 'Cyan', emotion: 'Mát mẻ, Trong lành' },
      ]
   },
   {
      id: 8,
      title: 'Mạnh Mẽ',
      colors: [
         { id: 'amber', color: '#FF9800', name: 'Amber', emotion: 'Mạnh mẽ, Nhiệt huyết' },
         { id: 'emerald', color: '#4CAF50', name: 'Emerald', emotion: 'Thịnh vượng, Tăng trưởng' },
      ]
   },
   {
      id: 9,
      title: 'Tinh Tế',
      colors: [
         { id: 'violet', color: '#9C27B0', name: 'Violet', emotion: 'Tinh tế, Quý phái' },
         { id: 'fuchsia', color: '#E91E63', name: 'Fuchsia', emotion: 'Nổi bật, Độc đáo' },
      ]
   },
   {
      id: 10,
      title: 'Hài Hòa',
      colors: [
         { id: 'slate', color: '#546E7A', name: 'Slate', emotion: 'Hài hòa, Ổn định' },
         { id: 'zinc', color: '#757575', name: 'Zinc', emotion: 'Trung tính, Đáng tin' },
      ]
   },
]

export default function MoodQuizPage() {
   const router = useRouter()
   const [selectedColors, setSelectedColors] = useState<string[]>([])
   const [currentTab, setCurrentTab] = useState(0)
   const [isAnalyzing, setIsAnalyzing] = useState(false)
   const [countdown, setCountdown] = useState(10)
   const [tabSelections, setTabSelections] = useState<{ [key: number]: string }>({})

   const progressWidth = useSharedValue(0)

   useEffect(() => {
      const progress = (currentTab / MOOD_TABS.length) * 100
      progressWidth.value = withTiming(progress, { duration: 500 })
   }, [currentTab])

   useEffect(() => {
      if (isAnalyzing && countdown > 0) {
         const timer = setTimeout(() => {
            setCountdown(countdown - 1)
         }, 1000)
         return () => clearTimeout(timer)
      } else if (isAnalyzing && countdown === 0) {
         // Navigate to results after countdown - sửa route
         const mood = analyzeMood(selectedColors)
         console.log('Quiz completed:', { selectedColors, mood })
         router.push('/mood/mood-results')
      }
   }, [isAnalyzing, countdown])

   const animatedProgressStyle = useAnimatedStyle(() => ({
      width: `${progressWidth.value}%`,
   }))

   const handleColorSelect = (colorId: string) => {
      // Lưu màu đã chọn cho tab hiện tại
      const newTabSelections = { ...tabSelections, [currentTab]: colorId }
      setTabSelections(newTabSelections)
      
      // Cập nhật selectedColors từ tất cả tab selections
      const allSelectedColors = Object.values(newTabSelections)
      setSelectedColors(allSelectedColors)
      
      // Tự động chuyển sang tab tiếp theo sau 1 giây
      setTimeout(() => {
         if (currentTab < MOOD_TABS.length - 1) {
            setCurrentTab(currentTab + 1)
         } else {
            setIsAnalyzing(true)
            setCountdown(10)
         }
      }, 1000)
   }

   const handlePrevious = () => {
      if (currentTab > 0) {
         // Khi back, giữ lại màu đã chọn ở tab trước đó
         setCurrentTab(currentTab - 1)
      }
   }

   const analyzeMood = (colors: string[]): string => {
      // Mock mood analysis based on color psychology
      if (colors.includes('red') || colors.includes('orange') || colors.includes('amber')) {
         return 'Energetic'
      } else if (colors.includes('blue') || colors.includes('green') || colors.includes('teal')) {
         return 'Calm'
      } else if (colors.includes('yellow') || colors.includes('pink') || colors.includes('lime')) {
         return 'Happy'
      } else if (colors.includes('purple') || colors.includes('indigo') || colors.includes('violet')) {
         return 'Creative'
      } else if (colors.includes('gray') || colors.includes('slate') || colors.includes('zinc')) {
         return 'Balanced'
      } else {
         return 'Energetic' // Default
      }
   }

   const renderTabContent = () => {
      const currentTabData = MOOD_TABS[currentTab]
      
      if (isAnalyzing) {
         return (
            <View style={styles.analysisContainer}>
               <Text style={styles.analysisTitle}>Phân tích tâm trạng</Text>
               <Text style={styles.analysisSubtitle}>
                  AI đang phân tích màu sắc để hiểu tâm trạng của bạn...
               </Text>
               <View style={styles.loadingSpinner}>
                  <Ionicons name="color-palette" size={40} color="#8B5CF6" />
               </View>
               <Text style={styles.countdownText}>{countdown}s</Text>
               <Text style={styles.analysisText}>Đang phân tích...</Text>
            </View>
         )
      }

      return (
         <View style={styles.tabContainer}>
            <Text style={styles.tabTitle}>{currentTabData.title}</Text>
            <Text style={styles.tabSubtitle}>
               Chọn màu sắc phản ánh tâm trạng của bạn
            </Text>
            <View style={styles.colorsContainer}>
               {currentTabData.colors.map((colorItem) => (
                  <TouchableOpacity
                     key={colorItem.id}
                     style={[
                        styles.colorItem,
                        { backgroundColor: colorItem.color },
                        tabSelections[currentTab] === colorItem.id && styles.selectedColor,
                     ]}
                     onPress={() => handleColorSelect(colorItem.id)}
                  >
                     {tabSelections[currentTab] === colorItem.id && (
                        <Ionicons name="checkmark" size={24} color="white" />
                     )}
                  </TouchableOpacity>
               ))}
            </View>
            <Text style={styles.selectedCount}>
               Đã chọn {selectedColors.length} màu
            </Text>
         </View>
      )
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mood Discovery</Text>
            <View style={styles.placeholder} />
         </View>

         {/* Progress Bar */}
         <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
               <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
            </View>
            <Text style={styles.progressText}>
               Tab {currentTab + 1} / {MOOD_TABS.length}
            </Text>
         </View>

         {/* Content */}
         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {renderTabContent()}
         </ScrollView>

         {/* Footer - chỉ có nút Go Back */}
         <View style={styles.footer}>
            {!isAnalyzing && currentTab > 0 && (
               <TouchableOpacity
                  style={styles.previousButton}
                  onPress={handlePrevious}
               >
                  <Ionicons name="arrow-back" size={20} color="#6B7280" />
                  <Text style={styles.previousButtonText}>Go Back</Text>
               </TouchableOpacity>
            )}
         </View>
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
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#F9FAFB',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
   },
   placeholder: {
      width: 40,
   },
   progressContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
   },
   progressBar: {
      height: 4,
      backgroundColor: '#F3F4F6',
      borderRadius: 2,
      overflow: 'hidden',
   },
   progressFill: {
      height: '100%',
      backgroundColor: '#8B5CF6',
      borderRadius: 2,
   },
   progressText: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
      marginTop: 8,
   },
   content: {
      flex: 1,
   },
   tabContainer: {
      padding: 20,
      alignItems: 'center',
   },
   tabTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 12,
      textAlign: 'center',
   },
   tabSubtitle: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 24,
   },
   colorsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 30,
   },
   colorItem: {
      width: 120,
      height: 120,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
   },
   selectedColor: {
      borderWidth: 4,
      borderColor: '#FFFFFF',
      shadowColor: '#8B5CF6',
      shadowOffset: {
         width: 0,
         height: 0,
      },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
   },
   selectedCount: {
      fontSize: 16,
      color: '#6B7280',
      fontWeight: '500',
   },
   analysisContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
   },
   analysisTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 12,
      textAlign: 'center',
   },
   analysisSubtitle: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 40,
      lineHeight: 24,
   },
   loadingSpinner: {
      marginBottom: 20,
   },
   countdownText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#8B5CF6',
      marginBottom: 8,
   },
   analysisText: {
      fontSize: 16,
      color: '#6B7280',
   },
   footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      backgroundColor: '#FFFFFF',
   },
   previousButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F3F4F6',
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
   },
   previousButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6B7280',
      marginLeft: 8,
   },
}) 