'use client'

import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
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
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const MOOD_DATA = {
   Energetic: {
      title: 'Năng Động & Đam Mê',
      subtitle: '⚡ Bạn đang tràn đầy năng lượng!',
      description: 'Tâm trạng của bạn thật tuyệt vời! Bạn đang sẵn sàng cho những thử thách mới và tràn đầy nhiệt huyết. Hãy thưởng thức những món ăn đậm đà để duy trì năng lượng này nhé!',
      emoji: '⚡',
      color: '#FF1744',
      gradient: ['#FF1744', '#FF5722', '#FF9800'],
      foods: [
         {
            name: 'Phở Bò',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Nóng', 'Đậm đà', 'Năng lượng'],
            rating: 4.8,
            price: '35k-50k',
            distance: '0.5km',
         },
         {
            name: 'Bún Chả Hà Nội',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Nướng', 'Thịt', 'Đậm đà'],
            rating: 4.6,
            price: '40k-60k',
            distance: '1.2km',
         },
         {
            name: 'Cơm Tấm Sài Gòn',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            tags: ['Cơm', 'Thịt', 'Đầy đủ'],
            rating: 4.7,
            price: '30k-45k',
            distance: '0.8km',
         },
         {
            name: 'Bún Bò Huế',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Cay', 'Đậm đà', 'Đặc trưng'],
            rating: 4.9,
            price: '45k-65k',
            distance: '1.5km',
         },
         {
            name: 'Bánh Mì Thịt Nướng',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Nhanh', 'Ngon', 'Tiện lợi'],
            rating: 4.5,
            price: '25k-35k',
            distance: '0.3km',
         },
         {
            name: 'Gỏi Cuốn Tôm Thịt',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            tags: ['Tươi', 'Nhẹ', 'Lành mạnh'],
            rating: 4.7,
            price: '30k-45k',
            distance: '0.9km',
         },
         {
            name: 'Chè Ba Màu',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Ngọt', 'Màu sắc', 'Vui mắt'],
            rating: 4.6,
            price: '15k-25k',
            distance: '0.7km',
         },
         {
            name: 'Bánh Tráng Nướng',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Độc đáo', 'Giòn', 'Nhiều topping'],
            rating: 4.4,
            price: '20k-30k',
            distance: '1.1km',
         },
      ],
      recommendations: [
         'Nên ăn vào buổi sáng để có năng lượng cả ngày',
         'Kết hợp với trà đá để cân bằng',
         'Chia sẻ với bạn bè để tăng niềm vui'
      ]
   },
   Calm: {
      title: 'Bình Yên & Tĩnh Lặng',
      subtitle: '🌊 Tâm hồn thanh thản',
      description: 'Tâm trạng của bạn thật thanh thản và bình yên. Đây là thời điểm hoàn hảo để thưởng thức những món ăn nhẹ nhàng và tận hưởng khoảnh khắc yên bình.',
      emoji: '🌊',
      color: '#1976D2',
      gradient: ['#1976D2', '#42A5F5', '#81C784'],
      foods: [
         {
            name: 'Chè Hạt Sen Long Nhãn',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Ngọt', 'Nhẹ', 'Thanh mát'],
            rating: 4.9,
            price: '25k-35k',
            distance: '0.3km',
         },
         {
            name: 'Bánh Flan Caramen',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            tags: ['Tráng miệng', 'Mềm', 'Ngọt'],
            rating: 4.5,
            price: '15k-25k',
            distance: '0.6km',
         },
         {
            name: 'Trà Sữa Matcha',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Uống', 'Ngọt', 'Mát'],
            rating: 4.7,
            price: '35k-50k',
            distance: '1.0km',
         },
      ],
      recommendations: [
         'Thưởng thức trong không gian yên tĩnh',
         'Kết hợp với âm nhạc nhẹ nhàng',
         'Ăn chậm để cảm nhận hương vị'
      ]
   },
   Happy: {
      title: 'Vui Vẻ & Lạc Quan',
      subtitle: '😊 Niềm vui tràn ngập',
      description: 'Tâm trạng tuyệt vời! Bạn đang tràn ngập niềm vui và lạc quan. Hãy ăn những món ngon để duy trì niềm vui và chia sẻ hạnh phúc với mọi người xung quanh.',
      emoji: '😊',
      color: '#FBC02D',
      gradient: ['#FBC02D', '#FFB74D', '#FF8A65'],
      foods: [
         {
            name: 'Bánh Mì Thịt Nướng',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Nhanh', 'Ngon', 'Tiện lợi'],
            rating: 4.8,
            price: '20k-30k',
            distance: '0.4km',
         },
         {
            name: 'Gỏi Cuốn Tôm Thịt',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            tags: ['Tươi', 'Nhẹ', 'Lành mạnh'],
            rating: 4.6,
            price: '25k-35k',
            distance: '0.7km',
         },
         {
            name: 'Chè Ba Màu',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Ngọt', 'Màu sắc', 'Vui mắt'],
            rating: 4.7,
            price: '15k-25k',
            distance: '0.9km',
         },
      ],
      recommendations: [
         'Chia sẻ với bạn bè để tăng niềm vui',
         'Chụp ảnh để lưu giữ khoảnh khắc',
         'Thưởng thức ngoài trời nếu có thể'
      ]
   },
   Creative: {
      title: 'Sáng Tạo & Độc Đáo',
      subtitle: '🎨 Trí tưởng tượng bay cao',
      description: 'Tâm trạng sáng tạo! Bạn đang có những ý tưởng độc đáo và trí tưởng tượng phong phú. Hãy thử những món ăn mới lạ để kích thích sự sáng tạo.',
      emoji: '🎨',
      color: '#7B1FA2',
      gradient: ['#7B1FA2', '#9C27B0', '#E91E63'],
      foods: [
         {
            name: 'Bánh Tráng Nướng Đặc Biệt',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Độc đáo', 'Giòn', 'Nhiều topping'],
            rating: 4.9,
            price: '30k-45k',
            distance: '0.6km',
         },
         {
            name: 'Bún Bò Huế Cay',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            tags: ['Cay', 'Đậm đà', 'Đặc trưng'],
            rating: 4.8,
            price: '40k-55k',
            distance: '1.1km',
         },
         {
            name: 'Chè Sầu Riêng',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Đặc biệt', 'Ngọt', 'Hương vị riêng'],
            rating: 4.5,
            price: '25k-35k',
            distance: '0.8km',
         },
      ],
      recommendations: [
         'Thử món mới để kích thích sáng tạo',
         'Ghi chép lại cảm nhận về món ăn',
         'Chia sẻ trải nghiệm với bạn bè'
      ]
   },
   Balanced: {
      title: 'Cân Bằng & Hài Hòa',
      subtitle: '⚖️ Sự cân bằng hoàn hảo',
      description: 'Tâm trạng cân bằng! Bạn đang có sự hài hòa tuyệt vời giữa thể chất và tinh thần. Hãy thưởng thức những món ăn đầy đủ dinh dưỡng để duy trì sự cân bằng này.',
      emoji: '⚖️',
      color: '#388E3C',
      gradient: ['#388E3C', '#66BB6A', '#81C784'],
      foods: [
         {
            name: 'Cơm Gà Xối Mỡ',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            tags: ['Cân bằng', 'Dinh dưỡng', 'Lành mạnh'],
            rating: 4.7,
            price: '35k-50k',
            distance: '0.5km',
         },
         {
            name: 'Canh Chua Cá Lóc',
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            tags: ['Chua', 'Tươi', 'Nhiều rau'],
            rating: 4.6,
            price: '45k-60k',
            distance: '1.3km',
         },
         {
            name: 'Sữa Chua Hy Lạp',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
            tags: ['Tốt cho tiêu hóa', 'Mát', 'Bổ dưỡng'],
            rating: 4.8,
            price: '20k-30k',
            distance: '0.4km',
         },
      ],
      recommendations: [
         'Ăn đúng giờ để duy trì nhịp sinh học',
         'Kết hợp rau xanh và protein',
         'Uống đủ nước trong ngày'
      ]
   },
}

export default function MoodResultsPage() {
   const router = useRouter()
   const [showAllFoods, setShowAllFoods] = useState(false)
   const cardScale = useSharedValue(0.8)
   const cardOpacity = useSharedValue(0)
   const headerTranslateY = useSharedValue(-50)
   const foodItemsTranslateY = useSharedValue(100)
   const buttonScale = useSharedValue(0.9)

   useEffect(() => {
      // Header animation
      headerTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 })
      
      // Card animation
      cardScale.value = withSpring(1, { damping: 15, stiffness: 100 })
      cardOpacity.value = withTiming(1, { duration: 800 })
      
      // Food items animation
      foodItemsTranslateY.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }))
      
      // Button animation
      buttonScale.value = withDelay(600, withSpring(1, { damping: 15, stiffness: 100 }))
   }, [])

   const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: cardScale.value }],
      opacity: cardOpacity.value,
   }))

   const animatedHeaderStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: headerTranslateY.value }],
   }))

   const animatedFoodStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: foodItemsTranslateY.value }],
   }))

   const animatedButtonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: buttonScale.value }],
   }))

   // Mock data - trong thực tế sẽ lấy từ context hoặc params
   const mood = 'Energetic'
   const selectedColors = ['red', 'orange']
   const moodInfo = MOOD_DATA[mood as keyof typeof MOOD_DATA]

   const handleMapPress = () => {
      // Animate button press
      buttonScale.value = withSequence(
         withSpring(0.95, { duration: 100 }),
         withSpring(1, { duration: 100 })
      )
      
      // Navigate to map with mood filter and restaurant coordinates
      const restaurantData = {
         mood: mood.toLowerCase(),
         restaurants: [
            { name: 'Phở Bò', lat: 10.5747230, lng: 107.0554590 },
            { name: 'Bún Chả Hà Nội', lat: 10.7858351, lng: 106.6995019 },
            { name: 'Cơm Tấm Sài Gòn', lat: 10.7609741, lng: 106.6314602 }
         ]
      }
      
      setTimeout(() => {
         router.push({
            pathname: '/map',
            params: { 
               mood: mood.toLowerCase(),
               restaurants: JSON.stringify(restaurantData.restaurants)
            }
         })
      }, 200)
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Animated Header */}
         <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
               <Text style={styles.headerTitle}>Kết Quả Mood</Text>
               <Text style={styles.headerSubtitle}>Khám phá tâm trạng của bạn</Text>
            </View>
            <TouchableOpacity style={styles.shareButton}>
               <Ionicons name="share-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
         </Animated.View>

         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Mood Result Card with Gradient */}
            <Animated.View style={[styles.moodCard, animatedCardStyle]}>
               <LinearGradient
                  colors={moodInfo.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.moodHeader}
               >
                  <View style={styles.moodEmojiContainer}>
                     <Text style={styles.moodEmoji}>{moodInfo.emoji}</Text>
                  </View>
                  <Text style={styles.moodTitle}>{moodInfo.title}</Text>
                  <Text style={styles.moodSubtitle}>{moodInfo.subtitle}</Text>
                  <Text style={styles.moodDescription}>{moodInfo.description}</Text>
                  
                  {/* Mood Stats */}
                  <View style={styles.moodStats}>
                     <View style={styles.statItem}>
                        <Text style={styles.statNumber}>95%</Text>
                        <Text style={styles.statLabel}>Tương thích</Text>
                     </View>
                     <View style={styles.statDivider} />
                     <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{selectedColors.length}</Text>
                        <Text style={styles.statLabel}>Màu chọn</Text>
                     </View>
                     <View style={styles.statDivider} />
                     <View style={styles.statItem}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Gợi ý</Text>
                     </View>
                  </View>
               </LinearGradient>

               {/* Selected Colors with Animation */}
               <View style={styles.colorsSection}>
                  <Text style={styles.sectionTitle}>🎨 Màu sắc bạn đã chọn</Text>
                  <View style={styles.selectedColorsContainer}>
                     {selectedColors.map((colorId, index) => (
                        <View key={colorId} style={styles.colorDot}>
                           <View
                              style={[
                                 styles.colorCircle,
                                 { backgroundColor: getColorById(colorId) },
                              ]}
                           />
                           <Text style={styles.colorName}>{getColorName(colorId)}</Text>
                        </View>
                     ))}
                  </View>
               </View>

               {/* Food Recommendations */}
               <Animated.View style={[styles.foodSection, animatedFoodStyle]}>
                  <View style={styles.sectionHeader}>
                     <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitle}>🍽️ Gợi ý món ăn phù hợp</Text>
                     </View>
                     <TouchableOpacity 
                        style={styles.viewAllButton}
                        onPress={() => setShowAllFoods(!showAllFoods)}
                     >
                        <Text style={styles.viewAllText}>
                           {showAllFoods ? 'Thu gọn' : 'Xem tất cả'}
                        </Text>
                        <Ionicons 
                           name={showAllFoods ? "chevron-up" : "chevron-forward"} 
                           size={16} 
                           color="#8B5CF6" 
                        />
                     </TouchableOpacity>
                  </View>
                  
                  {(showAllFoods ? moodInfo.foods : moodInfo.foods.slice(0, 3)).map((food, index) => (
                     <View key={index} style={styles.foodItem}>
                        <Image
                           source={{ uri: food.image }}
                           style={styles.foodImage}
                           contentFit="cover"
                        />
                        <View style={styles.foodInfo}>
                           <View style={styles.foodHeader}>
                              <Text style={styles.foodName}>{food.name}</Text>
                              <View style={styles.ratingContainer}>
                                 <Ionicons name="star" size={14} color="#FFD700" />
                                 <Text style={styles.ratingText}>{food.rating}</Text>
                              </View>
                           </View>
                           
                           <View style={styles.foodTags}>
                              {food.tags.map((tag, tagIndex) => (
                                 <View key={tagIndex} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                 </View>
                              ))}
                           </View>
                           
                           <View style={styles.foodMeta}>
                              <View style={styles.metaItem}>
                                 <Ionicons name="cash-outline" size={14} color="#6B7280" />
                                 <Text style={styles.metaText}>{food.price}</Text>
                              </View>
                              <View style={styles.metaItem}>
                                 <Ionicons name="location-outline" size={14} color="#6B7280" />
                                 <Text style={styles.metaText}>{food.distance}</Text>
                              </View>
                           </View>
                        </View>
                        
                        <TouchableOpacity style={styles.orderButton}>
                           <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                     </View>
                  ))}
               </Animated.View>

               {/* Recommendations */}
               <View style={styles.recommendationsSection}>
                  <Text style={styles.sectionTitle}>💡 Lời khuyên cho bạn</Text>
                  {moodInfo.recommendations.map((rec, index) => (
                     <View key={index} style={styles.recommendationItem}>
                        <View style={styles.recommendationIcon}>
                           <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        </View>
                        <Text style={styles.recommendationText}>{rec}</Text>
                     </View>
                  ))}
               </View>
            </Animated.View>
         </ScrollView>

         {/* Action Buttons */}
         <Animated.View style={[styles.footer, animatedButtonStyle]}>
            <TouchableOpacity
               style={styles.tryAgainButton}
               onPress={() => router.push('/mood/mood-quiz')}
            >
               <Ionicons name="refresh" size={20} color="#8B5CF6" />
               <Text style={styles.tryAgainText}>Thử lại</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
               style={styles.mapButton}
               onPress={handleMapPress}
            >
               <Ionicons name="map" size={20} color="white" />
               <Text style={styles.mapButtonText}>Xem trên bản đồ</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
               style={styles.homeButton}
               onPress={() => router.push('/')}
            >
               <Ionicons name="home" size={20} color="white" />
               <Text style={styles.homeButtonText}>Trang chủ</Text>
            </TouchableOpacity>
         </Animated.View>
      </SafeAreaView>
   )
}

const getColorById = (colorId: string): string => {
   const colorMap: { [key: string]: string } = {
      red: '#FF1744',
      orange: '#FF6F00',
      yellow: '#FBC02D',
      green: '#388E3C',
      blue: '#1976D2',
      purple: '#7B1FA2',
      pink: '#E91E63',
      gray: '#607D8B',
      brown: '#8D6E63',
      teal: '#009688',
      indigo: '#3F51B5',
      rose: '#C2185B',
      lime: '#8BC34A',
      cyan: '#00BCD4',
      amber: '#FF9800',
      emerald: '#4CAF50',
      violet: '#9C27B0',
      fuchsia: '#E91E63',
      slate: '#546E7A',
      zinc: '#757575',
   }
   return colorMap[colorId] || '#6B7280'
}

const getColorName = (colorId: string): string => {
   const nameMap: { [key: string]: string } = {
      red: 'Đỏ',
      orange: 'Cam',
      yellow: 'Vàng',
      green: 'Xanh lá',
      blue: 'Xanh dương',
      purple: 'Tím',
      pink: 'Hồng',
      gray: 'Xám',
      brown: 'Nâu',
      teal: 'Xanh ngọc',
      indigo: 'Chàm',
      rose: 'Hồng đậm',
      lime: 'Lime',
      cyan: 'Cyan',
      amber: 'Amber',
      emerald: 'Emerald',
      violet: 'Violet',
      fuchsia: 'Fuchsia',
      slate: 'Slate',
      zinc: 'Zinc',
   }
   return nameMap[colorId] || 'Unknown'
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#F9FAFB',
   },
   headerCenter: {
      alignItems: 'center',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
   },
   headerSubtitle: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 2,
   },
   shareButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#F9FAFB',
   },
   content: {
      flex: 1,
   },
   moodCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      margin: 20,
   },
   moodHeader: {
      padding: 24,
      alignItems: 'center',
   },
   moodEmojiContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
   },
   moodEmoji: {
      fontSize: 40,
   },
   moodTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 8,
   },
   moodSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      marginBottom: 12,
   },
   moodDescription: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 20,
   },
   moodStats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.2)',
   },
   statItem: {
      alignItems: 'center',
   },
   statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
   },
   statLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: 2,
   },
   statDivider: {
      width: 1,
      height: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
   },
   colorsSection: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 16,
   },
   selectedColorsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
   },
   colorDot: {
      alignItems: 'center',
   },
   colorCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      marginBottom: 8,
   },
   colorName: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
   },
   foodSection: {
      padding: 20,
   },
   sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
   },
   sectionTitleContainer: {
      flex: 1,
      alignItems: 'flex-start',
   },
   viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
   },
   viewAllText: {
      fontSize: 14,
      color: '#8B5CF6',
      fontWeight: '500',
      marginRight: 4,
   },
   foodItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   foodImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
   },
   foodInfo: {
      flex: 1,
   },
   foodHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
   },
   foodName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
   },
   ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   ratingText: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 4,
   },
   foodTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 8,
   },
   tag: {
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
   },
   tagText: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
   },
   foodMeta: {
      flexDirection: 'row',
      gap: 16,
   },
   metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   metaText: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
   },
   orderButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#8B5CF6',
      justifyContent: 'center',
      alignItems: 'center',
   },
   recommendationsSection: {
      padding: 20,
      backgroundColor: '#F9FAFB',
   },
   recommendationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
   },
   recommendationIcon: {
      marginRight: 12,
   },
   recommendationText: {
      fontSize: 14,
      color: '#374151',
      lineHeight: 20,
      flex: 1,
   },
   footer: {
      flexDirection: 'row',
      padding: 16,
      gap: 8,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
   },
   tryAgainButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F3F4F6',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 10,
   },
   tryAgainText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#8B5CF6',
      marginLeft: 6,
   },
   mapButton: {
      flex: 1.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#8B5CF6',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 10,
   },
   mapButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'white',
      marginLeft: 6,
   },
   homeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#10B981',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 10,
   },
   homeButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: 'white',
      marginLeft: 6,
   },
}) 