import { getDefaultAvatar } from '@/constants/defaultImages'
import { commentService } from '@/services/CommentService'
import type { CommentResponse, CreateCommentRequest } from '@/type'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import Toast from 'react-native-toast-message'

interface CommentModalProps {
   visible: boolean
   postId: string
   onClose: () => void
}

interface CommentItemProps {
   comment: CommentResponse
   onReply: (commentId: string, authorName: string) => void
}

function CommentItem({ comment, onReply }: CommentItemProps) {
   const formatTimeAgo = (dateString: string): string => {
      const now = new Date()
      const commentDate = new Date(dateString)
      
      if (isNaN(commentDate.getTime())) {
         return 'Không xác định'
      }
      
      const diffMs = now.getTime() - commentDate.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return 'Vừa xong'
      if (diffMins < 60) return `${diffMins} phút trước`
      if (diffHours < 24) return `${diffHours} giờ trước`
      if (diffDays < 7) return `${diffDays} ngày trước`
      
      return commentDate.toLocaleDateString('vi-VN')
   }

   return (
      <View style={[styles.commentItem, { marginLeft: comment.depth * 20 }]}>
         <Image
            source={{ uri: comment.authorAvatar || getDefaultAvatar(comment.authorName) }}
            style={styles.commentAvatar}
            contentFit="cover"
         />
         <View style={styles.commentContent}>
            <View style={styles.commentBubble}>
               <Text style={styles.commentAuthor}>{comment.authorName}</Text>
               <Text style={styles.commentText}>{comment.content}</Text>
            </View>
            <View style={styles.commentActions}>
               <Text style={styles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
               <TouchableOpacity 
                  onPress={() => onReply(comment.id, comment.authorName)}
                  style={styles.replyButton}
               >
                  <Text style={styles.replyText}>Trả lời</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   )
}

export function CommentModal({ visible, postId, onClose }: CommentModalProps) {
   const [comments, setComments] = useState<CommentResponse[]>([])
   const [isLoading, setIsLoading] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const [commentText, setCommentText] = useState('')
   const [replyingTo, setReplyingTo] = useState<{ id: string, name: string } | null>(null)

   // Load comments
   const loadComments = useCallback(async () => {
      if (!postId) return
      
      setIsLoading(true)
      try {
         const response = await commentService.getCommentsByPost(postId, 1, 50)
         setComments(response.content || [])
      } catch (error) {
         console.error('Error loading comments:', error)
         Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Không thể tải comments',
         })
      } finally {
         setIsLoading(false)
      }
   }, [postId])

   // Load comments when modal opens
   useEffect(() => {
      if (visible && postId) {
         loadComments()
      }
   }, [visible, postId, loadComments])

   // Submit comment
   const handleSubmitComment = async () => {
      if (!commentText.trim()) return

      setIsSubmitting(true)
      try {
         const commentData: CreateCommentRequest = {
            content: commentText.trim(),
            parentCommentId: replyingTo?.id || undefined
         }

         const newComment = await commentService.createComment(postId, commentData)
         
         // Add new comment to list
         setComments(prev => [...prev, newComment])
         setCommentText('')
         setReplyingTo(null)
         Keyboard.dismiss()

         Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: 'Comment đã được đăng',
         })
      } catch (error) {
         console.error('Error submitting comment:', error)
         Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Không thể đăng comment',
         })
      } finally {
         setIsSubmitting(false)
      }
   }

   const handleReply = (commentId: string, authorName: string) => {
      setReplyingTo({ id: commentId, name: authorName })
      setCommentText(`@${authorName} `)
   }

   const cancelReply = () => {
      setReplyingTo(null)
      setCommentText('')
   }

   return (
      <Modal
         visible={visible}
         animationType="slide"
         presentationStyle="pageSheet"
         onRequestClose={onClose}
      >
         <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
               <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
               </TouchableOpacity>
               <Text style={styles.headerTitle}>Bình luận</Text>
               <View style={styles.headerRight} />
            </View>

            {/* Comments List */}
            <FlatList
               data={comments}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <CommentItem comment={item} onReply={handleReply} />
               )}
               style={styles.commentsList}
               contentContainerStyle={styles.commentsContent}
               showsVerticalScrollIndicator={false}
               ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                     {isLoading ? (
                        <>
                           <ActivityIndicator size="large" color="#F97316" />
                           <Text style={styles.emptyText}>Đang tải comments...</Text>
                        </>
                     ) : (
                        <>
                           <Ionicons name="chatbubble-outline" size={48} color="#9CA3AF" />
                           <Text style={styles.emptyText}>Chưa có bình luận nào</Text>
                           <Text style={styles.emptySubtext}>Hãy là người đầu tiên bình luận!</Text>
                        </>
                     )}
                  </View>
               )}
            />

            {/* Reply indicator */}
            {replyingTo && (
               <View style={styles.replyIndicator}>
                  <Text style={styles.replyingText}>
                     Đang trả lời <Text style={styles.replyingName}>@{replyingTo.name}</Text>
                  </Text>
                  <TouchableOpacity onPress={cancelReply}>
                     <Ionicons name="close" size={16} color="#6B7280" />
                  </TouchableOpacity>
               </View>
            )}

            {/* Comment Input */}
            <KeyboardAvoidingView 
               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
               style={styles.inputContainer}
            >
               <View style={styles.inputWrapper}>
                  <TextInput
                     style={styles.textInput}
                     placeholder="Viết bình luận..."
                     placeholderTextColor="#9CA3AF"
                     value={commentText}
                     onChangeText={setCommentText}
                     multiline
                     maxLength={500}
                  />
                  <TouchableOpacity 
                     onPress={handleSubmitComment}
                     disabled={!commentText.trim() || isSubmitting}
                     style={[
                        styles.sendButton,
                        (!commentText.trim() || isSubmitting) && styles.sendButtonDisabled
                     ]}
                  >
                     {isSubmitting ? (
                        <ActivityIndicator size="small" color="white" />
                     ) : (
                        <Ionicons name="send" size={16} color="white" />
                     )}
                  </TouchableOpacity>
               </View>
            </KeyboardAvoidingView>
         </SafeAreaView>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
   },
   closeButton: {
      padding: 4,
   },
   headerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
   },
   headerRight: {
      width: 32,
   },
   commentsList: {
      flex: 1,
   },
   commentsContent: {
      paddingVertical: 16,
   },
   commentItem: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
   },
   commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
   },
   commentContent: {
      flex: 1,
   },
   commentBubble: {
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      alignSelf: 'flex-start',
   },
   commentAuthor: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
      marginBottom: 2,
   },
   commentText: {
      fontSize: 14,
      color: '#374151',
      lineHeight: 18,
   },
   commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      marginLeft: 12,
   },
   commentTime: {
      fontSize: 12,
      color: '#6B7280',
      marginRight: 12,
   },
   replyButton: {
      paddingVertical: 2,
   },
   replyText: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '600',
   },
   emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
   },
   emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginTop: 16,
      textAlign: 'center',
   },
   emptySubtext: {
      fontSize: 14,
      color: '#6B7280',
      marginTop: 4,
      textAlign: 'center',
   },
   replyIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#F3F4F6',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
   },
   replyingText: {
      fontSize: 14,
      color: '#6B7280',
   },
   replyingName: {
      fontWeight: '600',
      color: '#F97316',
   },
   inputContainer: {
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      backgroundColor: '#fff',
   },
   inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 12,
      maxHeight: 100,
      fontSize: 14,
      color: '#000',
   },
   sendButton: {
      backgroundColor: '#F97316',
      borderRadius: 20,
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
   },
   sendButtonDisabled: {
      backgroundColor: '#D1D5DB',
   },
})
