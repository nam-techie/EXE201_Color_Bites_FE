export const formatNumber = (num: number): string => {
   if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
   }
   if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
   }
   return num.toString()
}

export const formatTimeAgo = (date: string): string => {
   const now = new Date()
   const postDate = new Date(date)
   const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)

   if (diffInSeconds < 60) {
      return 'just now'
   }

   const diffInMinutes = Math.floor(diffInSeconds / 60)
   if (diffInMinutes < 60) {
      return `${diffInMinutes}m`
   }

   const diffInHours = Math.floor(diffInMinutes / 60)
   if (diffInHours < 24) {
      return `${diffInHours}h`
   }

   const diffInDays = Math.floor(diffInHours / 24)
   if (diffInDays < 7) {
      return `${diffInDays}d`
   }

   const diffInWeeks = Math.floor(diffInDays / 7)
   if (diffInWeeks < 4) {
      return `${diffInWeeks}w`
   }

   return postDate.toLocaleDateString()
}

export const validateEmail = (email: string): boolean => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
   return password.length >= 6
}

export const truncateText = (text: string, maxLength: number): string => {
   if (text.length <= maxLength) return text
   return text.substring(0, maxLength) + '...'
}

export const generateId = (): string => {
   return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
