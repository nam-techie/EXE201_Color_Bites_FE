import { DEFAULT_SEARCH_RADIUS } from '@/constants'
import type { Restaurant } from '@/type/location'

export async function fetchRestaurantsNearby(
   latitude: number,
   longitude: number,
   radius: number = DEFAULT_SEARCH_RADIUS,
): Promise<Restaurant[]> {
   const query = `
    [out:json][timeout:25];
    node["amenity"="restaurant"](around:${radius}, ${latitude}, ${longitude});
    out body;
  `

   const url = 'https://overpass-api.de/api/interpreter'

   try {
      const response = await fetch(url, {
         method: 'POST',
         body: query,
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
      })

      if (!response.ok) {
         throw new Error(`Overpass API error: ${response.status}`)
      }

      const data = await response.json()

      return data.elements.map((item: any) => ({
         id: item.id,
         name: item.tags?.name || 'Không rõ tên',
         lat: item.lat,
         lon: item.lon,
         tags: item.tags || {},
      }))
   } catch (error) {
      console.error('Lỗi khi gọi API Overpass:', error)
      return []
   }
}
export function getCuisineIcon(cuisine: string): { name: string; color: string } {
   const cuisineMap: { [key: string]: { name: string; color: string } } = {
      // Asian cuisines
      vietnamese: { name: 'noodles', color: '#22C55E' }, // fallback: rice-based
      chinese: { name: 'food-fork-drink', color: '#A855F7' },
      japanese: { name: 'fish', color: '#3B82F6' },
      korean: { name: 'noodles', color: '#EA580C' },
      thai: { name: 'chili-mild', color: '#F97316' },
      indian: { name: 'food-variant', color: '#F59E0B' },

      // Western cuisines
      italian: { name: 'pasta', color: '#EF4444' },
      french: { name: 'bread-slice', color: '#E879F9' },
      american: { name: 'hamburger', color: '#F43F5E' },
      mexican: { name: 'taco', color: '#10B981' },
      spanish: { name: 'paella', color: '#0EA5E9' }, // fallback custom

      // Other cuisines
      pizza: { name: 'pizza', color: '#F87171' },
      burger: { name: 'hamburger', color: '#FB923C' },
      seafood: { name: 'fish', color: '#38BDF8' },
      bbq: { name: 'grill', color: '#DC2626' },
      vegetarian: { name: 'leaf', color: '#4ADE80' },
      vegan: { name: 'leaf', color: '#22C55E' },
      coffee: { name: 'coffee', color: '#A16207' },
      bakery: { name: 'bread-slice', color: '#FCD34D' },
      ice_cream: { name: 'ice-cream', color: '#F472B6' },
      western: { name: 'silverware-fork-knife', color: '#9CA3AF' },

      // Default
      default: { name: 'silverware-fork-knife', color: '#6B7280' },
   }

   const normalizedCuisine = cuisine.toLowerCase().replace(/[^a-z]/g, '')
   return cuisineMap[normalizedCuisine] || cuisineMap.default
}


export function formatOpeningHours(hours: string): string {
   if (!hours) return 'Không rõ giờ mở cửa'

   // Simple formatting for Vietnamese
   return hours
      .replace(/Mo-Su/g, 'Thứ 2 - Chủ nhật')
      .replace(/Mo-Fr/g, 'Thứ 2 - Thứ 6')
      .replace(/Sa-Su/g, 'Thứ 7 - Chủ nhật')
      .replace(/Mo/g, 'T2')
      .replace(/Tu/g, 'T3')
      .replace(/We/g, 'T4')
      .replace(/Th/g, 'T5')
      .replace(/Fr/g, 'T6')
      .replace(/Sa/g, 'T7')
      .replace(/Su/g, 'CN')
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
   const R = 6371 // Earth's radius in kilometers
   const dLat = (lat2 - lat1) * (Math.PI / 180)
   const dLon = (lon2 - lon1) * (Math.PI / 180)
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
   return R * c
}

// Check if restaurant is currently open
export function isRestaurantOpen(openingHours: string): boolean {
   if (!openingHours) return false

   const now = new Date()
   const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
   const currentTime = now.getHours() * 100 + now.getMinutes() // HHMM format

   // Simple parsing for common formats like "Mo-Su 08:00-22:00"
   const timeMatch = openingHours.match(/(\d{2}):(\d{2})-(\d{2}):(\d{2})/)
   if (!timeMatch) return false

   const openTime = Number.parseInt(timeMatch[1]) * 100 + Number.parseInt(timeMatch[2])
   const closeTime = Number.parseInt(timeMatch[3]) * 100 + Number.parseInt(timeMatch[4])

   return currentTime >= openTime && currentTime <= closeTime
}

// Get restaurant rating from tags (if available)
export function getRestaurantRating(tags: any): number | null {
   const rating = tags['stars'] || tags['rating'] || tags['review:rating']
   return rating ? Number.parseFloat(rating) : null
}

// Get price range indicator
export function getPriceRange(tags: any): string {
   const priceLevel = tags['price'] || tags['price:range']

   if (!priceLevel) return ''

   const priceMap: { [key: string]: string } = {
      cheap: '$',
      moderate: '$$',
      expensive: '$$$',
      very_expensive: '$$$$',
      '1': '$',
      '2': '$$',
      '3': '$$$',
      '4': '$$$$',
   }

   return priceMap[priceLevel.toLowerCase()] || ''
}
