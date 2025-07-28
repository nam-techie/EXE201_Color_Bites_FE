import { LocationPoint } from '@/type/location'

// Tính khoảng cách giữa 2 điểm bằng công thức Haversine
export function calculateDistance(point1: LocationPoint, point2: LocationPoint): number {
   const R = 6371 // Bán kính Trái Đất (km)
   const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180
   const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.latitude * Math.PI) / 180) *
         Math.cos((point2.latitude * Math.PI) / 180) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2)
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
   return R * c * 1000 // Trả về đơn vị mét
}

// Định dạng khoảng cách
export function formatDistance(meters: number): string {
   if (meters < 1000) {
      return `${Math.round(meters)}m`
   }
   return `${(meters / 1000).toFixed(1)}km`
}

// Định dạng thời gian (dạng tiếng Việt: 2g11p)
export function formatDuration(durationInSeconds: number): string {
   const totalMinutes = Math.round(durationInSeconds / 60)
   const hours = Math.floor(totalMinutes / 60)
   const minutes = totalMinutes % 60

   if (hours > 0) {
      return `${hours}g${minutes}p`
   }
   return `${minutes}p`
}
