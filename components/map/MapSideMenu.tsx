import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { width } = Dimensions.get('window')
const MENU_WIDTH = width * 0.8 // 80% màn hình

interface MapSideMenuProps {
   visible: boolean
   onClose: () => void
   onNavigateToRestaurantList?: () => void
}

export default function MapSideMenu({
   visible,
   onClose,
   onNavigateToRestaurantList,
}: MapSideMenuProps) {
   const slideAnim = React.useRef(new Animated.Value(-MENU_WIDTH)).current
   const overlayOpacity = React.useRef(new Animated.Value(0)).current

   React.useEffect(() => {
      if (visible) {
         // Animate menu slide in từ trái
         Animated.parallel([
            Animated.spring(slideAnim, {
               toValue: 0,
               useNativeDriver: true,
               tension: 65,
               friction: 11,
            }),
            Animated.timing(overlayOpacity, {
               toValue: 1,
               duration: 300,
               useNativeDriver: true,
            }),
         ]).start()
      } else {
         // Animate menu slide out về trái
         Animated.parallel([
            Animated.timing(slideAnim, {
               toValue: -MENU_WIDTH,
               duration: 250,
               useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
               toValue: 0,
               duration: 250,
               useNativeDriver: true,
            }),
         ]).start()
      }
   }, [visible, slideAnim, overlayOpacity])

   return (
      <Modal
         visible={visible}
         transparent
         animationType="none"
         onRequestClose={onClose}
      >
         <View style={styles.modalContainer}>
            {/* Menu content - ĐẶT TRƯỚC overlay để hiển thị bên trái */}
            <Animated.View
               style={[
                  styles.menuContainer,
                  {
                     transform: [{ translateX: slideAnim }],
                  },
               ]}
            >
               {/* Menu Header */}
               <View style={styles.menuHeader}>
                  <View style={styles.headerContent}>
                     <View style={styles.appIconContainer}>
                        <Ionicons name="restaurant" size={28} color="#F97316" />
                     </View>
                     <Text style={styles.menuTitle}>Mummi</Text>
                  </View>
                  <TouchableOpacity
                     style={styles.closeButton}
                     onPress={onClose}
                     hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                     <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
               </View>

               {/* Menu Items - Chỉ có 1 item */}
               <View style={styles.menuContent}>
                  <TouchableOpacity
                     style={styles.menuItem}
                     onPress={() => {
                        onNavigateToRestaurantList?.()
                        onClose()
                     }}
                     activeOpacity={0.7}
                  >
                     <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                        <Ionicons name="list" size={24} color="#F59E0B" />
                     </View>
                     <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemTitle}>Tất cả nhà hàng</Text>
                        <Text style={styles.menuItemSubtitle}>Xem danh sách tất cả nhà hàng</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
               </View>

               {/* Menu Footer */}
               <View style={styles.menuFooter}>
                  <Text style={styles.footerText}>Version 1.0.0 • Made with ❤️</Text>
               </View>
            </Animated.View>

            {/* Overlay - tap to close, ĐẶT SAU menu */}
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
               <Pressable style={styles.overlayPressable} onPress={onClose} />
            </Animated.View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   modalContainer: {
      flex: 1,
      flexDirection: 'row',
   },
   overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1,
   },
   overlayPressable: {
      flex: 1,
   },
   menuContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: MENU_WIDTH,
      height: '100%',
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {
         width: 2,
         height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 10,
      zIndex: 2, // Menu nằm trên overlay
   },
   menuHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
   },
   appIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFF7ED',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
   },
   menuTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#111827',
   },
   closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   menuContent: {
      flex: 1,
      paddingTop: 16,
   },
   menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: '#FFFBEB',
      marginHorizontal: 16,
      borderRadius: 12,
   },
   iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
   },
   menuItemContent: {
      flex: 1,
   },
   menuItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 4,
   },
   menuItemSubtitle: {
      fontSize: 13,
      color: '#6B7280',
   },
   menuFooter: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      alignItems: 'center',
   },
   footerText: {
      fontSize: 12,
      color: '#9CA3AF',
   },
})
