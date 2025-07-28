import { StyleSheet, Text, View } from 'react-native'

export default function MarkerLegend() {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Chú thích</Text>

         <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Nhà hàng thông thường</Text>
         </View>

         <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Thực phẩm chay</Text>
         </View>

         <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.legendText}>Thuần chay (Vegan)</Text>
         </View>

         <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.legendText}>Đã chọn</Text>
         </View>

         <View style={styles.legendItem}>
            <View style={[styles.colorDot, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.legendText}>Trong lộ trình</Text>
         </View>

         <View style={styles.statusSection}>
            <Text style={styles.statusTitle}>Trạng thái:</Text>
            <View style={styles.statusRow}>
               <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
               <Text style={styles.statusText}>Giao hàng</Text>
               <View style={[styles.statusDot, { backgroundColor: '#8B5CF6' }]} />
               <Text style={styles.statusText}>Mang về</Text>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      top: 60,
      right: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      maxWidth: 200,
   },
   title: {
      fontSize: 14,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
   },
   legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
   },
   colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 8,
      borderWidth: 1,
      borderColor: '#FFFFFF',
   },
   legendText: {
      fontSize: 12,
      color: '#6B7280',
   },
   statusSection: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
   },
   statusTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 4,
   },
   statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 4,
   },
   statusText: {
      fontSize: 10,
      color: '#6B7280',
      marginRight: 12,
   },
})
