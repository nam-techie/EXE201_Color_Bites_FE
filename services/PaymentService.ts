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
   * Tạo payment request cho Premium subscription
   */
  createPremiumPaymentRequest(): CreatePaymentRequest {
    return {
      amount: 36000, // 36,000 VND
      description: 'Premium Color Bites', // Giảm xuống dưới 25 ký tự
      currency: 'VND',
      returnUrl: 'https://color-bites.app/payment/success',
      cancelUrl: 'https://color-bites.app/payment/cancel',
      items: [
        {
          name: 'Gói Premium - Color Bites',
          quantity: 1,
          price: 36000
        }
      ]
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()
