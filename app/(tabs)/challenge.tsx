'use client'

import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Image } from 'expo-image'
import { useCallback, useEffect, useState } from 'react'
import {
   ActivityIndicator,
   Alert,
   Modal,
   Platform,
   RefreshControl,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from 'react-native'

import { challengeService } from '@/services/ChallengeService'
import type {
   ChallengeDefinitionResponse,
   ChallengeDetailResponse,
   ChallengeParticipationResponse,
   ChallengeType,
   CreateChallengeRequest,
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

   // Create challenge states
   const [showCreateModal, setShowCreateModal] = useState(false)
   const [creating, setCreating] = useState(false)
   const [showDatePicker, setShowDatePicker] = useState(false)
   const [tempDate, setTempDate] = useState(new Date())
   
   // Initialize startDate to tomorrow 9:00 AM
   const getDefaultStartDate = () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(9, 0, 0, 0)
      return date
   }

   // Hardcoded restaurant ID for user challenges
   const DEFAULT_RESTAURANT_ID = '68fb688394c35151468c415a'
   
   const [createForm, setCreateForm] = useState<{
      title: string
      description: string
      challengeType: ChallengeType
      targetCount: string
      durationDay: string
      rewardDescription: string
      startDate: Date
      typeObjId: string
   }>({
      title: '',
      description: '',
      challengeType: 'PARTNER_LOCATION' as ChallengeType, // Default to PARTNER_LOCATION
      targetCount: '5',
      durationDay: '7',
      rewardDescription: '',
      startDate: getDefaultStartDate(),
      typeObjId: '',
   })

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

   // Reset create form
   const resetCreateForm = () => {
      const defaultDate = getDefaultStartDate()
      setCreateForm({
         title: '',
         description: '',
         challengeType: 'PARTNER_LOCATION' as ChallengeType,
         targetCount: '5',
         durationDay: '7',
         rewardDescription: '',
         startDate: defaultDate,
         typeObjId: '',
      })
      setTempDate(defaultDate)
   }

   // Handle date change for Android
   const onDateChangeAndroid = (_event: any, selectedDate?: Date) => {
      setShowDatePicker(false)
      if (selectedDate) {
         // Keep time from current startDate
         const newDate = new Date(selectedDate)
         newDate.setHours(createForm.startDate.getHours(), createForm.startDate.getMinutes(), 0, 0)
         setCreateForm(prev => ({ ...prev, startDate: newDate }))
      }
   }

   // Handle date change for iOS
   const onDateChangeIOS = (_event: any, selectedDate?: Date) => {
      if (selectedDate) {
         setTempDate(selectedDate)
      }
   }

   // Confirm iOS date selection
   const confirmIOSDate = () => {
      setCreateForm(prev => ({ ...prev, startDate: tempDate }))
      setShowDatePicker(false)
   }

   // Format date for display (like admin: DD/MM/YYYY HH:mm)
   const formatDateDisplay = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}`
   }

   // Create new challenge
   const handleCreateChallenge = async () => {
      // Validate form
      if (!createForm.title.trim()) {
         Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề thử thách')
         return
      }

      const targetCount = parseInt(createForm.targetCount, 10)
      const durationDay = parseInt(createForm.durationDay, 10)

      if (isNaN(targetCount) || targetCount < 1) {
         Alert.alert('Lỗi', 'Số lượng mục tiêu phải là số lớn hơn 0')
         return
      }

      if (isNaN(durationDay) || durationDay < 1) {
         Alert.alert('Lỗi', 'Số ngày phải là số lớn hơn 0')
         return
      }

      setCreating(true)
      try {
         // Validate startDate is in the future
         const now = new Date()
         if (createForm.startDate <= now) {
            Alert.alert('Lỗi', 'Ngày bắt đầu phải trong tương lai')
            setCreating(false)
            return
         }

         // Validate conditional fields based on challengeType
         if (createForm.challengeType === 'THEME_COUNT' && !createForm.typeObjId.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập ID chủ đề cho thử thách chủ đề')
            setCreating(false)
            return
         }

         // Build request - use hardcoded restaurantId for PARTNER_LOCATION
         const request: CreateChallengeRequest = {
            title: createForm.title.trim(),
            description: createForm.description.trim() || undefined,
            challengeType: createForm.challengeType,
            restaurantId: createForm.challengeType === 'PARTNER_LOCATION' ? DEFAULT_RESTAURANT_ID : undefined,
            typeObjId: createForm.challengeType === 'THEME_COUNT' ? createForm.typeObjId.trim() : undefined,
            targetCount: targetCount,
            startDate: createForm.startDate.toISOString(),
            durationDay: durationDay,
            rewardDescription: createForm.rewardDescription.trim() || undefined,
         }

         await challengeService.createChallenge(request)
         
         Alert.alert('Thành công', 'Thử thách đã được tạo thành công!')
         setShowCreateModal(false)
         resetCreateForm()
         
         // Refresh challenges list
         await fetchActiveChallenges()
      } catch (error: any) {
         console.error('Error creating challenge:', error)
         
         // Check for upgrade required error
         if (error?.message === 'UPGRADE_REQUIRED' || 
             error?.message?.includes('403') ||
             error?.message?.includes('permission') ||
             error?.message?.includes('Forbidden')) {
            Alert.alert(
               'Cần nâng cấp tài khoản',
               'Bạn cần nâng cấp lên tài khoản Premium hoặc Partner để tạo thử thách. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.',
               [
                  { text: 'Đóng', style: 'cancel' },
                  { text: 'Tìm hiểu thêm', onPress: () => {
                     // Navigate to upgrade page or show more info
                     Alert.alert('Thông tin', 'Vui lòng liên hệ hotline hoặc email để nâng cấp tài khoản.')
                  }}
               ]
            )
         } else {
            Alert.alert(
               'Lỗi',
               error?.message || 'Không thể tạo thử thách. Vui lòng thử lại sau.'
            )
         }
      } finally {
         setCreating(false)
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
            <TouchableOpacity
               style={styles.createButton}
               onPress={() => setShowCreateModal(true)}
            >
               <Ionicons name="add" size={20} color="#FFFFFF" />
               <Text style={styles.createButtonText}>Tạo mới</Text>
            </TouchableOpacity>
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

         {/* Create Challenge Modal */}
         <Modal
            visible={showCreateModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowCreateModal(false)}
         >
            <SafeAreaView style={styles.createModalContainer}>
               {/* Modal Header */}
               <View style={styles.createModalHeader}>
                  <TouchableOpacity
                     style={styles.createModalCloseBtn}
                     onPress={() => {
                        setShowCreateModal(false)
                        resetCreateForm()
                     }}
                  >
                     <Ionicons name="close" size={24} color="#111827" />
                  </TouchableOpacity>
                  <Text style={styles.createModalTitle}>Tạo thử thách mới</Text>
                  <View style={{ width: 40 }} />
               </View>

               <ScrollView style={styles.createModalContent} showsVerticalScrollIndicator={false}>
                  {/* Title */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Tiêu đề *</Text>
                     <TextInput
                        style={styles.formInput}
                        placeholder="Nhập tiêu đề thử thách"
                        placeholderTextColor="#9CA3AF"
                        value={createForm.title}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, title: text }))}
                        maxLength={100}
                     />
                  </View>

                  {/* Description */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Mô tả</Text>
                     <TextInput
                        style={[styles.formInput, styles.formTextArea]}
                        placeholder="Mô tả chi tiết về thử thách"
                        placeholderTextColor="#9CA3AF"
                        value={createForm.description}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, description: text }))}
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                     />
                  </View>

                  {/* Challenge Type */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Loại thử thách *</Text>
                     <View style={styles.typeSelector}>
                        <TouchableOpacity
                           style={[
                              styles.typeOption,
                              createForm.challengeType === 'PARTNER_LOCATION' && styles.typeOptionActive
                           ]}
                           onPress={() => setCreateForm(prev => ({ 
                              ...prev, 
                              challengeType: 'PARTNER_LOCATION' as ChallengeType,
                              typeObjId: '' // Clear typeObjId when changing type
                           }))}
                        >
                           <Ionicons
                              name="location"
                              size={20}
                              color={createForm.challengeType === 'PARTNER_LOCATION' ? '#FFFFFF' : '#6B7280'}
                           />
                           <Text style={[
                              styles.typeOptionText,
                              createForm.challengeType === 'PARTNER_LOCATION' && styles.typeOptionTextActive
                           ]}>
                              Địa điểm
                           </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={[
                              styles.typeOption,
                              createForm.challengeType === 'THEME_COUNT' && styles.typeOptionActive
                           ]}
                           onPress={() => setCreateForm(prev => ({ 
                              ...prev, 
                              challengeType: 'THEME_COUNT' as ChallengeType
                           }))}
                        >
                           <Ionicons
                              name="restaurant"
                              size={20}
                              color={createForm.challengeType === 'THEME_COUNT' ? '#FFFFFF' : '#6B7280'}
                           />
                           <Text style={[
                              styles.typeOptionText,
                              createForm.challengeType === 'THEME_COUNT' && styles.typeOptionTextActive
                           ]}>
                              Chủ đề
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>

                  {/* Type Object ID - Required for THEME_COUNT only */}
                  {createForm.challengeType === 'THEME_COUNT' && (
                     <View style={styles.formGroup}>
                        <Text style={styles.formLabel}>ID Chủ đề *</Text>
                        <TextInput
                           style={styles.formInput}
                           placeholder="Nhập ID chủ đề món ăn..."
                           placeholderTextColor="#9CA3AF"
                           value={createForm.typeObjId}
                           onChangeText={(text) => setCreateForm(prev => ({ ...prev, typeObjId: text }))}
                        />
                        <Text style={styles.formHint}>ID của chủ đề món ăn mà thử thách này áp dụng</Text>
                     </View>
                  )}

                  {/* Target Count */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Số lượng mục tiêu *</Text>
                     <TextInput
                        style={styles.formInput}
                        placeholder="Số bài nộp cần hoàn thành"
                        placeholderTextColor="#9CA3AF"
                        value={createForm.targetCount}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, targetCount: text.replace(/[^0-9]/g, '') }))}
                        keyboardType="number-pad"
                        maxLength={3}
                     />
                  </View>

                  {/* Start Date */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Ngày bắt đầu *</Text>
                     <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => {
                           setTempDate(createForm.startDate)
                           setShowDatePicker(true)
                        }}
                     >
                        <Ionicons name="calendar" size={20} color="#F97316" />
                        <Text style={styles.datePickerText}>
                           {formatDateDisplay(createForm.startDate)}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color="#6B7280" />
                     </TouchableOpacity>
                     <Text style={styles.formHint}>
                        Ngày bắt đầu phải trong tương lai
                     </Text>
                  </View>

                  {/* Date Picker for Android */}
                  {showDatePicker && Platform.OS === 'android' && (
                     <DateTimePicker
                        value={createForm.startDate}
                        mode="datetime"
                        display="default"
                        onChange={onDateChangeAndroid}
                        minimumDate={new Date()}
                     />
                  )}

                  {/* Duration */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Thời gian (ngày) *</Text>
                     <TextInput
                        style={styles.formInput}
                        placeholder="Số ngày thực hiện thử thách"
                        placeholderTextColor="#9CA3AF"
                        value={createForm.durationDay}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, durationDay: text.replace(/[^0-9]/g, '') }))}
                        keyboardType="number-pad"
                        maxLength={3}
                     />
                  </View>

                  {/* Reward Description */}
                  <View style={styles.formGroup}>
                     <Text style={styles.formLabel}>Phần thưởng</Text>
                     <TextInput
                        style={styles.formInput}
                        placeholder="Mô tả phần thưởng (nếu có)"
                        placeholderTextColor="#9CA3AF"
                        value={createForm.rewardDescription}
                        onChangeText={(text) => setCreateForm(prev => ({ ...prev, rewardDescription: text }))}
                        maxLength={200}
                     />
                  </View>

                  {/* Info Note */}
                  <View style={styles.infoNote}>
                     <Ionicons name="information-circle" size={20} color="#3B82F6" />
                     <Text style={styles.infoNoteText}>
                        Tính năng tạo thử thách yêu cầu tài khoản Premium hoặc Partner. 
                        Nếu bạn gặp lỗi, vui lòng nâng cấp tài khoản.
                     </Text>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                     style={[styles.submitCreateButton, creating && styles.submitCreateButtonDisabled]}
                     onPress={handleCreateChallenge}
                     disabled={creating}
                  >
                     {creating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                     ) : (
                        <>
                           <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                           <Text style={styles.submitCreateButtonText}>Tạo thử thách</Text>
                        </>
                     )}
                  </TouchableOpacity>

                  <View style={{ height: 40 }} />
               </ScrollView>

               {/* iOS Date Picker Modal */}
               {Platform.OS === 'ios' && showDatePicker && (
                  <View style={styles.iosDatePickerOverlay}>
                     <TouchableOpacity 
                        style={styles.iosDatePickerBackdrop} 
                        activeOpacity={1}
                        onPress={() => setShowDatePicker(false)} 
                     />
                     <View style={styles.iosDatePickerContainer}>
                        <View style={styles.iosDatePickerHeader}>
                           <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                              <Text style={styles.iosDatePickerCancel}>Hủy</Text>
                           </TouchableOpacity>
                           <Text style={styles.iosDatePickerTitle}>Chọn ngày giờ bắt đầu</Text>
                           <TouchableOpacity onPress={confirmIOSDate}>
                              <Text style={styles.iosDatePickerDone}>Xong</Text>
                           </TouchableOpacity>
                        </View>
                        <DateTimePicker
                           value={tempDate}
                           mode="datetime"
                           display="spinner"
                           onChange={onDateChangeIOS}
                           minimumDate={new Date()}
                           locale="vi-VN"
                           style={styles.iosDatePicker}
                        />
                     </View>
                  </View>
               )}
            </SafeAreaView>
         </Modal>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
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
   // Create button in header
   createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F97316',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 4,
   },
   createButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
   },
   // Create Modal styles
   createModalContainer: {
      flex: 1,
      backgroundColor: '#F9FAFB',
   },
   createModalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   createModalCloseBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
   },
   createModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111827',
   },
   createModalContent: {
      flex: 1,
      padding: 16,
   },
   formGroup: {
      marginBottom: 20,
   },
   formLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
   },
   formInput: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: '#111827',
   },
   formTextArea: {
      height: 100,
      textAlignVertical: 'top',
   },
   typeSelector: {
      flexDirection: 'row',
      gap: 12,
   },
   typeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 10,
      paddingVertical: 14,
   },
   typeOptionActive: {
      backgroundColor: '#F97316',
      borderColor: '#F97316',
   },
   typeOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#6B7280',
   },
   typeOptionTextActive: {
      color: '#FFFFFF',
   },
   infoNote: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#EFF6FF',
      padding: 14,
      borderRadius: 10,
      gap: 10,
      marginBottom: 20,
   },
   infoNoteText: {
      flex: 1,
      fontSize: 13,
      color: '#1E40AF',
      lineHeight: 20,
   },
   submitCreateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F97316',
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
   },
   submitCreateButtonDisabled: {
      backgroundColor: '#FDBA74',
   },
   submitCreateButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
   },
   // Date Picker styles
   datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 14,
      gap: 10,
   },
   datePickerText: {
      flex: 1,
      fontSize: 15,
      color: '#111827',
   },
   formHint: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 6,
      fontStyle: 'italic',
   },
   // iOS Date Picker
   iosDatePickerOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'flex-end',
   },
   iosDatePickerBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
   },
   iosDatePickerContainer: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
   },
   iosDatePicker: {
      height: 200,
   },
   iosDatePickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   iosDatePickerCancel: {
      fontSize: 16,
      color: '#6B7280',
   },
   iosDatePickerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111827',
   },
   iosDatePickerDone: {
      fontSize: 16,
      fontWeight: '600',
      color: '#F97316',
   },
})
