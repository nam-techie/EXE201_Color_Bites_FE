import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
   return (
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
            headerShown: false,
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
