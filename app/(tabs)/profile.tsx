import { uploadUserAvatar } from '@/services/AuthService'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
   Dimensions,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import Toast from 'react-native-toast-message'

const { width } = Dimensions.get('window')

export default function ProfileScreen() {
   const [user, setUser] = useState<any>(null)
   const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0, places: 0 })
   const [uploading, setUploading] = useState(false)
   const router = useRouter()

   useEffect(() => {
      const loadUser = async () => {
         const storedUser = await AsyncStorage.getItem('user')
         if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            setStats({
               posts: parsedUser.postsCount || 0,
               followers: parsedUser.followers || 0,
               following: parsedUser.following || 0,
               places: parsedUser.places || 0,
            })
         }
      }
      loadUser()
   }, [])

   const handlePickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.8,
      })

      if (!result.canceled && user?.id) {
         try {
            setUploading(true)
            const imageUri = result.assets[0].uri
            const newAvatarUrl = await uploadUserAvatar(user.id, imageUri)
            const updatedUser = { ...user, avatar: newAvatarUrl }
            setUser(updatedUser)
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser))

            Toast.show({
               type: 'success',
               text1: '✅ Success',
               text2: 'Avatar updated successfully!',
            })
         } catch (err: any) {
            Toast.show({
               type: 'error',
               text1: 'Upload Failed',
               text2: err.message || 'Something went wrong',
            })
         } finally {
            setUploading(false)
         }
      }
   }

   const handleLogout = async () => {
      await AsyncStorage.removeItem('user')
      Toast.show({
         type: 'success',
         text1: 'Logout Successful',
         text2: 'You have been logged out.',
      })
      setTimeout(() => {
         router.replace('/auth/login')
      }, 1000)
   }

   if (!user) return null

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
               <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            {/* Avatar + Info */}
            <TouchableOpacity onPress={handlePickImage}>
               <Image
                  source={{ uri: user.avatar || 'https://i.pravatar.cc/96' }}
                  style={styles.profileImage}
                  contentFit="cover"
               />
            </TouchableOpacity>

            {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}

            <View style={styles.nameContainer}>
               <Text style={styles.userName}>{user.fullName}</Text>
               <View style={styles.proBadge}>
                  <Ionicons name="star" size={12} color="white" />
                  <Text style={styles.proBadgeText}>PRO</Text>
               </View>
            </View>

            <Text style={styles.userBio}>
               @{user.username} | {user.email}
            </Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
               {['Posts', 'Followers', 'Following', 'Places'].map((label, idx) => (
                  <View style={styles.statItem} key={label}>
                     <Text style={styles.statNumber}>{Object.values(stats)[idx]}</Text>
                     <Text style={styles.statLabel}>{label}</Text>
                  </View>
               ))}
            </View>

            {/* Edit Profile */}
            <TouchableOpacity style={styles.editProfileButton}>
               <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
               <Ionicons name="log-out-outline" size={18} color="white" />
               <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#fff' },
   content: { padding: 20, alignItems: 'center' },
   header: { marginBottom: 16, width: '100%' },
   headerTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
   profileImage: { width: 100, height: 100, borderRadius: 50 },
   uploadingText: { marginTop: 6, color: 'gray', fontSize: 12 },
   nameContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
   userName: { fontSize: 20, fontWeight: '600' },
   proBadge: {
      flexDirection: 'row',
      backgroundColor: '#6366F1',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      alignItems: 'center',
      gap: 4,
   },
   proBadgeText: { color: 'white', fontSize: 12 },
   userBio: { color: '#6B7280', fontSize: 14, marginTop: 4 },
   statsContainer: {
      flexDirection: 'row',
      marginTop: 20,
      gap: 20,
      justifyContent: 'center',
      flexWrap: 'wrap',
   },
   statItem: { alignItems: 'center', width: 70 },
   statNumber: { fontWeight: 'bold', fontSize: 16 },
   statLabel: { fontSize: 12, color: '#6B7280' },
   editProfileButton: {
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 16,
      marginTop: 20,
   },
   editProfileButtonText: { fontSize: 14, fontWeight: '600', color: '#374151' },
   logoutButton: {
      flexDirection: 'row',
      marginTop: 30,
      backgroundColor: '#EF4444',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 16,
      alignItems: 'center',
      gap: 8,
   },
   logoutText: { color: 'white', fontWeight: '600', fontSize: 14 },
})
