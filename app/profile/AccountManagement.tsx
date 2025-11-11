'use client'

import { getDefaultAvatar } from '@/constants/defaultImages'
import { useAuth } from '@/context/AuthProvider'
import { useImagePicker } from '@/hooks'
import { authService } from '@/services/AuthService'
import { userService } from '@/services/UserService'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

export default function AccountManagement() {
   const router = useRouter()
   const { user, updateUser, updateUserAvatar } = useAuth()
   const { pickImage } = useImagePicker()

   const [editView, setEditView] = useState<'menu' | 'avatar' | 'info' | 'password'>('menu')
   const [userInfo, setUserInfo] = useState<any>(null)
   const [editGender, setEditGender] = useState<'MALE' | 'FEMALE' | null>(null)
   const [editBio, setEditBio] = useState('')
   const [avatarVersion, setAvatarVersion] = useState(0)

   // Load user info on component mount
   useEffect(() => {
      const loadUserInfo = async () => {
         try {
            const profileData = await userService.getUserInformation()
            setUserInfo(profileData)
            setEditGender(profileData.gender || null)
            setEditBio(profileData.bio || '')
         } catch (error) {
            console.error('Error loading user info:', error)
         }
      }
      loadUserInfo()
   }, [user?.name])

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
               <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
               {editView === 'menu' ? 'Quản lý tài khoản' : editView === 'avatar' ? 'Đổi ảnh đại diện' : editView === 'info' ? 'Thay đổi thông tin' : 'Đổi mật khẩu'}
            </Text>
            <View style={styles.headerSpacer} />
         </View>

         <ScrollView contentContainerStyle={styles.scrollContent}>
            {editView === 'menu' && (
               <View style={styles.menuContainer}>
                  <TouchableOpacity onPress={() => setEditView('avatar')} activeOpacity={0.8} style={styles.menuItem}>
                     <View style={styles.menuItemLeft}>
                        <Image 
                           source={{ uri: (userInfo?.avatarUrl || user?.avatar || getDefaultAvatar(user?.name || 'U', user?.email)) + `?v=${avatarVersion}` }} 
                           style={styles.avatarImage} 
                           cachePolicy="none"
                        />
                        <Text style={styles.menuItemText}>Đổi ảnh đại diện</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setEditView('info')} activeOpacity={0.8} style={styles.menuItem}>
                     <View style={styles.menuItemLeft}>
                        <Ionicons name="create-outline" size={18} color="#6B7280" />
                        <Text style={styles.menuItemText}>Thay đổi thông tin</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setEditView('password')} activeOpacity={0.8} style={styles.menuItem}>
                     <View style={styles.menuItemLeft}>
                        <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
                        <Text style={styles.menuItemText}>Đổi mật khẩu</Text>
                     </View>
                     <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                  </TouchableOpacity>
               </View>
            )}

            {editView === 'avatar' && (
               <View style={styles.avatarContainer}>
                  <Image
                     source={{ uri: (userInfo?.avatarUrl || user?.avatar || getDefaultAvatar(user?.name || 'U', user?.email)) + `?v=${avatarVersion}` }}
                     style={styles.avatarLarge}
                     cachePolicy="none"
                  />
                  <TouchableOpacity
                     onPress={async () => {
                        const uri = await pickImage()
                        if (!uri) return
                        const accountId = userInfo?.accountId || user?.id
                        if (!accountId) return
                        try {
                           const fileUri = typeof uri === 'string' ? uri : uri.uri
                           const avatarUrl = await userService.uploadAvatar(accountId, fileUri)
                           setUserInfo((prev: any) => (prev ? { ...prev, avatarUrl } : { avatarUrl }))
                           await updateUserAvatar(avatarUrl)
                           setAvatarVersion((v) => v + 1)
                           Toast.show({ type: 'success', text1: 'Thành công', text2: 'Đổi avatar thành công' })
                        } catch (error) {
                           console.error('Error uploading avatar:', error)
                           Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể upload avatar' })
                        }
                     }}
                     activeOpacity={0.8}
                     style={styles.avatarButton}
                  >
                     <Text style={styles.avatarButtonText}>Đổi avatar</Text>
                  </TouchableOpacity>
               </View>
            )}

            {editView === 'info' && (
               <View>
                  <Text style={[styles.formLabel, { marginBottom: 6 }]}>Giới tính</Text>
                  <View style={styles.genderContainer}>
                     <TouchableOpacity
                        onPress={() => setEditGender('MALE')}
                        style={[styles.genderButton, editGender === 'MALE' ? styles.genderButtonActive : styles.genderButtonInactive]}
                        activeOpacity={0.8}
                     >
                        <Text style={[styles.genderButtonText, editGender === 'MALE' ? styles.genderButtonTextActive : styles.genderButtonTextInactive]}>Nam</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={() => setEditGender('FEMALE')}
                        style={[styles.genderButton, editGender === 'FEMALE' ? styles.genderButtonActive : styles.genderButtonInactive]}
                        activeOpacity={0.8}
                     >
                        <Text style={[styles.genderButtonText, editGender === 'FEMALE' ? styles.genderButtonTextActive : styles.genderButtonTextInactive]}>Nữ</Text>
                     </TouchableOpacity>
                  </View>

                  <Text style={styles.formLabel}>Tiểu sử</Text>
                  <TextInput
                     value={editBio}
                     onChangeText={setEditBio}
                     placeholder="Giới thiệu bản thân"
                     multiline
                     numberOfLines={3}
                     style={styles.multilineInput}
                  />

                  <View style={styles.buttonRow}>
                     <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton} activeOpacity={0.8}>
                        <Text style={styles.cancelButtonText}>Hủy</Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={async () => {
                           try {
                              const updated = await userService.updateUserInformation({
                                 gender: editGender,
                                 bio: editBio,
                              })
                              setUserInfo(updated)
                              updateUser({ gender: editGender || undefined, bio: editBio })
                              Toast.show({ type: 'success', text1: 'Thành công', text2: 'Cập nhật thông tin thành công' })
                              router.back()
                           } catch (error) {
                              console.error('Error updating user info:', error)
                              Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể cập nhật thông tin' })
                           }
                        }}
                        style={styles.saveButton}
                        activeOpacity={0.8}
                     >
                        <Text style={styles.saveButtonText}>Lưu</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}

            {editView === 'password' && (
               <ChangePasswordForm />
            )}
         </ScrollView>
      </SafeAreaView>
   )
}

function ChangePasswordForm() {
   const [oldPassword, setOldPassword] = useState('')
   const [newPassword, setNewPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [showOld, setShowOld] = useState(false)
   const [showNew, setShowNew] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)

   const handleSubmit = async () => {
      if (!oldPassword || !newPassword || !confirmPassword) {
         Toast.show({ type: 'error', text1: 'Thiếu thông tin', text2: 'Vui lòng nhập đầy đủ các trường' })
         return
      }
      if (newPassword.length < 6) {
         Toast.show({ type: 'error', text1: 'Mật khẩu yếu', text2: 'Mật khẩu mới tối thiểu 6 ký tự' })
         return
      }
      if (newPassword !== confirmPassword) {
         Toast.show({ type: 'error', text1: 'Không khớp', text2: 'Mật khẩu mới và xác nhận không khớp' })
         return
      }
      try {
         setIsSubmitting(true)
         const message = await authService.changePassword(oldPassword, newPassword, confirmPassword)
         Toast.show({ type: 'success', text1: 'Thành công', text2: message })
         setOldPassword('')
         setNewPassword('')
         setConfirmPassword('')
      } catch (error: any) {
         Toast.show({ type: 'error', text1: 'Lỗi', text2: error.message || 'Đổi mật khẩu thất bại' })
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <View style={styles.passwordForm}>
         <View style={styles.passwordInputWrapper}>
            <TextInput 
               value={oldPassword} 
               onChangeText={setOldPassword} 
               placeholder="Mật khẩu hiện tại" 
               secureTextEntry={!showOld}
               style={[styles.textInput, styles.passwordInput]}
            />
            <TouchableOpacity onPress={() => setShowOld((v) => !v)} style={styles.eyeIconBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
               <Ionicons name={showOld ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
            </TouchableOpacity>
         </View>

         <View style={styles.passwordInputWrapper}>
            <TextInput 
               value={newPassword} 
               onChangeText={setNewPassword} 
               placeholder="Mật khẩu mới" 
               secureTextEntry={!showNew}
               style={[styles.textInput, styles.passwordInput]}
            />
            <TouchableOpacity onPress={() => setShowNew((v) => !v)} style={styles.eyeIconBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
               <Ionicons name={showNew ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
            </TouchableOpacity>
         </View>

         <View style={styles.passwordInputWrapper}>
            <TextInput 
               value={confirmPassword} 
               onChangeText={setConfirmPassword} 
               placeholder="Xác nhận mật khẩu mới" 
               secureTextEntry={!showConfirm}
               style={[styles.textInput, styles.passwordInput]}
            />
            <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeIconBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
               <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6B7280" />
            </TouchableOpacity>
         </View>
         <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isSubmitting} 
            activeOpacity={isSubmitting ? 1 : 0.8} 
            style={[styles.passwordButton, isSubmitting ? styles.passwordButtonInactive : styles.passwordButtonActive]}
         >
            {isSubmitting ? (
               <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
               <Text style={styles.passwordButtonText}>Đổi mật khẩu</Text>
            )}
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111827',
   },
   headerSpacer: {
      width: 22,
   },
   scrollContent: {
      padding: 16,
   },
   menuContainer: {
      gap: 10,
   },
   menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      padding: 14,
   },
   menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   avatarImage: {
      width: 36,
      height: 36,
      borderRadius: 18,
   },
   menuItemText: {
      color: '#111827',
      fontWeight: '600',
   },
   avatarContainer: {
      alignItems: 'center',
      marginBottom: 12,
   },
   avatarLarge: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 2,
      borderColor: '#F3F4F6',
   },
   avatarButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      backgroundColor: '#F97316',
   },
   avatarButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
   },
   formLabel: {
      fontSize: 12,
      color: '#6B7280',
   },
   textInput: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 10,
      padding: 12,
      marginTop: 6,
      marginBottom: 12,
      color: '#111827',
   },
   multilineInput: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 10,
      padding: 12,
      marginTop: 6,
      marginBottom: 16,
      textAlignVertical: 'top',
      color: '#111827',
   },
   genderContainer: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 12,
   },
   genderButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
   },
   genderButtonActive: {
      borderColor: '#F97316',
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
   },
   genderButtonInactive: {
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
   },
   genderButtonText: {
      fontWeight: '600',
   },
   genderButtonTextActive: {
      color: '#F97316',
   },
   genderButtonTextInactive: {
      color: '#111827',
   },
   buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 8,
   },
   cancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: '#F1F5F9',
      alignItems: 'center',
   },
   cancelButtonText: {
      fontWeight: '600',
      color: '#111827',
   },
   saveButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: '#F97316',
      alignItems: 'center',
   },
   saveButtonText: {
      fontWeight: '600',
      color: '#FFFFFF',
   },
   passwordForm: {
      gap: 10,
   },
   passwordInputWrapper: {
      position: 'relative',
   },
   passwordInput: {
      paddingRight: 42,
   },
   eyeIconBtn: {
      position: 'absolute',
      right: 12,
      top: 18,
   },
   passwordButton: {
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
   },
   passwordButtonActive: {
      backgroundColor: '#F97316',
   },
   passwordButtonInactive: {
      backgroundColor: '#9CA3AF',
   },
   passwordButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
   },
})