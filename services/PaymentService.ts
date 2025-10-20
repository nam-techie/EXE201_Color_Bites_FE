import { API_ENDPOINTS } from '@/constants'
import { apiService } from './ApiService'

// Payment Request Types
export interface CreatePaymentRequest {
  amount: number
  description: string
  currency: string
  returnUrl?: string
  cancelUrl?: string
  items: PaymentItem[]
}

export interface PaymentItem {
  name: string
  quantity: number
  price: number
}

// Payment Response Types
export interface PaymentResponse {
  checkoutUrl: string
  paymentLinkId: string
  orderCode: number
  qrCode?: string
  status: string
  createdAt: string
  message: string
}

export interface PaymentStatusResponse {
  transactionId: string
  orderCode: number
  status: string
  amount: number
  description: string
  gatewayName: string
  message: string
  createdAt: string
  updatedAt: string
}

// Payment History Types
export interface PaymentHistoryItem {
  id: string
  orderCode: number
  amount: number
  description: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  gatewayName: string
  createdAt: string
  updatedAt: string
  subscriptionPlan?: string
  subscriptionDuration?: number // days
}

export interface PaymentHistoryResponse {
  content: PaymentHistoryItem[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export class PaymentService {
  /**
   * Tạo thanh toán subscription
   */
  async createSubscriptionPayment(paymentData: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('=== CREATE PAYMENT DEBUG ===')
      console.log('API URL:', `${API_ENDPOINTS.PAYMENT.CREATE}`)
      console.log('Request payload:', JSON.stringify(paymentData, null, 2))
      
      const response = await apiService.post<PaymentResponse>(
        API_ENDPOINTS.PAYMENT.CREATE,
        paymentData
      )
      
      console.log('Raw API Response:', JSON.stringify(response, null, 2))
      console.log('Response Status Code:', response.status)
      console.log('Response Message:', response.message)
      console.log('Response Data:', response.data)
      
      if (response.status === 200 && response.data) {
        console.log('✅ Payment created successfully:', response.data)
        return response.data
      }
      
      // Log chi tiết lỗi
      console.error('❌ API Error Details:')
      console.error('- Status Code:', response.status)
      console.error('- Message:', response.message)
      console.error('- Data:', response.data)
      
      throw new Error(response.message || 'Không thể tạo thanh toán')
    } catch (error) {
      console.error('=== CREATE PAYMENT ERROR ===')
      console.error('Error details:', error)
      
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        throw error
      }
      
      throw new Error('Lỗi không mong muốn khi tạo thanh toán')
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    try {
      console.log('Checking payment status for transaction:', transactionId)
      
      const response = await apiService.get<PaymentStatusResponse>(
        `${API_ENDPOINTS.PAYMENT.STATUS}/${transactionId}`
      )
      
      if (response.status === 200 && response.data) {
        console.log('✅ Payment status retrieved successfully:', response.data)
        return response.data
      }
      
      throw new Error(response.message || 'Không thể kiểm tra trạng thái thanh toán')
    } catch (error) {
      console.error('Error checking payment status:', error)
      throw error
    }
  }

  /**
   * Confirm payment từ gateway (PayOS)
   */
  async confirmPayment(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      console.log('Confirming payment with ID:', paymentId)
      
      const response = await apiService.get<PaymentStatusResponse>(
        `${API_ENDPOINTS.PAYMENT.CONFIRM}?id=${paymentId}`
      )
      
      if (response.status === 200 && response.data) {
        console.log('✅ Payment confirmed successfully:', response.data)
        return response.data
      }
      
      throw new Error(response.message || 'Không thể xác nhận thanh toán')
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw error
    }
  }

  /**
   * Manually confirm payment với order code
   */
  async manualConfirmPayment(orderCode: string): Promise<PaymentStatusResponse> {
    try {
      console.log('🔄 Manual confirmation for order code:', orderCode)
      
      const response = await apiService.get<PaymentStatusResponse>(
        `${API_ENDPOINTS.PAYMENT.CONFIRM}?id=${orderCode}`
      )
      
      if (response.status === 200 && response.data) {
        console.log('✅ Manual confirmation successful:', response.data)
        return response.data
      }
      
      throw new Error(response.message || 'Không thể xác nhận thanh toán thủ công')
    } catch (error) {
      console.error('❌ Manual confirmation failed:', error)
      throw error
    }
  }

  /**
   * Lấy lịch sử giao dịch của user hiện tại
   * Endpoint: GET /api/payment/history
   */
  async getUserTransactionHistory(): Promise<PaymentStatusResponse[]> {
    try {
      console.log('🔗 Calling API:', API_ENDPOINTS.PAYMENT.HISTORY)
      
      const response = await apiService.get<any>(
        API_ENDPOINTS.PAYMENT.HISTORY
      )
      
      console.log('📋 Raw API Response:', JSON.stringify(response, null, 2))
      
      // Try different response formats
      if (response.status === 200) {
        let data: PaymentStatusResponse[] = []
        
        // Format 1: response.data is array directly
        if (Array.isArray(response.data)) {
          data = response.data
        }
        // Format 2: response.data.data is array
        else if (response.data && Array.isArray(response.data.data)) {
          data = response.data.data
        }
        // Format 3: response is array directly
        else if (Array.isArray(response)) {
          data = response
        }
        
        if (data.length > 0) {
          console.log('✅ Success - Data count:', data.length)
          return data
        }
      }
      
      console.error('❌ API Error - Status:', response.status, 'Message:', response.message)
      throw new Error(response.message || 'Không thể lấy lịch sử giao dịch')
    } catch (error) {
      console.error('❌ Error fetching user transaction history:', error)
      throw error
    }
  }

  /**
   * Tạo payment request cho Premium subscription
   */
  createPremiumPaymentRequest(): CreatePaymentRequest {
    return {
      amount: 5000, // 36,000 VND
      description: 'Premium Color Bites', // Giảm xuống dưới 25 ký tự
      currency: 'VND',
      returnUrl: 'https://color-bites.app/payment/success',
      cancelUrl: 'https://color-bites.app/payment/cancel',
      items: [
        {
          name: 'Gói Premium - Color Bites',
          quantity: 1,
          price: 5000
        }
      ]
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()
