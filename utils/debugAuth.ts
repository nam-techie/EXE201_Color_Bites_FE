import AsyncStorage from '@react-native-async-storage/async-storage'

export const setMockAuthToken = async () => {
  // Mock JWT token cho test
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  
  try {
    await AsyncStorage.setItem('authToken', mockToken)
    console.log(' Mock auth token set successfully')
    return true
  } catch (error) {
    console.error('❌ Error setting mock auth token:', error)
    return false
  }
}

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken')
    console.log(' Auth token cleared')
    return true
  } catch (error) {
    console.error('❌ Error clearing auth token:', error)
    return false
  }
}

export const checkAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken')
    console.log('🔑 Current auth token:', token ? 'Present' : 'Not found')
    return token
  } catch (error) {
    console.error('❌ Error checking auth token:', error)
    return null
  }
}
