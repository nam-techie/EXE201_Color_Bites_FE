import { scaleModerate } from '@/utils/responsive'
import { Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayout() {
   const insets = useSafeAreaInsets()
   const TAB_HEIGHT = scaleModerate(56)

   return (
      <Tabs
         screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
               let iconName: keyof typeof Feather.glyphMap

               if (route.name === 'index') {
                  iconName = 'home'
               } else if (route.name === 'explore') {
                  iconName = 'search'
               } else if (route.name === 'create') {
                  iconName = 'plus-circle'
               } else if (route.name === 'map') {
                  iconName = 'map'
               } else if (route.name === 'profile') {
                  iconName = 'user'
               } else {
                  iconName = 'home'
               }

               return (
                  <View
                     style={{
                        width: scaleModerate(36),
                        height: scaleModerate(24),
                        alignItems: 'center',
                        justifyContent: 'center',
                     }}
                  >
                     <Feather name={iconName} size={scaleModerate(22)} color={color} />
                  </View>
               )
            },
            tabBarActiveTintColor: '#FFB74D',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarShowLabel: true,
            tabBarLabelStyle: { fontSize: scaleModerate(11), marginTop: scaleModerate(2) },
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
            tabBarStyle: {
               height: TAB_HEIGHT + insets.bottom,
               paddingTop: scaleModerate(6),
               paddingBottom: insets.bottom,
               backgroundColor: '#FFFFFF',
               borderTopWidth: 0.5,
               borderTopColor: '#E5E7EB',
               shadowColor: '#000',
               shadowOffset: { width: 0, height: -2 },
               shadowOpacity: 0.06,
               shadowRadius: 8,
               elevation: 8,
            },
         })}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: 'Home',
            }}
         />
         <Tabs.Screen
            name="explore"
            options={{
               title: 'Explore',
            }}
         />
         <Tabs.Screen
            name="create"
            options={{
               title: 'Create',
            }}
         />
         <Tabs.Screen
            name="map"
            options={{
               title: 'Map',
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
