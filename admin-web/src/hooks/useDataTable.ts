import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { useDebounce } from '../utils/debounce'

export interface UseDataTableOptions<T> {
  fetchData: (page: number, size: number, filters?: any) => Promise<{
    data: T[]
    total: number
    page: number
    size: number
  }>
  initialPage?: number
  initialSize?: number
  initialFilters?: any
  autoFetch?: boolean
}

export interface UseDataTableReturn<T> {
  data: T[]
  loading: boolean
  error: string | null
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  filters: any
  refresh: () => Promise<void>
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilters: (filters: any) => void
  setData: (data: T[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Helper function to deep compare objects
const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  
  return true
}

export const useDataTable = <T>({
  fetchData,
  initialPage = 1,
  initialSize = 20,
  initialFilters = {},
  autoFetch = true
}: UseDataTableOptions<T>): UseDataTableReturn<T> => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialSize,
    total: 0
  })
  const [filters, setFilters] = useState(initialFilters)
  
  // Use ref to store fetchData to prevent unnecessary re-renders
  const fetchDataRef = useRef(fetchData)
  useEffect(() => {
    fetchDataRef.current = fetchData
  }, [fetchData])
  
  // Use refs to store current values to avoid closure issues
  const filtersRef = useRef(filters)
  const paginationRef = useRef(pagination)
  
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])
  
  useEffect(() => {
    paginationRef.current = pagination
  }, [pagination])
  
  // Use ref to track previous filters to prevent unnecessary fetches
  const prevFiltersRef = useRef<any>(null)
  const prevPaginationRef = useRef({ current: initialPage, pageSize: initialSize })
  
  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce((searchValue: string) => {
    setFilters(prev => ({ ...prev, search: searchValue }))
  }, 300)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use refs to get current values instead of closure
      const currentPagination = paginationRef.current
      const currentFilters = filtersRef.current
      
      const result = await fetchDataRef.current(
        currentPagination.current, 
        currentPagination.pageSize, 
        currentFilters
      )
      
      setData(result.data)
      setPagination(prev => ({
        ...prev,
        total: result.total,
        current: result.page,
        pageSize: result.size
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu'
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }, []) // No dependencies - uses refs instead

  const refresh = useCallback(async () => {
    await loadData()
  }, [loadData])

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, current: page }))
  }, [])

  const setPageSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, current: 1 }))
  }, [])

  const setFiltersAndReset = useCallback((newFilters: any) => {
    // Only update if filters actually changed
    if (!deepEqual(filters, newFilters)) {
      setFilters(newFilters)
      setPagination(prev => ({ ...prev, current: 1 }))
    }
  }, [filters])

  // Memoized data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data])

  // Auto fetch data when dependencies change, but only if they actually changed
  useEffect(() => {
    if (!autoFetch) return
    
    const paginationChanged = 
      prevPaginationRef.current.current !== pagination.current ||
      prevPaginationRef.current.pageSize !== pagination.pageSize
    
    const filtersChanged = !deepEqual(prevFiltersRef.current, filters)
    
    if (paginationChanged || filtersChanged) {
      prevPaginationRef.current = { ...pagination }
      prevFiltersRef.current = filters
      loadData()
    }
  }, [pagination.current, pagination.pageSize, filters, autoFetch, loadData])

  // Initial fetch on mount
  useEffect(() => {
    if (autoFetch) {
      prevPaginationRef.current = { ...pagination }
      prevFiltersRef.current = filters
      loadData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  return {
    data: memoizedData,
    loading,
    error,
    pagination,
    filters,
    refresh,
    setPage,
    setPageSize,
    setFilters: setFiltersAndReset,
    setData,
    setLoading,
    setError
  }
}
