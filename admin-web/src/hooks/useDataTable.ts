import { useCallback, useEffect, useState, useMemo } from 'react'
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
  
  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce((searchValue: string) => {
    setFilters(prev => ({ ...prev, search: searchValue }))
  }, 300)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchData(pagination.current, pagination.pageSize, filters)
      
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
  }, [fetchData, pagination.current, pagination.pageSize, filters])

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
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, current: 1 }))
  }, [])

  // Memoized data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data])

  // Auto fetch data when dependencies change
  useEffect(() => {
    if (autoFetch) {
      loadData()
    }
  }, [loadData, autoFetch])

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
