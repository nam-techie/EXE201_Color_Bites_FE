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
const MENU_WIDTH = 320

interface MapSideMenuProps {
  visible: boolean
  onClose: () => void
  onNavigateToSavedPlaces?: () => void
  onNavigateToMyPlaces?: () => void
  onNavigateToHistory?: () => void
}

export default function MapSideMenu({
  visible,
  onClose,
  onNavigateToSavedPlaces,
  onNavigateToMyPlaces,
  onNavigateToHistory,
}: MapSideMenuProps) {
  const slideAnim = React.useRef(new Animated.Value(-MENU_WIDTH)).current

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start()
    }
  }, [visible, slideAnim])

  const menuItems = [
    {
      id: 'saved',
      title: 'Địa điểm đã lưu',
      subtitle: 'Xem các địa điểm bạn đã lưu',
      icon: 'bookmark' as const,
      iconColor: '#F59E0B',
      onPress: onNavigateToSavedPlaces,
    },
    {
      id: 'my-places',
      title: 'Quán đã tạo',
      subtitle: 'Quản lý quán của bạn',
      icon: 'restaurant' as const,
      iconColor: '#EF4444',
      onPress: onNavigateToMyPlaces,
    },
    {
      id: 'history',
      title: 'Lịch sử',
      subtitle: 'Xem lịch sử tìm kiếm và ghé thăm',
      icon: 'time' as const,
      iconColor: '#3B82F6',
      onPress: onNavigateToHistory,
    },
  ]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Overlay - tap to close */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* Menu content */}
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
                <Ionicons name="map" size={28} color="#F97316" />
              </View>
              <Text style={styles.menuTitle}>Color Bites</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContent}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === 0 && styles.firstMenuItem,
                ]}
                onPress={() => {
                  item.onPress?.()
                  onClose()
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${item.iconColor}15` },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Menu Footer */}
          <View style={styles.menuFooter}>
            <Text style={styles.footerText}>
              Version 1.0.0 • Made with ❤️
            </Text>
          </View>
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
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
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  firstMenuItem: {
    borderTopWidth: 0,
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

