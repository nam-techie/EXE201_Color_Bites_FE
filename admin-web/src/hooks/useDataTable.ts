import { useCallback, useEffect, useMemo, useState, useRef } from 'react'

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
  preserveDataOnRefresh?: boolean // Giữ data cũ khi refresh
}

export interface UseDataTableReturn<T> {
  data: T[]
  loading: boolean
  isRefreshing: boolean // Trạng thái refresh riêng biệt
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
  preserveDataOnRefresh = true // Mặc định giữ data cũ
}: UseDataTableOptions<T>): UseDataTableReturn<T> => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false) // Trạng thái refresh riêng
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialSize,
    total: 0
  })
  const [filters, setFilters] = useState(initialFilters)

  const loadData = useCallback(async (isRefresh = false) => {
  
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
      // Nếu là refresh và có data cũ, chỉ set isRefreshing
      if (isRefresh && preserveDataOnRefresh && data.length > 0) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      // Use refs to get current values instead of closure
      const currentPagination = paginationRef.current
      const currentFilters = filtersRef.current
      
      const result = await fetchDataRef.current(
        currentPagination.current, 
        currentPagination.pageSize, 
        currentFilters
      )
      
      // So sánh data cũ vs mới để quyết định có update không
      const hasDataChanged = JSON.stringify(data) !== JSON.stringify(result.data)
      
      if (hasDataChanged || !preserveDataOnRefresh) {
        setData(result.data)
      }
      
      setPagination(prev => ({
        ...prev,
        total: result.total,
        current: result.page,
        pageSize: result.size
      }))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu'
      setError(errorMessage)
      // Chỉ xóa data nếu không preserve data
      if (!preserveDataOnRefresh) {
        setData([])
      }
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, filters, preserveDataOnRefresh])
  }, []) // No dependencies - uses refs instead

  const refresh = useCallback(async () => {
    await loadData(true) // Truyền isRefresh = true
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

  // Load data once on mount
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
    // Load data once when component mounts
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const result = await fetchData(initialPage, initialSize, initialFilters)
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
    }
    
    loadInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only load once on mount
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
    isRefreshing,
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
