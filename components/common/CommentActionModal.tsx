import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'

interface CommentActionModalProps {
   visible: boolean
   onClose: () => void
   onDelete: () => void
   isOwner: boolean // Chỉ hiển thị nút xóa nếu là chủ sở hữu comment
}

export function CommentActionModal({ 
   visible, 
   onClose, 
   onDelete, 
   isOwner 
}: CommentActionModalProps) {
   return (
      <Modal
         visible={visible}
         transparent
         animationType="fade"
         onRequestClose={onClose}
      >
         <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
               <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                     <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                           <View style={styles.handle} />
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                           {isOwner && (
                              <TouchableOpacity 
                                 style={styles.actionButton}
                                 onPress={() => {
                                    onClose()
                                    onDelete()
                                 }}
                              >
                                 <Ionicons 
                                    name="trash-outline" 
                                    size={20} 
                                    color="#EF4444" 
                                 />
                                 <Text style={styles.deleteText}>Xóa</Text>
                              </TouchableOpacity>
                           )}
                           
                           {/* Báo cáo - placeholder cho tương lai */}
                           <TouchableOpacity 
                              style={styles.actionButton}
                              onPress={() => {
                                 onClose()
                                 // TODO: Implement report functionality
                              }}
                           >
                              <Ionicons 
                                 name="flag-outline" 
                                 size={20} 
                                 color="#6B7280" 
                              />
                              <Text style={styles.actionText}>Báo cáo</Text>
                           </TouchableOpacity>

                           {/* Hủy */}
                           <TouchableOpacity 
                              style={[styles.actionButton, styles.cancelButton]}
                              onPress={onClose}
                           >
                              <Ionicons 
                                 name="close-outline" 
                                 size={20} 
                                 color="#6B7280" 
                              />
                              <Text style={styles.actionText}>Hủy</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </View>
               </TouchableWithoutFeedback>
            </View>
         </TouchableWithoutFeedback>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
   },
   modalContainer: {
      justifyContent: 'flex-end',
   },
   modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34, // Safe area bottom
   },
   header: {
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 8,
   },
   handle: {
      width: 36,
      height: 4,
      backgroundColor: '#D1D5DB',
      borderRadius: 2,
   },
   actions: {
      paddingHorizontal: 16,
   },
   actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
   },
   cancelButton: {
      backgroundColor: '#F3F4F6',
      marginTop: 8,
   },
   actionText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#374151',
      marginLeft: 12,
   },
   deleteText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#EF4444',
      marginLeft: 12,
   },
})
