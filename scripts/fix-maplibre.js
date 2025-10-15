#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing MapLibre issues...');

try {
  // Clear Expo cache
  console.log('📦 Clearing Expo cache...');
  execSync('npx expo start --clear', { stdio: 'inherit' });
  
  // Clear node_modules and reinstall
  console.log('🗑️ Clearing node_modules...');
  if (fs.existsSync('node_modules')) {
    execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
  }
  
  console.log('📥 Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Clear Metro cache
  console.log('🚇 Clearing Metro cache...');
  execSync('npx expo start --clear', { stdio: 'inherit' });
  
  console.log('✅ MapLibre fix completed!');
  console.log('🚀 You can now run: npx expo start');
  
} catch (error) {
  console.error('❌ Error during fix:', error.message);
  process.exit(1);
}
