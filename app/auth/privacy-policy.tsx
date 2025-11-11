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

export default function PrivacyPolicyScreen() {
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
            <Text style={styles.headerTitle}>Chính sách quyền riêng tư</Text>
            <View style={{ width: 40 }} />
         </View>

         {/* Content */}
         <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
               <Text style={styles.lastUpdate}>Cập nhật lần cuối: Tháng 10, 2025</Text>

               <Text style={styles.intro}>
                  Tại MUMII, chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
               </Text>

               <Text style={styles.sectionTitle}>1. Thông tin chúng tôi thu thập</Text>
               
               <Text style={styles.subTitle}>1.1. Thông tin bạn cung cấp</Text>
               <Text style={styles.bullet}>• Thông tin tài khoản: Tên, email, số điện thoại, mật khẩu</Text>
               <Text style={styles.bullet}>• Thông tin hồ sơ: Ảnh đại diện, bio, sở thích ẩm thực</Text>
               <Text style={styles.bullet}>• Nội dung: Bài đăng, hình ảnh, bình luận, đánh giá</Text>
               <Text style={styles.bullet}>• Thông tin liên hệ: Khi bạn liên hệ hỗ trợ</Text>

               <Text style={styles.subTitle}>1.2. Thông tin tự động thu thập</Text>
               <Text style={styles.bullet}>• Thông tin thiết bị: Loại thiết bị, hệ điều hành, ID thiết bị</Text>
               <Text style={styles.bullet}>• Dữ liệu sử dụng: Cách bạn tương tác với ứng dụng</Text>
               <Text style={styles.bullet}>• Vị trí: Dữ liệu vị trí (nếu bạn cho phép)</Text>
               <Text style={styles.bullet}>• Cookies và công nghệ tương tự</Text>

               <Text style={styles.sectionTitle}>2. Cách chúng tôi sử dụng thông tin</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi sử dụng thông tin của bạn để:
               </Text>
               <Text style={styles.bullet}>• Cung cấp và duy trì dịch vụ MUMII</Text>
               <Text style={styles.bullet}>• Cá nhân hóa trải nghiệm của bạn</Text>
               <Text style={styles.bullet}>• Gợi ý nhà hàng và người dùng phù hợp</Text>
               <Text style={styles.bullet}>• Gửi thông báo và cập nhật quan trọng</Text>
               <Text style={styles.bullet}>• Phân tích và cải thiện dịch vụ</Text>
               <Text style={styles.bullet}>• Phát hiện và ngăn chặn gian lận</Text>
               <Text style={styles.bullet}>• Tuân thủ nghĩa vụ pháp lý</Text>

               <Text style={styles.sectionTitle}>3. Chia sẻ thông tin</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
               </Text>
               
               <Text style={styles.subTitle}>3.1. Với người dùng khác</Text>
               <Text style={styles.bullet}>• Thông tin hồ sơ công khai của bạn</Text>
               <Text style={styles.bullet}>• Bài đăng và hoạt động công khai</Text>
               
               <Text style={styles.subTitle}>3.2. Với đối tác dịch vụ</Text>
               <Text style={styles.bullet}>• Nhà cung cấp lưu trữ và phân tích</Text>
               <Text style={styles.bullet}>• Dịch vụ thanh toán (nếu có)</Text>
               <Text style={styles.bullet}>• Dịch vụ gửi email và thông báo</Text>
               
               <Text style={styles.subTitle}>3.3. Với cơ quan pháp luật</Text>
               <Text style={styles.bullet}>• Khi được yêu cầu bởi pháp luật</Text>
               <Text style={styles.bullet}>• Để bảo vệ quyền lợi của MUMII và người dùng</Text>

               <Text style={styles.sectionTitle}>4. Bảo mật thông tin</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin của bạn:
               </Text>
               <Text style={styles.bullet}>• Mã hóa dữ liệu truyền tải (HTTPS/SSL)</Text>
               <Text style={styles.bullet}>• Mã hóa dữ liệu nhạy cảm trong cơ sở dữ liệu</Text>
               <Text style={styles.bullet}>• Kiểm soát truy cập chặt chẽ</Text>
               <Text style={styles.bullet}>• Giám sát và phát hiện xâm nhập</Text>
               <Text style={styles.bullet}>• Đào tạo nhân viên về bảo mật</Text>

               <Text style={styles.sectionTitle}>5. Quyền của bạn</Text>
               <Text style={styles.paragraph}>
                  Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
               </Text>
               <Text style={styles.bullet}>• Quyền truy cập: Xem thông tin chúng tôi có về bạn</Text>
               <Text style={styles.bullet}>• Quyền sửa đổi: Cập nhật thông tin không chính xác</Text>
               <Text style={styles.bullet}>• Quyền xóa: Yêu cầu xóa tài khoản và dữ liệu</Text>
               <Text style={styles.bullet}>• Quyền hạn chế: Giới hạn cách chúng tôi xử lý dữ liệu</Text>
               <Text style={styles.bullet}>• Quyền xuất dữ liệu: Nhận bản sao dữ liệu của bạn</Text>
               <Text style={styles.bullet}>• Quyền phản đối: Từ chối một số cách xử lý dữ liệu</Text>

               <Text style={styles.sectionTitle}>6. Lưu trữ dữ liệu</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi lưu trữ thông tin của bạn:
               </Text>
               <Text style={styles.bullet}>• Trong thời gian tài khoản của bạn còn hoạt động</Text>
               <Text style={styles.bullet}>• Thời gian cần thiết để cung cấp dịch vụ</Text>
               <Text style={styles.bullet}>• Để tuân thủ nghĩa vụ pháp lý</Text>
               <Text style={styles.bullet}>• Để giải quyết tranh chấp và thực thi thỏa thuận</Text>

               <Text style={styles.sectionTitle}>7. Dữ liệu trẻ em</Text>
               <Text style={styles.paragraph}>
                  MUMII không nhắm đến người dùng dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em. Nếu bạn là cha mẹ và phát hiện con bạn đã cung cấp thông tin cho chúng tôi, vui lòng liên hệ để chúng tôi xóa thông tin đó.
               </Text>

               <Text style={styles.sectionTitle}>8. Cookies và công nghệ theo dõi</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi sử dụng cookies và công nghệ tương tự để:
               </Text>
               <Text style={styles.bullet}>• Ghi nhớ tùy chọn của bạn</Text>
               <Text style={styles.bullet}>• Hiểu cách bạn sử dụng ứng dụng</Text>
               <Text style={styles.bullet}>• Cải thiện hiệu suất và trải nghiệm</Text>
               <Text style={styles.paragraph}>
                  Bạn có thể quản lý cookies qua cài đặt trình duyệt của mình.
               </Text>

               <Text style={styles.sectionTitle}>9. Liên kết bên thứ ba</Text>
               <Text style={styles.paragraph}>
                  Ứng dụng có thể chứa liên kết đến các trang web bên thứ ba. Chúng tôi không chịu trách nhiệm về chính sách quyền riêng tư của các trang web đó. Chúng tôi khuyến khích bạn đọc chính sách quyền riêng tư của họ.
               </Text>

               <Text style={styles.sectionTitle}>10. Thay đổi chính sách</Text>
               <Text style={styles.paragraph}>
                  Chúng tôi có thể cập nhật Chính sách quyền riêng tư này theo thời gian. Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng qua email hoặc thông báo trong ứng dụng. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận chính sách mới.
               </Text>

               <Text style={styles.sectionTitle}>11. Liên hệ với chúng tôi</Text>
               <Text style={styles.paragraph}>
                  Nếu bạn có bất kỳ câu hỏi nào về Chính sách quyền riêng tư hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:
               </Text>
               <Text style={styles.bullet}>• Email: privacy@mumii.com</Text>
               <Text style={styles.bullet}>• Hotline: 1900 xxxx</Text>
               <Text style={styles.bullet}>• Địa chỉ: TP. Hồ Chí Minh, Việt Nam</Text>
               <Text style={styles.bullet}>• Giờ làm việc: 9:00 - 18:00 (Thứ 2 - Thứ 6)</Text>

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
      marginBottom: 16,
      fontStyle: 'italic',
   },
   intro: {
      fontSize: 15,
      lineHeight: 24,
      color: '#333',
      marginBottom: 20,
      backgroundColor: '#F0F8FF',
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#4A90E2',
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1a1a1a',
      marginTop: 24,
      marginBottom: 12,
   },
   subTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginTop: 16,
      marginBottom: 8,
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
      marginTop: 12,
      textAlign: 'center',
   },
})

