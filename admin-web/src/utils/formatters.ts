import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'

// Set Vietnamese locale
dayjs.locale('vi')
dayjs.extend(relativeTime)

/**
 * Format date to Vietnamese locale
 * @param dateString - ISO date string or Date object
 * @param format - Custom format (default: 'DD/MM/YYYY HH:mm')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date, 
  format: string = 'DD/MM/YYYY HH:mm'
): string => {
  if (!dateString) return '-'
  
  try {
    return dayjs(dateString).format(format)
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

/**
 * Format date to relative time (e.g., "2 giờ trước")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  if (!dateString) return '-'
  
  try {
    return dayjs(dateString).fromNow()
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return '-'
  }
}

/**
 * Format currency to Vietnamese format
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'VND')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '-'
  
  try {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount)
    }
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return `${amount} ${currency}`
  }
}

/**
 * Format number with thousand separators
 * @param number - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 */
export const formatNumber = (number: number, decimals: number = 0): string => {
  if (typeof number !== 'number' || isNaN(number)) return '-'
  
  try {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number)
  } catch (error) {
    console.error('Error formatting number:', error)
    return number.toString()
  }
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export const truncateText = (
  text: string, 
  maxLength: number = 50, 
  suffix: string = '...'
): string => {
  if (!text || typeof text !== 'string') return '-'
  
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + suffix
}

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) return '-'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Format percentage
 * @param value - Value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (typeof value !== 'number' || isNaN(value)) return '-'
  
  return `${value.toFixed(decimals)}%`
}

/**
 * Format phone number to Vietnamese format
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '-'
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format Vietnamese phone number
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  } else if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{3})(\d{3})/, '+$1 $2 $3 $4')
  }
  
  return phone
}

/**
 * Format status badge text
 * @param status - Status string
 * @returns Formatted status text
 */
export const formatStatus = (status: string): string => {
  if (!status || typeof status !== 'string') return '-'
  
  const statusMap: Record<string, string> = {
    'ACTIVE': 'Hoạt động',
    'INACTIVE': 'Không hoạt động',
    'PENDING': 'Chờ xử lý',
    'SUCCESS': 'Thành công',
    'FAILED': 'Thất bại',
    'CANCELED': 'Đã hủy',
    'DELETED': 'Đã xóa',
    'BLOCKED': 'Bị chặn',
    'APPROVED': 'Đã duyệt',
    'REJECTED': 'Từ chối'
  }
  
  return statusMap[status.toUpperCase()] || status
}
