#!/usr/bin/env node

/**
 * Test script để kiểm tra Goong API keys từ app.json
 * Chạy: node scripts/testAppJsonKeys.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 [TEST] Kiểm tra Goong API keys từ app.json...\n');

// Đọc app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');
try {
  const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
  const appJson = JSON.parse(appJsonContent);
  
  console.log('📄 [TEST] Đọc app.json thành công');
  console.log('📄 [TEST] Cấu trúc extra:', JSON.stringify(appJson.expo?.extra, null, 2));
  
  // Kiểm tra Goong keys
  const extra = appJson.expo?.extra;
  const goongApiKey = extra?.GOONG_API_KEY;
  const goongMapTilesKey = extra?.GOONG_MAPTILES_KEY;
  
  console.log('\n🔑 [TEST] Goong API Key:');
  console.log('  - Có key:', goongApiKey ? '✅' : '❌');
  console.log('  - Key value:', goongApiKey ? `${goongApiKey.substring(0, 8)}...` : 'undefined');
  
  console.log('\n🗺️ [TEST] Goong Map Tiles Key:');
  console.log('  - Có key:', goongMapTilesKey ? '✅' : '❌');
  console.log('  - Key value:', goongMapTilesKey ? `${goongMapTilesKey.substring(0, 8)}...` : 'undefined');
  
  // Kiểm tra API_BASE_URL
  const apiBaseUrl = extra?.API_BASE_URL;
  console.log('\n🌐 [TEST] API Base URL:');
  console.log('  - Có URL:', apiBaseUrl ? '✅' : '❌');
  console.log('  - URL value:', apiBaseUrl || 'undefined');
  
  // Tổng kết
  const allConfigured = goongApiKey && goongMapTilesKey && apiBaseUrl;
  console.log('\n📊 [TEST] Tổng kết:');
  console.log('  - Tất cả keys được cấu hình:', allConfigured ? '✅' : '❌');
  
  if (allConfigured) {
    console.log('\n🎉 [TEST] THÀNH CÔNG! Tất cả keys đã được cấu hình trong app.json');
    console.log('💡 [TEST] Bây giờ bạn có thể chạy app và kiểm tra console logs');
  } else {
    console.log('\n⚠️ [TEST] THIẾU CẤU HÌNH! Một số keys chưa được cấu hình');
    console.log('💡 [TEST] Hãy kiểm tra lại app.json');
  }
  
} catch (error) {
  console.error('❌ [TEST] Lỗi khi đọc app.json:', error.message);
  process.exit(1);
}
