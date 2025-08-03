import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

interface RestaurantSearchBarProps {
   searchQuery: string
   onSearchChange: (query: string) => void
   onClearSearch: () => void
}

export default function RestaurantSearchBar({
   searchQuery,
   onSearchChange,
   onClearSearch,
}: RestaurantSearchBarProps) {
   return (
      <View style={styles.container}>
         <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
               style={styles.textInput}
               placeholder="Tìm kiếm nhà hàng..."
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
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: '#f3f4f6',
   },
   searchIcon: {
      marginRight: 12,
   },
   textInput: {
      flex: 1,
      fontSize: 16,
      color: '#1f2937',
      fontWeight: '500',
   },
   clearButton: {
      marginLeft: 8,
      padding: 4,
   },
})
