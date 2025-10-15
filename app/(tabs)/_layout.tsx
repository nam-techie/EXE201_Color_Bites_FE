import { Ionicons } from '@expo/vector-icons'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Tabs } from 'expo-router'
import { StyleSheet, View } from 'react-native'

export default function TabLayout() {
   return (
      <Tabs
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
               let iconName: keyof typeof Ionicons.glyphMap

               if (route.name === 'index') {
                  iconName = focused ? 'home' : 'home-outline'
               } else if (route.name === 'community') {
                  iconName = focused ? 'people' : 'people-outline'
               } else if (route.name === 'map') {
                  iconName = focused ? 'map' : 'map-outline'
               } else if (route.name === 'challenge') {
                  iconName = focused ? 'trophy' : 'trophy-outline'
               } else if (route.name === 'profile') {
                  iconName = focused ? 'person' : 'person-outline'
               } else {
                  iconName = 'home-outline'
               }

               // Special styling for Map tab
               if (route.name === 'map') {
                  return (
                     <View style={styles.mapButtonContainer}>
                        <LinearGradient
                           colors={['#FF6B35', '#FF1493']}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 0, y: 1 }}
                           style={styles.mapButton}
                        >
                           <Ionicons name={iconName} size={28} color="white" />
                        </LinearGradient>
                     </View>
                  )
               }

               // Gradient styling for other active tabs
               if (focused && route.name !== 'map') {
                  return (
                     <MaskedView
                        style={styles.maskedView}
                        maskElement={
                           <Ionicons 
                              name={iconName} 
                              size={size} 
                              color="white" 
                           />
                        }
                     >
                        <LinearGradient
                           colors={['#FF6B35', '#FF1493']}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 1, y: 0 }}
                           style={styles.gradientMask}
                        />
                     </MaskedView>
                  )
               }

               return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#FF1493',
            tabBarInactiveTintColor: '#6b7280',
            headerShown: false,
            tabBarStyle: {
               backgroundColor: 'white',
               borderTopWidth: 0,
               paddingBottom: 8,
               paddingTop: 8,
               height: 80,
               elevation: 0,
               shadowOpacity: 0,
            },
            tabBarLabelStyle: {
               fontSize: 12,
               fontWeight: '500',
               marginTop: 4,
            },
         })}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: 'Home',
               tabBarIconStyle: {
                  marginTop: 0,
               },
            }}
         />
         <Tabs.Screen
            name="community"
            options={{
               title: 'Community',
            }}
         />
         <Tabs.Screen
            name="map"
            options={{
               title: 'Map',
               tabBarIconStyle: {
                  marginTop: -20,
               },
               tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: '600',
                  marginTop: 24,
                  color: '#FF1493',
               },
            }}
         />
         <Tabs.Screen
            name="challenge"
            options={{
               title: 'Challenge',
            }}
         />
         <Tabs.Screen
            name="profile"
            options={{
               title: 'Profile',
            }}
         />
      </Tabs>
   )
}

const styles = StyleSheet.create({
   mapButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   mapButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF1493',
      shadowOffset: {
         width: 0,
         height: 6,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 12,
   },
   maskedView: {
      width: 24,
      height: 24,
   },
   gradientMask: {
      flex: 1,
   },
})
