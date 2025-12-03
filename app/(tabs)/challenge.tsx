'use client'

import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from 'react'
import {
   ActivityIndicator,
   Alert,
   RefreshControl,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
} from 'react-native'

import { challengeService } from '@/services/ChallengeService'
import type {
   ChallengeDefinitionResponse,
   ChallengeDetailResponse,
   ChallengeParticipationResponse,
} from '@/type'

// Tab types
type TabType = 'active' | 'my'

export default function ChallengeScreen() {
   // States
   const [activeTab, setActiveTab] = useState<TabType>('active')
   const [challenges, setChallenges] = useState<ChallengeDetailResponse[]>([])
   const [myParticipations, setMyParticipations] = useState<ChallengeParticipationResponse[]>([])
   const [selectedChallenge, setSelectedChallenge] = useState<ChallengeDefinitionResponse | null>(null)
   const [loading, setLoading] = useState(true)
   const [refreshing, setRefreshing] = useState(false)
   const [joiningId, setJoiningId] = useState<string | null>(null)

   // Fetch active challenges
   const fetchActiveChallenges = useCallback(async () => {
      try {
         const data = await challengeService.getActiveChallenges()
         setChallenges(data)
      } catch (error) {
         console.error('Error fetching challenges:', error)
      }
   }, [])

   // Fetch my participations
   const fetchMyParticipations = useCallback(async () => {
      try {
         const data = await challengeService.getMyParticipations()
         setMyParticipations(data)
      } catch (error) {
         console.error('Error fetching participations:', error)
      }
   }, [])

   // Load data on mount
   useEffect(() => {
      const loadData = async () => {
         setLoading(true)
         await Promise.all([fetchActiveChallenges(), fetchMyParticipations()])
         setLoading(false)
      }
      loadData()
   }, [fetchActiveChallenges, fetchMyParticipations])

   // Pull to refresh
   const onRefresh = useCallback(async () => {
      setRefreshing(true)
      await Promise.all([fetchActiveChallenges(), fetchMyParticipations()])
      setRefreshing(false)
   }, [fetchActiveChallenges, fetchMyParticipations])

   // Join challenge
   const handleJoinChallenge = async (challengeId: string) => {
      // Check if already joined
      const alreadyJoined = myParticipations.some((p) => p.challengeId === challengeId)
      if (alreadyJoined) {
         Alert.alert('Thông báo', 'Bạn đã tham gia thử thách này rồi!')
         return
      }

      setJoiningId(challengeId)
      try {
         const result = await challengeService.joinChallenge(challengeId)
         if (result) {
            Alert.alert('Thành công', 'Bạn đã tham gia thử thách!')
            // Refresh participations
            await fetchMyParticipations()
         }
      } catch (error) {
         Alert.alert('Lỗi', 'Không thể tham gia thử thách. Vui lòng thử lại.')
      } finally {
         setJoiningId(null)
      }
   }

   // View challenge detail
   const handleViewDetail = async (challengeId: string) => {
      try {
         const detail = await challengeService.getChallengeById(challengeId)
         if (detail) {
            setSelectedChallenge(detail)
         }
      } catch (error) {
         console.error('Error fetching challenge detail:', error)
      }
   }

   // Format date
   const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
      })
   }

   // Get days remaining
   const getDaysRemaining = (endDate: string) => {
      const end = new Date(endDate)
      const now = new Date()
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff > 0 ? diff : 0
   }

   // Get status color
   const getStatusColor = (status: string) => {
      switch (status) {
         case 'ACTIVE':
            return '#10B981'
         case 'COMPLETED':
            return '#3B82F6'
         case 'FAILED':
            return '#EF4444'
         default:
            return '#6B7280'
      }
   }

   // Get status text
   const getStatusText = (status: string) => {
      switch (status) {
         case 'ACTIVE':
            return 'Đang thực hiện'
         case 'COMPLETED':
            return 'Hoàn thành'
         case 'FAILED':
            return 'Thất bại'
         default:
            return status
      }
   }

   // Check if already joined
   const isJoined = (challengeId: string) => {
      return myParticipations.some((p) => p.challengeId === challengeId)
   }

   // Render challenge card
   const renderChallengeCard = (challenge: ChallengeDetailResponse) => {
      const daysRemaining = getDaysRemaining(challenge.endDate)
      const joined = isJoined(challenge.id)

      return (
         <TouchableOpacity
            key={challenge.id}
            style={styles.challengeCard}
            onPress={() => handleViewDetail(challenge.id)}
         >
            <View style={styles.challengeHeader}>
               <View style={styles.challengeTypeContainer}>
                  <Ionicons
                     name={challenge.challengeType === 'PARTNER_LOCATION' ? 'location' : 'restaurant'}
                     size={16}
                     color="#F97316"
                  />
                  <Text style={styles.challengeType}>
                     {challenge.challengeType === 'PARTNER_LOCATION' ? 'Địa điểm' : 'Chủ đề'}
                  </Text>
               </View>
               {daysRemaining <= 3 && daysRemaining > 0 && (
                  <View style={styles.urgentBadge}>
                     <Text style={styles.urgentBadgeText}>Còn {daysRemaining} ngày</Text>
                  </View>
               )}
            </View>

            <Text style={styles.challengeTitle}>{challenge.title}</Text>

            <View style={styles.challengeDateContainer}>
               <Ionicons name="calendar-outline" size={14} color="#6B7280" />
               <Text style={styles.challengeDate}>
                  {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
               </Text>
            </View>

            <View style={styles.challengeActions}>
               {joined ? (
                  <View style={styles.joinedBadge}>
                     <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                     <Text style={styles.joinedText}>Đã tham gia</Text>
                  </View>
               ) : (
                  <TouchableOpacity
                     style={styles.joinButton}
                     onPress={() => handleJoinChallenge(challenge.id)}
                     disabled={joiningId === challenge.id}
                  >
                     {joiningId === challenge.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                     ) : (
                        <Text style={styles.joinButtonText}>Tham gia</Text>
                     )}
                  </TouchableOpacity>
               )}
            </View>
         </TouchableOpacity>
      )
   }

   // Render participation card
   const renderParticipationCard = (participation: ChallengeParticipationResponse) => {
      const progress = participation.targetCount
         ? Math.min(100, Math.round((0 / participation.targetCount) * 100))
         : 0

      return (
         <TouchableOpacity
            key={participation.id}
            style={styles.participationCard}
            onPress={() => handleViewDetail(participation.challengeId)}
         >
            <View style={styles.participationHeader}>
               <Text style={styles.participationTitle}>
                  {participation.challengeTitle || 'Thử thách'}
               </Text>
               <View
                  style={[
                     styles.statusBadge,
                     { backgroundColor: getStatusColor(participation.status) + '20' },
                  ]}
               >
                  <Text
                     style={[styles.statusText, { color: getStatusColor(participation.status) }]}
                  >
                     {getStatusText(participation.status)}
                  </Text>
               </View>
            </View>

            {participation.targetCount && (
               <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                     <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>
                     0/{participation.targetCount} bài nộp
                  </Text>
               </View>
            )}

            <View style={styles.participationFooter}>
               <View style={styles.dateInfo}>
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text style={styles.dateText}>
                     Tham gia: {formatDate(participation.createdAt)}
                  </Text>
               </View>
               {participation.status === 'ACTIVE' && (
                  <TouchableOpacity style={styles.submitButton}>
                     <Text style={styles.submitButtonText}>Nộp bài</Text>
                  </TouchableOpacity>
               )}
            </View>
         </TouchableOpacity>
      )
   }

   // Render detail modal
   const renderDetailModal = () => {
      if (!selectedChallenge) return null

      return (
         <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setSelectedChallenge(null)}
               >
                  <Ionicons name="close" size={24} color="#111827" />
               </TouchableOpacity>

               {selectedChallenge.images && selectedChallenge.images.length > 0 && (
                  <Image
                     source={{ uri: selectedChallenge.images[0].url }}
                     style={styles.modalImage}
                     contentFit="cover"
                  />
               )}

               <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>

                  {selectedChallenge.description && (
                     <Text style={styles.modalDescription}>{selectedChallenge.description}</Text>
                  )}

                  <View style={styles.modalInfo}>
                     <View style={styles.modalInfoRow}>
                        <Ionicons name="trophy-outline" size={18} color="#F97316" />
                        <Text style={styles.modalInfoText}>
                           Mục tiêu: {selectedChallenge.targetCount} bài nộp
                        </Text>
                     </View>

                     <View style={styles.modalInfoRow}>
                        <Ionicons name="calendar-outline" size={18} color="#F97316" />
                        <Text style={styles.modalInfoText}>
                           {formatDate(selectedChallenge.startDate)} -{' '}
                           {formatDate(selectedChallenge.endDate)}
                        </Text>
                     </View>

                     {selectedChallenge.participantCount !== undefined && (
                        <View style={styles.modalInfoRow}>
                           <Ionicons name="people-outline" size={18} color="#F97316" />
                           <Text style={styles.modalInfoText}>
                              {selectedChallenge.participantCount} người tham gia
                           </Text>
                        </View>
                     )}

                     {selectedChallenge.rewardDescription && (
                        <View style={styles.modalInfoRow}>
                           <Ionicons name="gift-outline" size={18} color="#F97316" />
                           <Text style={styles.modalInfoText}>
                              {selectedChallenge.rewardDescription}
                           </Text>
                        </View>
                     )}
                  </View>

                  {!isJoined(selectedChallenge.id) ? (
                     <TouchableOpacity
                        style={styles.modalJoinButton}
                        onPress={() => {
                           handleJoinChallenge(selectedChallenge.id)
                           setSelectedChallenge(null)
                        }}
                     >
                        <Text style={styles.modalJoinButtonText}>Tham gia ngay</Text>
                     </TouchableOpacity>
                  ) : (
                     <View style={styles.modalJoinedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <Text style={styles.modalJoinedText}>Bạn đã tham gia thử thách này</Text>
                     </View>
                  )}
               </View>
            </View>
         </View>
      )
   }

   // Loading state
   if (loading) {
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#F97316" />
               <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
         </SafeAreaView>
      )
   }

   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Thử thách</Text>
         </View>

         {/* Tabs */}
         <View style={styles.tabContainer}>
            <TouchableOpacity
               style={[styles.tab, activeTab === 'active' && styles.tabActive]}
               onPress={() => setActiveTab('active')}
            >
               <Ionicons
                  name="flame"
                  size={18}
                  color={activeTab === 'active' ? '#F97316' : '#6B7280'}
               />
               <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                  Đang diễn ra
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.tab, activeTab === 'my' && styles.tabActive]}
               onPress={() => setActiveTab('my')}
            >
               <Ionicons
                  name="person"
                  size={18}
                  color={activeTab === 'my' ? '#F97316' : '#6B7280'}
               />
               <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
                  Của tôi ({myParticipations.length})
               </Text>
            </TouchableOpacity>
         </View>

         {/* Content */}
         <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F97316']} />
            }
         >
            {activeTab === 'active' ? (
               <>
                  {challenges.length > 0 ? (
                     challenges.map(renderChallengeCard)
                  ) : (
                     <View style={styles.emptyContainer}>
                        <Ionicons name="trophy-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Chưa có thử thách nào</Text>
                        <Text style={styles.emptySubtext}>
                           Hãy quay lại sau để xem các thử thách mới!
                        </Text>
                     </View>
                  )}
               </>
            ) : (
               <>
                  {myParticipations.length > 0 ? (
                     myParticipations.map(renderParticipationCard)
                  ) : (
                     <View style={styles.emptyContainer}>
                        <Ionicons name="person-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>Bạn chưa tham gia thử thách nào</Text>
                        <Text style={styles.emptySubtext}>
                           Khám phá các thử thách đang diễn ra và tham gia ngay!
                        </Text>
                        <TouchableOpacity
                           style={styles.exploreButton}
                           onPress={() => setActiveTab('active')}
                        >
                           <Text style={styles.exploreButtonText}>Khám phá thử thách</Text>
                        </TouchableOpacity>
                     </View>
                  )}
               </>
            )}
         </ScrollView>

         {/* Detail Modal */}
         {selectedChallenge && renderDetailModal()}
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
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 16,
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#111827',
   },
   tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 8,
      gap: 6,
   },
   tabActive: {
      backgroundColor: '#FFF7ED',
   },
   tabText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#6B7280',
   },
   tabTextActive: {
      color: '#F97316',
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      padding: 16,
      paddingBottom: 32,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: '#6B7280',
   },
   // Challenge Card
   challengeCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
   },
   challengeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
   },
   challengeTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   challengeType: {
      fontSize: 12,
      color: '#F97316',
      fontWeight: '500',
   },
   urgentBadge: {
      backgroundColor: '#FEE2E2',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
   },
   urgentBadgeText: {
      fontSize: 11,
      color: '#DC2626',
      fontWeight: '600',
   },
   challengeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 8,
   },
   challengeDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
   },
   challengeDate: {
      fontSize: 13,
      color: '#6B7280',
   },
   challengeActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
   },
   joinButton: {
      backgroundColor: '#F97316',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
   },
   joinButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
   },
   joinedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   joinedText: {
      color: '#10B981',
      fontWeight: '500',
      fontSize: 13,
   },
   // Participation Card
   participationCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
   },
   participationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   participationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
      flex: 1,
   },
   statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
   },
   statusText: {
      fontSize: 12,
      fontWeight: '600',
   },
   progressContainer: {
      marginBottom: 12,
   },
   progressBar: {
      height: 8,
      backgroundColor: '#E5E7EB',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 6,
   },
   progressFill: {
      height: '100%',
      backgroundColor: '#F97316',
      borderRadius: 4,
   },
   progressText: {
      fontSize: 12,
      color: '#6B7280',
   },
   participationFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   dateInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
   },
   dateText: {
      fontSize: 12,
      color: '#6B7280',
   },
   submitButton: {
      backgroundColor: '#FFF7ED',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#F97316',
   },
   submitButtonText: {
      color: '#F97316',
      fontWeight: '600',
      fontSize: 13,
   },
   // Empty state
   emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
   },
   emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginTop: 16,
   },
   emptySubtext: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 8,
      textAlign: 'center',
   },
   exploreButton: {
      marginTop: 20,
      backgroundColor: '#F97316',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
   },
   exploreButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
   },
   // Modal
   modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      width: '100%',
      maxHeight: '80%',
      overflow: 'hidden',
   },
   modalClose: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 1,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   modalImage: {
      width: '100%',
      height: 180,
   },
   modalBody: {
      padding: 20,
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 12,
   },
   modalDescription: {
      fontSize: 14,
      color: '#4B5563',
      lineHeight: 22,
      marginBottom: 16,
   },
   modalInfo: {
      marginBottom: 20,
   },
   modalInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 10,
   },
   modalInfoText: {
      fontSize: 14,
      color: '#374151',
   },
   modalJoinButton: {
      backgroundColor: '#F97316',
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
   },
   modalJoinButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
   },
   modalJoinedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      backgroundColor: '#ECFDF5',
      borderRadius: 10,
   },
   modalJoinedText: {
      color: '#10B981',
      fontWeight: '600',
      fontSize: 14,
   },
})
