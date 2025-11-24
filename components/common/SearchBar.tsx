import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

interface RestaurantSearchBarProps {
   searchQuery: string
   onSearchChange: (query: string) => void
   onClearSearch: () => void
   onMenuPress?: () => void
   onAvatarPress?: () => void
   onMicPress?: () => void
   avatarUrl?: string | null
}

export default function RestaurantSearchBar({
   searchQuery,
   onSearchChange,
   onClearSearch,
   onMenuPress,
   onAvatarPress,
   onMicPress,
   avatarUrl,
}: RestaurantSearchBarProps) {
   return (
      <View style={styles.container}>
         <View style={styles.searchContainer}>
            {/* Hamburger Menu Icon */}
            <TouchableOpacity
               style={styles.menuButton}
               onPress={onMenuPress}
               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
               <Ionicons name="menu" size={24} color="#5F6368" />
            </TouchableOpacity>

            {/* Search Input */}
            <View style={styles.inputWrapper}>
               <TextInput
                  style={styles.textInput}
                  placeholder="Tìm kiếm ở đây"
                  value={searchQuery}
                  onChangeText={onSearchChange}
                  placeholderTextColor="#9CA3AF"
               />
               {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
                     <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
               )}
            </View>

            {/* Microphone Icon (UI only) */}
            <TouchableOpacity
               style={styles.micButton}
               onPress={onMicPress}
               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
               <Ionicons name="mic" size={20} color="#5F6368" />
            </TouchableOpacity>

            {/* User Avatar */}
            <TouchableOpacity
               style={styles.avatarButton}
               onPress={onAvatarPress}
               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
               {avatarUrl ? (
                  <Image
                     source={{ uri: avatarUrl }}
                     style={styles.avatar}
                     contentFit="cover"
                  />
               ) : (
                  <View style={styles.avatarPlaceholder}>
                     <Ionicons name="person" size={20} color="#F97316" />
                  </View>
               )}
            </TouchableOpacity>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      top: 48,
      left: 16,
      right: 16,
      zIndex: 10,
   },
   searchContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 28,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      height: 56,
   },
   menuButton: {
      marginRight: 12,
   },
   inputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
   },
   textInput: {
      flex: 1,
      fontSize: 16,
      color: '#111827',
   },
   clearButton: {
      marginLeft: 8,
   },
   micButton: {
      marginLeft: 12,
      marginRight: 12,
   },
   avatarButton: {
      marginLeft: 4,
   },
   avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
   },
   avatarPlaceholder: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#FFF7ED',
      alignItems: 'center',
      justifyContent: 'center',
   },
})
