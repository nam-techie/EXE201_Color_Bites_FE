import { scaleModerate } from '@/utils/responsive'
import { MaterialIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
   return (
      <Tabs
         screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
               let iconName: keyof typeof MaterialIcons.glyphMap

               if (route.name === 'index') {
                  iconName = 'home'
               } else if (route.name === 'explore') {
                  iconName = 'search'
               } else if (route.name === 'create') {
                  iconName = 'add-circle'
               } else if (route.name === 'map') {
                  iconName = 'place'
               } else if (route.name === 'profile') {
                  iconName = 'person'
               } else {
                  iconName = 'home'
               }

               return (
                  <MaterialIcons 
                     name={iconName} 
                     size={scaleModerate(28)} 
                     color={color}
                  />
               )
            },
            tabBarActiveTintColor: '#FFB74D',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarShowLabel: false,
            headerShown: false,
            tabBarStyle: {
               backgroundColor: '#FFFFFF',
               borderTopWidth: 0,
               paddingBottom: scaleModerate(12),
               paddingTop: scaleModerate(12),
               height: scaleModerate(70),
               shadowColor: '#000',
               shadowOffset: {
                  width: 0,
                  height: -2,
               },
               shadowOpacity: 0.1,
               shadowRadius: 4,
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
