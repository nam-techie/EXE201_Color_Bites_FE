import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

interface MoodResultsProps {
   selectedColors: string[]
   mood: string
   onClose: () => void
   onTryAgain: () => void
}

const MOOD_DATA = {
   Energetic: {
      title: 'Năng động & Đam mê',
      description: 'Bạn đang tràn đầy năng lượng và sẵn sàng khám phá!',
      emoji: '⚡',
      color: '#EF4444',
      foods: [
         {
            name: 'Spicy Ramen',
            description: 'Món ăn cay nóng để tăng cường năng lượng',
            image: 'https://picsum.photos/id/1025/300/200',
            tags: ['Cay', 'Nóng', 'Năng lượng'],
         },
         {
            name: 'Vietnamese Pho',
            description: 'Phở bò truyền thống với hương vị đậm đà',
            image: 'https://picsum.photos/id/1062/300/200',
            tags: ['Truyền thống', 'Đậm đà', 'Nóng'],
         },
         {
            name: 'Korean BBQ',
            description: 'Thịt nướng Hàn Quốc với nhiều gia vị',
            image: 'https://picsum.photos/id/1040/300/200',
            tags: ['Nướng', 'Thịt', 'Gia vị'],
         },
      ],
   },
   Calm: {
      title: 'Bình yên & Tĩnh lặng',
      description: 'Bạn đang tìm kiếm sự bình yên và thư giãn.',
      emoji: '🌊',
      color: '#3B82F6',
      foods: [
         {
            name: 'Green Tea Smoothie',
            description: 'Smoothie trà xanh mát lạnh và thanh lọc',
            image: 'https://picsum.photos/id/1025/300/200',
            tags: ['Thanh lọc', 'Mát', 'Tự nhiên'],
         },
         {
            name: 'Chicken Soup',
            description: 'Súp gà ấm áp và dễ tiêu hóa',
            image: 'https://picsum.photos/id/1062/300/200',
            tags: ['Ấm áp', 'Dễ tiêu', 'Bổ dưỡng'],
         },
         {
            name: 'Lavender Latte',
            description: 'Cà phê với hương oải hương thư giãn',
            image: 'https://picsum.photos/id/1040/300/200',
            tags: ['Thư giãn', 'Hương thơm', 'Cà phê'],
         },
      ],
   },
   Happy: {
      title: 'Vui vẻ & Lạc quan',
      description: 'Bạn đang trong tâm trạng tuyệt vời và muốn ăn mừng!',
      emoji: '🌈',
      color: '#EAB308',
      foods: [
         {
            name: 'Rainbow Cake',
            description: 'Bánh kem cầu vồng đầy màu sắc và niềm vui',
            image: 'https://picsum.photos/id/1025/300/200',
            tags: ['Ngọt', 'Màu sắc', 'Vui vẻ'],
         },
         {
            name: 'Fruit Smoothie Bowl',
            description: 'Bowl smoothie trái cây tươi mát',
            image: 'https://picsum.photos/id/1062/300/200',
            tags: ['Tươi mát', 'Trái cây', 'Khỏe mạnh'],
         },
         {
            name: 'Pizza Margherita',
            description: 'Pizza Ý truyền thống với phô mai béo ngậy',
            image: 'https://picsum.photos/id/1040/300/200',
            tags: ['Phô mai', 'Nướng', 'Ý'],
         },
      ],
   },
   Creative: {
      title: 'Sáng tạo & Nghệ thuật',
      description: 'Bạn đang trong tâm trạng sáng tạo và muốn khám phá!',
      emoji: '🎨',
      color: '#8B5CF6',
      foods: [
         {
            name: 'Sushi Art',
            description: 'Sushi được trình bày như tác phẩm nghệ thuật',
            image: 'https://picsum.photos/id/1025/300/200',
            tags: ['Nghệ thuật', 'Tươi', 'Nhật Bản'],
         },
         {
            name: 'Molecular Gastronomy',
            description: 'Ẩm thực phân tử với kỹ thuật hiện đại',
            image: 'https://picsum.photos/id/1062/300/200',
            tags: ['Hiện đại', 'Kỹ thuật', 'Độc đáo'],
         },
         {
            name: 'Fusion Cuisine',
            description: 'Món ăn kết hợp nhiều nền văn hóa',
            image: 'https://picsum.photos/id/1040/300/200',
            tags: ['Kết hợp', 'Đa văn hóa', 'Mới lạ'],
         },
      ],
   },
   Balanced: {
      title: 'Cân bằng & Hài hòa',
      description: 'Bạn đang tìm kiếm sự cân bằng trong cuộc sống.',
      emoji: '⚖️',
      color: '#6B7280',
      foods: [
         {
            name: 'Buddha Bowl',
            description: 'Bowl cân bằng với rau, protein và ngũ cốc',
            image: 'https://picsum.photos/id/1025/300/200',
            tags: ['Cân bằng', 'Khỏe mạnh', 'Đầy đủ'],
         },
         {
            name: 'Mediterranean Salad',
            description: 'Salad Địa Trung Hải với dầu olive',
            image: 'https://picsum.photos/id/1062/300/200',
            tags: ['Tươi', 'Dầu olive', 'Địa Trung Hải'],
         },
         {
            name: 'Quinoa Bowl',
            description: 'Bowl quinoa với rau và protein nạc',
            image: 'https://picsum.photos/id/1040/300/200',
            tags: ['Protein', 'Ngũ cốc', 'Rau'],
         },
      ],
   },
}

export const MoodResults: React.FC<MoodResultsProps> = ({
   selectedColors,
   mood,
   onClose,
   onTryAgain,
}) => {
   const containerOpacity = useSharedValue(0)
   const containerScale = useSharedValue(0.9)
   const cardTranslateY = useSharedValue(50)

   React.useEffect(() => {
      containerOpacity.value = withTiming(1, { duration: 500 })
      containerScale.value = withSpring(1, { damping: 15, stiffness: 100 })
      cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 })
   }, [])

   const animatedContainerStyle = useAnimatedStyle(() => ({
      opacity: containerOpacity.value,
      transform: [{ scale: containerScale.value }],
   }))

   const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: cardTranslateY.value }],
   }))

   const moodData = MOOD_DATA[mood as keyof typeof MOOD_DATA] || MOOD_DATA.Balanced

   return (
      <View style={styles.container}>
         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.content, animatedContainerStyle]}>
               {/* Header */}
               <View style={styles.header}>
                  <Text style={styles.headerTitle}>Kết quả phân tích</Text>
                  <Text style={styles.headerSubtitle}>
                     Dựa trên {selectedColors.length} màu sắc bạn đã chọn
                  </Text>
               </View>

               {/* Mood Result */}
               <Animated.View style={[styles.moodCard, animatedCardStyle]}>
                  <View style={[styles.moodIcon, { backgroundColor: moodData.color }]}>
                     <Text style={styles.moodEmoji}>{moodData.emoji}</Text>
                  </View>
                  <Text style={styles.moodTitle}>{moodData.title}</Text>
                  <Text style={styles.moodDescription}>{moodData.description}</Text>
               </Animated.View>

               {/* Food Recommendations */}
               <View style={styles.recommendationsSection}>
                  <Text style={styles.sectionTitle}>Gợi ý món ăn phù hợp</Text>
                  <Text style={styles.sectionSubtitle}>
                     Những món ăn này sẽ phù hợp với tâm trạng hiện tại của bạn
                  </Text>

                  {moodData.foods.map((food, index) => (
                     <Animated.View
                        key={index}
                        style={[
                           styles.foodCard,
                           animatedCardStyle,
                           { animationDelay: index * 200 },
                        ]}
                     >
                        <Image source={{ uri: food.image }} style={styles.foodImage} />
                        <View style={styles.foodContent}>
                           <Text style={styles.foodName}>{food.name}</Text>
                           <Text style={styles.foodDescription}>{food.description}</Text>
                           <View style={styles.foodTags}>
                              {food.tags.map((tag, tagIndex) => (
                                 <View key={tagIndex} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                 </View>
                              ))}
                           </View>
                        </View>
                     </Animated.View>
                  ))}
               </View>

               {/* Action Buttons */}
               <View style={styles.actionsContainer}>
                  <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                     <Ionicons name="restaurant" size={20} color="white" />
                     <Text style={styles.primaryButtonText}>Khám phá món ăn</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryButton} onPress={onTryAgain}>
                     <Ionicons name="refresh" size={20} color="#8B5CF6" />
                     <Text style={styles.secondaryButtonText}>Thử lại</Text>
                  </TouchableOpacity>
               </View>
            </Animated.View>
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   scrollView: {
      flex: 1,
   },
   content: {
      padding: 20,
   },
   header: {
      alignItems: 'center',
      marginBottom: 24,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
   },
   headerSubtitle: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
   },
   moodCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
   },
   moodIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
   },
   moodEmoji: {
      fontSize: 40,
   },
   moodTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
      textAlign: 'center',
   },
   moodDescription: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 22,
   },
   recommendationsSection: {
      marginBottom: 24,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
   },
   sectionSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 16,
      lineHeight: 20,
   },
   foodCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
   },
   foodImage: {
      width: '100%',
      height: 160,
   },
   foodContent: {
      padding: 16,
   },
   foodName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
   },
   foodDescription: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 12,
      lineHeight: 20,
   },
   foodTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
   },
   tag: {
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
   },
   tagText: {
      fontSize: 12,
      color: '#374151',
      fontWeight: '500',
   },
   actionsContainer: {
      gap: 12,
   },
   primaryButton: {
      backgroundColor: '#8B5CF6',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
   },
   primaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
      marginLeft: 8,
   },
   secondaryButton: {
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
   },
   secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#8B5CF6',
      marginLeft: 8,
   },
}) 