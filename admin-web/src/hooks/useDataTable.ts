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
  preserveDataOnRefresh?: boolean
}

export interface UseDataTableReturn<T> {
  data: T[]
  loading: boolean
  isRefreshing: boolean
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
  preserveDataOnRefresh = true
}: UseDataTableOptions<T>): UseDataTableReturn<T> => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current: initialPage,
    pageSize: initialSize,
    total: 0
  })
  const [filters, setFilters] = useState(initialFilters)

  const loadData = useCallback(
    async (refreshMode = false) => {
      try {
        if (refreshMode && preserveDataOnRefresh && data.length > 0) {
          setIsRefreshing(true)
        } else {
          setLoading(true)
        }
        setError(null)

        const result = await fetchData(
          pagination.current,
          pagination.pageSize,
          filters
        )

        setData(result.data)
        setPagination(prev => ({
          ...prev,
          total: result.total,
          current: result.page,
          pageSize: result.size
        }))
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu'
        setError(errorMessage)
        if (!preserveDataOnRefresh) {
          setData([])
        }
      } finally {
        setLoading(false)
        setIsRefreshing(false)
      }
    },
    [fetchData, filters, pagination.current, pagination.pageSize, preserveDataOnRefresh, data.length]
  )

  const refresh = useCallback(async () => {
    await loadData(true)
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

  const memoizedData = useMemo(() => data, [data])

  useEffect(() => {
    const run = async () => {
      await loadData(false)
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
