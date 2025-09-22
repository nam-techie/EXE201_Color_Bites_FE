/**
 * Default images for fallback when user avatar or other images fail to load
 */

// Default avatar using a reliable placeholder service
export const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff&size=96&rounded=true'

// Alternative avatars for variety
export const DEFAULT_AVATARS = [
  'https://ui-avatars.com/api/?name=U&background=F97316&color=fff&size=96&rounded=true',
  'https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff&size=96&rounded=true',
  'https://ui-avatars.com/api/?name=User&background=10B981&color=fff&size=96&rounded=true',
  'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff&size=96&rounded=true',
  'https://ui-avatars.com/api/?name=User&background=F59E0B&color=fff&size=96&rounded=true',
]

// Function to get default avatar by user name or email
export function getDefaultAvatar(name?: string, email?: string): string {
  if (name) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=F97316&color=fff&size=96&rounded=true`
  }
  
  if (email) {
    const initial = email[0].toUpperCase()
    return `https://ui-avatars.com/api/?name=${initial}&background=F97316&color=fff&size=96&rounded=true`
  }
  
  return DEFAULT_AVATAR
}

// Default post image when image fails to load
export const DEFAULT_POST_IMAGE = 'https://via.placeholder.com/400x300/F3F4F6/9CA3AF?text=Image+Not+Available'
