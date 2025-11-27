import { useCallback, useEffect, useMemo, useState } from 'react'
import statisticsApi from '../services/statisticsApi'
import type { ApiResponse } from '../types/user'

export type DashboardPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface DashboardFilters {
  period: DashboardPeriod
  dateRange?: {
    start: string
    end: string
  }
}

export interface DashboardKpi {
  key: string
  title: string
  value: number
  extra?: {
    label: string
    value: number
  }
}

export interface DashboardTopItem {
  id: string
  name: string
  value: number
  meta?: Record<string, any>
}

export interface DashboardData {
  loading: boolean
  error: string | null
  kpis: DashboardKpi[]
  contentDistribution: Array<{ name: string; value: number; color?: string }>
  userStatus: Array<{ name: string; value: number; color?: string }>
  userPostGrowth: Array<{ month: string; users: number; posts: number }>
  revenueSeries: Array<{ label: string; revenue: number }>
  topPosts: DashboardTopItem[]
  topRestaurants: DashboardTopItem[]
  topUsers: DashboardTopItem[]
  refetch: () => Promise<void>
}

function toSafeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function useDashboardStats(filters: DashboardFilters): DashboardData {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [system, setSystem] = useState<any>(null)
  const [users, setUsers] = useState<any>(null)
  const [posts, setPosts] = useState<any>(null)
  const [restaurants, setRestaurants] = useState<any>(null)
  const [revenue, setRevenue] = useState<any>(null)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        period: filters.period,
        startDate: filters.dateRange?.start,
        endDate: filters.dateRange?.end
      }

      const [
        sysRes,
        userRes,
        postRes,
        restRes,
        revRes
      ] = await Promise.all([
        statisticsApi.getSystemStatistics(params) as Promise<ApiResponse<any>>,
        statisticsApi.getUserStatistics(params) as Promise<ApiResponse<any>>,
        statisticsApi.getPostStatistics(params) as Promise<ApiResponse<any>>,
        statisticsApi.getRestaurantStatistics(params) as Promise<ApiResponse<any>>,
        statisticsApi.getRevenueStatistics(params) as Promise<ApiResponse<any>>
      ])

      setSystem(sysRes.data)
      setUsers(userRes.data)
      setPosts(postRes.data)
      setRestaurants(restRes.data)
      setRevenue(revRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thống kê')
    } finally {
      setLoading(false)
    }
  }, [filters.period, filters.dateRange?.start, filters.dateRange?.end])

  useEffect(() => {
    fetchAll()
  }, [fetchAll, filters.period, filters.dateRange?.start, filters.dateRange?.end])

  const kpis: DashboardKpi[] = useMemo(() => {
    if (!system || !users || !restaurants) return []
    const totalUsers = toSafeNumber(system.totalUsers)
    const activeUsers = toSafeNumber(system.activeUsers ?? users.activeUsers)
    const totalPosts = toSafeNumber(system.totalPosts ?? posts?.totalPosts)
    const totalRestaurants = toSafeNumber(system.totalRestaurants ?? restaurants?.totalRestaurants)
    const totalTransactions = toSafeNumber(system.totalTransactions ?? revenue?.totalTransactions)
    const monthlyRevenue = toSafeNumber(system.monthlyRevenue ?? revenue?.monthlyRevenue)
    return [
      {
        key: 'users',
        title: 'Tổng người dùng',
        value: totalUsers,
        extra: { label: 'Hoạt động', value: activeUsers }
      },
      {
        key: 'posts',
        title: 'Tổng bài viết',
        value: totalPosts
      },
      {
        key: 'restaurants',
        title: 'Tổng nhà hàng',
        value: totalRestaurants
      },
      {
        key: 'transactions',
        title: 'Tổng giao dịch',
        value: totalTransactions
      },
      {
        key: 'revenue-month',
        title: 'Doanh thu tháng',
        value: monthlyRevenue
      }
    ]
  }, [system, users, posts, restaurants, revenue])

  const contentDistribution = useMemo(() => {
    if (!system) return []
    return [
      { name: 'Bài viết', value: toSafeNumber(system.totalPosts), color: '#1890ff' },
      { name: 'Nhà hàng', value: toSafeNumber(system.totalRestaurants), color: '#52c41a' },
      { name: 'Giao dịch', value: toSafeNumber(system.totalTransactions), color: '#faad14' }
    ]
  }, [system])

  const userStatus = useMemo(() => {
    if (!users && !system) return []
    const active = toSafeNumber(users?.activeUsers ?? system?.activeUsers)
    const blocked = toSafeNumber(users?.blockedUsers)
    return [
      { name: 'Hoạt động', value: active, color: '#52c41a' },
      { name: 'Bị chặn', value: blocked, color: '#ff4d4f' }
    ]
  }, [users, system])

  const userPostGrowth = useMemo(() => {
    const series = posts?.userGrowthData || system?.userGrowthData
    if (Array.isArray(series) && series.length) {
      return series.map((d: any, idx: number) => ({
        month: d.month ?? d.label ?? `P${idx + 1}`,
        users: toSafeNumber(d.users ?? d.userCount),
        posts: toSafeNumber(d.posts ?? d.postCount)
      }))
    }
    return []
  }, [posts, system])

  const revenueSeries = useMemo(() => {
    const series = revenue?.revenueData || system?.revenueData
    if (Array.isArray(series) && series.length) {
      return series.map((d: any, idx: number) => ({
        label: d.month ?? d.label ?? `P${idx + 1}`,
        revenue: toSafeNumber(d.amount ?? d.revenue)
      }))
    }
    return []
  }, [revenue, system])

  const topPosts = useMemo<DashboardTopItem[]>(() => {
    const list = system?.topPosts || []
    return Array.isArray(list)
      ? list.slice(0, 5).map((it: any) => ({
        id: String(it.id ?? it.postId ?? it.slug ?? it.name),
        name: it.title ?? it.name ?? `#${it.id}`,
        value: toSafeNumber(it.score ?? it.views ?? it.reactions ?? it.count)
      }))
      : []
  }, [system])

  const topRestaurants = useMemo<DashboardTopItem[]>(() => {
    const list = system?.topRestaurants || []
    return Array.isArray(list)
      ? list.slice(0, 5).map((it: any) => ({
        id: String(it.id ?? it.restaurantId ?? it.slug ?? it.name),
        name: it.name ?? `#${it.id}`,
        value: toSafeNumber(it.rating ?? it.score ?? it.count)
      }))
      : []
  }, [system])

  const topUsers = useMemo<DashboardTopItem[]>(() => {
    const list = system?.topUsers || []
    return Array.isArray(list)
      ? list.slice(0, 5).map((it: any) => ({
        id: String(it.id ?? it.userId ?? it.username),
        name: it.username ?? it.name ?? `#${it.id}`,
        value: toSafeNumber(it.activityScore ?? it.count)
      }))
      : []
  }, [system])

  const refetch = useCallback(async () => {
    await fetchAll()
  }, [fetchAll])

  return {
    loading,
    error,
    kpis,
    contentDistribution,
    userStatus,
    userPostGrowth,
    revenueSeries,
    topPosts,
    topRestaurants,
    topUsers,
    refetch
  }
}

export default useDashboardStats


