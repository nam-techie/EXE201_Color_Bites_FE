/**
 * Script để clear auth data trong development
 * Chạy: node scripts/clearAuth.js
 */

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function clearAuthData() {
  try {
    console.log('🧹 Clearing auth data...');
    
    // Clear auth tokens
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    
    console.log(' Auth data cleared successfully');
    console.log('📱 Restart the app to see changes');
    
  } catch (error) {
    console.error('❌ Error clearing auth data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  clearAuthData();
}

module.exports = { clearAuthData };
