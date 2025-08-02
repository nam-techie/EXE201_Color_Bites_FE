import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Tabs, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
   Dimensions,
   Image,
   Pressable,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'
import Toast from 'react-native-toast-message'

const { width } = Dimensions.get('window')

export default function TabLayout() {
   const [showDropdown, setShowDropdown] = useState(false)
   const router = useRouter()
   const [isLoggedIn, setIsLoggedIn] = useState(false)
   useEffect(() => {
      const checkToken = async () => {
         const token = await AsyncStorage.getItem('access_token')
         setIsLoggedIn(!!token)
      }

      checkToken()
      if (showDropdown) checkToken()
   }, [showDropdown])

   const handleOptionPress = async (option: string) => {
      setShowDropdown(false)

      if (option === 'Đăng ký') {
         router.push('/auth/register')
      } else if (option === 'Đăng nhập') {
         router.push('/auth/login')
      } else if (option === 'Đăng xuất') {
         await AsyncStorage.removeItem('access_token')
         setIsLoggedIn(false)

         Toast.show({
            type: 'success',
            text1: 'Đăng xuất thành công',
         })

         router.replace('/')
      }
   }

   return (
      <View style={{ flex: 1 }}>
         <Tabs
            screenOptions={({ route }) => ({
               tabBarIcon: ({ focused, color, size }) => {
                  let iconName: keyof typeof Ionicons.glyphMap

                  if (route.name === 'index') {
                     iconName = focused ? 'home' : 'home-outline'
                  } else if (route.name === 'explore') {
                     iconName = focused ? 'search' : 'search-outline'
                  } else if (route.name === 'create') {
                     iconName = focused ? 'add-circle' : 'add-circle-outline'
                  } else if (route.name === 'map') {
                     iconName = focused ? 'map' : 'map-outline'
                  } else if (route.name === 'profile') {
                     iconName = focused ? 'person' : 'person-outline'
                  } else {
                     iconName = 'home-outline'
                  }

                  return <Ionicons name={iconName} size={size} color={color} />
               },
               tabBarActiveTintColor: '#f97316',
               tabBarInactiveTintColor: '#6b7280',
               headerShown: true,
               headerLeft: () => (
                  <View style={styles.headerLeft}>
                     <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                     />
                     <Text style={styles.logoText}>ColorBite</Text>
                  </View>
               ),
               headerRight: () => (
                  <TouchableOpacity
                     onPress={() => setShowDropdown((prev) => !prev)}
                     style={{ marginRight: 16 }}
                  >
                     <Ionicons name="person-circle-outline" size={26} color="#374151" />
                  </TouchableOpacity>
               ),
               tabBarStyle: {
                  backgroundColor: 'white',
                  borderTopWidth: 1,
                  borderTopColor: '#e5e7eb',
                  paddingBottom: 5,
                  paddingTop: 5,
                  height: 60,
               },
            })}
         >
            <Tabs.Screen name="index" options={{ title: 'Home', headerTitle: '' }} />

            <Tabs.Screen
               name="explore"
               options={{ title: 'Explore', headerTitle: '', headerShown: false }}
            />
            <Tabs.Screen
               name="create"
               options={{ title: 'Create', headerTitle: '', headerShown: false }}
            />
            <Tabs.Screen
               name="map"
               options={{ title: 'Map', headerTitle: '', headerShown: false }}
            />
            <Tabs.Screen
               name="profile"
               options={{ title: 'Profile', headerTitle: '', headerShown: false }}
            />
         </Tabs>

         {showDropdown && (
            <View style={StyleSheet.absoluteFill}>
               <Pressable style={{ flex: 1 }} onPress={() => setShowDropdown(false)} />
               <View style={styles.overlay}>
                  <View style={styles.dropdown}>
                     {!isLoggedIn ? (
                        <>
                           <Pressable onPress={() => handleOptionPress('Đăng ký')}>
                              <Text style={styles.dropdownItem}>Đăng ký</Text>
                           </Pressable>
                           <Pressable onPress={() => handleOptionPress('Đăng nhập')}>
                              <Text style={styles.dropdownItem}>Đăng nhập</Text>
                           </Pressable>
                        </>
                     ) : (
                        <>
                           <Pressable onPress={() => handleOptionPress('Đăng xuất')}>
                              <Text style={styles.dropdownItem}>Đăng xuất</Text>
                           </Pressable>
                        </>
                     )}
                  </View>
               </View>
            </View>
         )}
      </View>
   )
}

const styles = StyleSheet.create({
   headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
   },
   logo: {
      width: 24,
      height: 24,
      marginRight: 6,
      borderRadius: 6,
   },
   logoText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#f97316',
   },
   overlay: {
      position: 'absolute',
      top: 78,
      right: 16,
      zIndex: 999,
   },
   dropdown: {
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      paddingVertical: 4,
      width: 140,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
   },
   dropdownItem: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      fontSize: 14,
      color: '#374151',
   },
})
