'use client'

import { ChallengeCard } from '@/components/common/ChallengeCard'
import { CreateChallengePost } from '@/components/common/CreateChallengePost'
import {
    Challenge,
    getDailyChallenges,
    getWeeklyChallenges
} from '@/data/challengeData'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

type TabType = 'daily' | 'weekly'

export default function ChallengeScreen() {
   const [activeTab, setActiveTab] = useState<TabType>('daily')
   const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
   const [showDetailModal, setShowDetailModal] = useState(false)
   const [showCreatePostModal, setShowCreatePostModal] = useState(false)

   const dailyChallenges = getDailyChallenges()
   const weeklyChallenges = getWeeklyChallenges()

   const handleChallengePress = (challenge: Challenge) => {
      setSelectedChallenge(challenge)
      setShowDetailModal(true)
   }

   const handleJoinChallenge = (challenge: Challenge) => {
      // TODO: Implement join challenge logic
      console.log('Join challenge:', challenge.id)
      setSelectedChallenge(challenge)
      setShowCreatePostModal(true)
   }

   const renderTabButton = (tab: TabType, label: string, count: number) => (
      <TouchableOpacity
         style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
         onPress={() => setActiveTab(tab)}
      >
         <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {label}
         </Text>
         <View style={[styles.tabBadge, activeTab === tab && styles.activeTabBadge]}>
            <Text style={[styles.tabBadgeText, activeTab === tab && styles.activeTabBadgeText]}>
               {count}
            </Text>
         </View>
      </TouchableOpacity>
   )

   const renderChallenges = () => {
      const challenges = activeTab === 'daily' ? dailyChallenges : weeklyChallenges
      
      if (challenges.length === 0) {
         return (
            <View style={styles.emptyContainer}>
               <Ionicons name="trophy-outline" size={48} color="#D1D5DB" />
               <Text style={styles.emptyTitle}>Chưa có thử thách</Text>
               <Text style={styles.emptyText}>
                  {activeTab === 'daily' 
                     ? 'Không có thử thách hàng ngày nào hiện tại'
                     : 'Không có thử thách hàng tuần nào hiện tại'
                  }
               </Text>
            </View>
         )
      }

      return challenges.map((challenge) => (
         <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onPress={() => handleChallengePress(challenge)}
            onJoinPress={() => handleJoinChallenge(challenge)}
         />
      ))
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <TouchableOpacity onPress={() => router.push('/(tabs)/')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#6B7280" />
               </TouchableOpacity>
               <View style={styles.headerCenter}>
                  <Text style={styles.headerTitle}>Thử thách</Text>
                  <Text style={styles.headerSubtitle}>Tham gia các thử thách ẩm thực thú vị</Text>
               </View>
               <TouchableOpacity style={styles.leaderboardButton}>
                  <Ionicons name="trophy" size={24} color="#F97316" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Tab Navigation */}
         <View style={styles.tabContainer}>
            {renderTabButton('daily', 'Hàng ngày', dailyChallenges.length)}
            {renderTabButton('weekly', 'Hàng tuần', weeklyChallenges.length)}
         </View>

         {/* Challenges List */}
         <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
         >
            {renderChallenges()}
         </ScrollView>

         {/* Challenge Detail Modal */}
         <Modal
            visible={showDetailModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowDetailModal(false)}
         >
            {selectedChallenge && (
               <ChallengeDetailModal
                  challenge={selectedChallenge}
                  onClose={() => setShowDetailModal(false)}
                  onJoin={() => {
                     handleJoinChallenge(selectedChallenge)
                     setShowDetailModal(false)
                  }}
               />
            )}
         </Modal>

         {/* Create Challenge Post Modal */}
         {selectedChallenge && (
            <CreateChallengePost
               challenge={selectedChallenge}
               visible={showCreatePostModal}
               onClose={() => setShowCreatePostModal(false)}
               onSubmit={(caption, imageUri, location) => {
                  console.log('Submit challenge post:', { caption, imageUri, location })
                  // TODO: Implement submit logic
                  setShowCreatePostModal(false)
               }}
            />
         )}
      </SafeAreaView>
   )
}

// Challenge Detail Modal Component
function ChallengeDetailModal({ 
   challenge, 
   onClose, 
   onJoin 
}: { 
   challenge: Challenge
   onClose: () => void
   onJoin: () => void
}) {
   const handleLocationPress = (location: { name: string; lat: number; lon: number; address: string }) => {
      // Navigate to map with the specific location
      router.push({
         pathname: '/(tabs)/map',
         params: {
            latitude: location.lat.toString(),
            longitude: location.lon.toString(),
            title: location.name,
            address: location.address
         }
      })
   }
   return (
      <SafeAreaView style={styles.modalContainer}>
         {/* Modal Header */}
         <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
               <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chi tiết thử thách</Text>
            <View style={styles.placeholder} />
         </View>

         <ScrollView style={styles.modalContent}>
            {/* Challenge Info */}
            <View style={styles.challengeInfo}>
               <Text style={styles.challengeTitle}>{challenge.title}</Text>
               <Text style={styles.challengeDescription}>{challenge.description}</Text>
               
               <View style={styles.challengeStats}>
                  <View style={styles.statItem}>
                     <Ionicons name="people" size={20} color="#6B7280" />
                     <Text style={styles.statValue}>{challenge.participants}</Text>
                     <Text style={styles.statLabel}>Tham gia</Text>
                  </View>
                  <View style={styles.statItem}>
                     <Ionicons name="image" size={20} color="#6B7280" />
                     <Text style={styles.statValue}>{challenge.submissions.length}</Text>
                     <Text style={styles.statLabel}>Bài đăng</Text>
                  </View>
                  <View style={styles.statItem}>
                     <Ionicons name="time" size={20} color="#6B7280" />
                     <Text style={styles.statValue}>
                        {challenge.type === 'daily' ? '1 ngày' : '7 ngày'}
                     </Text>
                     <Text style={styles.statLabel}>Thời gian</Text>
                  </View>
               </View>

                               <View style={styles.rewardSection}>
                   <Text style={styles.rewardLabel}>🎁 Phần thưởng:</Text>
                   <Text style={styles.rewardTitle}>{challenge.reward.title}</Text>
                   <Text style={styles.rewardDescription}>{challenge.reward.description}</Text>
                   {challenge.reward.value && (
                      <Text style={styles.rewardValue}>{challenge.reward.value}</Text>
                   )}
                </View>

                <View style={styles.hashtagSection}>
                   <Text style={styles.hashtagLabel}>Hashtag:</Text>
                   <Text style={styles.hashtagText}>{challenge.hashtag}</Text>
                </View>
            </View>

            {/* Submissions */}
            <View style={styles.submissionsSection}>
               <Text style={styles.sectionTitle}>Bài đăng tham gia</Text>
               {challenge.submissions.length === 0 ? (
                  <View style={styles.emptySubmissions}>
                     <Ionicons name="camera-outline" size={32} color="#D1D5DB" />
                     <Text style={styles.emptySubmissionsText}>
                        Chưa có bài đăng nào. Hãy là người đầu tiên!
                     </Text>
                  </View>
               ) : (
                                     challenge.submissions.map((submission) => (
                      <View key={submission.id} style={styles.submissionCard}>
                         <View style={styles.submissionHeader}>
                            <Text style={styles.submissionUser}>{submission.user.name}</Text>
                            <Text style={styles.submissionTime}>
                               {new Date(submission.createdAt).toLocaleDateString('vi-VN')}
                            </Text>
                         </View>
                         <Text style={styles.submissionCaption}>{submission.caption}</Text>
                         
                         {/* Submission Image */}
                         <View style={styles.submissionImageContainer}>
                            <Image
                               source={submission.image}
                               style={styles.submissionImage}
                               contentFit="cover"
                            />
                         </View>
                         
                         {submission.location && (
                            <TouchableOpacity 
                               style={styles.locationContainer}
                               onPress={() => handleLocationPress(submission.location!)}
                            >
                               <Ionicons name="location-outline" size={14} color="#6B7280" />
                               <Text style={styles.locationText}>{submission.location.name}</Text>
                               <Ionicons name="chevron-forward" size={12} color="#6B7280" />
                            </TouchableOpacity>
                         )}
                         <View style={styles.submissionStats}>
                            <Text style={styles.submissionStat}>❤️ {submission.likes}</Text>
                            <Text style={styles.submissionStat}>💬 {submission.comments}</Text>
                         </View>
                      </View>
                   ))
               )}
            </View>
         </ScrollView>

         {/* Modal Footer */}
         <View style={styles.modalFooter}>
            {challenge.isJoined ? (
               <View style={styles.joinedFooter}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.joinedFooterText}>Bạn đã tham gia thử thách này</Text>
               </View>
                         ) : (
                <TouchableOpacity style={styles.joinFooterButton} onPress={onJoin}>
                   <Text style={styles.joinFooterButtonText}>Tạo bài đăng tham gia</Text>
                </TouchableOpacity>
             )}
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   header: {
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
      backgroundColor: '#FFFFFF',
   },
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 16,
   },
   backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: '#F9FAFB',
   },
   headerCenter: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 16,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      letterSpacing: -0.025,
   },
   headerSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      fontWeight: '500',
   },
   leaderboardButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#FEF3C7',
   },
   tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   tabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      marginHorizontal: 4,
      borderRadius: 8,
   },
   activeTabButton: {
      backgroundColor: '#FEF3C7',
   },
   tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#6B7280',
   },
   activeTabText: {
      color: '#F97316',
   },
   tabBadge: {
      backgroundColor: '#E5E7EB',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 8,
   },
   activeTabBadge: {
      backgroundColor: '#F97316',
   },
   tabBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
   },
   activeTabBadgeText: {
      color: '#FFFFFF',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 20,
   },
   emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
   },
   emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#6B7280',
      marginTop: 16,
   },
   emptyText: {
      fontSize: 14,
      color: '#9CA3AF',
      textAlign: 'center',
      marginTop: 8,
      paddingHorizontal: 32,
   },
   // Modal Styles
   modalContainer: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   closeButton: {
      padding: 8,
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   placeholder: {
      width: 40,
   },
   modalContent: {
      flex: 1,
   },
   challengeInfo: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F3F4F6',
   },
   challengeTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
   },
   challengeDescription: {
      fontSize: 16,
      color: '#6B7280',
      lineHeight: 24,
      marginBottom: 20,
   },
   challengeStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
   },
   statItem: {
      alignItems: 'center',
   },
   statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
      marginTop: 4,
   },
   statLabel: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 2,
   },
   hashtagSection: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   hashtagLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      marginRight: 8,
   },
   hashtagText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2563EB',
   },
   rewardSection: {
      marginBottom: 20,
   },
   rewardLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6B7280',
      marginBottom: 8,
   },
   rewardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#F59E0B',
      marginBottom: 4,
   },
   rewardDescription: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4,
   },
   rewardValue: {
      fontSize: 14,
      fontWeight: '600',
      color: '#10B981',
   },
   submissionsSection: {
      padding: 20,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 16,
   },
   emptySubmissions: {
      alignItems: 'center',
      paddingVertical: 40,
   },
   emptySubmissionsText: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
      marginTop: 12,
   },
   submissionCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
   },
   submissionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
   },
   submissionUser: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111827',
   },
   submissionTime: {
      fontSize: 12,
      color: '#6B7280',
   },
   submissionCaption: {
      fontSize: 14,
      color: '#374151',
      lineHeight: 20,
      marginBottom: 8,
   },
   submissionImageContainer: {
      marginBottom: 8,
   },
   submissionImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
   },
   submissionStats: {
      flexDirection: 'row',
   },
   submissionStat: {
      fontSize: 12,
      color: '#6B7280',
      marginRight: 16,
   },
   locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: '#F3F4F6',
      borderRadius: 6,
   },
   locationText: {
      fontSize: 12,
      color: '#6B7280',
      marginLeft: 4,
   },
   modalFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
   },
   joinedFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
   },
   joinedFooterText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#10B981',
      marginLeft: 8,
   },
   joinFooterButton: {
      backgroundColor: '#F97316',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
   },
   joinFooterButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
   },
}) 