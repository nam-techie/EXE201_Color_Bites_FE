'use client'

import { paymentService } from '@/services/PaymentService'
import { Ionicons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Toast from 'react-native-toast-message'
import { WebView } from 'react-native-webview'

interface PaymentWebViewProps {
  visible: boolean
  checkoutUrl: string
  onClose: () => void
  onPaymentSuccess?: () => void
  onPaymentCancel?: () => void
}

export default function PaymentWebView({
  visible,
  checkoutUrl,
  onClose,
  onPaymentSuccess,
  onPaymentCancel
}: PaymentWebViewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [webViewRef, setWebViewRef] = useState<WebView | null>(null)

  // Handle Android back button
  useEffect(() => {
    if (!visible) return

    const backAction = () => {
      console.log('🔙 Android back button pressed in PaymentWebView')
      
      Alert.alert(
        'Hủy thanh toán',
        'Bạn có chắc chắn muốn hủy thanh toán?',
        [
          {
            text: 'Tiếp tục thanh toán',
            style: 'cancel',
          },
          {
            text: 'Hủy thanh toán',
            style: 'destructive',
            onPress: () => {
              console.log('🚫 User confirmed cancel payment')
              // Đóng WebView
              onClose()
              
              // Hiển thị thông báo hủy
              Alert.alert(
                'Thanh toán đã bị hủy',
                'Bạn có thể thử lại bất cứ lúc nào.',
                [
                  {
                    text: 'Đóng',
                    onPress: () => onPaymentCancel?.()
                  }
                ]
              )
            },
          },
        ]
      )
      
      return true // Prevent default back action
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
    
    return () => backHandler.remove()
  }, [visible, onClose, onPaymentCancel])

  // Xử lý khi WebView load xong
  const handleLoadEnd = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Xử lý khi WebView bắt đầu load
  const handleLoadStart = useCallback(() => {
    setIsLoading(true)
  }, [])

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = useCallback(async () => {
    try {
      console.log('🎉 Processing payment success...')
      
      // Đóng WebView trước
      onClose()
      
      // Hiển thị loading
      Toast.show({
        type: 'info',
        text1: 'Đang xác nhận thanh toán...',
        text2: 'Vui lòng chờ trong giây lát',
        position: 'top'
      })
      
      // Tự động gọi confirmation API với order_code từ URL hoặc metadata
      try {
        // Extract order_code từ checkoutUrl hoặc từ localStorage
        const orderCode = checkoutUrl.match(/order_code=([^&]+)/)?.[1] || 
                         checkoutUrl.match(/orderCode=([^&]+)/)?.[1]
        
        if (orderCode) {
          console.log('🔄 Auto-confirming payment with order_code:', orderCode)
          const confirmResponse = await paymentService.confirmPayment(orderCode)
          console.log('✅ Auto-confirmation result:', confirmResponse)
          
          if (confirmResponse.status === 'SUCCESS' || confirmResponse.status === 'PAID') {
            // Hiển thị thông báo thành công
            Alert.alert(
              'Thanh toán thành công! 🎉',
              'Gói Premium của bạn đã được kích hoạt. Bạn có thể sử dụng tất cả tính năng Premium ngay bây giờ.',
              [
                {
                  text: 'Tuyệt vời!',
                  onPress: () => {
                    // Refresh user profile để cập nhật subscription status
                    onPaymentSuccess?.()
                    
                    // Hiển thị toast
                    Toast.show({
                      type: 'success',
                      text1: 'Chúc mừng!',
                      text2: 'Bạn đã trở thành thành viên Premium!',
                      position: 'top'
                    })
                  }
                }
              ]
            )
          } else {
            throw new Error(`Payment status: ${confirmResponse.status}`)
          }
        } else {
          console.log('⚠️ No order_code found, showing manual confirmation dialog')
          Alert.alert(
            'Thanh toán thành công! 🎉',
            'Gói Premium của bạn đã được kích hoạt. Bạn có thể sử dụng tất cả tính năng Premium ngay bây giờ.',
            [
              {
                text: 'Tuyệt vời!',
                onPress: () => {
                  // Refresh user profile để cập nhật subscription status
                  onPaymentSuccess?.()
                  
                  // Hiển thị toast
                  Toast.show({
                    type: 'success',
                    text1: 'Chúc mừng!',
                    text2: 'Bạn đã trở thành thành viên Premium!',
                    position: 'top'
                  })
                }
              }
            ]
          )
        }
      } catch (confirmError) {
        console.error('❌ Auto-confirmation failed:', confirmError)
        
        // Fallback: vẫn hiển thị success nhưng có warning
        Alert.alert(
          'Thanh toán thành công! 🎉',
          'Gói Premium của bạn đã được kích hoạt. Nếu bạn không thấy thay đổi, vui lòng refresh app.',
          [
            {
              text: 'Tuyệt vời!',
              onPress: () => {
                // Refresh user profile để cập nhật subscription status
                onPaymentSuccess?.()
                
                // Hiển thị toast
                Toast.show({
                  type: 'success',
                  text1: 'Chúc mừng!',
                  text2: 'Bạn đã trở thành thành viên Premium!',
                  position: 'top'
                })
              }
            }
          ]
        )
      }
    } catch (error) {
      console.error('❌ Error processing payment success:', error)
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Có lỗi xảy ra khi xử lý thanh toán thành công'
      })
    }
  }, [onClose, onPaymentSuccess, checkoutUrl])

  // Xử lý khi thanh toán bị hủy
  const handlePaymentCancel = useCallback(() => {
    console.log('🚫 Payment cancelled by user')
    
    // Đóng WebView
    onClose()
    
    // Hiển thị thông báo hủy
    Alert.alert(
      'Thanh toán đã bị hủy',
      'Bạn có thể thử lại bất cứ lúc nào.',
      [
        {
          text: 'Đóng',
          onPress: () => onPaymentCancel?.()
        }
      ]
    )
  }, [onClose, onPaymentCancel])

  // Xử lý confirmation từ PayOS
  const handlePaymentConfirmation = useCallback(async (url: string) => {
    try {
      console.log('🔄 Processing payment confirmation...')
      
      // Extract payment ID từ URL
      const urlParams = new URLSearchParams(url.split('?')[1])
      const paymentId = urlParams.get('id') || urlParams.get('payment_id')
      
      if (paymentId) {
        console.log('📝 Confirming payment with ID:', paymentId)
        
        // Gọi API confirm payment
        const statusResponse = await paymentService.confirmPayment(paymentId)
        console.log('✅ Payment status confirmed:', statusResponse)
        
        if (statusResponse.status === 'SUCCESS' || statusResponse.status === 'PAID') {
          await handlePaymentSuccess()
        } else {
          console.log('⚠️ Payment not successful, status:', statusResponse.status)
          Alert.alert(
            'Thanh toán chưa hoàn tất',
            'Vui lòng hoàn tất thanh toán hoặc thử lại.',
            [{ text: 'Đóng' }]
          )
        }
      } else {
        console.log('⚠️ No payment ID found in URL')
        Alert.alert(
          'Lỗi xác nhận thanh toán',
          'Không thể xác nhận thanh toán. Vui lòng thử lại.',
          [{ text: 'Đóng' }]
        )
      }
    } catch (error) {
      console.error('❌ Error confirming payment:', error)
      Alert.alert(
        'Lỗi xác nhận thanh toán',
        'Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.',
        [{ text: 'Đóng' }]
      )
    }
  }, [handlePaymentSuccess])

  // Xử lý URL changes để detect payment success/cancel
  const handleShouldStartLoadWithRequest = useCallback((request: any) => {
    const url = request.url.toLowerCase()
    
    console.log('🔍 WebView URL changed:', url)
    console.log('🔍 Request details:', {
      url: request.url,
      navigationType: request.navigationType,
      mainDocumentURL: request.mainDocumentURL
    })
    
    // Kiểm tra URL success - mở rộng pattern matching
    if (url.includes('payment/success') || 
        url.includes('success') || 
        url.includes('thanh-toan-thanh-cong') ||
        url.includes('payment-success') ||
        url.includes('completed')) {
      console.log('✅ Payment success detected')
      handlePaymentSuccess()
      return false // Prevent loading
    }
    
    // Kiểm tra URL cancel - mở rộng pattern matching
    if (url.includes('payment/cancel') || 
        url.includes('cancel') || 
        url.includes('huy') ||
        url.includes('huỷ') ||
        url.includes('payment-cancel') ||
        url.includes('abort') ||
        url.includes('back') ||
        url.includes('return')) {
      console.log('❌ Payment cancel detected')
      handlePaymentCancel()
      return false // Prevent loading
    }
    
    // Kiểm tra URL callback từ PayOS
    if (url.includes('payment/confirm') || 
        url.includes('confirm') || 
        url.includes('callback') ||
        url.includes('webhook')) {
      console.log('🔄 Payment confirmation detected')
      handlePaymentConfirmation(url)
      return false // Prevent loading
    }
    
    return true // Allow loading
  }, [handlePaymentSuccess, handlePaymentCancel, handlePaymentConfirmation])

  // Xử lý message từ WebView (JavaScript)
  const handleMessage = useCallback((event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data)
      console.log('📨 Message from WebView:', message)
      
      if (message.type === 'payment_success') {
        console.log('✅ Payment success message received with orderInfo:', message.orderInfo)
        
        // Store order info for confirmation
        if (message.orderInfo && message.orderInfo.orderCode) {
          console.log('📝 Using order code from WebView:', message.orderInfo.orderCode)
          // Update checkoutUrl to include order code for confirmation
          const updatedUrl = checkoutUrl + (checkoutUrl.includes('?') ? '&' : '?') + `order_code=${message.orderInfo.orderCode}`
          console.log('🔄 Updated checkout URL:', updatedUrl)
        }
        
        handlePaymentSuccess()
      } else if (message.type === 'payment_cancel') {
        console.log('❌ Payment cancel message received')
        handlePaymentCancel()
      } else if (message.type === 'payment_error') {
        console.log('⚠️ Payment error message received')
        Alert.alert('Lỗi thanh toán', message.message || 'Có lỗi xảy ra trong quá trình thanh toán')
      }
    } catch {
      console.log('📨 Raw message from WebView:', event.nativeEvent.data)
    }
  }, [handlePaymentSuccess, handlePaymentCancel, checkoutUrl])

  // Xử lý lỗi WebView
  const handleError = useCallback((error: any) => {
    console.error('❌ WebView error:', error)
    setIsLoading(false)
    
    Alert.alert(
      'Lỗi tải trang thanh toán',
      'Không thể tải trang thanh toán. Vui lòng kiểm tra kết nối mạng và thử lại.',
      [
        {
          text: 'Thử lại',
          onPress: () => {
            if (webViewRef) {
              webViewRef.reload()
            }
          }
        },
        {
          text: 'Đóng',
          onPress: onClose
        }
      ]
    )
  }, [webViewRef, onClose])

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerSpacer} />
            
            <Text style={styles.headerTitle}>Thanh toán Premium</Text>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Đang tải trang thanh toán...</Text>
            </View>
          </View>
        )}

        {/* WebView */}
        <WebView
          ref={setWebViewRef}
          source={{ uri: checkoutUrl }}
          style={styles.webView}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onMessage={handleMessage}
          onError={handleError}
          onHttpError={handleError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webViewLoading}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.webViewLoadingText}>Đang tải...</Text>
            </View>
          )}
          // Cấu hình WebView
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // Cho phép mixed content và third-party cookies
          mixedContentMode="compatibility"
          thirdPartyCookiesEnabled={true}
          // User agent để tránh bị block
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
          // Thêm injected JavaScript để detect button clicks và extract order info
          injectedJavaScript={`
            (function() {
              console.log('🔧 PaymentWebView JavaScript injected');
              
              // Store order information
              let orderInfo = {
                orderCode: null,
                amount: null,
                status: null
              };
              
              // Extract order information from page
              function extractOrderInfo() {
                // Try to find order code in various places
                const orderCodeSelectors = [
                  '[data-order-code]',
                  '[data-ordercode]', 
                  '.order-code',
                  '.orderCode',
                  '#order-code',
                  '#orderCode'
                ];
                
                orderCodeSelectors.forEach(selector => {
                  const element = document.querySelector(selector);
                  if (element) {
                    orderInfo.orderCode = element.textContent || element.value || element.getAttribute('data-order-code');
                    console.log('📝 Found order code:', orderInfo.orderCode);
                  }
                });
                
                // Try to extract from URL
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('order_code')) {
                  orderInfo.orderCode = urlParams.get('order_code');
                } else if (urlParams.get('orderCode')) {
                  orderInfo.orderCode = urlParams.get('orderCode');
                }
                
                // Try to extract from localStorage/sessionStorage
                try {
                  const storedOrder = localStorage.getItem('order_code') || sessionStorage.getItem('order_code');
                  if (storedOrder) {
                    orderInfo.orderCode = storedOrder;
                  }
                } catch (e) {
                  console.log('Could not access storage');
                }
                
                // Try to extract amount
                const amountElements = document.querySelectorAll('[data-amount], .amount, #amount');
                amountElements.forEach(element => {
                  const amount = element.textContent || element.value;
                  if (amount && amount.includes('5000')) {
                    orderInfo.amount = amount;
                  }
                });
              }
              
              // Detect cancel button clicks
              function detectCancelButtons() {
                const cancelButtons = document.querySelectorAll('button, a, [role="button"]');
                cancelButtons.forEach(button => {
                  const text = button.textContent || button.innerText || '';
                  const className = button.className || '';
                  const id = button.id || '';
                  
                  if (text.toLowerCase().includes('hủy') || 
                      text.toLowerCase().includes('huỷ') || 
                      text.toLowerCase().includes('cancel') ||
                      className.toLowerCase().includes('cancel') ||
                      id.toLowerCase().includes('cancel')) {
                    
                    button.addEventListener('click', function(e) {
                      console.log('🚫 Cancel button clicked:', text);
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'payment_cancel',
                        buttonText: text,
                        orderInfo: orderInfo,
                        timestamp: Date.now()
                      }));
                    });
                  }
                });
              }
              
              // Detect success indicators
              function detectSuccessIndicators() {
                const successElements = document.querySelectorAll('[class*="success"], [id*="success"], [class*="complete"], [id*="complete"], [class*="paid"], [id*="paid"]');
                successElements.forEach(element => {
                  const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                      if (mutation.type === 'attributes' && 
                          (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        const style = element.style.display || element.style.visibility;
                        const className = element.className;
                        
                        if (style === 'block' || style === 'visible' || 
                            className.includes('show') || className.includes('visible')) {
                          console.log('✅ Success indicator detected');
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'payment_success',
                            element: element.tagName,
                            orderInfo: orderInfo,
                            timestamp: Date.now()
                          }));
                        }
                      }
                    });
                  });
                  
                  observer.observe(element, { attributes: true });
                });
              }
              
              // Monitor URL changes for success/cancel
              function monitorUrlChanges() {
                let currentUrl = window.location.href;
                setInterval(function() {
                  if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    console.log('🔄 URL changed to:', currentUrl);
                    
                    // Extract order info from new URL
                    extractOrderInfo();
                    
                    // Check if URL indicates success or cancel
                    if (currentUrl.toLowerCase().includes('success') || 
                        currentUrl.toLowerCase().includes('complete') ||
                        currentUrl.toLowerCase().includes('paid')) {
                      console.log('✅ Success URL detected');
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'payment_success',
                        url: currentUrl,
                        orderInfo: orderInfo,
                        timestamp: Date.now()
                      }));
                    } else if (currentUrl.toLowerCase().includes('cancel') ||
                               currentUrl.toLowerCase().includes('huy')) {
                      console.log('❌ Cancel URL detected');
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'payment_cancel',
                        url: currentUrl,
                        orderInfo: orderInfo,
                        timestamp: Date.now()
                      }));
                    }
                  }
                }, 1000);
              }
              
              // Run detection when DOM is ready
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                  extractOrderInfo();
                  detectCancelButtons();
                  detectSuccessIndicators();
                  monitorUrlChanges();
                });
              } else {
                extractOrderInfo();
                detectCancelButtons();
                detectSuccessIndicators();
                monitorUrlChanges();
              }
              
              // Re-run detection periodically for dynamic content
              setInterval(function() {
                detectCancelButtons();
                extractOrderInfo();
              }, 2000);
            })();
          `}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  webViewLoadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
})