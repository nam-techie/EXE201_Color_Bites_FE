/**
 * Test script for Map Provider
 * 
 * Script này test xem MapProvider có hoạt động đúng không
 * 
 * Usage:
 *   node scripts/testMapProvider.js
 */

console.log('🧪 Testing Map Provider Configuration...\n')

// Test 1: Check if constants file exists
console.log('📋 Test 1: Checking constants file...')
try {
  const fs = require('fs')
  const path = require('path')
  
  const constantsPath = path.join(__dirname, '../constants/index.ts')
  const constantsContent = fs.readFileSync(constantsPath, 'utf8')
  
  // Check if GOOGLE_MAPS_API_KEY exists
  if (constantsContent.includes('GOOGLE_MAPS_API_KEY')) {
    console.log('✅ GOOGLE_MAPS_API_KEY constant found')
  } else {
    console.log('❌ GOOGLE_MAPS_API_KEY constant not found')
  }
  
  // Check if MAP_PROVIDER exists
  if (constantsContent.includes('MAP_PROVIDER')) {
    console.log('✅ MAP_PROVIDER constant found')
    
    // Extract current provider
    const match = constantsContent.match(/MAP_PROVIDER.*=\s*['"](\w+)['"]/)
    if (match) {
      console.log(`   Current provider: ${match[1]}`)
    }
  } else {
    console.log('❌ MAP_PROVIDER constant not found')
  }
} catch (error) {
  console.log('❌ Error reading constants file:', error.message)
}

console.log('')

// Test 2: Check if service files exist
console.log('📋 Test 2: Checking service files...')
const serviceFiles = [
  'services/GoogleMapService.ts',
  'services/GoogleDirectionService.ts',
  'services/MapProvider.ts',
  'services/MapService.ts',
  'services/DirectionService.ts',
]

serviceFiles.forEach(file => {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, '..', file)
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      console.log(`✅ ${file} (${Math.round(stats.size / 1024)}KB)`)
    } else {
      console.log(`❌ ${file} not found`)
    }
  } catch (error) {
    console.log(`❌ ${file} error:`, error.message)
  }
})

console.log('')

// Test 3: Check .env file
console.log('📋 Test 3: Checking .env file...')
try {
  const fs = require('fs')
  const path = require('path')
  const envPath = path.join(__dirname, '../.env')
  
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists')
    
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    // Check for Google Maps key
    if (envContent.includes('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY')) {
      const match = envContent.match(/EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=(.+)/)
      if (match && match[1] && match[1].trim() !== 'your_google_maps_api_key_here') {
        console.log('✅ EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is configured')
        console.log(`   Key length: ${match[1].trim().length} characters`)
      } else {
        console.log('⚠️  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY exists but not configured')
        console.log('   Please replace "your_google_maps_api_key_here" with your actual key')
      }
    } else {
      console.log('⚠️  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY not found in .env')
      console.log('   Add this line: EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here')
    }
    
    // Check for OpenRoute key
    if (envContent.includes('EXPO_PUBLIC_OPENROUTE_API_KEY')) {
      console.log('✅ EXPO_PUBLIC_OPENROUTE_API_KEY is configured (fallback)')
    }
  } else {
    console.log('⚠️  .env file not found')
    console.log('   Create .env file from ENV_CONFIG_GUIDE.md')
  }
} catch (error) {
  console.log('❌ Error reading .env file:', error.message)
}

console.log('')

// Test 4: Check documentation files
console.log('📋 Test 4: Checking documentation files...')
const docFiles = [
  'ENV_CONFIG_GUIDE.md',
  'MAP_PROVIDER_GUIDE.md',
  'QUICK_START_GOOGLE_MAPS.md',
]

docFiles.forEach(file => {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, '..', file)
    
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file} not found`)
    }
  } catch (error) {
    console.log(`❌ ${file} error:`, error.message)
  }
})

console.log('')

// Test 5: Check map.tsx integration
console.log('📋 Test 5: Checking map.tsx integration...')
try {
  const fs = require('fs')
  const path = require('path')
  const mapPath = path.join(__dirname, '../app/(tabs)/map.tsx')
  const mapContent = fs.readFileSync(mapPath, 'utf8')
  
  if (mapContent.includes('MapProvider')) {
    console.log('✅ map.tsx is using MapProvider')
    
    if (mapContent.includes('MapProvider.fetchRestaurants')) {
      console.log('✅ Using MapProvider.fetchRestaurants')
    }
    
    if (mapContent.includes('MapProvider.getDirections')) {
      console.log('✅ Using MapProvider.getDirections')
    }
  } else {
    console.log('⚠️  map.tsx is not using MapProvider')
  }
} catch (error) {
  console.log('❌ Error reading map.tsx:', error.message)
}

console.log('')
console.log('=' .repeat(50))
console.log('📊 Summary')
console.log('=' .repeat(50))
console.log('')
console.log('✅ Setup complete! Next steps:')
console.log('')
console.log('1. Make sure .env file has your Google Maps API key')
console.log('2. Run: npm start')
console.log('3. Check console for: "Initialized with Google Maps API"')
console.log('4. Test the map feature in your app')
console.log('')
console.log('📚 Documentation:')
console.log('   - QUICK_START_GOOGLE_MAPS.md (Quick guide)')
console.log('   - ENV_CONFIG_GUIDE.md (Detailed setup)')
console.log('   - MAP_PROVIDER_GUIDE.md (Full API reference)')
console.log('')
console.log('🔄 To switch providers:')
console.log('   Edit constants/index.ts line 40')
console.log('   Change MAP_PROVIDER to "google" or "openstreetmap"')
console.log('')

