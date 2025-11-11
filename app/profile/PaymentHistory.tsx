'use client'

import { paymentService, type PaymentHistoryItem } from '@/services/PaymentService'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

export default function PaymentHistory() {
   const router = useRouter()
   const [isLoading, setIsLoading] = useState(false)
   const [history, setHistory] = useState<PaymentHistoryItem[]>([])

   const load = useCallback(async () => {
      try {
         setIsLoading(true)
         const transactionHistory = await paymentService.getUserTransactionHistory()
         const converted: PaymentHistoryItem[] = transactionHistory.map((t, i) => ({
            id: t.transactionId || `txn_${i}`,
            orderCode: t.orderCode,
            amount: t.amount,
            description: t.description,
            status: t.status as any,
            gatewayName: t.gatewayName,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            subscriptionPlan: 'PREMIUM',
            subscriptionDuration: 30,
         }))
         setHistory(converted)
      } catch {
         setHistory([])
      } finally {
         setIsLoading(false)
      }
   }, [])

   useEffect(() => {
      load()
   }, [load])

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
               <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', flex: 1, textAlign: 'center' }}>Lịch sử thanh toán</Text>
            <View style={{ width: 40 }} />
         </View>

         <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {isLoading ? (
               <View style={{ flex: 1, alignItems: 'center', paddingVertical: 60 }}>
                  <ActivityIndicator size="large" color="#F97316" />
                  <Text style={{ marginTop: 16, fontSize: 16, color: '#6B7280', fontWeight: '500' }}>Đang tải lịch sử...</Text>
               </View>
            ) : history.length === 0 ? (
               <View style={{ flex: 1, alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 }}>
                  <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                     <Ionicons name="card-outline" size={64} color="#9CA3AF" />
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' }}>Chưa có lịch sử thanh toán</Text>
                  <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 }}>Các giao dịch của bạn sẽ hiển thị ở đây</Text>
               </View>
            ) : (
               <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                  {history.map((p, idx) => (
                     <View key={p.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, paddingBottom: 12 }}>
                           <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 12 }}>
                              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                 <Ionicons name="card" size={20} color={p.status === 'SUCCESS' ? '#10B981' : p.status === 'PENDING' ? '#F59E0B' : p.status === 'FAILED' ? '#EF4444' : '#6B7280'} />
                              </View>
                              <View style={{ flex: 1 }}>
                                 <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4, lineHeight: 22 }}>{p.description}</Text>
                                 <Text style={{ fontSize: 12, color: '#6B7280', lineHeight: 16 }}>Mã đơn: {p.orderCode}</Text>
                              </View>
                           </View>
                           <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 }}>{p.amount.toLocaleString('vi-VN')}đ</Text>
                              <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: p.status === 'SUCCESS' ? '#D1FAE5' : p.status === 'PENDING' ? '#FEF3C7' : p.status === 'FAILED' ? '#FEE2E2' : '#F3F4F6' }}>
                                 <Text style={{ fontSize: 12, fontWeight: '500', color: p.status === 'SUCCESS' ? '#065F46' : p.status === 'PENDING' ? '#92400E' : p.status === 'FAILED' ? '#DC2626' : '#6B7280' }}>
                                    {p.status === 'SUCCESS' ? 'Thành công' : p.status === 'PENDING' ? 'Đang xử lý' : p.status === 'FAILED' ? 'Thất bại' : p.status === 'CANCELLED' ? 'Đã hủy' : p.status}
                                 </Text>
                              </View>
                           </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 }}>
                           <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                              <Ionicons name="time-outline" size={14} color="#6B7280" />
                              <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
                                 {new Date(p.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </Text>
                           </View>
                           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="card-outline" size={14} color="#6B7280" />
                              <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500', marginLeft: 4 }}>{p.gatewayName}</Text>
                           </View>
                        </View>
                        {idx < history.length - 1 && <View style={{ height: 1, backgroundColor: '#E5E7EB', marginHorizontal: 16 }} />}
                     </View>
                  ))}
               </View>
            )}
         </ScrollView>
      </SafeAreaView>
   )
}


