import { useCallback, useEffect, useMemo, useState } from 'react'

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
    try {
      // Nếu là refresh và có data cũ, chỉ set isRefreshing
      if (isRefresh && preserveDataOnRefresh && data.length > 0) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      const result = await fetchData(pagination.current, pagination.pageSize, filters)
      
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
