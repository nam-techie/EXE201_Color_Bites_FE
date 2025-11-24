import { OPENROUTE_API_KEY } from '@/constants'

export function validateEnvironment(): { isValid: boolean; errors: string[] } {
   const errors: string[] = []

   if (!OPENROUTE_API_KEY || OPENROUTE_API_KEY === '') {
      errors.push('EXPO_PUBLIC_OPENROUTE_API_KEY is not configured')
   }

   return {
      isValid: errors.length === 0,
      errors,
   }
}

export function validateCoordinates(lat: number, lon: number): boolean {
   return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}

export function validateRouteProfile(profile: string): boolean {
   const validProfiles = ['driving-car', 'driving-hgv', 'cycling-regular', 'foot-walking']
   return validProfiles.includes(profile)
}
