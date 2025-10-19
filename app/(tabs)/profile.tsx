'use client'

import { CrossPlatformGradient } from '@/components/CrossPlatformGradient'
import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { paymentService, type PaymentHistoryItem } from '@/services/PaymentService'
import { userService, type UserInformationResponse } from '@/services/UserService'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
   ActivityIndicator,
   Alert,
   Modal,
   RefreshControl,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native'


export default function ProfileScreen() {
   const router = useRouter()
   const { user, logout } = useAuth()
   const [isRefreshing, setIsRefreshing] = useState(false)
   const [userInfo, setUserInfo] = useState<UserInformationResponse | null>(null)
   const [showPremiumModal, setShowPremiumModal] = useState(false)
   const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium')
   const [isCreatingPayment, setIsCreatingPayment] = useState(false)
   const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
   const [isLoadingPaymentHistory, setIsLoadingPaymentHistory] = useState(false)
   const [showPaymentHistory, setShowPaymentHistory] = useState(false)


   // Load user profile data from API
   const loadUserProfile = useCallback(async () => {
      try {
         const profileData = await userService.getUserInformation()
         setUserInfo(profileData)
      } catch (error) {
         console.error('Error loading user profile:', error)
         // Keep userInfo as null to use fallback data
      }
   }, [])

   // Load payment history from API
   const loadPaymentHistory = useCallback(async () => {
      try {
         setIsLoadingPaymentHistory(true)
         
         const transactionHistory = await paymentService.getUserTransactionHistory()
         
         // Convert PaymentStatusResponse[] to PaymentHistoryItem[]
         const convertedHistory: PaymentHistoryItem[] = transactionHistory.map((transaction, index) => ({
            id: transaction.transactionId || `txn_${index}`,
            orderCode: transaction.orderCode,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status as 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED',
            gatewayName: transaction.gatewayName,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
            subscriptionPlan: 'PREMIUM', // Default value
            subscriptionDuration: 30 // Default value
         }))
         
         setPaymentHistory(convertedHistory)
         
      } catch (error) {
         console.error('Error loading payment history:', error)
         
         // Mock data for testing UI when API is not ready
         const mockPaymentHistory: PaymentHistoryItem[] = [
            {
               id: '1',
               orderCode: 123456789,
               amount: 36000,
               description: 'Premium Color Bites',
               status: 'SUCCESS',
               gatewayName: 'PayOS',
               createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
               updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
               subscriptionPlan: 'PREMIUM',
               subscriptionDuration: 30
            },
            {
               id: '2',
               orderCode: 123456788,
               amount: 36000,
               description: 'Premium Color Bites',
               status: 'PENDING',
               gatewayName: 'PayOS',
               createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
               updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
               subscriptionPlan: 'PREMIUM',
               subscriptionDuration: 30
            },
            {
               id: '3',
               orderCode: 123456787,
               amount: 36000,
               description: 'Premium Color Bites',
               status: 'FAILED',
               gatewayName: 'PayOS',
               createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
               updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
               subscriptionPlan: 'PREMIUM',
               subscriptionDuration: 30
            }
         ]
         setPaymentHistory(mockPaymentHistory)
      } finally {
         setIsLoadingPaymentHistory(false)
      }
   }, [])

   // Load data on component mount
   useEffect(() => {
      loadUserProfile()
      loadPaymentHistory()
   }, [loadUserProfile, loadPaymentHistory])


   // Handle refresh
   const handleRefresh = useCallback(() => {
      setIsRefreshing(true)
      loadUserProfile()
      loadPaymentHistory()
   }, [loadUserProfile, loadPaymentHistory])


   const handleLogout = async () => {
      Alert.alert(
         'Đăng xuất',
         'Bạn có chắc chắn muốn đăng xuất?',
         [
            { text: 'Hủy', style: 'cancel' },
            { 
               text: 'Đăng xuất', 
               style: 'destructive',
               onPress: async () => {
                  try {
                     await logout()
                  } catch (error) {
                     console.error('Logout error:', error)
                     Alert.alert('Lỗi', 'Không thể đăng xuất')
                  }
               }
            }
         ]
      )
   }

   // Handle Premium subscription payment
   const handleCreatePayment = async () => {
      try {
         setIsCreatingPayment(true)
         
         // Tạo payment request
         const paymentRequest = paymentService.createPremiumPaymentRequest()
         
         // Gọi API tạo thanh toán
         await paymentService.createSubscriptionPayment(paymentRequest)
         
         // Đóng modal premium
         setShowPremiumModal(false)
         
         // TODO: Implement payment WebView or redirect to payment URL
         Alert.alert(
            'Thanh toán',
            'Chức năng thanh toán đang được phát triển. Vui lòng thử lại sau.',
            [{ text: 'Đóng' }]
         )
         
      } catch (error) {
         console.error('Error creating payment:', error)
         setIsCreatingPayment(false)
         
         Alert.alert(
            'Lỗi tạo thanh toán',
            error instanceof Error ? error.message : 'Không thể tạo thanh toán. Vui lòng thử lại sau.',
            [{ text: 'Đóng' }]
         )
      } finally {
         setIsCreatingPayment(false)
      }
   }



   return (
      <SafeAreaView style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <View style={styles.headerContent}>
               <Text style={styles.headerTitle}>Profile</Text>
               <View style={styles.headerActions} />
            </View>
         </View>

         <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            refreshControl={
               <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#F97316"
               />
            }
         >
            {/* Profile Info - Instagram Style */}
            <View style={styles.profileSection}>
               {/* Avatar */}
               <View style={styles.avatarContainer}>
               <Image
                     source={{ 
                        uri: userInfo?.avatarUrl || user?.avatar || getDefaultAvatar(userInfo?.username || user?.name, user?.email) 
                     }}
                  style={styles.profileImage}
                  contentFit="cover"
               />
                  </View>

               {/* Profile Info */}
               <View style={styles.profileInfo}>
                  <View style={styles.nameContainer}>
                     <Text style={styles.userName}>
                        {userInfo?.username || user?.name || 'User'}
                     </Text>
                     {/* Show subscription badge based on actual subscription plan */}
                     {userInfo?.subscriptionPlan === 'PREMIUM' || user?.isPremium ? (
                        <View style={styles.proBadge}>
                           <Ionicons name="star" size={12} color="white" />
                           <Text style={styles.proBadgeText}>PREMIUM</Text>
                        </View>
                     ) : (
                        <View style={[styles.proBadge, { backgroundColor: '#F97316' }]}>
                           <Text style={styles.proBadgeText}>FREE</Text>
                        </View>
                     )}
               </View>

                  {/* Show gender if available */}
                  {userInfo?.gender && (
                     <Text style={styles.userGender}>
                        {userInfo.gender === 'MALE' ? '♂ Nam' : 
                         userInfo.gender === 'FEMALE' ? '♀ Nữ' : 
                         userInfo.gender}
                     </Text>
                  )}
                  
                  {/* Show bio or default message */}
                  <Text style={styles.userBio}>
                     {userInfo?.bio || 'Chưa có tiểu sử'}
                  </Text>
               </View>

               {/* Action Buttons Row */}
               <View style={styles.buttonsRow}>
                  <TouchableOpacity 
                    style={styles.manageAccountButton}
                    onPress={() => router.push('/profile/AccountManagement')}
                    activeOpacity={0.9}
                 >
                     <Text style={styles.manageAccountButtonText}>Quản lý tài khoản</Text>
                  </TouchableOpacity>
               </View>
            </View>

            {/* Premium Banner */}
            {userInfo?.subscriptionPlan !== 'PREMIUM' && !user?.isPremium && (
               <TouchableOpacity 
                  style={styles.premiumBanner}
                  onPress={() => setShowPremiumModal(true)}
                  activeOpacity={0.8}
               >
                  <CrossPlatformGradient
                     colors={["#F97316", "#FB923C"]}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 0 }}
                     style={styles.premiumBannerContent}
                  >
                     <View style={styles.premiumBannerLeft}>
                        <View style={styles.premiumBannerIcon}>
                           <Ionicons name="star" size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.premiumBannerText}>
                           <Text style={styles.premiumBannerTitle}>Premium</Text>
                           <Text style={styles.premiumBannerSubtitle}>Không giới hạn, nhiều đặc quyền chờ bạn khám phá!</Text>
                        </View>
                     </View>
                     <View style={styles.premiumBannerButton}>
                        <Text style={styles.premiumBannerButtonText}>Nâng cấp</Text>
                        <Ionicons name="chevron-forward" size={16} color="#8B5CF6" />
                     </View>
                  </CrossPlatformGradient>
               </TouchableOpacity>
            )}

            {/* Quick actions list */}
            <View style={styles.quickList}>
               <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/profile/MyPosts')} activeOpacity={0.8}>
                  <View style={styles.quickLeft}>
                     <Ionicons name="document-text-outline" size={18} color="#111827" />
                     <Text style={styles.quickTextDark}>Quản lý bài đăng</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/auth/privacy-policy')} activeOpacity={0.8}>
                  <View style={styles.quickLeft}>
                     <Ionicons name="shield-checkmark-outline" size={18} color="#111827" />
                     <Text style={styles.quickTextDark}>Chính sách bảo mật</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/auth/terms-of-service')} activeOpacity={0.8}>
                  <View style={styles.quickLeft}>
                     <Ionicons name="newspaper-outline" size={18} color="#111827" />
                     <Text style={styles.quickTextDark}>Điều khoản dịch vụ</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/profile/PaymentHistory')} activeOpacity={0.8}>
                  <View style={styles.quickLeft}>
                     <Ionicons name="card-outline" size={18} color="#111827" />
                     <Text style={styles.quickTextDark}>Lịch sử thanh toán</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
               </TouchableOpacity>
               <TouchableOpacity style={[styles.quickItem, { borderBottomWidth: 0 }]} onPress={handleLogout} activeOpacity={0.8}>
                  <View style={styles.quickLeft}>
                     <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                     <Text style={[styles.quickTextDark, { color: '#DC2626' }]}>Đăng xuất</Text>
                  </View>
               </TouchableOpacity>
            </View>

            {/* Tabs & content hidden. Điều hướng các mục sang trang riêng ở bước sau */}
         </ScrollView>

         {/* Premium Modal */}
         <Modal
            visible={showPremiumModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPremiumModal(false)}
         >
            <View style={styles.modalOverlay}>
               <View style={styles.modalContainer}>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                     <TouchableOpacity
                        onPress={() => setShowPremiumModal(false)}
                        style={styles.modalCloseButton}
                     >
                        <Ionicons name="close" size={24} color="#6B7280" />
                     </TouchableOpacity>
                  </View>

                  {/* Plan Selection Tabs */}
                  <View style={styles.planTabs}>
                     <TouchableOpacity 
                        style={[styles.planTab, selectedPlan === 'free' && styles.planTabActive]}
                        onPress={() => setSelectedPlan('free')}
                     >
                        <Text style={selectedPlan === 'free' ? styles.planTabTextActive : styles.planTabTextInactive}>Free</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                        style={[styles.planTab, selectedPlan === 'premium' && styles.planTabActive]}
                        onPress={() => setSelectedPlan('premium')}
                     >
                        <Text style={selectedPlan === 'premium' ? styles.planTabTextActive : styles.planTabTextInactive}>Premium</Text>
                     </TouchableOpacity>
                  </View>

                  {/* Plan Card */}
                  {selectedPlan === 'free' ? (
                     <View style={styles.freeCard}>
                        <View style={styles.freeCardContent}>
                           <View style={styles.freeCardTitle}>
                              <Ionicons name="gift-outline" size={20} color="#6B7280" />
                              <Text style={styles.freeCardTitleText}>Free</Text>
                           </View>
                           
                           <Text style={styles.freeCardPrice}>0đ/tháng</Text>
                           
                           <View style={styles.freeFeatures}>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.freeFeatureText}>Trắc nghiệm AI màu sắc (5 lần/ngày)</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.freeFeatureText}>Gợi ý quán ăn theo giá (3 lần/ngày)</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="close" size={16} color="#EF4444" />
                                 <Text style={styles.freeFeatureTextDisabled}>Đăng bài premium (công thức + video)</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.freeFeatureText}>Xem bài viết cộng đồng (10 bài/ngày)</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="close" size={16} color="#EF4444" />
                                 <Text style={styles.freeFeatureTextDisabled}>Tìm kiếm nâng cao (AI-powered)</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.freeFeatureText}>Lưu quán ăn yêu thích (tối đa 5 quán)</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="close" size={16} color="#EF4444" />
                                 <Text style={styles.freeFeatureTextDisabled}>Premium Food Planner</Text>
                              </View>
                              <View style={styles.freeFeature}>
                                 <Ionicons name="close" size={16} color="#EF4444" />
                                 <Text style={styles.freeFeatureTextDisabled}>Đăng công thức chi tiết</Text>
                              </View>
                           </View>
                        </View>
                     </View>
                  ) : (
                     <View style={styles.premiumCard}>
                        <View style={styles.premiumCardHeader}>
                           <Text style={styles.premiumCardBadge}>Phổ biến nhất</Text>
                        </View>
                        
                        <View style={styles.premiumCardContent}>
                           <View style={styles.premiumCardTitle}>
                              <Ionicons name="diamond" size={20} color="#8B5CF6" />
                              <Text style={styles.premiumCardTitleText}>Premium</Text>
                           </View>
                           
                           <Text style={styles.premiumCardPrice}>36.000đ/tháng</Text>
                           
                           <View style={styles.premiumFeatures}>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Trắc nghiệm AI màu sắc không giới hạn</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Gợi ý quán ăn theo giá không giới hạn</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Đăng bài premium (công thức + video)</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Xem bài viết cộng đồng không giới hạn</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Tìm kiếm nâng cao (AI-powered)</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Lưu quán ăn yêu thích không giới hạn</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Premium Food Planner</Text>
                              </View>
                              <View style={styles.premiumFeature}>
                                 <Ionicons name="checkmark" size={16} color="#10B981" />
                                 <Text style={styles.premiumFeatureText}>Đăng công thức chi tiết</Text>
                              </View>
                           </View>
                        </View>
                     </View>
                  )}

                  {/* Subscribe Button - Only show for Premium plan */}
                  {selectedPlan === 'premium' && (
                     <TouchableOpacity 
                        style={[styles.subscribeButton, isCreatingPayment && styles.subscribeButtonDisabled]}
                        onPress={handleCreatePayment}
                        disabled={isCreatingPayment}
                        activeOpacity={isCreatingPayment ? 1 : 0.8}
                     >
                        {isCreatingPayment ? (
                           <View style={styles.subscribeButtonLoading}>
                              <ActivityIndicator size="small" color="#FFFFFF" />
                              <Text style={styles.subscribeButtonText}>Đang tạo thanh toán...</Text>
                           </View>
                        ) : (
                           <Text style={styles.subscribeButtonText}>Đăng ký ngay</Text>
                        )}
                     </TouchableOpacity>
                  )}
               </View>
            </View>
         </Modal>

         {/* Payment History Modal - Full Screen */}
         <Modal
            visible={showPaymentHistory}
            transparent={false}
            animationType="slide"
            onRequestClose={() => setShowPaymentHistory(false)}
         >
            <SafeAreaView style={styles.fullScreenModalContainer}>
               {/* Modal Header */}
               <View style={styles.fullScreenModalHeader}>
                  <TouchableOpacity
                     onPress={() => setShowPaymentHistory(false)}
                     style={styles.fullScreenModalBackButton}
                  >
                     <Ionicons name="arrow-back" size={24} color="#111827" />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenModalTitle}>Lịch sử thanh toán</Text>
                  <View style={styles.fullScreenModalHeaderSpacer} />
               </View>

               {/* Payment History Content */}
               <ScrollView 
                  style={styles.fullScreenModalContent}
                  contentContainerStyle={styles.fullScreenModalContentContainer}
                  showsVerticalScrollIndicator={false}
               >
                  {isLoadingPaymentHistory ? (
                     <View style={styles.fullScreenLoadingContainer}>
                        <ActivityIndicator size="large" color="#F97316" />
                        <Text style={styles.fullScreenLoadingText}>Đang tải lịch sử...</Text>
                     </View>
                  ) : paymentHistory.length === 0 ? (
                     <View style={styles.fullScreenEmptyState}>
                        <View style={styles.fullScreenEmptyStateIcon}>
                           <Ionicons name="card-outline" size={64} color="#9CA3AF" />
                        </View>
                        <Text style={styles.fullScreenEmptyStateTitle}>Chưa có lịch sử thanh toán</Text>
                        <Text style={styles.fullScreenEmptyStateSubtitle}>
                           Các giao dịch của bạn sẽ hiển thị ở đây
                        </Text>
                     </View>
                  ) : (
                     <View style={styles.fullScreenPaymentList}>
                        {paymentHistory.map((payment, index) => (
                           <View key={payment.id} style={styles.fullScreenPaymentItem}>
                              {/* Payment Header */}
                              <View style={styles.fullScreenPaymentHeader}>
                                 <View style={styles.fullScreenPaymentLeft}>
                                    <View style={styles.fullScreenPaymentIconContainer}>
                                       <Ionicons 
                                          name="card" 
                                          size={20} 
                                          color={payment.status === 'SUCCESS' ? '#10B981' : 
                                                payment.status === 'PENDING' ? '#F59E0B' : 
                                                payment.status === 'FAILED' ? '#EF4444' : '#6B7280'} 
                                       />
                                    </View>
                                    <View style={styles.fullScreenPaymentInfo}>
                                       <Text style={styles.fullScreenPaymentTitle}>
                                          {payment.description}
                                       </Text>
                                       <Text style={styles.fullScreenPaymentOrderCode}>
                                          Mã đơn: {payment.orderCode}
                                       </Text>
                                    </View>
                                 </View>
                                 <View style={styles.fullScreenPaymentRight}>
                                    <Text style={styles.fullScreenPaymentAmount}>
                                       {payment.amount.toLocaleString('vi-VN')}đ
                                    </Text>
                                    <View style={[
                                       styles.fullScreenPaymentStatusBadge,
                                       payment.status === 'SUCCESS' && styles.fullScreenPaymentStatusSuccess,
                                       payment.status === 'PENDING' && styles.fullScreenPaymentStatusPending,
                                       payment.status === 'FAILED' && styles.fullScreenPaymentStatusFailed,
                                       payment.status === 'CANCELLED' && styles.fullScreenPaymentStatusCancelled,
                                    ]}>
                                       <Text style={[
                                          styles.fullScreenPaymentStatusText,
                                          payment.status === 'SUCCESS' && styles.fullScreenPaymentStatusTextSuccess,
                                          payment.status === 'PENDING' && styles.fullScreenPaymentStatusTextPending,
                                          payment.status === 'FAILED' && styles.fullScreenPaymentStatusTextFailed,
                                          payment.status === 'CANCELLED' && styles.fullScreenPaymentStatusTextCancelled,
                                       ]}>
                                          {payment.status === 'SUCCESS' ? 'Thành công' :
                                           payment.status === 'PENDING' ? 'Đang xử lý' :
                                           payment.status === 'FAILED' ? 'Thất bại' :
                                           payment.status === 'CANCELLED' ? 'Đã hủy' : payment.status}
                                       </Text>
                                    </View>
                                 </View>
                              </View>
                              
                              {/* Payment Footer */}
                              <View style={styles.fullScreenPaymentFooter}>
                                 <View style={styles.fullScreenPaymentDateContainer}>
                                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                                    <Text style={styles.fullScreenPaymentDate}>
                                       {new Date(payment.createdAt).toLocaleDateString('vi-VN', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                       })}
                                    </Text>
                                 </View>
                                 <View style={styles.fullScreenPaymentGatewayContainer}>
                                    <Ionicons name="card-outline" size={14} color="#6B7280" />
                                    <Text style={styles.fullScreenPaymentGateway}>
                                       {payment.gatewayName}
                                    </Text>
                                 </View>
                              </View>
                              
                              {/* Divider */}
                              {index < paymentHistory.length - 1 && (
                                 <View style={styles.fullScreenPaymentDivider} />
                              )}
                           </View>
                        ))}
                     </View>
                  )}
               </ScrollView>
            </SafeAreaView>
         </Modal>

         {/* Edit Profile Modal removed: moved to /profile/AccountManagement */}

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
      paddingVertical: 12,
   },
   headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
   },
   headerActions: {
      flexDirection: 'row',
   },
   headerButton: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 8,
      marginLeft: 8,
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F3F4F6',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
   },
   headerSpacer: {
      width: 40,
   },
   scrollView: {
      flex: 1,
   },
   scrollContent: {
      paddingBottom: 20,
   },
   profileSection: {
      marginBottom: 12,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 12,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
   },
   avatarContainer: {
      alignItems: 'center',
      marginBottom: 16,
   },
   profileImage: {
      height: 88,
      width: 88,
      borderRadius: 44,
      borderWidth: 2,
      borderColor: '#F3F4F6',
   },
   profileInfo: {
      alignItems: 'center',
      marginBottom: 12,
   },
   nameContainer: {
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   userName: {
      fontSize: 22,
      fontWeight: '800',
      color: '#111827',
      marginRight: 8,
   },
   proBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 4,
      backgroundColor: '#F97316',
      paddingHorizontal: 8,
      paddingVertical: 4,
   },
   proBadgeText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
   },
   userGender: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4,
      fontWeight: '500',
   },
   userBio: {
      marginBottom: 12,
      color: '#4B5563',
      fontSize: 14,
      lineHeight: 20,
   },
   editProfileButton: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: '#111827',
      borderWidth: 0,
      paddingVertical: 10,
   },
   editProfileButtonText: {
      textAlign: 'center',
      fontWeight: '600',
      color: '#FFFFFF',
   },
   manageAccountButton: {
      flex: 1,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#D1D5DB',
      paddingVertical: 10,
   },
   manageAccountButtonText: {
      textAlign: 'center',
      fontWeight: '600',
      color: '#111827',
   },
   quickList: {
      marginHorizontal: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#E5E7EB',
   },
   quickItem: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   quickLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   quickTextDark: {
      color: '#111827',
      fontSize: 14,
      fontWeight: '500',
   },
    buttonsRow: {
       flexDirection: 'row',
       width: '100%',
    },
    logoutButton: {
       flexDirection: 'row',
       alignItems: 'center',
       borderRadius: 8,
       borderWidth: 1,
       borderColor: '#DC2626',
       backgroundColor: '#FEF2F2',
       paddingHorizontal: 12,
       paddingVertical: 8,
       marginLeft: 8,
    },
    logoutText: {
       marginLeft: 4,
       fontSize: 14,
       fontWeight: '500',
       color: '#DC2626',
    },
    // Premium Banner styles - Modern Design
    premiumBanner: {
       marginHorizontal: 16,
       marginBottom: 16,
       borderRadius: 16,
       overflow: 'hidden',
       shadowColor: '#8B5CF6',
       shadowOffset: {
          width: 0,
          height: 8,
       },
       shadowOpacity: 0.3,
       shadowRadius: 16,
       elevation: 12,
    },
    premiumBannerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 18,
      position: 'relative',
      borderRadius: 16,
    },
    premiumBannerLeft: {
       flexDirection: 'row',
       alignItems: 'center',
       flex: 1,
       zIndex: 2,
    },
    premiumBannerIcon: {
       width: 44,
       height: 44,
       borderRadius: 22,
       backgroundColor: 'rgba(255, 255, 255, 0.2)',
       alignItems: 'center',
       justifyContent: 'center',
       marginRight: 14,
       borderWidth: 1.5,
       borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    premiumBannerText: {
       flex: 1,
       paddingRight: 12,
    },
    premiumBannerTitle: {
       fontSize: 16,
       fontWeight: '700',
       color: '#FFFFFF',
       marginBottom: 3,
       textShadowColor: 'rgba(0, 0, 0, 0.3)',
       textShadowOffset: { width: 0, height: 1 },
       textShadowRadius: 2,
       lineHeight: 20,
    },
    premiumBannerSubtitle: {
       fontSize: 13,
       color: 'rgba(255, 255, 255, 0.85)',
       fontWeight: '500',
       lineHeight: 16,
    },
    premiumBannerButton: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: 'rgba(255, 255, 255, 0.95)',
       borderRadius: 10,
       paddingHorizontal: 14,
       paddingVertical: 9,
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 2,
       },
       shadowOpacity: 0.1,
       shadowRadius: 4,
       elevation: 3,
       minWidth: 90,
       justifyContent: 'center',
    },
    premiumBannerButtonText: {
       fontSize: 14,
       fontWeight: '700',
       color: '#8B5CF6',
       marginRight: 6,
    },
    // Premium Modal styles
    modalOverlay: {
       flex: 1,
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
       justifyContent: 'flex-end',
    },
    modalContainer: {
       backgroundColor: '#F3F4F6',
       borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
       paddingBottom: 34,
       maxHeight: '90%',
    },
    modalHeader: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingHorizontal: 16,
       paddingTop: 16,
       paddingBottom: 8,
    },
    modalHeaderSpacer: {
       width: 32,
    },
    modalCloseButton: {
       width: 32,
       height: 32,
       borderRadius: 16,
       backgroundColor: '#E5E7EB',
       alignItems: 'center',
       justifyContent: 'center',
    },
    planTabs: {
       flexDirection: 'row',
       marginHorizontal: 16,
       marginBottom: 16,
       backgroundColor: '#E5E7EB',
       borderRadius: 8,
       padding: 4,
    },
    planTab: {
       flex: 1,
       paddingVertical: 8,
       paddingHorizontal: 16,
       borderRadius: 6,
       alignItems: 'center',
    },
    planTabActive: {
       backgroundColor: '#8B5CF6',
    },
    planTabTextInactive: {
       fontSize: 14,
       fontWeight: '500',
       color: '#6B7280',
    },
    planTabTextActive: {
       fontSize: 14,
       fontWeight: '500',
       color: '#FFFFFF',
    },

    premiumCard: {
       marginHorizontal: 16,
       backgroundColor: '#FFFFFF',
       borderRadius: 12,
       marginBottom: 20,
       overflow: 'hidden',
    },
    premiumCardHeader: {
       backgroundColor: '#FEE2E2',
       paddingVertical: 8,
       paddingHorizontal: 16,
       alignItems: 'center',
    },
    premiumCardBadge: {
       fontSize: 12,
       fontWeight: '500',
       color: '#DC2626',
    },
    premiumCardContent: {
       padding: 16,
    },
    premiumCardTitle: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 8,
    },
    premiumCardTitleText: {
       fontSize: 18,
       fontWeight: '600',
       color: '#111827',
       marginLeft: 8,
    },
    premiumCardPrice: {
       fontSize: 24,
       fontWeight: '700',
       color: '#8B5CF6',
       marginBottom: 16,
    },
    premiumFeatures: {
       gap: 12,
    },
    premiumFeature: {
       flexDirection: 'row',
       alignItems: 'flex-start',
    },
    premiumFeatureText: {
       fontSize: 14,
       color: '#374151',
       marginLeft: 8,
       flex: 1,
       lineHeight: 20,
    },
    subscribeButton: {
       marginHorizontal: 16,
       backgroundColor: '#8B5CF6',
       borderRadius: 12,
       paddingVertical: 16,
       alignItems: 'center',
    },
    subscribeButtonText: {
       fontSize: 16,
       fontWeight: '600',
       color: '#FFFFFF',
    },
    subscribeButtonDisabled: {
       backgroundColor: '#9CA3AF',
       opacity: 0.7,
    },
    subscribeButtonLoading: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
    },
    // Free Plan Card styles
    freeCard: {
       marginHorizontal: 16,
       backgroundColor: '#FFFFFF',
       borderRadius: 12,
       marginBottom: 20,
       overflow: 'hidden',
       borderWidth: 1,
       borderColor: '#E5E7EB',
    },
    freeCardContent: {
       padding: 16,
    },
    freeCardTitle: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 8,
    },
    freeCardTitleText: {
       fontSize: 18,
       fontWeight: '600',
       color: '#111827',
       marginLeft: 8,
    },
    freeCardPrice: {
       fontSize: 24,
       fontWeight: '700',
       color: '#6B7280',
       marginBottom: 16,
    },
    freeFeatures: {
       gap: 12,
    },
    freeFeature: {
       flexDirection: 'row',
       alignItems: 'flex-start',
    },
    freeFeatureText: {
       fontSize: 14,
       color: '#374151',
       marginLeft: 8,
       flex: 1,
       lineHeight: 20,
    },
    freeFeatureTextDisabled: {
       fontSize: 14,
       color: '#9CA3AF',
       marginLeft: 8,
       flex: 1,
       lineHeight: 20,
       textDecorationLine: 'line-through',
    },
    // Payment History Modal styles
    modalTitle: {
       fontSize: 18,
       fontWeight: '600',
       color: '#111827',
       flex: 1,
       textAlign: 'center',
    },
    paymentHistoryContent: {
       flex: 1,
       paddingHorizontal: 16,
    },
    paymentHistoryItem: {
       backgroundColor: '#FFFFFF',
       borderRadius: 12,
       padding: 16,
       marginBottom: 12,
       borderWidth: 1,
       borderColor: '#E5E7EB',
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 1,
       },
       shadowOpacity: 0.05,
       shadowRadius: 2,
       elevation: 1,
    },
    paymentHistoryHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'flex-start',
       marginBottom: 12,
    },
    paymentHistoryLeft: {
       flex: 1,
       marginRight: 12,
    },
    paymentHistoryTitle: {
       fontSize: 16,
       fontWeight: '600',
       color: '#111827',
       marginBottom: 4,
    },
    paymentHistoryOrderCode: {
       fontSize: 12,
       color: '#6B7280',
    },
    paymentHistoryRight: {
       alignItems: 'flex-end',
    },
    paymentHistoryAmount: {
       fontSize: 16,
       fontWeight: '700',
       color: '#111827',
       marginBottom: 8,
    },
    paymentStatusBadge: {
       paddingHorizontal: 8,
       paddingVertical: 4,
       borderRadius: 6,
    },
    paymentStatusSuccess: {
       backgroundColor: '#D1FAE5',
    },
    paymentStatusPending: {
       backgroundColor: '#FEF3C7',
    },
    paymentStatusFailed: {
       backgroundColor: '#FEE2E2',
    },
    paymentStatusCancelled: {
       backgroundColor: '#F3F4F6',
    },
    paymentStatusText: {
       fontSize: 12,
       fontWeight: '500',
    },
    paymentStatusTextSuccess: {
       color: '#065F46',
    },
    paymentStatusTextPending: {
       color: '#92400E',
    },
    paymentStatusTextFailed: {
       color: '#DC2626',
    },
    paymentStatusTextCancelled: {
       color: '#6B7280',
    },
    paymentHistoryFooter: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       paddingTop: 12,
       borderTopWidth: 1,
       borderTopColor: '#F3F4F6',
    },
    paymentHistoryDate: {
       fontSize: 12,
       color: '#6B7280',
    },
    paymentHistoryGateway: {
       fontSize: 12,
       color: '#6B7280',
       fontWeight: '500',
    },
    // Full Screen Modal Styles
    fullScreenModalContainer: {
       flex: 1,
       backgroundColor: '#F9FAFB',
    },
    fullScreenModalHeader: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingHorizontal: 16,
       paddingVertical: 12,
       backgroundColor: '#FFFFFF',
       borderBottomWidth: 1,
       borderBottomColor: '#E5E7EB',
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 1,
       },
       shadowOpacity: 0.05,
       shadowRadius: 2,
       elevation: 2,
    },
    fullScreenModalBackButton: {
       width: 40,
       height: 40,
       borderRadius: 20,
       backgroundColor: '#F3F4F6',
       alignItems: 'center',
       justifyContent: 'center',
    },
    fullScreenModalTitle: {
       fontSize: 18,
       fontWeight: '600',
       color: '#111827',
       flex: 1,
       textAlign: 'center',
    },
    fullScreenModalHeaderSpacer: {
       width: 40,
    },
    fullScreenModalContent: {
       flex: 1,
    },
    fullScreenModalContentContainer: {
       paddingBottom: 20,
    },
    fullScreenLoadingContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       paddingVertical: 60,
    },
    fullScreenLoadingText: {
       marginTop: 16,
       fontSize: 16,
       color: '#6B7280',
       fontWeight: '500',
    },
    fullScreenEmptyState: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       paddingVertical: 60,
       paddingHorizontal: 32,
    },
    fullScreenEmptyStateIcon: {
       width: 120,
       height: 120,
       borderRadius: 60,
       backgroundColor: '#F3F4F6',
       alignItems: 'center',
       justifyContent: 'center',
       marginBottom: 24,
    },
    fullScreenEmptyStateTitle: {
       fontSize: 20,
       fontWeight: '600',
       color: '#111827',
       marginBottom: 8,
       textAlign: 'center',
    },
    fullScreenEmptyStateSubtitle: {
       fontSize: 16,
       color: '#6B7280',
       textAlign: 'center',
       lineHeight: 24,
    },
    fullScreenPaymentList: {
       paddingHorizontal: 16,
       paddingTop: 16,
    },
    fullScreenPaymentItem: {
       backgroundColor: '#FFFFFF',
       borderRadius: 12,
       marginBottom: 12,
       shadowColor: '#000',
       shadowOffset: {
          width: 0,
          height: 1,
       },
       shadowOpacity: 0.05,
       shadowRadius: 3,
       elevation: 2,
    },
    fullScreenPaymentHeader: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       justifyContent: 'space-between',
       padding: 16,
       paddingBottom: 12,
    },
    fullScreenPaymentLeft: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       flex: 1,
       marginRight: 12,
    },
    fullScreenPaymentIconContainer: {
       width: 40,
       height: 40,
       borderRadius: 20,
       backgroundColor: '#F3F4F6',
       alignItems: 'center',
       justifyContent: 'center',
       marginRight: 12,
    },
    fullScreenPaymentInfo: {
       flex: 1,
    },
    fullScreenPaymentTitle: {
       fontSize: 16,
       fontWeight: '600',
       color: '#111827',
       marginBottom: 4,
       lineHeight: 22,
    },
    fullScreenPaymentOrderCode: {
       fontSize: 12,
       color: '#6B7280',
       lineHeight: 16,
    },
    fullScreenPaymentRight: {
       alignItems: 'flex-end',
    },
    fullScreenPaymentAmount: {
       fontSize: 18,
       fontWeight: '700',
       color: '#111827',
       marginBottom: 8,
    },
    fullScreenPaymentStatusBadge: {
       paddingHorizontal: 8,
       paddingVertical: 4,
       borderRadius: 6,
    },
    fullScreenPaymentStatusSuccess: {
       backgroundColor: '#D1FAE5',
    },
    fullScreenPaymentStatusPending: {
       backgroundColor: '#FEF3C7',
    },
    fullScreenPaymentStatusFailed: {
       backgroundColor: '#FEE2E2',
    },
    fullScreenPaymentStatusCancelled: {
       backgroundColor: '#F3F4F6',
    },
    fullScreenPaymentStatusText: {
       fontSize: 12,
       fontWeight: '500',
    },
    fullScreenPaymentStatusTextSuccess: {
       color: '#065F46',
    },
    fullScreenPaymentStatusTextPending: {
       color: '#92400E',
    },
    fullScreenPaymentStatusTextFailed: {
       color: '#DC2626',
    },
    fullScreenPaymentStatusTextCancelled: {
       color: '#6B7280',
    },
    fullScreenPaymentFooter: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       paddingHorizontal: 16,
       paddingBottom: 16,
       paddingTop: 8,
    },
    fullScreenPaymentDateContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       flex: 1,
    },
    fullScreenPaymentDate: {
       fontSize: 12,
       color: '#6B7280',
       marginLeft: 4,
    },
    fullScreenPaymentGatewayContainer: {
       flexDirection: 'row',
       alignItems: 'center',
    },
    fullScreenPaymentGateway: {
       fontSize: 12,
       color: '#6B7280',
       fontWeight: '500',
       marginLeft: 4,
    },
    fullScreenPaymentDivider: {
       height: 1,
       backgroundColor: '#E5E7EB',
       marginHorizontal: 16,
    },
 })
