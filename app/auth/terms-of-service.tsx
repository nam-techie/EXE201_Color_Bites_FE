'use client'

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TouchableOpacity,
   View
} from 'react-native'

export default function TermsOfServiceScreen() {
   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
         
         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity 
               style={styles.backButton}
               onPress={() => router.back()}
            >
               <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Điều khoản dịch vụ</Text>
            <View style={{ width: 40 }} />
         </View>

         {/* Content */}
         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
               <Text style={styles.lastUpdate}>Cập nhật lần cuối: Tháng 10, 2025</Text>

               <Text style={styles.sectionTitle}>1. Chấp nhận điều khoản</Text>
               <Text style={styles.paragraph}>
                  Bằng việc truy cập và sử dụng ứng dụng MUMII, bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản và điều kiện sau đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
               </Text>

               <Text style={styles.sectionTitle}>2. Mô tả dịch vụ</Text>
               <Text style={styles.paragraph}>
                  MUMII là một nền tảng mạng xã hội dành cho người yêu thích ẩm thực, cho phép người dùng:
               </Text>
               <Text style={styles.bullet}>• Chia sẻ trải nghiệm ẩm thực và hình ảnh món ăn</Text>
               <Text style={styles.bullet}>• Khám phá nhà hàng và quán ăn mới</Text>
               <Text style={styles.bullet}>• Kết nối với cộng đồng foodie</Text>
               <Text style={styles.bullet}>• Lưu trữ và đánh giá địa điểm ẩm thực</Text>

               <Text style={styles.sectionTitle}>3. Tài khoản người dùng</Text>
               <Text style={styles.paragraph}>
                  Khi tạo tài khoản, bạn cam kết:
               </Text>
               <Text style={styles.bullet}>• Cung cấp thông tin chính xác và đầy đủ</Text>
               <Text style={styles.bullet}>• Bảo mật thông tin đăng nhập của bạn</Text>
               <Text style={styles.bullet}>• Chịu trách nhiệm cho mọi hoạt động dưới tài khoản của bạn</Text>
               <Text style={styles.bullet}>• Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép</Text>

               <Text style={styles.sectionTitle}>4. Nội dung người dùng</Text>
               <Text style={styles.paragraph}>
                  Bạn giữ quyền sở hữu đối với nội dung bạn đăng tải. Tuy nhiên, bằng việc đăng tải nội dung lên MUMII, bạn cấp cho chúng tôi quyền sử dụng, hiển thị và phân phối nội dung đó trong phạm vi dịch vụ.
               </Text>
               <Text style={styles.paragraph}>
                  Bạn cam kết không đăng tải nội dung:
               </Text>
               <Text style={styles.bullet}>• Vi phạm pháp luật hoặc quyền của người khác</Text>
               <Text style={styles.bullet}>• Chứa nội dung khiêu dâm, bạo lực hoặc phân biệt đối xử</Text>
               <Text style={styles.bullet}>• Spam, lừa đảo hoặc gây hiểu lầm</Text>
               <Text style={styles.bullet}>• Vi phạm quyền sở hữu trí tuệ</Text>

               <Text style={styles.sectionTitle}>5. Quyền và nghĩa vụ của MUMII</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi có quyền:
               </Text>
               <Text style={styles.bullet}>• Xóa hoặc chỉnh sửa nội dung vi phạm điều khoản</Text>
               <Text style={styles.bullet}>• Tạm ngưng hoặc chấm dứt tài khoản vi phạm</Text>
               <Text style={styles.bullet}>• Thay đổi hoặc ngừng cung cấp dịch vụ bất kỳ lúc nào</Text>
               <Text style={styles.bullet}>• Thu thập dữ liệu để cải thiện dịch vụ</Text>

               <Text style={styles.sectionTitle}>6. Sở hữu trí tuệ</Text>
               <Text style={styles.paragraph}>
                  Tất cả nội dung, tính năng và chức năng của MUMII (bao gồm nhưng không giới hạn ở thiết kế, logo, văn bản) là tài sản của MUMII và được bảo vệ bởi luật bản quyền quốc tế.
               </Text>

               <Text style={styles.sectionTitle}>7. Giới hạn trách nhiệm</Text>
               <Text style={styles.paragraph}>
                  MUMII cung cấp dịch vụ "như hiện có". Chúng tôi không chịu trách nhiệm cho:
               </Text>
               <Text style={styles.bullet}>• Thiệt hại trực tiếp hoặc gián tiếp từ việc sử dụng dịch vụ</Text>
               <Text style={styles.bullet}>• Mất mát dữ liệu hoặc gián đoạn dịch vụ</Text>
               <Text style={styles.bullet}>• Nội dung của người dùng khác</Text>
               <Text style={styles.bullet}>• Bảo mật thông tin cá nhân nếu do lỗi của người dùng</Text>

               <Text style={styles.sectionTitle}>8. Thay đổi điều khoản</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải. Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
               </Text>

               <Text style={styles.sectionTitle}>9. Luật áp dụng</Text>
               <Text style={styles.paragraph}>
                  Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
               </Text>

               <Text style={styles.sectionTitle}>10. Liên hệ</Text>
               <Text style={styles.paragraph}>
                  Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ, vui lòng liên hệ với chúng tôi qua:
               </Text>
               <Text style={styles.bullet}>• Email: support@mumii.com</Text>
               <Text style={styles.bullet}>• Hotline: 1900 xxxx</Text>
               <Text style={styles.bullet}>• Địa chỉ: TP. Hồ Chí Minh, Việt Nam</Text>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F5F5F5',
      justifyContent: 'center',
      alignItems: 'center',
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a1a1a',
   },
   scrollView: {
      flex: 1,
   },
   content: {
      padding: 20,
   },
   lastUpdate: {
      fontSize: 13,
      color: '#888',
      marginBottom: 24,
      fontStyle: 'italic',
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1a1a1a',
      marginTop: 24,
      marginBottom: 12,
   },
   paragraph: {
      fontSize: 15,
      lineHeight: 24,
      color: '#333',
      marginBottom: 12,
   },
   bullet: {
      fontSize: 15,
      lineHeight: 24,
      color: '#333',
      marginBottom: 8,
      paddingLeft: 12,
   },
   footer: {
      marginTop: 32,
      marginBottom: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
      alignItems: 'center',
   },
   footerText: {
      fontSize: 14,
      color: '#4A90E2',
      fontWeight: '500',
   },
})

