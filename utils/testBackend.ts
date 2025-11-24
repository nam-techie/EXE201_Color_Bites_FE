import { API_BASE_URL } from '@/constants'

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...')
    console.log('Backend URL:', API_BASE_URL)
    
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/actuator/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Health check status:', response.status)
    
    if (response.ok) {
      const data = await response.text()
      console.log('✅ Backend is running:', data)
      return true
    } else {
      console.log('⚠️ Backend health check failed, but server might be running')
      return false
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error)
    
    // Test if server is reachable at all
    try {
      const basicTest = await fetch(API_BASE_URL, {
        method: 'GET',
        timeout: 5000,
      })
      console.log('Basic connection test status:', basicTest.status)
    } catch (basicError) {
      console.error('❌ Server completely unreachable:', basicError)
    }
    
    return false
  }
}

export const testCreatePostEndpoint = async () => {
  try {
    console.log('🔍 Testing create post endpoint...')
    
    // Test with invalid data to see if endpoint exists
    const response = await fetch(`${API_BASE_URL}/api/posts/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty body to trigger validation error
    })
    
    console.log('Create post endpoint status:', response.status)
    const responseText = await response.text()
    console.log('Create post response:', responseText)
    
    return response.status !== 404 // Endpoint exists if not 404
  } catch (error) {
    console.error('❌ Create post endpoint test failed:', error)
    return false
  }
}
