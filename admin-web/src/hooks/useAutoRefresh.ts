import { useCallback, useEffect, useRef } from 'react'

export interface UseAutoRefreshOptions {
  interval?: number
  enabled?: boolean
  onRefresh: () => void | Promise<void>
  onError?: (error: Error) => void
}

export interface UseAutoRefreshReturn {
  start: () => void
  stop: () => void
  isRunning: boolean
  refresh: () => Promise<void>
}

export const useAutoRefresh = ({
  interval = 30000, // 30 seconds default
  enabled = true,
  onRefresh,
  onError
}: UseAutoRefreshOptions): UseAutoRefreshReturn => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isRunningRef = useRef(false)
  const mountedRef = useRef(true)

  const refresh = useCallback(async () => {
    if (!mountedRef.current) return

    try {
      await onRefresh()
    } catch (error) {
      console.error('Auto refresh error:', error)
      onError?.(error as Error)
    }
  }, [onRefresh, onError])

  const start = useCallback(() => {
    if (isRunningRef.current) return

    isRunningRef.current = true
    intervalRef.current = setInterval(refresh, interval)
  }, [refresh, interval])

  const stop = useCallback(() => {
    if (!isRunningRef.current) return

    isRunningRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Start auto refresh when enabled
  useEffect(() => {
    if (enabled) {
      start()
    } else {
      stop()
    }

    return () => {
      stop()
    }
  }, [enabled, start, stop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      stop()
    }
  }, [stop])

  return {
    start,
    stop,
    isRunning: isRunningRef.current,
    refresh
  }
}
