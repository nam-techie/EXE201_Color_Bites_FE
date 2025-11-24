import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import {
   ActivityIndicator,
   FlatList,
   Keyboard,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native'

export interface Suggestion {
   place_id: string
   description: string
   structured_formatting?: {
      main_text: string
      secondary_text: string
   }
}

interface RestaurantSearchBarProps {
   searchQuery: string
   onSearchChange: (query: string) => void
   onClearSearch: () => void
   onMenuPress?: () => void
   onAvatarPress?: () => void
   onMicPress?: () => void
   avatarUrl?: string | null
   suggestions?: Suggestion[]
   onSelectSuggestion?: (suggestion: Suggestion) => void
   loading?: boolean
}

export default function RestaurantSearchBar({
   searchQuery,
   onSearchChange,
   onClearSearch,
   onMenuPress,
   onAvatarPress,
   onMicPress,
   avatarUrl,
   suggestions = [],
   onSelectSuggestion,
   loading = false,
}: RestaurantSearchBarProps) {
   // Handle suggestion selection
   const handleSelectSuggestion = (suggestion: Suggestion) => {
      Keyboard.dismiss()
      if (onSelectSuggestion) {
         onSelectSuggestion(suggestion)
      }
   }

   // Render suggestion item
   const renderSuggestion = ({ item }: { item: Suggestion }) => {
      const mainText = item.structured_formatting?.main_text || item.description
      const secondaryText = item.structured_formatting?.secondary_text

      return (
         <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelectSuggestion(item)}
            activeOpacity={0.7}
         >
            <Ionicons name="location" size={20} color="#5F6368" style={styles.suggestionIcon} />
            <View style={styles.suggestionTextContainer}>
               <Text style={styles.suggestionMainText} numberOfLines={1}>
                  {mainText}
               </Text>
               {secondaryText && (
                  <Text style={styles.suggestionSecondaryText} numberOfLines={1}>
                     {secondaryText}
                  </Text>
               )}
            </View>
         </TouchableOpacity>
      )
   }

   const showSuggestions = suggestions.length > 0 && searchQuery.length >= 2

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
               {loading ? (
                  <ActivityIndicator size="small" color="#9CA3AF" style={styles.loadingIndicator} />
               ) : (
                  searchQuery.length > 0 && (
                     <TouchableOpacity onPress={onClearSearch} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                     </TouchableOpacity>
                  )
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

         {/* Suggestions Dropdown */}
         {showSuggestions && (
            <View style={styles.suggestionsContainer}>
               <FlatList
                  data={suggestions}
                  renderItem={renderSuggestion}
                  keyExtractor={(item) => item.place_id}
                  style={styles.suggestionsList}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
               />
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      top: 8,
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
   // Suggestions dropdown styles
   suggestionsContainer: {
      marginTop: 8,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      maxHeight: 300,
      overflow: 'hidden',
   },
   suggestionsList: {
      flexGrow: 0,
   },
   suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   suggestionIcon: {
      marginRight: 12,
   },
   suggestionTextContainer: {
      flex: 1,
   },
   suggestionMainText: {
      fontSize: 15,
      color: '#111827',
      fontWeight: '500',
   },
   suggestionSecondaryText: {
      fontSize: 13,
      color: '#6B7280',
      marginTop: 2,
   },
   loadingIndicator: {
      marginLeft: 8,
   },
})
