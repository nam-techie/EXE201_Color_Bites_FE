import { GOONG_API_KEY, GOONG_MAPTILES_KEY } from '@/config/env'

export function validateEnvironment(): { isValid: boolean; errors: string[] } {
   const errors: string[] = []

   if (!GOONG_API_KEY || GOONG_API_KEY === '') {
      errors.push('EXPO_PUBLIC_GOONG_API_KEY is not configured')
   }

   if (!GOONG_MAPTILES_KEY || GOONG_MAPTILES_KEY === '') {
      errors.push('EXPO_PUBLIC_GOONG_MAPTILES_KEY is not configured')
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
