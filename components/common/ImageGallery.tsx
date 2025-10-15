import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import {
    Dimensions,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import PagerView from 'react-native-pager-view'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface ImageGalleryProps {
   imageUrls: string[]
   style?: any
}

export default function ImageGallery({ imageUrls, style }: ImageGalleryProps) {
   const [currentPage, setCurrentPage] = useState(0)
   const [modalVisible, setModalVisible] = useState(false)
   const [modalIndex, setModalIndex] = useState(0)

   // Animation values
   const scaleValue = useSharedValue(1)

   // Animated styles
   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
   }))

   if (!imageUrls || imageUrls.length === 0) {
      return null
   }

   const handleImagePress = (index: number) => {
      scaleValue.value = withSpring(0.95, { duration: 100 }, () => {
         scaleValue.value = withSpring(1, { duration: 100 })
      })
      setModalIndex(index)
      setModalVisible(true)
   }

   const closeModal = () => {
      setModalVisible(false)
   }

   // Single image display
   if (imageUrls.length === 1) {
      return (
         <>
            <TouchableOpacity 
               onPress={() => handleImagePress(0)}
               style={[styles.singleImageContainer, style]}
               activeOpacity={0.9}
            >
               <Animated.View style={animatedStyle}>
                  <Image
                     source={{ uri: imageUrls[0] }}
                     style={styles.singleImage}
                     contentFit="cover"
                     transition={300}
                  />
               </Animated.View>
            </TouchableOpacity>

            <ImageModal
               visible={modalVisible}
               imageUrls={imageUrls}
               initialIndex={modalIndex}
               onClose={closeModal}
            />
         </>
      )
   }

   // Multiple images display with pager
   return (
      <>
         <View style={[styles.galleryContainer, style]}>
            <PagerView
               style={styles.pagerView}
               initialPage={0}
               onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
               {imageUrls.map((imageUrl, index) => (
                  <TouchableOpacity
                     key={index}
                     onPress={() => handleImagePress(index)}
                     style={styles.pageContainer}
                     activeOpacity={0.9}
                  >
                     <Animated.View style={animatedStyle}>
                        <Image
                           source={{ uri: imageUrl }}
                           style={styles.pageImage}
                           contentFit="cover"
                           transition={300}
                        />
                     </Animated.View>
                  </TouchableOpacity>
               ))}
            </PagerView>

            {/* Page indicator */}
            <View style={styles.pageIndicator}>
               <View style={styles.indicatorContainer}>
                  <Text style={styles.indicatorText}>
                     {currentPage + 1} / {imageUrls.length}
                  </Text>
               </View>
            </View>

            {/* Navigation dots */}
            <View style={styles.dotsContainer}>
               {imageUrls.map((_, index) => (
                  <View
                     key={index}
                     style={[
                        styles.dot,
                        currentPage === index ? styles.activeDot : styles.inactiveDot,
                     ]}
                  />
               ))}
            </View>
         </View>

         <ImageModal
            visible={modalVisible}
            imageUrls={imageUrls}
            initialIndex={modalIndex}
            onClose={closeModal}
         />
      </>
   )
}

// Full screen image modal
interface ImageModalProps {
   visible: boolean
   imageUrls: string[]
   initialIndex: number
   onClose: () => void
}

function ImageModal({ visible, imageUrls, initialIndex, onClose }: ImageModalProps) {
   const [currentIndex, setCurrentIndex] = useState(initialIndex)

   React.useEffect(() => {
      setCurrentIndex(initialIndex)
   }, [initialIndex])

   if (!visible) return null

   return (
      <Modal
         visible={visible}
         transparent={false}
         animationType="fade"
         statusBarTranslucent
      >
         <StatusBar hidden />
         <View style={styles.modalContainer}>
            {/* Close button */}
            <TouchableOpacity
               style={styles.closeButton}
               onPress={onClose}
            >
               <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Image counter */}
            {imageUrls.length > 1 && (
               <View style={styles.modalCounter}>
                  <Text style={styles.modalCounterText}>
                     {currentIndex + 1} / {imageUrls.length}
                  </Text>
               </View>
            )}

            {/* Image pager */}
            <PagerView
               style={styles.modalPager}
               initialPage={initialIndex}
               onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
            >
               {imageUrls.map((imageUrl, index) => (
                  <View key={index} style={styles.modalPage}>
                     <Image
                        source={{ uri: imageUrl }}
                        style={styles.modalImage}
                        contentFit="contain"
                        transition={300}
                     />
                  </View>
               ))}
            </PagerView>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   // Single image styles
   singleImageContainer: {
      width: '100%',
      height: 320,
      position: 'relative',
   },
   singleImage: {
      width: '100%',
      height: '100%',
   },

   // Gallery styles
   galleryContainer: {
      width: '100%',
      height: 320,
      position: 'relative',
   },
   pagerView: {
      flex: 1,
   },
   pageContainer: {
      width: '100%',
      height: '100%',
   },
   pageImage: {
      width: '100%',
      height: '100%',
   },

   // Indicators
   pageIndicator: {
      position: 'absolute',
      top: 12,
      right: 12,
   },
   indicatorContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   indicatorText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
   },

   // Dots
   dotsContainer: {
      position: 'absolute',
      bottom: 12,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
   },
   dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginHorizontal: 3,
   },
   activeDot: {
      backgroundColor: '#FFFFFF',
   },
   inactiveDot: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
   },

   // Modal styles
   modalContainer: {
      flex: 1,
      backgroundColor: '#000000',
   },
   closeButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 20,
      padding: 8,
   },
   modalCounter: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
   },
   modalCounterText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
   },
   modalPager: {
      flex: 1,
   },
   modalPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   modalImage: {
      width: screenWidth,
      height: screenHeight,
   },
})
