import { ROUTE_PROFILES } from '@/type/index'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface RouteProfileSelectorProps {
   selectedProfile: string
   onProfileChange: (profile: string) => void
   visible: boolean
}

export default function RouteProfileSelector({
   selectedProfile,
   onProfileChange,
   visible,
}: RouteProfileSelectorProps) {
   if (!visible) return null

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Chọn phương tiện di chuyển</Text>
         <View style={styles.profilesContainer}>
            {ROUTE_PROFILES.map((profile) => (
               <TouchableOpacity
                  key={profile.id}
                  style={[
                     styles.profileButton,
                     selectedProfile === profile.id && styles.selectedProfile,
                  ]}
                  onPress={() => onProfileChange(profile.id)}
               >
                  <Ionicons
                     name={profile.icon as any}
                     size={24}
                     color={selectedProfile === profile.id ? '#3B82F6' : '#6B7280'}
                  />
                  <Text
                     style={[
                        styles.profileText,
                        selectedProfile === profile.id && styles.selectedProfileText,
                     ]}
                  >
                     {profile.name}
                  </Text>
                  <Text
                     style={[
                        styles.profileDescription,
                        selectedProfile === profile.id && styles.selectedProfileDescription,
                     ]}
                  >
                     {profile.description}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      top: 165,
      left: 16,
      right: 16,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 12,
      textAlign: 'center',
   },
   profilesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   profileButton: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      marginHorizontal: 4,
      borderRadius: 8,
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: '#E5E7EB',
   },
   selectedProfile: {
      backgroundColor: '#EBF4FF',
      borderColor: '#3B82F6',
   },
   profileText: {
      marginTop: 4,
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '500',
      textAlign: 'center',
   },
   selectedProfileText: {
      color: '#3B82F6',
   },
   profileDescription: {
      marginTop: 2,
      fontSize: 10,
      color: '#9CA3AF',
      textAlign: 'center',
   },
   selectedProfileDescription: {
      color: '#60A5FA',
   },
})
