import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

interface RestaurantSearchBarProps {
   searchQuery: string
   onSearchChange: (query: string) => void
   onClearSearch: () => void
   onMyLocation?: () => void
}

export default function RestaurantSearchBar({
   searchQuery,
   onSearchChange,
   onClearSearch,
   onMyLocation,
}: RestaurantSearchBarProps) {
   return (
      <View style={styles.container}>
         <View style={styles.searchContainer}>
            {/* Google Maps Icon */}
            <View style={styles.googleIcon}>
               <Ionicons name="map" size={24} color="#4285F4" />
            </View>
            
            {/* Search Input */}
            <TextInput
               style={styles.textInput}
               placeholder="Tìm kiếm ở đây"
               value={searchQuery}
               onChangeText={onSearchChange}
               placeholderTextColor="#5F6368"
            />
            
            {/* Right Icons */}
            <View style={styles.rightIcons}>
               {searchQuery.length > 0 ? (
                  <TouchableOpacity onPress={onClearSearch} style={styles.iconButton}>
                     <Ionicons name="close-circle" size={20} color="#5F6368" />
                  </TouchableOpacity>
               ) : (
                  <>
                     <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="mic" size={20} color="#5F6368" />
                     </TouchableOpacity>
                  </>
               )}
               
               {/* Profile Avatar */}
               <TouchableOpacity style={styles.profileButton} onPress={onMyLocation}>
                  <View style={styles.profileCircle}>
                     <Ionicons name="person" size={16} color="#fff" />
                  </View>
               </TouchableOpacity>
            </View>
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
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 10,
      height: 56,
   },
   googleIcon: {
      marginRight: 12,
   },
   textInput: {
      flex: 1,
      fontSize: 16,
      color: '#202124',
      fontWeight: '400',
   },
   rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   iconButton: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
   },
   profileButton: {
      marginLeft: 4,
   },
   profileCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#34A853',
      justifyContent: 'center',
      alignItems: 'center',
   },
})
