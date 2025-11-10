import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Utility để clear hoàn toàn auth state
 * Dùng khi cần reset authentication hoàn toàn
 */
export async function clearAllAuthData() {
  try {
    console.log('🧹 Clearing ALL auth data...')
    
    // Clear từ AsyncStorage
    await AsyncStorage.removeItem('authToken')
    await AsyncStorage.removeItem('user')
    
    // Log để confirm
    const remainingToken = await AsyncStorage.getItem('authToken')
    const remainingUser = await AsyncStorage.getItem('user')
    
    console.log(' Auth data cleared successfully')
    console.log('Remaining token:', remainingToken ? 'ERROR - Still exists!' : 'None')
    console.log('Remaining user:', remainingUser ? 'ERROR - Still exists!' : 'None')
    
    return true
  } catch (error) {
    console.error(' Error clearing auth data:', error)
    return false
  }
}

/**
 * Check current auth state
 */
export async function checkAuthData() {
  try {
    const token = await AsyncStorage.getItem('authToken')
    const user = await AsyncStorage.getItem('user')
    
    console.log('🔍 Current Auth State:')
    console.log('Token:', token ? `${token.substring(0, 50)}...` : 'None')
    console.log('User:', user ? JSON.parse(user).name : 'None')
    
    return { token, user: user ? JSON.parse(user) : null }
  } catch (error) {
    console.error(' Error checking auth data:', error)
    return { token: null, user: null }
  }
}

/**
 * Validate if token is real (not fake/mock)
 */
export function isValidToken(token: string | null): boolean {
  if (!token) return false
  
  // Check for known fake tokens
  const fakeTokenPatterns = [
    'fake-signature-for-testing',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0MTIz',
    'mock-token'
  ]
  
  for (const pattern of fakeTokenPatterns) {
    if (token.includes(pattern)) {
      console.warn('⚠️ Detected fake/mock token pattern:', pattern)
      return false
    }
  }
  
  return true
}
