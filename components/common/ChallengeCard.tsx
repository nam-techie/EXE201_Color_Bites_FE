import { Challenge } from '@/data/challengeData'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ChallengeCardProps {
   challenge: Challenge
   onPress: () => void
   onJoinPress: () => void
}

export function ChallengeCard({ challenge, onPress, onJoinPress }: ChallengeCardProps) {
   const getCategoryIcon = (category: string) => {
      switch (category) {
         case 'cuisine':
            return 'restaurant'
         case 'color':
            return 'color-palette'
         case 'ingredient':
            return 'leaf'
         case 'location':
            return 'location'
         default:
            return 'trophy'
      }
   }

   const getCategoryColor = (category: string) => {
      switch (category) {
         case 'cuisine':
            return '#EF4444'
         case 'color':
            return '#8B5CF6'
         case 'ingredient':
            return '#10B981'
         case 'location':
            return '#F59E0B'
         default:
            return '#6B7280'
      }
   }

   const formatTimeLeft = () => {
      const now = new Date()
      const endDate = new Date(challenge.endDate)
      const diffTime = endDate.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 0) return 'Kết thúc'
      if (diffDays === 1) return 'Còn 1 ngày'
      return `Còn ${diffDays} ngày`
   }

   return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
         <View style={styles.header}>
            <View style={styles.categoryContainer}>
               <View 
                  style={[
                     styles.categoryIcon, 
                     { backgroundColor: getCategoryColor(challenge.category) }
                  ]}
               >
                  <Ionicons 
                     name={getCategoryIcon(challenge.category) as any} 
                     size={16} 
                     color="#FFFFFF" 
                  />
               </View>
               <Text style={styles.categoryText}>
                  {challenge.type === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}
               </Text>
            </View>
            <View style={styles.timeContainer}>
               <Ionicons name="time-outline" size={14} color="#6B7280" />
               <Text style={styles.timeText}>{formatTimeLeft()}</Text>
            </View>
         </View>

         {challenge.coverImage && (
            <View style={styles.coverImageContainer}>
               <Image
                  source={{ uri: challenge.coverImage }}
                  style={styles.coverImage}
                  contentFit="cover"
               />
            </View>
         )}

         <View style={styles.content}>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.description}>{challenge.description}</Text>
            
            <View style={styles.rewardContainer}>
               <Ionicons name="gift-outline" size={16} color="#F59E0B" />
               <Text style={styles.rewardText}>{challenge.reward.title}</Text>
            </View>
            
            <View style={styles.statsContainer}>
               <View style={styles.stat}>
                  <Ionicons name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{challenge.participants}</Text>
               </View>
               <View style={styles.stat}>
                  <Ionicons name="image-outline" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{challenge.submissions.length}</Text>
               </View>
            </View>

            <View style={styles.hashtagContainer}>
               <Text style={styles.hashtag}>{challenge.hashtag}</Text>
            </View>
         </View>

         <View style={styles.footer}>
            {challenge.isJoined ? (
               <View style={styles.joinedButton}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.joinedText}>Đã tham gia</Text>
               </View>
            ) : (
               <TouchableOpacity style={styles.joinButton} onPress={onJoinPress}>
                  <Text style={styles.joinButtonText}>Tham gia</Text>
               </TouchableOpacity>
            )}
         </View>
      </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F3F4F6',
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   categoryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   categoryIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
   },
   categoryText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
   },
   timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   timeText: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
   },
   coverImageContainer: {
      marginBottom: 12,
   },
   coverImage: {
      width: '100%',
      height: 120,
      borderRadius: 8,
   },
   content: {
      marginBottom: 16,
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
   },
   description: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 20,
      marginBottom: 12,
   },
   rewardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FEF3C7',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
      marginBottom: 12,
   },
   rewardText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#F59E0B',
      marginLeft: 4,
   },
   statsContainer: {
      flexDirection: 'row',
      marginBottom: 12,
   },
   stat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
   },
   statText: {
      fontSize: 14,
      color: '#6B7280',
      marginLeft: 4,
      fontWeight: '500',
   },
   hashtagContainer: {
      marginBottom: 8,
   },
   hashtag: {
      fontSize: 14,
      color: '#2563EB',
      fontWeight: '600',
   },
   footer: {
      alignItems: 'flex-end',
   },
   joinButton: {
      backgroundColor: '#F97316',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
   },
   joinButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
   },
   joinedButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F0FDF4',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
   },
   joinedText: {
      color: '#10B981',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
   },
}) 