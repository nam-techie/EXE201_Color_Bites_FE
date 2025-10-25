// Cache utilities for API responses
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  // Set cache item
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  // Check if cache exists and is valid
  has(key: string): boolean {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Delete cache item
  delete(key: string): void {
    this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Clear expired items
  clearExpired(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache size
  size(): number {
    return this.cache.size
  }

  // Get cache keys
  keys(): string[] {
    return Array.from(this.cache.keys())
  }
}

// Export singleton instance
export const cacheManager = new CacheManager()

// Cache key generators
export const generateCacheKey = (prefix: string, params: Record<string, any> = {}): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return sortedParams ? `${prefix}?${sortedParams}` : prefix
}

// Cache decorator for API functions
export const withCache = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  ttl?: number
) => {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args)
    
    // Check cache first
    const cached = cacheManager.get<R>(key)
    if (cached !== null) {
      console.log(`📦 Cache hit for key: ${key}`)
      return cached
    }

    // Fetch data and cache it
    console.log(`📡 Cache miss for key: ${key}, fetching...`)
    const data = await fn(...args)
    cacheManager.set(key, data, ttl)
    
    return data
  }
}

// Cache TTL constants
export const CACHE_TTL = {
  SHORT: 1 * 60 * 1000,      // 1 minute
  MEDIUM: 5 * 60 * 1000,     // 5 minutes
  LONG: 15 * 60 * 1000,      // 15 minutes
  VERY_LONG: 60 * 60 * 1000  // 1 hour
} as const
